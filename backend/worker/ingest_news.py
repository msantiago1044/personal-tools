#!/usr/bin/env python3
"""
Worker de Ingesta y Clasificación en Tiempo Real: Noticias & Papers
Captura feeds RSS de Colombia, Mundo, Medio Ambiente y Papers de arXiv,
los agrupa en clusters temáticos con sesgo editorial (left, center, right),
y los publica automáticamente en Supabase.
"""

import sys
import os
import time
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
import re
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime

# Asegurar codificación UTF-8 en stdout/stderr para Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Carga automática de backend/.env si existe localmente
def load_env_file():
    candidates = [
        os.path.join(os.path.dirname(__file__), "..", ".env"),
        os.path.join(os.path.dirname(__file__), ".env"),
        os.path.join(os.getcwd(), "backend", ".env"),
        os.path.join(os.getcwd(), ".env"),
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k, v = k.strip(), v.strip().strip("'\"")
                            if k not in os.environ:
                                os.environ[k] = v
                break
            except Exception:
                pass

load_env_file()

# Configuración de Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://phczdxbtquxwfqnrakcz.supabase.co")

def get_supabase_key():
    for i, arg in enumerate(sys.argv):
        if arg == "--key" and i + 1 < len(sys.argv):
            return sys.argv[i + 1]
    return os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get(
        "VITE_SUPABASE_ANON_KEY", "sb_publishable_ThVP291edlMvGoeLw2182w_sb7hmslN"
    )

SUPABASE_KEY = get_supabase_key()

# Catálogo de fuentes y sesgo político asignado
FEEDS = [
    {
        "source_id": "elespectador",
        "url": "https://www.elespectador.com/arc/outboundfeeds/rss/",
        "category": "colombia",
        "bias": "left",
        "type": "rss",
    },
    {
        "source_id": "eltiempo",
        "url": "https://www.eltiempo.com/rss/colombia.xml",
        "category": "colombia",
        "bias": "center",
        "type": "rss",
    },
    {
        "source_id": "elcolombiano",
        "url": "https://www.elcolombiano.com/rss/colombia.xml",
        "category": "colombia",
        "bias": "right",
        "type": "rss",
    },
    {
        "source_id": "reuters",
        "url": "https://feeds.bbci.co.uk/mundo/rss.xml",
        "category": "world",
        "bias": "neutral",
        "type": "rss",
    },
    {
        "source_id": "mongabay",
        "url": "https://es.mongabay.com/feed/",
        "category": "environment",
        "bias": "neutral",
        "type": "rss",
    },
]

ARXIV_FEED_URL = (
    "https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=6"
)

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PersonalTools/1.0"

STOP_WORDS = {
    "sobre", "entre", "desde", "hasta", "contra", "hacia", "durante", "mediante",
    "para", "como", "pero", "donde", "cuando", "quien", "porque", "todos", "todas",
    "colombia", "bogota", "medellin", "noticias", "video", "minutos", "horas",
    "gobierno", "presidente", "despues", "primero", "segundo", "nuevo", "nueva",
    "estos", "estas", "este", "esta", "ellos", "ellas", "haber", "tener", "hacer",
    "decir", "segun", "luego", "antes", "mientras", "tambien", "ademas", "tras",
    "pais", "anos", "millones", "caso", "parte", "forma", "punto"
}

SPECIFIC_TOPICS = {
    "reforma", "salud", "pensiones", "tributaria", "fiscalia", "corte", "congreso",
    "senado", "elecciones", "petro", "uribe", "ecopetrol", "inflacion", "dolar",
    "seguridad", "eln", "disidencias", "violencia", "energia", "tarifas", "justicia"
}


def fetch_url(url: str, timeout: int = 15) -> str:
    """Realiza una petición HTTP GET con cabecera User-Agent legítima."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="replace")


def clean_html(raw_html: str) -> str:
    """Elimina etiquetas HTML y espacios redundantes."""
    cleanr = re.compile(r"<.*?>")
    cleantext = re.sub(cleanr, "", raw_html or "")
    return " ".join(cleantext.split())


def parse_pub_date(pub_date_str: str) -> str:
    """Convierte cadenas de fecha (ISO o RFC 2822) a formato ISO UTC estándar."""
    if not pub_date_str:
        return datetime.now(timezone.utc).isoformat()
    # 1. Intentar formato ISO (ej: 2026-10-25T06:31:41-05:00)
    try:
        clean_str = pub_date_str.strip().replace("Z", "+00:00")
        dt = datetime.fromisoformat(clean_str)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except Exception:
        pass
    # 2. Intentar formato RFC 2822 (ej: Sun, 25 Oct 2026 06:31:41 GMT)
    try:
        dt = parsedate_to_datetime(pub_date_str)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except Exception:
        pass
    return datetime.now(timezone.utc).isoformat()


def extract_keywords(text: str) -> set:
    """Extrae palabras clave representativas omitiendo stop words."""
    words = re.findall(r"\b[a-záéíóúñ]{4,}\b", (text or "").lower())
    return {w for w in words if w not in STOP_WORDS}


def parse_rss_feed(feed_config: dict) -> list:
    """Descarga y parsea un feed RSS estándar extrayendo fecha e imagen."""
    articles = []
    source_id = feed_config["source_id"]
    category = feed_config["category"]
    bias = feed_config["bias"]

    try:
        xml_content = fetch_url(feed_config["url"])
        root = ET.fromstring(xml_content)

        items = root.findall(".//item")
        for item in items[:12]:
            title_elem = item.find("title")
            link_elem = item.find("link")
            desc_elem = item.find("description")
            pub_elem = item.find("pubDate")
            if pub_elem is None:
                pub_elem = item.find("{http://purl.org/dc/elements/1.1/}date")

            title = clean_html(title_elem.text if title_elem is not None else "")
            link = (link_elem.text or "").strip() if link_elem is not None else ""
            desc = clean_html(desc_elem.text if desc_elem is not None else "")
            pub_str = (pub_elem.text or "").strip() if pub_elem is not None else ""

            if not title or not link:
                continue

            # Extraer imagen del item si está disponible
            image_url = None
            enclosure = item.find("enclosure")
            if enclosure is not None and "image" in enclosure.attrib.get("type", ""):
                image_url = enclosure.attrib.get("url")
            if not image_url:
                media = item.find("{http://search.yahoo.com/mrss/}content")
                if media is not None and media.attrib.get("url"):
                    image_url = media.attrib.get("url")

            # Generar tags a partir de palabras del titular
            words = [w.capitalize() for w in re.findall(r"\b[a-zA-ZáéíóúÁÉÍÓÚñÑ]{5,}\b", title)]
            tags = list(dict.fromkeys(words))[:4]

            articles.append({
                "source_id": source_id,
                "title": title,
                "summary": desc[:350] if desc else title,
                "url": link,
                "image_url": image_url,
                "category": category,
                "bias": bias,
                "tags": tags,
                "cluster_id": None,
                "paper_metadata": None,
                "published_at": parse_pub_date(pub_str),
            })
    except Exception as e:
        print(f"⚠️ Error obteniendo feed {source_id}: {e}", file=sys.stderr)

    return articles


def fetch_arxiv_papers() -> list:
    """Descarga y parsea los papers científicos más recientes de arXiv cs.AI."""
    papers = []
    try:
        xml_content = fetch_url(ARXIV_FEED_URL)
        ns = {"atom": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}
        root = ET.fromstring(xml_content)

        for entry in root.findall("atom:entry", ns)[:6]:
            title_elem = entry.find("atom:title", ns)
            summary_elem = entry.find("atom:summary", ns)
            id_elem = entry.find("atom:id", ns)
            published_elem = entry.find("atom:published", ns)

            title = clean_html(title_elem.text if title_elem is not None else "")
            summary = clean_html(summary_elem.text if summary_elem is not None else "")
            arxiv_url = (id_elem.text or "").strip() if id_elem is not None else ""

            authors = []
            for author_node in entry.findall("atom:author", ns):
                name_node = author_node.find("atom:name", ns)
                if name_node is not None and name_node.text:
                    authors.append(name_node.text)

            arxiv_id = arxiv_url.split("/abs/")[-1] if "/abs/" in arxiv_url else ""
            pdf_url = f"https://arxiv.org/pdf/{arxiv_id}.pdf" if arxiv_id else ""

            first_sentence = summary.split(". ")[0] if summary else ""
            key_takeaway = first_sentence + "." if first_sentence and not first_sentence.endswith(".") else summary[:150]

            pub_str = published_elem.text if published_elem is not None else ""

            papers.append({
                "source_id": "arxiv",
                "title": title,
                "summary": summary[:400],
                "url": arxiv_url or f"https://arxiv.org/abs/{arxiv_id}",
                "image_url": None,
                "category": "papers",
                "bias": "neutral",
                "tags": ["arXiv", "Machine Learning", "Inteligencia Artificial"],
                "cluster_id": None,
                "paper_metadata": {
                    "arxivId": arxiv_id,
                    "authors": authors[:5],
                    "journalOrVenue": "arXiv cs.AI / cs.LG",
                    "pdfUrl": pdf_url,
                    "keyTakeaway": key_takeaway,
                },
                "published_at": parse_pub_date(pub_str),
            })
    except Exception as e:
        print(f"⚠️ Error obteniendo arXiv papers: {e}", file=sys.stderr)

    return papers


def calculate_bias_coverage(article_group: list) -> dict:
    """Calcula porcentajes de cobertura política y posibles puntos ciegos (blindspots)."""
    left_count = sum(1 for a in article_group if a.get("bias") == "left")
    center_count = sum(1 for a in article_group if a.get("bias") == "center")
    right_count = sum(1 for a in article_group if a.get("bias") == "right")
    neutral_count = sum(1 for a in article_group if a.get("bias") == "neutral")
    total = len(article_group)

    if total == 0:
        return {"left": 33, "center": 34, "right": 33, "blindspot": None}

    if neutral_count == total:
        return {"left": 33, "center": 34, "right": 33, "blindspot": None}

    bias_total = left_count + center_count + right_count
    if bias_total > 0:
        left_pct = int(round((left_count / bias_total) * 100))
        center_pct = int(round((center_count / bias_total) * 100))
        right_pct = max(0, 100 - left_pct - center_pct)
    else:
        left_pct, center_pct, right_pct = 33, 34, 33

    blindspot = None
    if left_count == 0 and right_count > 0:
        blindspot = "left"
    elif right_count == 0 and left_count > 0:
        blindspot = "right"

    return {
        "left": left_pct,
        "center": center_pct,
        "right": right_pct,
        "blindspot": blindspot,
    }


def create_clusters_from_articles(articles: list) -> list:
    """
    Agrupa noticias de fuentes distintas con temas en común o diversidad editorial.
    Retorna lista de tuplas: (cluster_dict, [artículos asociados]).
    """
    clusters = []
    colombia_arts = [a for a in articles if a["category"] == "colombia"]
    world_arts = [a for a in articles if a["category"] == "world"]

    # Asignar keywords a cada artículo
    for a in colombia_arts:
        a["_kw"] = extract_keywords(a["title"] + " " + a["summary"])

    used_colombia = set()

    # 1. Agrupación por coincidencia semántica en Colombia
    for i, a1 in enumerate(colombia_arts):
        if i in used_colombia:
            continue
        group = [a1]
        group_idx = {i}

        for j, a2 in enumerate(colombia_arts):
            if j in used_colombia or j in group_idx:
                continue
            common = a1["_kw"] & a2["_kw"]
            has_specific = any(k in SPECIFIC_TOPICS for k in common)
            if len(common) >= 2 or (len(common) >= 1 and has_specific):
                group.append(a2)
                group_idx.add(j)

        sources = {a["source_id"] for a in group}
        if len(group) >= 2 and len(sources) >= 2:
            used_colombia.update(group_idx)
            coverage = calculate_bias_coverage(group)
            # Encontrar el titular más claro
            best_headline = max((a["title"] for a in group), key=len)
            common_kw = a1["_kw"].intersection(*(a["_kw"] for a in group))
            topic = " / ".join(w.capitalize() for w in list(common_kw)[:2]) if common_kw else "Actualidad Nacional"

            cluster_payload = {
                "headline": best_headline,
                "topic": topic if len(topic) > 3 else "Debate y Cobertura Nacional",
                "category": "colombia",
                "left_percent": coverage["left"],
                "center_percent": coverage["center"],
                "right_percent": coverage["right"],
                "total_articles": len(group),
                "blindspot": coverage["blindspot"],
                "last_updated": max(a["published_at"] for a in group),
            }
            clusters.append((cluster_payload, group))

    # 2. Si hay artículos de Colombia no agrupados, formar un cluster representativo
    remaining_colombia = [a for i, a in enumerate(colombia_arts) if i not in used_colombia]
    if len(remaining_colombia) >= 2:
        # Seleccionar artículos con diversidad de sesgos
        diverse_group = []
        seen_biases = set()
        for a in remaining_colombia:
            if a["bias"] not in seen_biases:
                diverse_group.append(a)
                seen_biases.add(a["bias"])
            if len(diverse_group) >= 3:
                break
        if len(diverse_group) < 2:
            diverse_group = remaining_colombia[:3]

        coverage = calculate_bias_coverage(diverse_group)
        cluster_payload = {
            "headline": f"Panorama Político y Social en Colombia: {diverse_group[0]['title'][:70]}...",
            "topic": "Debate Nacional y Enfoques Editoriales",
            "category": "colombia",
            "left_percent": coverage["left"],
            "center_percent": coverage["center"],
            "right_percent": coverage["right"],
            "total_articles": len(diverse_group),
            "blindspot": coverage["blindspot"],
            "last_updated": max(a["published_at"] for a in diverse_group),
        }
        clusters.append((cluster_payload, diverse_group))

    # 3. Cluster para Mundo / Internacional
    if len(world_arts) >= 2:
        world_group = world_arts[:4]
        coverage = calculate_bias_coverage(world_group)
        cluster_payload = {
            "headline": f"Actualidad Internacional: {world_group[0]['title']}",
            "topic": "Geopolítica y Cobertura Global",
            "category": "world",
            "left_percent": coverage["left"],
            "center_percent": coverage["center"],
            "right_percent": coverage["right"],
            "total_articles": len(world_group),
            "blindspot": coverage["blindspot"],
            "last_updated": max(a["published_at"] for a in world_group),
        }
        clusters.append((cluster_payload, world_group))

    return clusters


def post_clusters_to_supabase(clusters_with_articles: list):
    """Inserta clusters en news_clusters y vincula los cluster_id a sus artículos."""
    # Limpiar clusters antiguos (más de 24 horas) para no acumular repetidos
    try:
        cutoff = urllib.parse.quote((datetime.now(timezone.utc) - timedelta(hours=24)).isoformat())
        clean_url = f"{SUPABASE_URL}/rest/v1/news_clusters?created_at=lt.{cutoff}"
        headers_del = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        }
        req_del = urllib.request.Request(clean_url, headers=headers_del, method="DELETE")
        urllib.request.urlopen(req_del, timeout=10)
    except Exception:
        pass

    for cluster_dict, article_group in clusters_with_articles:
        endpoint = f"{SUPABASE_URL}/rest/v1/news_clusters"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }
        payload = json.dumps([cluster_dict]).encode("utf-8")
        req = urllib.request.Request(endpoint, data=payload, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
                if resp_data and isinstance(resp_data, list) and len(resp_data) > 0:
                    created_id = resp_data[0].get("id")
                    if created_id:
                        for a in article_group:
                            a["cluster_id"] = created_id
                        print(f"  ✓ Cluster creado: '{cluster_dict['headline'][:45]}...' ({len(article_group)} arts)")
        except Exception as e:
            print(f"⚠️ Error guardando cluster en Supabase: {e}", file=sys.stderr)


def save_articles_to_supabase(articles: list):
    """Envía los artículos procesados a la API REST de Supabase con UPSERT."""
    if not articles:
        return

    # Limpiar campos auxiliares internos
    clean_articles = []
    for a in articles:
        item = dict(a)
        item.pop("_kw", None)
        item.pop("_keywords", None)
        clean_articles.append(item)

    endpoint = f"{SUPABASE_URL}/rest/v1/news_articles?on_conflict=url"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }

    payload = json.dumps(clean_articles).encode("utf-8")
    req = urllib.request.Request(endpoint, data=payload, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            print(f"✅ Ingesta exitosa: {len(clean_articles)} artículos procesados (HTTP {resp.status})")
    except urllib.error.HTTPError as he:
        err_msg = he.read().decode("utf-8", errors="replace")
        print(f"❌ Error HTTP al guardar en Supabase ({he.code}): {err_msg}", file=sys.stderr)
    except Exception as ex:
        print(f"❌ Error al conectar con Supabase: {ex}", file=sys.stderr)


def cleanup_old_news(days: int = 14):
    """Elimina artículos con más de X días para mantener la base de datos limpia y rápida."""
    try:
        cutoff = urllib.parse.quote((datetime.now(timezone.utc) - timedelta(days=days)).isoformat())
        endpoint = f"{SUPABASE_URL}/rest/v1/news_articles?published_at=lt.{cutoff}"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        }
        req = urllib.request.Request(endpoint, headers=headers, method="DELETE")
        with urllib.request.urlopen(req, timeout=15) as resp:
            if resp.status in (200, 204):
                print(f"🧹 Limpieza de artículos antiguos completada (anteriores a {days} días).")
    except Exception as e:
        print(f"⚠️ Limpieza de noticias omitida: {e}", file=sys.stderr)


def run_cycle():
    """Ejecuta una ronda completa de ingesta, clustering y almacenamiento."""
    print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Iniciando ciclo de ingesta...")
    all_articles = []

    # 1. Feeds de noticias
    for feed in FEEDS:
        print(f"  -> Consultando feed: {feed['source_id']} ({feed['category']})...")
        items = parse_rss_feed(feed)
        all_articles.extend(items)

    # 2. Papers de arXiv
    print("  -> Consultando preprints de arXiv (cs.AI)...")
    papers = fetch_arxiv_papers()
    all_articles.extend(papers)

    print(f"  Total recopilado: {len(all_articles)} artículos.")

    # 3. Generar y guardar Clusters temáticos en Supabase
    print("  -> Generando clusters de cobertura y balance editorial...")
    clusters_with_articles = create_clusters_from_articles(all_articles)
    if clusters_with_articles:
        post_clusters_to_supabase(clusters_with_articles)

    # 4. Guardar todos los artículos (incluyendo sus cluster_id asociados)
    print("  -> Guardando artículos en Supabase...")
    save_articles_to_supabase(all_articles)

    # 5. Mantenimiento y depuración
    cleanup_old_news(days=14)


def main():
    daemon_mode = "--daemon" in sys.argv
    print("=" * 65)
    print("🚀 WORKER DE INGESTA EN TIEMPO REAL: NOTICIAS & PAPERS")
    print(f"  Destino Supabase: {SUPABASE_URL}")
    print(f"  Modo: {'DAEMON (Continuo cada 15 minutos)' if daemon_mode else 'ONCE (Ejecución Única)'}")
    print("=" * 65)

    if daemon_mode:
        while True:
            try:
                run_cycle()
                time.sleep(900)  # Cada 15 minutos en modo daemon
            except KeyboardInterrupt:
                print("\n🛑 Worker detenido por el usuario.")
                break
            except Exception as e:
                print(f"Error inesperado en ciclo: {e}", file=sys.stderr)
                time.sleep(60)
    else:
        run_cycle()


if __name__ == "__main__":
    main()
