import { SidurTefila } from '../types';
import { SHAJARIT_DATA } from './sidurShajaritData';

const shajaritAmidaSection = SHAJARIT_DATA.sections.find((s) => s.id === 'amida_jol');
const amidaSegments = shajaritAmidaSection ? shajaritAmidaSection.segments : [];
const shajaritShemaSegment = SHAJARIT_DATA.sections
  .find((s) => s.id === 'shema_u_virjoteha')
  ?.segments.find((seg) => seg.id === 'shema_yisrael');
const shajaritAlenuSegment = SHAJARIT_DATA.sections
  .find((s) => s.id === 'conclusion_shajarit')
  ?.segments.find((seg) => seg.id === 'alenu_leshabeaj');

/**
 * Liturgia Completa de Arvit de Días de Semana (Jol)
 * Rito Sefardí-Marroquí Tradicional (Núsaj Kehilot Maroko)
 * 100% íntegro: texto completo sin elipsis ni recortes.
 */
export const ARVIT_DATA: SidurTefila = {
  id: 'arvit',
  nameHebrew: 'תְּפִלַּת עַרְבִית לְחוֹל',
  nameSpanish: 'Arvit de Días de Semana',
  nameTranslit: 'Tefilat Arvít le-Jol',
  timeOfDay: 'evening',
  description: `La oración nocturna instituida por Jacob al caer la noche: amparo divino en la oscuridad, las bendiciones completas del Shemá con Hashkivénu marroquí, la Amidá de 19 bendiciones y Alénu LeShabéaj.`,
  sections: [
    // ------------------------------------------------------------------------
    // SECCIÓN 1: INICIO, BENDICIONES DE LA NOCHE Y SHEMÁ
    // ------------------------------------------------------------------------
    {
      id: 'arvit_inicio',
      order: 1,
      titleHebrew: 'פְּתִיחַת עַרְבִית, בִּרְכוֹת קְרִיאַת שְׁמַע וְהַשְׁכִּיבֵנוּ',
      titleSpanish: 'Inicio, Bendiciones de la Noche, Shemá y Hashkivénu',
      titleTranslit: 'Petiját Arvít, Birjót Shemá ve-Hashkivénu',
      description: `Salmo 134, convocatoria comunitaria, las dos bendiciones nocturnas previas, Shemá completo, bendición de redención y plegaria de amparo.`,
      segments: [
        {
          id: 'shir_hamaalot_134',
          titleHebrew: 'שִׁיר הַמַּעֲלוֹת (תְּהִלִּים קל״ד)',
          titleSpanish: 'Salmo 134 · Cántico de las Gradas Nocturno',
          titleTranslit: 'Shir HaMaalót',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `שִׁיר הַמַּעֲלוֹת: הִנֵּה בָּרְכוּ אֶת־יהוה כָּל־עַבְדֵי יהוה, הָעֹמְדִים בְּבֵית־יהוה בַּלֵּילוֹת:
שְׂאוּ־יְדֵיכֶם קֹדֶשׁ וּבָרְכוּ אֶת־יהוה:
יְבָרֶכְךָ יהוה מִצִּיּוֹן, עֹשֵׂה שָׁמַיִם וָאָרֶץ:
יהוה צְבָאוֹת עִמָּנוּ, מִשְׂגָּב לָנוּ אֱלֹהֵי יַעֲקֹב סֶלָה:
יהוה הוֹשִׁיעָה, הַמֶּלֶךְ יַעֲנֵנוּ בְיוֹם־קָרְאֵנוּ:`,
          transliteration: `Shir ha-maalót: Hinéh barjú et YHVH kol avdéi YHVH, ha-omdím be-vét YHVH ba-leilót.
Se'ú yedeijém kódesh u-varjú et YHVH.
Yevarejejá YHVH mi-Tziyón, oséh shamáyim va-áretz.
YHVH Tzevaót imánu, misgáv lánu Elohéi Yaakóv séla.
YHVH hoshí'ah, ha-Mélej yaanénu ve-yom kor'énu.`,
          spanish: `Cántico de las gradas: He aquí, bendecid a YHVH todos los siervos de YHVH, los que estáis en la Casa de YHVH por las noches.
Alzad vuestras manos en santidad y bendecid a YHVH.
Te bendiga YHVH desde Sión, Creador de los cielos y de la tierra.
YHVH de los ejércitos está con nosotros; refugio inexpugnable es para nosotros el Dios de Jacob.
YHVH, ¡salva!; que el Rey soberano nos responda en el día en que Le llamemos (Salmo 134, 46:12, 20:10).`,
        },
        {
          id: 'vehu_rajum',
          titleHebrew: 'וְהוּא רַחוּם וּבָרְכוּ',
          titleSpanish: 'VeHú Rajum y Convocatoria a la Oración Nocturna',
          titleTranslit: 'Ve-Hú Rajúm u-Varejú',
          posture: {
            type: 'bowing',
            label: 'Inclinación de reverencia',
            instruction: `Inclínese al pronunciar Barejú y levántese erguido al decir el Nombre Divino YHVH.`,
          },
          requiresMinian: true,
          hebrew: `וְהוּא רַחוּם, יְכַפֵּר עָוֹן וְלֹא־יַשְׁחִית, וְהִרְבָּה לְהָשִׁיב אַפּוֹ, וְלֹא־יָעִיר כָּל־חֲמָתוֹ: יהוה הוֹשִׁיעָה, הַמֶּלֶךְ יַעֲנֵנוּ בְיוֹם־קָרְאֵנוּ:
בָּרְכוּ אֶת־יהוה הַמְבֹרָךְ!
(קהל ושליח ציבור): בָּרוּךְ יהוה הַמְבֹרָךְ לְעוֹלָם וָעֶד!`,
          transliteration: `Ve-Hú rajúm, yejapér avón ve-lo yashjít, ve-hirbáh le-hashív apó, ve-lo yaír kol jamató. YHVH hoshí'ah, ha-Mélej yaanénu ve-yom kor'énu.
Barejú et YHVH ha-mvoráj!
(Respuesta): Barúj YHVH ha-mvoráj le-olám va-ed!`,
          spanish: `Y Él, siendo compasivo, perdona la iniquidad y no destruye; muchas veces retrae Su indignación y no desata todo Su furor. YHVH, ¡salva!; que el Rey nos responda en el día en que Le invoquemos.
¡Bendigamos a YHVH, el Bendito!
(Respuesta comunitaria): ¡Bendito sea YHVH, el Bendito, por siempre jamás!`,
        },
        {
          id: 'maariv_aravim',
          titleHebrew: 'אֲשֶׁר בִּדְבָרוֹ מַעֲרִיב עֲרָבִים',
          titleSpanish: 'Primera Bendición: La Caída de la Tarde y los Astros',
          titleTranslit: 'Maarív Aravím',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר בִּדְבָרוֹ מַעֲרִיב עֲרָבִים, בְּחָכְמָה פּוֹתֵחַ שְׁעָרִים, וּבִתְבוּנָה מְשַׁנֶּה עִתִּים, וּמַחֲלִיף אֶת־הַזְּמַנִּים, וּמְסַדֵּר אֶת־הַכּוֹכָבִים בְּמִשְׁמְרוֹתֵיהֶם בָּרָקִיעַ כִּרְצוֹנוֹ:
בּוֹרֵא יוֹם וָלָיְלָה, גּוֹלֵל אוֹר מִפְּנֵי חֹשֶׁךְ, וְחֹשֶׁךְ מִפְּנֵי אוֹר, וּמַעֲבִיר יוֹם וּמֵבִיא לָיְלָה, וּמַבְדִּיל בֵּין יוֹם וּבֵין לָיְלָה, יהוה צְבָאוֹת שְׁמוֹ:
אֵל חַי וְקַיָּם, תָּמִיד יִמְלוֹךְ עָלֵינוּ לְעוֹלָם וָעֶד:
בָּרוּךְ אַתָּה יהוה, הַמַּעֲרִיב עֲרָבִים:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ashér bi-dvaró maarív aravím, be-jojmáh potéaj shearím, u-vi-tvunáh meshanéh itím, u-majalíf et ha-zmaním, u-mesadér et ha-kojjavím be-mishmeroteihém ba-rakí'a kirtzonó.
Boré yom va-láylah, golél or mi-pnéi jóshej, ve-jóshej mi-pnéi or, u-maavír yom u-meví láylah, u-mavdíl bein yom u-véin láylah, YHVH Tzevaót shemó.
El jai ve-kayám, tamíd yimlój aléinu le-olám va-ed.
Barúj Atáh YHVH, ha-maarív aravím.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que con Su palabra hace caer los atardeceres, con sabiduría abre las puertas celestiales, con discernimiento altera los ciclos del tiempo, transforma las estaciones y dispone los astros en sus constelaciones en la bóveda celestial según Su voluntad.
Él crea el día y la noche, hace retroceder la luz ante la oscuridad y la oscuridad ante la luz, hace pasar el día y trae la noche, y establece la división entre el día y la noche; ¡YHVH de los ejércitos es Su Nombre!
Dios vivo y eterno, continuamente reinará sobre nosotros por siempre jamás.
Bendito eres Tú, YHVH, que hace caer las tardes.`,
        },
        {
          id: 'ahavat_olam_arvit',
          titleHebrew: 'אַהֲבַת עוֹלָם בֵּית יִשְׂרָאֵל',
          titleSpanish: 'Segunda Bendición: El Amor Eterno de la Alianza',
          titleTranslit: 'Ahavát Olám',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `אַהֲבַת עוֹלָם בֵּית יִשְׂרָאֵל עַמְּךָ אָהָבְתָּ, תּוֹרָה וּמִצְוֹת, חֻקִּים וּמִשְׁפָּטִים אוֹתָנוּ לִמַּדְתָּ:
עַל כֵּן יהוה אֱלֹהֵינוּ, בְּשָׁכְבֵנוּ וּבְקוּמֵנוּ נָשִׂיחַ בְּחֻקֶּיךָ, וְנִשְׂמַח בְּדִבְרֵי תַלְמוּד תּוֹרָתְךָ וּבְמִצְוֹתֶיךָ וּבְחֻקּוֹתֶיךָ לְעוֹלָם וָעֶד, כִּי הֵם חַיֵּינוּ וְאֹרֶךְ יָמֵינוּ, וּבָהֶם נֶהְגֶּה יוֹמָם וָלָיְלָה:
וְאַהֲבָתְךָ אַל תָּסִיר מִמֶּנּוּ לְעוֹלָמִים:
בָּרוּךְ אַתָּה יהוה, אוֹהֵב עַמּוֹ יִשְׂרָאֵל:`,
          transliteration: `Ahavát olám béit Yisraél amjá ahávta, Toráh u-mitzvót, jukím u-mishpatím otánu limádta.
Al ken YHVH Elohéinu, be-shojbénu u-ve-kuménu nasíaj be-jukéja, ve-nizmaj be-divréi talmúd Toratéja u-ve-mitzvotéja u-ve-jukotéja le-olám va-ed, ki hem jayéinu ve-órej yameínu, u-vahém nehguéh yomám va-láylah.
Ve-ahavatjá al tasír miménu le-olamím.
Barúj Atáh YHVH, ohév amó Yisraél.`,
          spanish: `Con amor eterno has amado a Tu pueblo la casa de Israel; Torá y mandamientos, estatutos y leyes de justicia nos enseñaste.
Por tanto, YHVH nuestro Dios, al acostarnos y al levantarnos conversaremos sobre Tus estatutos, y nos regocijaremos con las palabras del estudio de Tu Torá y con Tus mandamientos por siempre jamás; pues ellos son nuestra vida y la prolongación de nuestros días, y en ellos meditaremos día y noche.
Y que Tu amor jamás se aparte de nosotros por la eternidad.
Bendito eres Tú, YHVH, que ama a Su pueblo Israel.`,
        },
        {
          id: 'arvit_shema',
          titleHebrew: 'קְרִיאַת שְׁמַע שֶׁל עַרְבִית',
          titleSpanish: 'Shemá Israel Nocturno (Los 3 Párrafos Íntegros)',
          titleTranslit: 'Shemá Yisraél de-Arvít',
          posture: {
            type: 'cover_eyes',
            label: 'Cubrirse los ojos',
            instruction: `Cubra sus ojos con la mano derecha, prolongando con devoción la proclamación de la Unicidad Divina.`,
          },
          hebrew: shajaritShemaSegment ? shajaritShemaSegment.hebrew : '',
          transliteration: shajaritShemaSegment ? shajaritShemaSegment.transliteration : '',
          spanish: shajaritShemaSegment ? shajaritShemaSegment.spanish : '',
        },
        {
          id: 'emet_veemuna',
          titleHebrew: 'אֱמֶת וֶאֱמוּנָה',
          titleSpanish: 'Tercera Bendición: Verdad, Fidelidad y Redención Nocturna',
          titleTranslit: 'Emét ve-Emunáh',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `אֱמֶת וֶאֱמוּנָה כָּל־זֹאת, וְקַיָּם עָלֵינוּ, כִּי הוּא יהוה אֱלֹהֵינוּ וְאֵין זוּלָתוֹ, וַאֲנַחְנוּ יִשְׂרָאֵל עַמּוֹ:
הַפּוֹדֵנוּ מִיַּד מְלָכִים, מַלְכֵּנוּ הַגּוֹאֲלֵנוּ מִכַּף כָּל־הֶעָרִיצִים, הָאֵל הַנִּפְרָע לָנוּ מִצָּרֵינוּ, וְהַמְשַׁלֵּם גְּמוּל לְכָל־אוֹיְבֵי נַפְשֵׁנוּ:
הַשָּׂם נַפְשֵׁנוּ בַּחַיִּים, וְלֹא נָתַן לַמּוֹט רַגְלֵנוּ:
הַמַּדְרִיכֵנוּ עַל בָּמוֹת אוֹיְבֵינוּ, וַיָּרֶם קַרְנֵנוּ עַל כָּל־שׂוֹנְאֵינוּ:
הָעֹשֶׂה לָּנוּ נִסִּים וּנְקָמָה בְּפַרְעֹה, אוֹתוֹת וּמוֹפְתִים בְּאַדְמַת בְּנֵי חָם:
הַמַּכֶּה בְעֶבְרָתוֹ כָּל־בְּכוֹרֵי מִצְרָיִם, וַיּוֹצֵא אֶת־עַמּוֹ יִשְׂרָאֵל מִתּוֹכָם לְחֵרוּת עוֹלָם:
הַמַּעֲבִיר בָּנָיו בֵּין גִּזְרֵי יַם סוּף, וְאֶת־רוֹדְפֵיהֶם וְאֶת־שׂוֹנְאֵיהֶם בִּתְהוֹמוֹת טִבַּע:
וְרָאוּ בָנָיו גְּבוּרָתוֹ, שִׁבְּחוּ וְהוֹדוּ לִשְׁמוֹ, וּמַלְכוּתוֹ בְרָצוֹן קִבְּלוּ עֲלֵיהֶם, מֹשֶׁה וּבְנֵי יִשְׂרָאֵל לְךָ עָנוּ שִׁירָה בְּשִׂמְחָה רַבָּה, וְאָמְרוּ כֻלָּם:
מִי כָמֹכָה בָּאֵלִם יהוה, מִי כָּמֹכָה נֶאְדָּר בַּקֹּדֶשׁ, נוֹרָא תְהִלֹּת עֹשֵׂה פֶלֶא:
מַלְכוּתְךָ יהוה אֱלֹהֵינוּ רָאוּ בָנֶיךָ עַל הַיָּם, יַחַד כֻּלָּם הוֹדוּ וְהִמְלִיכוּ וְאָמְרוּ:
יהוה יִמְלֹךְ לְעוֹלָם וָעֶד:
וְנֶאֱמַר: כִּי פָדָה יהוה אֶת־יַעֲקֹב, וּגְאָלוֹ מִיַּד חָזָק מִמֶּנּוּ:
בָּרוּךְ אַתָּה יהוה, גָּאַל יִשְׂרָאֵל:`,
          transliteration: `Emét ve-emunáh kol zot, ve-kayám aléinu, ki Hu YHVH Elohéinu ve-éin zulató, va-anájnu Yisraél amó.
Ha-podénu mi-yad melajím, Malkénu ha-goalénu mi-kaf kol ha-aritzím, ha-El ha-nifrá lánu mi-tzaréinu, ve-ha-meshalém gmul le-jol oyvéi nafshénu.
Ha-sam nafshénu ba-jayím, ve-lo natán la-mot raglénu.
Ha-madrijénu al bamót oyvéinu, va-yárem karnénu al kol sone\'éinu.
Ha-oséh lánu nisím u-nekamáh be-Far\'óh, otot u-moftím be-admát benéi Jam.
Ha-makéh ve-evrató kol bejoréi Mitzráyim, va-yotzé et amó Yisraél mi-tojám le-jerút olám.
Ha-maavír banáv bein gizréi yam suf, ve-et rodfeihém ve-et soneihém bi-thomot tibá.
Ve-raú vanáv gevurató, shibejú ve-hodú li-shmó, u-maljutó be-ratzón kibelú aleihém, Moshéh u-vnéi Yisraél lejá anú shiráh be-simjáh rabáh, ve-amrú julám:
Mi jamójah ba-elím YHVH, mi kamójah needár ba-kódesh, norá tehilót oséh féleh.
Maljutjá YHVH Elohéinu raú vanéja al ha-yam, yájad kulám hodú ve-himlíju ve-amrú:
YHVH yimlój le-olám va-ed!
Ve-neemár: Ki fadáh YHVH et Yaakóv, u-gealó mi-yad jazák miménu.
Barúj Atáh YHVH, gaál Yisraél.`,
          spanish: `Verdadera y digna de toda fe es esta palabra, y obligatoria para nosotros: que Él es YHVH nuestro Dios y no hay otro fuera de Él, y nosotros somos Israel Su pueblo.
Él nos rescata de la mano de tiranos; nuestro Rey nos redime del poder de los déspotas; el Dios que cobra retribución por nosotros de nuestros opresores y retribuye con merecido castigo a los enemigos de nuestra alma.
Él mantiene nuestra alma en la vida, y no permite que vacile nuestro pie.
Él nos hace marchar sobre las alturas de nuestros adversarios, y ensalza nuestro poder sobre todos los que nos aborrecen.
Él obró prodigios y venganza sobre el Faraón, señales y maravillas en la tierra de los hijos de Cam.
Él hirió en Su justa cólera a todos los primogénitos de Egipto, y sacó a Su pueblo Israel de en medio de ellos hacia una libertad imperecedera.
Él hizo cruzar a Sus hijos entre las divisiones del Mar Rojo, y a sus perseguidores y enemigos anegó en las profundidades.
Vieron Sus hijos Su infinito poder, alabaron y dieron gracias a Su Santo Nombre, y aceptaron sobre sí Su soberanía de buena voluntad; Moisés y los hijos de Israel entonaron para Ti este cántico con inmenso alborozo, y todos proclamaron:
"¿Quién como Tú entre los poderosos, oh YHVH? ¿Quién como Tú, magnífico en santidad, imponente en loores, hacedor de maravillas?"
Tu soberanía, YHVH nuestro Dios, vieron Tus hijos sobre el mar; unánimes todos dieron gracias, proclamaron Tu reinado y dijeron:
"¡YHVH reinará por siempre jamás!"
Y fue dicho por el profeta: "Pues YHVH ha rescatado a Jacob, y lo ha redimido de manos de quien era más fuerte que él" (Jeremías 31:10).
Bendito eres Tú, YHVH, que redimió a Israel.`,
        },
        {
          id: 'hashkivenu_morocco',
          titleHebrew: 'הַשְׁכִּיבֵנוּ (נוֹסַח מָרוֹקוֹ הַמֻּרְחָב)',
          titleSpanish: 'Hashkivénu · Rito Marroquí Extendido con Triple Bendición de Paz',
          titleTranslit: 'Hashkivénu (Núsaj Maróko)',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `הַשְׁכִּיבֵנוּ יהוה אֱלֹהֵינוּ לְשָׁלוֹם, וְהַעֲמִידֵנוּ מַלְכֵּנוּ לְחַיִּים טוֹבִים וּלְשָׁלוֹם, וּפְרוֹשׂ עָלֵינוּ סֻכַּת שְׁלוֹמֶךָ, וְתַקְּנֵנוּ בְּעֵצָה טוֹבָה מִלְּפָנֶיךָ, וְהוֹשִׁיעֵנוּ מְהֵרָה לְמַעַן שְׁמֶךָ, וְהָגֵן בַּעֲדֵנוּ, וְהָסֵר מֵעָלֵינוּ אוֹיֵב, דֶּבֶר, וְחֶרֶב, וְרָעָב, וְיָגוֹן, וְהָסֵר שָׂטָן מִלְּפָנֵינוּ וּמֵאַחֲרֵינוּ, וּבְצֵל כְּנָפֶיךָ תַּסְתִּירֵנוּ, כִּי אֵל שׁוֹמְרֵנוּ וּמַצִּילֵנוּ אָתָּה, כִּי אֵל מֶלֶךְ חַנּוּן וְרַחוּם אָתָּה, וּשְׁמוֹר צֵאתֵנוּ וּבוֹאֵנוּ לְחַיִּים וּלְשָׁלוֹם מֵעַתָּה וְעַד־עוֹלָם:
וּפְרוֹשׂ עָלֵינוּ סֻכַּת שְׁלוֹמֶךָ, וְעַל כָּל־עַמְּךָ יִשְׂרָאֵל, וְעַל יְרוּשָׁלָיִם:
בָּרוּךְ אַתָּה יהוה, הַפּוֹרֵשׂ סֻכַּת שָׁלוֹם עָלֵינוּ, וְעַל כָּל־עַמּוֹ יִשְׂרָאֵל, וְעַל יְרוּשָׁלָיִם:`,
          transliteration: `Hashkivénu YHVH Elohéinu le-shalóm, ve-haamidénu Malkénu le-jayím tovím u-le-shalóm, u-frós aléinu sukát shloméja, ve-taknénu be-etzáh továh mi-lefanéja, ve-hoshiénu meheráh le-máan sheméja, ve-hagén baadénu, ve-hasér mealéinu oyév, déver, ve-jérev, ve-raáv, ve-yagón, ve-hasér satán mi-lefanéinu u-me-ajaréinu, u-ve-tzél kenaféja tastirénu, ki El shomrénu u-matzilénu Atáh, ki El Mélej janún ve-rajúm Atáh, u-shmór tzeténu u-voénu le-jayím u-le-shalóm me-atáh ve-ad olám.
U-frós aléinu sukát shloméja, ve-al kol amjá Yisraél, ve-al Yerushaláyim.
Barúj Atáh YHVH, ha-porés sukát shalóm aléinu, ve-al kol amó Yisraél, ve-al Yerushaláyim.`,
          spanish: `Haznos acostar, YHVH nuestro Dios, en paz; y levántanos, Rey nuestro, a una vida buena y en paz. Despliega sobre nosotros la tienda de Tu paz, guíanos con sabio consejo de Tu presencia y sálvanos prontamente por causa de Tu Nombre. Protégenos y aparta de nosotros al enemigo, la peste, la espada, el hambre y la pesadumbre; retira a la fuerza destructora de delante y detrás de nosotros, y bajo la sombra de Tus alas cobíjanos; pues Dios que nos preserva y rescata eres Tú, Rey piadoso y compasivo eres Tú. Guarda nuestras salidas y nuestras entradas para vida y bienestar, desde ahora y para siempre jamás.
Y extiende sobre nosotros el tabernáculo de Tu paz, y sobre todo Tu pueblo Israel, y sobre Jerusalén.
Bendito eres Tú, YHVH, que extiende la tienda de paz sobre nosotros, sobre todo Su pueblo Israel y sobre Jerusalén.`,
          moroccanNote: `En la liturgia marroquí se enfatiza siempre la triple bendición de paz: sobre nosotros, sobre el pueblo de Israel y sobre Jerusalén la Santa.`,
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 2: AMIDÁ NOCTURNA (19 BENDICIONES COMPLETAS)
    // ------------------------------------------------------------------------
    {
      id: 'arvit_amida_section',
      order: 2,
      titleHebrew: 'עֲמִידָה שֶׁל עַרְבִית (19 בְּרָכוֹת)',
      titleSpanish: 'La Amidá · Las 19 Bendiciones de Arvit',
      titleTranslit: 'Shemonéh Esréh de-Arvít',
      description: `Las 19 bendiciones completas recitadas de pie con pies juntos hacia Jerusalén en el silencio de la noche.`,
      segments: amidaSegments.map((seg) => ({
        ...seg,
        id: `arvit_${seg.id}`,
      })),
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 3: CIERRE NOCTURNO Y ALÉNU LESHABÉAJ
    // ------------------------------------------------------------------------
    {
      id: 'arvit_cierre',
      order: 3,
      titleHebrew: 'עָלֵינוּ לְשַׁבֵּחַ שֶׁל לַיְלָה',
      titleSpanish: 'Alénu LeShabéaj de la Noche (Completo)',
      titleTranslit: 'Alénu LeShabéaj',
      description: `Proclamación final antes del descanso nocturno asegurando la soberanía monoteísta en el corazón.`,
      segments: [
        {
          id: 'arvit_alenu',
          titleHebrew: 'עָלֵינוּ לְשַׁבֵּחַ שֶׁל לַיְלָה',
          titleSpanish: 'Alénu LeShabéaj Nocturno (Partes 1 y 2 Íntegras)',
          titleTranslit: 'Alénu LeShabéaj',
          posture: {
            type: 'bowing',
            label: 'De pie e inclinación',
            instruction: `Inclínese al decir "Va-anájnu kor\'ím u-mishtajavím u-modím".`,
          },
          hebrew: shajaritAlenuSegment ? shajaritAlenuSegment.hebrew : '',
          transliteration: shajaritAlenuSegment ? shajaritAlenuSegment.transliteration : '',
          spanish: shajaritAlenuSegment ? shajaritAlenuSegment.spanish : '',
        },
      ],
    },
  ],
};
