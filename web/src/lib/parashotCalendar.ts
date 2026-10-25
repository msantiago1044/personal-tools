/**
 * Calendario perpetuo de lecturas de Parashat HaShavúa para la Diáspora (2025–2028).
 * Mapea cada fecha de Shabat a la Parashá correspondiente en Español y Hebreo Masorético.
 */
export interface ShabbatParashaEntry {
  dateKey: string;
  parashaId: string;
  parashaName: string;
  parashaHebrew: string;
  parashaRef: string;
}

export const DIASPORA_SHABBAT_CALENDAR: Record<string, ShabbatParashaEntry> = {
  "2025-01-04": {
    "dateKey": "2025-01-04",
    "parashaId": "vayigash",
    "parashaName": "Vayigash",
    "parashaHebrew": "וַיִּגַּשׁ",
    "parashaRef": "Génesis 44:18–47:27"
  },
  "2025-01-11": {
    "dateKey": "2025-01-11",
    "parashaId": "vayechi",
    "parashaName": "Vayejí",
    "parashaHebrew": "וַיְחִי",
    "parashaRef": "Génesis 47:28–50:26"
  },
  "2025-01-18": {
    "dateKey": "2025-01-18",
    "parashaId": "shemot",
    "parashaName": "Shemot",
    "parashaHebrew": "שְׁמוֹת",
    "parashaRef": "Éxodo 1:1–6:1"
  },
  "2025-01-25": {
    "dateKey": "2025-01-25",
    "parashaId": "vaera",
    "parashaName": "Vaerá",
    "parashaHebrew": "וָאֵרָא",
    "parashaRef": "Éxodo 6:2–9:35"
  },
  "2025-02-01": {
    "dateKey": "2025-02-01",
    "parashaId": "bo",
    "parashaName": "Bo",
    "parashaHebrew": "בֹּא",
    "parashaRef": "Éxodo 10:1–13:16"
  },
  "2025-02-08": {
    "dateKey": "2025-02-08",
    "parashaId": "beshalach",
    "parashaName": "Beshalaj",
    "parashaHebrew": "בְּשַׁלַּח",
    "parashaRef": "Éxodo 13:17–17:16"
  },
  "2025-02-15": {
    "dateKey": "2025-02-15",
    "parashaId": "yitro",
    "parashaName": "Yitró",
    "parashaHebrew": "יִתְרוֹ",
    "parashaRef": "Éxodo 18:1–20:23"
  },
  "2025-02-22": {
    "dateKey": "2025-02-22",
    "parashaId": "mishpatim",
    "parashaName": "Mishpatim",
    "parashaHebrew": "מִשְׁפָּטִים",
    "parashaRef": "Éxodo 21:1–24:18"
  },
  "2025-03-01": {
    "dateKey": "2025-03-01",
    "parashaId": "terumah",
    "parashaName": "Terumá",
    "parashaHebrew": "תְּרוּמָה",
    "parashaRef": "Éxodo 25:1–27:19"
  },
  "2025-03-08": {
    "dateKey": "2025-03-08",
    "parashaId": "tetzaveh",
    "parashaName": "Tetzavé",
    "parashaHebrew": "תְּצַוֶּה",
    "parashaRef": "Éxodo 27:20–30:10"
  },
  "2025-03-15": {
    "dateKey": "2025-03-15",
    "parashaId": "kitisa",
    "parashaName": "Ki Tisá",
    "parashaHebrew": "כִּי תִשָּׂא",
    "parashaRef": "Éxodo 30:11–34:35"
  },
  "2025-03-22": {
    "dateKey": "2025-03-22",
    "parashaId": "vayakhel",
    "parashaName": "Vayakhel",
    "parashaHebrew": "וַיַּקְהֵל",
    "parashaRef": "Éxodo 35:1–38:20"
  },
  "2025-03-29": {
    "dateKey": "2025-03-29",
    "parashaId": "pekudei",
    "parashaName": "Pekudei",
    "parashaHebrew": "פְקוּדֵי",
    "parashaRef": "Éxodo 38:21–40:38"
  },
  "2025-04-05": {
    "dateKey": "2025-04-05",
    "parashaId": "vayikra",
    "parashaName": "Vayikrá",
    "parashaHebrew": "וַיִּקְרָא",
    "parashaRef": "Levítico 1:1–5:26"
  },
  "2025-04-12": {
    "dateKey": "2025-04-12",
    "parashaId": "tzav",
    "parashaName": "Tzav",
    "parashaHebrew": "צַו",
    "parashaRef": "Levítico 6:1–8:36"
  },
  "2025-04-26": {
    "dateKey": "2025-04-26",
    "parashaId": "shmini",
    "parashaName": "Sheminí",
    "parashaHebrew": "שְׁמִינִי",
    "parashaRef": "Levítico 9:1–11:47"
  },
  "2025-05-03": {
    "dateKey": "2025-05-03",
    "parashaId": "tazriametzora",
    "parashaName": "Tazría-Metzorá",
    "parashaHebrew": "תַּזְרִיעַ־מְצֹרָע",
    "parashaRef": "Levítico 12:1–15:33"
  },
  "2025-05-10": {
    "dateKey": "2025-05-10",
    "parashaId": "achreimotkedoshim",
    "parashaName": "Ajarei Mot-Kedoshim",
    "parashaHebrew": "אַחֲרֵי מוֹת־קְדֹשִׁים",
    "parashaRef": "Levítico 16:1–20:27"
  },
  "2025-05-17": {
    "dateKey": "2025-05-17",
    "parashaId": "emor",
    "parashaName": "Emor",
    "parashaHebrew": "אֱמֹר",
    "parashaRef": "Levítico 21:1–24:23"
  },
  "2025-05-24": {
    "dateKey": "2025-05-24",
    "parashaId": "beharbechukotai",
    "parashaName": "Behar-Bejukotai",
    "parashaHebrew": "בְּהַר־בְּחֻקֹּתַי",
    "parashaRef": "Levítico 25:1–27:34"
  },
  "2025-05-31": {
    "dateKey": "2025-05-31",
    "parashaId": "bamidbar",
    "parashaName": "Bamidbar",
    "parashaHebrew": "בְּמִדְבַּר",
    "parashaRef": "Números 1:1–4:20"
  },
  "2025-06-07": {
    "dateKey": "2025-06-07",
    "parashaId": "nasso",
    "parashaName": "Nasó",
    "parashaHebrew": "נָשׂא",
    "parashaRef": "Números 4:21–7:89"
  },
  "2025-06-14": {
    "dateKey": "2025-06-14",
    "parashaId": "behaalotcha",
    "parashaName": "Behaalotjá",
    "parashaHebrew": "בְּהַעֲלֹתְךָ",
    "parashaRef": "Números 8:1–12:16"
  },
  "2025-06-21": {
    "dateKey": "2025-06-21",
    "parashaId": "shlach",
    "parashaName": "Shlaj Lejá",
    "parashaHebrew": "שְׁלַח־לְךָ",
    "parashaRef": "Números 13:1–15:41"
  },
  "2025-06-28": {
    "dateKey": "2025-06-28",
    "parashaId": "korach",
    "parashaName": "Kóraj",
    "parashaHebrew": "קֹרַח",
    "parashaRef": "Números 16:1–18:32"
  },
  "2025-07-05": {
    "dateKey": "2025-07-05",
    "parashaId": "chukat",
    "parashaName": "Jukat",
    "parashaHebrew": "חֻקַּת",
    "parashaRef": "Números 19:1–22:1"
  },
  "2025-07-12": {
    "dateKey": "2025-07-12",
    "parashaId": "balak",
    "parashaName": "Balak",
    "parashaHebrew": "בָּלָק",
    "parashaRef": "Números 22:2–25:9"
  },
  "2025-07-19": {
    "dateKey": "2025-07-19",
    "parashaId": "pinchas",
    "parashaName": "Pinjás",
    "parashaHebrew": "פִּינְחָס",
    "parashaRef": "Números 25:10–30:1"
  },
  "2025-07-26": {
    "dateKey": "2025-07-26",
    "parashaId": "matotmasei",
    "parashaName": "Matot-Masei",
    "parashaHebrew": "מַטּוֹת־מַסְעֵי",
    "parashaRef": "Números 30:2–36:13"
  },
  "2025-08-02": {
    "dateKey": "2025-08-02",
    "parashaId": "devarim",
    "parashaName": "Devarim",
    "parashaHebrew": "דְּבָרִים",
    "parashaRef": "Deuteronomio 1:1–3:22"
  },
  "2025-08-09": {
    "dateKey": "2025-08-09",
    "parashaId": "vaetchanan",
    "parashaName": "Vaetjanán",
    "parashaHebrew": "וָאֶתְחַנַּן",
    "parashaRef": "Deuteronomio 3:23–7:11"
  },
  "2025-08-16": {
    "dateKey": "2025-08-16",
    "parashaId": "eikev",
    "parashaName": "Ékev",
    "parashaHebrew": "עֵקֶב",
    "parashaRef": "Deuteronomio 7:12–11:25"
  },
  "2025-08-23": {
    "dateKey": "2025-08-23",
    "parashaId": "reeh",
    "parashaName": "Reé",
    "parashaHebrew": "רְאֵה",
    "parashaRef": "Deuteronomio 11:26–16:17"
  },
  "2025-08-30": {
    "dateKey": "2025-08-30",
    "parashaId": "shoftim",
    "parashaName": "Shoftim",
    "parashaHebrew": "שֹׁפְטִים",
    "parashaRef": "Deuteronomio 16:18–21:9"
  },
  "2025-09-06": {
    "dateKey": "2025-09-06",
    "parashaId": "kiteitzei",
    "parashaName": "Ki Tetzé",
    "parashaHebrew": "כִּי־תֵצֵא",
    "parashaRef": "Deuteronomio 21:10–25:19"
  },
  "2025-09-13": {
    "dateKey": "2025-09-13",
    "parashaId": "kitavo",
    "parashaName": "Ki Tavó",
    "parashaHebrew": "כִּי־תָבוֹא",
    "parashaRef": "Deuteronomio 26:1–29:8"
  },
  "2025-09-20": {
    "dateKey": "2025-09-20",
    "parashaId": "nitzavim",
    "parashaName": "Nitzavim",
    "parashaHebrew": "נִצָּבִים",
    "parashaRef": "Deuteronomio 29:9–30:20"
  },
  "2025-09-27": {
    "dateKey": "2025-09-27",
    "parashaId": "vayeilech",
    "parashaName": "Vayéilej",
    "parashaHebrew": "וַיֵּלֶךְ",
    "parashaRef": "Deuteronomio 31:1–31:30"
  },
  "2025-10-04": {
    "dateKey": "2025-10-04",
    "parashaId": "haazinu",
    "parashaName": "Haazinu",
    "parashaHebrew": "הַאֲזִינוּ",
    "parashaRef": "Deuteronomio 32:1–32:52"
  },
  "2025-10-18": {
    "dateKey": "2025-10-18",
    "parashaId": "bereshit",
    "parashaName": "Bereshit",
    "parashaHebrew": "בְּרֵאשִׁית",
    "parashaRef": "Génesis 1:1–6:8"
  },
  "2025-10-25": {
    "dateKey": "2025-10-25",
    "parashaId": "noach",
    "parashaName": "Noaj",
    "parashaHebrew": "נֹחַ",
    "parashaRef": "Génesis 6:9–11:32"
  },
  "2025-11-01": {
    "dateKey": "2025-11-01",
    "parashaId": "lechlecha",
    "parashaName": "Lej-Lejá",
    "parashaHebrew": "לֶךְ־לְךָ",
    "parashaRef": "Génesis 12:1–17:27"
  },
  "2025-11-08": {
    "dateKey": "2025-11-08",
    "parashaId": "vayera",
    "parashaName": "Vayerá",
    "parashaHebrew": "וַיֵּרָא",
    "parashaRef": "Génesis 18:1–22:24"
  },
  "2025-11-15": {
    "dateKey": "2025-11-15",
    "parashaId": "chayeisara",
    "parashaName": "Jayei Sará",
    "parashaHebrew": "חַיֵּי שָׂרָה",
    "parashaRef": "Génesis 23:1–25:18"
  },
  "2025-11-22": {
    "dateKey": "2025-11-22",
    "parashaId": "toldot",
    "parashaName": "Toldot",
    "parashaHebrew": "תּוֹלְדוֹת",
    "parashaRef": "Génesis 25:19–28:9"
  },
  "2025-11-29": {
    "dateKey": "2025-11-29",
    "parashaId": "vayetzei",
    "parashaName": "Vayetzei",
    "parashaHebrew": "וַיֵּצֵא",
    "parashaRef": "Génesis 28:10–32:3"
  },
  "2025-12-06": {
    "dateKey": "2025-12-06",
    "parashaId": "vayishlach",
    "parashaName": "Vayishlaj",
    "parashaHebrew": "וַיִּשְׁלַח",
    "parashaRef": "Génesis 32:4–36:43"
  },
  "2025-12-13": {
    "dateKey": "2025-12-13",
    "parashaId": "vayeshev",
    "parashaName": "Vayéshev",
    "parashaHebrew": "וַיֵּשֶׁב",
    "parashaRef": "Génesis 37:1–40:23"
  },
  "2025-12-20": {
    "dateKey": "2025-12-20",
    "parashaId": "miketz",
    "parashaName": "Miketz",
    "parashaHebrew": "מִקֵּץ",
    "parashaRef": "Génesis 41:1–44:17"
  },
  "2025-12-27": {
    "dateKey": "2025-12-27",
    "parashaId": "vayigash",
    "parashaName": "Vayigash",
    "parashaHebrew": "וַיִּגַּשׁ",
    "parashaRef": "Génesis 44:18–47:27"
  },
  "2026-01-03": {
    "dateKey": "2026-01-03",
    "parashaId": "vayechi",
    "parashaName": "Vayejí",
    "parashaHebrew": "וַיְחִי",
    "parashaRef": "Génesis 47:28–50:26"
  },
  "2026-01-10": {
    "dateKey": "2026-01-10",
    "parashaId": "shemot",
    "parashaName": "Shemot",
    "parashaHebrew": "שְׁמוֹת",
    "parashaRef": "Éxodo 1:1–6:1"
  },
  "2026-01-17": {
    "dateKey": "2026-01-17",
    "parashaId": "vaera",
    "parashaName": "Vaerá",
    "parashaHebrew": "וָאֵרָא",
    "parashaRef": "Éxodo 6:2–9:35"
  },
  "2026-01-24": {
    "dateKey": "2026-01-24",
    "parashaId": "bo",
    "parashaName": "Bo",
    "parashaHebrew": "בֹּא",
    "parashaRef": "Éxodo 10:1–13:16"
  },
  "2026-01-31": {
    "dateKey": "2026-01-31",
    "parashaId": "beshalach",
    "parashaName": "Beshalaj",
    "parashaHebrew": "בְּשַׁלַּח",
    "parashaRef": "Éxodo 13:17–17:16"
  },
  "2026-02-07": {
    "dateKey": "2026-02-07",
    "parashaId": "yitro",
    "parashaName": "Yitró",
    "parashaHebrew": "יִתְרוֹ",
    "parashaRef": "Éxodo 18:1–20:23"
  },
  "2026-02-14": {
    "dateKey": "2026-02-14",
    "parashaId": "mishpatim",
    "parashaName": "Mishpatim",
    "parashaHebrew": "מִשְׁפָּטִים",
    "parashaRef": "Éxodo 21:1–24:18"
  },
  "2026-02-21": {
    "dateKey": "2026-02-21",
    "parashaId": "terumah",
    "parashaName": "Terumá",
    "parashaHebrew": "תְּרוּמָה",
    "parashaRef": "Éxodo 25:1–27:19"
  },
  "2026-02-28": {
    "dateKey": "2026-02-28",
    "parashaId": "tetzaveh",
    "parashaName": "Tetzavé",
    "parashaHebrew": "תְּצַוֶּה",
    "parashaRef": "Éxodo 27:20–30:10"
  },
  "2026-03-07": {
    "dateKey": "2026-03-07",
    "parashaId": "kitisa",
    "parashaName": "Ki Tisá",
    "parashaHebrew": "כִּי תִשָּׂא",
    "parashaRef": "Éxodo 30:11–34:35"
  },
  "2026-03-14": {
    "dateKey": "2026-03-14",
    "parashaId": "vayakhelpekudei",
    "parashaName": "Vayakhel-Pekudei",
    "parashaHebrew": "וַיַּקְהֵל־פְקוּדֵי",
    "parashaRef": "Éxodo 35:1–40:38"
  },
  "2026-03-21": {
    "dateKey": "2026-03-21",
    "parashaId": "vayikra",
    "parashaName": "Vayikrá",
    "parashaHebrew": "וַיִּקְרָא",
    "parashaRef": "Levítico 1:1–5:26"
  },
  "2026-03-28": {
    "dateKey": "2026-03-28",
    "parashaId": "tzav",
    "parashaName": "Tzav",
    "parashaHebrew": "צַו",
    "parashaRef": "Levítico 6:1–8:36"
  },
  "2026-04-11": {
    "dateKey": "2026-04-11",
    "parashaId": "shmini",
    "parashaName": "Sheminí",
    "parashaHebrew": "שְׁמִינִי",
    "parashaRef": "Levítico 9:1–11:47"
  },
  "2026-04-18": {
    "dateKey": "2026-04-18",
    "parashaId": "tazriametzora",
    "parashaName": "Tazría-Metzorá",
    "parashaHebrew": "תַּזְרִיעַ־מְצֹרָע",
    "parashaRef": "Levítico 12:1–15:33"
  },
  "2026-04-25": {
    "dateKey": "2026-04-25",
    "parashaId": "achreimotkedoshim",
    "parashaName": "Ajarei Mot-Kedoshim",
    "parashaHebrew": "אַחֲרֵי מוֹת־קְדֹשִׁים",
    "parashaRef": "Levítico 16:1–20:27"
  },
  "2026-05-02": {
    "dateKey": "2026-05-02",
    "parashaId": "emor",
    "parashaName": "Emor",
    "parashaHebrew": "אֱמֹר",
    "parashaRef": "Levítico 21:1–24:23"
  },
  "2026-05-09": {
    "dateKey": "2026-05-09",
    "parashaId": "beharbechukotai",
    "parashaName": "Behar-Bejukotai",
    "parashaHebrew": "בְּהַר־בְּחֻקֹּתַי",
    "parashaRef": "Levítico 25:1–27:34"
  },
  "2026-05-16": {
    "dateKey": "2026-05-16",
    "parashaId": "bamidbar",
    "parashaName": "Bamidbar",
    "parashaHebrew": "בְּמִדְבַּר",
    "parashaRef": "Números 1:1–4:20"
  },
  "2026-05-30": {
    "dateKey": "2026-05-30",
    "parashaId": "nasso",
    "parashaName": "Nasó",
    "parashaHebrew": "נָשׂא",
    "parashaRef": "Números 4:21–7:89"
  },
  "2026-06-06": {
    "dateKey": "2026-06-06",
    "parashaId": "behaalotcha",
    "parashaName": "Behaalotjá",
    "parashaHebrew": "בְּהַעֲלֹתְךָ",
    "parashaRef": "Números 8:1–12:16"
  },
  "2026-06-13": {
    "dateKey": "2026-06-13",
    "parashaId": "shlach",
    "parashaName": "Shlaj Lejá",
    "parashaHebrew": "שְׁלַח־לְךָ",
    "parashaRef": "Números 13:1–15:41"
  },
  "2026-06-20": {
    "dateKey": "2026-06-20",
    "parashaId": "korach",
    "parashaName": "Kóraj",
    "parashaHebrew": "קֹרַח",
    "parashaRef": "Números 16:1–18:32"
  },
  "2026-06-27": {
    "dateKey": "2026-06-27",
    "parashaId": "chukatbalak",
    "parashaName": "Jukat-Balak",
    "parashaHebrew": "חֻקַּת־בָּלָק",
    "parashaRef": "Números 19:1–25:9"
  },
  "2026-07-04": {
    "dateKey": "2026-07-04",
    "parashaId": "pinchas",
    "parashaName": "Pinjás",
    "parashaHebrew": "פִּינְחָס",
    "parashaRef": "Números 25:10–30:1"
  },
  "2026-07-11": {
    "dateKey": "2026-07-11",
    "parashaId": "matotmasei",
    "parashaName": "Matot-Masei",
    "parashaHebrew": "מַטּוֹת־מַסְעֵי",
    "parashaRef": "Números 30:2–36:13"
  },
  "2026-07-18": {
    "dateKey": "2026-07-18",
    "parashaId": "devarim",
    "parashaName": "Devarim",
    "parashaHebrew": "דְּבָרִים",
    "parashaRef": "Deuteronomio 1:1–3:22"
  },
  "2026-07-25": {
    "dateKey": "2026-07-25",
    "parashaId": "vaetchanan",
    "parashaName": "Vaetjanán",
    "parashaHebrew": "וָאֶתְחַנַּן",
    "parashaRef": "Deuteronomio 3:23–7:11"
  },
  "2026-08-01": {
    "dateKey": "2026-08-01",
    "parashaId": "eikev",
    "parashaName": "Ékev",
    "parashaHebrew": "עֵקֶב",
    "parashaRef": "Deuteronomio 7:12–11:25"
  },
  "2026-08-08": {
    "dateKey": "2026-08-08",
    "parashaId": "reeh",
    "parashaName": "Reé",
    "parashaHebrew": "רְאֵה",
    "parashaRef": "Deuteronomio 11:26–16:17"
  },
  "2026-08-15": {
    "dateKey": "2026-08-15",
    "parashaId": "shoftim",
    "parashaName": "Shoftim",
    "parashaHebrew": "שֹׁפְטִים",
    "parashaRef": "Deuteronomio 16:18–21:9"
  },
  "2026-08-22": {
    "dateKey": "2026-08-22",
    "parashaId": "kiteitzei",
    "parashaName": "Ki Tetzé",
    "parashaHebrew": "כִּי־תֵצֵא",
    "parashaRef": "Deuteronomio 21:10–25:19"
  },
  "2026-08-29": {
    "dateKey": "2026-08-29",
    "parashaId": "kitavo",
    "parashaName": "Ki Tavó",
    "parashaHebrew": "כִּי־תָבוֹא",
    "parashaRef": "Deuteronomio 26:1–29:8"
  },
  "2026-09-05": {
    "dateKey": "2026-09-05",
    "parashaId": "nitzavimvayeilech",
    "parashaName": "Nitzavim-Vayéilej",
    "parashaHebrew": "נִצָּבִים־וַיֵּלֶךְ",
    "parashaRef": "Deuteronomio 29:9–31:30"
  },
  "2026-09-19": {
    "dateKey": "2026-09-19",
    "parashaId": "haazinu",
    "parashaName": "Haazinu",
    "parashaHebrew": "הַאֲזִינוּ",
    "parashaRef": "Deuteronomio 32:1–32:52"
  },
  "2026-10-10": {
    "dateKey": "2026-10-10",
    "parashaId": "bereshit",
    "parashaName": "Bereshit",
    "parashaHebrew": "בְּרֵאשִׁית",
    "parashaRef": "Génesis 1:1–6:8"
  },
  "2026-10-17": {
    "dateKey": "2026-10-17",
    "parashaId": "noach",
    "parashaName": "Noaj",
    "parashaHebrew": "נֹחַ",
    "parashaRef": "Génesis 6:9–11:32"
  },
  "2026-10-24": {
    "dateKey": "2026-10-24",
    "parashaId": "lechlecha",
    "parashaName": "Lej-Lejá",
    "parashaHebrew": "לֶךְ־לְךָ",
    "parashaRef": "Génesis 12:1–17:27"
  },
  "2026-10-31": {
    "dateKey": "2026-10-31",
    "parashaId": "vayera",
    "parashaName": "Vayerá",
    "parashaHebrew": "וַיֵּרָא",
    "parashaRef": "Génesis 18:1–22:24"
  },
  "2026-11-07": {
    "dateKey": "2026-11-07",
    "parashaId": "chayeisara",
    "parashaName": "Jayei Sará",
    "parashaHebrew": "חַיֵּי שָׂרָה",
    "parashaRef": "Génesis 23:1–25:18"
  },
  "2026-11-14": {
    "dateKey": "2026-11-14",
    "parashaId": "toldot",
    "parashaName": "Toldot",
    "parashaHebrew": "תּוֹלְדוֹת",
    "parashaRef": "Génesis 25:19–28:9"
  },
  "2026-11-21": {
    "dateKey": "2026-11-21",
    "parashaId": "vayetzei",
    "parashaName": "Vayetzei",
    "parashaHebrew": "וַיֵּצֵא",
    "parashaRef": "Génesis 28:10–32:3"
  },
  "2026-11-28": {
    "dateKey": "2026-11-28",
    "parashaId": "vayishlach",
    "parashaName": "Vayishlaj",
    "parashaHebrew": "וַיִּשְׁלַח",
    "parashaRef": "Génesis 32:4–36:43"
  },
  "2026-12-05": {
    "dateKey": "2026-12-05",
    "parashaId": "vayeshev",
    "parashaName": "Vayéshev",
    "parashaHebrew": "וַיֵּשֶׁב",
    "parashaRef": "Génesis 37:1–40:23"
  },
  "2026-12-12": {
    "dateKey": "2026-12-12",
    "parashaId": "miketz",
    "parashaName": "Miketz",
    "parashaHebrew": "מִקֵּץ",
    "parashaRef": "Génesis 41:1–44:17"
  },
  "2026-12-19": {
    "dateKey": "2026-12-19",
    "parashaId": "vayigash",
    "parashaName": "Vayigash",
    "parashaHebrew": "וַיִּגַּשׁ",
    "parashaRef": "Génesis 44:18–47:27"
  },
  "2026-12-26": {
    "dateKey": "2026-12-26",
    "parashaId": "vayechi",
    "parashaName": "Vayejí",
    "parashaHebrew": "וַיְחִי",
    "parashaRef": "Génesis 47:28–50:26"
  },
  "2027-01-02": {
    "dateKey": "2027-01-02",
    "parashaId": "shemot",
    "parashaName": "Shemot",
    "parashaHebrew": "שְׁמוֹת",
    "parashaRef": "Éxodo 1:1–6:1"
  },
  "2027-01-09": {
    "dateKey": "2027-01-09",
    "parashaId": "vaera",
    "parashaName": "Vaerá",
    "parashaHebrew": "וָאֵרָא",
    "parashaRef": "Éxodo 6:2–9:35"
  },
  "2027-01-16": {
    "dateKey": "2027-01-16",
    "parashaId": "bo",
    "parashaName": "Bo",
    "parashaHebrew": "בֹּא",
    "parashaRef": "Éxodo 10:1–13:16"
  },
  "2027-01-23": {
    "dateKey": "2027-01-23",
    "parashaId": "beshalach",
    "parashaName": "Beshalaj",
    "parashaHebrew": "בְּשַׁלַּח",
    "parashaRef": "Éxodo 13:17–17:16"
  },
  "2027-01-30": {
    "dateKey": "2027-01-30",
    "parashaId": "yitro",
    "parashaName": "Yitró",
    "parashaHebrew": "יִתְרוֹ",
    "parashaRef": "Éxodo 18:1–20:23"
  },
  "2027-02-06": {
    "dateKey": "2027-02-06",
    "parashaId": "mishpatim",
    "parashaName": "Mishpatim",
    "parashaHebrew": "מִשְׁפָּטִים",
    "parashaRef": "Éxodo 21:1–24:18"
  },
  "2027-02-13": {
    "dateKey": "2027-02-13",
    "parashaId": "terumah",
    "parashaName": "Terumá",
    "parashaHebrew": "תְּרוּמָה",
    "parashaRef": "Éxodo 25:1–27:19"
  },
  "2027-02-20": {
    "dateKey": "2027-02-20",
    "parashaId": "tetzaveh",
    "parashaName": "Tetzavé",
    "parashaHebrew": "תְּצַוֶּה",
    "parashaRef": "Éxodo 27:20–30:10"
  },
  "2027-02-27": {
    "dateKey": "2027-02-27",
    "parashaId": "kitisa",
    "parashaName": "Ki Tisá",
    "parashaHebrew": "כִּי תִשָּׂא",
    "parashaRef": "Éxodo 30:11–34:35"
  },
  "2027-03-06": {
    "dateKey": "2027-03-06",
    "parashaId": "vayakhel",
    "parashaName": "Vayakhel",
    "parashaHebrew": "וַיַּקְהֵל",
    "parashaRef": "Éxodo 35:1–38:20"
  },
  "2027-03-13": {
    "dateKey": "2027-03-13",
    "parashaId": "pekudei",
    "parashaName": "Pekudei",
    "parashaHebrew": "פְקוּדֵי",
    "parashaRef": "Éxodo 38:21–40:38"
  },
  "2027-03-20": {
    "dateKey": "2027-03-20",
    "parashaId": "vayikra",
    "parashaName": "Vayikrá",
    "parashaHebrew": "וַיִּקְרָא",
    "parashaRef": "Levítico 1:1–5:26"
  },
  "2027-03-27": {
    "dateKey": "2027-03-27",
    "parashaId": "tzav",
    "parashaName": "Tzav",
    "parashaHebrew": "צַו",
    "parashaRef": "Levítico 6:1–8:36"
  },
  "2027-04-03": {
    "dateKey": "2027-04-03",
    "parashaId": "shmini",
    "parashaName": "Sheminí",
    "parashaHebrew": "שְׁמִינִי",
    "parashaRef": "Levítico 9:1–11:47"
  },
  "2027-04-10": {
    "dateKey": "2027-04-10",
    "parashaId": "tazria",
    "parashaName": "Tazría",
    "parashaHebrew": "תַּזְרִיעַ",
    "parashaRef": "Levítico 12:1–13:59"
  },
  "2027-04-17": {
    "dateKey": "2027-04-17",
    "parashaId": "metzora",
    "parashaName": "Metzorá",
    "parashaHebrew": "מְצֹרָע",
    "parashaRef": "Levítico 14:1–15:33"
  },
  "2027-05-01": {
    "dateKey": "2027-05-01",
    "parashaId": "achreimot",
    "parashaName": "Ajarei Mot",
    "parashaHebrew": "אַחֲרֵי מוֹת",
    "parashaRef": "Levítico 16:1–18:30"
  },
  "2027-05-08": {
    "dateKey": "2027-05-08",
    "parashaId": "kedoshim",
    "parashaName": "Kedoshim",
    "parashaHebrew": "קְדֹשִׁים",
    "parashaRef": "Levítico 19:1–20:27"
  },
  "2027-05-15": {
    "dateKey": "2027-05-15",
    "parashaId": "emor",
    "parashaName": "Emor",
    "parashaHebrew": "אֱמֹר",
    "parashaRef": "Levítico 21:1–24:23"
  },
  "2027-05-22": {
    "dateKey": "2027-05-22",
    "parashaId": "behar",
    "parashaName": "Behar",
    "parashaHebrew": "בְּהַר",
    "parashaRef": "Levítico 25:1–26:2"
  },
  "2027-05-29": {
    "dateKey": "2027-05-29",
    "parashaId": "bechukotai",
    "parashaName": "Bejukotai",
    "parashaHebrew": "בְּחֻקֹּתַי",
    "parashaRef": "Levítico 26:3–27:34"
  },
  "2027-06-05": {
    "dateKey": "2027-06-05",
    "parashaId": "bamidbar",
    "parashaName": "Bamidbar",
    "parashaHebrew": "בְּמִדְבַּר",
    "parashaRef": "Números 1:1–4:20"
  },
  "2027-06-19": {
    "dateKey": "2027-06-19",
    "parashaId": "nasso",
    "parashaName": "Nasó",
    "parashaHebrew": "נָשׂא",
    "parashaRef": "Números 4:21–7:89"
  },
  "2027-06-26": {
    "dateKey": "2027-06-26",
    "parashaId": "behaalotcha",
    "parashaName": "Behaalotjá",
    "parashaHebrew": "בְּהַעֲלֹתְךָ",
    "parashaRef": "Números 8:1–12:16"
  },
  "2027-07-03": {
    "dateKey": "2027-07-03",
    "parashaId": "shlach",
    "parashaName": "Shlaj Lejá",
    "parashaHebrew": "שְׁלַח־לְךָ",
    "parashaRef": "Números 13:1–15:41"
  },
  "2027-07-10": {
    "dateKey": "2027-07-10",
    "parashaId": "korach",
    "parashaName": "Kóraj",
    "parashaHebrew": "קֹרַח",
    "parashaRef": "Números 16:1–18:32"
  },
  "2027-07-17": {
    "dateKey": "2027-07-17",
    "parashaId": "chukatbalak",
    "parashaName": "Jukat-Balak",
    "parashaHebrew": "חֻקַּת־בָּלָק",
    "parashaRef": "Números 19:1–25:9"
  },
  "2027-07-24": {
    "dateKey": "2027-07-24",
    "parashaId": "pinchas",
    "parashaName": "Pinjás",
    "parashaHebrew": "פִּינְחָס",
    "parashaRef": "Números 25:10–30:1"
  },
  "2027-07-31": {
    "dateKey": "2027-07-31",
    "parashaId": "matotmasei",
    "parashaName": "Matot-Masei",
    "parashaHebrew": "מַטּוֹת־מַסְעֵי",
    "parashaRef": "Números 30:2–36:13"
  },
  "2027-08-07": {
    "dateKey": "2027-08-07",
    "parashaId": "devarim",
    "parashaName": "Devarim",
    "parashaHebrew": "דְּבָרִים",
    "parashaRef": "Deuteronomio 1:1–3:22"
  },
  "2027-08-14": {
    "dateKey": "2027-08-14",
    "parashaId": "vaetchanan",
    "parashaName": "Vaetjanán",
    "parashaHebrew": "וָאֶתְחַנַּן",
    "parashaRef": "Deuteronomio 3:23–7:11"
  },
  "2027-08-21": {
    "dateKey": "2027-08-21",
    "parashaId": "eikev",
    "parashaName": "Ékev",
    "parashaHebrew": "עֵקֶב",
    "parashaRef": "Deuteronomio 7:12–11:25"
  },
  "2027-08-28": {
    "dateKey": "2027-08-28",
    "parashaId": "reeh",
    "parashaName": "Reé",
    "parashaHebrew": "רְאֵה",
    "parashaRef": "Deuteronomio 11:26–16:17"
  },
  "2027-09-04": {
    "dateKey": "2027-09-04",
    "parashaId": "shoftim",
    "parashaName": "Shoftim",
    "parashaHebrew": "שֹׁפְטִים",
    "parashaRef": "Deuteronomio 16:18–21:9"
  },
  "2027-09-11": {
    "dateKey": "2027-09-11",
    "parashaId": "kiteitzei",
    "parashaName": "Ki Tetzé",
    "parashaHebrew": "כִּי־תֵצֵא",
    "parashaRef": "Deuteronomio 21:10–25:19"
  },
  "2027-09-18": {
    "dateKey": "2027-09-18",
    "parashaId": "kitavo",
    "parashaName": "Ki Tavó",
    "parashaHebrew": "כִּי־תָבוֹא",
    "parashaRef": "Deuteronomio 26:1–29:8"
  },
  "2027-09-25": {
    "dateKey": "2027-09-25",
    "parashaId": "nitzavimvayeilech",
    "parashaName": "Nitzavim-Vayéilej",
    "parashaHebrew": "נִצָּבִים־וַיֵּלֶךְ",
    "parashaRef": "Deuteronomio 29:9–31:30"
  },
  "2027-10-09": {
    "dateKey": "2027-10-09",
    "parashaId": "haazinu",
    "parashaName": "Haazinu",
    "parashaHebrew": "הַאֲזִינוּ",
    "parashaRef": "Deuteronomio 32:1–32:52"
  },
  "2027-10-30": {
    "dateKey": "2027-10-30",
    "parashaId": "bereshit",
    "parashaName": "Bereshit",
    "parashaHebrew": "בְּרֵאשִׁית",
    "parashaRef": "Génesis 1:1–6:8"
  },
  "2027-11-06": {
    "dateKey": "2027-11-06",
    "parashaId": "noach",
    "parashaName": "Noaj",
    "parashaHebrew": "נֹחַ",
    "parashaRef": "Génesis 6:9–11:32"
  },
  "2027-11-13": {
    "dateKey": "2027-11-13",
    "parashaId": "lechlecha",
    "parashaName": "Lej-Lejá",
    "parashaHebrew": "לֶךְ־לְךָ",
    "parashaRef": "Génesis 12:1–17:27"
  },
  "2027-11-20": {
    "dateKey": "2027-11-20",
    "parashaId": "vayera",
    "parashaName": "Vayerá",
    "parashaHebrew": "וַיֵּרָא",
    "parashaRef": "Génesis 18:1–22:24"
  },
  "2027-11-27": {
    "dateKey": "2027-11-27",
    "parashaId": "chayeisara",
    "parashaName": "Jayei Sará",
    "parashaHebrew": "חַיֵּי שָׂרָה",
    "parashaRef": "Génesis 23:1–25:18"
  },
  "2027-12-04": {
    "dateKey": "2027-12-04",
    "parashaId": "toldot",
    "parashaName": "Toldot",
    "parashaHebrew": "תּוֹלְדוֹת",
    "parashaRef": "Génesis 25:19–28:9"
  },
  "2027-12-11": {
    "dateKey": "2027-12-11",
    "parashaId": "vayetzei",
    "parashaName": "Vayetzei",
    "parashaHebrew": "וַיֵּצֵא",
    "parashaRef": "Génesis 28:10–32:3"
  },
  "2027-12-18": {
    "dateKey": "2027-12-18",
    "parashaId": "vayishlach",
    "parashaName": "Vayishlaj",
    "parashaHebrew": "וַיִּשְׁלַח",
    "parashaRef": "Génesis 32:4–36:43"
  },
  "2027-12-25": {
    "dateKey": "2027-12-25",
    "parashaId": "vayeshev",
    "parashaName": "Vayéshev",
    "parashaHebrew": "וַיֵּשֶׁב",
    "parashaRef": "Génesis 37:1–40:23"
  },
  "2028-01-01": {
    "dateKey": "2028-01-01",
    "parashaId": "miketz",
    "parashaName": "Miketz",
    "parashaHebrew": "מִקֵּץ",
    "parashaRef": "Génesis 41:1–44:17"
  },
  "2028-01-08": {
    "dateKey": "2028-01-08",
    "parashaId": "vayigash",
    "parashaName": "Vayigash",
    "parashaHebrew": "וַיִּגַּשׁ",
    "parashaRef": "Génesis 44:18–47:27"
  },
  "2028-01-15": {
    "dateKey": "2028-01-15",
    "parashaId": "vayechi",
    "parashaName": "Vayejí",
    "parashaHebrew": "וַיְחִי",
    "parashaRef": "Génesis 47:28–50:26"
  },
  "2028-01-22": {
    "dateKey": "2028-01-22",
    "parashaId": "shemot",
    "parashaName": "Shemot",
    "parashaHebrew": "שְׁמוֹת",
    "parashaRef": "Éxodo 1:1–6:1"
  },
  "2028-01-29": {
    "dateKey": "2028-01-29",
    "parashaId": "vaera",
    "parashaName": "Vaerá",
    "parashaHebrew": "וָאֵרָא",
    "parashaRef": "Éxodo 6:2–9:35"
  },
  "2028-02-05": {
    "dateKey": "2028-02-05",
    "parashaId": "bo",
    "parashaName": "Bo",
    "parashaHebrew": "בֹּא",
    "parashaRef": "Éxodo 10:1–13:16"
  },
  "2028-02-12": {
    "dateKey": "2028-02-12",
    "parashaId": "beshalach",
    "parashaName": "Beshalaj",
    "parashaHebrew": "בְּשַׁלַּח",
    "parashaRef": "Éxodo 13:17–17:16"
  },
  "2028-02-19": {
    "dateKey": "2028-02-19",
    "parashaId": "yitro",
    "parashaName": "Yitró",
    "parashaHebrew": "יִתְרוֹ",
    "parashaRef": "Éxodo 18:1–20:23"
  },
  "2028-02-26": {
    "dateKey": "2028-02-26",
    "parashaId": "mishpatim",
    "parashaName": "Mishpatim",
    "parashaHebrew": "מִשְׁפָּטִים",
    "parashaRef": "Éxodo 21:1–24:18"
  },
  "2028-03-04": {
    "dateKey": "2028-03-04",
    "parashaId": "terumah",
    "parashaName": "Terumá",
    "parashaHebrew": "תְּרוּמָה",
    "parashaRef": "Éxodo 25:1–27:19"
  },
  "2028-03-11": {
    "dateKey": "2028-03-11",
    "parashaId": "tetzaveh",
    "parashaName": "Tetzavé",
    "parashaHebrew": "תְּצַוֶּה",
    "parashaRef": "Éxodo 27:20–30:10"
  },
  "2028-03-18": {
    "dateKey": "2028-03-18",
    "parashaId": "kitisa",
    "parashaName": "Ki Tisá",
    "parashaHebrew": "כִּי תִשָּׂא",
    "parashaRef": "Éxodo 30:11–34:35"
  },
  "2028-03-25": {
    "dateKey": "2028-03-25",
    "parashaId": "vayakhelpekudei",
    "parashaName": "Vayakhel-Pekudei",
    "parashaHebrew": "וַיַּקְהֵל־פְקוּדֵי",
    "parashaRef": "Éxodo 35:1–40:38"
  },
  "2028-04-01": {
    "dateKey": "2028-04-01",
    "parashaId": "vayikra",
    "parashaName": "Vayikrá",
    "parashaHebrew": "וַיִּקְרָא",
    "parashaRef": "Levítico 1:1–5:26"
  },
  "2028-04-08": {
    "dateKey": "2028-04-08",
    "parashaId": "tzav",
    "parashaName": "Tzav",
    "parashaHebrew": "צַו",
    "parashaRef": "Levítico 6:1–8:36"
  },
  "2028-04-22": {
    "dateKey": "2028-04-22",
    "parashaId": "shmini",
    "parashaName": "Sheminí",
    "parashaHebrew": "שְׁמִינִי",
    "parashaRef": "Levítico 9:1–11:47"
  },
  "2028-04-29": {
    "dateKey": "2028-04-29",
    "parashaId": "tazriametzora",
    "parashaName": "Tazría-Metzorá",
    "parashaHebrew": "תַּזְרִיעַ־מְצֹרָע",
    "parashaRef": "Levítico 12:1–15:33"
  },
  "2028-05-06": {
    "dateKey": "2028-05-06",
    "parashaId": "achreimotkedoshim",
    "parashaName": "Ajarei Mot-Kedoshim",
    "parashaHebrew": "אַחֲרֵי מוֹת־קְדֹשִׁים",
    "parashaRef": "Levítico 16:1–20:27"
  },
  "2028-05-13": {
    "dateKey": "2028-05-13",
    "parashaId": "emor",
    "parashaName": "Emor",
    "parashaHebrew": "אֱמֹר",
    "parashaRef": "Levítico 21:1–24:23"
  },
  "2028-05-20": {
    "dateKey": "2028-05-20",
    "parashaId": "beharbechukotai",
    "parashaName": "Behar-Bejukotai",
    "parashaHebrew": "בְּהַר־בְּחֻקֹּתַי",
    "parashaRef": "Levítico 25:1–27:34"
  },
  "2028-05-27": {
    "dateKey": "2028-05-27",
    "parashaId": "bamidbar",
    "parashaName": "Bamidbar",
    "parashaHebrew": "בְּמִדְבַּר",
    "parashaRef": "Números 1:1–4:20"
  },
  "2028-06-03": {
    "dateKey": "2028-06-03",
    "parashaId": "nasso",
    "parashaName": "Nasó",
    "parashaHebrew": "נָשׂא",
    "parashaRef": "Números 4:21–7:89"
  },
  "2028-06-10": {
    "dateKey": "2028-06-10",
    "parashaId": "behaalotcha",
    "parashaName": "Behaalotjá",
    "parashaHebrew": "בְּהַעֲלֹתְךָ",
    "parashaRef": "Números 8:1–12:16"
  },
  "2028-06-17": {
    "dateKey": "2028-06-17",
    "parashaId": "shlach",
    "parashaName": "Shlaj Lejá",
    "parashaHebrew": "שְׁלַח־לְךָ",
    "parashaRef": "Números 13:1–15:41"
  },
  "2028-06-24": {
    "dateKey": "2028-06-24",
    "parashaId": "korach",
    "parashaName": "Kóraj",
    "parashaHebrew": "קֹרַח",
    "parashaRef": "Números 16:1–18:32"
  },
  "2028-07-01": {
    "dateKey": "2028-07-01",
    "parashaId": "chukat",
    "parashaName": "Jukat",
    "parashaHebrew": "חֻקַּת",
    "parashaRef": "Números 19:1–22:1"
  },
  "2028-07-08": {
    "dateKey": "2028-07-08",
    "parashaId": "balak",
    "parashaName": "Balak",
    "parashaHebrew": "בָּלָק",
    "parashaRef": "Números 22:2–25:9"
  },
  "2028-07-15": {
    "dateKey": "2028-07-15",
    "parashaId": "pinchas",
    "parashaName": "Pinjás",
    "parashaHebrew": "פִּינְחָס",
    "parashaRef": "Números 25:10–30:1"
  },
  "2028-07-22": {
    "dateKey": "2028-07-22",
    "parashaId": "matotmasei",
    "parashaName": "Matot-Masei",
    "parashaHebrew": "מַטּוֹת־מַסְעֵי",
    "parashaRef": "Números 30:2–36:13"
  },
  "2028-07-29": {
    "dateKey": "2028-07-29",
    "parashaId": "devarim",
    "parashaName": "Devarim",
    "parashaHebrew": "דְּבָרִים",
    "parashaRef": "Deuteronomio 1:1–3:22"
  },
  "2028-08-05": {
    "dateKey": "2028-08-05",
    "parashaId": "vaetchanan",
    "parashaName": "Vaetjanán",
    "parashaHebrew": "וָאֶתְחַנַּן",
    "parashaRef": "Deuteronomio 3:23–7:11"
  },
  "2028-08-12": {
    "dateKey": "2028-08-12",
    "parashaId": "eikev",
    "parashaName": "Ékev",
    "parashaHebrew": "עֵקֶב",
    "parashaRef": "Deuteronomio 7:12–11:25"
  },
  "2028-08-19": {
    "dateKey": "2028-08-19",
    "parashaId": "reeh",
    "parashaName": "Reé",
    "parashaHebrew": "רְאֵה",
    "parashaRef": "Deuteronomio 11:26–16:17"
  },
  "2028-08-26": {
    "dateKey": "2028-08-26",
    "parashaId": "shoftim",
    "parashaName": "Shoftim",
    "parashaHebrew": "שֹׁפְטִים",
    "parashaRef": "Deuteronomio 16:18–21:9"
  },
  "2028-09-02": {
    "dateKey": "2028-09-02",
    "parashaId": "kiteitzei",
    "parashaName": "Ki Tetzé",
    "parashaHebrew": "כִּי־תֵצֵא",
    "parashaRef": "Deuteronomio 21:10–25:19"
  },
  "2028-09-09": {
    "dateKey": "2028-09-09",
    "parashaId": "kitavo",
    "parashaName": "Ki Tavó",
    "parashaHebrew": "כִּי־תָבוֹא",
    "parashaRef": "Deuteronomio 26:1–29:8"
  },
  "2028-09-16": {
    "dateKey": "2028-09-16",
    "parashaId": "nitzavimvayeilech",
    "parashaName": "Nitzavim-Vayéilej",
    "parashaHebrew": "נִצָּבִים־וַיֵּלֶךְ",
    "parashaRef": "Deuteronomio 29:9–31:30"
  },
  "2028-09-23": {
    "dateKey": "2028-09-23",
    "parashaId": "haazinu",
    "parashaName": "Haazinu",
    "parashaHebrew": "הַאֲזִינוּ",
    "parashaRef": "Deuteronomio 32:1–32:52"
  },
  "2028-10-14": {
    "dateKey": "2028-10-14",
    "parashaId": "bereshit",
    "parashaName": "Bereshit",
    "parashaHebrew": "בְּרֵאשִׁית",
    "parashaRef": "Génesis 1:1–6:8"
  },
  "2028-10-21": {
    "dateKey": "2028-10-21",
    "parashaId": "noach",
    "parashaName": "Noaj",
    "parashaHebrew": "נֹחַ",
    "parashaRef": "Génesis 6:9–11:32"
  },
  "2028-10-28": {
    "dateKey": "2028-10-28",
    "parashaId": "lechlecha",
    "parashaName": "Lej-Lejá",
    "parashaHebrew": "לֶךְ־לְךָ",
    "parashaRef": "Génesis 12:1–17:27"
  },
  "2028-11-04": {
    "dateKey": "2028-11-04",
    "parashaId": "vayera",
    "parashaName": "Vayerá",
    "parashaHebrew": "וַיֵּרָא",
    "parashaRef": "Génesis 18:1–22:24"
  },
  "2028-11-11": {
    "dateKey": "2028-11-11",
    "parashaId": "chayeisara",
    "parashaName": "Jayei Sará",
    "parashaHebrew": "חַיֵּי שָׂרָה",
    "parashaRef": "Génesis 23:1–25:18"
  },
  "2028-11-18": {
    "dateKey": "2028-11-18",
    "parashaId": "toldot",
    "parashaName": "Toldot",
    "parashaHebrew": "תּוֹלְדוֹת",
    "parashaRef": "Génesis 25:19–28:9"
  },
  "2028-11-25": {
    "dateKey": "2028-11-25",
    "parashaId": "vayetzei",
    "parashaName": "Vayetzei",
    "parashaHebrew": "וַיֵּצֵא",
    "parashaRef": "Génesis 28:10–32:3"
  },
  "2028-12-02": {
    "dateKey": "2028-12-02",
    "parashaId": "vayishlach",
    "parashaName": "Vayishlaj",
    "parashaHebrew": "וַיִּשְׁלַח",
    "parashaRef": "Génesis 32:4–36:43"
  },
  "2028-12-09": {
    "dateKey": "2028-12-09",
    "parashaId": "vayeshev",
    "parashaName": "Vayéshev",
    "parashaHebrew": "וַיֵּשֶׁב",
    "parashaRef": "Génesis 37:1–40:23"
  },
  "2028-12-16": {
    "dateKey": "2028-12-16",
    "parashaId": "miketz",
    "parashaName": "Miketz",
    "parashaHebrew": "מִקֵּץ",
    "parashaRef": "Génesis 41:1–44:17"
  },
  "2028-12-23": {
    "dateKey": "2028-12-23",
    "parashaId": "vayigash",
    "parashaName": "Vayigash",
    "parashaHebrew": "וַיִּגַּשׁ",
    "parashaRef": "Génesis 44:18–47:27"
  },
  "2028-12-30": {
    "dateKey": "2028-12-30",
    "parashaId": "vayechi",
    "parashaName": "Vayejí",
    "parashaHebrew": "וַיְחִי",
    "parashaRef": "Génesis 47:28–50:26"
  }
};

export function getParashaEntryForDate(targetDateKey: string): ShabbatParashaEntry | null {
  return DIASPORA_SHABBAT_CALENDAR[targetDateKey] || null;
}
