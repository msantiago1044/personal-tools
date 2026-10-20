#!/usr/bin/env python3
"""
Worker de Ingesta y Clasificación en Tiempo Real: Noticias & Papers
Captura feeds RSS de Colombia, Mundo, Medio Ambiente y Papers de arXiv,
los normaliza con sesgo editorial e impact takeaways, y los publica en Supabase.
"""

import sys
import os
import time
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
import re
from datetime import datetime, timezone

# Asegurar codificación UTF-8 en stdout/stderr para Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Configuración de Supabase (valores predeterminados tomados de la suite)
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
    "http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=6"
)

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PersonalTools/1.0"


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


def parse_rss_feed(feed_config: dict) -> list:
    """Descarga y parsea un feed RSS estándar."""
    articles = []
    source_id = feed_config["source_id"]
    category = feed_config["category"]
    bias = feed_config["bias"]

    try:
        xml_content = fetch_url(feed_config["url"])
        root = ET.fromstring(xml_content)

        # Buscar items en el canal RSS
        items = root.findall(".//item")
        for item in items[:8]:  # Limitar a las 8 noticias más recientes por feed
            title_elem = item.find("title")
            link_elem = item.find("link")
            desc_elem = item.find("description")

            title = clean_html(title_elem.text if title_elem is not None else "")
            link = (link_elem.text or "").strip() if link_elem is not None else ""
            desc = clean_html(desc_elem.text if desc_elem is not None else "")
            
            if not title or not link:
                continue

            # Generar tags a partir de palabras del titular
            words = [w.capitalize() for w in re.findall(r"\b[a-zA-ZáéíóúÁÉÍÓÚñÑ]{5,}\b", title)]
            tags = list(dict.fromkeys(words))[:4]

            articles.append({
                "source_id": source_id,
                "title": title,
                "summary": desc[:300] if desc else title,
                "url": link,
                "category": category,
                "bias": bias,
                "tags": tags,
                "paper_metadata": None,
                "published_at": datetime.now(timezone.utc).isoformat(),
            })
    except Exception as e:
        print(f"⚠️ Error obteniendo feed {source_id}: {e}", file=sys.stderr)

    return articles


def fetch_arxiv_papers() -> list:
    """Descarga y parsea los papers científicos más recientes de arXiv cs.AI."""
    papers = []
    try:
        xml_content = fetch_url(ARXIV_FEED_URL)
        # Namespaces de Atom
        ns = {"atom": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}
        root = ET.fromstring(xml_content)

        for entry in root.findall("atom:entry", ns)[:5]:
            title_elem = entry.find("atom:title", ns)
            summary_elem = entry.find("atom:summary", ns)
            id_elem = entry.find("atom:id", ns)
            published_elem = entry.find("atom:published", ns)

            title = clean_html(title_elem.text if title_elem is not None else "")
            summary = clean_html(summary_elem.text if summary_elem is not None else "")
            arxiv_url = (id_elem.text or "").strip() if id_elem is not None else ""

            # Extraer autores
            authors = []
            for author_node in entry.findall("atom:author", ns):
                name_node = author_node.find("atom:name", ns)
                if name_node is not None and name_node.text:
                    authors.append(name_node.text)

            # Extraer ID de arXiv (ej: 2410.12345)
            arxiv_id = arxiv_url.split("/abs/")[-1] if "/abs/" in arxiv_url else ""
            pdf_url = f"https://arxiv.org/pdf/{arxiv_id}.pdf" if arxiv_id else ""

            # Extraer takeaway automático (primera oración del abstract)
            first_sentence = summary.split(". ")[0] if summary else ""
            key_takeaway = first_sentence + "." if first_sentence and not first_sentence.endswith(".") else summary[:150]

            papers.append({
                "source_id": "arxiv",
                "title": title,
                "summary": summary[:400],
                "url": arxiv_url or f"https://arxiv.org/abs/{arxiv_id}",
                "category": "papers",
                "bias": "neutral",
                "tags": ["arXiv", "Machine Learning", "Inteligencia Artificial"],
                "paper_metadata": {
                    "arxivId": arxiv_id,
                    "authors": authors[:5],
                    "journalOrVenue": "arXiv cs.AI / cs.LG",
                    "pdfUrl": pdf_url,
                    "keyTakeaway": key_takeaway,
                },
                "published_at": published_elem.text if published_elem is not None else datetime.now(timezone.utc).isoformat(),
            })
    except Exception as e:
        print(f"⚠️ Error obteniendo arXiv papers: {e}", file=sys.stderr)

    return papers


def save_articles_to_supabase(articles: list):
    """Envía los artículos procesados a la API REST de Supabase con UPSERT."""
    if not articles:
        return

    endpoint = f"{SUPABASE_URL}/rest/v1/news_articles"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }

    payload = json.dumps(articles).encode("utf-8")
    req = urllib.request.Request(endpoint, data=payload, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            print(f"✅ Ingesta exitosa: {len(articles)} artículos procesados (HTTP {resp.status})")
    except urllib.error.HTTPError as he:
        err_msg = he.read().decode("utf-8", errors="replace")
        print(f"❌ Error HTTP al guardar en Supabase ({he.code}): {err_msg}", file=sys.stderr)
    except Exception as ex:
        print(f"❌ Error al conectar con Supabase: {ex}", file=sys.stderr)


def run_cycle():
    """Ejecuta una ronda completa de ingesta y almacenamiento."""
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

    print(f"  Total recopilado: {len(all_articles)} artículos. Guardando en Supabase...")
    save_articles_to_supabase(all_articles)


def main():
    daemon_mode = "--daemon" in sys.argv
    print("=" * 65)
    print("🚀 WORKER DE INGESTA EN TIEMPO REAL: NOTICIAS & PAPERS")
    print(f"  Destino Supabase: {SUPABASE_URL}")
    print(f"  Modo: {'DAEMON (Continuo cada 3 minutos)' if daemon_mode else 'ONCE (Ejecución Única)'}")
    print("=" * 65)

    if daemon_mode:
        while True:
            try:
                run_cycle()
                time.sleep(180)  # Cada 3 minutos
            except KeyboardInterrupt:
                print("\n🛑 Worker detenido por el usuario.")
                break
            except Exception as e:
                print(f"Error inesperado en ciclo: {e}", file=sys.stderr)
                time.sleep(30)
    else:
        run_cycle()


if __name__ == "__main__":
    main()
