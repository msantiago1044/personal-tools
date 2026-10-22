import {
  SidurTefila,
  SidurTefilaId,
  SidurSegment,
  SidurSection,
  SidurProgress,
  SidurPrayerMode,
} from '../../../../../packages/shared/src/types';
import { SIDUR_MOROCCO_TEFILOT } from '../../../../../packages/shared/src/data/sidurMoroccoData';
import {
  transliterateHebrewToSpanish,
  SacredNameOption,
} from '../../../lib/hebrewPhonetics';
import { supabase } from '../../../lib/supabase';

const STORAGE_PREFIX = 'sidur_progress_';

/**
 * Segmentos que requieren quórum de 10 varones (Minián) según la Halajá y el Minhag Marroquí.
 * En rezo individual (Tefilat Yajid / Sin Minián) se omiten.
 */
export const MINIAN_ONLY_SEGMENTS = new Set<string>([
  'bareju',
  'shelosh_esreh_midot',
  'minja_tajanun',
  'vehu_rajum',
]);

/**
 * Segmentos del núcleo litúrgico halájico esencial para el "Modo Rápido"
 * (cuando hay poco tiempo antes del fin del horario del rezo / zman tefilá).
 */
export const ESSENTIAL_SEGMENTS = new Set<string>([
  'netilat_yadayim',
  'asher_yatzar',
  'birjot_hatora',
  'baruj_sheamar',
  'ashrei',
  'yishtabaj',
  'shema_yisrael',
  'emet_veyatziv',
  'amida_intro',
  'amida_1_avot',
  'amida_2_gevurot',
  'amida_3_kedusha',
  'amida_4_daat',
  'amida_5_teshuva',
  'amida_6_selija',
  'amida_7_geula',
  'amida_8_refua',
  'amida_9_shanim',
  'amida_10_galuyot',
  'amida_11_din',
  'amida_12_minim',
  'amida_13_tzadikim',
  'amida_14_yerushalayim',
  'amida_15_david',
  'amida_16_shema_kolenu',
  'amida_17_avoda',
  'amida_18_modim',
  'amida_19_shalom',
  'amida_cierre',
  'alenu_leshabeaj',
  'minja_ashrei',
  'minja_amida_prompt',
  'minja_alenu',
  'arvit_shema',
  'arvit_amida',
  'arvit_alenu',
  'beraja_1_hazan',
  'beraja_2_aretz',
  'beraja_3_yerushalayim',
  'beraja_4_hatov',
  'tefilat_haderej_seg',
  'hamapil',
  'shema_al_hamita_verse',
]);

/**
 * Texto completo de los 3 párrafos de Keriát Shemá (Deut. 6:4-9, Deut. 11:13-21 y Núm. 15:37-41)
 * con fonética masorética y traducción en español fiel.
 */
const FULL_SHEMA_PARAGRAPHS = {
  hebrew: `שְׁמַע יִשְׂרָאֵל: יהוה אֱלֹהֵינוּ, יהוה אֶחָד:
(בלחש): בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד:

וְאָהַבְתָּ אֵת יהוה אֱלֹהֶיךָ, בְּכָל־לְבָבְךָ וּבְכָל־נַפְשְׁךָ וּבְכָל־מְאֹדֶךָ: וְהָיוּ הַדְּבָרִים הָאֵלֶּה, אֲשֶׁר אָנֹכִי מְצַוְּךָ הַיּוֹם, עַל־לְבָבֶךָ: וְשִׁנַּנְתָּם לְבָנֶיךָ, וְדִבַּרְתָּ בָּם, בְּשִׁבְתְּךָ בְּבֵיתֶךָ, וּבְלֶכְתְּךָ בַדֶּרֶךְ, וּבְשָׁכְבְּךָ וּבְקוּמֶךָ: וּקְשַׁרְתָּם לְאוֹת עַל־יָדֶךָ, וְהָיוּ לְטֹטָפֹת בֵּין עֵינֶיךָ: וּכְתַבְתָּם עַל־מְזֻזוֹת בֵּיתֶךָ, וּבִשְׁעָרֶיךָ:

וְהָיָה אִם־שָׁמֹעַ תִּשְׁמְעוּ אֶל־מִצְוֹתַי, אֲשֶׁר אָנֹכִי מְצַוֶּה אֶתְכֶם הַיּוֹם, לְאַהֲבָה אֶת־יהוה אֱלֹהֵיכֶם, וּלְעָבְדוֹ בְּכָל־לְבַבְכֶם וּבְכָל־נַפְשְׁכֶם: וְנָתַתִּי מְטַר־אַרְצְכֶם בְּעִתּוֹ, יוֹרֶה וּמַלְקוֹשׁ, וְאָסַפְתָּ דְגָנֶךָ וְתִירֹשְׁךָ וְיִצְהָרֶךָ: וְנָתַתִּי עֵשֶׂב בְּשָׂדְךָ לִבְהֶמְתֶּךָ, וְאָכַלְתָּ וְשָׂבָעְתָּ: הִשָּׁמְרוּ לָכֶם פֶּן־יִפְתֶּה לְבַבְכֶם, וְסַרְתֶּם וַעֲבַדְתֶּם אֱלֹהִים אֲחֵרִים, וְהִשְׁתַּחֲוִיתֶם לָהֶם: וְחָרָה אַף־יהוה בָּכֶם, וְעָצַר אֶת־הַשָּׁמַיִם וְלֹא־יִהְיֶה מָטָר, וְהָאֲדָמָה לֹא תִתֵּן אֶת־יְבוּלָהּ, וַאֲבַדְתֶּם מְהֵרָה מֵעַל הָאָרֶץ הַטֹּבָה אֲשֶׁר יהוה נֹתֵן לָכֶם: וְשַׂמְתֶּם אֶת־דְּבָרַי אֵלֶּה עַל־לְבַבְכֶם וְעַל־נַפְשְׁכֶם, וּקְשַׁרְתֶּם אֹתָם לְאוֹת עַל־יֶדְכֶם, וְהָיוּ לְטוֹטָפֹת בֵּין עֵינֵיכֶם: וְלִמַּדְתֶּם אֹתָם אֶת־בְּנֵיכֶם לְדַבֵּר בָּם, בְּשִׁבְתְּךָ בְּבֵיתֶךָ וּבְלֶכְתְּךָ בַדֶּרֶךְ וּבְשָׁכְבְּךָ וּבְקוּמֶךָ: וּכְתַבְתָּם עַל־מְזוּזוֹת בֵּיתֶךָ וּבִשְׁעָרֶיךָ: לְמַעַן יִרְבּוּ יְמֵיכֶם וִימֵי בְנֵיכֶם עַל הָאֲדָמָה אֲשֶׁר נִשְׁבַּע יהוה לַאֲבֹתֵיכֶם לָתֵת לָהֶם, כִּימֵי הַשָּׁמַיִם עַל־הָאָרֶץ:

וַיֹּאמֶר יהוה אֶל־מֹשֶׁה לֵּאמֹר: דַּבֵּר אֶל־בְּנֵי יִשְׂרָאֵל וְאָמַרְתָּ אֲלֵהֶם, וְעָשׂוּ לָהֶם צִיצִת עַל־כַּנְפֵי בִגְדֵיהֶם לְדֹרֹתָם, וְנָתְנוּ עַל־צִיצִת הַכָּנָף פְּתִיל תְּכֵלֶת: וְהָיָה לָכֶם לְצִיצִת, וּרְאִיתֶם אֹתוֹ וּזְכַרְתֶּם אֶת־כָּל־מִצְוֹת יהוה וַעֲשִׂיתֶם אֹתָם, וְלֹא־תָתוּרוּ אַחֲרֵי לְבַבְכֶם וְאַחֲרֵי עֵינֵיכֶם, אֲשֶׁר־אַתֶּם זֹנִים אַחֲרֵיהֶם: לְמַעַן תִּזְכְּרוּ וַעֲשִׂיתֶם אֶת־כָּל־מִצְוֹתָי, וִהְיִיתֶם קְדֹשִׁים לֵאלֹהֵיכֶם: אֲנִי יהוה אֱלֹהֵיכֶם, אֲשֶׁר הוֹצֵאתִי אֶתְכֶם מֵאֶרֶץ מִצְרַיִם לִהְיוֹת לָכֶם לֵאלֹהִים, אֲנִי יהוה אֱלֹהֵיכֶם — אֱמֶת!`,

  transliteration: `Shemá Yisraél: YHVH Elohéinu, YHVH Ejád!
(En voz baja): Barúj shem kevód maljutó le-olám va-ed.

Ve-ahavtá et YHVH Elohéja, be-jol levavjá u-ve-jol nafshejá u-ve-jol meodéja. Ve-hayú ha-dvarím ha-éleh ashér anojí metzavjá ha-yom al levavéja. Ve-shinantám le-vanéja ve-dibartá bam, be-shivtejá be-vetéja, u-ve-lejtejá va-dérej, u-ve-shojbejá u-ve-kuméja. U-kshartám le-ot al yadéja, ve-hayú le-totafót bein eynéja. U-jtavtám al mezuzót betéja u-vi-sh'aréja.

Ve-hayáh im shamóa tishmeú el mitzvotái, ashér anojí metzavéh etjém ha-yom, le-ahaváh et YHVH Eloheijém, u-le-ovdó be-jol levavjém u-ve-jol nafshejém. Ve-natatí metár artzejém be-itó, yoréh u-malkósh, ve-asaftá deganéja ve-tiroshjá ve-yitzharéja. Ve-natatí ésev be-sadjá li-vhemtéja, ve-ajaltá ve-saváta. Hishamrú lajém pen yiftéh levavjém, ve-sartém va-avadtém elohím ajerím, ve-hishtajavitém lahém. Ve-jaráh af YHVH bajém, ve-atzár et ha-shamáyim ve-lo yihyéh matár, ve-ha-adamáh lo titén et yevuláh, va-avadtem meheráh me-ál ha-áretz ha-továh ashér YHVH notén lajém. Ve-samtém et devarái éleh al levavjém ve-al nafshejém, u-kshartém otám le-ot al yedjém, ve-hayú le-totafót bein eineijém. Ve-limadtém otám et beneijém le-dabér bam, be-shivtejá be-vetéja, u-ve-lejtejá va-dérej, u-ve-shojbejá u-ve-kuméja. U-jtavtám al mezuzót betéja u-vi-sh'aréja. Lemáan yirbú yemeijém vi-yméi veneijém al ha-adamáh ashér nishbá YHVH la-avoteijém latét lahém, ki-yméi ha-shamáyim al ha-áretz.

Va-yómer YHVH el Moshéh lemór: Dabér el benéi Yisraél ve-amartá aleihém, ve-asú lahém tzitzít al kanféi vigdeihém le-dorotám, ve-natnú al tzitzít ha-kanáf petíl tjélet. Ve-hayáh lajém le-tzitzít, u-re'itém otó u-zjartém et kol mitzvót YHVH va-asitém otám, ve-lo tatúru ajaréi levavjém ve-ajaréi eineijém, ashér atém zoním ajareihém. Lemáan tizkerú va-asitém et kol mitzvotái, vi-hyitém kedoshím le-Eloheijém. Aní YHVH Eloheijém, ashér hotzéti etjém me-éretz Mitzráyim lihyót lajém le-Elohím, Aní YHVH Eloheijém — Emét!`,

  spanish: `¡Escucha, Israel: YHVH es nuestro Dios, YHVH es Uno!
(En voz baja): Bendito sea el Nombre de la majestad de Su reino por siempre jamás.

Amarás a YHVH tu Dios con todo tu corazón, con toda tu alma y con todos tus recursos. Y estas palabras que Yo te ordeno hoy estarán sobre tu corazón. Las inculcarás con esmero a tus hijos y hablarás de ellas estando en tu casa, andando por el camino, al acostarte y al levantarte. Las atarás por señal en tu brazo y serán por divisas entre tus ojos; y las escribirás en los postes de tu casa y en tus portales (Deuteronomio 6:4-9).

Y sucederá que si obedecéis diligentemente Mis mandamientos que Yo os prescribo hoy, amando a YHVH vuestro Dios y sirviéndole con todo vuestro corazón y con toda vuestra alma, entonces Yo daré la lluvia de vuestra tierra a su tiempo, la temprana y la tardía, y cosecharás tu grano, tu mosto y tu aceite. Y daré hierba en tu campo para tu ganado, y comerás y te saciarás. Guardaos, no sea que se engañe vuestro corazón, y os apartéis y sirváis a dioses extraños y os postréis ante ellos; y se encienda la ira de YHVH contra vosotros, y cierre los cielos y no haya lluvia, y la tierra no entregue su producto, y perezcáis con prontitud de sobre la buena tierra que YHVH os da. Por tanto, pondréis estas Mis palabras en vuestro corazón y en vuestra alma, y las ataréis como señal sobre vuestra mano, y serán como divisas entre vuestros ojos. Y las enseñaréis a vuestros hijos, hablando de ellas estando en tu casa, andando por el camino, al acostarte y al levantarte. Y las escribirás en los postes de tu casa y en tus portales; para que se multipliquen vuestros días y los días de vuestros hijos sobre la tierra que YHVH juró a vuestros padres darles, como los días de los cielos sobre la tierra (Deuteronomio 11:13-21).

Y dijo YHVH a Moisés lo siguiente: Habla a los hijos de Israel y diles que se hagan flecos (tzitzit) en los bordes de sus vestiduras, por sus generaciones; y pongan en el fleco de cada borde un cordón de azul celeste. Y os servirá de fleco, para que lo veáis y recordéis todos los mandamientos de YHVH y los cumpláis; y no exploréis tras vuestro corazón ni tras vuestros ojos, tras los cuales soléis descarriaros; para que os acordéis y cumpláis todos Mis mandamientos, y seáis santos para vuestro Dios. Yo soy YHVH vuestro Dios, que os saqué de la tierra de Egipto para ser vuestro Dios. Yo soy YHVH vuestro Dios — ¡Es verdad! (Números 15:37-41).`,
};

let cachedAugmentedTefilot: SidurTefila[] | null = null;

function buildAugmentedTefilot(): SidurTefila[] {
  const shajarit = SIDUR_MOROCCO_TEFILOT.find((t) => t.id === 'shajarit');
  const amidaSection = shajarit?.sections.find((s) => s.id === 'amida_jol');
  const rawAmidaSegments = amidaSection ? amidaSection.segments : [];

  return SIDUR_MOROCCO_TEFILOT.map((tefila) => {
    // 1. Shajarit: asegurar Shemá completo con los 3 párrafos
    if (tefila.id === 'shajarit') {
      return {
        ...tefila,
        sections: tefila.sections.map((sec) => {
          if (sec.id === 'shema_u_virjoteha') {
            return {
              ...sec,
              segments: sec.segments.map((seg) => {
                if (seg.id === 'shema_yisrael') {
                  return {
                    ...seg,
                    hebrew: FULL_SHEMA_PARAGRAPHS.hebrew,
                    transliteration: FULL_SHEMA_PARAGRAPHS.transliteration,
                    spanish: FULL_SHEMA_PARAGRAPHS.spanish,
                  };
                }
                return seg;
              }),
            };
          }
          return sec;
        }),
      };
    }

    // 2. Minjá: inyectar las 19 bendiciones completas de la Amidá
    if (tefila.id === 'minja') {
      const minjaAmidaSegments: SidurSegment[] = rawAmidaSegments.map((seg) => ({
        ...seg,
        id: `minja_${seg.id}`,
      }));

      return {
        ...tefila,
        sections: tefila.sections.map((sec) => {
          if (sec.id === 'minja_amida_section') {
            return {
              ...sec,
              titleSpanish: 'La Amidá · Las 19 Bendiciones de Minjá',
              description: 'Las 19 bendiciones tradicionales completas recitadas de pie con pies juntos mirando a Jerusalén.',
              segments: minjaAmidaSegments.length > 0 ? minjaAmidaSegments : sec.segments,
            };
          }
          return sec;
        }),
      };
    }

    // 3. Arvit: inyectar Shemá completo con los 3 párrafos y la Amidá de 19 bendiciones completa
    if (tefila.id === 'arvit') {
      const arvitAmidaSegments: SidurSegment[] = rawAmidaSegments.map((seg) => ({
        ...seg,
        id: `arvit_${seg.id}`,
      }));

      return {
        ...tefila,
        sections: tefila.sections.map((sec) => {
          if (sec.id === 'arvit_inicio') {
            return {
              ...sec,
              segments: sec.segments.map((seg) => {
                if (seg.id === 'arvit_shema') {
                  return {
                    ...seg,
                    titleSpanish: 'Shemá Israel Nocturno (3 Párrafos Completos)',
                    hebrew: FULL_SHEMA_PARAGRAPHS.hebrew,
                    transliteration: FULL_SHEMA_PARAGRAPHS.transliteration,
                    spanish: FULL_SHEMA_PARAGRAPHS.spanish,
                  };
                }
                return seg;
              }),
            };
          }

          if (sec.id === 'arvit_amida_section') {
            return {
              ...sec,
              titleSpanish: 'La Amidá · Las 19 Bendiciones de la Noche',
              description: 'Las 19 bendiciones tradicionales nocturnas completas recitadas de pie con pies juntos en silencio.',
              segments: arvitAmidaSegments.length > 0 ? arvitAmidaSegments : sec.segments,
            };
          }

          return sec;
        }),
      };
    }

    return tefila;
  });
}

/**
 * Devuelve todas las tefilot disponibles en el rito marroquí (con liturgia completa en Minjá y Arvit).
 */
export function getSidurTefilot(): SidurTefila[] {
  if (!cachedAugmentedTefilot) {
    cachedAugmentedTefilot = buildAugmentedTefilot();
  }
  return cachedAugmentedTefilot;
}

/**
 * Obtiene una tefilá específica por su ID.
 */
export function getSidurTefila(id: SidurTefilaId): SidurTefila | undefined {
  return getSidurTefilot().find((t) => t.id === id);
}

/**
 * Determina si un segmento requiere minián.
 */
export function isSegmentRequiringMinian(segment: SidurSegment): boolean {
  return Boolean(segment.requiresMinian || MINIAN_ONLY_SEGMENTS.has(segment.id));
}

/**
 * Determina si un segmento pertenece al núcleo esencial.
 */
export function isSegmentEssential(segment: SidurSegment, section?: SidurSection): boolean {
  return Boolean(
    segment.isEssential ||
    ESSENTIAL_SEGMENTS.has(segment.id) ||
    segment.id.startsWith('minja_amida_') ||
    segment.id.startsWith('arvit_amida_') ||
    section?.isEssential ||
    section?.id === 'amida_jol' ||
    section?.id === 'minja_amida_section' ||
    section?.id === 'arvit_amida_section'
  );
}

/**
 * Filtra las secciones y segmentos según el modo litúrgico seleccionado:
 * - 'completo': Muestra todo íntegro.
 * - 'minian': Muestra todo (con las oraciones y respuestas que requieren minián).
 * - 'sin_minian': Omite las oraciones que requieren quórum (Barejú, 13 Midot comunitaria, etc.).
 * - 'rapido': Filtra exclusivamente al núcleo halájico esencial.
 */
export function getFilteredSections(
  sections: SidurSection[],
  prayerMode: SidurPrayerMode = 'completo'
): SidurSection[] {
  if (prayerMode === 'completo') {
    return sections;
  }

  return sections
    .map((sec) => {
      let filtered = sec.segments;

      if (prayerMode === 'sin_minian' || prayerMode === 'individual') {
        filtered = filtered.filter((seg) => !isSegmentRequiringMinian(seg));
      } else if (prayerMode === 'rapido') {
        filtered = filtered.filter((seg) => isSegmentEssential(seg, sec));
      }

      return {
        ...sec,
        segments: filtered,
      };
    })
    .filter((sec) => sec.segments.length > 0);
}

/**
 * Determina el rezo sugerido según la hora local actual.
 */
export function getSuggestedTefilaId(): SidurTefilaId {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const decimalHour = hours + minutes / 60;

  if (decimalHour >= 4 && decimalHour < 13) {
    return 'shajarit';
  } else if (decimalHour >= 13 && decimalHour < 18.5) {
    return 'minja';
  } else {
    return 'arvit';
  }
}

/**
 * Obtiene la fecha actual en formato ISO local YYYY-MM-DD.
 */
export function getTodayDateKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Genera la transliteración fonética masorética aplicando la opción de Nombre Sagrado (por defecto 'YHVH').
 */
export function getRenderedTransliteration(
  segment: SidurSegment,
  sacredNameMode: SacredNameOption = 'YHVH'
): string {
  if (!segment) return '';

  if (segment.transliteration) {
    let text = segment.transliteration;
    if (sacredNameMode === 'YHVH') {
      text = text
        .replace(/\bAdonái\b/g, 'YHVH')
        .replace(/\bAdonai\b/g, 'YHVH')
        .replace(/\bHaShem\b/g, 'YHVH')
        .replace(/\bVa-Adonái\b/g, 'Ve-YHVH');
    } else if (sacredNameMode === 'HaShem') {
      text = text
        .replace(/\bAdonái\b/g, 'HaShem')
        .replace(/\bAdonai\b/g, 'HaShem')
        .replace(/\bYHVH\b/g, 'HaShem')
        .replace(/\bVa-Adonái\b/g, 'Ve-HaShem');
    } else {
      text = text
        .replace(/\bYHVH\b/g, 'Adonái')
        .replace(/\bHaShem\b/g, 'Adonái')
        .replace(/\bVe-YHVH\b/g, 'Va-Adonái');
    }
    return text;
  }

  return transliterateHebrewToSpanish(segment.hebrew, {
    sacredName: sacredNameMode,
  });
}

/**
 * Aplica el Nombre Sagrado en la traducción al español (por defecto 'YHVH').
 */
export function getRenderedSpanish(
  segment: SidurSegment,
  sacredNameMode: SacredNameOption = 'YHVH'
): string {
  if (!segment || !segment.spanish) return '';
  let text = segment.spanish;

  if (sacredNameMode === 'Adonai') {
    text = text.replace(/\bYHVH\b/g, 'Adonái').replace(/\bHaShem\b/g, 'Adonái');
  } else if (sacredNameMode === 'HaShem') {
    text = text.replace(/\bYHVH\b/g, 'HaShem').replace(/\bAdonái\b/g, 'HaShem').replace(/\bAdonai\b/g, 'HaShem');
  } else {
    text = text.replace(/\bAdonái\b/g, 'YHVH').replace(/\bAdonai\b/g, 'YHVH').replace(/\bHaShem\b/g, 'YHVH');
  }

  return text;
}

/**
 * Obtiene el progreso del usuario del día actual.
 */
export function getStoredSidurProgress(userId?: string): SidurProgress {
  const today = getTodayDateKey();
  const defaultProgress: SidurProgress = {
    date: today,
    shajaritCompleted: false,
    minjaCompleted: false,
    arvitCompleted: false,
    completedAt: {},
    streakDays: 0,
    history: {},
  };

  if (typeof window === 'undefined') return defaultProgress;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId || 'guest'}`);
    if (!raw) return defaultProgress;
    const parsed: SidurProgress = JSON.parse(raw);

    // Si el registro guardado es de hoy, devolvemos tal cual
    if (parsed.date === today) {
      return parsed;
    }

    // Si es de un día anterior, reseteamos el estado de hoy manteniendo el historial y racha
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    const wasYesterdayCompleted =
      Boolean(parsed.history[yesterdayKey]?.length) ||
      (parsed.date === yesterdayKey &&
        (parsed.shajaritCompleted || parsed.minjaCompleted || parsed.arvitCompleted));

    return {
      date: today,
      shajaritCompleted: false,
      minjaCompleted: false,
      arvitCompleted: false,
      completedAt: {},
      streakDays: wasYesterdayCompleted ? parsed.streakDays : 0,
      history: {
        ...parsed.history,
        ...(parsed.shajaritCompleted || parsed.minjaCompleted || parsed.arvitCompleted
          ? {
              [parsed.date]: [
                ...(parsed.shajaritCompleted ? ['shajarit'] : []),
                ...(parsed.minjaCompleted ? ['minja'] : []),
                ...(parsed.arvitCompleted ? ['arvit'] : []),
              ],
            }
          : {}),
      },
    };
  } catch (e) {
    console.error('Error cargando progreso de sidur:', e);
    return defaultProgress;
  }
}

/**
 * Alterna el estado de cumplimiento de una tefilá para hoy y sincroniza en local y Supabase.
 */
export async function toggleTefilaCompletedToday(
  tefilaId: SidurTefilaId,
  userId?: string
): Promise<SidurProgress> {
  const current = getStoredSidurProgress(userId);
  const today = getTodayDateKey();
  const nowIso = new Date().toISOString();

  let shajarit = current.shajaritCompleted;
  let minja = current.minjaCompleted;
  let arvit = current.arvitCompleted;
  const completedAt = { ...current.completedAt };

  if (tefilaId === 'shajarit') {
    shajarit = !shajarit;
    if (shajarit) completedAt.shajarit = nowIso;
    else delete completedAt.shajarit;
  } else if (tefilaId === 'minja') {
    minja = !minja;
    if (minja) completedAt.minja = nowIso;
    else delete completedAt.minja;
  } else if (tefilaId === 'arvit') {
    arvit = !arvit;
    if (arvit) completedAt.arvit = nowIso;
    else delete completedAt.arvit;
  }

  const todayList: string[] = [
    ...(shajarit ? ['shajarit'] : []),
    ...(minja ? ['minja'] : []),
    ...(arvit ? ['arvit'] : []),
  ];

  const updated: SidurProgress = {
    ...current,
    date: today,
    shajaritCompleted: shajarit,
    minjaCompleted: minja,
    arvitCompleted: arvit,
    completedAt,
    streakDays: todayList.length > 0 ? Math.max(current.streakDays, 1) : current.streakDays,
    history: {
      ...current.history,
      [today]: todayList,
    },
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(
      `${STORAGE_PREFIX}${userId || 'guest'}`,
      JSON.stringify(updated)
    );
  }

  // Sincronización transparente con Supabase si hay sesión activa
  if (userId) {
    try {
      await supabase.from('sidur_progress').upsert({
        user_id: userId,
        date_key: today,
        shajarit_completed: shajarit,
        minja_completed: minja,
        arvit_completed: arvit,
        completed_at: completedAt,
        updated_at: nowIso,
      });
    } catch (err) {
      // Si la tabla aún no existe o falla la red, no bloqueamos la experiencia
      console.warn('Nota: Sincronización en la nube de sidur diferida.', err);
    }
  }

  return updated;
}
