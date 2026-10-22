import { WeeklyParasha } from '../types';
import { WEEKDAY_READINGS_CATALOG } from './weekdayTorahReadings';

export const PARASHAT_LECH_LECHA_DATA: WeeklyParasha = {
  "id": "lechlecha",
  "nameHebrew": "לֶךְ־לְךָ",
  "nameSpanish": "Lej-Lejá",
  "book": "Genesis",
  "bookSpanish": "Bereshit (Génesis)",
  "ref": "Génesis 12:1–17:27",
  "summary": "El llamado de Avram a dejar su tierra hacia Canaán, la hambruna y descenso a Egipto, la separación con Lot, la promesa de descendencia innumerable, el pacto entre las partes (Brit Bein HaBetarim), el nacimiento de Yishmael, y el precepto del Brit Milá (circuncisión).",
  "weekdayReading": {
    "ref": "Génesis 12:1–12:13",
    "spansAliyot": [
      1
    ],
    "cohen": {
      "type": "cohen",
      "nameHebrew": "כֹּהֵן",
      "nameSpanish": "Cohén",
      "refRange": "Génesis 12:1–12:3",
      "aliyahNumber": 1,
      "startVerseNum": 1,
      "endVerseNum": 3
    },
    "levi": {
      "type": "levi",
      "nameHebrew": "לֵוִי",
      "nameSpanish": "Leví",
      "refRange": "Génesis 12:4–12:9",
      "aliyahNumber": 1,
      "startVerseNum": 4,
      "endVerseNum": 9
    },
    "israel": {
      "type": "israel",
      "nameHebrew": "יִשְׂרָאֵל",
      "nameSpanish": "Israel",
      "refRange": "Génesis 12:10–12:13",
      "aliyahNumber": 1,
      "startVerseNum": 10,
      "endVerseNum": 13
    }
  },
  "aliyot": [
    {
      "aliyahNumber": 1,
      "nameHebrew": "רִאשׁוֹן",
      "nameSpanish": "1ª Aliyá (Rishón)",
      "refRange": "Génesis 12:1–12:13",
      "hasWeekdayReading": true,
      "verses": [
        {
          "verseNumber": 1,
          "verseKey": "Génesis 12:1",
          "hebrew": "וַיֹּ֤אמֶר יְהֹוָה֙ אֶל־אַבְרָ֔ם לֶךְ־לְךָ֛ מֵאַרְצְךָ֥ וּמִמּֽוֹלַדְתְּךָ֖ וּמִבֵּ֣ית אָבִ֑יךָ אֶל־הָאָ֖רֶץ אֲשֶׁ֥ר אַרְאֶֽךָּ׃",
          "transliteration": "Vayómer YHVH el-Avrám Lej-lejá me'artzeja umimoladteja umibeit avija el-ha'aretz asher ar'eka.",
          "spanish": "Pero YHVH había dicho a Abram: Vete de tu tierra y de tu parentela, y de la casa de tu padre, a la tierra que te mostraré."
        },
        {
          "verseNumber": 2,
          "verseKey": "Génesis 12:2",
          "hebrew": "וְאֶֽעֶשְׂךָ֙ לְג֣וֹי גָּד֔וֹל וַאֲבָ֣רֶכְךָ֔ וַאֲגַדְּלָ֖ה שְׁמֶ֑ךָ וֶהְיֵ֖ה בְּרָכָֽה׃",
          "transliteration": "Ve'e'esja legoy gadol va'avarejja va'agadelah shemeja vehyeh berajah.",
          "spanish": "Y haré de ti una nación grande, y te bendeciré, y engrandeceré tu nombre, y serás bendición."
        },
        {
          "verseNumber": 3,
          "verseKey": "Génesis 12:3",
          "hebrew": "וַאֲבָֽרְכָה֙ מְבָ֣רְכֶ֔יךָ וּמְקַלֶּלְךָ֖ אָאֹ֑ר וְנִבְרְכ֣וּ בְךָ֔ כֹּ֖ל מִשְׁפְּחֹ֥ת הָאֲדָמָֽה׃",
          "transliteration": "Va'avarjah mevarjeija umkalelja a'or venivreju beja kol mishpejot ha'adamah.",
          "spanish": "Bendeciré a los que te bendijeren, y a los que te maldijeren maldeciré; y serán benditas en ti todas las familias de la tierra."
        },
        {
          "verseNumber": 4,
          "verseKey": "Génesis 12:4",
          "hebrew": "וַיֵּ֣לֶךְ אַבְרָ֗ם כַּאֲשֶׁ֨ר דִּבֶּ֤ר אֵלָיו֙ יְהֹוָ֔ה וַיֵּ֥לֶךְ אִתּ֖וֹ ל֑וֹט וְאַבְרָ֗ם בֶּן־חָמֵ֤שׁ שָׁנִים֙ וְשִׁבְעִ֣ים שָׁנָ֔ה בְּצֵאת֖וֹ מֵחָרָֽן׃",
          "transliteration": "Vayélej Avrám ka'asher diber elaiv YHVH Vayélej ito Lot Ve-Avrám ben-jamesh shanim veshiv'im shanah betzeto mejaran.",
          "spanish": "Y se fue Abram, como YHVH le dijo; y Lot fue con él. Y era Abram de edad de setenta y cinco años cuando salió de Harán."
        },
        {
          "verseNumber": 5,
          "verseKey": "Génesis 12:5",
          "hebrew": "וַיִּקַּ֣ח אַבְרָם֩ אֶת־שָׂרַ֨י אִשְׁתּ֜וֹ וְאֶת־ל֣וֹט בֶּן־אָחִ֗יו וְאֶת־כׇּל־רְכוּשָׁם֙ אֲשֶׁ֣ר רָכָ֔שׁוּ וְאֶת־הַנֶּ֖פֶשׁ אֲשֶׁר־עָשׂ֣וּ בְחָרָ֑ן וַיֵּצְא֗וּ לָלֶ֙כֶת֙ אַ֣רְצָה כְּנַ֔עַן וַיָּבֹ֖אוּ אַ֥רְצָה כְּנָֽעַן׃",
          "transliteration": "Vayikaj Avrám et-sarai ishto ve'et-Lot ben-ajiv ve'et-kol-rejusham asher rajashu ve'et-hanefesh asher-asu bejaran Vayetz'ú lalejet artzah Canaán Vayavó'u artzah Canaán.",
          "spanish": "Tomó, pues, Abram a Sarai su mujer, y a Lot hijo de su hermano, y todos sus bienes que habían ganado y las personas que habían adquirido en Harán, y salieron para ir a tierra de Canaán; y a tierra de Canaán llegaron."
        },
        {
          "verseNumber": 6,
          "verseKey": "Génesis 12:6",
          "hebrew": "וַיַּעֲבֹ֤ר אַבְרָם֙ בָּאָ֔רֶץ עַ֚ד מְק֣וֹם שְׁכֶ֔ם עַ֖ד אֵל֣וֹן מוֹרֶ֑ה וְהַֽכְּנַעֲנִ֖י אָ֥ז בָּאָֽרֶץ׃",
          "transliteration": "Vaya'avor Avrám ba'aretz ad mekom shejem ad elon moreh vehakena'ani az ba'aretz.",
          "spanish": "Y pasó Abram por aquella tierra hasta el lugar de Siquem, hasta el encino de More; y el cananeo estaba entonces en la tierra."
        },
        {
          "verseNumber": 7,
          "verseKey": "Génesis 12:7",
          "hebrew": "וַיֵּרָ֤א יְהֹוָה֙ אֶל־אַבְרָ֔ם וַיֹּ֕אמֶר לְזַ֨רְעֲךָ֔ אֶתֵּ֖ן אֶת־הָאָ֣רֶץ הַזֹּ֑את וַיִּ֤בֶן שָׁם֙ מִזְבֵּ֔חַ לַיהֹוָ֖ה הַנִּרְאֶ֥ה אֵלָֽיו׃",
          "transliteration": "Vayera YHVH el-Avrám Vayómer lezar'aja eten et-ha'aretz hazot vayiven sham mizbeaj La-YHVH hanir'eh elaiv.",
          "spanish": "Y apareció YHVH a Abram, y le dijo: A tu descendencia daré esta tierra. Y edificó allí un altar a YHVH, quien le había aparecido."
        },
        {
          "verseNumber": 8,
          "verseKey": "Génesis 12:8",
          "hebrew": "וַיַּעְתֵּ֨ק מִשָּׁ֜ם הָהָ֗רָה מִקֶּ֛דֶם לְבֵֽית־אֵ֖ל וַיֵּ֣ט אׇהֳלֹ֑ה בֵּֽית־אֵ֤ל מִיָּם֙ וְהָעַ֣י מִקֶּ֔דֶם וַיִּֽבֶן־שָׁ֤ם מִזְבֵּ֙חַ֙ לַֽיהֹוָ֔ה וַיִּקְרָ֖א בְּשֵׁ֥ם יְהֹוָֽה׃",
          "transliteration": "Vaya'tek misham haharah mikedem leveit-El vayet oholoh beit-El miyam veha'ai mikedem vayiven-sham mizbeaj La-YHVH vayikra beshem YHVH.",
          "spanish": "Luego se pasó de allí a un monte al oriente de Bet-el, y plantó su tienda, teniendo a Bet-el al occidente y Hai al oriente; y edificó allí altar a YHVH, e invocó el nombre de YHVH."
        },
        {
          "verseNumber": 9,
          "verseKey": "Génesis 12:9",
          "hebrew": "וַיִּסַּ֣ע אַבְרָ֔ם הָל֥וֹךְ וְנָס֖וֹעַ הַנֶּֽגְבָּה׃",
          "transliteration": "Vayisa' Avrám haloj venasoa' hanegbah.",
          "spanish": "Y Abram partió de allí, caminando y yendo hacia el Neguev."
        },
        {
          "verseNumber": 10,
          "verseKey": "Génesis 12:10",
          "hebrew": "וַיְהִ֥י רָעָ֖ב בָּאָ֑רֶץ וַיֵּ֨רֶד אַבְרָ֤ם מִצְרַ֙יְמָה֙ לָג֣וּר שָׁ֔ם כִּֽי־כָבֵ֥ד הָרָעָ֖ב בָּאָֽרֶץ׃",
          "transliteration": "Vayhi ra'av ba'aretz vayered Avrám mitzraymah lagur sham ki-javed hara'av ba'aretz.",
          "spanish": "Hubo entonces hambre en la tierra, y descendió Abram a Egipto para morar allá; porque era grande el hambre en la tierra."
        },
        {
          "verseNumber": 11,
          "verseKey": "Génesis 12:11",
          "hebrew": "וַיְהִ֕י כַּאֲשֶׁ֥ר הִקְרִ֖יב לָב֣וֹא מִצְרָ֑יְמָה וַיֹּ֙אמֶר֙ אֶל־שָׂרַ֣י אִשְׁתּ֔וֹ הִנֵּה־נָ֣א יָדַ֔עְתִּי כִּ֛י אִשָּׁ֥ה יְפַת־מַרְאֶ֖ה אָֽתְּ׃",
          "transliteration": "Vayhi ka'asher hikriv lavo mitzraymah Vayómer el-sarai ishto hineh-na yada'ti ki ishah yefat-mar'eh ate.",
          "spanish": "Y aconteció que cuando estaba para entrar en Egipto, dijo a Sarai su mujer: He aquí, ahora conozco que eres mujer de hermoso aspecto;"
        },
        {
          "verseNumber": 12,
          "verseKey": "Génesis 12:12",
          "hebrew": "וְהָיָ֗ה כִּֽי־יִרְא֤וּ אֹתָךְ֙ הַמִּצְרִ֔ים וְאָמְר֖וּ אִשְׁתּ֣וֹ זֹ֑את וְהָרְג֥וּ אֹתִ֖י וְאֹתָ֥ךְ יְחַיּֽוּ׃",
          "transliteration": "Vehayah ki-yiru otaj hamitzrim ve'amru ishto zot vehargu oti ve'otaj yejaiu.",
          "spanish": "y cuando te vean los egipcios, dirán: Su mujer es; y me matarán a mí, y a ti te reservarán la vida."
        },
        {
          "verseNumber": 13,
          "verseKey": "Génesis 12:13",
          "hebrew": "אִמְרִי־נָ֖א אֲחֹ֣תִי אָ֑תְּ לְמַ֙עַן֙ יִֽיטַב־לִ֣י בַעֲבוּרֵ֔ךְ וְחָיְתָ֥ה נַפְשִׁ֖י בִּגְלָלֵֽךְ׃",
          "transliteration": "Imri-na ajoti ate lema'an yitav-li ba'avurej vejaytah nafshi biglalej.",
          "spanish": "Ahora, pues, di que eres mi hermana, para que me vaya bien por causa tuya, y viva mi alma por causa de ti."
        }
      ]
    },
    {
      "aliyahNumber": 2,
      "nameHebrew": "שֵׁנִי",
      "nameSpanish": "2ª Aliyá (Shení)",
      "refRange": "Génesis 12:14–13:4",
      "verses": [
        {
          "verseNumber": 14,
          "verseKey": "Génesis 12:14",
          "hebrew": "וַיְהִ֕י כְּב֥וֹא אַבְרָ֖ם מִצְרָ֑יְמָה וַיִּרְא֤וּ הַמִּצְרִים֙ אֶת־הָ֣אִשָּׁ֔ה כִּֽי־יָפָ֥ה הִ֖וא מְאֹֽד׃",
          "transliteration": "Vayhi kevo Avrám mitzraymah vayiru hamitzrim et-ha'ishah ki-yafah hiv me'od.",
          "spanish": "Y aconteció que cuando entró Abram en Egipto, los egipcios vieron que la mujer era hermosa en gran manera."
        },
        {
          "verseNumber": 15,
          "verseKey": "Génesis 12:15",
          "hebrew": "וַיִּרְא֤וּ אֹתָהּ֙ שָׂרֵ֣י פַרְעֹ֔ה וַיְהַֽלְל֥וּ אֹתָ֖הּ אֶל־פַּרְעֹ֑ה וַתֻּקַּ֥ח הָאִשָּׁ֖ה בֵּ֥ית פַּרְעֹֽה׃",
          "transliteration": "Vayiru otah sarei far'oh vayhallu otah el-par'oh vatukaj ha'ishah beit par'oh.",
          "spanish": "También la vieron los príncipes de Faraón, y la alabaron delante de él; y fue llevada la mujer a casa de Faraón."
        },
        {
          "verseNumber": 16,
          "verseKey": "Génesis 12:16",
          "hebrew": "וּלְאַבְרָ֥ם הֵיטִ֖יב בַּעֲבוּרָ֑הּ וַֽיְהִי־ל֤וֹ צֹאן־וּבָקָר֙ וַחֲמֹרִ֔ים וַעֲבָדִים֙ וּשְׁפָחֹ֔ת וַאֲתֹנֹ֖ת וּגְמַלִּֽים׃",
          "transliteration": "Ul'avram heitiv ba'avurah vayhi-lo tzon-uvakar vajamorim va'avadim ushfajot va'atonot ugmalim.",
          "spanish": "E hizo bien a Abram por causa de ella; y él tuvo ovejas, vacas, asnos, siervos, criadas, asnas y camellos."
        },
        {
          "verseNumber": 17,
          "verseKey": "Génesis 12:17",
          "hebrew": "וַיְנַגַּ֨ע יְהֹוָ֧ה ׀ אֶת־פַּרְעֹ֛ה נְגָעִ֥ים גְּדֹלִ֖ים וְאֶת־בֵּית֑וֹ עַל־דְּבַ֥ר שָׂרַ֖י אֵ֥שֶׁת אַבְרָֽם׃",
          "transliteration": "Vaynaga' YHVH ׀ et-par'oh nega'im guedolim ve'et-beito al-devar sarai eshet Avrám.",
          "spanish": "Mas YHVH hirió a Faraón y a su casa con grandes plagas, por causa de Sarai mujer de Abram."
        },
        {
          "verseNumber": 18,
          "verseKey": "Génesis 12:18",
          "hebrew": "וַיִּקְרָ֤א פַרְעֹה֙ לְאַבְרָ֔ם וַיֹּ֕אמֶר מַה־זֹּ֖את עָשִׂ֣יתָ לִּ֑י לָ֚מָּה לֹא־הִגַּ֣דְתָּ לִּ֔י כִּ֥י אִשְׁתְּךָ֖ הִֽוא׃",
          "transliteration": "Vayikra far'oh Le-Avrám Vayómer mah-zot asita li lamah lo-higadta li ki ishteja hiv.",
          "spanish": "Entonces Faraón llamó a Abram, y le dijo: ¿Qué es esto que has hecho conmigo? ¿Por qué no me declaraste que era tu mujer?"
        },
        {
          "verseNumber": 19,
          "verseKey": "Génesis 12:19",
          "hebrew": "לָמָ֤ה אָמַ֙רְתָּ֙ אֲחֹ֣תִי הִ֔וא וָאֶקַּ֥ח אֹתָ֛הּ לִ֖י לְאִשָּׁ֑ה וְעַתָּ֕ה הִנֵּ֥ה אִשְׁתְּךָ֖ קַ֥ח וָלֵֽךְ׃",
          "transliteration": "Lamah amarta ajoti hiv va'ekaj otah li le'ishah ve'atah hineh ishteja kaj valej.",
          "spanish": "¿Por qué dijiste: Es mi hermana, poniéndome en ocasión de tomarla para mí por mujer? Ahora, pues, he aquí tu mujer; tómala, y vete."
        },
        {
          "verseNumber": 20,
          "verseKey": "Génesis 12:20",
          "hebrew": "וַיְצַ֥ו עָלָ֛יו פַּרְעֹ֖ה אֲנָשִׁ֑ים וַֽיְשַׁלְּח֥וּ אֹת֛וֹ וְאֶת־אִשְׁתּ֖וֹ וְאֶת־כׇּל־אֲשֶׁר־לֽוֹ׃",
          "transliteration": "Vaytzav alaiv par'oh anashim vayshaleju oto ve'et-ishto ve'et-kol-asher-lo.",
          "spanish": "Entonces Faraón dio orden a su gente acerca de Abram; y le acompañaron, y a su mujer, con todo lo que tenía."
        },
        {
          "verseNumber": 1,
          "verseKey": "Génesis 13:1",
          "hebrew": "וַיַּ֩עַל֩ אַבְרָ֨ם מִמִּצְרַ֜יִם ה֠וּא וְאִשְׁתּ֧וֹ וְכׇל־אֲשֶׁר־ל֛וֹ וְל֥וֹט עִמּ֖וֹ הַנֶּֽגְבָּה׃",
          "transliteration": "Vaya'al Avrám mimitzrayim hu ve'ishto vejol-asher-lo Ve-Lot imo hanegbah.",
          "spanish": "Subió, pues, Abram de Egipto hacia el Neguev, él y su mujer, con todo lo que tenía, y con él Lot."
        },
        {
          "verseNumber": 2,
          "verseKey": "Génesis 13:2",
          "hebrew": "וְאַבְרָ֖ם כָּבֵ֣ד מְאֹ֑ד בַּמִּקְנֶ֕ה בַּכֶּ֖סֶף וּבַזָּהָֽב׃",
          "transliteration": "Ve-Avrám kaved me'od bamikneh bakesef uvazahav.",
          "spanish": "Y Abram era riquísimo en ganado, en plata y en oro."
        },
        {
          "verseNumber": 3,
          "verseKey": "Génesis 13:3",
          "hebrew": "וַיֵּ֙לֶךְ֙ לְמַסָּעָ֔יו מִנֶּ֖גֶב וְעַד־בֵּֽית־אֵ֑ל עַד־הַמָּק֗וֹם אֲשֶׁר־הָ֨יָה שָׁ֤ם <span class=\"mam-kq-trivial\">אׇֽהֳלֹה֙</span> בַּתְּחִלָּ֔ה בֵּ֥ין בֵּֽית־אֵ֖ל וּבֵ֥ין הָעָֽי׃",
          "transliteration": "Vayélej lemasa'aiv mineguev ve'ad-beit-El ad-hamakom asher-hayah sham oholoh batejilah bein beit-El uvein ha'ai.",
          "spanish": "Y volvió por sus jornadas desde el Neguev hacia Bet-el, hasta el lugar donde había estado antes su tienda entre Bet-el y Hai,"
        },
        {
          "verseNumber": 4,
          "verseKey": "Génesis 13:4",
          "hebrew": "אֶל־מְקוֹם֙ הַמִּזְבֵּ֔חַ אֲשֶׁר־עָ֥שָׂה שָׁ֖ם בָּרִאשֹׁנָ֑ה וַיִּקְרָ֥א שָׁ֛ם אַבְרָ֖ם בְּשֵׁ֥ם יְהֹוָֽה׃",
          "transliteration": "El-mekom hamizbeaj asher-asah sham barishonah vayikra sham Avrám beshem YHVH.",
          "spanish": "al lugar del altar que había hecho allí antes; e invocó allí Abram el nombre de YHVH."
        }
      ]
    },
    {
      "aliyahNumber": 3,
      "nameHebrew": "שְׁלִישִׁי",
      "nameSpanish": "3ª Aliyá (Shlishí)",
      "refRange": "Génesis 13:5–13:18",
      "verses": [
        {
          "verseNumber": 5,
          "verseKey": "Génesis 13:5",
          "hebrew": "וְגַ֨ם־לְל֔וֹט הַהֹלֵ֖ךְ אֶת־אַבְרָ֑ם הָיָ֥ה צֹאן־וּבָקָ֖ר וְאֹהָלִֽים׃",
          "transliteration": "Vegam-lelot haholej et-Avrám hayah tzon-uvakar ve'ohalim.",
          "spanish": "También Lot, que andaba con Abram, tenía ovejas, vacas y tiendas."
        },
        {
          "verseNumber": 6,
          "verseKey": "Génesis 13:6",
          "hebrew": "וְלֹא־נָשָׂ֥א אֹתָ֛ם הָאָ֖רֶץ לָשֶׁ֣בֶת יַחְדָּ֑ו כִּֽי־הָיָ֤ה רְכוּשָׁם֙ רָ֔ב וְלֹ֥א יָֽכְל֖וּ לָשֶׁ֥בֶת יַחְדָּֽו׃",
          "transliteration": "Velo-nasa otam ha'aretz lashevet yajdav ki-hayah rejusham rav velo yajlu lashevet yajdav.",
          "spanish": "Y la tierra no era suficiente para que habitasen juntos, pues sus posesiones eran muchas, y no podían morar en un mismo lugar."
        },
        {
          "verseNumber": 7,
          "verseKey": "Génesis 13:7",
          "hebrew": "וַֽיְהִי־רִ֗יב בֵּ֚ין רֹעֵ֣י מִקְנֵֽה־אַבְרָ֔ם וּבֵ֖ין רֹעֵ֣י מִקְנֵה־ל֑וֹט וְהַֽכְּנַעֲנִי֙ וְהַפְּרִזִּ֔י אָ֖ז יֹשֵׁ֥ב בָּאָֽרֶץ׃",
          "transliteration": "Vayhi-riv bein ro'ei mikneh-Avrám uvein ro'ei mikneh-Lot vehakena'ani vehaperizi az yoshev ba'aretz.",
          "spanish": "Y hubo contienda entre los pastores del ganado de Abram y los pastores del ganado de Lot; y el cananeo y el ferezeo habitaban entonces en la tierra."
        },
        {
          "verseNumber": 8,
          "verseKey": "Génesis 13:8",
          "hebrew": "וַיֹּ֨אמֶר אַבְרָ֜ם אֶל־ל֗וֹט אַל־נָ֨א תְהִ֤י מְרִיבָה֙ בֵּינִ֣י וּבֵינֶ֔ךָ וּבֵ֥ין רֹעַ֖י וּבֵ֣ין רֹעֶ֑יךָ כִּֽי־אֲנָשִׁ֥ים אַחִ֖ים אֲנָֽחְנוּ׃",
          "transliteration": "Vayómer Avrám el-Lot al-na tehi merivah beini uveineja uvein ro'ai uvein ro'eija ki-anashim ajim anajnu.",
          "spanish": "Entonces Abram dijo a Lot: No haya ahora altercado entre nosotros dos, entre mis pastores y los tuyos, porque somos hermanos."
        },
        {
          "verseNumber": 9,
          "verseKey": "Génesis 13:9",
          "hebrew": "הֲלֹ֤א כׇל־הָאָ֙רֶץ֙ לְפָנֶ֔יךָ הִפָּ֥רֶד נָ֖א מֵעָלָ֑י אִם־הַשְּׂמֹ֣אל וְאֵימִ֔נָה וְאִם־הַיָּמִ֖ין וְאַשְׂמְאִֽילָה׃",
          "transliteration": "Halo kol-ha'aretz lefaneija hipared na me'alai im-hasemol ve'eiminah ve'im-hayamin ve'asme'ilah.",
          "spanish": "¿No está toda la tierra delante de ti? Yo te ruego que te apartes de mí. Si fueres a la mano izquierda, yo iré a la derecha; y si tú a la derecha, yo iré a la izquierda."
        },
        {
          "verseNumber": 10,
          "verseKey": "Génesis 13:10",
          "hebrew": "וַיִּשָּׂא־ל֣וֹט אֶת־עֵינָ֗יו וַיַּרְא֙ אֶת־כׇּל־כִּכַּ֣ר הַיַּרְדֵּ֔ן כִּ֥י כֻלָּ֖הּ מַשְׁקֶ֑ה לִפְנֵ֣י ׀ שַׁחֵ֣ת יְהֹוָ֗ה אֶת־סְדֹם֙ וְאֶת־עֲמֹרָ֔ה כְּגַן־יְהֹוָה֙ כְּאֶ֣רֶץ מִצְרַ֔יִם בֹּאֲכָ֖ה צֹֽעַר׃",
          "transliteration": "Vayisa-Lot et-einaiv vayar et-kol-kikar hayarden ki julah mashkeh lifnei ׀ shajet YHVH et-sedom ve'et-amorah kegan-YHVH ke'eretz mitzrayim bo'ajah tzo'ar.",
          "spanish": "Y alzó Lot sus ojos, y vio toda la llanura del Jordán, que toda ella era de riego, como el huerto de YHVH, como la tierra de Egipto en la dirección de Zoar, antes que destruyese YHVH a Sodoma y a Gomorra."
        },
        {
          "verseNumber": 11,
          "verseKey": "Génesis 13:11",
          "hebrew": "וַיִּבְחַר־ל֣וֹ ל֗וֹט אֵ֚ת כׇּל־כִּכַּ֣ר הַיַּרְדֵּ֔ן וַיִּסַּ֥ע ל֖וֹט מִקֶּ֑דֶם וַיִּפָּ֣רְד֔וּ אִ֖ישׁ מֵעַ֥ל אָחִֽיו׃",
          "transliteration": "Vayivjar-lo Lot et kol-kikar hayarden vayisa' Lot mikedem vayipardu ish me'al ajiv.",
          "spanish": "Entonces Lot escogió para sí toda la llanura del Jordán; y se fue Lot hacia el oriente, y se apartaron el uno del otro."
        },
        {
          "verseNumber": 12,
          "verseKey": "Génesis 13:12",
          "hebrew": "אַבְרָ֖ם יָשַׁ֣ב בְּאֶֽרֶץ־כְּנָ֑עַן וְל֗וֹט יָשַׁב֙ בְּעָרֵ֣י הַכִּכָּ֔ר וַיֶּאֱהַ֖ל עַד־סְדֹֽם׃",
          "transliteration": "Avrám yashav be'eretz-Canaán Ve-Lot yashav be'arei hakikar vaye'ehal ad-sedom.",
          "spanish": "Abram acampó en la tierra de Canaán, en tanto que Lot habitó en las ciudades de la llanura, y fue poniendo sus tiendas hasta Sodoma."
        },
        {
          "verseNumber": 13,
          "verseKey": "Génesis 13:13",
          "hebrew": "וְאַנְשֵׁ֣י סְדֹ֔ם רָעִ֖ים וְחַטָּאִ֑ים לַיהֹוָ֖ה מְאֹֽד׃",
          "transliteration": "Ve'anshei sedom ra'im vejata'im La-YHVH me'od.",
          "spanish": "Mas los hombres de Sodoma eran malos y pecadores contra YHVH en gran manera."
        },
        {
          "verseNumber": 14,
          "verseKey": "Génesis 13:14",
          "hebrew": "וַֽיהֹוָ֞ה אָמַ֣ר אֶל־אַבְרָ֗ם אַחֲרֵי֙ הִפָּֽרֶד־ל֣וֹט מֵֽעִמּ֔וֹ שָׂ֣א נָ֤א עֵינֶ֙יךָ֙ וּרְאֵ֔ה מִן־הַמָּק֖וֹם אֲשֶׁר־אַתָּ֣ה שָׁ֑ם צָפֹ֥נָה וָנֶ֖גְבָּה וָקֵ֥דְמָה וָיָֽמָּה׃",
          "transliteration": "Ve-YHVH amar el-Avrám ajarei hipared-Lot me'imo sa na eineija ur'eh min-hamakom asher-atah sham tzafonah vanegbah vakedmah vayamah.",
          "spanish": "Y YHVH dijo a Abram, después que Lot se apartó de él: Alza ahora tus ojos, y mira desde el lugar donde estás hacia el norte y el sur, y al oriente y al occidente."
        },
        {
          "verseNumber": 15,
          "verseKey": "Génesis 13:15",
          "hebrew": "כִּ֧י אֶת־כׇּל־הָאָ֛רֶץ אֲשֶׁר־אַתָּ֥ה רֹאֶ֖ה לְךָ֣ אֶתְּנֶ֑נָּה וּֽלְזַרְעֲךָ֖ עַד־עוֹלָֽם׃",
          "transliteration": "Ki et-kol-ha'aretz asher-atah ro'eh lejá etenenah ulzar'aja ad-olam.",
          "spanish": "Porque toda la tierra que ves, la daré a ti y a tu descendencia para siempre."
        },
        {
          "verseNumber": 16,
          "verseKey": "Génesis 13:16",
          "hebrew": "וְשַׂמְתִּ֥י אֶֽת־זַרְעֲךָ֖ כַּעֲפַ֣ר הָאָ֑רֶץ אֲשֶׁ֣ר ׀ אִם־יוּכַ֣ל אִ֗ישׁ לִמְנוֹת֙ אֶת־עֲפַ֣ר הָאָ֔רֶץ גַּֽם־זַרְעֲךָ֖ יִמָּנֶֽה׃",
          "transliteration": "Vesamti et-zar'aja ka'afar ha'aretz asher ׀ im-yujal ish limnot et-afar ha'aretz gam-zar'aja yimaneh.",
          "spanish": "Y haré tu descendencia como el polvo de la tierra; que si alguno puede contar el polvo de la tierra, también tu descendencia será contada."
        },
        {
          "verseNumber": 17,
          "verseKey": "Génesis 13:17",
          "hebrew": "ק֚וּם הִתְהַלֵּ֣ךְ בָּאָ֔רֶץ לְאׇרְכָּ֖הּ וּלְרׇחְבָּ֑הּ כִּ֥י לְךָ֖ אֶתְּנֶֽנָּה׃",
          "transliteration": "Kum hithalej ba'aretz le'orkah ulrojbah ki lejá etenenah.",
          "spanish": "Levántate, ve por la tierra a lo largo de ella y a su ancho; porque a ti la daré."
        },
        {
          "verseNumber": 18,
          "verseKey": "Génesis 13:18",
          "hebrew": "וַיֶּאֱהַ֣ל אַבְרָ֗ם וַיָּבֹ֛א וַיֵּ֛שֶׁב בְּאֵלֹנֵ֥י מַמְרֵ֖א אֲשֶׁ֣ר בְּחֶבְר֑וֹן וַיִּֽבֶן־שָׁ֥ם מִזְבֵּ֖חַ לַֽיהֹוָֽה׃",
          "transliteration": "Vaye'ehal Avrám vayavo vayeshev be'elonei mamre asher bejevron vayiven-sham mizbeaj La-YHVH.",
          "spanish": "Abram, pues, removiendo su tienda, vino y moró en el encinar de Mamre, que está en Hebrón, y edificó allí altar a YHVH."
        }
      ]
    },
    {
      "aliyahNumber": 4,
      "nameHebrew": "רְבִיעִי",
      "nameSpanish": "4ª Aliyá (Revií)",
      "refRange": "Génesis 14:1–14:20",
      "verses": [
        {
          "verseNumber": 1,
          "verseKey": "Génesis 14:1",
          "hebrew": "וַיְהִ֗י בִּימֵי֙ אַמְרָפֶ֣ל מֶֽלֶךְ־שִׁנְעָ֔ר אַרְי֖וֹךְ מֶ֣לֶךְ אֶלָּסָ֑ר כְּדׇרְלָעֹ֙מֶר֙ מֶ֣לֶךְ עֵילָ֔ם וְתִדְעָ֖ל מֶ֥לֶךְ גּוֹיִֽם׃",
          "transliteration": "Vayhi bimei amrafel melej-shin'ar aryoj melej elasar kedorla'omer melej eilam vetid'al melej goyim.",
          "spanish": "Aconteció en los días de Amrafel rey de Sinar, Arioc rey de Elasar, Quedorlaomer rey de Elam, y Tidal rey de Goim,"
        },
        {
          "verseNumber": 2,
          "verseKey": "Génesis 14:2",
          "hebrew": "עָשׂ֣וּ מִלְחָמָ֗ה אֶת־בֶּ֙רַע֙ מֶ֣לֶךְ סְדֹ֔ם וְאֶת־בִּרְשַׁ֖ע מֶ֣לֶךְ עֲמֹרָ֑ה שִׁנְאָ֣ב ׀ מֶ֣לֶךְ אַדְמָ֗ה וְשֶׁמְאֵ֙בֶר֙ מֶ֣לֶךְ <span class=\"mam-kq\"><span class=\"mam-kq-k\">(צביים)</span> <span class=\"mam-kq-q\">[צְבוֹיִ֔ם]</span></span> וּמֶ֥לֶךְ בֶּ֖לַע הִיא־צֹֽעַר׃",
          "transliteration": "Asu miljamah et-bera' melej sedom ve'et-birsha' melej amorah shin'av ׀ melej admah veshem'ever melej (tzvyym [tzvoyim umelej bela' hi-tzo'ar.",
          "spanish": "que éstos hicieron guerra contra Bera rey de Sodoma, contra Birsa rey de Gomorra, contra Sinab rey de Adma, contra Semeber rey de Zeboim, y contra el rey de Bela, la cual es Zoar."
        },
        {
          "verseNumber": 3,
          "verseKey": "Génesis 14:3",
          "hebrew": "כׇּל־אֵ֙לֶּה֙ חָֽבְר֔וּ אֶל־עֵ֖מֶק הַשִּׂדִּ֑ים ה֖וּא יָ֥ם הַמֶּֽלַח׃",
          "transliteration": "Kol-eleh javru el-emek hasidim hu yam hamelaj.",
          "spanish": "Todos éstos se juntaron en el valle de Sidim, que es el Mar Salado."
        },
        {
          "verseNumber": 4,
          "verseKey": "Génesis 14:4",
          "hebrew": "שְׁתֵּ֤ים עֶשְׂרֵה֙ שָׁנָ֔ה עָבְד֖וּ אֶת־כְּדׇרְלָעֹ֑מֶר וּשְׁלֹשׁ־עֶשְׂרֵ֥ה שָׁנָ֖ה מָרָֽדוּ׃",
          "transliteration": "Sheteim esreh shanah avdu et-kedorla'omer ushlosh-esreh shanah maradu.",
          "spanish": "Doce años habían servido a Quedorlaomer, y en el decimotercero se rebelaron."
        },
        {
          "verseNumber": 5,
          "verseKey": "Génesis 14:5",
          "hebrew": "וּבְאַרְבַּע֩ עֶשְׂרֵ֨ה שָׁנָ֜ה בָּ֣א כְדׇרְלָעֹ֗מֶר וְהַמְּלָכִים֙ אֲשֶׁ֣ר אִתּ֔וֹ וַיַּכּ֤וּ אֶת־רְפָאִים֙ בְּעַשְׁתְּרֹ֣ת קַרְנַ֔יִם וְאֶת־הַזּוּזִ֖ים בְּהָ֑ם וְאֵת֙ הָֽאֵימִ֔ים בְּשָׁוֵ֖ה קִרְיָתָֽיִם׃",
          "transliteration": "Uv'arba' esreh shanah ba jedorla'omer vehamelajim asher ito vayaku et-refa'im be'ashterot karnayim ve'et-hazuzim beham ve'et ha'eimim beshaveh kiryatayim.",
          "spanish": "Y en el año decimocuarto vino Quedorlaomer, y los reyes que estaban de su parte, y derrotaron a los refaítas en Astarot Karnaim, a los zuzitas en Ham, a los emitas en Save-quiriataim,"
        },
        {
          "verseNumber": 6,
          "verseKey": "Génesis 14:6",
          "hebrew": "וְאֶת־הַחֹרִ֖י בְּהַרְרָ֣ם שֵׂעִ֑יר עַ֚ד אֵ֣יל פָּארָ֔ן אֲשֶׁ֖ר עַל־הַמִּדְבָּֽר׃",
          "transliteration": "Ve'et-hajori beharram se'ir ad eil paran asher al-hamidbar.",
          "spanish": "y a los horeos en el monte de Seir, hasta la llanura de Parán, que está junto al desierto."
        },
        {
          "verseNumber": 7,
          "verseKey": "Génesis 14:7",
          "hebrew": "וַ֠יָּשֻׁ֠בוּ וַיָּבֹ֜אוּ אֶל־עֵ֤ין מִשְׁפָּט֙ הִ֣וא קָדֵ֔שׁ וַיַּכּ֕וּ אֶֽת־כׇּל־שְׂדֵ֖ה הָעֲמָלֵקִ֑י וְגַם֙ אֶת־הָ֣אֱמֹרִ֔י הַיֹּשֵׁ֖ב בְּחַֽצְצֹ֥ן תָּמָֽר׃",
          "transliteration": "Vayashuvu Vayavó'u el-ein mishpat hiv kadesh vayaku et-kol-sedeh ha'amaleki vegam et-ha'emori hayoshev bejatztzon tamar.",
          "spanish": "Y volvieron y vinieron a En-mispat, que es Cades, y devastaron todo el país de los amalecitas, y también al amorreo que habitaba en Hazezontamar."
        },
        {
          "verseNumber": 8,
          "verseKey": "Génesis 14:8",
          "hebrew": "וַיֵּצֵ֨א מֶֽלֶךְ־סְדֹ֜ם וּמֶ֣לֶךְ עֲמֹרָ֗ה וּמֶ֤לֶךְ אַדְמָה֙ וּמֶ֣לֶךְ <span class=\"mam-kq\"><span class=\"mam-kq-k\">(צביים)</span> <span class=\"mam-kq-q\">[צְבוֹיִ֔ם]</span></span> וּמֶ֥לֶךְ בֶּ֖לַע הִוא־צֹ֑עַר וַיַּֽעַרְכ֤וּ אִתָּם֙ מִלְחָמָ֔ה בְּעֵ֖מֶק הַשִּׂדִּֽים׃",
          "transliteration": "Vayetze melej-sedom umelej amorah umelej admah umelej (tzvyym [tzvoyim umelej bela' hiv-tzo'ar vaya'arju itam miljamah be'emek hasidim.",
          "spanish": "Y salieron el rey de Sodoma, el rey de Gomorra, el rey de Adma, el rey de Zeboim y el rey de Bela, que es Zoar, y ordenaron contra ellos batalla en el valle de Sidim;"
        },
        {
          "verseNumber": 9,
          "verseKey": "Génesis 14:9",
          "hebrew": "אֵ֣ת כְּדׇרְלָעֹ֜מֶר מֶ֣לֶךְ עֵילָ֗ם וְתִדְעָל֙ מֶ֣לֶךְ גּוֹיִ֔ם וְאַמְרָפֶל֙ מֶ֣לֶךְ שִׁנְעָ֔ר וְאַרְי֖וֹךְ מֶ֣לֶךְ אֶלָּסָ֑ר אַרְבָּעָ֥ה מְלָכִ֖ים אֶת־הַחֲמִשָּֽׁה׃",
          "transliteration": "Et kedorla'omer melej eilam vetid'al melej goyim ve'amrafel melej shin'ar ve'aryoj melej elasar arba'ah melajim et-hajamishah.",
          "spanish": "esto es, contra Quedorlaomer rey de Elam, Tidal rey de Goim, Amrafel rey de Sinar, y Arioc rey de Elasar; cuatro reyes contra cinco."
        },
        {
          "verseNumber": 10,
          "verseKey": "Génesis 14:10",
          "hebrew": "וְעֵ֣מֶק הַשִּׂדִּ֗ים בֶּֽאֱרֹ֤ת בֶּאֱרֹת֙ חֵמָ֔ר וַיָּנֻ֛סוּ מֶֽלֶךְ־סְדֹ֥ם וַעֲמֹרָ֖ה וַיִּפְּלוּ־שָׁ֑מָּה וְהַנִּשְׁאָרִ֖ים הֶ֥רָה נָּֽסוּ׃",
          "transliteration": "Ve'emek hasidim be'erot be'erot jemar vayanusu melej-sedom va'amorah vayipelu-shamah vehanish'arim herah nasu.",
          "spanish": "Y el valle de Sidim estaba lleno de pozos de asfalto; y cuando huyeron el rey de Sodoma y el de Gomorra, algunos cayeron allí; y los demás huyeron al monte."
        },
        {
          "verseNumber": 11,
          "verseKey": "Génesis 14:11",
          "hebrew": "וַ֠יִּקְח֠וּ אֶת־כׇּל־רְכֻ֨שׁ סְדֹ֧ם וַעֲמֹרָ֛ה וְאֶת־כׇּל־אׇכְלָ֖ם וַיֵּלֵֽכוּ׃",
          "transliteration": "Vayikju et-kol-rejush sedom va'amorah ve'et-kol-ojlam vayeleju.",
          "spanish": "Y tomaron toda la riqueza de Sodoma y de Gomorra, y todas sus provisiones, y se fueron."
        },
        {
          "verseNumber": 12,
          "verseKey": "Génesis 14:12",
          "hebrew": "וַיִּקְח֨וּ אֶת־ל֧וֹט וְאֶת־רְכֻשׁ֛וֹ בֶּן־אֲחִ֥י אַבְרָ֖ם וַיֵּלֵ֑כוּ וְה֥וּא יֹשֵׁ֖ב בִּסְדֹֽם׃",
          "transliteration": "Vayikju et-Lot ve'et-rejusho ben-aji Avrám vayeleju vehu yoshev bisdom.",
          "spanish": "Tomaron también a Lot, hijo del hermano de Abram, que moraba en Sodoma, y sus bienes, y se fueron."
        },
        {
          "verseNumber": 13,
          "verseKey": "Génesis 14:13",
          "hebrew": "וַיָּבֹא֙ הַפָּלִ֔יט וַיַּגֵּ֖ד לְאַבְרָ֣ם הָעִבְרִ֑י וְהוּא֩ שֹׁכֵ֨ן בְּאֵֽלֹנֵ֜י מַמְרֵ֣א הָאֱמֹרִ֗י אֲחִ֤י אֶשְׁכֹּל֙ וַאֲחִ֣י עָנֵ֔ר וְהֵ֖ם בַּעֲלֵ֥י בְרִית־אַבְרָֽם׃",
          "transliteration": "Vayavo hapalit vayagued Le-Avrám ha'ivri vehu shojen be'elonei mamre ha'emori aji eshkol va'aji aner vehem ba'alei berit-Avrám.",
          "spanish": "Y vino uno de los que escaparon, y lo anunció a Abram el hebreo, que habitaba en el encinar de Mamre el amorreo, hermano de Escol y hermano de Aner, los cuales eran aliados de Abram."
        },
        {
          "verseNumber": 14,
          "verseKey": "Génesis 14:14",
          "hebrew": "וַיִּשְׁמַ֣ע אַבְרָ֔ם כִּ֥י נִשְׁבָּ֖ה אָחִ֑יו וַיָּ֨רֶק אֶת־חֲנִיכָ֜יו יְלִידֵ֣י בֵית֗וֹ שְׁמֹנָ֤ה עָשָׂר֙ וּשְׁלֹ֣שׁ מֵא֔וֹת וַיִּרְדֹּ֖ף עַד־דָּֽן׃",
          "transliteration": "Vayishma' Avrám ki nishbah ajiv vayarek et-janijaiv yelidei beito shemonah asar ushlosh meot vayirdof ad-dan.",
          "spanish": "Oyó Abram que su pariente estaba prisionero, y armó a sus criados, los nacidos en su casa, trescientos dieciocho, y los siguió hasta Dan."
        },
        {
          "verseNumber": 15,
          "verseKey": "Génesis 14:15",
          "hebrew": "וַיֵּחָלֵ֨ק עֲלֵיהֶ֧ם ׀ לַ֛יְלָה ה֥וּא וַעֲבָדָ֖יו וַיַּכֵּ֑ם וַֽיִּרְדְּפֵם֙ עַד־חוֹבָ֔ה אֲשֶׁ֥ר מִשְּׂמֹ֖אל לְדַמָּֽשֶׂק׃",
          "transliteration": "Vayejalek aleihem ׀ laylah hu va'avadaiv vayakem vayirdefem ad-jovah asher misemol ledamasek.",
          "spanish": "Y cayó sobre ellos de noche, él y sus siervos, y les atacó, y les fue siguiendo hasta Hoba al norte de Damasco."
        },
        {
          "verseNumber": 16,
          "verseKey": "Génesis 14:16",
          "hebrew": "וַיָּ֕שֶׁב אֵ֖ת כׇּל־הָרְכֻ֑שׁ וְגַם֩ אֶת־ל֨וֹט אָחִ֤יו וּרְכֻשׁוֹ֙ הֵשִׁ֔יב וְגַ֥ם אֶת־הַנָּשִׁ֖ים וְאֶת־הָעָֽם׃",
          "transliteration": "Vayashev et kol-harjush vegam et-Lot ajiv urjusho heshiv vegam et-hanashim ve'et-ha'am.",
          "spanish": "Y recobró todos los bienes, y también a Lot su pariente y sus bienes, y a las mujeres y demás gente."
        },
        {
          "verseNumber": 17,
          "verseKey": "Génesis 14:17",
          "hebrew": "וַיֵּצֵ֣א מֶֽלֶךְ־סְדֹם֮ לִקְרָאתוֹ֒ אַחֲרֵ֣י שׁוּב֗וֹ מֵֽהַכּוֹת֙ אֶת־כְּדׇרְלָעֹ֔מֶר וְאֶת־הַמְּלָכִ֖ים אֲשֶׁ֣ר אִתּ֑וֹ אֶל־עֵ֣מֶק שָׁוֵ֔ה ה֖וּא עֵ֥מֶק הַמֶּֽלֶךְ׃",
          "transliteration": "Vayetze melej-sedom likrato ajarei shuvo mehakot et-kedorla'omer ve'et-hamelajim asher ito el-emek shaveh hu emek hamelej.",
          "spanish": "Cuando volvía de la derrota de Quedorlaomer y de los reyes que con él estaban, salió el rey de Sodoma a recibirlo al valle de Save, que es el Valle del Rey."
        },
        {
          "verseNumber": 18,
          "verseKey": "Génesis 14:18",
          "hebrew": "וּמַלְכִּי־צֶ֙דֶק֙ מֶ֣לֶךְ שָׁלֵ֔ם הוֹצִ֖יא לֶ֣חֶם וָיָ֑יִן וְה֥וּא כֹהֵ֖ן לְאֵ֥ל עֶלְיֽוֹן׃",
          "transliteration": "Umalki-tzedek melej shalem hotzi lejem vayayin vehu johen le'el elyon.",
          "spanish": "Entonces Melquisedec, rey de Salem y Kohén del Elohim Altísimo, sacó pan y vino;"
        },
        {
          "verseNumber": 19,
          "verseKey": "Génesis 14:19",
          "hebrew": "וַֽיְבָרְכֵ֖הוּ וַיֹּאמַ֑ר בָּר֤וּךְ אַבְרָם֙ לְאֵ֣ל עֶלְי֔וֹן קֹנֵ֖ה שָׁמַ֥יִם וָאָֽרֶץ׃",
          "transliteration": "Vayvarjehu vayomar baruj Avrám le'el elyon koneh shamayim va'aretz.",
          "spanish": "y le bendijo, diciendo: Bendito sea Abram del Elohim Altísimo, creador de los cielos y de la tierra;"
        },
        {
          "verseNumber": 20,
          "verseKey": "Génesis 14:20",
          "hebrew": "וּבָרוּךְ֙ אֵ֣ל עֶלְי֔וֹן אֲשֶׁר־מִגֵּ֥ן צָרֶ֖יךָ בְּיָדֶ֑ךָ וַיִּתֶּן־ל֥וֹ מַעֲשֵׂ֖ר מִכֹּֽל׃",
          "transliteration": "Uvaruj El elyon asher-miguen tzareija beyadeja vayiten-lo ma'aser mikol.",
          "spanish": "y bendito sea el Elohim Altísimo, que entregó tus enemigos en tu mano. Y le dio Abram los diezmos de todo."
        }
      ]
    },
    {
      "aliyahNumber": 5,
      "nameHebrew": "חֲמִישִׁי",
      "nameSpanish": "5ª Aliyá (Jamishí)",
      "refRange": "Génesis 14:21–15:6",
      "verses": [
        {
          "verseNumber": 21,
          "verseKey": "Génesis 14:21",
          "hebrew": "וַיֹּ֥אמֶר מֶֽלֶךְ־סְדֹ֖ם אֶל־אַבְרָ֑ם תֶּן־לִ֣י הַנֶּ֔פֶשׁ וְהָרְכֻ֖שׁ קַֽח־לָֽךְ׃",
          "transliteration": "Vayómer melej-sedom el-Avrám ten-li hanefesh veharjush kaj-laj.",
          "spanish": "Entonces el rey de Sodoma dijo a Abram: Dame las personas, y toma para ti los bienes."
        },
        {
          "verseNumber": 22,
          "verseKey": "Génesis 14:22",
          "hebrew": "וַיֹּ֥אמֶר אַבְרָ֖ם אֶל־מֶ֣לֶךְ סְדֹ֑ם הֲרִמֹ֨תִי יָדִ֤י אֶל־יְהֹוָה֙ אֵ֣ל עֶלְי֔וֹן קֹנֵ֖ה שָׁמַ֥יִם וָאָֽרֶץ׃",
          "transliteration": "Vayómer Avrám el-melej sedom harimoti yadi el-YHVH El elyon koneh shamayim va'aretz.",
          "spanish": "Y respondió Abram al rey de Sodoma: He alzado mi mano a YHVH Elohim Altísimo, creador de los cielos y de la tierra,"
        },
        {
          "verseNumber": 23,
          "verseKey": "Génesis 14:23",
          "hebrew": "אִם־מִחוּט֙ וְעַ֣ד שְׂרֽוֹךְ־נַ֔עַל וְאִם־אֶקַּ֖ח מִכׇּל־אֲשֶׁר־לָ֑ךְ וְלֹ֣א תֹאמַ֔ר אֲנִ֖י הֶעֱשַׁ֥רְתִּי אֶת־אַבְרָֽם׃",
          "transliteration": "Im-mijut ve'ad seroj-na'al ve'im-ekaj mikol-asher-laj velo tomar ani he'esharti et-Avrám.",
          "spanish": "que desde un hilo hasta una correa de calzado, nada tomaré de todo lo que es tuyo, para que no digas: Yo enriquecí a Abram;"
        },
        {
          "verseNumber": 24,
          "verseKey": "Génesis 14:24",
          "hebrew": "בִּלְעָדַ֗י רַ֚ק אֲשֶׁ֣ר אָֽכְל֣וּ הַנְּעָרִ֔ים וְחֵ֙לֶק֙ הָֽאֲנָשִׁ֔ים אֲשֶׁ֥ר הָלְכ֖וּ אִתִּ֑י עָנֵר֙ אֶשְׁכֹּ֣ל וּמַמְרֵ֔א הֵ֖ם יִקְח֥וּ חֶלְקָֽם׃",
          "transliteration": "Bil'adai rak asher ajlu hane'arim vejelek ha'anashim asher halju iti aner eshkol umamre hem yikju jelkam.",
          "spanish": "excepto solamente lo que comieron los jóvenes, y la parte de los varones que fueron conmigo, Aner, Escol y Mamre, los cuales tomarán su parte."
        },
        {
          "verseNumber": 1,
          "verseKey": "Génesis 15:1",
          "hebrew": "אַחַ֣ר ׀ הַדְּבָרִ֣ים הָאֵ֗לֶּה הָיָ֤ה דְבַר־יְהֹוָה֙ אֶל־אַבְרָ֔ם בַּֽמַּחֲזֶ֖ה לֵאמֹ֑ר אַל־תִּירָ֣א אַבְרָ֗ם אָנֹכִי֙ מָגֵ֣ן לָ֔ךְ שְׂכָרְךָ֖ הַרְבֵּ֥ה מְאֹֽד׃",
          "transliteration": "Ajar ׀ hadevarim ha'eleh hayah devar-YHVH el-Avrám bamajazeh lemor al-tira Avrám anoji maguen laj sejarja harbeh me'od.",
          "spanish": "Después de estas cosas vino la palabra de YHVH a Abram en visión, diciendo: No temas, Abram; yo soy tu escudo, y tu galardón será sobremanera grande."
        },
        {
          "verseNumber": 2,
          "verseKey": "Génesis 15:2",
          "hebrew": "וַיֹּ֣אמֶר אַבְרָ֗ם אֲדֹנָ֤י יֱהֹוִה֙ מַה־תִּתֶּן־לִ֔י וְאָנֹכִ֖י הוֹלֵ֣ךְ עֲרִירִ֑י וּבֶן־מֶ֣שֶׁק בֵּיתִ֔י ה֖וּא דַּמֶּ֥שֶׂק אֱלִיעֶֽזֶר׃",
          "transliteration": "Vayómer Avrám Adonái YHVH mah-titen-li ve'anoji holej ariri uven-meshek beiti hu damesek eli'ezer.",
          "spanish": "Y respondió Abram: HaShem YHVH, ¿qué me darás, siendo así que ando sin hijo, y el mayordomo de mi casa es ese damasceno Eliezer?"
        },
        {
          "verseNumber": 3,
          "verseKey": "Génesis 15:3",
          "hebrew": "וַיֹּ֣אמֶר אַבְרָ֔ם הֵ֣ן לִ֔י לֹ֥א נָתַ֖תָּה זָ֑רַע וְהִנֵּ֥ה בֶן־בֵּיתִ֖י יוֹרֵ֥שׁ אֹתִֽי׃",
          "transliteration": "Vayómer Avrám hen li lo natatah zara' vehineh ben-beiti yoresh oti.",
          "spanish": "Dijo también Abram: Mira que no me has dado prole, y he aquí que será mi heredero un esclavo nacido en mi casa."
        },
        {
          "verseNumber": 4,
          "verseKey": "Génesis 15:4",
          "hebrew": "וְהִנֵּ֨ה דְבַר־יְהֹוָ֤ה אֵלָיו֙ לֵאמֹ֔ר לֹ֥א יִֽירָשְׁךָ֖ זֶ֑ה כִּי־אִם֙ אֲשֶׁ֣ר יֵצֵ֣א מִמֵּעֶ֔יךָ ה֖וּא יִֽירָשֶֽׁךָ׃",
          "transliteration": "Vehineh devar-YHVH elaiv lemor lo yirashja zeh ki-im asher yetze mime'eija hu yirasheja.",
          "spanish": "Luego vino a él palabra de YHVH, diciendo: No te heredará éste, sino un hijo tuyo será el que te heredará."
        },
        {
          "verseNumber": 5,
          "verseKey": "Génesis 15:5",
          "hebrew": "וַיּוֹצֵ֨א אֹת֜וֹ הַח֗וּצָה וַיֹּ֙אמֶר֙ הַבֶּט־נָ֣א הַשָּׁמַ֗יְמָה וּסְפֹר֙ הַכּ֣וֹכָבִ֔ים אִם־תּוּכַ֖ל לִסְפֹּ֣ר אֹתָ֑ם וַיֹּ֣אמֶר ל֔וֹ כֹּ֥ה יִהְיֶ֖ה זַרְעֶֽךָ׃",
          "transliteration": "Vaiotze oto hajutzah Vayómer habet-na hashamaymah usfor hakojavim im-tujal lispor otam Vayómer lo koh yihyeh zar'eja.",
          "spanish": "Y lo llevó fuera, y le dijo: Mira ahora los cielos, y cuenta las estrellas, si las puedes contar. Y le dijo: Así será tu descendencia."
        },
        {
          "verseNumber": 6,
          "verseKey": "Génesis 15:6",
          "hebrew": "וְהֶאֱמִ֖ן בַּֽיהֹוָ֑ה וַיַּחְשְׁבֶ֥הָ לּ֖וֹ צְדָקָֽה׃",
          "transliteration": "Vehe'emin Ba-YHVH vayajsheveha lo tzedakah.",
          "spanish": "Y creyó a YHVH, y le fue contado por justicia."
        }
      ]
    },
    {
      "aliyahNumber": 6,
      "nameHebrew": "שִׁשִּׁי",
      "nameSpanish": "6ª Aliyá (Shishí)",
      "refRange": "Génesis 15:7–17:6",
      "verses": [
        {
          "verseNumber": 7,
          "verseKey": "Génesis 15:7",
          "hebrew": "וַיֹּ֖אמֶר אֵלָ֑יו אֲנִ֣י יְהֹוָ֗ה אֲשֶׁ֤ר הוֹצֵאתִ֙יךָ֙ מֵא֣וּר כַּשְׂדִּ֔ים לָ֧תֶת לְךָ֛ אֶת־הָאָ֥רֶץ הַזֹּ֖את לְרִשְׁתָּֽהּ׃",
          "transliteration": "Vayómer elaiv ani YHVH asher hotzetija meur kasdim latet lejá et-ha'aretz hazot lerishtah.",
          "spanish": "Y le dijo: Yo soy YHVH, que te saqué de Ur de los caldeos, para darte a heredar esta tierra."
        },
        {
          "verseNumber": 8,
          "verseKey": "Génesis 15:8",
          "hebrew": "וַיֹּאמַ֑ר אֲדֹנָ֣י יֱהֹוִ֔ה בַּמָּ֥ה אֵדַ֖ע כִּ֥י אִֽירָשֶֽׁנָּה׃",
          "transliteration": "Vayomar Adonái YHVH bamah eda' ki irashenah.",
          "spanish": "Y él respondió: HaShem YHVH, ¿en qué conoceré que la he de heredar?"
        },
        {
          "verseNumber": 9,
          "verseKey": "Génesis 15:9",
          "hebrew": "וַיֹּ֣אמֶר אֵלָ֗יו קְחָ֥ה לִי֙ עֶגְלָ֣ה מְשֻׁלֶּ֔שֶׁת וְעֵ֥ז מְשֻׁלֶּ֖שֶׁת וְאַ֣יִל מְשֻׁלָּ֑שׁ וְתֹ֖ר וְגוֹזָֽל׃",
          "transliteration": "Vayómer elaiv kejah li eglah meshuleshet ve'ez meshuleshet ve'ayil meshulash vetor vegozal.",
          "spanish": "Y le dijo: Tráeme una becerra de tres años, y una cabra de tres años, y un carnero de tres años, una tórtola también, y un palomino."
        },
        {
          "verseNumber": 10,
          "verseKey": "Génesis 15:10",
          "hebrew": "וַיִּֽקַּֽח־ל֣וֹ אֶת־כׇּל־אֵ֗לֶּה וַיְבַתֵּ֤ר אֹתָם֙ בַּתָּ֔וֶךְ וַיִּתֵּ֥ן אִישׁ־בִּתְר֖וֹ לִקְרַ֣את רֵעֵ֑הוּ וְאֶת־הַצִּפֹּ֖ר לֹ֥א בָתָֽר׃",
          "transliteration": "Vayikaj-lo et-kol-eleh vayvater otam batavej vayiten ish-bitro likrat re'ehu ve'et-hatzipor lo batar.",
          "spanish": "Y tomó él todo esto, y los partió por la mitad, y puso cada mitad una enfrente de la otra; mas no partió las aves."
        },
        {
          "verseNumber": 11,
          "verseKey": "Génesis 15:11",
          "hebrew": "וַיֵּ֥רֶד הָעַ֖יִט עַל־הַפְּגָרִ֑ים וַיַּשֵּׁ֥ב אֹתָ֖ם אַבְרָֽם׃",
          "transliteration": "Vayered ha'ayit al-hapegarim vayashev otam Avrám.",
          "spanish": "Y descendían aves de rapiña sobre los cuerpos muertos, y Abram las ahuyentaba."
        },
        {
          "verseNumber": 12,
          "verseKey": "Génesis 15:12",
          "hebrew": "וַיְהִ֤י הַשֶּׁ֙מֶשׁ֙ לָב֔וֹא וְתַרְדֵּמָ֖ה נָפְלָ֣ה עַל־אַבְרָ֑ם וְהִנֵּ֥ה אֵימָ֛ה חֲשֵׁכָ֥ה גְדֹלָ֖ה נֹפֶ֥לֶת עָלָֽיו׃",
          "transliteration": "Vayhi hashemesh lavo vetardemah naflah al-Avrám vehineh eimah jashejah guedolah nofelet alaiv.",
          "spanish": "Mas a la caída del sol sobrecogió el sueño a Abram, y he aquí que el temor de una grande oscuridad cayó sobre él."
        },
        {
          "verseNumber": 13,
          "verseKey": "Génesis 15:13",
          "hebrew": "וַיֹּ֣אמֶר לְאַבְרָ֗ם יָדֹ֨עַ תֵּדַ֜ע כִּי־גֵ֣ר ׀ יִהְיֶ֣ה זַרְעֲךָ֗ בְּאֶ֙רֶץ֙ לֹ֣א לָהֶ֔ם וַעֲבָד֖וּם וְעִנּ֣וּ אֹתָ֑ם אַרְבַּ֥ע מֵא֖וֹת שָׁנָֽה׃",
          "transliteration": "Vayómer Le-Avrám yadoa' teda' ki-guer ׀ yihyeh zar'aja be'eretz lo lahem va'avadum ve'inu otam arba' meot shanah.",
          "spanish": "Entonces YHVH dijo a Abram: Ten por cierto que tu descendencia morará en tierra ajena, y será esclava allí, y será oprimida cuatrocientos años."
        },
        {
          "verseNumber": 14,
          "verseKey": "Génesis 15:14",
          "hebrew": "וְגַ֧ם אֶת־הַגּ֛וֹי אֲשֶׁ֥ר יַעֲבֹ֖דוּ דָּ֣ן אָנֹ֑כִי וְאַחֲרֵי־כֵ֥ן יֵצְא֖וּ בִּרְכֻ֥שׁ גָּדֽוֹל׃",
          "transliteration": "Vegam et-hagoy asher ya'avodu dan anoji ve'ajarei-jen yetzu birjush gadol.",
          "spanish": "Mas también a la nación a la cual servirán, juzgaré yo; y después de esto saldrán con gran riqueza."
        },
        {
          "verseNumber": 15,
          "verseKey": "Génesis 15:15",
          "hebrew": "וְאַתָּ֛ה תָּב֥וֹא אֶל־אֲבֹתֶ֖יךָ בְּשָׁל֑וֹם תִּקָּבֵ֖ר בְּשֵׂיבָ֥ה טוֹבָֽה׃",
          "transliteration": "Ve'atah tavo el-avoteija beshalom tikaver beseivah tovah.",
          "spanish": "Y tú vendrás a tus padres en paz, y serás sepultado en buena vejez."
        },
        {
          "verseNumber": 16,
          "verseKey": "Génesis 15:16",
          "hebrew": "וְד֥וֹר רְבִיעִ֖י יָשׁ֣וּבוּ הֵ֑נָּה כִּ֧י לֹא־שָׁלֵ֛ם עֲוֺ֥ן הָאֱמֹרִ֖י עַד־הֵֽנָּה׃",
          "transliteration": "Vedor revi'i yashuvu henah ki lo-shalem aon ha'emori ad-henah.",
          "spanish": "Y en la cuarta generación volverán acá; porque aún no ha llegado a su colmo la maldad del amorreo hasta aquí."
        },
        {
          "verseNumber": 17,
          "verseKey": "Génesis 15:17",
          "hebrew": "וַיְהִ֤י הַשֶּׁ֙מֶשׁ֙ בָּ֔אָה וַעֲלָטָ֖ה הָיָ֑ה וְהִנֵּ֨ה תַנּ֤וּר עָשָׁן֙ וְלַפִּ֣יד אֵ֔שׁ אֲשֶׁ֣ר עָבַ֔ר בֵּ֖ין הַגְּזָרִ֥ים הָאֵֽלֶּה׃",
          "transliteration": "Vayhi hashemesh ba'ah va'alatah hayah vehineh tanur ashan velapid esh asher avar bein haguezarim ha'eleh.",
          "spanish": "Y sucedió que puesto el sol, y ya oscurecido, se veía un horno humeando, y una antorcha de fuego que pasaba por entre los animales divididos."
        },
        {
          "verseNumber": 18,
          "verseKey": "Génesis 15:18",
          "hebrew": "בַּיּ֣וֹם הַה֗וּא כָּרַ֧ת יְהֹוָ֛ה אֶת־אַבְרָ֖ם בְּרִ֣ית לֵאמֹ֑ר לְזַרְעֲךָ֗ נָתַ֙תִּי֙ אֶת־הָאָ֣רֶץ הַזֹּ֔את מִנְּהַ֣ר מִצְרַ֔יִם עַד־הַנָּהָ֥ר הַגָּדֹ֖ל נְהַר־פְּרָֽת׃",
          "transliteration": "Baiom hahu karat YHVH et-Avrám berit lemor lezar'aja natati et-ha'aretz hazot minehar mitzrayim ad-hanahar hagadol nehar-perat.",
          "spanish": "En aquel día hizo YHVH un pacto con Abram, diciendo: A tu descendencia daré esta tierra, desde el río de Egipto hasta el río grande, el río Eufrates;"
        },
        {
          "verseNumber": 19,
          "verseKey": "Génesis 15:19",
          "hebrew": "אֶת־הַקֵּינִי֙ וְאֶת־הַקְּנִזִּ֔י וְאֵ֖ת הַקַּדְמֹנִֽי׃",
          "transliteration": "Et-hakeini ve'et-hakenizi ve'et hakadmoni.",
          "spanish": "la tierra de los ceneos, los cenezeos, los admoneos,"
        },
        {
          "verseNumber": 20,
          "verseKey": "Génesis 15:20",
          "hebrew": "וְאֶת־הַחִתִּ֥י וְאֶת־הַפְּרִזִּ֖י וְאֶת־הָרְפָאִֽים׃",
          "transliteration": "Ve'et-hajiti ve'et-haperizi ve'et-harfa'im.",
          "spanish": "los heteos, los ferezeos, los refaítas,"
        },
        {
          "verseNumber": 21,
          "verseKey": "Génesis 15:21",
          "hebrew": "וְאֶת־הָֽאֱמֹרִי֙ וְאֶת־הַֽכְּנַעֲנִ֔י וְאֶת־הַגִּרְגָּשִׁ֖י וְאֶת־הַיְבוּסִֽי׃",
          "transliteration": "Ve'et-ha'emori ve'et-hakena'ani ve'et-haguirgashi ve'et-hayvusi.",
          "spanish": "los amorreos, los cananeos, los gergeseos y los jebuseos."
        },
        {
          "verseNumber": 1,
          "verseKey": "Génesis 16:1",
          "hebrew": "וְשָׂרַי֙ אֵ֣שֶׁת אַבְרָ֔ם לֹ֥א יָלְדָ֖ה ל֑וֹ וְלָ֛הּ שִׁפְחָ֥ה מִצְרִ֖ית וּשְׁמָ֥הּ הָגָֽר׃",
          "transliteration": "Ve-Sarái eshet Avrám lo yaldah lo velah shifjah mitzrit ushmah hagar.",
          "spanish": "Sarai mujer de Abram no le daba hijos; y ella tenía una sierva egipcia, que se llamaba Agar."
        },
        {
          "verseNumber": 2,
          "verseKey": "Génesis 16:2",
          "hebrew": "וַתֹּ֨אמֶר שָׂרַ֜י אֶל־אַבְרָ֗ם הִנֵּה־נָ֞א עֲצָרַ֤נִי יְהֹוָה֙ מִלֶּ֔דֶת בֹּא־נָא֙ אֶל־שִׁפְחָתִ֔י אוּלַ֥י אִבָּנֶ֖ה מִמֶּ֑נָּה וַיִּשְׁמַ֥ע אַבְרָ֖ם לְק֥וֹל שָׂרָֽי׃",
          "transliteration": "Vatomer sarai el-Avrám hineh-na atzarani YHVH miledet bo-na el-shifjati ulai ibaneh mimenah vayishma' Avrám lekol sarai.",
          "spanish": "Dijo entonces Sarai a Abram: Ya ves que YHVH me ha hecho estéril; te ruego, pues, que te llegues a mi sierva; quizá tendré hijos de ella. Y atendió Abram al ruego de Sarai."
        },
        {
          "verseNumber": 3,
          "verseKey": "Génesis 16:3",
          "hebrew": "וַתִּקַּ֞ח שָׂרַ֣י אֵֽשֶׁת־אַבְרָ֗ם אֶת־הָגָ֤ר הַמִּצְרִית֙ שִׁפְחָתָ֔הּ מִקֵּץ֙ עֶ֣שֶׂר שָׁנִ֔ים לְשֶׁ֥בֶת אַבְרָ֖ם בְּאֶ֣רֶץ כְּנָ֑עַן וַתִּתֵּ֥ן אֹתָ֛הּ לְאַבְרָ֥ם אִישָׁ֖הּ ל֥וֹ לְאִשָּֽׁה׃",
          "transliteration": "Vatikaj sarai eshet-Avrám et-hagar hamitzrit shifjatah miketz eser shanim leshevet Avrám be'eretz Canaán vatiten otah Le-Avrám ishah lo le'ishah.",
          "spanish": "Y Sarai mujer de Abram tomó a Agar su sierva egipcia, al cabo de diez años que había habitado Abram en la tierra de Canaán, y la dio por mujer a Abram su marido."
        },
        {
          "verseNumber": 4,
          "verseKey": "Génesis 16:4",
          "hebrew": "וַיָּבֹ֥א אֶל־הָגָ֖ר וַתַּ֑הַר וַתֵּ֙רֶא֙ כִּ֣י הָרָ֔תָה וַתֵּקַ֥ל גְּבִרְתָּ֖הּ בְּעֵינֶֽיהָ׃",
          "transliteration": "Vayavo el-hagar vatahar vatere ki haratah vatekal guevirtah be'eineiha.",
          "spanish": "Y él se llegó a Agar, la cual concibió; y cuando vio que había concebido, miraba con desprecio a su señora."
        },
        {
          "verseNumber": 5,
          "verseKey": "Génesis 16:5",
          "hebrew": "וַתֹּ֨אמֶר שָׂרַ֣י אֶל־אַבְרָם֮ חֲמָסִ֣י עָלֶ֒יךָ֒ אָנֹכִ֗י נָתַ֤תִּי שִׁפְחָתִי֙ בְּחֵיקֶ֔ךָ וַתֵּ֙רֶא֙ כִּ֣י הָרָ֔תָה וָאֵקַ֖ל בְּעֵינֶ֑יהָ יִשְׁפֹּ֥ט יְהֹוָ֖ה בֵּינִ֥י וּבֵינֶֽיׄךָ׃",
          "transliteration": "Vatomer sarai el-Avrám jamasi aleija anoji natati shifjati bejeikeja vatere ki haratah va'ekal be'eineiha yishpot YHVH beini uveineija.",
          "spanish": "Entonces Sarai dijo a Abram: Mi afrenta sea sobre ti; yo te di mi sierva por mujer, y viéndose encinta, me mira con desprecio; juzgue YHVH entre tú y yo."
        },
        {
          "verseNumber": 6,
          "verseKey": "Génesis 16:6",
          "hebrew": "וַיֹּ֨אמֶר אַבְרָ֜ם אֶל־שָׂרַ֗י הִנֵּ֤ה שִׁפְחָתֵךְ֙ בְּיָדֵ֔ךְ עֲשִׂי־לָ֖הּ הַטּ֣וֹב בְּעֵינָ֑יִךְ וַתְּעַנֶּ֣הָ שָׂרַ֔י וַתִּבְרַ֖ח מִפָּנֶֽיהָ׃",
          "transliteration": "Vayómer Avrám el-sarai hineh shifjatej beyadej asi-lah hatov be'einayij vate'aneha sarai vativraj mipaneiha.",
          "spanish": "Y respondió Abram a Sarai: He aquí, tu sierva está en tu mano; haz con ella lo que bien te parezca. Y como Sarai la afligía, ella huyó de su presencia."
        },
        {
          "verseNumber": 7,
          "verseKey": "Génesis 16:7",
          "hebrew": "וַֽיִּמְצָאָ֞הּ מַלְאַ֧ךְ יְהֹוָ֛ה עַל־עֵ֥ין הַמַּ֖יִם בַּמִּדְבָּ֑ר עַל־הָעַ֖יִן בְּדֶ֥רֶךְ שֽׁוּר׃",
          "transliteration": "Vayimtza'ah mal'aj YHVH al-ein hamayim bamidbar al-ha'ayin bederej shur.",
          "spanish": "Y la halló el ángel de YHVH junto a una fuente de agua en el desierto, junto a la fuente que está en el camino de Shur."
        },
        {
          "verseNumber": 8,
          "verseKey": "Génesis 16:8",
          "hebrew": "וַיֹּאמַ֗ר הָגָ֞ר שִׁפְחַ֥ת שָׂרַ֛י אֵֽי־מִזֶּ֥ה בָ֖את וְאָ֣נָה תֵלֵ֑כִי וַתֹּ֕אמֶר מִפְּנֵי֙ שָׂרַ֣י גְּבִרְתִּ֔י אָנֹכִ֖י בֹּרַֽחַת׃",
          "transliteration": "Vayomar hagar shifjat sarai ei-mizeh bat ve'anah teleji vatomer mipenei sarai guevirti anoji borajat.",
          "spanish": "Y le dijo: Agar, sierva de Sarai, ¿de dónde vienes tú, y a dónde vas? Y ella respondió: Huyo de delante de Sarai mi señora."
        },
        {
          "verseNumber": 9,
          "verseKey": "Génesis 16:9",
          "hebrew": "וַיֹּ֤אמֶר לָהּ֙ מַלְאַ֣ךְ יְהֹוָ֔ה שׁ֖וּבִי אֶל־גְּבִרְתֵּ֑ךְ וְהִתְעַנִּ֖י תַּ֥חַת יָדֶֽיהָ׃",
          "transliteration": "Vayómer lah mal'aj YHVH shuvi el-guevirtej vehit'ani tajat yadeiha.",
          "spanish": "Y le dijo el ángel de YHVH: Vuélvete a tu señora, y ponte sumisa bajo su mano."
        },
        {
          "verseNumber": 10,
          "verseKey": "Génesis 16:10",
          "hebrew": "וַיֹּ֤אמֶר לָהּ֙ מַלְאַ֣ךְ יְהֹוָ֔ה הַרְבָּ֥ה אַרְבֶּ֖ה אֶת־זַרְעֵ֑ךְ וְלֹ֥א יִסָּפֵ֖ר מֵרֹֽב׃",
          "transliteration": "Vayómer lah mal'aj YHVH harbah arbeh et-zar'ej velo yisafer merov.",
          "spanish": "Le dijo también el ángel de YHVH: Multiplicaré tanto tu descendencia, que no podrá ser contada a causa de la multitud."
        },
        {
          "verseNumber": 11,
          "verseKey": "Génesis 16:11",
          "hebrew": "וַיֹּ֤אמֶר לָהּ֙ מַלְאַ֣ךְ יְהֹוָ֔ה הִנָּ֥ךְ הָרָ֖ה וְיֹלַ֣דְתְּ בֵּ֑ן וְקָרָ֤את שְׁמוֹ֙ יִשְׁמָעֵ֔אל כִּֽי־שָׁמַ֥ע יְהֹוָ֖ה אֶל־עׇנְיֵֽךְ׃",
          "transliteration": "Vayómer lah mal'aj YHVH hinaj harah veyoladte ben vekarat shemo yishma'el ki-shama' YHVH el-onyej.",
          "spanish": "Además le dijo el ángel de YHVH: He aquí que has concebido, y darás a luz un hijo, y llamarás su nombre Ismael, porque YHVH ha oído tu aflicción."
        },
        {
          "verseNumber": 12,
          "verseKey": "Génesis 16:12",
          "hebrew": "וְה֤וּא יִהְיֶה֙ פֶּ֣רֶא אָדָ֔ם יָד֣וֹ בַכֹּ֔ל וְיַ֥ד כֹּ֖ל בּ֑וֹ וְעַל־פְּנֵ֥י כׇל־אֶחָ֖יו יִשְׁכֹּֽן׃",
          "transliteration": "Vehu yihyeh pere adam yado bakol veyad kol bo ve'al-penei kol-ejaiv yishkon.",
          "spanish": "Y él será hombre fiero; su mano será contra todos, y la mano de todos contra él, y delante de todos sus hermanos habitará."
        },
        {
          "verseNumber": 13,
          "verseKey": "Génesis 16:13",
          "hebrew": "וַתִּקְרָ֤א שֵׁם־יְהֹוָה֙ הַדֹּבֵ֣ר אֵלֶ֔יהָ אַתָּ֖ה אֵ֣ל רֳאִ֑י כִּ֣י אָֽמְרָ֗ה הֲגַ֥ם הֲלֹ֛ם רָאִ֖יתִי אַחֲרֵ֥י רֹאִֽי׃",
          "transliteration": "Vatikra shem-YHVH hadover eleiha atah El ro'i ki amrah hagam halom ra'iti ajarei ro'i.",
          "spanish": "Entonces llamó el nombre de YHVH que con ella hablaba: Tú eres Elohim que ve; porque dijo: ¿No he visto también aquí al que me ve?"
        },
        {
          "verseNumber": 14,
          "verseKey": "Génesis 16:14",
          "hebrew": "עַל־כֵּן֙ קָרָ֣א לַבְּאֵ֔ר בְּאֵ֥ר לַחַ֖י רֹאִ֑י הִנֵּ֥ה בֵין־קָדֵ֖שׁ וּבֵ֥ין בָּֽרֶד׃",
          "transliteration": "Al-ken kara labe'er be'er lajai ro'i hineh bein-kadesh uvein bared.",
          "spanish": "Por lo cual llamó al pozo: Pozo del Viviente-que-me-ve. He aquí está entre Cades y Bered."
        },
        {
          "verseNumber": 15,
          "verseKey": "Génesis 16:15",
          "hebrew": "וַתֵּ֧לֶד הָגָ֛ר לְאַבְרָ֖ם בֵּ֑ן וַיִּקְרָ֨א אַבְרָ֧ם שֶׁם־בְּנ֛וֹ אֲשֶׁר־יָלְדָ֥ה הָגָ֖ר יִשְׁמָעֵֽאל׃",
          "transliteration": "Vateled hagar Le-Avrám ben vayikra Avrám shem-beno asher-yaldah hagar yishma'el.",
          "spanish": "Y Agar dio a luz un hijo a Abram, y llamó Abram el nombre del hijo que le dio Agar, Ismael."
        },
        {
          "verseNumber": 16,
          "verseKey": "Génesis 16:16",
          "hebrew": "וְאַבְרָ֕ם בֶּן־שְׁמֹנִ֥ים שָׁנָ֖ה וְשֵׁ֣שׁ שָׁנִ֑ים בְּלֶֽדֶת־הָגָ֥ר אֶת־יִשְׁמָעֵ֖אל לְאַבְרָֽם׃",
          "transliteration": "Ve-Avrám ben-shemonim shanah veshesh shanim beledet-hagar et-yishma'el Le-Avrám.",
          "spanish": "Era Abram de edad de ochenta y seis años, cuando Agar dio a luz a Ismael."
        },
        {
          "verseNumber": 1,
          "verseKey": "Génesis 17:1",
          "hebrew": "וַיְהִ֣י אַבְרָ֔ם בֶּן־תִּשְׁעִ֥ים שָׁנָ֖ה וְתֵ֣שַׁע שָׁנִ֑ים וַיֵּרָ֨א יְהֹוָ֜ה אֶל־אַבְרָ֗ם וַיֹּ֤אמֶר אֵלָיו֙ אֲנִי־אֵ֣ל שַׁדַּ֔י הִתְהַלֵּ֥ךְ לְפָנַ֖י וֶהְיֵ֥ה תָמִֽים׃",
          "transliteration": "Vayhi Avrám ben-tish'im shanah vetesha' shanim vayera YHVH el-Avrám Vayómer elaiv ani-El shadai hithalej lefanai vehyeh tamim.",
          "spanish": "Era Abram de edad de noventa y nueve años, cuando le apareció YHVH y le dijo: Yo soy el Elohim Todopoderoso; anda delante de mí y sé perfecto."
        },
        {
          "verseNumber": 2,
          "verseKey": "Génesis 17:2",
          "hebrew": "וְאֶתְּנָ֥ה בְרִיתִ֖י בֵּינִ֣י וּבֵינֶ֑ךָ וְאַרְבֶּ֥ה אוֹתְךָ֖ בִּמְאֹ֥ד מְאֹֽד׃",
          "transliteration": "Ve'etenah beriti beini uveineja ve'arbeh otja bim'od me'od.",
          "spanish": "Y pondré mi pacto entre mí y ti, y te multiplicaré en gran manera."
        },
        {
          "verseNumber": 3,
          "verseKey": "Génesis 17:3",
          "hebrew": "וַיִּפֹּ֥ל אַבְרָ֖ם עַל־פָּנָ֑יו וַיְדַבֵּ֥ר אִתּ֛וֹ אֱלֹהִ֖ים לֵאמֹֽר׃",
          "transliteration": "Vayipol Avrám al-panaiv vaydaber ito Elohím lemor.",
          "spanish": "Entonces Abram se postró sobre su rostro, y Elohim habló con él, diciendo:"
        },
        {
          "verseNumber": 4,
          "verseKey": "Génesis 17:4",
          "hebrew": "אֲנִ֕י הִנֵּ֥ה בְרִיתִ֖י אִתָּ֑ךְ וְהָיִ֕יתָ לְאַ֖ב הֲמ֥וֹן גּוֹיִֽם׃",
          "transliteration": "Ani hineh beriti itaj vehayita le'av hamon goyim.",
          "spanish": "He aquí mi pacto es contigo, y serás padre de muchedumbre de gentes."
        },
        {
          "verseNumber": 5,
          "verseKey": "Génesis 17:5",
          "hebrew": "וְלֹא־יִקָּרֵ֥א ע֛וֹד אֶת־שִׁמְךָ֖ אַבְרָ֑ם וְהָיָ֤ה שִׁמְךָ֙ אַבְרָהָ֔ם כִּ֛י אַב־הֲמ֥וֹן גּוֹיִ֖ם נְתַתִּֽיךָ׃",
          "transliteration": "Velo-yikare od et-shimja Avrám vehayah shimja Avrahám ki av-hamon goyim netatija.",
          "spanish": "Y no se llamará más tu nombre Abram, sino que será tu nombre Abraham, porque te he puesto por padre de muchedumbre de gentes."
        },
        {
          "verseNumber": 6,
          "verseKey": "Génesis 17:6",
          "hebrew": "וְהִפְרֵתִ֤י אֹֽתְךָ֙ בִּמְאֹ֣ד מְאֹ֔ד וּנְתַתִּ֖יךָ לְגוֹיִ֑ם וּמְלָכִ֖ים מִמְּךָ֥ יֵצֵֽאוּ׃",
          "transliteration": "Vehifreti otja bim'od me'od untatija legoyim umlajim mimeja yetzeu.",
          "spanish": "Y te multiplicaré en gran manera, y haré naciones de ti, y reyes saldrán de ti."
        }
      ]
    },
    {
      "aliyahNumber": 7,
      "nameHebrew": "שְׁבִיעִי",
      "nameSpanish": "7ª Aliyá (Shevií)",
      "refRange": "Génesis 17:7–17:27",
      "verses": [
        {
          "verseNumber": 7,
          "verseKey": "Génesis 17:7",
          "hebrew": "וַהֲקִמֹתִ֨י אֶת־בְּרִיתִ֜י בֵּינִ֣י וּבֵינֶ֗ךָ וּבֵ֨ין זַרְעֲךָ֧ אַחֲרֶ֛יךָ לְדֹרֹתָ֖ם לִבְרִ֣ית עוֹלָ֑ם לִהְי֤וֹת לְךָ֙ לֵֽאלֹהִ֔ים וּֽלְזַרְעֲךָ֖ אַחֲרֶֽיךָ׃",
          "transliteration": "Vahakimoti et-beriti beini uveineja uvein zar'aja ajareija ledorotam livrit olam lihyot lejá Le-Elohím ulzar'aja ajareija.",
          "spanish": "Y estableceré mi pacto entre mí y ti, y tu descendencia después de ti en sus generaciones, por pacto perpetuo, para ser tu Elohim, y el de tu descendencia después de ti."
        },
        {
          "verseNumber": 8,
          "verseKey": "Génesis 17:8",
          "hebrew": "וְנָתַתִּ֣י לְ֠ךָ֠ וּלְזַרְעֲךָ֨ אַחֲרֶ֜יךָ אֵ֣ת ׀ אֶ֣רֶץ מְגֻרֶ֗יךָ אֵ֚ת כׇּל־אֶ֣רֶץ כְּנַ֔עַן לַאֲחֻזַּ֖ת עוֹלָ֑ם וְהָיִ֥יתִי לָהֶ֖ם לֵאלֹהִֽים׃",
          "transliteration": "Venatati lejá ulzar'aja ajareija et ׀ eretz megureija et kol-eretz Canaán la'ajuzat olam vehayiti lahem Le-Elohím.",
          "spanish": "Y te daré a ti, y a tu descendencia después de ti, la tierra en que moras, toda la tierra de Canaán en heredad perpetua; y seré el Elohim de ellos."
        },
        {
          "verseNumber": 9,
          "verseKey": "Génesis 17:9",
          "hebrew": "וַיֹּ֤אמֶר אֱלֹהִים֙ אֶל־אַבְרָהָ֔ם וְאַתָּ֖ה אֶת־בְּרִיתִ֣י תִשְׁמֹ֑ר אַתָּ֛ה וְזַרְעֲךָ֥ אַֽחֲרֶ֖יךָ לְדֹרֹתָֽם׃",
          "transliteration": "Vayómer Elohím el-Avrahám ve'atah et-beriti tishmor atah vezar'aja ajareija ledorotam.",
          "spanish": "Dijo de nuevo Elohim a Abraham: En cuanto a ti, guardarás mi pacto, tú y tu descendencia después de ti por sus generaciones."
        },
        {
          "verseNumber": 10,
          "verseKey": "Génesis 17:10",
          "hebrew": "זֹ֣את בְּרִיתִ֞י אֲשֶׁ֣ר תִּשְׁמְר֗וּ בֵּינִי֙ וּבֵ֣ינֵיכֶ֔ם וּבֵ֥ין זַרְעֲךָ֖ אַחֲרֶ֑יךָ הִמּ֥וֹל לָכֶ֖ם כׇּל־זָכָֽר׃",
          "transliteration": "Zot beriti asher tishmeru beini uveineijem uvein zar'aja ajareija himol lajem kol-zajar.",
          "spanish": "Este es mi pacto, que guardaréis entre mí y vosotros y tu descendencia después de ti: Será circuncidado todo varón de entre vosotros."
        },
        {
          "verseNumber": 11,
          "verseKey": "Génesis 17:11",
          "hebrew": "וּנְמַלְתֶּ֕ם אֵ֖ת בְּשַׂ֣ר עׇרְלַתְכֶ֑ם וְהָיָה֙ לְא֣וֹת בְּרִ֔ית בֵּינִ֖י וּבֵינֵיכֶֽם׃",
          "transliteration": "Unmaltem et besar orlatjem vehayah leot berit beini uveineijem.",
          "spanish": "Circuncidaréis, pues, la carne de vuestro prepucio, y será por señal del pacto entre mí y vosotros."
        },
        {
          "verseNumber": 12,
          "verseKey": "Génesis 17:12",
          "hebrew": "וּבֶן־שְׁמֹנַ֣ת יָמִ֗ים יִמּ֥וֹל לָכֶ֛ם כׇּל־זָכָ֖ר לְדֹרֹתֵיכֶ֑ם יְלִ֣יד בָּ֔יִת וּמִקְנַת־כֶּ֙סֶף֙ מִכֹּ֣ל בֶּן־נֵכָ֔ר אֲשֶׁ֛ר לֹ֥א מִֽזַּרְעֲךָ֖ הֽוּא׃",
          "transliteration": "Uven-shemonat yamim yimol lajem kol-zajar ledoroteijem yelid bayit umiknat-kesef mikol ben-nejar asher lo mizar'aja hu.",
          "spanish": "Y de edad de ocho días será circuncidado todo varón entre vosotros por vuestras generaciones; el nacido en casa, y el comprado por dinero a cualquier extranjero, que no fuere de tu linaje."
        },
        {
          "verseNumber": 13,
          "verseKey": "Génesis 17:13",
          "hebrew": "הִמּ֧וֹל ׀ יִמּ֛וֹל יְלִ֥יד בֵּֽיתְךָ֖ וּמִקְנַ֣ת כַּסְפֶּ֑ךָ וְהָיְתָ֧ה בְרִיתִ֛י בִּבְשַׂרְכֶ֖ם לִבְרִ֥ית עוֹלָֽם׃",
          "transliteration": "Himol ׀ yimol yelid beitja umiknat kaspeja vehaytah beriti bivsarjem livrit olam.",
          "spanish": "Debe ser circuncidado el nacido en tu casa, y el comprado por tu dinero; y estará mi pacto en vuestra carne por pacto perpetuo."
        },
        {
          "verseNumber": 14,
          "verseKey": "Génesis 17:14",
          "hebrew": "וְעָרֵ֣ל ׀ זָכָ֗ר אֲשֶׁ֤ר לֹֽא־יִמּוֹל֙ אֶת־בְּשַׂ֣ר עׇרְלָת֔וֹ וְנִכְרְתָ֛ה הַנֶּ֥פֶשׁ הַהִ֖וא מֵעַמֶּ֑יהָ אֶת־בְּרִיתִ֖י הֵפַֽר׃",
          "transliteration": "Ve'arel ׀ zajar asher lo-yimol et-besar orlato venijretah hanefesh hahiv me'ameiha et-beriti hefar.",
          "spanish": "Y el varón incircunciso, el que no hubiere circuncidado la carne de su prepucio, aquella persona será cortada de su pueblo; ha violado mi pacto."
        },
        {
          "verseNumber": 15,
          "verseKey": "Génesis 17:15",
          "hebrew": "וַיֹּ֤אמֶר אֱלֹהִים֙ אֶל־אַבְרָהָ֔ם שָׂרַ֣י אִשְׁתְּךָ֔ לֹא־תִקְרָ֥א אֶת־שְׁמָ֖הּ שָׂרָ֑י כִּ֥י שָׂרָ֖ה שְׁמָֽהּ׃",
          "transliteration": "Vayómer Elohím el-Avrahám sarai ishteja lo-tikra et-shemah sarai ki sarah shemah.",
          "spanish": "Dijo también Elohim a Abraham: A Sarai tu mujer no la llamarás Sarai, mas Sara será su nombre."
        },
        {
          "verseNumber": 16,
          "verseKey": "Génesis 17:16",
          "hebrew": "וּבֵרַכְתִּ֣י אֹתָ֔הּ וְגַ֨ם נָתַ֧תִּי מִמֶּ֛נָּה לְךָ֖ בֵּ֑ן וּבֵֽרַכְתִּ֙יהָ֙ וְהָֽיְתָ֣ה לְגוֹיִ֔ם מַלְכֵ֥י עַמִּ֖ים מִמֶּ֥נָּה יִהְיֽוּ׃",
          "transliteration": "Uverajti otah vegam natati mimenah lejá ben uverajtiha vehaytah legoyim maljei amim mimenah yihyu.",
          "spanish": "Y la bendeciré, y también te daré de ella hijo; sí, la bendeciré, y vendrá a ser madre de naciones; reyes de pueblos vendrán de ella."
        },
        {
          "verseNumber": 17,
          "verseKey": "Génesis 17:17",
          "hebrew": "וַיִּפֹּ֧ל אַבְרָהָ֛ם עַל־פָּנָ֖יו וַיִּצְחָ֑ק וַיֹּ֣אמֶר בְּלִבּ֗וֹ הַלְּבֶ֤ן מֵאָֽה־שָׁנָה֙ יִוָּלֵ֔ד וְאִ֨ם־שָׂרָ֔ה הֲבַת־תִּשְׁעִ֥ים שָׁנָ֖ה תֵּלֵֽד׃",
          "transliteration": "Vayipol Avrahám al-panaiv vayitzjak Vayómer belibo haleven me'ah-shanah yivaled ve'im-sarah havat-tish'im shanah teled.",
          "spanish": "Entonces Abraham se postró sobre su rostro, y se rió, y dijo en su corazón: ¿A hombre de cien años ha de nacer hijo? ¿Y Sara, ya de noventa años, ha de concebir?"
        },
        {
          "verseNumber": 18,
          "verseKey": "Génesis 17:18",
          "hebrew": "וַיֹּ֥אמֶר אַבְרָהָ֖ם אֶל־הָֽאֱלֹהִ֑ים ל֥וּ יִשְׁמָעֵ֖אל יִחְיֶ֥ה לְפָנֶֽיךָ׃",
          "transliteration": "Vayómer Avrahám el-Ha-Elohím lu yishma'el yijyeh lefaneija.",
          "spanish": "Y dijo Abraham a Elohim: Ojalá Ismael viva delante de ti."
        },
        {
          "verseNumber": 19,
          "verseKey": "Génesis 17:19",
          "hebrew": "וַיֹּ֣אמֶר אֱלֹהִ֗ים אֲבָל֙ שָׂרָ֣ה אִשְׁתְּךָ֗ יֹלֶ֤דֶת לְךָ֙ בֵּ֔ן וְקָרָ֥אתָ אֶת־שְׁמ֖וֹ יִצְחָ֑ק וַהֲקִמֹתִ֨י אֶת־בְּרִיתִ֥י אִתּ֛וֹ לִבְרִ֥ית עוֹלָ֖ם לְזַרְע֥וֹ אַחֲרָֽיו׃",
          "transliteration": "Vayómer Elohím aval sarah ishteja yoledet lejá ben vekarata et-shemo Yitzják vahakimoti et-beriti ito livrit olam lezar'o ajaraiv.",
          "spanish": "Respondió Elohim: Ciertamente Sara tu mujer te dará a luz un hijo, y llamarás su nombre Isaac; y confirmaré mi pacto con él como pacto perpetuo para sus descendientes después de él."
        },
        {
          "verseNumber": 20,
          "verseKey": "Génesis 17:20",
          "hebrew": "וּֽלְיִשְׁמָעֵאל֮ שְׁמַעְתִּ֒יךָ֒ הִנֵּ֣ה ׀ בֵּרַ֣כְתִּי אֹת֗וֹ וְהִפְרֵיתִ֥י אֹת֛וֹ וְהִרְבֵּיתִ֥י אֹת֖וֹ בִּמְאֹ֣ד מְאֹ֑ד שְׁנֵים־עָשָׂ֤ר נְשִׂיאִם֙ יוֹלִ֔יד וּנְתַתִּ֖יו לְג֥וֹי גָּדֽוֹל׃",
          "transliteration": "Ulyishma'el shema'tija hineh ׀ berajti oto vehifreiti oto vehirbeiti oto bim'od me'od sheneim-asar nesi'im yolid untativ legoy gadol.",
          "spanish": "Y en cuanto a Ismael, también te he oído; he aquí que le bendeciré, y le haré fructificar y multiplicar mucho en gran manera; doce príncipes engendrará, y haré de él una gran nación."
        },
        {
          "verseNumber": 21,
          "verseKey": "Génesis 17:21",
          "hebrew": "וְאֶת־בְּרִיתִ֖י אָקִ֣ים אֶת־יִצְחָ֑ק אֲשֶׁר֩ תֵּלֵ֨ד לְךָ֤ שָׂרָה֙ לַמּוֹעֵ֣ד הַזֶּ֔ה בַּשָּׁנָ֖ה הָאַחֶֽרֶת׃",
          "transliteration": "Ve'et-beriti akim et-Yitzják asher teled lejá sarah lamo'ed hazeh bashanah ha'ajeret.",
          "spanish": "Mas yo estableceré mi pacto con Isaac, el que Sara te dará a luz por este tiempo el año que viene."
        },
        {
          "verseNumber": 22,
          "verseKey": "Génesis 17:22",
          "hebrew": "וַיְכַ֖ל לְדַבֵּ֣ר אִתּ֑וֹ וַיַּ֣עַל אֱלֹהִ֔ים מֵעַ֖ל אַבְרָהָֽם׃",
          "transliteration": "Vayjal ledaber ito vaya'al Elohím me'al Avrahám.",
          "spanish": "Y acabó de hablar con él, y subió Elohim de estar con Abraham."
        },
        {
          "verseNumber": 23,
          "verseKey": "Génesis 17:23",
          "hebrew": "וַיִּקַּ֨ח אַבְרָהָ֜ם אֶת־יִשְׁמָעֵ֣אל בְּנ֗וֹ וְאֵ֨ת כׇּל־יְלִידֵ֤י בֵיתוֹ֙ וְאֵת֙ כׇּל־מִקְנַ֣ת כַּסְפּ֔וֹ כׇּל־זָכָ֕ר בְּאַנְשֵׁ֖י בֵּ֣ית אַבְרָהָ֑ם וַיָּ֜מׇל אֶת־בְּשַׂ֣ר עׇרְלָתָ֗ם בְּעֶ֙צֶם֙ הַיּ֣וֹם הַזֶּ֔ה כַּאֲשֶׁ֛ר דִּבֶּ֥ר אִתּ֖וֹ אֱלֹהִֽים׃",
          "transliteration": "Vayikaj Avrahám et-yishma'el beno ve'et kol-yelidei beito ve'et kol-miknat kaspo kol-zajar be'anshei beit Avrahám vayamol et-besar orlatam be'etzem haiom hazeh ka'asher diber ito Elohím.",
          "spanish": "Entonces tomó Abraham a Ismael su hijo, y a todos los siervos nacidos en su casa, y a todos los comprados por su dinero, a todo varón entre los domésticos de la casa de Abraham, y circuncidó la carne del prepucio de ellos en aquel mismo día, como Elohim le había dicho."
        },
        {
          "verseNumber": 24,
          "verseKey": "Génesis 17:24",
          "hebrew": "וְאַ֨בְרָהָ֔ם בֶּן־תִּשְׁעִ֥ים וָתֵ֖שַׁע שָׁנָ֑ה בְּהִמֹּל֖וֹ בְּשַׂ֥ר עׇרְלָתֽוֹ׃",
          "transliteration": "Ve-Avrahám ben-tish'im vatesha' shanah behimolo besar orlato.",
          "spanish": "Era Abraham de edad de noventa y nueve años cuando circuncidó la carne de su prepucio."
        },
        {
          "verseNumber": 25,
          "verseKey": "Génesis 17:25",
          "hebrew": "וְיִשְׁמָעֵ֣אל בְּנ֔וֹ בֶּן־שְׁלֹ֥שׁ עֶשְׂרֵ֖ה שָׁנָ֑ה בְּהִ֨מֹּל֔וֹ אֵ֖ת בְּשַׂ֥ר עׇרְלָתֽוֹ׃",
          "transliteration": "Veyishma'el beno ben-shelosh esreh shanah behimolo et besar orlato.",
          "spanish": "E Ismael su hijo era de trece años, cuando fue circuncidada la carne de su prepucio."
        },
        {
          "verseNumber": 26,
          "verseKey": "Génesis 17:26",
          "hebrew": "בְּעֶ֙צֶם֙ הַיּ֣וֹם הַזֶּ֔ה נִמּ֖וֹל אַבְרָהָ֑ם וְיִשְׁמָעֵ֖אל בְּנֽוֹ׃",
          "transliteration": "Be'etzem haiom hazeh nimol Avrahám veyishma'el beno.",
          "spanish": "En el mismo día fueron circuncidados Abraham e Ismael su hijo."
        },
        {
          "verseNumber": 27,
          "verseKey": "Génesis 17:27",
          "hebrew": "וְכׇל־אַנְשֵׁ֤י בֵיתוֹ֙ יְלִ֣יד בָּ֔יִת וּמִקְנַת־כֶּ֖סֶף מֵאֵ֣ת בֶּן־נֵכָ֑ר נִמֹּ֖לוּ אִתּֽוֹ׃",
          "transliteration": "Vejol-anshei beito yelid bayit umiknat-kesef me'et ben-nejar nimolu ito.",
          "spanish": "Y todos los varones de su casa, el siervo nacido en casa, y el comprado del extranjero por dinero, fueron circuncidados con él."
        }
      ]
    }
  ]
};
