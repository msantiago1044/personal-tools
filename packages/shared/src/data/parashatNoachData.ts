import { WeeklyParasha } from '../types';

export const PARASHAT_NOACH_DATA: WeeklyParasha = {
  id: 'noach',
  nameHebrew: 'נֹחַ',
  nameSpanish: 'Noaj',
  book: 'Genesis',
  bookSpanish: 'Bereshit (Génesis)',
  ref: 'Génesis 6:9–11:32',
  summary: 'La historia de Noaj, el diluvio universal, la construcción de la Tevá (Arca), el pacto del arcoíris, y la Torre de Babel.',
  aliyot: [
    {
      aliyahNumber: 1,
      nameHebrew: 'רִאשׁוֹן',
      nameSpanish: '1ª Aliyá (Rishón)',
      refRange: 'Génesis 6:9–6:22',
      verses: [
        {
          verseNumber: 9,
          verseKey: 'Génesis 6:9',
          hebrew: 'אֵ֚לֶּה תּוֹלְדֹ֣ת נֹ֔חַ נֹ֗חַ אִ֥ישׁ צַדִּ֛יק תָּמִ֥ים הָיָ֖ה בְּדֹֽרֹתָ֑יו אֶת־הָֽאֱלֹהִ֖ים הִֽתְהַלֶּךְ־נֹֽחַ׃',
          transliteration: "Eleh toldot Noaj: Noaj ish tzadik tamim hayá bedorotav; et HaElohim hithalej Noaj.",
          spanish: 'Estas son las generaciones de Noaj: Noaj era un hombre justo e íntegro en sus generaciones; con Elohim caminó Noaj.'
        },
        {
          verseNumber: 10,
          verseKey: 'Génesis 6:10',
          hebrew: 'וַיּ֥וֹלֶד נֹ֖חַ שְׁלֹשָׁ֣ה בָנִ֑ים אֶת־שֵׁ֖ם אֶת־חָ֥ם וְאֶת־יָֽפֶת׃',
          transliteration: "Vayoled Noaj shloshá vanim: et Shem, et Jam ve'et Yáfet.",
          spanish: 'Y engendró Noaj tres hijos: a Shem, a Jam y a Yáfet.'
        },
        {
          verseNumber: 11,
          verseKey: 'Génesis 6:11',
          hebrew: 'וַתִּשָּׁחֵ֥ת הָאָ֖רֶץ לִפְנֵ֣י הָֽאֱלֹהִ֑ים וַתִּמָּלֵ֥א הָאָ֖רֶץ חָמָֽס׃',
          transliteration: "Vatishajet ha'aretz lifnei HaElohim, vatimalé ha'aretz jamas.",
          spanish: 'Y se corrompió la tierra delante de Elohim, y se llenó la tierra de violencia.'
        },
        {
          verseNumber: 12,
          verseKey: 'Génesis 6:12',
          hebrew: 'וַיַּ֧רְא אֱלֹהִ֛ים אֶת־הָאָ֖רֶץ וְהִנֵּ֣ה נִשְׁחָ֑תָה כִּֽי־הִשְׁחִ֧ית כׇּל־בָּשָׂ֛ר אֶת־דַּרְכּ֖וֹ עַל־הָאָֽרֶץ׃',
          transliteration: "Vayar Elohim et ha'aretz vehiné nishjata, ki hishjit kol basar et darko al ha'aretz.",
          spanish: 'Y miró Elohim a la tierra, y he aquí que estaba corrompida; porque toda carne había corrompido su camino sobre la tierra.'
        },
        {
          verseNumber: 13,
          verseKey: 'Génesis 6:13',
          hebrew: 'וַיֹּ֨אמֶר אֱלֹהִ֜ים לְנֹ֗חַ קֵ֤ץ כׇּל־בָּשָׂר֙ בָּ֣א לְפָנַ֔י כִּֽי־מָלְאָ֥ה הָאָ֛רֶץ חָמָ֖ס מִפְּנֵיהֶ֑ם וְהִנְנִ֥י מַשְׁחִיתָ֖ם אֶת־הָאָֽרֶץ׃',
          transliteration: "Vayomer Elohim leNoaj: ketz kol basar ba lefanai, ki mal'a ha'aretz jamas mipneihem; vehineni mashjitam et ha'aretz.",
          spanish: 'Y dijo Elohim a Noaj: El fin de toda carne ha llegado delante de Mí, porque la tierra está llena de violencia a causa de ellos; y he aquí que Yo los destruiré con la tierra.'
        },
        {
          verseNumber: 14,
          verseKey: 'Génesis 6:14',
          hebrew: 'עֲשֵׂ֤ה לְךָ֙ תֵּבַ֣ת עֲצֵי־גֹ֔פֶר קִנִּ֖ים תַּֽעֲשֶׂ֣ה אֶת־הַתֵּבָ֑ה וְכָֽפַרְתָּ֥ אֹתָ֛הּ מִבַּ֥יִת וּמִח֖וּץ בַּכֹּֽפֶר׃',
          transliteration: "Asé lejá tevat atzei gófer, kinim ta'asé et hatevá, vejafartá otah mibáyit umijutz bakofer.",
          spanish: 'Hazte una Tevá (Arca) de madera de gófer; harás compartimentos en la Tevá y la calafatearás con brea por dentro y por fuera.'
        },
        {
          verseNumber: 15,
          verseKey: 'Génesis 6:15',
          hebrew: 'וְזֶ֕ה אֲשֶׁ֥ר תַּֽעֲשֶׂ֖ה אֹתָ֑הּ שְׁלֹ֧שׁ מֵא֣וֹת אַמָּ֗ה אֹ֚רֶךְ הַתֵּבָ֔ה חֲמִשִּׁ֤ים אַמָּה֙ רׇחְבָּ֔הּ וּשְׁלֹשִׁ֥ים אַמָּ֖ה קוֹמָתָֽהּ׃',
          transliteration: "Vezeh asher ta'asé otah: shlosh me'ot amá órej hatevá, jamishim amá rojbah, ushloshim amá komatah.",
          spanish: 'Y de esta manera la harás: de trescientos codos será la longitud de la Tevá, de cincuenta codos su anchura, y de treinta codos su altura.'
        },
        {
          verseNumber: 16,
          verseKey: 'Génesis 6:16',
          hebrew: 'צֹ֣הַר ׀ תַּעֲשֶׂ֣ה לַתֵּבָ֗ה וְאֶל־אַמָּה֙ תְּכַלֶּ֣נָּה מִלְמַ֔עְלָה וּפֶ֥תַח הַתֵּבָ֖ה בְּצִדָּ֣הּ תָּשִׂ֑ים תַּחְתִּיִּ֛ם שְׁנִיִּ֥ם וּשְׁלִשִׁ֖ים תַּֽעֲשֶֽׂהָ׃',
          transliteration: "Tzohar ta'asé latevá, ve'el amá tejaleha milma'lah, ufétaj hatevá betzidah tasim; tajtiyim shniyim ushlishim ta'aseha.",
          spanish: 'Una claraboya harás para la Tevá, terminándola a un codo de la parte superior; y pondrás la puerta de la Tevá a su costado; la harás con pisos bajo, segundo y tercero.'
        },
        {
          verseNumber: 17,
          verseKey: 'Génesis 6:17',
          hebrew: 'וַאֲנִ֗י הִנְנִי֩ מֵבִ֨יא אֶת־הַמַּבּ֥וּל מַ֙יִם֙ עַל־הָאָ֔רֶץ לְשַׁחֵ֣ת כׇּל־בָּשָׂ֗ר אֲשֶׁר־בּוֹ֙ ר֣וּחַ חַיִּ֔ים מִתַּ֖חַת הַשָּׁמָ֑יִם כֹּ֥ל אֲשֶׁר־בָּאָ֖רֶץ יִגְוָֽע׃',
          transliteration: "Va'aní hineni meví et hamabul máyim al ha'aretz leshajet kol basar asher bo rúaj jayim mitájat hashamáyim; kol asher ba'aretz yigvá.",
          spanish: 'Y he aquí que Yo traigo un diluvio de aguas sobre la tierra, para destruir toda carne en que haya aliento de vida debajo del cielo; todo lo que hay en la tierra perecerá.'
        },
        {
          verseNumber: 18,
          verseKey: 'Génesis 6:18',
          hebrew: 'וַהֲקִמֹתִ֥י אֶת־בְּרִיתִ֖י אִתָּ֑ךְ וּבָאתָ֙ אֶל־הַתֵּבָ֔ה אַתָּ֕ה וּבָנֶ֛יךָ וְאִשְׁתְּךָ֥ וּנְשֵֽׁי־בָנֶ֖יךָ אִתָּֽךְ׃',
          transliteration: "Vahakimotí et brití itaj; uvatá el hatevá, atá uvanéija ve'ishtejá unshei vanéija itaj.",
          spanish: 'Mas estableceré Mi pacto contigo, y entrarás en la Tevá tú, tus hijos, tu mujer y las mujeres de tus hijos contigo.'
        },
        {
          verseNumber: 19,
          verseKey: 'Génesis 6:19',
          hebrew: 'וּמִכׇּל־הָ֠חַ֠י מִֽכׇּל־בָּשָׂ֞ר שְׁנַ֧יִם מִכֹּ֛ל תָּבִ֥יא אֶל־הַתֵּבָ֖ה לְהַחֲיֹ֣ת אִתָּ֑ךְ זָכָ֥ר וּנְקֵבָ֖ה יִהְיֽוּ׃',
          transliteration: "Umikol hajái mikol basar shnáyim mikol taví el hatevá lehajayot itaj; zajár unkevá yihyú.",
          spanish: 'Y de todo lo que vive, de toda carne, dos de cada especie meterás en la Tevá para que tengan vida contigo; macho y hembra serán.'
        },
        {
          verseNumber: 20,
          verseKey: 'Génesis 6:20',
          hebrew: 'מֵהָע֣וֹף לְמִינֵ֗הוּ וּמִן־הַבְּהֵמָה֙ לְמִינָ֔הּ מִכֹּ֛ל רֶ֥מֶשׂ הָֽאֲדָמָ֖ה לְמִינֵ֑הוּ שְׁנַ֧יִם מִכֹּ֛ל יָבֹ֥אוּ אֵלֶ֖יךָ לְהַֽחֲיֽוֹת׃',
          transliteration: "Meha'of leminehu umin habehemá leminah, mikol rémes ha'adamá leminehu, shnáyim mikol yavó'u eleja lehajayot.",
          spanish: 'De las aves según su especie, y de las bestias según su especie, de todo reptil de la tierra según su especie, dos de cada uno entrarán a ti, para que tengan vida.'
        },
        {
          verseNumber: 21,
          verseKey: 'Génesis 6:21',
          hebrew: 'וְאַתָּ֣ה קַח־לְךָ֗ מִכׇּל־מַֽאֲכָל֙ אֲשֶׁ֣ר יֵֽאָכֵ֔ל וְאָסַפְתָּ֖ אֵלֶ֑יךָ וְהָיָ֥ה לְךָ֛ וְלָהֶ֖ם לְאׇכְלָֽה׃',
          transliteration: "Ve'atá kaj lejá mikol ma'ajál asher ye'ajel, ve'asaftá eleja; vehayá lejá velahem le'ojlah.",
          spanish: 'Y toma contigo de todo alimento que se come, y almacénalo; y servirá de sustento para ti y para ellos.'
        },
        {
          verseNumber: 22,
          verseKey: 'Génesis 6:22',
          hebrew: 'וַיַּ֖עַשׂ נֹ֑חַ כְּ֠כֹ֠ל אֲשֶׁ֨ר צִוָּ֥ה אֹת֛וֹ אֱלֹהִ֖ים כֵּ֥ן עָשָֽׂה׃',
          transliteration: "Vaya'as Noaj; kekol asher tzivah oto Elohim, ken asah.",
          spanish: 'Y así lo hizo Noaj; conforme a todo lo que Elohim le ordenó, así lo hizo.'
        }
      ]
    },
    {
      aliyahNumber: 2,
      nameHebrew: 'שֵׁנִי',
      nameSpanish: '2ª Aliyá (Shení)',
      refRange: 'Génesis 7:1–7:16',
      verses: [
        {
          verseNumber: 1,
          verseKey: 'Génesis 7:1',
          hebrew: 'וַיֹּ֤אמֶר יְהֹוָה֙ לְנֹ֔חַ בֹּֽא־אַתָּ֥ה וְכׇל־בֵּיתְךָ֖ אֶל־הַתֵּבָ֑ה כִּֽי־אֹתְךָ֥ רָאִ֛יתִי צַדִּ֥יק לְפָנַ֖י בַּדּ֥וֹר הַזֶּֽה׃',
          transliteration: "Vayomer YHVH leNoaj: bo atá vejol beitjá el hatevá, ki otjá ra'iti tzadik lefanai bador hazé.",
          spanish: 'Y dijo YHVH a Noaj: Entra tú y toda tu casa en la Tevá, porque a ti te he visto justo delante de Mí en esta generación.'
        },
        {
          verseNumber: 2,
          verseKey: 'Génesis 7:2',
          hebrew: 'מִכֹּ֣ל ׀ הַבְּהֵמָ֣ה הַטְּהוֹרָ֗ה תִּֽקַּח־לְךָ֛ שִׁבְעָ֥ה שִׁבְעָ֖ה אִ֣ישׁ וְאִשְׁתּ֑וֹ וּמִן־הַבְּהֵמָ֡ה אֲ֠שֶׁ֠ר לֹ֣א טְהֹרָ֥ה הִ֛וא שְׁנַ֖יִם אִ֥ישׁ וְאִשְׁתּֽוֹ׃',
          transliteration: "Mikol habehemá hatehorá tikaj lejá shiv'á shiv'á, ish ve'ishto; umin habehemá asher lo tehorá hi, shnáyim ish ve'ishto.",
          spanish: 'De todo animal puro tomarás siete parejas, macho y su hembra; y de los animales que no son puros, dos, macho y su hembra.'
        },
        {
          verseNumber: 3,
          verseKey: 'Génesis 7:3',
          hebrew: 'גַּ֣ם מֵע֧וֹף הַשָּׁמַ֛יִם שִׁבְעָ֥ה שִׁבְעָ֖ה זָכָ֣ר וּנְקֵבָ֑ה לְחַיּ֥וֹת זֶ֖רַע עַל־פְּנֵ֥י כׇל־הָאָֽרֶץ׃',
          transliteration: "Gam me'of hashamáyim shiv'á shiv'á, zajár unkevá, lehajayot zéra al pnei kol ha'aretz.",
          spanish: 'También de las aves de los cielos, siete parejas, macho y hembra, para conservar viva la especie sobre la faz de toda la tierra.'
        },
        {
          verseNumber: 4,
          verseKey: 'Génesis 7:4',
          hebrew: 'כִּי֩ לְיָמִ֨ים ע֘וֹד שִׁבְעָה֒ אָֽנֹכִ֗י מַמְטִיר֙ עַל־הָאָ֔רֶץ אַרְבָּעִ֣ים י֔וֹם וְאַרְבָּעִ֖ים לָ֑יְלָה וּמָחִ֗יתִי אֶֽת־כׇּל־הַיְקוּם֙ אֲשֶׁ֣ר עָשִׂ֔יתִי מֵעַ֖ל פְּנֵ֥י הָֽאֲדָמָֽה׃',
          transliteration: "Ki leyamim od shiv'á, anojí mamtir al ha'aretz arba'im yom ve'arba'im laylah, umajíti et kol haykum asher asíti me'al pnei ha'adamá.",
          spanish: 'Porque pasados aún siete días, Yo haré llover sobre la tierra cuarenta días y cuarenta noches; y raeré de sobre la faz de la tierra a todo ser viviente que hice.'
        },
        {
          verseNumber: 5,
          verseKey: 'Génesis 7:5',
          hebrew: 'וַיַּ֖עַשׂ נֹ֑חַ כְּכֹ֥ל אֲשֶׁר־צִוָּ֖הוּ יְהֹוָֽה׃',
          transliteration: "Vaya'as Noaj kekol asher tzivahu YHVH.",
          spanish: 'E hizo Noaj conforme a todo lo que le mandó YHVH.'
        },
        {
          verseNumber: 11,
          verseKey: 'Génesis 7:11',
          hebrew: 'בִּשְׁנַ֨ת שֵׁשׁ־מֵא֤וֹת שָׁנָה֙ לְחַיֵּי־נֹ֔חַ בַּחֹ֙דֶשׁ֙ הַשֵּׁנִ֔י בְּשִׁבְעָֽה־עָשָׂ֥ר י֖וֹם לַחֹ֑דֶשׁ בַּיּ֣וֹם הַזֶּ֗ה נִבְקְעוּ֙ כׇּל־מַעְיְנֹת֙ תְּה֣וֹם רַבָּ֔ה וַאֲרֻבֹּ֥ת הַשָּׁמַ֖יִם נִפְתָּֽחוּ׃',
          transliteration: "Bishnat shesh me'ot shanah lejayei Noaj, bajódesh hashení, beshiv'á-asár yom lajódesh, bayom hazé nivke'u kol mayenot tehom rabá, va'arubot hashamáyim niftaju.",
          spanish: 'El año seiscientos de la vida de Noaj, en el mes segundo, a los diecisiete días del mes, aquel día fueron rotas todas las fuentes del gran abismo, y las cataratas de los cielos fueron abiertas.'
        },
        {
          verseNumber: 16,
          verseKey: 'Génesis 7:16',
          hebrew: 'וְהַבָּאִ֗ים זָכָ֨ר וּנְקֵבָ֤ה מִכׇּל־בָּשָׂר֙ בָּ֔אוּ כַּֽאֲשֶׁ֛ר צִוָּ֥ה אֹת֖וֹ אֱלֹהִ֑ים וַיִּסְגֹּ֥ר יְהֹוָ֖ה בַּֽעֲדֽוֹ׃',
          transliteration: "Vehabaim zajár unkevá mikol basar ba'u, ka'asher tzivah oto Elohim; vayisgor YHVH ba'ado.",
          spanish: 'Y los que vinieron, macho y hembra de toda carne vinieron, como le había mandado Elohim; y YHVH le cerró la puerta tras él.'
        }
      ]
    },
    {
      aliyahNumber: 3,
      nameHebrew: 'שְׁלִישִׁי',
      nameSpanish: '3ª Aliyá (Shlishí)',
      refRange: 'Génesis 7:17–8:14',
      verses: [
        {
          verseNumber: 17,
          verseKey: 'Génesis 7:17',
          hebrew: 'וַיְהִ֥י הַמַּבּ֛וּל אַרְבָּעִ֥ים י֖וֹם עַל־הָאָ֑רֶץ וַיִּרְבּ֣וּ הַמַּ֗יִם וַיִּשְׂא֞וּ אֶת־הַתֵּבָ֔ה וַתָּ֖רׇם מֵעַ֥ל הָאָֽרֶץ׃',
          transliteration: "Vayehí hamabul arba'im yom al ha'aretz, vayirbú hamáyim vayis'ú et hatevá, vatárom me'al ha'aretz.",
          spanish: 'Y vino el diluvio cuarenta días sobre la tierra; y las aguas crecieron y alzaron la Tevá, y se elevó por encima de la tierra.'
        },
        {
          verseNumber: 24,
          verseKey: 'Génesis 7:24',
          hebrew: 'וַיִּגְבְּר֥וּ הַמַּ֖יִם עַל־הָאָ֑רֶץ חֲמִשִּׁ֥ים וּמְאַ֖ת יֽוֹם׃',
          transliteration: "Vayigberú hamáyim al ha'aretz jamishim ume'at yom.",
          spanish: 'Y prevalecieron las aguas sobre la tierra ciento cincuenta días.'
        },
        {
          verseNumber: 1,
          verseKey: 'Génesis 8:1',
          hebrew: 'וַיִּזְכֹּ֤ר אֱלֹהִים֙ אֶת־נֹ֔חַ וְאֵ֤ת כׇּל־הַֽחַיָּה֙ וְאֶת־כׇּל־הַבְּהֵמָ֔ה אֲשֶׁ֥ר אִתּ֖וֹ בַּתֵּבָ֑ה וַיַּעֲבֵ֨ר אֱלֹהִ֥ים ר֙וּחַ֙ עַל־הָאָ֔רֶץ וַיָּשֹׁ֖כּוּ הַמָּֽיִם׃',
          transliteration: "Vayizkor Elohim et Noaj ve'et kol hajayah ve'et kol habehemá asher ito batevá; vaya'aver Elohim rúaj al ha'aretz vayashóku hamáyim.",
          spanish: 'Y se acordó Elohim de Noaj, y de todos los animales y de todas las bestias que estaban con él en la Tevá; e hizo pasar Elohim un viento sobre la tierra, y disminuyeron las aguas.'
        },
        {
          verseNumber: 4,
          verseKey: 'Génesis 8:4',
          hebrew: 'וַתָּ֤נַח הַתֵּבָה֙ בַּחֹ֣דֶשׁ הַשְּׁבִיעִ֔י בְּשִׁבְעָה־עָשָׂ֥ר י֖וֹם לַחֹ֑דֶשׁ עַ֖ל הָרֵ֥י אֲרָרָֽט׃',
          transliteration: "Vatánaj hatevá bajódesh hashvi'í beshiv'á-asár yom lajódesh, al harei Ararat.",
          spanish: 'Y reposó la Tevá en el mes séptimo, a los diecisiete días del mes, sobre los montes de Ararat.'
        },
        {
          verseNumber: 8,
          verseKey: 'Génesis 8:8',
          hebrew: 'וַיְשַׁלַּ֥ח אֶת־הַיּוֹנָ֖ה מֵאִתּ֑וֹ לִרְאוֹת֙ הֲקַ֣לּוּ הַמַּ֔יִם מֵעַ֖ל פְּנֵ֥י הָֽאֲדָמָֽה׃',
          transliteration: "Vayshalaj et hayoná me'ito, lir'ot hakalu hamáyim me'al pnei ha'adamá.",
          spanish: 'Envió también a la paloma, para ver si las aguas se habían retirado de sobre la faz de la tierra.'
        },
        {
          verseNumber: 11,
          verseKey: 'Génesis 8:11',
          hebrew: 'וַתָּבֹ֨א אֵלָ֥יו הַיּוֹנָה֮ לְעֵ֣ת עֶ֒רֶב֒ וְהִנֵּ֥ה עֲלֵה־זַ֖יִת טָרָ֣ף בְּפִ֑יהָ וַיֵּ֣דַע נֹ֔חַ כִּי־קַ֥לּוּ הַמַּ֖יִם מֵעַ֥ל הָאָֽרֶץ׃',
          transliteration: "Vatavó elav hayoná le'et érev, vehiné aleh záyit taraf befíha; vayeda Noaj ki kalu hamáyim me'al ha'aretz.",
          spanish: 'Y la paloma volvió a él a la hora de la tarde; y he aquí que traía una hoja de olivo arrancada en el pico; y entendió Noaj que las aguas habían menguado sobre la tierra.'
        }
      ]
    },
    {
      aliyahNumber: 4,
      nameHebrew: 'רְבִיעִי',
      nameSpanish: '4ª Aliyá (Revií)',
      refRange: 'Génesis 8:15–9:7',
      verses: [
        {
          verseNumber: 15,
          verseKey: 'Génesis 8:15',
          hebrew: 'וַיְדַבֵּ֥ר אֱלֹהִ֖ים אֶל־נֹ֥חַ לֵאמֹֽר׃',
          transliteration: "Vayedaber Elohim el Noaj lemor:",
          spanish: 'Y habló Elohim a Noaj, diciendo:'
        },
        {
          verseNumber: 16,
          verseKey: 'Génesis 8:16',
          hebrew: 'צֵ֖א מִן־הַתֵּבָ֑ה אַתָּ֕ה וְאִשְׁתְּךָ֛ וּבָנֶ֥יךָ וּנְשֵֽׁי־בָנֶ֖יךָ אִתָּֽךְ׃',
          transliteration: "Tzé min hatevá, atá ve'ishtejá uvanéija unshei vanéija itaj.",
          spanish: 'Sal de la Tevá tú, y tu mujer, y tus hijos, y las mujeres de tus hijos contigo.'
        },
        {
          verseNumber: 17,
          verseKey: 'Génesis 8:17',
          hebrew: 'כׇּל־הַחַיָּ֨ה אֲשֶֽׁר־אִתְּךָ֜ מִכׇּל־בָּשָׂ֗ר בָּע֧וֹף וּבַבְּהֵמָ֛ה וּבְכׇל־הָרֶ֛מֶשׂ הָרֹמֵ֥שׂ עַל־הָאָ֖רֶץ הוֹצֵ֣א אִתָּ֑ךְ וְשָׁרְצ֣וּ בָאָ֔רֶץ וּפָר֥וּ וְרָב֖וּ עַל־הָאָֽרֶץ׃',
          transliteration: "Kol hajayah asher itejá mikol basar ba'of uvabehemá uvejol harémes haromés al ha'aretz hotzé itaj; veshartzú va'aretz ufarú veravú al ha'aretz.",
          spanish: 'Todos los animales que están contigo de toda carne, de aves y de bestias y de todo reptil que se arrastra sobre la tierra, sacarás contigo; y vayan por la tierra, y fructifiquen y multiplíquense sobre la tierra.'
        },
        {
          verseNumber: 20,
          verseKey: 'Génesis 8:20',
          hebrew: 'וַיִּ֥בֶן נֹ֛חַ מִזְבֵּ֖חַ לַֽיהֹוָ֑ה וַיִּקַּ֞ח מִכֹּ֣ל ׀ הַבְּהֵמָ֣ה הַטְּהֹרָ֗ה וּמִכֹּל֙ הָע֣וֹף הַטָּהֹ֔ר וַיַּ֥עַל עֹלֹ֖ת בַּמִּזְבֵּֽחַ׃',
          transliteration: "Vayiven Noaj mizbéaj l'Adonai; vayikaj mikol habehemá hatehorá umikol ha'of hatahor, vaya'al olot bamizbéaj.",
          spanish: 'Y edificó Noaj un altar a YHVH, y tomó de todo animal puro y de toda ave pura, y ofreció ofrendas Olá en el altar.'
        },
        {
          verseNumber: 21,
          verseKey: 'Génesis 8:21',
          hebrew: 'וַיָּ֣רַח יְהֹוָה֮ אֶת־רֵ֣יחַ הַנִּיחֹחַ֒ וַיֹּ֨אמֶר יְהֹוָ֜ה אֶל־לִבּ֗וֹ לֹֽא־אֹ֠סִ֠ף לְקַלֵּ֨ל ע֤וֹד אֶת־הָֽאֲדָמָה֙ בַּעֲב֣וּר הָֽאָדָ֔ם כִּ֠י יֵ֣צֶר לֵ֧ב הָאָדָ֛ם רַ֥ע מִנְּעֻרָ֖יו וְלֹֽא־אֹסִ֥ף ע֛וֹד לְהַכּ֥וֹת אֶת־כׇּל־חַ֖י כַּֽאֲשֶׁ֥ר עָשִֽׂיתִי׃',
          transliteration: "Vayáraj YHVH et réaj hanijóaj, vayomer YHVH el libo: lo osif lekaleil od et ha'adamá ba'avur ha'adam, ki yetzer lev ha'adam ra min'urav; velo osif od lehakot et kol jai ka'asher asíti.",
          spanish: 'Y percibió YHVH olor grato; y dijo YHVH en Su corazón: No volveré más a maldecir la tierra por causa del hombre; porque el instinto del corazón del hombre es malo desde su juventud; ni volveré más a destruir todo ser viviente, como he hecho.'
        },
        {
          verseNumber: 22,
          verseKey: 'Génesis 8:22',
          hebrew: 'עֹ֖ד כׇּל־יְמֵ֣י הָאָ֑רֶץ זֶ֣רַע וְ֠קָצִ֠יר וְקֹ֨ר וָחֹ֜ם וְקַ֧יִץ וָחֹ֛רֶף וְי֥וֹם וָלַ֖יְלָה לֹ֥א יִשְׁבֹּֽתוּ׃',
          transliteration: "Od kol yemei ha'aretz, zéra vekatzir vekor vajom vekáyitz vajóref veyom valáylah lo yishbótu.",
          spanish: 'Mientras la tierra permanezca, no cesarán la siembra y la siega, el frío y el calor, el verano y el invierno, y el día y la noche.'
        },
        {
          verseNumber: 1,
          verseKey: 'Génesis 9:1',
          hebrew: 'וַיְבָ֣רֶךְ אֱלֹהִ֔ים אֶת־נֹ֖חַ וְאֶת־בָּנָ֑יו וַיֹּ֧אמֶר לָהֶ֛ם פְּר֥וּ וּרְב֖וּ וּמִלְא֥וּ אֶת־הָאָֽרֶץ׃',
          transliteration: "Vayevarej Elohim et Noaj ve'et banav, vayomer lahem: pru urvú umil'ú et ha'aretz.",
          spanish: 'Bendijo Elohim a Noaj y a sus hijos, y les dijo: Fructificad y multiplicaos, y llenad la tierra.'
        },
        {
          verseNumber: 6,
          verseKey: 'Génesis 9:6',
          hebrew: 'שֹׁפֵךְ֙ דַּ֣ם הָֽאָדָ֔ם בָּֽאָדָ֖ם דָּמ֣וֹ יִשָּׁפֵ֑ךְ כִּ֚י בְּצֶ֣לֶם אֱלֹהִ֔ים עָשָׂ֖ה אֶת־הָאָדָֽם׃',
          transliteration: "Shofej dam ha'adam, ba'adam damo yishafej; ki betzélem Elohim asah et ha'adam.",
          spanish: 'El que derramare sangre de hombre, por el hombre su sangre será derramada; porque a imagen de Elohim fue hecho el hombre.'
        }
      ]
    },
    {
      aliyahNumber: 5,
      nameHebrew: 'חֲמִישִׁי',
      nameSpanish: '5ª Aliyá (Jamishí)',
      refRange: 'Génesis 9:8–9:17',
      verses: [
        {
          verseNumber: 8,
          verseKey: 'Génesis 9:8',
          hebrew: 'וַיֹּ֤אמֶר אֱלֹהִים֙ אֶל־נֹ֔חַ וְאֶל־בָּנָ֥יו אִתּ֖וֹ לֵאמֹֽר׃',
          transliteration: "Vayomer Elohim el Noaj ve'el banav ito lemor:",
          spanish: 'Y habló Elohim a Noaj y a sus hijos con él, diciendo:'
        },
        {
          verseNumber: 9,
          verseKey: 'Génesis 9:9',
          hebrew: 'וַאֲנִ֕י הִנְנִ֥י מֵקִ֛ים אֶת־בְּרִיתִ֖י אִתְּכֶ֑ם וְאֶֽת־זַרְעֲכֶ֖ם אַֽחֲרֵיכֶֽם׃',
          transliteration: "Va'aní hineni mekim et brití itjem ve'et zar'ajem ajareijem.",
          spanish: 'He aquí que Yo establezco Mi pacto con vosotros, y con vuestra descendencia después de vosotros;'
        },
        {
          verseNumber: 11,
          verseKey: 'Génesis 9:11',
          hebrew: 'וַהֲקִמֹתִ֤י אֶת־בְּרִיתִי֙ אִתְּכֶ֔ם וְלֹֽא־יִכָּרֵ֧ת כׇּל־בָּשָׂ֛ר ע֖וֹד מִמֵּ֣י הַמַּבּ֑וּל וְלֹֽא־יִהְיֶ֥ה ע֛וֹד מַבּ֖וּל לְשַׁחֵ֥ת הָאָֽרֶץ׃',
          transliteration: "Vahakimotí et brití itjem, velo yikaret kol basar od mimei hamabul, velo yihyeh od mabul leshajet ha'aretz.",
          spanish: 'Y estableceré Mi pacto con vosotros, y no será destruida más toda carne por aguas de diluvio, ni habrá más diluvio para destruir la tierra.'
        },
        {
          verseNumber: 12,
          verseKey: 'Génesis 9:12',
          hebrew: 'וַיֹּ֣אמֶר אֱלֹהִ֗ים זֹ֚את אֽוֹת־הַבְּרִית֙ אֲשֶׁר־אֲנִ֣י נֹתֵ֗ן בֵּינִי֙ וּבֵ֣ינֵיכֶ֔ם וּבֵ֛ין כׇּל־נֶ֥פֶשׁ חַיָּ֖ה אֲשֶׁ֣ר אִתְּכֶ֑ם לְדֹרֹ֖ת עוֹלָֽם׃',
          transliteration: "Vayomer Elohim: zot ot haberit asher aní noten beini uveineijem uvein kol néfesh jayah asher itjem ledorot olam.",
          spanish: 'Y dijo Elohim: Ésta es la señal del pacto que Yo establezco entre Mí y vosotros y todo ser viviente que está con vosotros, por siglos perpetuos:'
        },
        {
          verseNumber: 13,
          verseKey: 'Génesis 9:13',
          hebrew: 'אֶת־קַשְׁתִּ֕י נָתַ֖תִּי בֶּֽעָנָ֑ן וְהָֽיְתָה֙ לְא֣וֹת בְּרִ֔ית בֵּינִ֖י וּבֵ֥ין הָאָֽרֶץ׃',
          transliteration: "Et kashtí natáti be'anán, vehayetá le'ot berit beini uvein ha'aretz.",
          spanish: 'Mi arco he puesto en las nubes, el cual será por señal del pacto entre Mí y la tierra.'
        },
        {
          verseNumber: 16,
          verseKey: 'Génesis 9:16',
          hebrew: 'וְהָיְתָ֥ה הַקֶּ֖שֶׁת בֶּֽעָנָ֑ן וּרְאִיתִ֗יהָ לִזְכֹּר֙ בְּרִ֣ית עוֹלָ֔ם בֵּ֣ין אֱלֹהִ֔ים וּבֵין֙ כׇּל־נֶ֣פֶשׁ חַיָּ֔ה בְּכׇל־בָּשָׂ֖ר אֲשֶׁ֥ר עַל־הָאָֽרֶץ׃',
          transliteration: "Vehayetá hakeshet be'anán, ur'itíha lizkor berit olam bein Elohim uvein kol néfesh jayah bekol basar asher al ha'aretz.",
          spanish: 'Y estará el arco en las nubes, y lo veré para acordarme del pacto perpetuo entre Elohim y todo ser viviente, con toda carne que está sobre la tierra.'
        }
      ]
    },
    {
      aliyahNumber: 6,
      nameHebrew: 'שִׁשִּׁי',
      nameSpanish: '6ª Aliyá (Shishí)',
      refRange: 'Génesis 9:18–10:32',
      verses: [
        {
          verseNumber: 18,
          verseKey: 'Génesis 9:18',
          hebrew: 'וַיִּֽהְי֣וּ בְנֵי־נֹ֗חַ הַיֹּֽצְאִים֙ מִן־הַתֵּבָ֔ה שֵׁ֖ם וְחָ֣ם וָיָ֑פֶת וְחָ֕ם ה֖וּא אֲבִ֥י כְנָֽעַן׃',
          transliteration: "Vayihyú vnei Noaj hayotz'im min hatevá: Shem, veJam vaYáfet; veJam hu aví Jená'an.",
          spanish: 'Y los hijos de Noaj que salieron de la Tevá fueron Shem, Jam y Yáfet; y Jam es el padre de Kenáan.'
        },
        {
          verseNumber: 19,
          verseKey: 'Génesis 9:19',
          hebrew: 'שְׁלֹשָׁ֥ה אֵ֖לֶּה בְּנֵי־נֹ֑חַ וּמֵאֵ֖לֶּה נָֽפְצָ֥ה כׇל־הָאָֽרֶץ׃',
          transliteration: "Shloshá eleh bnei Noaj, ume'eleh naftzah jol ha'aretz.",
          spanish: 'Estos tres son los hijos de Noaj, y de ellos se pobló toda la tierra.'
        },
        {
          verseNumber: 20,
          verseKey: 'Génesis 9:20',
          hebrew: 'וַיָּ֥חֶל נֹ֖חַ אִ֣ישׁ הָֽאֲדָמָ֑ה וַיִּטַּ֖ע כָּֽרֶם׃',
          transliteration: "Vayájel Noaj ish ha'adamá, vayitá kárem.",
          spanish: 'Después comenzó Noaj a labrar la tierra, y plantó una viña.'
        },
        {
          verseNumber: 26,
          verseKey: 'Génesis 9:26',
          hebrew: 'וַיֹּ֕אמֶר בָּר֥וּךְ יְהֹוָ֖ה אֱלֹ֣הֵי שֵׁ֑ם וִיהִ֥י כְנַ֖עַן עֶ֥בֶד לָֽמוֹ׃',
          transliteration: "Vayomer: baruj YHVH Elohei Shem, vihí Jená'an éved lamo.",
          spanish: 'Dijo más: Bendito sea YHVH el Elohim de Shem, y sea Kenáan su siervo.'
        },
        {
          verseNumber: 1,
          verseKey: 'Génesis 10:1',
          hebrew: 'וְאֵ֙לֶּה֙ תּוֹלְדֹ֣ת בְּנֵי־נֹ֔חַ שֵׁ֥ם חָ֖ם וָיָ֑פֶת וַיִּוָּלְד֥וּ לָהֶ֛ם בָּנִ֖ים אַחַ֥ר הַמַּבּֽוּל׃',
          transliteration: "Ve'eleh toldot bnei Noaj: Shem, Jam vaYáfet, vayivaldú lahem banim ajar hamabul.",
          spanish: 'Éstas son las generaciones de los hijos de Noaj: Shem, Jam y Yáfet, a quienes nacieron hijos después del diluvio.'
        },
        {
          verseNumber: 32,
          verseKey: 'Génesis 10:32',
          hebrew: 'אֵ֣לֶּה מִשְׁפְּחֹ֧ת בְּנֵי־נֹ֛חַ לְתוֹלְדֹתָ֖ם בְּגֽוֹיֵהֶ֑ם וּמֵאֵ֜לֶּה נִפְרְד֧וּ הַגּוֹיִ֛ם בָּאָ֖רֶץ אַחַ֥ר הַמַּבּֽוּל׃',
          transliteration: "Eleh mishpejot bnei Noaj letoldotam begoyeihem, ume'eleh nifredu hagoyim ba'aretz ajar hamabul.",
          spanish: 'Éstas son las familias de los hijos de Noaj por sus descendencias, en sus naciones; y de éstas se dividieron las naciones en la tierra después del diluvio.'
        }
      ]
    },
    {
      aliyahNumber: 7,
      nameHebrew: 'שְׁבִיעִי',
      nameSpanish: '7ª Aliyá (Shevií)',
      refRange: 'Génesis 11:1–11:32',
      verses: [
        {
          verseNumber: 1,
          verseKey: 'Génesis 11:1',
          hebrew: 'וַֽיְהִ֥י כׇל־הָאָ֖רֶץ שָׂפָ֣ה אֶחָ֑ת וּדְבָרִ֖ים אֲחָדִֽים׃',
          transliteration: "Vayehí jol ha'aretz safá ejat udevorim ajadim.",
          spanish: 'Y tenía entonces toda la tierra una sola lengua y unas mismas palabras.'
        },
        {
          verseNumber: 2,
          verseKey: 'Génesis 11:2',
          hebrew: 'וַֽיְהִ֖י בְּנׇסְעָ֣ם מִקֶּ֑דֶם וַֽיִּמְצְא֥וּ בִקְעָ֛ה בְּאֶ֥רֶץ שִׁנְעָ֖ר וַיֵּ֥שְׁבוּ שָֽׁם׃',
          transliteration: "Vayehí benos'am mikédem, vayimtze'u vik'ah be'éretz Shin'ar vayeshvu sham.",
          spanish: 'Y aconteció que cuando salieron de oriente, hallaron una llanura en la tierra de Sinar, y se establecieron allí.'
        },
        {
          verseNumber: 3,
          verseKey: 'Génesis 11:3',
          hebrew: 'וַיֹּאמְר֞וּ אִ֣ישׁ אֶל־רֵעֵ֗הוּ הָ֚בָה נִלְבְּנָ֣ה לְבֵנִ֔ים וְנִשְׂרְפָ֖ה לִשְׂרֵפָ֑ה וַתְּהִ֨י לָהֶ֤ם הַלְּבֵנָה֙ לְאָ֔בֶן וְהַ֣חֵמָ֔ר הָיָ֥ה לָהֶ֖ם לַחֹֽמֶר׃',
          transliteration: "Vayomrú ish el re'ehu: havah nilbenah levenim venisrefah lisrefah; vatéhi lahem halevenah le'áven, vehajemár hayah lahem lajómer.",
          spanish: 'Y se dijeron unos a otros: Vamos, hagamos ladrillo y cozámoslo con fuego. Y les sirvió el ladrillo en lugar de piedra, y el asfalto en lugar de mezcla.'
        },
        {
          verseNumber: 4,
          verseKey: 'Génesis 11:4',
          hebrew: 'וַיֹּאמְר֞וּ הָ֣בָה ׀ נִבְנֶה־לָּ֣נוּ עִ֗יר וּמִגְדָּל֙ וְרֹאשׁ֣וֹ בַשָּׁמַ֔יִם וְנַֽעֲשֶׂה־לָּ֖נוּ שֵׁ֑ם פֶּן־נָפ֖וּץ עַל־פְּנֵ֥י כׇל־הָאָֽרֶץ׃',
          transliteration: "Vayomrú: havah nivneh lánu ir umigdal verosho vashamáyim, vena'aseh lánu shem, pen nafútz al pnei kol ha'aretz.",
          spanish: 'Y dijeron: Vamos, edifiquémonos una ciudad y una torre, cuya cúspide llegue al cielo; y hagámonos un nombre, por si fuéremos esparcidos sobre la faz de toda la tierra.'
        },
        {
          verseNumber: 5,
          verseKey: 'Génesis 11:5',
          hebrew: 'וַיֵּ֣רֶד יְהֹוָ֔ה לִרְאֹ֥ת אֶת־הָעִ֖יר וְאֶת־הַמִּגְדָּ֑ל אֲשֶׁ֥ר בָּנ֖וּ בְּנֵ֥י הָאָדָֽם׃',
          transliteration: "Vayéred YHVH lir'ot et ha'ir ve'et hamigdal asher banú bnei ha'adam.",
          spanish: 'Y descendió YHVH para ver la ciudad y la torre que edificaban los hijos de los hombres.'
        },
        {
          verseNumber: 7,
          verseKey: 'Génesis 11:7',
          hebrew: 'הָ֚בָה נֵֽרְדָ֔ה וְנָבְלָ֥ה שָׁ֖ם שְׂפָתָ֑ם אֲשֶׁר֙ לֹ֣א יִשְׁמְע֔וּ אִ֖ישׁ שְׂפַ֥ת רֵעֵֽהוּ׃',
          transliteration: "Havah neredah venavlah sham sfatam, asher lo yishme'u ish sefat re'ehu.",
          spanish: 'Ahora, pues, descendamos, y confundamos allí su lengua, para que ninguno entienda el habla de su compañero.'
        },
        {
          verseNumber: 9,
          verseKey: 'Génesis 11:9',
          hebrew: 'עַל־כֵּ֞ן קָרָ֤א שְׁמָהּ֙ בָּבֶ֔ל כִּי־שָׁ֛ם בָּלַ֥ל יְהֹוָ֖ה שְׂפַ֣ת כׇּל־הָאָ֑רֶץ וּמִשָּׁם֙ הֱפִיצָ֣ם יְהֹוָ֔ה עַל־פְּנֵ֖י כׇּל־הָאָֽרֶץ׃',
          transliteration: "Al ken qara shemah Bavel, ki sham balal YHVH sefat kol ha'aretz, umisham hefitzam YHVH al pnei kol ha'aretz.",
          spanish: 'Por esto fue llamado su nombre Bavel, porque allí confundió YHVH el lenguaje de toda la tierra, y desde allí los esparció YHVH sobre la faz de toda la tierra.'
        },
        {
          verseNumber: 27,
          verseKey: 'Génesis 11:27',
          hebrew: 'וְאֵ֙לֶּה֙ תּוֹלְדֹ֣ת תֶּ֔רַח תֶּ֚רַח הוֹלִ֣יד אֶת־אַבְרָ֔ם אֶת־נָח֖וֹר וְאֶת־הָרָ֑ן וְהָרָ֖ן הוֹלִ֥יד אֶת־לֽוֹט׃',
          transliteration: "Ve'eleh toldot Téraj: Téraj holid et Avram, et Najor ve'et Harán; veHarán holid et Lot.",
          spanish: 'Éstas son las generaciones de Téraj: Téraj engendró a Avram, a Najor y a Harán; y Harán engendró a Lot.'
        },
        {
          verseNumber: 31,
          verseKey: 'Génesis 11:31',
          hebrew: 'וַיִּקַּ֨ח תֶּ֜רַח אֶת־אַבְרָ֣ם בְּנ֗וֹ וְאֶת־ל֤וֹט בֶּן־הָרָן֙ בֶּן־בְּנ֔וֹ וְאֵת֙ שָׂרַ֣י כַּלָּת֔וֹ אֵ֖שֶׁת אַבְרָ֣ם בְּנ֑וֹ וַיֵּצְא֨וּ אִתָּ֜ם מֵא֣וּר כַּשְׂדִּ֗ים לָלֶ֙כֶת֙ אַ֣רְצָה כְּנַ֔עַן וַיָּבֹ֣אוּ עַד־חָרָ֖ן וַיֵּ֥שְׁבוּ שָֽׁם׃',
          transliteration: "Vayikaj Téraj et Avram beno ve'et Lot ben Harán ben beno, ve'et Sarai kalato éshet Avram beno, vayetz'u itam me'Ur Kasdim laléjet ártzah Kená'an, vayavó'u ad Jarán vayeshvu sham.",
          spanish: 'Y tomó Téraj a Avram su hijo, y a Lot hijo de Harán, hijo de su hijo, y a Sarai su nuera, mujer de Avram su hijo, y salieron con ellos de Ur de los Kasdim, para ir a la tierra de Kenáan; y vinieron hasta Jarán, y se quedaron allí.'
        },
        {
          verseNumber: 32,
          verseKey: 'Génesis 11:32',
          hebrew: 'וַיִּהְי֣וּ יְמֵי־תֶ֔רַח חָמֵ֥שׁ שָׁנִ֖ים וּמָאתַ֣יִם שָׁנָ֑ה וַיָּ֥מׇת תֶּ֖רַח בְּחָרָֽן׃',
          transliteration: "Vayihyú yemei Téraj jamesh shanim umatáyim shanah; vayamot Téraj beJarán.",
          spanish: 'Y fueron los días de Téraj doscientos cinco años; y murió Téraj en Jarán.'
        }
      ]
    },
    {
      aliyahNumber: 8,
      nameHebrew: 'מַפְטִיר',
      nameSpanish: 'Maftir',
      refRange: 'Génesis 11:29–11:32',
      verses: [
        {
          verseNumber: 29,
          verseKey: 'Génesis 11:29',
          hebrew: 'וַיִּקַּ֨ח אַבְרָ֧ם וְנָח֛וֹר לָהֶ֖ם נָשִׁ֑ים שֵׁ֤ם אֵֽשֶׁת־אַבְרָם֙ שָׂרָ֔י וְשֵׁ֤ם אֵֽשֶׁת־נָחוֹר֙ מִלְכָּ֔ה בַּת־הָרָ֥ן אֲבִֽי־מִלְכָּ֖ה וַֽאֲבִ֥י יִסְכָּֽה׃',
          transliteration: "Vayikaj Avram veNajor lahem nashim: shem éshet Avram Sarai, veshem éshet Najor Milkah bat Harán, aví Milkah va'aví Yiskah.",
          spanish: 'Y tomaron Avram y Najor para sí mujeres; el nombre de la mujer de Avram era Sarai, y el nombre de la mujer de Najor, Milkah, hija de Harán, padre de Milkah y padre de Yiskah.'
        },
        {
          verseNumber: 30,
          verseKey: 'Génesis 11:30',
          hebrew: 'וַתְּהִ֥י שָׂרַ֖י עֲקָרָ֑ה אֵ֥ין לָ֖הּ וָלָֽד׃',
          transliteration: "Vatéhi Sarai akarah, ein lah valad.",
          spanish: 'Y Sarai era estéril, no tenía hijo.'
        },
        {
          verseNumber: 31,
          verseKey: 'Génesis 11:31',
          hebrew: 'וַיִּקַּ֨ח תֶּ֜רַח אֶת־אַבְרָ֣ם בְּנ֗וֹ וְאֶת־ל֤וֹט בֶּן־הָרָן֙ בֶּן־בְּנ֔וֹ וְאֵת֙ שָׂרַ֣י כַּלָּת֔וֹ אֵ֖שֶׁת אַבְרָ֣ם בְּנ֑וֹ וַיֵּצְא֨וּ אִתָּ֜ם מֵא֣וּר כַּשְׂדִּ֗ים לָלֶ֙כֶת֙ אַ֣רְצָה כְּנַ֔עַן וַיָּבֹ֣אוּ עַד־חָרָ֖ן וַיֵּ֥שְׁבוּ שָֽׁם׃',
          transliteration: "Vayikaj Téraj et Avram beno ve'et Lot ben Harán ben beno, ve'et Sarai kalato éshet Avram beno, vayetz'u itam me'Ur Kasdim laléjet ártzah Kená'an, vayavó'u ad Jarán vayeshvu sham.",
          spanish: 'Y tomó Téraj a Avram su hijo, y a Lot hijo de Harán, hijo de su hijo, y a Sarai su nuera, mujer de Avram su hijo, y salieron con ellos de Ur de los Kasdim, para ir a la tierra de Kenáan; y vinieron hasta Jarán, y se quedaron allí.'
        },
        {
          verseNumber: 32,
          verseKey: 'Génesis 11:32',
          hebrew: 'וַיִּהְי֣וּ יְמֵי־תֶ֔רַח חָמֵ֥שׁ שָׁנִ֖ים וּמָאתַ֣יִם שָׁנָ֑ה וַיָּ֥מׇת תֶּ֖רַח בְּחָרָֽן׃',
          transliteration: "Vayihyú yemei Téraj jamesh shanim umatáyim shanah; vayamot Téraj beJarán.",
          spanish: 'Y fueron los días de Téraj doscientos cinco años; y murió Téraj en Jarán.'
        }
      ]
    }
  ]
};
