import { SidurTefila } from '../types';

/**
 * Liturgia Completa de Shajarit de Días de Semana (Jol)
 * Rito Sefardí-Marroquí Tradicional (Núsaj Kehilot Maroko)
 * 100% íntegro: texto completo sin elipsis ni recortes.
 */
export const SHAJARIT_DATA: SidurTefila = {
  id: 'shajarit',
  nameHebrew: 'תְּפִלַּת שַׁחֲרִית לְחוֹל',
  nameSpanish: 'Shajarit de Días de Semana',
  nameTranslit: 'Tefilat Shajarit le-Jol',
  timeOfDay: 'morning',
  description: `Liturgia matutina completa según el Núsaj Marroquí: Birjot HaShajar, Talit y Tefilín, Korbanot y Pitum HaKetoret íntegros, Pesuké deZimrá con Shirat HaYam, Shemá con sus bendiciones, Amidá de 19 bendiciones, Tajanún con Salmo 25, Uvá LeTsiyón con Kedushá de-Sidrá y Alénu LeShabéaj.`,
  sections: [
    // ------------------------------------------------------------------------
    // SECCIÓN 1: BENDICIONES DE LA MAÑANA Y DE LA TORÁ
    // ------------------------------------------------------------------------
    {
      id: 'birjot_hashajar',
      order: 1,
      titleHebrew: 'בִּרְכוֹת הַשַּׁחַר וְהַתּוֹרָה',
      titleSpanish: 'Bendiciones de la Mañana y de la Torá',
      titleTranslit: 'Birjot HaShajar ve-HaTorá',
      description: `Agradecimiento al despertar por la restitución del alma, pureza corporal y precepto del estudio sagrado.`,
      segments: [
        {
          id: 'modeh_ani',
          titleHebrew: 'מוֹדֶה אֲנִי',
          titleSpanish: 'Reconocimiento al despertar',
          titleTranslit: 'Modéh Aní',
          posture: {
            type: 'sitting',
            label: 'Sentado en el lecho',
            instruction: `Se recita inmediatamente al abrir los ojos, antes de tocar agua o levantarse.`,
          },
          hebrew: `מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם, שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה, רַבָּה אֱמוּנָתֶךָ:`,
          transliteration: `Modéh aní lefanéja, Mélej jai ve-kayám, she-hejezárta bi nishmatí be-jemlá, rabáh emunatéja.`,
          spanish: `Te agradezco a Ti, Rey viviente y eterno, que me has devuelto mi alma con misericordia; inmensa es Tu fidelidad.`,
          moroccanNote: `En el rito marroquí no se pronuncia ningún Nombre Divino aquí para poder decirlo con santidad antes de Netilat Yadáyim.`,
        },
        {
          id: 'netilat_yadayim',
          titleHebrew: 'נְטִילַת יָדַיִם',
          titleSpanish: 'Lavado ritual matutino de manos',
          titleTranslit: 'Netilat Yadáyim',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `Vierta agua 3 veces de forma intercalada sobre cada mano (derecha, izquierda) y seque antes de la bendición.`,
          },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל נְטִילַת יָדָיִם:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ashér kidshánu be-mitzvotáv ve-tzivánu al netilát yadáyim.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que nos santificó con Sus mandamientos y nos ordenó sobre el lavado de manos.`,
        },
        {
          id: 'asher_yatzar',
          titleHebrew: 'אֲשֶׁר יָצַר',
          titleSpanish: 'Bendición de la anatomía humana',
          titleTranslit: 'Ashér Yatzár',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `Recitar con profunda reverencia agradeciendo el maravilloso funcionamiento de los órganos y conductos.`,
          },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר יָצַר אֶת־הָאָדָם בְּחָכְמָה, וּבָרָא בוֹ נְקָבִים נְקָבִים, חֲלוּלִים חֲלוּלִים. גָּלוּי וְיָדוּעַ לִפְנֵי כִסֵּא כְבוֹדֶךָ, שֶׁאִם יִפָּתַח אֶחָד מֵהֶם, אוֹ יִסָּתֵם אֶחָד מֵהֶם, אִי אֶפְשַׁר לְהִתְקַיֵּם וְלַעֲמוֹד לְפָנֶיךָ אֲפִלּוּ שָׁעָה אֶחָת: בָּרוּךְ אַתָּה יהוה, רוֹפֵא כָל־בָּשָׂר וּמַפְלִיא לַעֲשׂוֹת:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ashér yatzár et ha-adám be-jojmá, u-vará vo nekavím nekavím, jalulím jalulím. Galúi ve-yadúa lifnéi kisé jevodéja, she-im yipatáj ejád mehém, o yisatém ejád mehém, i efshár lehitkayém ve-laamód lefanéja afílu shaá eját. Barúj Atáh YHVH, rofé jol basár u-maflí laasót.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que formó al ser humano con sabiduría y creó en él orificios y cavidades. Sabido y manifiesto es ante el trono de Tu gloria que si uno de ellos se obstruyera o se abriera, no sería posible subsistir ni estar ante Ti siquiera una hora. Bendito eres Tú, YHVH, que sana a toda criatura y actúa maravillosamente.`,
        },
        {
          id: 'elohai_neshama',
          titleHebrew: 'אֱלֹהַי נְשָׁמָה',
          titleSpanish: 'Pureza del alma',
          titleTranslit: 'Elohái Neshamá',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `אֱלֹהַי, נְשָׁמָה שֶׁנָּתַתָּ בִּי טְהוֹרָה הִיא, אַתָּה בְרָאתָהּ, אַתָּה יְצַרְתָּהּ, אַתָּה נְפַחְתָּהּ בִּי, וְאַתָּה מְשַׁמְּרָהּ בְּקִרְבִּי, וְאַתָּה עָתִיד לִטְּלָהּ מִמֶּנִּי, וּלְהַחֲזִירָהּ בִּי לֶעָתִיד לָבוֹא. כָּל־זְמַן שֶׁהַנְּשָׁמָה בְּקִרְבִּי מוֹדֶה אֲנִי לְפָנֶיךָ, יהוה אֱלֹהַי וֵאלֹהֵי אֲבוֹתַי, רִבּוֹן כָּל־הַמַּעֲשִׂים, אֲדוֹן כָּל־הַנְּשָׁמוֹת: בָּרוּךְ אַתָּה יהוה, הַמַּחֲזִיר נְשָׁמוֹת לִפְגָרִים מֵתִים:`,
          transliteration: `Elohái, neshamá she-natáta bi tehoráh hi, Atáh veratáh, Atáh yetzartáh, Atáh nefahtáh bi, ve-Atáh meshameráh be-kirbí, ve-Atáh atíd liteláh miméni, u-lehajaziráh bi le-atíd lavó. Kol zman she-ha-neshamá be-kirbí, modéh aní lefanéja, YHVH Elohái ve-Elohéi avotái, Ribón kol ha-maasím, Adón kol ha-neshamót. Barúj Atáh YHVH, ha-majazír neshamót lifgarím metím.`,
          spanish: `Dios mío: el alma que me has infundido es pura. Tú la creaste, Tú la formaste, Tú la insuflaste en mí y Tú la custodias en mi interior; Tú en el futuro la tomarás de mí y la devolverás a mí en la era venidera. Mientras el alma habite en mi interior, yo Te agradezco, YHVH mi Dios y Dios de mis antepasados, Soberano de todas las obras, Amo de todas las almas. Bendito eres Tú, YHVH, que restituye las almas a los cuerpos exánimes.`,
        },
        {
          id: 'birjot_hashajar_15',
          titleHebrew: 'בִּרְכוֹת הַשַּׁחַר (טו בְּרָכוֹת)',
          titleSpanish: 'Las 15 Bendiciones del Amanecer',
          titleTranslit: 'Birjot HaShajar',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַנּוֹתֵן לַשֶּׂכְוִי בִינָה לְהַבְחִין בֵּין יוֹם וּבֵין לָיְלָה:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, פּוֹקֵחַ עִוְרִים:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, מַתִּיר אֲסוּרִים:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, זוֹקֵף כְּפוּפִים:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, מַלְבִּישׁ עֲרֻמִּים:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַנּוֹתֵן לַיָּעֵף כֹּחַ:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, רוֹקַע הָאָרֶץ עַל־הַמָּיִם:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַמֵּכִין מִצְעֲדֵי־גָבֶר:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, שֶׁעָשָׂה לִי כָּל־צָרְכִּי:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אוֹזֵר יִשְׂרָאֵל בִּגְבוּרָה:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, עוֹטֵר יִשְׂרָאֵל בְּתִפְאָרָה:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, שֶׁלֹּא עָשַׂנִי גּוֹי:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, שֶׁלֹּא עָשַׂנִי עָבֶד:
(גברים): בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, שֶׁלֹּא עָשַׂנִי אִשָּׁה:
(נשים): בָּרוּךְ שֶׁעָשַׂנִי כִּרְצוֹנוֹ:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַמַּעֲבִיר חֶבְלֵי שֵׁנָה מֵעֵינָי וּתְנוּמָה מֵעַפְעַפָּי:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ha-notén la-sejví vináh lehavjín bein yom u-véin láylah.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, pokéaj ivrím.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, matír asurím.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, zokéf kefufím.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, malbísh arumím.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ha-notén la-yaéf kóaj.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, roká ha-áretz al ha-máyim.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ha-mejín mitz'adéi gáver.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, she-asáh li kol tzorkí.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ozér Yisraél bi-gvuráh.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, otér Yisraél be-tif'aráh.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, she-lo asáni goy.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, she-lo asáni áved.
(Hombres): Barúj Atáh YHVH, Elohéinu Mélej ha-olám, she-lo asáni isháh.
(Mujeres): Barúj she-asáni kirtzonó.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ha-maavír jevléi shenáh me-eynái u-tnumáh me-af'apái.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que da al gallo inteligencia para distinguir entre el día y la noche.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que abre los ojos a los ciegos.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que libera a los cautivos.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que yergue a los encorvados.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que viste a los desvalidos.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que da fuerzas al exhausto.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que expande la tierra sobre las aguas.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que afirma los pasos del ser humano.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que me ha provisto de todo lo necesario.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que ciñe a Israel con fortaleza.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que corona a Israel con esplendor.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que no me hizo idólatra.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que no me hizo esclavo.
(Hombres): Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que no me hizo mujer.
(Mujeres): Bendito Quien me hizo según Su santa voluntad.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que retira los lazos del sueño de mis ojos y el sopor de mis párpados.`,
        },
        {
          id: 'birjot_hatora',
          titleHebrew: 'בִּרְכוֹת הַתּוֹרָה וּפָרָשַׁת כֹּהֲנִים',
          titleSpanish: 'Bendiciones de la Torá y Bendición Sacerdotal',
          titleTranslit: 'Birjot HaTorá',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `Obligatorio recitarlas antes de leer cualquier pasaje bíblico o talmúdico del día.`,
          },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל דִּבְרֵי תוֹרָה:
וְהַעֲרֵב נָא יהוה אֱלֹהֵינוּ אֶת־דִּבְרֵי תוֹרָתְךָ בְּפִינוּ וּבְפִיפִיּוֹת עַמְּךָ בֵּית יִשְׂרָאֵל, וְנִהְיֶה אֲנַחְנוּ וְצֶאֱצָאֵינוּ וְצֶאֱצָאֵי עַמְּךָ בֵּית יִשְׂרָאֵל כֻּלָּנוּ יוֹדְעֵי שְׁמֶךָ וְלוֹמְדֵי תוֹרָתְךָ לִשְׁמָהּ: בָּרוּךְ אַתָּה יהוה, הַמְלַמֵּד תּוֹרָה לְעַמּוֹ יִשְׂרָאֵל:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר בָּחַר בָּנוּ מִכָּל־הָעַמִּים וְנָתַן לָנוּ אֶת־תּוֹרָתוֹ: בָּרוּךְ אַתָּה יהוה, נוֹתֵן הַתּוֹרָה:

וַיְדַבֵּר יהוה אֶל־מֹשֶׁה לֵּאמֹר: דַּבֵּר אֶל־אַהֲרֹן וְאֶל־בָּנָיו לֵאמֹר, כֹּה תְבָרֲכוּ אֶת־בְּנֵי יִשְׂרָאֵל, אָמוֹר לָהֶם:
יְבָרֶכְךָ יהוה וְיִשְׁמְרֶךָ:
יָאֵר יהוה פָּנָיו אֵלֶיךָ וִיחֻנֶּךָּ:
יִשָּׂא יהוה פָּנָיו אֵלֶיךָ, וְיָשֵׂם לְךָ שָׁלוֹם:
וְשָׂמוּ אֶת־שְׁמִי עַל־בְּנֵי יִשְׂרָאֵל, וַאֲנִי אֲבָרֲכֵם:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ashér kidshánu be-mitzvotáv ve-tzivánu al divréi Toráh.
Ve-haaréb na YHVH Elohéinu et divréi Toratéja be-fínu u-ve-fifiyót amejá béit Yisraél, ve-nihyéh anájnu ve-tzeetzaéinu ve-tzeetzaéi amejá béit Yisraél kulánu yod'éi sheméja ve-lomdéi Toratéja lishmáh. Barúj Atáh YHVH, ha-melaméd Toráh le-amó Yisraél.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ashér bájar bánu mi-kol ha-amím ve-natán lánu et Torató. Barúj Atáh YHVH, notén ha-Toráh.

Va-yedabér YHVH el Moshéh lemór: Dabér el Aharón ve-el banáv lemór, koh tevarajú et benéi Yisraél, amór lahém:
Yevarejejá YHVH ve-yishmeréja.
Yaér YHVH panáv eléja vi-yjunéka.
Yisá YHVH panáv eléja, ve-yasém lejá shalóm.
Ve-samú et Shemí al benéi Yisraél, va-Aní avarjém.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que nos santificó con Sus mandamientos y nos prescribió ocuparnos de las palabras de la Torá.
Y haz dulces, por favor, YHVH nuestro Dios, las palabras de Tu Torá en nuestra boca y en la boca de Tu pueblo la casa de Israel, para que nosotros, nuestros descendientes y los descendientes de Tu pueblo seamos todos conocedores de Tu Nombre y estudiosos de Tu Torá en aras de ella misma. Bendito eres Tú, YHVH, que enseña Torá a Su pueblo Israel.
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que nos eligió de entre todas las naciones y nos entregó Su Torá. Bendito eres Tú, YHVH, Dador de la Torá.

Y habló YHVH a Moisés diciendo: Habla a Aarón y a sus hijos diciendo: Así bendeciréis a los hijos de Israel, diciéndoles:
Que YHVH te bendiga y te preserve;
Que YHVH ilumine Su rostro hacia ti y te agracie;
Que YHVH eleve Su semblante hacia ti y te conceda la paz.
Y pondrán Mi Nombre sobre los hijos de Israel, y Yo los bendeciré (Números 6:22-27).`,
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 2: TALIT Y TEFILÍN
    // ------------------------------------------------------------------------
    {
      id: 'talit_tefilin',
      order: 2,
      titleHebrew: 'עֲטִיפַת טַלִּית וַהֲנָחַת תְּפִלִּין',
      titleSpanish: 'Colocación de Talit y Tefilín',
      titleTranslit: 'Atifát Talít ve-Hanaját Tefilín',
      description: `Preceptos cardinales que consagran los sentidos, intelecto y corazón antes del servicio divino.`,
      segments: [
        {
          id: 'birkat_talit',
          titleHebrew: 'בִּרְכַּת הַטַּלִּית',
          titleSpanish: 'Bendición del Manto de Flecos (Talit Gadol)',
          titleTranslit: 'Birkat HaTalít',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `Tome el manto con ambas manos, revise los flecos, pronuncie la bendición y cúbrase cabeza y hombros al estilo marroquí envolvente (atifat ishmaelim) antes de acomodarlo.`,
          },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהִתְעַטֵּף בַּצִּיצִית:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ashér kidshánu be-mitzvotáv ve-tzivánu lehit\'atéf batzitzít.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que nos santificó con Sus mandamientos y nos ordenó envolvernos con los flecos rituales.`,
          moroccanNote: `En el rito marroquí se acostumbra pasar las 4 puntas hacia adelante y besar los dos flecos que reposan sobre el pecho.`,
        },
        {
          id: 'tefilin_yad',
          titleHebrew: 'תְּפִלִּין שֶׁל יָד',
          titleSpanish: 'Tefilín del brazo',
          titleTranslit: 'Tefilín shel Yad',
          posture: {
            type: 'sitting',
            label: 'Sentado / De pie',
            instruction: `Coloque la caja en el bíceps del brazo opuesto a la mano hábil, orientada hacia el corazón. Ajuste la correa y pronuncie la bendición antes de enrollar.`,
          },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהַנִּיחַ תְּפִלִּין:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ashér kidshánu be-mitzvotáv ve-tzivánu lehaníaj tefilín.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que nos santificó con Sus mandamientos y nos ordenó colocar los tefilín.`,
          moroccanNote: `Se enrolla la correa hacia afuera envolviendo 7 vueltas sobre el antebrazo en absoluto silencio y sin interrupción verbal.`,
        },
        {
          id: 'tefilin_rosh',
          titleHebrew: 'תְּפִלִּין שֶׁל רֹאשׁ',
          titleSpanish: 'Tefilín de la cabeza',
          titleTranslit: 'Tefilín shel Rosh',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `Coloque la caja en la línea media por encima de la raíz del cabello, con el nudo exacto en la base del cráneo.`,
          },
          hebrew: `וְאֵרַשְׂתִּיךְ לִי לְעוֹלָם, וְאֵרַשְׂתִּיךְ לִי בְּצֶדֶק וּבְמִשְׁפָּט וּבְחֶסֶד וּבְרַחֲמִים, וְאֵרַשְׂתִּיךְ לִי בֶּאֱמוּנָה, וְיָדַעַתְּ אֶת־יהוה:`,
          transliteration: `Ve-erastíj li le-olám, ve-erastíj li be-tzédek u-ve-mishpát u-ve-jésed u-ve-rajamím, ve-erastíj li be-emunáh, ve-yadáat et YHVH.`,
          spanish: `Y te desposaré Conmigo para siempre; te desposaré Conmigo en rectitud, en justicia, en benevolencia y en compasión; y te desposaré Conmigo en fidelidad, y conocerás a YHVH (Oseas 2:21-22).`,
          moroccanNote: `Los sefardíes marroquíes NO recitan la segunda bendición (al mitzvat tefilín) si no hubo interrupción verbal entre el brazo y la cabeza.`,
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 3: SACRIFICIOS Y PITÚM HAKETÓRET (100% COMPLETO)
    // ------------------------------------------------------------------------
    {
      id: 'korbanot',
      order: 3,
      titleHebrew: 'קָרְבָּנוֹת וּפִטּוּם הַקְּטֹרֶת',
      titleSpanish: 'Sacrificios y Sahumerio del Incienso',
      titleTranslit: 'Korbanót u-Fitúm HaKetóret',
      description: `El servicio sagrado del Santo Templo recreado con la palabra como ofrenda y escudo protector para el alma.`,
      segments: [
        {
          id: 'parashat_hatamid',
          titleHebrew: 'פָּרָשַׁת הַתָּמִיד',
          titleSpanish: 'La Ofrenda Continua Diaria (Korban HaTamid)',
          titleTranslit: 'Parashát HaTamíd',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `וַיְדַבֵּר יהוה אֶל־מֹשֶׁה לֵּאמֹר: צַו אֶת־בְּנֵי יִשְׂרָאֵל וְאָמַרְתָּ אֲלֵהֶם, אֶת־קָרְבָּנִי לַחְמִי לְאִשַּׁי רֵיחַ נִיחֹחִי תִּשְׁמְרוּ לְהַקְרִיב לִי בְּמוֹעֲדוֹ:
וְאָמַרְתָּ לָהֶם, זֶה הָאִשֶּׁה אֲשֶׁר תַּקְרִיבוּ לַיהוה: כְּבָשִׂים בְּנֵי־שָׁנָה תְמִימִם שְׁנַיִם לַיּוֹם עֹלָה תָמִיד:
אֶת־הַכֶּבֶשׂ הָאֶחָד תַּעֲשֶׂה בַבֹּקֶר, וְאֵת הַכֶּבֶשׂ הַשֵּׁנִי תַּעֲשֶׂה בֵּין הָעַרְבָּיִם:
וַעֲשִׂירִית הָאֵיפָה סֹלֶת לְמִנְחָה, בְּלוּלָה בְּשֶׁמֶן כָּתִית רְבִיעִת הַהִין:
עֹלַת תָּמִיד, הָעֲשֻׂיָה בְּהַר סִינַי, לְרֵיחַ נִיחֹחַ אִשֶּׁה לַיהוה:
וְנִסְכּוֹ רְבִיעִת הַהִין לַכֶּבֶשׂ הָאֶחָד, בַּקֹּדֶשׁ הַסֵּךְ נֶסֶךְ שֵׁכָר לַיהוה:
וְאֵת הַכֶּבֶשׂ הַשֵּׁנִי תַּעֲשֶׂה בֵּין הָעַרְבָּיִם, כְּמִנְחַת הַבֹּקֶר וּכְנִסְכּוֹ תַּעֲשֶׂה, אִשֵּׁה רֵיחַ נִיחֹחַ לַיהוה:`,
          transliteration: `Va-yedabér YHVH el Moshéh lemór: Tzav et benéi Yisraél ve-amartá aleihém, et korb техниק lájmi le-ishái réaj nijojí tishmerú le-hakrív li be-moadó.
Ve-amartá lahém, zeh ha-ishéh ashér takrívu la-YHVH: kevasím benéi shanáh temimím shnáyim la-yom oláh tamíd.
Et ha-kéves ha-ejád taaséh va-bóker, ve-et ha-kéves ha-shení taaséh bein ha-arbáyim.
Va-asirít ha-eifáh sólet le-minjáh, beluláh be-shémen katít reví'it ha-hín.
Olát tamíd, ha-asuyáh be-har Sinái, le-réaj nijóaj ishéh la-YHVH.
Ve-niskó reví'it ha-hín la-kéves ha-ejád, ba-kódesh haséj nésej shejár la-YHVH.
Ve-et ha-kéves ha-shení taaséh bein ha-arbáyim, ke-minját ha-bóker u-je-niskó taaséh, ishéh réaj nijóaj la-YHVH.`,
          spanish: `Y habló YHVH a Moisés diciendo: Ordena a los hijos de Israel y diles: Mi ofrenda, Mi pan para Mis fuegos, aroma grato para Mí, cuidaréis de ofrecérmela en su tiempo señalado.
Y les dirás: Esta es la ofrenda encendida que ofreceréis a YHVH: corderos de un año sin tacha, dos cada día, en holocausto continuo.
El un cordero ofrecerás por la mañana, y el segundo cordero ofrecerás al atardecer;
y la décima parte de un efá de flor de harina en oblación, amasada con un cuarto de hin de aceite puro de oliva prensada.
Es holocausto continuo que fue instituido en el monte Sinaí, como aroma grato, ofrenda encendida para YHVH.
Y su libación será un cuarto de hin para cada cordero; en el Santuario derramarás la libación de vino generoso para YHVH.
Y el segundo cordero ofrecerás al atardecer, conforme a la oblación de la mañana y a su libación ofrecerás, ofrenda encendida de aroma grato para YHVH (Números 28:1-8).`,
        },
        {
          id: 'pitum_haketoret',
          titleHebrew: 'פִּטּוּם הַקְּטֹרֶת (הַבְּרַיְתָא הַשְּׁלֵמָה)',
          titleSpanish: 'Composición Completa del Sahumerio Sagrado',
          titleTranslit: 'Pitúm HaKetóret HaShalem',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `אַתָּה הוּא יהוה אֱלֹהֵינוּ שֶׁהִקְטִירוּ אֲבוֹתֵינוּ לְפָנֶיךָ אֶת־קְטֹרֶת הַסַּמִּים בִּזְמַן שֶׁבֵּית הַמִּקְדָּשׁ הָיָה קַיָּם, כַּאֲשֶׁר צִוִּיתָ אוֹתָם עַל יַד מֹשֶׁה נְבִיאָךְ, כַּכָּתוּב בְּתוֹרָתָךְ:
וַיֹּאמֶר יהוה אֶל־מֹשֶׁה: קַח־לְךָ סַמִּים, נָטָף וּשְׁחֵלֶת וְחֶלְבְּנָה, סַמִּים וּלְבֹנָה זַכָּה, בַּד בְּבַד יִהְיֶה: וְעָשִׂיתָ אֹתָהּ קְטֹרֶת רֹקַח מַעֲשֵׂה רוֹקֵחַ, מְמֻלָּח טָהוֹר קֹדֶשׁ: וְשָׁחַקְתָּ מִמֶּנָּה הָדֵק, וְנָתַתָּה מִמֶּנָּה לִפְנֵי הָעֵדֻת בְּאֹהֶל מוֹעֵד אֲשֶׁר אִוָּעֵד לְךָ שָׁמָּה, קֹדֶשׁ קָדָשִׁים תִּהְיֶה לָכֶם: וְנֶאֱמַר: וְהִקְטִיר עָלָיו אַהֲרֹן קְטֹרֶת סַמִּים בַּבֹּקֶר בַּבֹּקֶר, בְּהֵיטִיבוֹ אֶת־הַנֵּרֹת יַקְטִירֶנָּה: וּבְהַעֲלֹת אַהֲרֹן אֶת־הַנֵּרֹת בֵּין הָעַרְבַּיִם יַקְטִירֶנָּה, קְטֹרֶת תָּמִיד לִפְנֵי יהוה לְדֹרֹתֵיכֶם:

תָּנוּ רַבָּנָן: פִּטּוּם הַקְּטֹרֶת כֵּיצַד? שְׁלֹשׁ מֵאוֹת וְשִׁשִּׁים וּשְׁמוֹנָה מָנִים הָיוּ בָהּ: שְׁלֹשׁ מֵאוֹת וְשִׁשִּׁים וַחֲמִשָּׁה כְּמִנְיַן יְמוֹת הַחַמָּה, מָנֶה בְּכָל־יוֹם, מַחֲצִיתוֹ בַבֹּקֶר וּמַחֲצִיתוֹ בָּעֶרֶב, וּשְׁלֹשָׁה מָנִים יְתֵרִים שֶׁמֵּהֶם מַכְנִיס כֹּהֵן גָּדוֹל מְלֹא חָפְנָיו בְּיוֹם הַכִּפּוּרִים, וּמַחֲזִירָן לְמַכְתֶּשֶׁת בְּעֶרֶב יוֹם הַכִּפּוּרִים כְּדֵי לְקַיֵּם מִצְוַת דַּקָּה מִן הַדַּקָּה.
וְאַחַד עָשָׂר סַמָּנִים הָיוּ בָהּ, וְאֵלּוּ הֵן:
(א) הַצֳּרִי, (ב) וְהַצִּפֹּרֶן, (ג) וְהַחֶלְבְּנָה, (ד) וְהַלְּבוֹנָה, מִשְׁקַל שִׁבְעִים שִׁבְעִים מָנֶה.
(ה) מוֹר, (ו) וּקְצִיעָה, (ז) וְשִׁבּוֹלֶת נֵרְדְּ, (ח) וְכַרְכֹּם, מִשְׁקַל שִׁשָּׁה עָשָׂר שִׁשָּׁה עָשָׂר מָנֶה.
(ט) הַקּוֹשְׂטְ שְׁנֵים עָשָׂר, (י) וְקִלּוּפָה שְׁלֹשָׁה, (יא) וְקִנָּמוֹן תִּשְׁעָה.
בּוֹרִית כַּרְשִׁינָא תִּשְׁעָה קַבִּין. יֵין קַפְרִיסִין סְאִין תְּלָת וְקַבִּין תְּלָתָא; אִם אֵין לוֹ יֵין קַפְרִיסִין, מֵבִיא חֲמַר חִוָּר עַתִּיק. מֶלַח סְדוֹמִית רוֹבַע הַקָּב. מַעֲלֶה עָשָׁן כָּל־שֶׁהוּא. רַבִּי נָתָן הַבַּבְלִי אוֹמֵר: אַף כִּפַּת הַיַּרְדֵּן כָּל־שֶׁהִיא. אִם נָתַן בָּהּ דְּבַשׁ פְּסָלָהּ, וְאִם חִסַּר אַחַת מִכָּל־סַמְמָנֶיהָ חַיָּב מִיתָה.

רַבָּן שִׁמְעוֹן בֶּן גַּמְלִיאֵל אוֹמֵר: הַצֳּרִי אֵינוֹ אֶלָּא שְׂרָף הַנּוֹטֵף מֵעֲצֵי הַקְּטָף. בּוֹרִית כַּרְשִׁינָא לְמָה הִיא בָאָה? כְּדֵי לְשַׁפּוֹת בָּהּ אֶת־הַצִּפֹּרֶן, כְּדֵי שֶׁתְּהֵא נָאָה. יֵין קַפְרִיסִין לְמָה הוּא בָא? כְּדֵי לִשְׁרוֹת בּוֹ אֶת־הַצִּפֹּרֶן, כְּדֵי שֶׁתְּהֵא עַזָּה. וַהֲלֹא מֵי רַגְלַיִם יָפִין לָהּ? אֶלָּא שֶׁאֵין מַכְנִיסִין מֵי רַגְלַיִם בַּמִּקְדָּשׁ מִפְּנֵי הַכָּבוֹד.
תַּנְיָא, רַבִּי נָתָן אוֹמֵר: כְּשֶׁהוּא שׁוֹחֵק אוֹמֵר: הָדֵק הֵיטֵב, הֵיטֵב הָדֵק, מִפְּנֵי שֶׁהַקּוֹל יָפֶה לַבְּשָׂמִים. פִּטְּמָהּ לַחֲצָאִין כְּשֵׁרָה; לִשְׁלִישׁ וּלְרָבִיעַ, לֹא שָׁמַעְנוּ. אָמַר רַבִּי יְהוּדָה: זֶה הַכְּלָל: אִם כְּמִדָּתָהּ כְּשֵׁרָה לַחֲצָאִין, וְאִם חִסַּר אַחַת מִכָּל־סַמְמָנֶיהָ חַיָּב מִיתָה.
תָּנֵי בַר קַפָּרָא: אַחַת לְשִׁשִּׁים אוֹ לְשִׁבְעִים שָׁנָה הָיְתָה בָאָה שֶׁל שִׁירַיִם לַחֲצָאִין. וְעוֹד תָּנֵי בַר קַפָּרָא: אִלּוּ הָיָה נוֹתֵן בָּהּ קָרְטוֹב שֶׁל דְּבַשׁ, אֵין אָדָם יָכוֹל לַעֲמֹד מִפְּנֵי רֵיחָהּ; וְלָמָּה אֵין מְעָרְבִין בָּהּ דְּבַשׁ? מִפְּנֵי שֶׁהַתּוֹרָה אָמְרָה: כִּי כָל־שְׂאֹר וְכָל־דְּבַשׁ לֹא־תַקְטִירוּ מִמֶּנּוּ אִשֶּׁה לַיהוה:

יהוה צְבָאוֹת עִמָּנוּ, מִשְׂגָּב לָנוּ אֱלֹהֵי יַעֲקֹב סֶלָה:
יהוה צְבָאוֹת, אַשְׁרֵי אָדָם בֹּטֵחַ בָּךְ:
יהוה הוֹשִׁיעָה, הַמֶּלֶךְ יַעֲנֵנוּ בְיוֹם־קָרְאֵנוּ:
וְעָרְבָה לַיהוה מִנְחַת יְהוּדָה וִירוּשָׁלָיִם, כִּימֵי עוֹלָם וּכְשָׁנִים קַדְמֹנִיּוֹת:
תָּנָא דְבֵי אֵלִיָּהוּ: כָּל־הַשּׁוֹנֶה הֲלָכוֹת בְּכָל־יוֹם, מֻבְטָח לוֹ שֶׁהוּא בֶּן הָעוֹלָם הַבָּא, שֶׁנֶּאֱמַר: הֲלִיכוֹת עוֹלָם לוֹ; אַל תִּקְרֵי הֲלִיכוֹת אֶלָּא הֲלָכוֹת:
אָמַר רַבִּי אֶלְעָזָר אָמַר רַבִּי חֲנִינָא: תַּלְמִידֵי חֲכָמִים מַרְבִּים שָׁלוֹם בָּעוֹלָם, שֶׁנֶּאֱמַר: וְכָל־בָּנַיִךְ לִמּוּדֵי יהוה, וְרַב שְׁלוֹם בָּנָיִךְ; אַל תִּקְרֵי בָנָיִךְ אֶלָּא בּוֹנָיִךְ:
יְהִי שָׁלוֹם בְּחֵילֵךְ, שַׁלְוָה בְּאַרְמְנוֹתָיִךְ:
לְמַעַן אַחַי וְרֵעָי, אֲדַבְּרָה נָּא שָׁלוֹם בָּךְ:
לְמַעַן בֵּית־יהוה אֱלֹהֵינוּ, אֲבַקְשָׁה טוֹב לָךְ:
יהוה עֹז לְעַמּוֹ יִתֵּן, יהוה יְבָרֵךְ אֶת־עַמּוֹ בַשָּׁלוֹם:`,
          transliteration: `Atáh hu YHVH Elohéinu she-hiktíru avotéinu lefanéja et ketóret ha-samím bi-zmán she-béit ha-mikdásh hayáh kayám, ka-ashér tzivíta otám al yad Moshéh nevi\'aj, ka-katúv be-Toratáj:
Va-yómer YHVH el Moshéh: kaj lejá samím, natáf u-shjélet ve-jelbenáh, samím u-levonáh zakáh, bad be-vád yihyéh. Ve-asíta otáh ketóret rókaj maaséh rokéaj, memuláj tahór kódesh. Ve-shajaktá miménah hadék, ve-natatáh miménah lifnéi ha-edút be-óhel moéd ashér ivaéd lejá shámah, kódesh kodashím tihyéh lajém. Ve-neemár: ve-hiktír aláv Aharón ketóret samím ba-bóker ba-bóker, be-heitivó et ha-nerót yaktiréna. U-vhaalót Aharón et ha-nerót bein ha-arbáyim yaktiréna, ketóret tamíd lifnéi YHVH le-doroteijém.

Tanú Rabanán: Pitúm ha-ketóret keitzád? Shlosh meót ve-shishím u-shmonáh maním hayú vah: shlosh meót ve-shishím va-jamisháh ke-minyán yemót ha-jamáh, manéh be-jol yom, majatzitó va-bóker u-majatzitó va-érev, u-shlosháh maním yeterím she-mehém majnís Kohén Gadól meló jofnáv be-Yom ha-Kipurím, u-majzirán le-majtéshet be-érev Yom ha-Kipurím kedéi lekayém mitzvát dakah min ha-dakah.
Ve-ajád asár samamím hayú vah, ve-élu hen:
(1) Ha-tzorí, (2) ve-ha-tzipóren, (3) ve-ha-jelbenáh, (4) ve-ha-levonáh, mishkál shiv'ím shiv'ím manéh.
(5) Mor, (6) u-ktzi'áh, (7) ve-shibólet nerd, (8) ve-jarkóm, mishkál shisháh asár shisháh asár manéh.
(9) Ha-kósht shnéim asár, (10) ve-kilufáh shlosháh, (11) ve-kinamón tish'áh.
Borít karshiná tish'áh kabín. Yéin kafrisín se'ín telát ve-kabín telatá; im éin lo yéin kafrisín, meví jamár jivár atík. Mélaj sedomít rová ha-kav. Maaléh ashán kol shehú. Rabí Natán ha-Bavlí omér: af kipát ha-Yardén kol shehí. Im natán bah dvash pesaláh, ve-im jisár aját mi-kol samamaneíha jayáv mitáh.

Rabán Shim'ón ben Gamliel omér: Ha-tzorí eynó éla seráf ha-notéf me-atzéi ha-ketáf. Borít karshiná le-mah hi va-ah? Kedéi leshapót bah et ha-tzipóren kedéi she-tehé na-ah. Yéin kafrisín le-mah hu va? Kedéi lishrót bo et ha-tzipóren kedéi she-tehé azáh. Ve-haló mei ragláyim yafín lah? Éla she-éin majnisín mei ragláyim ba-mikdásh mipnéi ha-kavód.
Tanyá, Rabí Natán omér: Kshe-hu shojék omér: hadék hetév, hetév hadék, mipnéi she-ha-kol yaféh la-besamím. Pitmáh la-jatzayín ksheráh; li-shlish u-le-raví'a, lo shamánu. Amár Rabí Yehudáh: zeh ha-klal: im ke-midatáh ksheráh la-jatzayín, ve-im jisár aját mi-kol samamaneíha jayáv mitáh.
Tanéi Var Kapará: Aját le-shishím o le-shiv'ím shanáh haytáh va-ah shel shirayím la-jatzayín. Ve-od tanéi Var Kapará: ílu hayáh notén bah kartóv shel dvash, éin adám yajól laamód mipnéi reijáh; ve-lámah éin mearvín bah dvash? Mipnéi she-ha-Toráh amráh: ki kol se'ór ve-jol dvash lo taktíru miménu ishéh la-YHVH.

YHVH Tzevaót imánu, misgáv lánu Elohéi Yaakóv séla.
YHVH Tzevaót, ashréi adám botéaj baj.
YHVH hoshí'ah, ha-Mélej yaanénu ve-yom kor'énu.
Ve-arváh la-YHVH minját Yehudáh vi-Yerushaláyim ki-yméi olám u-j-shaním kadmoniyót.
Taná Devéi Eliyáhu: Kol ha-shonéh halajót be-jol yom mubtáj lo she-hu ben ha-Olám ha-Bá, she-neemár: halijót olám lo; al tikréi halijót éla halajót.
Amár Rabí Elazár amár Rabí Janiná: Talmidéi jajamím marbím shalóm ba-olám, she-neemár: ve-jol banáyij limudéi YHVH, ve-rav shelóm banáyij; al tikréi banáyij éla bonáyij.
Yehí shalóm be-jeilék, shalváh be-armenotáyij.
Lemáan ajái ve-re'ái adabráh na shalóm baj.
Lemáan beit YHVH Elohéinu avaksháh tov laj.
YHVH oz le-amó yitén, YHVH yevaréj et amó va-shalóm.`,
          spanish: `Tú eres YHVH nuestro Dios ante Quien nuestros antepasados quemaron el incienso aromático en los días en que el Santo Templo existía, conforme les prescribiste por medio de Moisés Tu profeta, como está escrito en Tu Torá:
Y dijo YHVH a Moisés: Toma para ti especias aromáticas: bálsamo, uña aromática y gálbano; especias e incienso puro, en proporciones iguales han de ser. Y harás de ello un incienso aromático, obra de perfumista experto, sazonado con sal, puro y sagrado. Y molerás de él bien fino, y pondrás de él delante del Testimonio en la Tienda del Encuentro donde Me manifestaré a ti; santísimo será para vosotros. Y fue dicho: Y Aarón quemará sobre él incienso aromático cada mañana, al acondicionar las lámparas lo quemará; y cuando Aarón encienda las lámparas al atardecer lo quemará, incienso perpetuo ante YHVH por vuestras generaciones (Éxodo 30:34-36, 7-8).

Enseñaron nuestros Sabios: ¿Cómo se componía el incienso sagrado? Trescientos sesenta y ocho manéh contenía: trescientos sesenta y cinco conforme al número de los días solares, un manéh para cada día, la mitad por la mañana y la mitad al atardecer; y tres manéh adicionales de los cuales el Sumo Sacerdote tomaba sus dos puños llenos en Yom Kipur, retornándolos al mortero en la víspera de Yom Kipur para cumplir el precepto de molerlo "sumamente fino".
Y once especias aromáticas contenía, y son las siguientes:
(1) El bálsamo, (2) la uña aromática, (3) el gálbano y (4) el incienso puro, cada uno con un peso de setenta manéh.
(5) Mirra, (6) casia, (7) espiga de nardo y (8) azafrán, cada uno con un peso de dieciséis manéh.
(9) Costo doce manéh, (10) corteza aromática tres manéh, y (11) canela nueve manéh.
Lejía de Carshina nueve kabím. Vino de Chipre tres seás y tres kabím; si no dispone de vino de Chipre, trae vino blanco añejo. Sal de Sodoma un cuarto de kab. Hierba para elevar el humo en cantidad mínima. Rabí Natán el babilonio dice: también una hierba llamada Cúpula del Jordán en cantidad mínima. Si le añadía miel lo invalidaba, y si omitía una sola de todas sus especias incurría en pena capital celestial.

Rabán Shimón ben Gamliel dice: El bálsamo no es más que la resina que destila de los árboles de bálsamo. ¿Para qué se traía la lejía de Carshina? Para limpiar con ella la uña aromática para que luciese hermosa. ¿Para qué se traía el vino de Chipre? Para macerar en él la uña aromática para que su fragancia fuera intensa. ¿Y acaso no sería más eficaz lavarla con aguas residuales? Empero, no se introducen aguas indignas al Templo por respeto a la Majestad Divina.
Fue enseñado: Rabí Natán dice: Cuando el sacerdote lo trituraba en el mortero, repetía rítmicamente: "Muele fino, bien fino; bien fino, muele fino", pues la vibración de la voz beneficia a las especias. Si lo preparaba por mitades era apto; por terceras o cuartas partes, no hemos recibido tradición. Dijo Rabí Yehudá: Esta es la regla general: con sus proporciones exactas es apto por mitades; pero si omitía una sola de sus especias aromáticas, incurría en pena capital celestial.
Enseñó Bar Kapará: Una vez cada sesenta o setenta años los remanentes acumulados alcanzaban para abastecer medio año. Y enseñó además Bar Kapará: Si se le hubiese añadido una pizca diminuta de miel, nadie habría podido resistir la dulzura de su perfume en toda Jerusalén; ¿y por qué razón no se mezcla miel en él? Porque la Torá ordenó explícitamente: "Pues nada de levadura ni de miel habréis de quemar como ofrenda encendida para YHVH" (Levítico 2:11).

YHVH de los ejércitos está con nosotros; refugio inexpugnable es para nosotros el Dios de Jacob.
YHVH de los ejércitos, dichoso es el ser humano que deposita su confianza en Ti.
YHVH, ¡salva!; que el Rey nos responda en el día en que Le invoquemos.
Y será grata a YHVH la ofrenda de Judá y de Jerusalén, como en los días de antaño y como en los años remotos (Malaquías 3:4).
Enseñó la escuela de Elías: Todo aquel que estudia leyes halájicas diariamente tiene asegurado que es heredero del Mundo Venidero, como fue dicho: "Caminos (halijot) eternos son para él"; no leas halijot sino halajot.
Dijo Rabí Elazar en nombre de Rabí Janina: Los discípulos de los sabios acrecientan la paz en el mundo, como está dicho: "Y todos tus hijos serán instruidos por YHVH, y abundante será la paz de tus hijos"; no leas tus hijos (banáyij) sino tus constructores (bonáyij).
Haya paz dentro de tus muros y tranquilidad en tus palacios. Por causa de mis hermanos y compañeros hablaré ahora paz en ti. Por amor a la Casa de YHVH nuestro Dios buscaré tu bien. YHVH otorgará fortaleza a Su pueblo; YHVH bendecirá a Su pueblo con la paz (Salmos 122:7-9, 29:11).`,
          moroccanNote: `En las sinagogas de Marruecos, la lectura de Pitum HaKetoret se entona con una de las melodías más célebres y sagradas, considerada protectora contra el mal de ojo, la peste y promotora de abundante sustento.`,
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 4: PESUKÉ DEZIMRÁ (VERSOS DE ALABANZA · 100% COMPLETO)
    // ------------------------------------------------------------------------
    {
      id: 'pesukei_dezimra',
      order: 4,
      titleHebrew: 'פְּסוּקֵי דְזִמְרָא',
      titleSpanish: 'Versos de Alabanza (Pesuké deZimrá)',
      titleTranslit: 'Pesukéi de-Zimrá',
      description: `Salmos davídicos, himnos de júbilo y el Cántico del Mar que limpian el alma de impurezas espirituales.`,
      segments: [
        {
          id: 'mizmor_shir_janukat',
          titleHebrew: 'מִזְמוֹר שִׁיר חֲנֻכַּת הַבַּיִת (תְּהִלִּים ל׳)',
          titleSpanish: 'Salmo 30 · Consagración del Santo Templo',
          titleTranslit: 'Mizmór Shir Janukát HaBáyit',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `מִזְמוֹר שִׁיר חֲנֻכַּת הַבַּיִת לְדָוִד:
אֲרוֹמִמְךָ יהוה כִּי דִלִּיתָנִי, וְלֹא־שִׂמַּחְתָּ אֹיְבַי לִי:
יהוה אֱלֹהָי, שִׁוַּעְתִּי אֵלֶיךָ וַתִּרְפָּאֵנִי:
יהוה הֶעֱלִיתָ מִן־שְׁאוֹל נַפְשִׁי, חִיִּיתַנִי מִיָּרְדִי־בוֹר:
זַמְּרוּ לַיהוה חֲסִידָיו, וְהוֹדוּ לְזֵכֶר קָדְשׁוֹ:
כִּי רֶגַע בְּאַפּוֹ, חַיִּים בִּרְצוֹנוֹ, בָּעֶרֶב יָלִין בֶּכִי, וְלַבֹּקֶר רִנָּה:
וַאֲנִי אָמַרְתִּי בְשַׁלְוִי, בַּל־אֶמּוֹט לְעוֹלָם:
יהוה בִּרְצוֹנְךָ הֶעֱמַדְתָּה לְהַרְרִי עֹז, הִסְתַּרְתָּ פָנֶיךָ הָיִיתִי נִבְהָל:
אֵלֶיךָ יהוה אֶקְרָא, וְאֶל־אֲדֹנָי אֶתְחַנָּן:
מַה־בֶּצַע בְּדָמִי, בְּרִדְתִּי אֶל־שָׁחַת, הֲיוֹדְךָ עָפָר, הֲיַגִּיד אֲמִתֶּךָ:
שְׁמַע־יהוה וְחָנֵּנִי, יהוה הֱיֵה־עֹזֵר לִי:
הָפַכְתָּ מִסְפְּדִי לְמָחוֹל לִי, פִּתַּחְתָּ שַׂקִּי, וַתְּאַזְּרֵנִי שִׂמְחָה:
לְמַעַן יְזַמֶּרְךָ כָבוֹד וְלֹא יִדֹּם, יהוה אֱלֹהַי לְעוֹלָם אוֹדֶךָּ:`,
          transliteration: `Mizmór shir janukát ha-báyit le-Davíd.
Aromimjá YHVH ki dilitáni, ve-lo simájta oyvái li.
YHVH Elohái, shiv'atí eléja va-tirpaéni.
YHVH heelíta min sheól nafshí, jiyitáni mi-yaredí vor.
Zamrú la-YHVH jasidáv, ve-hodú le-zéjer kodshó.
Ki réga be-apó, jayím bi-rtzonó, ba-érev yalín béji, ve-la-bóker rináh.
Va-aní amárti ve-shalví, bal emót le-olám.
YHVH bi-rtzonjá heemádta le-harerí oz, histárta fanéja hayíti nivhál.
Eléja YHVH ekrá, ve-el Adonái etjanán.
Mah bétza be-damí be-ridtí el shájat, ha-yodjá afár, ha-yagíd amitéja.
Shemá YHVH ve-jonéni, YHVH heyéh ozér li.
Hafájta mispedí le-majól li, pitájta sakí va-teazréni simjáh.
Lemáan yezamerjá javód ve-lo yidóm, YHVH Elohái le-olám odéka.`,
          spanish: `Salmo de cántico de consagración del Templo, por David.
Te ensalzaré, YHVH, pues me has rescatado y no permitiste que mis adversarios se regocijasen sobre mí.
YHVH mi Dios, a Ti clamé y me sanaste.
YHVH, hiciste ascender mi alma desde las profundidades; preservaste mi vida para no descender a la tumba.
Canten a YHVH Sus piadosos siervos y alaben Su santo memorial.
Pues Su cólera dura un instante, mas Su complacencia una vida entera: por la tarde podrá hospedarse el llanto, mas a la aurora irrumpe la alegría.
Y yo dije en mi tranquilidad: "Jamás vacilaré".
YHVH, por Tu beneplácito habías asentado mi montaña con firmeza; ocultaste Tu rostro y quedé consternado.
A Ti, YHVH, clamé, y a mi Señor imploré:
¿Qué provecho hay en mi sangre, en mi descenso al sepulcro? ¿Acaso Te agradecerá el polvo de la tierra, proclamará Tu verdad?
Escucha, YHVH, y ten piedad de mí; YHVH, sé Tú mi auxilio.
Convertiste mi duelo en danza triunfal; desataste mi sayal y me ceñiste de júbilo.
Para que mi alma Te cante loores y no enmudezca jamás; YHVH mi Dios, ¡por siempre Te daré gracias!`,
        },
        {
          id: 'hodu_layhvh',
          titleHebrew: 'הוֹדוּ לַיהוה',
          titleSpanish: 'Cántico de Gratitud y Salvación (Hodu)',
          titleTranslit: 'Hodú la-YHVH',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `הוֹדוּ לַיהוה קִרְאוּ בִשְׁמוֹ, הוֹדִיעוּ בָעַמִּים עֲלִילֹתָיו:
שִׁירוּ לוֹ זַמְּרוּ־לוֹ, שִׂיחוּ בְּכָל־נִפְלְאוֹתָיו:
הִתְהַלְלוּ בְּשֵׁם קָדְשׁוֹ, יִשְׂמַח לֵב מְבַקְשֵׁי יהוה:
דִּרְשׁוּ יהוה וְעֻזּוֹ, בַּקְּשׁוּ פָנָיו תָּמִיד:
זִכְרוּ נִפְלְאֹתָיו אֲשֶׁר עָשָׂה, מֹפְתָיו וּמִשְׁפְּטֵי־פִיהוּ:
זֶרַע יִשְׂרָאֵל עַבְדּוֹ, בְּנֵי יַעֲקֹב בְּחִירָיו:
הוּא יהוה אֱלֹהֵינוּ, בְּכָל־הָאָרֶץ מִשְׁפָּטָיו:
זִכְרוּ לְעוֹלָם בְּרִיתוֹ, דָּבָר צִוָּה לְאֶלֶף דּוֹר:
אֲשֶׁר כָּרַת אֶת־אַבְרָהָם, וּשְׁבוּעָתוֹ לְיִצְחָק:
וַיַּעֲמִידֶהָ לְיַעֲקֹב לְחֹק, לְיִשְׂרָאֵל בְּרִית עוֹלָם:
רוֹמְמוּ יהוה אֱלֹהֵינוּ וְהִשְׁתַּחֲווּ לַהֲדֹם רַגְלָיו, קָדוֹשׁ הוּא:
רוֹמְמוּ יהוה אֱלֹהֵינוּ וְהִשְׁתַּחֲווּ לְהַר קָדְשׁוֹ, כִּי קָדוֹשׁ יהוה אֱלֹהֵינוּ:
וְהוּא רַחוּם יְכַפֵּר עָוֹן וְלֹא־יַשְׁחִית, וְהִרְבָּה לְהָשִׁיב אַפּוֹ, וְלֹא־יָעִיר כָּל־חֲמָתוֹ:
אַתָּה יהוה לֹא־תִכְלָא רַחֲמֶיךָ מִמֶּנִּי, חַסְדְּךָ וַאֲמִתְּךָ תָּמִיד יִצְּרוּנִי:
הוֹשִׁיעֵנוּ יהוה אֱלֹהֵינוּ וְקַבְּצֵנוּ מִן־הַגּוֹיִם, לְהֹדוֹת לְשֵׁם קָדְשֶׁךָ, לְהִשְׁתַּבֵּחַ בִּתְהִלָּתֶךָ:
בָּרוּךְ יהוה אֱלֹהֵי יִשְׂרָאֵל מִן־הָעוֹלָם וְעַד הָעוֹלָם, וְאָמַר כָּל־הָעָם אָמֵן, הַלְלוּיָהּ:`,
          transliteration: `Hodú la-YHVH kir'ú vi-shmó, hodí'u va-amím alilotáv.
Shíru lo zamrú lo, síju be-jol nifleotáv.
Hithalelú be-shém kodshó, yismáj lev mevakshéi YHVH.
Dirshú YHVH ve-uzó, bakshú fanáv tamíd.
Zijrú nifleotáv ashér asáh, moftáv u-mishpetéi fíhu.
Zéra Yisraél avdó, benéi Yaakóv bejiráv.
Hu YHVH Elohéinu, be-jol ha-áretz mishpatáv.
Zijrú le-olám beritó, davár tziváh le-élef dor.
Ashér karát et Avrahám, u-shvuató le-Yitzják.
Va-yaamidéha le-Yaakóv le-jok, le-Yisraél berít olám.
Romemú YHVH Elohéinu ve-hishtajavú la-hadóm ragláv, kadósh Hu.
Romemú YHVH Elohéinu ve-hishtajavú le-har kodshó, ki kadósh YHVH Elohéinu.
Ve-Hu rajúm yejapér avón ve-lo yashjít, ve-hirbáh le-hashív apó, ve-lo yaír kol jamató.
Atáh YHVH lo tijlá rajaméja miméni, jasdejá va-amitejá tamíd yitzrúni.
Hoshiénu YHVH Elohéinu ve-kabtzénu min ha-goyím, le-hodót le-shém kodshéja, le-hishtabéaj bi-thilatéja.
Barúj YHVH Elohéi Yisraél min ha-olám ve-ad ha-olám, ve-amár kol ha-am Amén, Haleluyáh.`,
          spanish: `Alabad a YHVH, proclamad Su Nombre, haced notorias entre las naciones Sus proezas.
Cantadle a Él, entonadle salmos, disertad sobre todas Sus maravillas.
Gloriaos en Su santo Nombre; alégrese el corazón de los que buscan a YHVH.
Indagad de YHVH y de Su poder; buscad Su presencia continuamente.
Evocad las maravillas que Él ha obrado, Sus portentos y los dictámenes de Su boca.
Oh vosotros, simiente de Israel Su siervo, hijos de Jacob, Sus predilectos.
Él es YHVH nuestro Dios; en toda la tierra imperan Sus decretos.
Recordad perpetuamente Su pacto, la palabra que prescribió para mil generaciones;
el pacto que pactó con Abraham, y Su juramento a Isaac;
y que confirmó a Jacob como estatuto, a Israel por alianza eterna.
Exaltad a YHVH nuestro Dios y postraos ante el estrado de Sus pies; ¡Él es Santo!
Exaltad a YHVH nuestro Dios y postraos ante Su santo monte, pues Santo es YHVH nuestro Dios.
Y Él, siendo compasivo, perdona el pecado y no extermina; con frecuencia apacigua Su enojo y no desata todo Su furor.
Tú, YHVH, no retengas de mí Tus misericordias; que Tu benevolencia y Tu verdad me preserven siempre.
Sálvanos, YHVH nuestro Dios, y congréganos de entre las naciones, para dar gracias a Tu santo Nombre y gloriarnos en Tu alabanza.
¡Bendito sea YHVH Dios de Israel desde siempre y para siempre; y todo el pueblo respondió: Amén, ¡Haleluyah! (1 Crónicas 16:8-36).`,
        },
        {
          id: 'mizmor_letoda',
          titleHebrew: 'מִזְמוֹר לְתוֹדָה (תְּהִלִּים ק׳)',
          titleSpanish: 'Salmo 100 · Salmo de Acción de Gracias',
          titleTranslit: 'Mizmór le-Todá',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `מִזְמוֹר לְתוֹדָה:
הָרִיעוּ לַיהוה כָּל־הָאָרֶץ:
עִבְדוּ אֶת־יהוה בְּשִׂמְחָה, בֹּאוּ לְפָנָיו בִּרְנָנָה:
דְּעוּ כִּי־יהוה הוּא אֱלֹהִים, הוּא־עָשָׂנוּ וְלוֹ אֲנַחְנוּ עַמּוֹ וְצֹאן מַרְעִיתוֹ:
בֹּאוּ שְׁעָרָיו בְּתוֹדָה, חֲצֵרֹתָיו בִּתְהִלָּה, הוֹדוּ־לוֹ בָּרְכוּ שְׁמוֹ:
כִּי־טוֹב יהוה, לְעוֹלָם חַסְדּוֹ, וְעַד־דֹּר וָדֹר אֱמוּנָתוֹ:`,
          transliteration: `Mizmór le-todáh.
Harí'u la-YHVH kol ha-áretz.
Ivdú et YHVH be-simjáh, bó'u lefanáv bi-rnanáh.
De'ú ki YHVH Hu Elohím, Hu asánu ve-lo anájnu amó ve-tzón maritó.
Bó'u shearáv be-todáh, jatzerotáv bi-thiláh, hodú lo barjú shemó.
Ki tov YHVH, le-olám jasdó, ve-ad dor va-dor emunató.`,
          spanish: `Salmo de acción de gracias.
Aclamad a YHVH con júbilo, habitantes de toda la tierra.
Servid a YHVH con alegría; compareced ante Su presencia con cántico festivo.
Sabed que YHVH es Dios; Él nos creó y a Él pertenecemos, somos Su pueblo y el rebaño de Su pastura.
Entrad por Sus pórticos con acción de gracias, a Sus atrios con alabanza; alabadle y bendecid Su Nombre.
Porque YHVH es bondadoso, para siempre perdura Su benevolencia, y por todas las generaciones Su fidelidad.`,
        },
        {
          id: 'baruj_sheamar',
          titleHebrew: 'בָּרוּךְ שֶׁאָמַר (בְּרָכָה שְׁלֵמָה)',
          titleSpanish: 'Aquel que habló y existió el mundo (Texto Íntegro)',
          titleTranslit: 'Barúj She-amár',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `Póngase de pie con solemnidad. Tome los dos flecos (tzitzit) delanteros en la mano durante la recitación y béselos con devoción al pronunciar la bendición final.`,
          },
          hebrew: `בָּרוּךְ שֶׁאָמַר וְהָיָה הָעוֹלָם, בָּרוּךְ הוּא!
בָּרוּךְ אוֹמֵר וְעוֹשֶׂה,
בָּרוּךְ גּוֹזֵר וּמְקַיֵּם,
בָּרוּךְ עֹשֶׂה בְרֵאשִׁית,
בָּרוּךְ מְרַחֵם עַל־הָאָרֶץ,
בָּרוּךְ מְרַחֵם עַל־הַבְּרִיּוֹת,
בָּרוּךְ מְשַׁלֵּם שָׂכָר טוֹב לִירֵאָיו,
בָּרוּךְ חַי לָעַד וְקַיָּם לָנֶצַח,
בָּרוּךְ פּוֹדֶה וּמַצִּיל, בָּרוּךְ שְׁמוֹ:
בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הָאֵל הָאָב הָרַחֲמָן, הַמְּהֻלָּל בְּפִי־עַמּוֹ, מְשֻׁבָּח וּמְפֹאָר בִּלְשׁוֹן חֲסִידָיו וַעֲבָדָיו, וּבְשִׁירֵי דָוִד עַבְדָּךְ נְהַלֶּלְךָ יהוה אֱלֹהֵינוּ, בִּשְׁבָחוֹת וּבִזְמִירוֹת נְגַדֶּלְךָ וּנְשַׁבֵּחֲךָ וּנְפָאֶרְךָ, וְנַמְלִיכְךָ וְנַזְכִּיר שִׁמְךָ מַלְכֵּנוּ אֱלֹהֵינוּ, יָחִיד, חֵי הָעוֹלָמִים, מֶלֶךְ מְשֻׁבָּח וּמְפֹאָר עֲדֵי־עַד שְׁמוֹ הַגָּדוֹל: בָּרוּךְ אַתָּה יהוה, מֶלֶךְ מְהֻלָּל בַּתִּשְׁבָּחוֹת:`,
          transliteration: `Barúj she-amár ve-hayáh ha-olám, Barúj Hu!
Barúj omér ve-oséh,
barúj gozér u-mkayém,
barúj oséh vereshít,
barúj merajém al ha-áretz,
barúj merajém al ha-beriyót,
barúj meshalém sajár tov li-yereáv,
barúj jai la-ad ve-kayám la-nétzaj,
barúj podéh u-matzíl, barúj shemó.
Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ha-El ha-Av ha-Rajamán, ha-mehullál be-fi amó, meshubáj u-mefoár bi-leshón jasidáv va-avadáv, u-vshiréi Davíd avdáj nehaleljá YHVH Elohéinu, bi-shvajót u-vizmirót negadeljá u-nshabejajá u-nfaerjá, ve-namlijajá ve-nazkír shimjá Malkénu Elohéinu, Yajíd, jéi ha-olamím, Mélej meshubáj u-mefoár adéi ad shemó ha-gadól. Barúj Atáh YHVH, Mélej mehullál ba-tishbajót.`,
          spanish: `Bendito es Quien habló y existió el universo; ¡bendito sea Él!
Bendito Quien expresa Su palabra y la cumple;
bendito Quien decreta y lo realiza;
bendito Quien efectúa la obra del principio;
bendito Quien se compadece de la tierra;
bendito Quien tiene misericordia de las criaturas;
bendito Quien remunera con buena recompensa a quienes Le veneran;
bendito Quien vive por siempre y perdura por la eternidad;
bendito Quien redime y rescata; ¡bendito es Su Nombre!
Bendito eres Tú, YHVH nuestro Dios, Rey del universo, Dios, Padre clemente y piadoso, ensalzado en la boca de Su pueblo, loado y engrandecido por la lengua de Sus devotos y Sus servidores; y con los cánticos de David Tu siervo Te alabaremos, YHVH nuestro Dios: con loores y melodías Te engrandeceremos, Te elogiaremos, Te glorificaremos, proclamaremos Tu reinado y recordaremos Tu Nombre, Soberano nuestro, Dios nuestro, Único y Singular, Vida de las eternidades, Rey elogiado y coronado de esplendor por siempre jamás es Su inmenso Nombre. Bendito eres Tú, YHVH, Rey glorificado con alabanzas.`,
        },
        {
          id: 'ashrei',
          titleHebrew: 'אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ (תְּהִלִּים קמ״ה שָׁלֵם)',
          titleSpanish: 'Salmo 145 Íntegro de la Alef a la Tav',
          titleTranslit: 'Ashréi Yoshvéi Vetéja',
          posture: {
            type: 'sitting',
            label: 'Sentado',
            instruction: `Abra las palmas de las manos hacia arriba al recitar el verso "Potéaj et yadéja" con profunda concentración en el sustento divino de todos los seres.`,
          },
          hebrew: `אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ, עוֹד יְהַלְלוּךָ סֶּלָה:
אַשְׁרֵי הָעָם שֶׁכָּכָה לּוֹ, אַשְׁרֵי הָעָם שֶׁיהוה אֱלֹהָיו:
תְּהִלָּה לְדָוִד:
אֲרוֹמִמְךָ אֱלוֹהַי הַמֶּלֶךְ, וַאֲבָרְכָה שִׁמְךָ לְעוֹלָם וָעֶד:
בְּכָל־יוֹם אֲבָרְכֶךָּ, וַאֲהַלְלָה שִׁמְךָ לְעוֹלָם וָעֶד:
גָּדוֹל יהוה וּמְהֻלָּל מְאֹד, וְלִגְדֻלָּתוֹ אֵין חֵקֶר:
דּוֹר לְדוֹר יְשַׁבַּח מַעֲשֶׂיךָ, וּגְבוּרֹתֶיךָ יַגִּידוּ:
הֲדַר כְּבוֹד הוֹדֶךָ, וְדִבְרֵי נִפְלְאוֹתֶיךָ אָשִׂיחָה:
וֶעֱזוּז נוֹרְאֹתֶיךָ יֹאמֵרוּ, וּגְדֻלָּתְךָ אֲסַפְּרֶנָּה:
זֵכֶר רַב־טוּבְךָ יַבִּיעוּ, וְצִדְקָתְךָ יְרַנֵּנוּ:
חַנּוּן וְרַחוּם יהוה, אֶרֶךְ אַפַּיִם וּגְדָל־חָסֶד:
טוֹב־יהוה לַכֹּל, וְרַחֲמָיו עַל־כָּל־מַעֲשָׂיו:
יוֹדוּךָ יהוה כָּל־מַעֲשֶׂיךָ, וַחֲסִידֶיךָ יְבָרְכוּכָה:
כְּבוֹד מַלְכוּתְךָ יֹאמֵרוּ, וּגְבוּרָתְךָ יְדַבֵּרוּ:
לְהוֹדִיעַ לִבְנֵי הָאָדָם גְּבוּרֹתָיו, וּכְבוֹד הֲדַר מַלְכוּתוֹ:
מַלְכוּתְךָ מַלְכוּת כָּל־עֹלָמִים, וּמֶמְשַׁלְתְּךָ בְּכָל־דּוֹר וָדֹר:
סוֹמֵךְ יהוה לְכָל־הַנֹּפְלִים, וְזוֹקֵף לְכָל־הַכְּפוּפִים:
עֵינֵי־כֹל אֵלֶיךָ יְשַׂבֵּרוּ, וְאַתָּה נוֹתֵן־לָהֶם אֶת־אָכְלָם בְּעִתּוֹ:
פּוֹתֵחַ אֶת־יָדֶךָ, וּמַשְׂבִּיעַ לְכָל־חַי רָצוֹן:
צַדִּיק יהוה בְּכָל־דְּרָכָיו, וְחָסִיד בְּכָל־מַעֲשָׂיו:
קָרוֹב יהוה לְכָל־קֹרְאָיו, לְכֹל אֲשֶׁר יִקְרָאֻהוּ בֶאֱמֶת:
רְצוֹן־יְרֵאָיו יַעֲשֶׂה, וְאֶת־שַׁוְעָתָם יִשְׁמַע וְיוֹשִׁיעֵם:
שׁוֹמֵר יהוה אֶת־כָּל־אֹהֲבָיו, וְאֵת כָּל־הָרְשָׁעִים יַשְׁמִיד:
תְּהִלַּת יהוה יְדַבֶּר פִּי, וִיבָרֵךְ כָּל־בָּשָׂר שֵׁם קָדְשׁוֹ לְעוֹלָם וָעֶד:
וַאֲנַחְנוּ נְבָרֵךְ יָהּ, מֵעַתָּה וְעַד־עוֹלָם, הַלְלוּיָהּ:`,
          transliteration: `Ashréi yoshvéi vetéja, od yehalelúja séla.
Ashréi ha-am she-kájah lo, ashréi ha-am she-YHVH Eloháv.
Tehiláh le-Davíd:
[Alef] Aromimjá Elohái ha-Mélej, va-avarejáh shimjá le-olám va-ed.
[Bet] Be-jol yom avarejéka, va-ahaleláh shimjá le-olám va-ed.
[Guimel] Gadól YHVH u-mehullál meód, ve-li-gdulató éin jéker.
[Dalet] Dor le-dor yeshabáj maaséja, u-gvurotéja yagídu.
[He] Hadár kevód hodéja, ve-divréi nifleotéja asíjah.
[Vav] Ve-ezúz nor'otéja yoméru, u-gdulatjá asaperéna.
[Zayin] Zéjer rav tuvjá yabí'u, ve-tzidkatjá yeranénu.
[Jet] Janún ve-rajúm YHVH, érej apáyim u-gdol jásed.
[Tet] Tov YHVH la-kól, ve-rajamáv al kol maasáv.
[Yud] Yodúja YHVH kol maaséja, va-jasidéja yevarejúja.
[Kaf] Kevód maljutjá yoméru, u-gvuratjá yedabéru.
[Lamed] Lehodí'a li-vnéi ha-adám gevurotáv, u-jvód hadár maljutó.
[Mem] Maljutjá maljút kol olamím, u-memsheltjá be-jol dor va-dor.
[Samej] Soméj YHVH le-jol ha-noflím, ve-zokéf le-jol ha-kefufím.
[Ayin] Einéi jol eléja yeshabéru, ve-Atáh notén lahém et ojlam be-itó.
[Pe] Potéaj et yadéja, u-masbía le-jól jai ratzón.
[Tzadi] Tzadík YHVH be-jol drajáv, ve-jasíd be-jol maasáv.
[Kuf] Karóv YHVH le-jol kor'áv, le-jól ashér yikraúhu ve-emét.
[Resh] Retzón yereáv yaaséh, ve-et shav'atám yishmá ve-yoshi'ém.
[Shin] Shomér YHVH et kol ohaváv, ve-et kol ha-reshaím yashmíd.
[Tav] Tehilát YHVH yedabér pi, vi-yvaréj kol basár shem kodshó le-olám va-ed.
Va-anájnu nevaréj Yah, me-atáh ve-ad olám, Haleluyáh.`,
          spanish: `Dichosos quienes habitan en Tu Casa; continuamente Te alabarán por siempre.
Dichoso el pueblo para quien así es; dichoso el pueblo cuyo Dios es YHVH.
Alabanza de David:
[Alef] Te ensalzaré, mi Dios, el Rey, y bendeciré Tu Nombre por siempre jamás.
[Bet] Cada día Te bendeciré, y alabaré Tu Nombre eternamente.
[Guimel] Grande es YHVH y sumamente loado, y Su grandeza no tiene límites.
[Dalet] Una generación encomiará a la otra Tus obras, y Tus portentos proclamarán.
[He] El esplendor de la gloria de Tu majestad y las palabras de Tus prodigios narraré.
[Vav] Del poder de Tus temibles actos hablarán, y Tu grandeza yo relataré.
[Zayin] El recuerdo de Tu inmensa bondad expresarán, y cantarán con júbilo Tu justicia.
[Jet] Clemente y piadoso es YHVH, tardo para la ira y abundante en benevolencia.
[Tet] Bueno es YHVH para con todos, y Sus piedades colman todas Sus creaciones.
[Yud] Te reconocerán, YHVH, todas Tus criaturas, y Tus devotos siervos Te bendecirán.
[Kaf] La gloria de Tu reino proclamarán, y de Tu poderío discurrirán.
[Lamed] Para dar a conocer a los hijos del hombre Sus proezas y el glorioso esplendor de Su soberanía.
[Mem] Tu reinado es un reinado que abarca todas las eternidades, y Tu dominio subsiste en cada generación.
[Samej] Sostiene YHVH a todos los caídos y yergue a todos los encorvados por el dolor.
[Ayin] Los ojos de todos hacia Ti aguardan con esperanza, y Tú les proporcionas su alimento a su debido tiempo.
[Pe] Abres Tu mano generosa y sacias a todo ser viviente con beneplácito.
[Tzadi] Justo es YHVH en todos Sus caminos y benevolente en todas Sus obras.
[Kuf] Cercano está YHVH a todos cuantos Le invocan, a todos los que Le llaman con sinceridad y verdad.
[Resh] La voluntad de quienes Le temen Él cumplirá; escuchará su clamor angustiado y los salvará.
[Shin] Custodia YHVH a todos los que Le aman, mas a todos los impíos destruirá.
[Tav] La alabanza de YHVH proclamará mi boca, y toda carne bendecirá Su santo Nombre por siempre jamás.
Y nosotros bendeciremos al Eterno, desde ahora y para siempre; ¡Haleluyah! (Salmo 145).`,
          moroccanNote: `Si una persona recitó el versículo "Potéaj et yadéja" sin la debida concentración en la Providencia Divina, la Halajá marroquí estipula que debe repetir de inmediato ese versículo con plena kavaná.`,
        },
        {
          id: 'haleluyah_150',
          titleHebrew: 'הַלְלוּיָהּ (תְּהִלִּים ק״נ)',
          titleSpanish: 'Salmo 150 · Culminación de las Alabanzas Divinas',
          titleTranslit: 'Halelú El be-Kodshó',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `הַלְלוּיָהּ:
הַלְלוּ־אֵל בְּקָדְשׁוֹ, הַלְלוּהוּ בִּרְקִיעַ עֻזּוֹ:
הַלְלוּהוּ בִגְבוּרֹתָיו, הַלְלוּהוּ כְּרֹב גֻּדְלוֹ:
הַלְלוּהוּ בְּתֵקַע שׁוֹפָר, הַלְלוּהוּ בְּנֵבֶל וְכִנּוֹר:
הַלְלוּהוּ בְּתֹף וּמָחוֹל, הַלְלוּהוּ בְּמִנִּים וְעֻגָב:
הַלְלוּהוּ בְצִלְצְלֵי־שָׁמַע, הַלְלוּהוּ בְּצִלְצְלֵי תְרוּעָה:
כֹּל הַנְּשָׁמָה תְּהַלֵּל יָהּ, הַלְלוּיָהּ:
כֹּל הַנְּשָׁמָה תְּהַלֵּל יָהּ, הַלְלוּיָהּ:`,
          transliteration: `Haleluyáh.
Halelú El be-kodshó, halelúhu bi-rkí'a uzó.
Halelúhu vi-gvurotáv, halelúhu ke-rov gudló.
Halelúhu be-téka shofár, halelúhu be-nével ve-jinór.
Halelúhu be-tof u-majól, halelúhu be-miním ve-ugáv.
Halelúhu be-tziltzeléi shamá, halelúhu be-tziltzeléi teru'áh.
Kol ha-neshamáh tehallel Yah, Haleluyáh.
Kol ha-neshamáh tehallel Yah, Haleluyáh.`,
          spanish: `¡Haleluyah!
Alabad a Dios en Su santuario; alabadle en la bóveda celestial de Su poder.
Alabadle por Sus actos portentosos; alabadle conforme a la inmensidad de Su grandeza.
Alabadle con el tañido del shofar; alabadle con salterio y con arpa.
Alabadle con pandero y danza; alabadle con instrumentos de cuerdas y flauta.
Alabadle con címbalos resonantes; alabadle con címbalos de júbilo.
¡Que todo ser que alienta alabe a Dios; Haleluyah!
¡Que todo ser que alienta alabe a Dios; Haleluyah! (Salmo 150).`,
        },
        {
          id: 'shirat_hayam',
          titleHebrew: 'שִׁירַת הַיָּם',
          titleSpanish: 'El Cántico del Mar (Éxodo 15)',
          titleTranslit: 'Shirát HaYám',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `Es costumbre generalizada en el judaísmo marroquí ponerse de pie al cantar Shirat HaYam con alegría, rememorando el cruce milagroso del Mar Rojo.`,
          },
          hebrew: `אָז יָשִׁיר־מֹשֶׁה וּבְנֵי יִשְׂרָאֵל אֶת־הַשִּׁירָה הַזֹּאת לַיהוה, וַיֹּאמְרוּ לֵאמֹר:
אָשִׁירָה לַיהוה כִּי־גָאֹה גָּאָה, סוּס וְרֹכְבוֹ רָמָה בַיָּם:
עָזִּי וְזִמְרָת יָהּ וַיְהִי־לִי לִישׁוּעָה, זֶה אֵלִי וְאַנְוֵהוּ, אֱלֹהֵי אָבִי וַאֲרֹמְמֶנְהוּ:
יהוה אִישׁ מִלְחָמָה, יהוה שְׁמוֹ:
מַרְכְּבֹת פַּרְעֹה וְחֵילוֹ יָרָה בַיָּם, וּמִבְחַר שָׁלִשָׁיו טֻבְּעוּ בְיַם־סוּף:
תְּהֹמֹת יְכַסְיֻמוּ, יָרְדוּ בִמְצוֹלֹת כְּמוֹ־אָבֶן:
יְמִינְךָ יהוה נֶאְדָּרִי בַּכֹּחַ, יְמִינְךָ יהוה תִּרְעַץ אוֹיֵב:
וּבְרֹב גְּאוֹנְךָ תַּהֲרֹס קָמֶיךָ, תְּשַׁלַּח חֲרֹנְךָ יֹאכְלֵמוֹ כַּקַּשׁ:
וּבְרוּחַ אַפֶּיךָ נֶעֶרְמוּ מַיִם, נִצְּבוּ כְמוֹ־נֵד נֹזְלִים, קָפְאוּ תְהֹמֹת בְּלֶב־יָם:
אָמַר אוֹיֵב: אֶרְדֹּף אַשִּׂיג אֲחַלֵּק שָׁלָל, תִּמְלָאֵמוֹ נַפְשִׁי, אָרִיק חַרְבִּי תּוֹרִישֵׁמוֹ יָדִי:
נָשַׁפְתָּ בְרוּחֲךָ כִּסָּמוֹ יָם, צָלֲלוּ כַּעוֹפֶרֶת בְּמַיִם אַדִּירִים:
מִי־כָמֹכָה בָּאֵלִם יהוה, מִי כָּמֹכָה נֶאְדָּר בַּקֹּדֶשׁ, נוֹרָא תְהִלֹּת עֹשֵׂה פֶלֶא:
נָטִיתָ יְמִינְךָ תִּבְלָעֵמוֹ אָרֶץ:
נָחִיתָ בְחַסְדְּךָ עַם־זוּ גָּאָלְתָּ, נֵהַלְתָּ בְעָזְּךָ אֶל־נְוֵה קָדְשֶׁךָ:
שָׁמְעוּ עַמִּים יִרְגָּזוּן, חִיל אָחַז יֹשְׁבֵי פְּלָשֶׁת:
אָז נִבְהֲלוּ אַלּוּפֵי אֱדוֹם, אֵילֵי מוֹאָב יֹאחֲזֵמוֹ רָעַד, נָמֹגוּ כֹּל יֹשְׁבֵי כְנָעַן:
תִּפֹּל עֲלֵיהֶם אֵימָתָה וָפַחַד, בִּגְדֹל זְרוֹעֲךָ יִדְּמוּ כָּאָבֶן,
עַד־יַעֲבֹר עַמְּךָ יהוה, עַד־יַעֲבֹר עַם־זוּ קָנִיתָ:
תְּבִאֵמוֹ וְתִטָּעֵמוֹ בְּהַר נַחֲלָתְךָ, מָכוֹן לְשִׁבְתְּךָ פָּעַלְתָּ יהוה, מִקְּדָשׁ אֲדֹנָי כּוֹנֲנוּ יָדֶיךָ:
יהוה יִמְלֹךְ לְעֹלָם וָעֶד:
יהוה יִמְלֹךְ לְעֹלָם וָעֶד:
כִּי לַיהוה הַמְּלוּכָה, וּמוֹשֵׁל בַּגּוֹיִם:
וְעָלוּ מוֹשִׁעִים בְּהַר צִיּוֹן לִשְׁפֹּט אֶת־הַר עֵשָׂו, וְהָיְתָה לַיהוה הַמְּלוּכָה:
וְהָיָה יהוה לְמֶלֶךְ עַל־כָּל־הָאָרֶץ, בַּיּוֹם הַהוּא יִהְיֶה יהוה אֶחָד, וּשְׁמוֹ אֶחָד:`,
          transliteration: `Az yashír Moshéh u-vnéi Yisraél et ha-shiráh ha-zot la-YHVH, va-yomerú lemór:
Ashírah la-YHVH ki gaóh gaáh, sus ve-rojvó ramáh va-yam.
Ozí ve-zimrát Yah va-yéhi li li-yshu'áh, zeh Elí ve-anvéhu, Elohéi aví va-aromeménhu.
YHVH ish miljamáh, YHVH shemó.
Marjebót Par'óh ve-jeiló yaráh va-yam, u-mivjár shalisháv tub'ú ve-yam suf.
Tehomót yejasayúmu, yardú vi-mtzolót kemo áven.
Yeminjá YHVH needarí ba-kóaj, yeminjá YHVH tir'átz oyév.
U-vrov geonjá taharós kaméja, teshaláj jaronjá yojlémo ka-kash.
U-vrúaj apéja neeremú máyim, nitzvú jémo ned nozlím, kaf'ú tehomót be-lev yam.
Amár oyév: erdóf assíg ajallék shalál, timlaémo nafshí, arík jarbí torishémo yadí.
Nasháfta ve-rujajá kisámo yam, tzalelú ja-oféret be-máyim adirím.
Mi jamójah ba-elím YHVH, mi kamójah needár ba-kódesh, norá tehilót oséh féleh.
Natíta yeminjá tivlaémo áretz.
Najíta ve-jasdejá am zu gaálta, nehaltá ve-ozjá el nevéh kodshéja.
Sham'ú amím yirgazún, jil ajáz yoshvéi Peláshet.
Az nivhalú aluféi Edóm, eiléy Moáv yojazémo rá'ad, namógu kol yoshvéi Jená'an.
Tipól aleihém eimátah va-fájad, bi-gdol zeroajá yidmú ka-áven,
ad yaavór amjá YHVH, ad yaavór am zu kaníta.
Teviémo ve-titaémo be-har najalatjá, majón le-shivtejá paálta YHVH, mikdásh Adonái konenú yadéja.
YHVH yimlój le-olám va-ed!
YHVH yimlój le-olám va-ed!
Ki la-YHVH ha-melujáh, u-moshél ba-goyím.
Ve-alú moshi'ím be-har Tziyón lishpót et har Esáv, ve-haytáh la-YHVH ha-melujáh.
Ve-hayáh YHVH le-Mélej al kol ha-áretz, ba-yom ha-hu yihyéh YHVH Ejád, u-shmó Ejád.`,
          spanish: `Entonces entonaron Moisés y los hijos de Israel este cántico a YHVH, y dijeron:
Cantaré a YHVH pues se ha enaltecido soberanamente; al caballo y a su jinete arrojó en el mar.
Mi fortaleza y mi cántico es Dios, y ha sido para mí salvación; este es mi Dios y Le glorificaré, el Dios de mi padre y Le exaltaré.
YHVH es el Señor de la guerra, ¡YHVH es Su Nombre!
Los carros del Faraón y su ejército precipitó en el mar, y la élite de sus capitanes se hundió en el Mar Rojo.
Los abismos los cubrieron; descendieron a las profundidades cual piedra.
Tu diestra, oh YHVH, es magnífica en poder; Tu diestra, oh YHVH, aniquila al enemigo.
Con la abundancia de Tu majestad derribas a los que se alzan contra Ti; desatas Tu furor y los consume como hojarasca.
Con el soplo de Tu aliento se amontonaron las aguas, se irguieron como un dique las corrientes, se congelaron los abismos en el corazón del mar.
Dijo el enemigo: "Perseguiré, alcanzaré, repartiré despojos, saciaré en ellos mi alma; desenvainaré mi espada, los destruirá mi mano".
Soplaste con Tu viento y los cubrió el mar; se hundieron como plomo en las turbulentas aguas.
¿Quién como Tú entre los poderosos, oh YHVH? ¿Quién como Tú, soberbio en santidad, imponente en loores, hacedor de prodigios?
Extendiste Tu diestra y la tierra los devoró.
Guiaste con Tu benevolencia a este pueblo que redimiste; lo condujiste con Tu poder a la morada de Tu santidad.
Lo oyeron los pueblos y se estremecieron; el terror se apoderó de los habitantes de Filistea.
Entonces se turbaron los jefes de Edom, a los caudillos de Moab los dominó el pavor, desfallecieron todos los moradores de Canaán.
Caiga sobre ellos temor y espanto; ante la grandeza de Tu brazo enmudezcan como piedra, hasta que pase Tu pueblo, oh YHVH, hasta que pase este pueblo que Tú adquiriste.
Los introducirás y los plantarás en el monte de Tu heredad, lugar que dispones para Tu morada, oh YHVH; el Santuario, oh Señor, que establecieron Tus manos.
¡YHVH reinará por siempre jamás!
¡YHVH reinará por siempre jamás!
Pues de YHVH es la soberanía, y Él rige sobre las naciones.
Y ascenderán salvadores al monte de Sión para juzgar la montaña de Esaú, y será de YHVH el reino.
Y será reconocido YHVH como Rey Soberano sobre toda la tierra; en aquel día YHVH será Uno, y Su Nombre Uno (Éxodo 15:1-19, Abdías 1:21, Zacarías 14:9).`,
        },
        {
          id: 'yishtabaj',
          titleHebrew: 'יִשְׁתַּבַּח שִׁמְךָ',
          titleSpanish: 'Alabado sea Tu Nombre (Cierre de Pesuké deZimrá)',
          titleTranslit: 'Yishtabáj Shimjá',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `Permanezca de pie con recogimiento al concluir los himnos de Pesuké deZimrá y sellar la bendición.`,
          },
          hebrew: `יִשְׁתַּבַּח שִׁמְךָ לָעַד מַלְכֵּנוּ, הָאֵל הַמֶּלֶךְ הַגָּדוֹל וְהַקָּדוֹשׁ בַּשָּׁמַיִם וּבָאָרֶץ, כִּי לְךָ נָאֶה יהוה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ לְעוֹלָם וָעֶד: שִׁיר וּשְׁבָחָה, הַלֵּל וְזִמְרָה, עֹז וּמֶמְשָׁלָה, נֶצַח, גְּדֻלָּה וּגְבוּרָה, תְּהִלָּה וְתִפְאֶרֶת, קְדֻשָּׁה וּמַלְכוּת, בְּרָכוֹת וְהוֹדָאוֹת לְשִׁמְךָ הַגָּדוֹל וְהַקָּדוֹשׁ, וּמֵעוֹלָם וְעַד־עוֹלָם אַתָּה אֵל: בָּרוּךְ אַתָּה יהוה, מֶלֶךְ גָּדוֹל וּמְהֻלָּל בַּתִּשְׁבָּחוֹת, אֵל הַהוֹדָאוֹת, אֲדוֹן הַנִּפְלָאוֹת, בּוֹחֵר בְּשִׁירֵי זִמְרָה, מֶלֶךְ אֵל חֵי הָעוֹלָמִים:`,
          transliteration: `Yishtabáj shimjá la-ad Malkénu, ha-El ha-Mélej ha-gadól ve-ha-kadósh ba-shamáyim u-va-áretz, ki lejá naéh YHVH Elohéinu ve-Elohéi avotéinu le-olám va-ed: shir u-shvajáh, halél ve-zimráh, oz u-memshaláh, nétzaj, geduláh u-gvuráh, tehiláh ve-tif\'éret, kedusháh u-maljút, berajót ve-hodaót le-shimjá ha-gadól ve-ha-kadósh, u-me-olám ve-ad olám Atáh El. Barúj Atáh YHVH, Mélej gadól u-mehullál ba-tishbajót, El ha-hodaót, Adón ha-niflaót, bojér be-shiréi zimráh, Mélej El jéi ha-olamím.`,
          spanish: `Alabado sea Tu Nombre para siempre, Rey nuestro, Dios y Rey supremo y santo en el cielo y en la tierra; pues a Ti corresponden, YHVH nuestro Dios y Dios de nuestros antepasados, por siempre cántico y loor, alabanza y melodía, poder y soberanía, eternidad, grandeza y valentía, gloria y esplendor, santidad y reinado, bendiciones y agradecimientos a Tu Nombre inmenso y santo. Desde la eternidad hasta la eternidad Tú eres Dios. Bendito eres Tú, YHVH, Rey soberano exaltado en loores, Dios de agradecimientos, Señor de prodigios, que se deleita con cánticos de alabanza, Rey, Dios, Vida de los mundos.`,
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 5: KERIÁT SHEMÁ Y SUS BENDICIONES (100% COMPLETO)
    // ------------------------------------------------------------------------
    {
      id: 'shema_u_virjoteha',
      order: 5,
      titleHebrew: 'קְרִיאַת שְׁמַע וּבִרְכוֹתֶיהָ',
      titleSpanish: 'Shemá Israel y sus Bendiciones',
      titleTranslit: 'Keriát Shemá u-Virjotéha',
      description: `Proclamación excelsa de la Unicidad Absoluta del Creador y la aceptación del Yugo de los Cielos.`,
      segments: [
        {
          id: 'bareju',
          titleHebrew: 'בָּרְכוּ',
          titleSpanish: 'Convocatoria al Rezo Comunitario',
          titleTranslit: 'Barejú',
          posture: {
            type: 'bowing',
            label: 'Inclinación de reverencia',
            instruction: `Inclínese al decir Barejú y levántese erguido al decir el Nombre Divino YHVH.`,
          },
          requiresMinian: true,
          hebrew: `בָּרְכוּ אֶת־יהוה הַמְבֹרָךְ!
(קהל ושליח ציבור): בָּרוּךְ יהוה הַמְבֹרָךְ לְעוֹלָם וָעֶד!`,
          transliteration: `Barejú et YHVH ha-mvoráj!
(Respuesta): Barúj YHVH ha-mvoráj le-olám va-ed!`,
          spanish: `¡Bendigamos a YHVH, el Bendito!
(Respuesta comunitaria): ¡Bendito sea YHVH, el Bendito, por siempre jamás!`,
        },
        {
          id: 'yotzer_or',
          titleHebrew: 'יוֹצֵר אוֹר',
          titleSpanish: 'Primera Bendición: La Creación de la Luz',
          titleTranslit: 'Yotzér Or',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, יוֹצֵר אוֹר וּבוֹרֵא חֹשֶׁךְ, עֹשֶׂה שָׁלוֹם וּבוֹרֵא אֶת־הַכֹּל:
הַמֵּאִיר לָאָרֶץ וְלַדָּרִים עָלֶיהָ בְּרַחֲמִים, וּבְטוּבוֹ מְחַדֵּשׁ בְּכָל־יוֹם תָּמִיד מַעֲשֵׂה בְרֵאשִׁית: מָה רַבּוּ מַעֲשֶׂיךָ יהוה, כֻּלָּם בְּחָכְמָה עָשִׂיתָ, מָלְאָה הָאָרֶץ קִנְיָנֶךָ:
תִּתְבָּרַךְ יהוה אֱלֹהֵינוּ עַל שֶׁבַח מַעֲשֵׂה יָדֶיךָ, וְעַל מְאוֹרֵי אוֹר שֶׁעָשִׂיתָ יְפָאֲרוּךָ סֶּלָה:
בָּרוּךְ אַתָּה יהוה, יוֹצֵר הַמְּאוֹרוֹת:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, yotzér or u-voré jóshej, oséh shalóm u-voré et ha-kól.
Ha-meír la-áretz ve-la-darím aléha be-rajamím, u-ve-tuvó mejadésh be-jol yom tamíd maaséh vereshít. Mah rabú maaséja YHVH, kulám be-jojmáh asíta, mal'áh ha-áretz kinyanéja.
Titbaráj YHVH Elohéinu al shévaj maaséh yadéja, ve-al meoréi or she-asíta yefaerúja séla.
Barúj Atáh YHVH, yotzér ha-meorót.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que forma la luz y crea la oscuridad, que hace la paz y lo crea todo.
Él ilumina a la tierra y a quienes moran en ella con misericordia, y con Su infinita bondad renueva a diario continuamente la obra de la Creación. ¡Cuán innumerables son Tus obras, oh YHVH; a todas con sabiduría las hiciste, llena está la tierra de Tus creaciones!
Bendito seas, YHVH nuestro Dios, por la alabanza de la obra de Tus manos, y por las luminarias de luz que creaste Te glorificarán por siempre.
Bendito eres Tú, YHVH, Creador de las luminarias.`,
        },
        {
          id: 'ahavat_olam',
          titleHebrew: 'אַהֲבַת עוֹלָם',
          titleSpanish: 'Segunda Bendición: El Amor Eterno de la Torá',
          titleTranslit: 'Ahavát Olám',
          posture: {
            type: 'tzitzit',
            label: 'Reunir los 4 flecos (tzitzit)',
            instruction: `Reúna las 4 esquinas de los tzitzit entre el anular y el meñique de la mano izquierda, colocándolos cerca del corazón.`,
          },
          hebrew: `אַהֲבַת עוֹלָם אֲהַבְתָּנוּ יהוה אֱלֹהֵינוּ, חֶמְלָה גְדוֹלָה וִיתֵרָה חָמַלְתָּ עָלֵינוּ:
אָבִינוּ מַלְכֵּנוּ, בַּעֲבוּר אֲבוֹתֵינוּ שֶׁבָּטְחוּ בָךְ וַתְּלַמְּדֵם חֻקֵּי חַיִּים, כֵּן תְּחָנֵּנוּ וּתְלַמְּדֵנוּ:
אָבִינוּ, הָאָב הָרַחֲמָן, הַמְרַחֵם, רַחֶם נָא עָלֵינוּ, וְתֵן בְּלִבֵּנוּ לְהָבִין וּלְהַשְׂכִּיל, לִשְׁמֹעַ, לִלְמֹד וּלְלַמֵּד, לִשְׁמֹר וְלַעֲשׂוֹת וּלְקַיֵּם אֶת־כָּל־דִּבְרֵי תַלְמוּד תּוֹרָתְךָ בְּאַהֲבָה:
וְהָאֵר עֵינֵינוּ בְּתוֹרָתֶךָ, וְדַבֵּק לִבֵּנוּ בְּמִצְוֹתֶיךָ, וְיַחֵד לְבָבֵנוּ לְאַהֲבָה וּלְיִרְאָה אֶת־שְׁמֶךָ, כִּי בְשֵׁם קָדְשְׁךָ הַגָּדוֹל וְהַנּוֹרָא בָּטָחְנוּ, נָגִילָה וְנִשְׂמְחָה בִישׁוּעָתֶךָ:
בָּרוּךְ אַתָּה יהוה, הַבּוֹחֵר בְּעַמּוֹ יִשְׂרָאֵל בְּאַהֲבָה:`,
          transliteration: `Ahavát olám ahavtánu YHVH Elohéinu, jemláh gedoláh vi-yteráh jamálta aléinu.
Avínu Malkénu, baavúr avotéinu she-batjú vaj va-telamdém jukéi jayím, ken tejonénu u-telamdénu.
Avínu, ha-Av ha-Rajamán, ha-merajém, rajém na aléinu, ve-ten be-libénu lehavín u-lehaskíl, lishmóa, lilmód u-lelaméd, lishmór ve-laasót u-lekayém et kol divréi talmúd Toratjá be-ahaváh.
Ve-haér eynéinu be-Toratéja, ve-dabék libénu be-mitzvotéja, ve-yajéd levavénu le-ahaváh u-le-yir'áh et sheméja, ki ve-shém kodshejá ha-gadól ve-ha-norá batájnu, nagílah ve-nizmejáh bi-yshuatéja.
Barúj Atáh YHVH, ha-bojér be-amó Yisraél be-ahaváh.`,
          spanish: `Con amor eterno nos has amado, YHVH nuestro Dios; con compasión grande y desbordante Te apiadaste de nosotros.
Padre nuestro, Rey nuestro, por mérito de nuestros antepasados que confiaron en Ti y a quienes enseñaste estatutos de vida, apiádate de nosotros e instrúyenos.
Padre nuestro, Padre misericordioso que se compadece, ten compasión de nosotros y pon en nuestro corazón discernimiento para entender, comprender, escuchar, aprender y enseñar, custodiar, cumplir y materializar todas las palabras de enseñanza de Tu Torá con amor.
Ilumina nuestros ojos en Tu Torá, apega nuestro corazón a Tus preceptos y unifica nuestros sentimientos para amar y reverenciar Tu Santo Nombre, pues en Tu Nombre santo, grande y temible hemos confiado; nos regocijaremos y alegraremos en Tu salvación.
Bendito eres Tú, YHVH, que elige a Su pueblo Israel con amor.`,
        },
        {
          id: 'shema_yisrael',
          titleHebrew: 'קְרִיאַת שְׁמַע (ג׳ פָּרָשִׁיּוֹת שְׁלֵמוֹת)',
          titleSpanish: 'Shemá Israel · Los 3 Párrafos Bíblicos Completos',
          titleTranslit: 'Shemá Yisraél',
          posture: {
            type: 'cover_eyes',
            label: 'Cubrirse los ojos con la mano derecha',
            instruction: `Cubra sus ojos con los dedos de la mano derecha, prolongando con solemnidad la letra Dalet de "Ejád" proclamando la soberanía divina en los 7 cielos, la tierra y los 4 puntos cardinales.`,
          },
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
        },
        {
          id: 'emet_veyatziv',
          titleHebrew: 'אֱמֶת וְיַצִּיב (גְּאֻלָּה)',
          titleSpanish: 'Tercera Bendición: Proclamación de Verdad y Redención',
          titleTranslit: 'Emét ve-Yatzív',
          posture: {
            type: 'sitting',
            label: 'Sentado (ponerse de pie al final)',
            instruction: `Al llegar a "Tzur Yisrael" se pone de pie para enlazar de inmediato la Redención con la oración de la Amidá en silencio absoluto.`,
          },
          hebrew: `אֱמֶת וְיַצִּיב, וְנָכוֹן וְקַיָּם, וְיָשָׁר וְנֶאֱמָן, וְאָהוּב וְחָבִיב, וְנֶחְמָד וְנָעִים, וְנוֹרָא וְאַדִּיר, וּמְתֻקָּן וּמְקֻבָּל, וְטוֹב וְיָפֶה הַדָּבָר הַזֶּה עָלֵינוּ לְעוֹלָם וָעֶד:
אֱמֶת, אֱלֹהֵי עוֹלָם מַלְכֵּנוּ, צוּר יַעֲקֹב מָגֵן יִשְׁעֵנוּ, לְדֹר וָדֹר הוּא קַיָּם וּשְׁמוֹ קַיָּם, וְכִסְאוֹ נָכוֹן, וּמַלְכוּתוֹ וֶאֱמוּנָתוֹ לָעַד קַיֶּמֶת:
עֶזְרַת אֲבוֹתֵינוּ אַתָּה הוּא מֵעוֹלָם, מָגֵן וּמוֹשִׁיעַ לִבְנֵיהֶם אַחֲרֵיהֶם בְּכָל־דּוֹר וָדוֹר:
מִמִּצְרַיִם גְּאַלְתָּנוּ יהוה אֱלֹהֵינוּ, וּמִבֵּית עֲבָדִים פְּדִיתָנוּ: כָּל־בְּכוֹרֵיהֶם הָרַגְתָּ, וּבְכוֹרְךָ יִשְׂרָאֵל גָּאָלְתָּ, וְיַם סוּף לָהֶם בָּקַעְתָּ, וְזֵדִים טִבַּעְתָּ, וִידִידִים הֶעֱבַרְתָּ:
עַל זֹאת שִׁבְּחוּ אֲהוּבִים וְרוֹמְמוּ לָאֵל, וְנָתְנוּ יְדִידִים זְמִירוֹת, שִׁירוֹת וְתִשְׁבָּחוֹת, בְּרָכוֹת וְהוֹדָאוֹת לְמֶלֶךְ אֵל חַי וְקַיָּם:
מִי כָמֹכָה בָּאֵלִם יהוה, מִי כָּמֹכָה נֶאְדָּר בַּקֹּדֶשׁ, נוֹרָא תְהִלֹּת עֹשֵׂה פֶלֶא:
שִׁירָה חֲדָשָׁה שִׁבְּחוּ גְאוּלִים לְשִׁמְךָ הַגָּדוֹל עַל שְׂפַת הַיָּם, יַחַד כֻּלָּם הוֹדוּ וְהִמְלִיכוּ וְאָמְרוּ:
יהוה יִמְלֹךְ לְעוֹלָם וָעֶד:
צוּר יִשְׂרָאֵל, קוּמָה בְּעֶזְרַת יִשְׂרָאֵל, וּפְדֵה כִנְאֻמֶךָ יְהוּדָה וְיִשְׂרָאֵל: גֹּאֲלֵנוּ יהוה צְבָאוֹת שְׁמוֹ, קְדוֹשׁ יִשְׂרָאֵל:
בָּרוּךְ אַתָּה יהוה, גָּאַל יִשְׂרָאֵל:`,
          transliteration: `Emét ve-yatzív, ve-najón ve-kayám, ve-yashár ve-neemán, ve-ahúv ve-javív, ve-nejmád ve-naím, ve-norá ve-adír, u-metukán u-mekubál, ve-tov ve-yaféh ha-davár ha-zéh aléinu le-olám va-ed.
Emét, Elohéi olám Malkénu, Tzur Yaakóv magén yish'énu, le-dor va-dor Hu kayám u-shmó kayám, ve-jis'ó najón, u-maljutó ve-emunató la-ad kayémet.
Ezrát avotéinu Atáh hu me-olám, magén u-moshía li-vneihém ajaréihém be-jol dor va-dor.
Mi-Mitzráyim gealtánu YHVH Elohéinu, u-mi-béit avadím peditánu; kol bejoreihém harágta, u-vejórja Yisraél gaálta, ve-yam suf lahém bakáta, ve-zedím tibáta, vi-ydidím heevárta.
Al zot shibejú ahuvím ve-romemú la-El, ve-natnú yedidím zmirot, shirot ve-tishbajot, berajot ve-hodaot le-Mélej El jai ve-kayám.
Mi jamójah ba-elím YHVH, mi kamójah needár ba-kódesh, norá tehilót oséh féleh.
Shiráh jadasháh shibejú geulím le-shimjá ha-gadól al sefát ha-yam, yájad kulám hodú ve-himlíju ve-amrú:
YHVH yimlój le-olám va-ed!
Tzur Yisraél, kúmah be-ezrát Yisraél, u-fdéh ji-numéja Yehudáh ve-Yisraél; Goalénu YHVH Tzevaót shemó, Kedósh Yisraél.
Barúj Atáh YHVH, gaál Yisraél.`,
          spanish: `Verdadera, firme, establecida y perdurable, recta y fiel, amada y entrañable, deleitosa y placentera, reverenciada y majestuosa, bien ordenada y aceptable, buena y hermosa es esta palabra para nosotros por siempre jamás.
En verdad, el Dios del universo es nuestro Rey, la Roca de Jacob el escudo de nuestra salvación; de generación en generación Él subsiste y Su Nombre perdura, Su trono es inconmovible, y Su soberanía y fidelidad son eternas.
El auxilio de nuestros antepasados has sido Tú desde siempre, escudo y salvador de sus hijos después de ellos en cada época.
De Egipto nos redimiste, YHVH nuestro Dios, y de la casa de servidumbre nos rescataste; a todos sus primogénitos diste muerte, y a Tu primogénito Israel redimiste; el Mar Rojo para ellos partiste, a los soberbios anegaste y a Tus amados hiciste cruzar.
Por ello ensalzaron los amados y exaltaron a Dios, y entonaron los predilectos melodías, cánticos y alabanzas, bendiciones y agradecimientos al Rey, Dios vivo y eterno.
¿Quién como Tú entre los poderosos, YHVH? ¿Quién como Tú, magnífico en santidad, temible en loores, hacedor de maravillas?
Un cántico nuevo entonaron los redimidos a Tu gran Nombre a la orilla del mar; unánimes todos agradecieron, proclamaron Tu soberanía y dijeron:
¡YHVH reinará por siempre jamás!
Roca de Israel, levántate en ayuda de Israel y rescata según Tu promesa a Judá e Israel; nuestro Redentor es YHVH de los ejércitos, el Santo de Israel.
Bendito eres Tú, YHVH, que redimió a Israel.`,
          moroccanNote: `De acuerdo a la estricta Halajá sefardí, se prohíbe responder "Amén" tras "Gaál Yisraél", debiéndose unir de inmediato con el inicio de la Amidá ("Adonái sefatái tiftaj") para conectar la Redención con la plegaria.`,
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 6: LA AMIDÁ DE 19 BENDICIONES (100% COMPLETO)
    // ------------------------------------------------------------------------
    {
      id: 'amida_jol',
      order: 6,
      titleHebrew: 'תְּפִלַּת הָעֲמִידָה (שְׁמוֹנֶה עֶשְׂרֵה)',
      titleSpanish: 'La Amidá · Las 19 Bendiciones de Días Hábiles',
      titleTranslit: 'Tefilat HaAmidáh (Shemonéh Esréh)',
      description: `La cumbre de la liturgia judía: de pie, con pies juntos, orientados en dirección al Templo de Jerusalén en recogimiento supremo.`,
      segments: [
        {
          id: 'amida_intro',
          titleHebrew: 'פְּתִיחַת הָעֲמִידָה',
          titleSpanish: 'Invocación de apertura',
          titleTranslit: 'Petiját HaAmidáh',
          posture: {
            type: 'standing',
            label: 'De pie con pies juntos',
            instruction: `Dé 3 pasos reverentes hacia adelante con pies juntos apuntando a Jerusalén.`,
          },
          isSilent: true,
          hebrew: `אֲדֹנָי, שְׂפָתַי תִּפְתָּח, וּפִי יַגִּיד תְּהִלָּתֶךָ:`,
          transliteration: `Adonái, sefatái tiftáj, u-fi yagíd tehilatéja.`,
          spanish: `Señor mío, abre mis labios para que mi boca proclame Tu alabanza (Salmo 51:17).`,
        },
        {
          id: 'amida_1_avot',
          titleHebrew: 'א. אָבוֹת',
          titleSpanish: '1. Patriarcas (Avot)',
          titleTranslit: 'Avot',
          posture: {
            type: 'bowing',
            label: 'Inclinación de reverencia',
            instruction: `Doble rodillas en "Barúj", inclínese en "Atáh", y levántese erguido al pronunciar el Nombre Divino YHVH. Repita al finalizar.`,
          },
          isSilent: true,
          hebrew: `בָּרוּךְ אַתָּה יהוה, אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ, אֱלֹהֵי אַבְרָהָם, אֱלֹהֵי יִצְחָק, וֵאלֹהֵי יַעֲקֹב, הָאֵל הַגָּדוֹל הַגִּבּוֹר וְהַנּוֹרָא, אֵל עֶלְיוֹן, גּוֹמֵל חֲסָדִים טוֹבִים, וְקוֹנֵה הַכֹּל, וְזוֹכֵר חַסְדֵי אָבוֹת, וּמֵבִיא גוֹאֵל לִבְנֵי בְנֵיהֶם לְמַעַן שְׁמוֹ בְּאַהֲבָה: מֶלֶךְ עוֹזֵר וּמוֹשִׁיעַ וּמָגֵן: בָּרוּךְ אַתָּה יהוה, מָגֵן אַבְרָהָם:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu ve-Elohéi avotéinu, Elohéi Avrahám, Elohéi Yitzják, ve-Elohéi Yaakóv, ha-El ha-gadól ha-gibór ve-ha-norá, El Elyón, gomél jasadím tovím, ve-konéh ha-kól, ve-zojér jasdéi avot, u-meví goél li-vnéi veneihém le-máan shemó be-ahaváh. Mélej ozér u-moshía u-magén. Barúj Atáh YHVH, magén Avrahám.`,
          spanish: `Bendito eres Tú, YHVH, nuestro Dios y Dios de nuestros antepasados, Dios de Abraham, Dios de Isaac y Dios de Jacob; Dios grandioso, heroico y reverenciado, Dios Altísimo que otorga bondades benévolas, Dueño de todo, que recuerda la devoción de los patriarcas y trae un redentor a los hijos de sus hijos en aras de Su Nombre con amor. Rey que asiste, salva y protege. Bendito eres Tú, YHVH, Escudo de Abraham.`,
        },
        {
          id: 'amida_2_gevurot',
          titleHebrew: 'ב. גְּבוּרוֹת',
          titleSpanish: '2. Poderío Divino y Resurrección (Gevurot)',
          titleTranslit: 'Gevurot',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `אַתָּה גִּבּוֹר לְעוֹלָם אֲדֹנָי, מְחַיֵּה מֵתִים אַתָּה, רַב לְהוֹשִׁיעַ: מוֹרִיד הַטָּל (בחורף: מַשִּׁיב הָרוּחַ וּמוֹרִיד הַגֶּשֶׁם): מְכַלְכֵּל חַיִּים בְּחֶסֶד, מְחַיֵּה מֵתִים בְּרַחֲמִים רַבִּים, סוֹמֵךְ נוֹפְלִים, וְרוֹפֵא חוֹלִים, וּמַתִּיר אֲסוּרִים, וּמְקַיֵּם אֱמוּנָתוֹ לִישֵׁנֵי עָפָר: מִי כָמוֹךָ בַּעַל גְּבוּרוֹת, וּמִי דּוֹמֶה לָּךְ, מֶלֶךְ מֵמִית וּמְחַיֶּה וּמַצְמִיחַ יְשׁוּעָה: וְנֶאֱמָן אַתָּה לְהַחֲיוֹת מֵתִים: בָּרוּךְ אַתָּה יהוה, מְחַיֵּה הַמֵּתִים:`,
          transliteration: `Atáh gibór le-olám Adonái, mejayéh metím Atáh, rav le-hoshí'a. Moríd ha-tal (en invierno: Mashív ha-rúaj u-moríd ha-gáshem). Mejalkél jayím be-jésed, mejayéh metím be-rajamím rabím, soméj noflím, ve-rofé jolím, u-matír asurím, u-mkayém emunató li-yshenéi afár. Mi jamója báal gevurót u-mi dóméh laj, Mélej memít u-mejayéh u-matzmíaj yeshuáh. Ve-neemán Atáh lehajayót metím. Barúj Atáh YHVH, mejayéh ha-metím.`,
          spanish: `Tú eres todopoderoso por siempre, Señor mío; Tú devuelves la vida a los fallecidos, inmenso en la salvación. Haces descender el rocío (en invierno: Haces soplar el viento y descender la lluvia). Sustentas a los vivientes con benevolencia, revives a los difuntos con abundante misericordia, sostienes a los caídos, sanas a los enfermos, liberas a los prisioneros y mantienes Tu fidelidad con los que duermen en el polvo. ¿Quién como Tú, Amo de hechos poderosos, y quién se asemeja a Ti, Rey que causa la muerte, restituye la vida y hace florecer la salvación? Y fiel eres Tú para resucitar a los muertos. Bendito eres Tú, YHVH, que resucita a los muertos.`,
        },
        {
          id: 'amida_3_kedusha',
          titleHebrew: 'ג. קְדֻשַּׁת הַשֵּׁם / כֶּתֶר',
          titleSpanish: '3. Santidad de Dios (Kedushá / Kéter)',
          titleTranslit: 'Kedushát HaShem',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `En el rezo silencioso se recita el párrafo de Atáh Kadósh. Con Minián, durante la repetición del Jazán se proclama Kéter.`,
          },
          isSilent: true,
          hebrew: `אַתָּה קָדוֹשׁ וְשִׁמְךָ קָדוֹשׁ, וּקְדוֹשִׁים בְּכָל־יוֹם יְהַלְלוּךָ סֶּלָה, כִּי אֵל מֶלֶךְ גָּדוֹל וְקָדוֹשׁ אָתָּה: בָּרוּךְ אַתָּה יהוה, הָאֵל הַקָּדוֹשׁ:`,
          transliteration: `Atáh kadósh ve-shimjá kadósh, u-kdoshím be-jol yom yehalelúja séla, ki El Mélej gadól ve-kadósh Atáh. Barúj Atáh YHVH, ha-El ha-kadósh.`,
          spanish: `Tú eres Santo y Tu Nombre es Santo, y seres sagrados Te alaban a diario por siempre; pues Dios y Rey excelso y santo eres Tú. Bendito eres Tú, YHVH, el Dios Santo.`,
        },
        {
          id: 'amida_4_daat',
          titleHebrew: 'ד. בִּרְכַּת דַּעַת',
          titleSpanish: '4. Discernimiento y Sabiduría (Daat)',
          titleTranslit: 'Atáh Jonén',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `אַתָּה חוֹנֵן לְאָדָם דַּעַת, וּמְלַמֵּד לֶאֱנוֹשׁ בִּינָה: חָנֵּנוּ מֵאִתְּךָ חָכְמָה בִּינָה וָדָעַת: בָּרוּךְ אַתָּה יהוה, חוֹנֵן הַדָּעַת:`,
          transliteration: `Atáh jonén le-adám dáat, u-melaméd le-enósh bináh. Jonénu me-itjá jojmáh bináh va-dáat. Barúj Atáh YHVH, jonén ha-dáat.`,
          spanish: `Tú agracias al ser humano con entendimiento y enseñas al mortal discernimiento. Concédenos con beneplácito de Tu presencia sabiduría, entendimiento y conocimiento. Bendito eres Tú, YHVH, que otorga el entendimiento.`,
        },
        {
          id: 'amida_5_teshuva',
          titleHebrew: 'ה. תְּשׁוּבָה',
          titleSpanish: '5. Arrepentimiento y Retorno (Teshuvá)',
          titleTranslit: 'Hashivénu',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `הֲשִׁיבֵנוּ אָבִינוּ לְתוֹרָתֶךָ, וְקָרְבֵנוּ מַלְכֵּנוּ לַעֲבוֹדָתֶךָ, וְהַחֲזִירֵנוּ בִּתְשׁוּבָה שְׁלֵמָה לְפָנֶיךָ: בָּרוּךְ אַתָּה יהוה, הָרוֹצֶה בִּתְשׁוּבָה:`,
          transliteration: `Hashivénu Avínu le-Toratéja, ve-karvénu Malkénu la-avodatéja, ve-hajzirénu bi-tshuváh shelemáh lefanéja. Barúj Atáh YHVH, ha-rotzèh bi-tshuváh.`,
          spanish: `Haznos retornar, Padre nuestro, a Tu Torá, acércanos, Rey nuestro, a Tu sagrado servicio, y devuélvenos en sincero arrepentimiento ante Tu presencia. Bendito eres Tú, YHVH, que desea el arrepentimiento.`,
        },
        {
          id: 'amida_6_selija',
          titleHebrew: 'ו. סְלִיחָה',
          titleSpanish: '6. Perdón de las Faltas (Selijá)',
          titleTranslit: 'Selaj Lánu',
          posture: {
            type: 'chest_beat',
            label: 'Golpe en el pecho',
            instruction: `Golpee suavemente el costado izquierdo del pecho con la mano derecha al decir "Jatánu" y "Pashánu".`,
          },
          isSilent: true,
          hebrew: `סְלַח לָנוּ אָבִינוּ כִּי חָטָאנוּ, מְחוֹל לָנוּ מַלְכֵּנוּ כִּי פָשָׁעְנוּ, כִּי אֵל טוֹב וְסַלָּח אָתָּה: בָּרוּךְ אַתָּה יהוה, חַנּוּן הַמַּרְבֶּה לִסְלוֹחַ:`,
          transliteration: `Selaj lánu Avínu ki jatánu, mejól lánu Malkénu ki fashánu, ki El tov ve-saláj Atáh. Barúj Atáh YHVH, janún ha-marbéh lislóaj.`,
          spanish: `Perdónanos, Padre nuestro, pues erramos; absuélvenos, Rey nuestro, pues transgredimos; pues Dios bueno y perdonador eres Tú. Bendito eres Tú, YHVH, clemente que colma de perdón.`,
        },
        {
          id: 'amida_7_geula',
          titleHebrew: 'ז. גְּאֻלָּה',
          titleSpanish: '7. Redención del Sufrimiento (Geulá)',
          titleTranslit: 'Re\'éh na ve-Onyénu',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `רְאֵה נָא בְעָנְיֵנוּ, וְרִיבָה רִיבֵנוּ, וּגְאָלֵנוּ מְהֵרָה לְמַעַן שְׁמֶךָ, כִּי גּוֹאֵל חָזָק אָתָּה: בָּרוּךְ אַתָּה יהוה, גּוֹאֵל יִשְׂרָאֵל:`,
          transliteration: `Re\'éh na ve-onyénu, ve-riváh rivénu, u-gealénu meheráh le-máan sheméja, ki goél jazák Atáh. Barúj Atáh YHVH, goél Yisraél.`,
          spanish: `Contempla, por favor, nuestra aflicción, asume nuestra causa y redímenos pronto en aras de Tu Nombre, pues un Redentor poderoso eres Tú. Bendito eres Tú, YHVH, Redentor de Israel.`,
        },
        {
          id: 'amida_8_refua',
          titleHebrew: 'ח. רְפוּאָה',
          titleSpanish: '8. Curación y Sanidad Integral (Refuá)',
          titleTranslit: 'Refaénu',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `רְפָאֵנוּ יהוה וְנֵרָפֵא, הוֹשִׁיעֵנוּ וְנִוָּשֵׁעָה, כִּי תְהִלָּתֵנוּ אָתָּה, וְהַעֲלֵה אֲרוּכָה וּרְפוּאָה שְׁלֵמָה לְכָל־מַכּוֹתֵינוּ, וּלְכָל־תַּחֲלוּאֵינוּ, וּלְכָל־מַכְאוֹבֵינוּ, כִּי אֵל רוֹפֵא רַחְמָן וְנֶאֱמָן אָתָּה: בָּרוּךְ אַתָּה יהוה, רוֹפֵא חוֹלֵי עַמּוֹ יִשְׂרָאֵל:`,
          transliteration: `Refaénu YHVH ve-nerafé, hoshiénu ve-nivasheáh, ki tehilaténu Atáh, ve-haaléh arujáh u-refuáh shelemáh le-jol makotéinu, u-le-jol tajalueínu, u-le-jol maj'oveínu, ki El rofé rajmán ve-neemán Atáh. Barúj Atáh YHVH, rofé joléi amó Yisraél.`,
          spanish: `Sánanos, YHVH, y seremos curados; sálvanos y seremos salvos, pues nuestra alabanza eres Tú; y concede alivio y curación plena a todas nuestras dolencias, a todas nuestras afecciones y a todos nuestros sufrimientos; pues Dios, Médico compasivo y fidedigno eres Tú. Bendito eres Tú, YHVH, que sana a los enfermos de Su pueblo Israel.`,
        },
        {
          id: 'amida_9_shanim',
          titleHebrew: 'ט. בִּרְכַּת הַשָּׁנִים',
          titleSpanish: '9. Prosperidad del Sustento Agrícola y Económico',
          titleTranslit: 'Baréj Aléinu',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `בָּרֵךְ עָלֵינוּ יהוה אֱלֹהֵינוּ אֶת־הַשָּׁנָה הַזֹּאת, וְאֶת־כָּל־מִינֵי תְבוּאָתָהּ לְטוֹבָה, וְתֵן בְּרָכָה (בקיץ: וְתֵן בְּרָכָה / בחורף: וְתֵן טַל וּמָטָר לִבְרָכָה) עַל־פְּנֵי הָאֲדָמָה, וְשַׂבְּעֵנוּ מִטּוּבָךְ, וּבָרֵךְ שְׁנָתֵנוּ כַּשָּׁנִים הַטּוֹבוֹת: בָּרוּךְ אַתָּה יהוה, מְבָרֵךְ הַשָּׁנִים:`,
          transliteration: `Baréj aléinu YHVH Elohéinu et ha-shanáh ha-zot, ve-et kol minéi tevuatáh le-továh, ve-ten berajáh (en invierno: ve-ten tal u-matár li-vrajáh) al penéi ha-adamáh, ve-sab'énu mi-tuváj, u-varéj shnaténu ka-shanim ha-tovót. Barúj Atáh YHVH, mevaréj ha-shanim.`,
          spanish: `Bendice para nosotros, YHVH nuestro Dios, este año y toda variedad de sus frutos para bien; otorga bendición (en invierno: rocío y lluvia para bendición) sobre la superficie de la tierra, colas de Tu bondad y bendice nuestro año como los años prósperos. Bendito eres Tú, YHVH, que bendice los años.`,
        },
        {
          id: 'amida_10_galuyot',
          titleHebrew: 'י. קִבּוּץ גָּלֻיּוֹת',
          titleSpanish: '10. Reunión de los Exiliados de Israel',
          titleTranslit: 'Teká be-Shofár',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `תְּקַע בְּשׁוֹפָר גָּדוֹל לְחֵרוּתֵנוּ, וְשָׂא נֵס לְקַבֵּץ גָּלֻיּוֹתֵינוּ, וְקַבְּצֵנוּ יַחַד מֵאַרְבַּע כַּנְפוֹת הָאָרֶץ לְאַרְצֵנוּ: בָּרוּךְ אַתָּה יהוה, מְקַבֵּץ נִדְחֵי עַמּוֹ יִשְׂרָאֵל:`,
          transliteration: `Teká be-shofár gadól le-jeruténu, ve-sa nes le-kabétz galuyotéinu, ve-kabtzénu yájad me-arbá kanfót ha-áretz le-artzénu. Barúj Atáh YHVH, mekabétz nidjéi amó Yisraél.`,
          spanish: `Haz resonar el gran shofar por nuestra libertad, alza el estandarte para reunir a nuestros exiliados y congréganos a todos desde los cuatro confines del mundo hacia nuestra patria. Bendito eres Tú, YHVH, que reúne a los dispersos de Su pueblo Israel.`,
        },
        {
          id: 'amida_11_din',
          titleHebrew: 'יא. הַשָּׁבַת הַדִּין',
          titleSpanish: '11. Restauración de la Justicia y los Jueces',
          titleTranslit: 'Hashívah Shofeténu',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `הָשִׁיבָה שׁוֹפְטֵינוּ כְּבָרִאשׁוֹנָה, וְיוֹעֲצֵינוּ כְּבַתְּחִלָּה, וְהָסֵר מִמֶּנּוּ יָגוֹן וַאֲנָחָה, וּמְלוֹךְ עָלֵינוּ אַתָּה יהוה לְבַדְּךָ, בְּחֶסֶד וּבְרַחֲמִים, בְּצֶדֶק וּבְמִשְׁפָּט: בָּרוּךְ אַתָּה יהוה, מֶלֶךְ אוֹהֵב צְדָקָה וּמִשְׁפָּט:`,
          transliteration: `Hashívah shofetéinu ke-va-rishonáh, ve-yoatzéinu ke-va-tejiláh, ve-hasér miménu yagón va-anajáh, u-mlój aléinu Atáh YHVH levadjá, be-jésed u-ve-rajamím, be-tzédek u-ve-mishpát. Barúj Atáh YHVH, Mélej ohév tzedakáh u-mishpát.`,
          spanish: `Restituye a nuestros jueces como en los tiempos remotos y a nuestros consejeros como en el principio; aparta de nosotros la pesadumbre y el suspiro, y reina sobre nosotros Tú, YHVH, únicamente, con amor y compasión, con rectitud y justicia. Bendito eres Tú, YHVH, Rey que ama la rectitud y la justicia.`,
        },
        {
          id: 'amida_12_minim',
          titleHebrew: 'יב. בִּרְכַּת הַמִּינִים',
          titleSpanish: '12. Frustración de la Maldad y los Delatores',
          titleTranslit: 'Ve-la-Malshiním',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `לַמִּינִים וְלַמַּלְשִׁינִים אַל תְּהִי תִקְוָה, וְכָל־הַזֵּדִים כְּרֶגַע יֹאבֵדוּ, וְכָל־אוֹיְבֶיךָ וְכָל־שׂוֹנְאֶיךָ מְהֵרָה יִכָּרֵתוּ, וּמַלְכוּת הָרִשְׁעָה מְהֵרָה תְעַקֵּר וּתְשַׁבֵּר, וּתְכַלֵּם וְתַכְנִיעֵם בִּמְהֵרָה בְיָמֵינוּ: בָּרוּךְ אַתָּה יהוה, שׁוֹבֵר אוֹיְבִים וּמַכְנִיעַ זֵדִים:`,
          transliteration: `La-minim ve-la-malshiním al tehí tikváh, ve-jol ha-zedím ke-réga yovadú, ve-jol oyevéja ve-jol sone\'éja meheráh yikarétu, u-maljút ha-rish\'áh meheráh te\'akér u-tshabér, u-tejalém ve-tajni\'ém bi-mheráh ve-yameínu. Barúj Atáh YHVH, shovér oyevím u-majní\'a zedím.`,
          spanish: `Para los herejes y los delatores que no haya esperanza, y que toda maldad deliberada perezca en un instante; y que todos Tus enemigos sean cercenados con prontitud, y desarraigues y quiebres prontamente el imperio de la maldad, humillándolo en nuestros días. Bendito eres Tú, YHVH, que quiebra a los enemigos y subyuga a los arrogantes.`,
        },
        {
          id: 'amida_13_tzadikim',
          titleHebrew: 'יג. עַל הַצַּדִּיקִים',
          titleSpanish: '13. Los Justos y Sabios Piadosos (Tzadikim)',
          titleTranslit: 'Al HaTzadikím',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `עַל הַצַּדִּיקִים וְעַל הַחֲסִידִים, וְעַל שְׁאֵרִית עַמְּךָ בֵּית יִשְׂרָאֵל, וְעַל פְּלֵיטַת בֵּית סוֹפְרֵיהֶם, וְעַל גֵּרֵי הַצֶּדֶק וְעָלֵינוּ, יֶהֱמוּ נָא רַחֲמֶיךָ יהוה אֱלֹהֵינוּ, וְתֵן שָׂכָר טוֹב לְכָל־הַבּוֹטְחִים בְּשִׁמְךָ בֶּאֱמֶת, וְשִׂים חֶלְקֵנוּ עִמָּהֶם, וּלְעוֹלָם לֹא נֵבוֹשׁ כִּי בְשִׁמְךָ בָטָחְנוּ: בָּרוּךְ אַתָּה יהוה, מִשְׁעָן וּמִבְטָח לַצַּדִּיקִים:`,
          transliteration: `Al ha-tzadikím ve-al ha-jasidím, ve-al sheerít amjá béit Yisraél, ve-al pleitát beit sofreihém, ve-al geréi ha-tzédek ve-aléinu, yehemú na rajaméja YHVH Elohéinu, ve-ten sajár tov le-jol ha-botjím be-shimjá be-emét, ve-sim jelkénu imahém, u-le-olám lo nevósh ki ve-shimjá vatájnu. Barúj Atáh YHVH, mish\'án u-mivtáj la-tzadikím.`,
          spanish: `Sobre los justos, sobre los devotos, sobre el remanente de Tu pueblo la casa de Israel, sobre sus sabios ancianos, sobre los justos conversos y sobre nosotros, conmuévanse Tus compasiones, YHVH nuestro Dios; otorga buena recompensa a todos cuantos confían en Tu Nombre con sinceridad, asigna nuestra porción con ellos y jamás nos avergonzaremos pues en Ti hemos confiado. Bendito eres Tú, YHVH, sostén y baluarte para los justos.`,
        },
        {
          id: 'amida_14_yerushalayim',
          titleHebrew: 'יד. בִּנְיַן יְרוּשָׁלָיִם',
          titleSpanish: '14. Reconstrucción de Jerusalén la Santa',
          titleTranslit: 'Tishkón be-Toj Yerushaláyim',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `תִּשְׁכּוֹן בְּתוֹךְ יְרוּשָׁלַיִם עִירְךָ כַּאֲשֶׁר דִּבַּרְתָּ, וְכִסֵּא דָוִד עַבְדְּךָ מְהֵרָה בְתוֹכָהּ תָּכִין, וּבְנֵה אוֹתָהּ בִּנְיַן עוֹלָם בִּמְהֵרָה בְיָמֵינוּ: בָּרוּךְ אַתָּה יהוה, בּוֹנֵה יְרוּשָׁלָיִם:`,
          transliteration: `Tishkón be-toj Yerushaláyim irjá ka-ashér dibárta, ve-jisé Davíd avdejá meheráh ve-tojáh tajín, u-vnéh otáh binyán olám bi-mheráh ve-yameínu. Barúj Atáh YHVH, bonéh Yerushaláyim.`,
          spanish: `Mora en medio de Jerusalén Tu ciudad según prometiste; establece con presteza el trono de David Tu siervo en su seno y reconstrúyela como edificación eterna prontamente en nuestros días. Bendito eres Tú, YHVH, Reconstructor de Jerusalén.`,
        },
        {
          id: 'amida_15_david',
          titleHebrew: 'טו. מַלְכוּת בֵּית דָּוִד',
          titleSpanish: '15. Florecimiento de la Dinastía Mesiánica',
          titleTranslit: 'Et Tsémaj Davíd',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `אֶת־צֶמַח דָּוִד עַבְדְּךָ מְהֵרָה תַצְמִיחַ, וְקַרְנוֹ תָרוּם בִּישׁוּעָתֶךָ, כִּי לִישׁוּעָתְךָ קִוִּינוּ כָּל־הַיּוֹם: בָּרוּךְ אַתָּה יהוה, מַצְמִיחַ קֶרֶן יְשׁוּעָה:`,
          transliteration: `Et tzémaj Davíd avdejá meheráh tatzmíaj, ve-karnó tarúm bi-yshuatéja, ki li-yshuatjá kivínu kol ha-yom. Barúj Atáh YHVH, matzmíaj kéren yeshuáh.`,
          spanish: `Haz florecer prontamente el retoño de David Tu servidor, y eleva su dignidad por medio de Tu salvación, pues en Tu auxilio hemos esperado todo el día. Bendito eres Tú, YHVH, que hace brotar el poder de la salvación.`,
        },
        {
          id: 'amida_16_shema_kolenu',
          titleHebrew: 'טז. שְׁמַע קוֹלֵנוּ',
          titleSpanish: '16. Aceptación de la Súplica (Shemá Kolenu)',
          titleTranslit: 'Shemá Kolénu',
          posture: {
            type: 'standing',
            label: 'De pie',
            instruction: `Momento propicio para insertar en el corazón súplicas personales por salud, sustento y paz familiar antes de concluir.`,
          },
          isSilent: true,
          hebrew: `שְׁמַע קוֹלֵנוּ יהוה אֱלֹהֵינוּ, חוּס וְרַחֵם עָלֵינוּ, וְקַבֵּל בְּרַחֲמִים וּבְרָצוֹן אֶת־תְּפִלָּתֵנוּ, כִּי אֵל שׁוֹמֵעַ תְּפִלּוֹת וְתַחֲנוּנִים אָתָּה, וּמִלְּפָנֶיךָ מַלְכֵּנוּ רֵיקָם אַל תְּשִׁיבֵנוּ, חָנֵּנוּ וַעֲנֵנוּ וּשְׁמַע תְּפִלָּתֵנוּ, כִּי אַתָּה שׁוֹמֵעַ תְּפִלַּת כָּל־פֶּה: בָּרוּךְ אַתָּה יהוה, שׁוֹמֵעַ תְּפִלָּה:`,
          transliteration: `Shemá kolénu YHVH Elohéinu, jus ve-rajém aléinu, ve-kabél be-rajamím u-ve-ratzón et tefilaténu, ki El shoméa tefilót ve-tajanuním Atáh, u-mi-lefanéja Malkénu reikám al teshivénu, jonénu va-anénu u-shmá tefilaténu, ki Atáh shoméa tefilát kol peh. Barúj Atáh YHVH, shoméa tefiláh.`,
          spanish: `Escucha nuestra voz, YHVH nuestro Dios; apiádate y compadécete de nosotros, y acepta con agrado y clemencia nuestra oración; pues Dios que atiende las oraciones y súplicas eres Tú, y de Tu presencia, Rey nuestro, no nos despidas con las manos vacías; apiádate de nosotros, respóndenos y atiende nuestro ruego, pues Tú escuchas la oración de toda boca. Bendito eres Tú, YHVH, que escucha la oración.`,
        },
        {
          id: 'amida_17_avoda',
          titleHebrew: 'יז. עֲבוֹדָה',
          titleSpanish: '17. Restauración del Culto Sagrado (Avodá)',
          titleTranslit: 'Retzéh',
          posture: {
            type: 'bowing',
            label: 'Inclinación de reverencia',
            instruction: `Inclínese al pronunciar Retzéh con anhelo por el retorno de la Presencia Divina a Sión.`,
          },
          isSilent: true,
          hebrew: `רְצֵה יהוה אֱלֹהֵינוּ בְּעַמְּךָ יִשְׂרָאֵל וְלִתְפִלָּתָם שְׁעֵה, וְהָשֵׁב אֶת־הָעֲבוֹדָה לִדְבִיר בֵּיתֶךָ, וְאִשֵּׁי יִשְׂרָאֵל וּתְפִלָּתָם בְּאַהֲבָה תְקַבֵּל בְּרָצוֹן, וּתְהִי לְרָצוֹן תָּמִיד עֲבוֹדַת יִשְׂרָאֵל עַמֶּךָ: וְתֶחֱזֶינָה עֵינֵינוּ בְּשׁוּבְךָ לְצִיּוֹן בְּרַחֲמִים: בָּרוּךְ אַתָּה יהוה, הַמַּחֲזִיר שְׁכִינָתוֹ לְצִיּוֹן:`,
          transliteration: `Retzéh YHVH Elohéinu be-amjá Yisraél ve-li-tfilatám she\'éh, ve-hashév et ha-avodáh li-dvír beitéja, ve-ishéi Yisraél u-tfilatám be-ahaváh tekabél be-ratzón, u-t\'hí le-ratzón tamíd avodát Yisraél améja. Ve-tejezéinah einéinu be-shuvjá le-Tziyón be-rajamím. Barúj Atáh YHVH, ha-majazír Shejinató le-Tziyón.`,
          spanish: `Complácete, YHVH nuestro Dios, en Tu pueblo Israel y atiende su oración; restituye el servicio sagrado al santuario interior de Tu Casa, y acoge con complacencia y afecto las ofrendas y súplicas de Israel, y que sea continuamente agradable el servicio de Tu pueblo Israel. Y contemplen nuestros ojos Tu retorno misericordioso a Sión. Bendito eres Tú, YHVH, que restituye Su Presencia Divina a Sión.`,
        },
        {
          id: 'amida_18_modim',
          titleHebrew: 'יח. הוֹדָאָה',
          titleSpanish: '18. Agradecimiento Universal (Modim)',
          titleTranslit: 'Modím Anájnu Laj',
          posture: {
            type: 'bowing',
            label: 'Inclinación reverente de gratitud',
            instruction: `Inclínese profundamente al decir "Modím anájnu laj", enderezándose erguido al pronunciar el Nombre Divino YHVH.`,
          },
          isSilent: true,
          hebrew: `מוֹדִים אֲנַחְנוּ לָךְ, שֶׁאַתָּה הוּא יהוה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ לְעוֹלָם וָעֶד, צוּרֵנוּ צוּר חַיֵּינוּ, מָגֵן יִשְׁעֵנוּ אַתָּה הוּא לְדֹר וָדֹר. נוֹדֶה לְּךָ וּנְסַפֵּר תְּהִלָּתֶךָ, עַל חַיֵּינוּ הַמְּסוּרִים בְּיָדֶךָ, וְעַל נִשְׁמוֹתֵינוּ הַפְּקוּדוֹת לָךְ, וְעַל נִסֶּיךָ שֶׁבְּכָל־יוֹם עִמָּנוּ, וְעַל נִפְלְאוֹתֶיךָ וְטוֹבוֹתֶיךָ שֶׁבְּכָל־עֵת, עֶרֶב וָבֹקֶר וְצָהֳרָיִם. הַטּוֹב כִּי לֹא כָלוּ רַחֲמֶיךָ, וְהַמְרַחֵם כִּי לֹא תַמּוּ חֲסָדֶיךָ, כִּי מֵעוֹלָם קִוִּינוּ לָךְ: וְעַל כֻּלָּם יִתְבָּרַךְ וְיִתְרוֹמַם שִׁמְךָ מַלְכֵּנוּ תָּמִיד לְעוֹלָם וָעֶד: וְכֹל הַחַיִּים יוֹדוּךָ סֶּלָה, וִיהַלְלוּ אֶת־שִׁמְךָ בֶּאֱמֶת, הָאֵל יְשׁוּעָתֵנוּ וְעֶזְרָתֵנוּ סֶלָה: בָּרוּךְ אַתָּה יהוה, הַטּוֹב שִׁמְךָ וּלְךָ נָאֶה לְהוֹדוֹת:`,
          transliteration: `Modím anájnu laj, she-Atáh hu YHVH Elohéinu ve-Elohéi avotéinu le-olám va-ed, Tzurénu Tzur jayéinu, magén yish\'énu Atáh hu le-dor va-dor. Nodéh lejá u-nesapér tehilatéja, al jayéinu ha-mesurím be-yadéja, ve-al nishmotéinu ha-pekudót laj, ve-al niséja she-be-jol yom imánu, ve-al nifleotéja ve-tovotéja she-be-jol et, érev va-vóker ve-tzohoráyim. Ha-Tov ki lo jálu rajaméja, ve-ha-Merajém ki lo támu jasadéja, ki me-olám kivínu laj. Ve-al kulám yitbaráj ve-yitromám shimjá Malkénu tamíd le-olám va-ed. Ve-jol ha-jayím yodúja séla, vi-yhalelú et shimjá be-emét, ha-El yeshuaténu ve-ezraténu séla. Barúj Atáh YHVH, ha-Tov shimjá u-lejá naéh lehodót.`,
          spanish: `A Ti Te agradecemos, pues Tú eres YHVH nuestro Dios y Dios de nuestros antepasados por siempre jamás; Roca nuestra, Roca de nuestras vidas, Escudo de nuestra salvación eres Tú de generación en generación. Te daremos gracias y proclamaremos Tu alabanza por nuestras vidas que están entregadas en Tu mano, por nuestras almas que están confiadas a Ti, por Tus prodigios que a diario nos acompañan y por Tus maravillas y mercedes en todo momento: tarde, mañana y mediodía. ¡Oh Bondadoso, cuyas misericordias jamás concluyen; oh Misericordioso, cuyas mercedes nunca se agotan, pues desde siempre en Ti hemos depositado nuestra esperanza! Y por todo ello sea bendito y ensalzado Tu Nombre, Rey nuestro, de continuo y por siempre jamás. Y todos los seres vivientes Te agradecerán y alabarán Tu Santo Nombre con sinceridad; el Dios de nuestra salvación y nuestro auxilio por siempre jamás. Bendito eres Tú, YHVH, el Bondadoso es Tu Nombre y a Ti es grato dar gracias.`,
        },
        {
          id: 'amida_19_shalom',
          titleHebrew: 'יט. שִׂים שָׁלוֹם',
          titleSpanish: '19. Bendición de la Paz Universal (Sim Shalom)',
          titleTranslit: 'Sim Shalóm',
          posture: { type: 'standing', label: 'De pie' },
          isSilent: true,
          hebrew: `שִׂים שָׁלוֹם טוֹבָה וּבְרָכָה, חַיִּים, חֵן וָחֶסֶד וְרַחֲמִים, עָלֵינוּ וְעַל כָּל־יִשְׂרָאֵל עַמֶּךָ. בָּרְכֵנוּ אָבִינוּ, כֻּלָּנוּ כְּאֶחָד בְּאוֹר פָּנֶיךָ, כִּי בְאוֹר פָּנֶיךָ נָתַתָּ לָּנוּ יהוה אֱלֹהֵינוּ, תּוֹרַת חַיִּים וְאַהֲבַת חֶסֶד, וּצְדָקָה וּבְרָכָה וְרַחֲמִים וְחַיִּים וְשָׁלוֹם, וְטוֹב בְּעֵינֶיךָ לְבָרֵךְ אֶת־עַמְּךָ יִשְׂרָאֵל בְּכָל־עֵת וּבְכָל־שָׁעָה בִּשְׁלוֹמֶךָ: בָּרוּךְ אַתָּה יהוה, הַמְבָרֵךְ אֶת־עַמּוֹ יִשְׂרָאֵל בַּשָּׁלוֹם:`,
          transliteration: `Sim shalóm továh u-vrajáh, jayím, jen va-jésed ve-rajamím, aléinu ve-al kol Yisraél améja. Barejénu Avínu kulánu ke-ejád be-or panéja, ki ve-or panéja natáta lánu YHVH Elohéinu, Torát jayím ve-ahavát jésed, u-tzedakáh u-vrajáh ve-rajamím ve-jayím ve-shalóm, ve-tov be-eynéja levaréj et amjá Yisraél be-jol et u-ve-jol shaáh bi-shloméja. Barúj Atáh YHVH, ha-mevaréj et amó Yisraél ba-shalóm.`,
          spanish: `Otorga paz, bienestar y bendición, vida, gracia, benevolencia y misericordia sobre nosotros y sobre todo Tu pueblo Israel. Bendícenos a todos como uno solo, Padre nuestro, con la luz de Tu rostro; pues con la luz de Tu rostro nos has otorgado, YHVH nuestro Dios, Torá de vida y amor entrañable, justicia, bendición, misericordia, vida y paz; y que sea grato ante Tus ojos bendecir a Tu pueblo Israel en todo instante y a toda hora con Tu bendita paz. Bendito eres Tú, YHVH, que bendice a Su pueblo Israel con la paz.`,
        },
        {
          id: 'amida_cierre',
          titleHebrew: 'סִיּוּם הָעֲמִידָה: עֹשֶׂה שָׁלוֹם',
          titleSpanish: 'Meditación Conclusiva y Despedida (Oseh Shalom)',
          titleTranslit: 'Elohái Netzór / Oséh Shalóm',
          posture: {
            type: 'bowing',
            label: 'Tres pasos hacia atrás',
            instruction: `Dé 3 pasos reverentes hacia atrás. Inclínese a la izquierda al decir "Oséh shalóm", al frente a la derecha en "Hu yaaséh shalóm", y al centro al decir "ve-al kol amó Yisraél".`,
          },
          isSilent: true,
          hebrew: `אֱלֹהַי, נְצוֹר לְשׁוֹנִי מֵרָע, וּשְׂפָתַי מִדַּבֵּר מִרְמָה, וְלִמְקַלְלַי נַפְשִׁי תִדֹּם, וְנַפְשִׁי כֶּעָפָר לַכֹּל תִּהְיֶה. פְּתַח לִבִּי בְּתוֹרָתֶךָ, וּבְמִצְוֹתֶיךָ תִּרְדּוֹף נַפְשִׁי:
יִהְיוּ לְרָצוֹן אִמְרֵי־פִי וְהֶגְיוֹן לִבִּי לְפָנֶיךָ, יהוה צוּרִי וְגוֹאֲלִי:
עוֹשֶׂה שָׁלוֹם בִּמְרוֹמָיו, הוּא בְּרַחֲמָיו יַעֲשֶׂה שָׁלוֹם עָלֵינוּ, וְעַל כָּל־עַמּוֹ יִשְׂרָאֵל, וְאִמְרוּ אָמֵן:`,
          transliteration: `Elohái, netzór leshoní me-ra, u-sfatái mi-dabér mirmáh, ve-limkalelái nafshí tidóm, ve-nafshí ke-afár la-kol tihyéh. Petáj libí be-Toratéja, u-ve-mitzvotéja tirdóf nafshí.
Yihyú le-ratzón imréi fi ve-hegyón libí lefanéja, YHVH Tzurí ve-Goalí.
Oséh shalóm bi-mromáv, Hu be-rajamáv yaaséh shalóm aléinu, ve-al kol amó Yisraél, ve-imrú Amén.`,
          spanish: `Dios mío, preserva mi lengua del mal y mis labios de proferir engaño; y que para quienes me vituperen mi alma guarde silencio, y que mi alma sea como el polvo ante todos. Abre mi corazón a Tu Torá, y en pos de Tus mandamientos correrá mi alma.
Sean gratas las expresiones de mi boca y la meditación de mi corazón ante Ti, YHVH mi Roca y mi Redentor (Salmo 19:15).
Quien hace la paz en Sus alturas celestiales, que Él con Su inmensa compasión extienda la paz sobre nosotros y sobre todo Su pueblo Israel, y decid: Amén.`,
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 7: SÉDER TAJANÚN Y SALMO 25 (100% COMPLETO)
    // ------------------------------------------------------------------------
    {
      id: 'tajanun',
      order: 7,
      titleHebrew: 'סֵדֶר תַּחֲנוּן וּנְפִילַת אַפַּיִם',
      titleSpanish: 'Súplicas Penitenciales y Caída de Rostro (Tajanún)',
      titleTranslit: 'Séder Tajanún u-Nfilát Apáyim',
      description: `Confesión de faltas (Vidui Ashamnu), súplica de misericordia ante el Trono Celestial, los 13 Atributos y el Salmo 25 completo.`,
      segments: [
        {
          id: 'vidui_ashamnu',
          titleHebrew: 'וִדּוּי: אָשַׁמְנוּ',
          titleSpanish: 'Confesión Comunitaria de las Faltas (Ashamnu)',
          titleTranslit: 'Vidúi Ashámnu',
          posture: {
            type: 'chest_beat',
            label: 'De pie, golpeando el pecho',
            instruction: `Permanezca de pie inclinado y golpee suavemente el pecho al recitar cada una de las 24 transgresiones alfabéticas.`,
          },
          hebrew: `אָנָּא יהוה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ, תָּבֹא לְפָנֶיךָ תְּפִלָּתֵנוּ, וְאַל תִּתְעַלַּם מַלְכֵּנוּ מִתְּחִנָּתֵנוּ, שֶׁאֵין אֲנַחְנוּ עַזֵּי פָנִים וּקְשֵׁי עֹרֶף לוֹמַר לְפָנֶיךָ יהוה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ צַדִּיקִים אֲנַחְנוּ וְלֹא חָטָאנוּ, אֲבָל חָטָאנוּ, עָוִינוּ, פָּשַׁעְנוּ, אֲנַחְנוּ וַאֲבוֹתֵינוּ וְאַנְשֵׁי בֵיתֵנוּ:
אָשַׁמְנוּ, בָּגַדְנוּ, גָּזַלְנוּ, דִּבַּרְנוּ דֹפִי:
הֶעֱוִינוּ, וְהִרְשַׁעְנוּ, זַדְנוּ, חָמַסְנוּ, טָפַלְנוּ שֶׁקֶר:
יָעַצְנוּ רָע, כִּזַּבְנוּ, לַצְנוּ, מָרַדְנוּ, נִאַצְנוּ, סָרַרְנוּ, עָוִינוּ, פָּשַׁעְנוּ, צָרַרְנוּ, קִשִּׁינוּ עֹרֶף:
רָשַׁעְנוּ, שִׁחַתְנוּ, תִּעַבְנוּ, תָּעִינוּ, תִּעְתָּעְנוּ:
סַרְנוּ מִמִּצְוֹתֶיךָ וּמִמִּשְׁפָּטֶיךָ הַטּוֹבִים וְלֹא שָׁוָה לָנוּ: וְאַתָּה צַדִּיק עַל כָּל־הַבָּא עָלֵינוּ, כִּי אֱמֶת עָשִׂיתָ וַאֲנַחְנוּ הִרְשָׁעְנוּ:`,
          transliteration: `Aná YHVH Elohéinu ve-Elohéi avotéinu, tavó lefanéja tefilaténu, ve-al titalám Malkénu mi-tejinaténu, she-éin anájnu azéi faním u-kshéi óref lomár lefanéja YHVH Elohéinu ve-Elohéi avotéinu tzadikím anájnu ve-lo jatánu, avál jatánu, avínu, pashánu, anájnu va-avotéinu ve-anshéi veiténu:
Ashámnu, bagádnu, gazálnu, dibárnu dófi.
Heevínu, ve-hirshánu, zádnu, jamásnu, tafálnu shéker.
Yaátznu ra, kizávnu, látznu, marádnu, niátznu, sarárnu, avínu, pashánu, tzarárnu, kishínu óref.
Rashánu, shijátnu, tiávnu, taínu, titánu.
Sárnu mi-mitzvotéja u-mi-mishpatéja ha-tovím ve-lo shávah lánu. Ve-Atáh tzadík al kol ha-ba aléinu, ki emét asíta va-anájnu hirshánu.`,
          spanish: `Por favor, YHVH nuestro Dios y Dios de nuestros antepasados, llegue ante Tu presencia nuestra oración y no Te desentiendas, Rey nuestro, de nuestra súplica; pues no somos tan insolentes ni obstinados como para decir ante Ti: "Somos justos y no hemos pecado", pues ciertamente hemos pecado, delinquido y transgredido, tanto nosotros como nuestros antepasados y los miembros de nuestras familias:
Hemos incurrido en culpa, hemos traicionado, hemos despojado, hemos proferido calumnias;
hemos actuado con iniquidad, hemos delinquido, hemos pecado con soberbia, hemos violentado, hemos tramado falsedades;
hemos dado malos consejos, hemos mentido, nos hemos burlado, nos hemos rebelado, hemos provocado la ira divina, nos hemos apartado del bien, hemos pervertido el camino, hemos transgredido con conocimiento, hemos oprimido, hemos endurecido nuestra cerviz;
hemos sido impíos, nos hemos corrompido, hemos actuado abominablemente, nos hemos extraviado y hemos desviado a otros del buen sendero.
Nos apartamos de Tus preceptos y de Tus juicios benévolos, y ningún provecho obtuvimos. Empero, Tú eres justo en todo cuanto sobre nosotros ha acontecido, pues con fidelidad y justicia procediste, mas nosotros hemos actuado con maldad.`,
        },
        {
          id: 'shelosh_esreh_midot',
          titleHebrew: 'י״ג מִדּוֹת שֶׁל רַחֲמִים',
          titleSpanish: 'Los Trece Atributos Divinos de Misericordia',
          titleTranslit: 'Shelósh Esréh Midót',
          posture: {
            type: 'bowing',
            label: 'Inclinación de súplica',
            instruction: `Inclínese al recitar el Nombre Divino YHVH con unción y confianza en el perdón celestial.`,
          },
          requiresMinian: true,
          hebrew: `אֵל מֶלֶךְ יוֹשֵׁב עַל כִּסֵּא רַחֲמִים, וּמִתְנַהֵג בַּחֲסִידוּת, מוֹחֵל עֲוֹנוֹת עַמּוֹ, מַעֲבִיר רִאשׁוֹן רִאשׁוֹן, מַרְבֶּה מְחִילָה לַחַטָּאִים וּסְלִיחָה לַפּוֹשְׁעִים, עוֹשֶׂה צְדָקוֹת עִם כָּל־בָּשָׂר וָרוּחַ, לֹא כְרָעָתָם לָהֶם גּוֹמֵל:
אֵל הוֹרֵתָנוּ לוֹמַר שְׁלֹשׁ עֶשְׂרֵה, זְכָר־לָנוּ הַיּוֹם בְּרִית שְׁלֹשׁ עֶשְׂרֵה, כְּמוֹ שֶׁהוֹדַעְתָּ לֶעָנָו מִקֶּדֶם, כְּמוֹ שֶׁכָּתוּב: וַיֵּרֶד יהוה בֶּעָנָן וַיִּתְיַצֵּב עִמּוֹ שָׁם, וַיִּקְרָא בְשֵׁם יהוה:
וַיַּעֲבֹר יהוה עַל־פָּנָיו וַיִּקְרָא:
יהוה | יהוה | אֵל רַחוּם וְחַנּוּן, אֶרֶךְ אַפַּיִם, וְרַב־חֶסֶד וֶאֱמֶת:
נֹצֵר חֶסֶד לָאֲלָפִים, נֹשֵׂא עָוֹן וָפֶשַׁע וְחַטָּאָה, וְנַקֵּה:`,
          transliteration: `El Mélej yoshév al kisé rajamím, u-mitnahég ba-jasidút, mojél avonót amó, maavír rishón rishón, marbéh mejiláh la-jataím u-slijáh la-posheím, oséh tzedakót im kol basár va-rúaj, lo je-raatám lahém gomél.
El horetánu lomár shelósh esréh, zjor lánu ha-yom berít shelósh esréh, kemó she-hodáta le-anáv mi-kédem, kemó she-katúv: Va-yéred YHVH be-anán va-yityatzév imó sham, va-yikrá ve-shém YHVH.
Va-yaavór YHVH al panáv va-yikrá:
YHVH | YHVH | El rajúm ve-janún, érej apáyim, ve-rav jésed ve-emét.
Notzér jésed la-alafím, nosé avón va-fésha ve-jataáh, ve-nakéh.`,
          spanish: `Dios, Rey entronizado sobre el solio de misericordia, que se conduce con generosidad benévola, que perdona las iniquidades de Su pueblo disipando una a una las primeras faltas; que abunda en perdón para los pecadores y clemencia para los transgresores; que obra rectitud con toda criatura y espíritu y no les retribuye según sus malas acciones.
Oh Dios, nos instruiste a recitar los Trece Atributos: evoca para nosotros hoy el pacto de los Trece Atributos tal como revelaste al más humilde de los hombres antaño, según está escrito: "Y descendió YHVH en la nube y se apostó allí con él, y proclamó el Nombre de YHVH. Y pasó YHVH ante su faz y proclamó":
¡YHVH, YHVH! Dios compasivo y clemente, paciente para la ira y abundante en benevolencia y verdad; que preserva Su bondad para millares de generaciones, que perdona la iniquidad, la rebelión y el pecado, y absuelve (Éxodo 34:5-7).`,
          moroccanNote: `Los Trece Atributos solo se recitan con presencia de Minián. El judío que reza en solitario debe leerlos con el acento y la entonación de quien lee versículos de la Torá (Te\'amim).`,
        },
        {
          id: 'salmo_25_nefilat_apayim',
          titleHebrew: 'נְפִילַת אַפַּיִם (תְּהִלִּים כ״ה שָׁלֵם)',
          titleSpanish: 'Salmo 25 Íntegro · Súplica de Amparo Divino',
          titleTranslit: 'Nefilát Apáyim (Mizmór le-Davíd)',
          posture: {
            type: 'sitting',
            label: 'Sentado / Rostro apoyado',
            instruction: `Inclínese y apoye la frente sobre el brazo izquierdo (o derecho si lleva tefilín) expresando humillación ante el Creador.`,
          },
          hebrew: `לְדָוִד, אֵלֶיךָ יהוה נַפְשִׁי אֶשָּׂא:
אֱלֹהַי, בְּךָ בָטַחְתִּי אַל־אֵבוֹשָׁה, אַל־יַעַלְצוּ אֹיְבַי לִי:
גַּם כָּל־קֹוֶיךָ לֹא יֵבֹשׁוּ, יֵבֹשׁוּ הַבּוֹגְדִים רֵיקָם:
דְּרָכֶיךָ יהוה הוֹדִיעֵנִי, אֹרְחוֹתֶיךָ לַמְּדֵנִי:
הַדְרִיכֵנִי בַאֲמִתֶּךָ וְלַמְּדֵנִי, כִּי־אַתָּה אֱלֹהֵי יִשְׁעִי, אוֹתְךָ קִוִּיתִי כָּל־הַיּוֹם:
זְכֹר־רַחֲמֶיךָ יהוה וַחֲסָדֶיךָ, כִּי מֵעוֹלָם הֵמָּה:
חַטֹּאות נְעוּרַי וּפְשָׁעַי אַל־תִּזְכֹּר, כְּחַסְדְּךָ זְכָר־לִי־אַתָּה, לְמַעַן טוּבְךָ יהוה:
טוֹב־וְיָשָׁר יהוה, עַל־כֵּן יוֹרֶה חַטָּאִים בַּדָּרֶךְ:
יַדְרֵךְ עֲנָוִים בַּמִּשְׁפָּט, וִילַמֵּד עֲנָוִים דַּרְכּוֹ:
כָּל־אָרְחוֹת יהוה חֶסֶד וֶאֱמֶת, לְנֹצְרֵי בְרִיתוֹ וְעֵדֹתָיו:
לְמַעַן־שִׁמְךָ יהוה, וְסָלַחְתָּ לַעֲוֹנִי כִּי רַב־הוּא:
מִי־זֶה הָאִישׁ יְרֵא יהוה, יוֹרֶנּוּ בְּדֶרֶךְ יִבְחָר:
נַפְשׁוֹ בְּטוֹב תָּלִין, וְזַרְעוֹ יִירַשׁ אָרֶץ:
סוֹד יהוה לִירֵאָיו, וּבְרִיתוֹ לְהוֹדִיעָם:
עֵינַי תָּמִיד אֶל־יהוה, כִּי הוּא־יוֹצִיא מֵרֶשֶׁת רַגְלָי:
פְּנֵה־אֵלַי וְחָנֵּנִי, כִּי־יָחִיד וְעָנִי אָנִי:
צָרוֹת לְבָבִי הִרְחִיבוּ, מִמְּצוּקוֹתַי הוֹצִיאֵנִי:
רְאֵה עָנְיִי וַעֲמָלִי, וְשָׂא לְכָל־חַטֹּאותָי:
רְאֵה־אֹיְבַי כִּי־רָבּוּ, וְשִׂנְאַת חָמָס שְׂנֵאוּנִי:
שָׁמְרָה נַפְשִׁי וְהַצִּילֵנִי, אַל־אֵבוֹשׁ כִּי־חָסִיתִי בָךְ:
תֹּם־וָיֹשֶׁר יִצְּרוּנִי, כִּי קִוִּיתִיךָ:
פְּדֵה אֱלֹהִים אֶת־יִשְׂרָאֵל, מִכֹּל צָרוֹתָיו:`,
          transliteration: `Le-Davíd:
[Alef] Eléja YHVH nafshí esá.
[Bet] Elohái, bejá vatájti al evóshah, al yaalzú oyvái li.
[Guimel] Gam kol kovéja lo yevóshu, yevóshu ha-bogdím reikám.
[Dalet] Drajéja YHVH hodiéni, orjotéja lamdéni.
[He] Hadrijéni va-amitéja ve-lamdéni, ki Atáh Elohéi yish'í, otjá kivíti kol ha-yom.
[Zayin] Zjór rajaméja YHVH va-jasadéja, ki me-olám hémmah.
[Jet] Jatót neurái u-fsha'ái al tizkór, ke-jasdejá zjór li Atáh, lemáan tuvjá YHVH.
[Tet] Tov ve-yashár YHVH, al ken yoréh jataím ba-dárej.
[Yud] Yadréj anavím ba-mishpát, vi-ylaméd anavím darkó.
[Kaf] Kol orjót YHVH jésed ve-emét, le-notzréi veritó ve-edotáv.
[Lamed] Lemáan shimjá YHVH, ve-salájta la-avoní ki rav hu.
[Mem] Mi zeh ha-ish yeré YHVH, yorénu be-dérej yivjár.
[Nun] Nafshó be-tov talín, ve-zar'ó yirásh áretz.
[Samej] Sod YHVH li-yereáv, u-vritó lehodí'am.
[Ayin] Einái tamíd el YHVH, ki Hu yotzí me-réshet raglái.
[Pe] Pnéh elái ve-jonéni, ki yajíd ve-aní áni.
[Tzadi] Tzarót levaví hirjívu, mi-metzukotái hotzi'éni.
[Resh] Re'éh onyí va-amalí, ve-sa le-jol jatotái.
[Resh] Re'éh oyvái ki rábu, ve-sin'át jamás sene'úni.
[Shin] Shamráh nafshí ve-hatziléni, al evósh ki jasíti vaj.
[Tav] Tom va-yósher yitzrúni, ki kivitíja.
Pedéh Elohím et Yisraél, mi-kól tzarotáv.`,
          spanish: `De David:
A Ti, YHVH, elevaré mi alma.
Dios mío, en Ti he confiado; no quede yo avergonzado, ni celebren mis enemigos mi ruina.
Ciertamente ninguno de cuantos en Ti aguardan quedará confuso; confórmense con vergüenza los transgresores sin causa.
Muéstrame, YHVH, Tus senderos; enséñame Tus sendas.
Guíame en Tu verdad e instrúyeme, pues Tú eres el Dios de mi salvación; en Ti he esperado a lo largo de todo el día.
Acuérdate de Tus misericordias, YHVH, y de Tus benevolencias, que existen desde la eternidad.
De los deslices de mi mocedad y de mis transgresiones no Te acuerdes; conforme a Tu generosa bondad acuérdate de mí, por causa de Tu beneplácito, YHVH.
Bueno y recto es YHVH, por eso instruye a los pecadores en el buen sendero.
Encamina a los humildes con justicia y enseña a los mansos Su camino.
Todas las sendas de YHVH son benevolencia y verdad para con quienes custodian Su pacto y Sus testimonios.
Por amor de Tu Nombre, YHVH, perdona mi iniquidad, que inmensa es.
¿Quién es aquel varón que teme a YHVH? Él le señalará el camino que ha de escoger.
Su alma reposará en la prosperidad, y su descendencia heredará la tierra.
El secreto íntimo de YHVH es para los que Le veneran, y Su pacto les es revelado.
Mis ojos miran de continuo hacia YHVH, pues Él rescatará de la trampa mis pies.
Vuelve Tu faz hacia mí y compadécete de mí, pues desamparado y desvalido soy.
Las tribulaciones de mi corazón se han ensanchado; de mis angustias sácame.
Mira mi abatimiento y mi fatigoso pesar, y perdona todas mis faltas.
Mira cuántos son mis adversarios, y con qué odio despiadado me aborrecen.
Guarda mi vida y rescátame; no sea yo avergonzado, pues en Ti me he refugiado.
Que la integridad y la rectitud me custodien, pues en Ti he depositado mi esperanza.
¡Redime, oh Dios, a Israel de todas sus aflicciones! (Salmo 25).`,
        },
        {
          id: 'vaanajnu_lo_neda',
          titleHebrew: 'וַאֲנַחְנוּ לֹא נֵדַע',
          titleSpanish: 'Súplica Final de Desamparo y Ruego Divino',
          titleTranslit: 'Va-Anájnu Lo Nedá',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `וַאֲנַחְנוּ לֹא נֵדַע מַה־נַּעֲשֶׂה, כִּי עָלֶיךָ עֵינֵינוּ:
זְכֹר־רַחֲמֶיךָ יהוה וַחֲסָדֶיךָ, כִּי מֵעוֹלָם הֵמָּה:
יְהִי חַסְדְּךָ יהוה עָלֵינוּ, כַּאֲשֶׁר יִחַלְנוּ לָךְ:
אַל־תִּזְכָּר־לָנוּ עֲוֹנֹת רִאשֹׁנִים, מַהֵר יְקַדְּמוּנוּ רַחֲמֶיךָ כִּי דַלּוֹנוּ מְאֹד:
עָזְרֵנוּ אֱלֹהֵי יִשְׁעֵנוּ עַל־דְּבַר כְּבוֹד־שְׁמֶךָ, וְהַצִּילֵנוּ וְכַפֵּר עַל־חַטֹּאתֵינוּ לְמַעַן שְׁמֶךָ:`,
          transliteration: `Va-anájnu lo nedá mah naaséh, ki aléja einéinu.
Zjór rajaméja YHVH va-jasadéja, ki me-olám hémmah.
Yehí jasdejá YHVH aléinu, ka-ashér yijálnu laj.
Al tizkór lánu avonót rishoním, mahér yekadmúnu rajaméja ki dalónu meód.
Ozrénu Elohéi yish'énu al dvar kevód sheméja, ve-hatzilénu ve-japér al jatotéinu lemáan sheméja.`,
          spanish: `Y nosotros no sabemos qué hacer, pues solo hacia Ti están elevados nuestros ojos.
Acuérdate de Tus misericordias, YHVH, y de Tus bondades, que desde la eternidad existen.
Sea Tu benevolencia, YHVH, sobre nosotros, tal como en Ti hemos esperado.
No recuerdes contra nosotros las faltas de antaño; que prontamente nos alcancen Tus compasiones, pues hemos caído muy bajo.
Ayúdanos, Dios de nuestra salvación, por la gloria de Tu Santo Nombre; sálvanos y expía nuestros pecados en aras de Tu propio Nombre (2 Crónicas 20:12, Salmo 79:8-9).`,
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 8: CONCLUSIÓN DE SHAJARIT (100% COMPLETO)
    // ------------------------------------------------------------------------
    {
      id: 'conclusion_shajarit',
      order: 8,
      titleHebrew: 'סִיּוּם הַתְּפִלָּה וְעָלֵינוּ לְשַׁבֵּחַ',
      titleSpanish: 'Conclusión de Shajarit: Uvá LeTsiyón y Alénu LeShabéaj',
      titleTranslit: 'Siyúm HaTefiláh ve-Alénu LeShabéaj',
      description: `La Redención mesiánica con la Kedushá de-Sidrá completa en hebreo y arameo, el Salmo del Día y la magna proclamación de la Soberanía Monoteísta.`,
      segments: [
        {
          id: 'uva_letzion',
          titleHebrew: 'וּבָא לְצִיּוֹן גּוֹאֵל (קְדֻשָּׁה דְסִדְרָא)',
          titleSpanish: 'Y vendrá el Redentor a Sión y la Kedushá de-Sidrá Íntegra',
          titleTranslit: 'Uvá LeTzión Goél (Kedushá de-Sidrá)',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `וּבָא לְצִיּוֹן גּוֹאֵל, וּלְשָׁבֵי פֶשַׁע בְּיַעֲקֹב, נְאֻם־יהוה: וַאֲנִי זֹאת בְּרִיתִי אוֹתָם, אָמַר יהוה: רוּחִי אֲשֶׁר עָלֶיךָ, וּדְבָרַי אֲשֶׁר־שַׂמְתִּי בְּפִיךָ, לֹא־יָמוּשׁוּ מִפִּיךָ וּמִפִּי זַרְעֲךָ וּמִפִּי זֶרַע זַרְעֲךָ, אָמַר יהוה, מֵעַתָּה וְעַד־עוֹלָם:
וְאַתָּה קָדוֹשׁ, יוֹשֵׁב תְּהִלּוֹת יִשְׂרָאֵל: וְקָרָא זֶה אֶל־זֶה וְאָמַר:
קָדוֹשׁ, קָדוֹשׁ, קָדוֹשׁ יהוה צְבָאוֹת, מְלֹא כָל־הָאָרֶץ כְּבוֹדוֹ:
(תרגום ארמי): וּמְקַבְּלִין דֵּין מִן דֵּין וְאָמְרִין: קַדִּישׁ בִּשְׁמֵי מְרוֹמָא עִלָּאָה בֵּית שְׁכִינְתֵיהּ, קַדִּישׁ עַל אַרְעָא עוֹבַד גְּבוּרְתֵיהּ, קַדִּישׁ לְעָלַם וּלְעָלְמֵי עָלְמַיָּא, יהוה צְבָאוֹת, מַלְיָא כָל־אַרְעָא זִיו יְקָרֵיהּ:
וַתִּשָּׂאֵנִי רוּחַ, וָאֶשְׁמַע אַחֲרַי קוֹל רַעַשׁ גָּדוֹל: בָּרוּךְ כְּבוֹד־יהוה מִמְּקוֹמוֹ:
(תרגום ארמי): וּנְטָלַת נִי רוּחָא, וּשְׁמָעִית בַּתְרַי קָל זִיעַ סַגִּיא דִּמְשַׁבְּחִין וְאָמְרִין: בְּרִיךְ יְקָרָא דַיהוה מֵאֲתַר בֵּית שְׁכִינְתֵיהּ:
יהוה יִמְלֹךְ לְעֹלָם וָעֶד:
(תרגום ארמי): יהוה מַלְכוּתֵיהּ קָאֵם לְעָלַם וּלְעָלְמֵי עָלְמַיָּא:
יהוה אֱלֹהֵי אַבְרָהָם יִצְחָק וְיִשְׂרָאֵל אֲבוֹתֵינוּ, שָׁמְרָה־זֹּאת לְעוֹלָם לְיֵצֶר מַחְשְׁבוֹת לְבַב עַמֶּךָ, וְהָכֵן לְבָבָם אֵלֶיךָ:
וְהוּא רַחוּם יְכַפֵּר עָוֹן וְלֹא־יַשְׁחִית, וְהִרְבָּה לְהָשִׁיב אַפּוֹ, וְלֹא־יָעִיר כָּל־חֲמָתוֹ:
כִּי־אַתָּה אֲדֹנָי טוֹב וְסַלָּח, וְרַב־חֶסֶד לְכָל־קֹרְאֶיךָ:
צִדְקָתְךָ צֶדֶק לְעוֹלָם, וְתוֹרָתְךָ אֱמֶת:
בָּרוּךְ אֲדֹנָי יוֹם יוֹם, יַעֲמָס־לָנוּ הָאֵל יְשׁוּעָתֵנוּ סֶלָה:
יהוה צְבָאוֹת עִמָּנוּ, מִשְׂגָּב לָנוּ אֱלֹהֵי יַעֲקֹב סֶלָה:
יהוה צְבָאוֹת, אַשְׁרֵי אָדָם בֹּטֵחַ בָּךְ:
יהוה הוֹשִׁיעָה, הַמֶּלֶךְ יַעֲנֵנוּ בְיוֹם־קָרְאֵנוּ:`,
          transliteration: `U-vá le-Tziyón goél, u-le-shavéi fésha be-Yaakóv, neúm YHVH. Va-aní zot berití otám, amár YHVH: rují ashér aléja, u-dvarái ashér sámti be-fíja, lo yamúshu mi-píja u-mi-pi zar'ajá u-mi-pi zéra zar'ajá, amár YHVH, me-atáh ve-ad olám.
Ve-Atáh kadósh, yoshév tehilót Yisraél. Ve-kará zeh el zeh ve-amár:
Kadósh, Kadósh, Kadósh YHVH Tzevaót, meló jol ha-áretz kevodó.
(Targum): U-mkabelín den min den ve-amrín: Kadísh bi-shméi meromá ilá'ah beit shejintéih, Kadísh al ar'á ovád gevurtéih, Kadísh le-alám u-l'alméi almayá, YHVH Tzevaót, malyá jol ar'á ziv yekaréih.
Va-tisá'eni rúaj, va-eshmá ajarái kol ráash gadól: Barúj kevód YHVH mi-mkomó.
(Targum): U-ntelát ni rujá, u-shma'ít batrái kal zí'a sagí di-mshabjín ve-amrín: Beríj yekará da-YHVH me-atár beit shejintéih.
YHVH yimlój le-olám va-ed.
(Targum): YHVH maljutéih kayém le-alám u-l'alméi almayá.
YHVH Elohéi Avrahám Yitzják ve-Yisraél avotéinu, shamráh zot le-olám le-yétzer majshevót leváv améja, ve-hajén levavám eléja.
Ve-Hu rajúm yejapér avón ve-lo yashjít, ve-hirbáh le-hashív apó, ve-lo yaír kol jamató.
Ki Atáh Adonái tov ve-saláj, ve-rav jésed le-jol kor'éja.
Tzidkatjá tzéder le-olám, ve-Toratjá emét.
Barúj Adonái yom yom, yaamós lánu ha-El yeshuaténu séla.
YHVH Tzevaót imánu, misgáv lánu Elohéi Yaakóv séla.
YHVH Tzevaót, ashréi adám botéaj baj.
YHVH hoshí'ah, ha-Mélej yaanénu ve-yom kor'énu.`,
          spanish: `Y vendrá el Redentor a Sión y para los que abandonan la transgresión en Jacob, oráculo de YHVH. Y en cuanto a Mí, este es Mi pacto con ellos, dijo YHVH: Mi espíritu que reposa sobre ti y Mis palabras que he colocado en tu boca no se apartarán de tu boca, ni de la boca de tu descendencia, ni de la boca de la descendencia de tu descendencia, ha dicho YHVH, desde ahora y para siempre jamás (Isaías 59:20-21).
Y Tú eres Santo, entronizado entre las alabanzas de Israel. Y clamaba el uno hacia el otro diciendo:
Santo, Santo, Santo es YHVH de los ejércitos; la tierra entera está colmada de Su gloria.
(Traducción al arameo): Y reciben permiso los unos de los otros y proclaman: Santo en las alturas supremas morada de Su Presencia, Santo sobre la tierra obra de Su soberano poder, Santo por los siglos de los siglos es YHVH de los ejércitos; colmada está la tierra del resplandor de Su gloria.
Y un viento me elevó y escuché detrás de mí una voz de gran conmoción: ¡Bendita sea la gloria de YHVH desde Su Morada!
(Traducción al arameo): Y me alzó un espíritu, y oí tras de mí una potente voz de alabanza que decía: Bendita sea la majestad de YHVH desde el sitio de Su Presencia Divina.
¡YHVH reinará por siempre jamás!
(Traducción al arameo): El reinado de YHVH subsiste por siempre y por las eternidades de las eternidades.
YHVH Dios de Abraham, Isaac e Israel nuestros padres, preserva esto para siempre como inclinación de los pensamientos del corazón de Tu pueblo, y afirma sus corazones hacia Ti.
Y Él, compasivo, perdona la falta y no destruye; muchas veces aplaca Su enojo y no desata todo Su furor.
Pues Tú, Señor mío, eres bondadoso y perdonador, y abundante en compasión con cuantos Te invocan.
Tu rectitud es justicia eterna, y Tu Torá es la verdad absoluta.
Bendito sea el Señor cada día; Dios nos colma con Su salvación.
YHVH de los ejércitos está con nosotros; baluarte nuestro es el Dios de Jacob.
YHVH de los ejércitos, dichoso el hombre que en Ti confía.
YHVH, ¡salva!; que el Rey soberano nos responda en el día en que Le llamemos.`,
          moroccanNote: `La recitación de la Kedushá de-Sidrá en arameo posee una fuerza espiritual inmensa: nuestros Sabios enseñan que sostiene al mundo tras la destrucción del Templo, debiendo pronunciarse con deleite y solemnidad.`,
        },
        {
          id: 'shir_shel_yom',
          titleHebrew: 'שִׁיר שֶׁל יוֹם',
          titleSpanish: 'Salmo Cotidiano del Día (Shir Shel Yom)',
          titleTranslit: 'Shir Shel Yom',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `הַיּוֹם יוֹם רִאשׁוֹן בַּשַּׁבָּת, שֶׁבּוֹ הָיוּ הַלְוִיִּם אוֹמְרִים בְּבֵית הַמִּקְדָּשׁ:
(תְּהִלִּים כ״ד): לְדָוִד מִזְמוֹר, לַיהוה הָאָרֶץ וּמְלוֹאָהּ, תֵּבֵל וְיֹשְׁבֵי בָהּ: כִּי־הוּא עַל־יַמִּים יְסָדָהּ, וְעַל־נְהָרוֹת יְכוֹנְנֶהָ: מִי־יַעֲלֶה בְהַר־יהוה, וּמִי־יָקוּם בִּמְקוֹם קָדְשׁוֹ: נְקִי כַפַּיִם וּבַר־לֵבָב, אֲשֶׁר לֹא־נָשָׂא לַשָּׁוְא נַפְשִׁי, וְלֹא נִשְׁבַּע לְמִרְמָה: יִשָּׂא בְרָכָה מֵאֵת יהוה, וּצְדָקָה מֵאֱלֹהֵי יִשְׁעוֹ: זֶה דּוֹר דֹּרְשָׁו, מְבַקְשֵׁי פָנֶיךָ יַעֲקֹב סֶלָה:
שְׂאוּ שְׁעָרִים רָאשֵׁיכֶם, וְהִנָּשְׂאוּ פִּתְחֵי עוֹלָם, וְיָבוֹא מֶלֶךְ הַכָּבוֹד: מִי זֶה מֶלֶךְ הַכָּבוֹד, יהוה עִזּוּז וְגִבּוֹר, יהוה גִּבּוֹר מִלְחָמָה: שְׂאוּ שְׁעָרִים רָאשֵׁיכֶם, וּשְׂאוּ פִּתְחֵי עוֹלָם, וְיָבֹא מֶלֶךְ הַכָּבוֹד: מִי הוּא זֶה מֶלֶךְ הַכָּבוֹד, יהוה צְבָאוֹת הוּא מֶלֶךְ הַכָּבוֹד סֶלָה:
הוֹשִׁיעֵנוּ יהוה אֱלֹהֵינוּ וְקַבְּצֵנוּ מִן־הַגּוֹיִם, לְהֹדוֹת לְשֵׁם קָדְשֶׁךָ, לְהִשְׁתַּבֵּחַ בִּתְהִלָּתֶךָ: בָּרוּךְ יהוה אֱלֹהֵי יִשְׂרָאֵל מִן־הָעוֹלָם וְעַד הָעוֹלָם, וְאָמַר כָּל־הָעָם אָמֵן, הַלְלוּיָהּ:`,
          transliteration: `Ha-yom yom rishón ba-shabát, she-bo hayú ha-Leviím omrím be-véit ha-mikdásh:
Le-Davíd mizmór: La-YHVH ha-áretz u-mloáh, tevel ve-yoshvéi vah. Ki Hu al yamím yesadáh, ve-al neharót yekonénéha. Mi yaaléh ve-har YHVH, u-mi yakúm bi-mkom kodshó. Nekí japáyim u-var leváv, ashér lo nasá la-shav nafshí, ve-lo nishbá le-mirmáh. Yisá verajáh me-ét YHVH, u-tzedakáh me-Elohéi yish'ó. Zeh dor dorsháv, mevakshéi fanéja Yaakóv séla.
Se'ú shearím rasheijém, ve-hinas'ú pitjéi olám, ve-yavó Mélej ha-kavód. Mi zeh Mélej ha-kavód? YHVH izúz ve-gibór, YHVH gibór miljamáh. Se'ú shearím rasheijém, u-s'ú pitjéi olám, ve-yavó Mélej ha-kavód. Mi hu zeh Mélej ha-kavód? YHVH Tzevaót, Hu Mélej ha-kavód séla.
Hoshiénu YHVH Elohéinu ve-kabtzénu min ha-goyím, le-hodót le-shém kodshéja, le-hishtabéaj bi-thilatéja. Barúj YHVH Elohéi Yisraél min ha-olám ve-ad ha-olám, ve-amár kol ha-am Amén, Haleluyáh.`,
          spanish: `Hoy es el día primero de la semana, en el cual los levitas solían entonar en el Santo Templo:
(Salmo 24): De David, un salmo: De YHVH es la tierra y cuanto la colma, el orbe y los que en él habitan. Pues Él la fundó sobre los mares y sobre los ríos la afianzó. ¿Quién subirá al monte de YHVH, y quién permanecerá de pie en Su santo recinto? El limpio de manos y puro de corazón, que no elevó su alma a la vanidad ni juró con engaño. Él recibirá bendición de YHVH y benevolencia del Dios de su salvación. Esta es la generación de los que Le buscan, de los que anhelan Tu presencia, oh Dios de Jacob.
¡Alzad, oh portales, vuestros dinteles, y elevaos, pórticos eternos, para que ingrese el Rey de la Gloria! ¿Quién es este Rey de la Gloria? YHVH, fuerte y valeroso; YHVH, poderoso en la batalla. ¡Alzad, oh portales, vuestros dinteles, alzaos, entradas eternas, y entrará el Rey de la Gloria! ¿Quién es Él, este Rey de la Gloria? YHVH de los ejércitos, ¡Él es el Rey de la Gloria por siempre!
Sálvanos, YHVH nuestro Dios, y congréganos de entre las naciones, para dar gracias a Tu santo Nombre y gloriarnos en Tu alabanza. ¡Bendito sea YHVH Dios de Israel desde siempre y para siempre, y dijo todo el pueblo: Amén, ¡Haleluyah!`,
          moroccanNote: `Se recita el salmo asignado según el día de la semana: Domingo Salmo 24; Lunes Salmo 48; Martes Salmo 82; Miércoles Salmo 94; Jueves Salmo 81; Viernes Salmo 93.`,
        },
        {
          id: 'alenu_leshabeaj',
          titleHebrew: 'עָלֵינוּ לְשַׁבֵּחַ (שְׁנֵי חֲלָקִים שְׁלֵמִים)',
          titleSpanish: 'Nuestro Deber de Alabar al Creador (Texto Íntegro)',
          titleTranslit: 'Alénu LeShabéaj',
          posture: {
            type: 'bowing',
            label: 'De pie e inclinación solemne',
            instruction: `Póngase de pie con profunda reverencia e inclínese de rodillas al decir "Va-anájnu kor\'ím u-mishtajavím u-modím" reconociendo al Soberano Absoluto.`,
          },
          hebrew: `עָלֵינוּ לְשַׁבֵּחַ לַאֲדוֹן הַכֹּל, לָתֵת גְּדֻלָּה לְיוֹצֵר בְּרֵאשִׁית, שֶׁלֹּא עָשָׂנוּ כְּגוֹיֵי הָאֲרָצוֹת, וְלֹא שָׂמָנוּ כְּמִשְׁפְּחוֹת הָאֲדָמָה, שֶׁלֹּא שָׂם חֶלְקֵנוּ כָּהֶם וְגוֹרָלֵנוּ כְּכָל־הֲמוֹנָם:
שֶׁהֵם מִשְׁתַּחֲוִים לְהֶבֶל וָרִיק, וּמִתְפַּלְּלִים אֶל־אֵל לֹא יוֹשִׁיעַ:
וַאֲנַחְנוּ כּוֹרְעִים וּמִשְׁתַּחֲוִים וּמוֹדִים, לִפְנֵי מֶלֶךְ מַלְכֵי הַמְּלָכִים, הַקָּדוֹשׁ בָּרוּךְ הוּא:
שֶׁהוּא נוֹטֶה שָׁמַיִם וְיוֹסֵד אָרֶץ, וּמוֹשַׁב יְקָרוֹ בַּשָּׁמַיִם מִמַּעַל, וּשְׁכִינַת עֻזּוֹ בְּגָבְהֵי מְרוֹמִים: הוּא אֱלֹהֵינוּ אֵין עוֹד, אֱמֶת מַלְכֵּנוּ, אֶפֶס זוּלָתוֹ, כַּכָּתוּב בְּתוֹרָתוֹ: וְיָדַעְתָּ הַיּוֹם וַהֲשֵׁבֹתָ אֶל־לְבָבֶךָ, כִּי יהוה הוּא הָאֱלֹהִים בַּשָּׁמַיִם מִמַּעַל וְעַל־הָאָרֶץ מִתָּחַת, אֵין עוֹד:

עַל כֵּן נְקַוֶּה לְּךָ יהוה אֱלֹהֵינוּ, לִרְאוֹת מְהֵרָה בְּתִפְאֶרֶת עֻזָּךְ, לְהַעֲבִיר גִּלּוּלִים מִן הָאָרֶץ, וְהָאֱלִילִים כָּרוֹת יִכָּרֵתוּן, לְתַקֵּן עוֹלָם בְּמַלְכוּת שַׁדַּי, וְכָל־בְּנֵי בָשָׂר יִקְרְאוּ בִשְׁמֶךָ, לְהַפְנוֹת אֵלֶיךָ כָּל־רִשְׁעֵי אָרֶץ:
יַכִּירוּ וְיֵדְעוּ כָּל־יוֹשְׁבֵי תֵבֵל, כִּי לְךָ תִּכְרַע כָּל־בֶּרֶךְ, תִּשָּׁבַע כָּל־לָשׁוֹן:
לְפָנֶיךָ יהוה אֱלֹהֵינוּ יִכְרְעוּ וְיִפֹּלוּ, וְלִכְבוֹד שִׁמְךָ יְקָר יִתֵּנוּ, וִיקַבְּלוּ כֻלָּם אֶת־עֹל מַלְכוּתֶךָ, וְתִמְלוֹךְ עֲלֵיהֶם מְהֵרָה לְעוֹלָם וָעֶד:
כִּי הַמַּלְכוּת שֶׁלְּךָ הִיא, וּלְעוֹלְמֵי עַד תִּמְלוֹךְ בְּכָבוֹד, כַּכָּתוּב בְּתוֹרָתָךְ: יהוה יִמְלֹךְ לְעֹלָם וָעֶד:
וְנֶאֱמַר: וְהָיָה יהוה לְמֶלֶךְ עַל־כָּל־הָאָרֶץ, בַּיּוֹם הַהוּא יִהְיֶה יהוה אֶחָד, וּשְׁמוֹ אֶחָד:`,
          transliteration: `Alénu leshabéaj la-Adón ha-kól, latét geduláh le-yotzér bereshít, she-lo asánu ke-goyéi ha-aratzót, ve-lo samánu ke-mishpejót ha-adamáh, she-lo sam jelkénu kahém ve-goralénu ke-jol hamonám.
She-hem mishtajavím le-hével va-rík, u-mitpalelím el el lo yoshí'a.
Va-anájnu kor'ím u-mishtajavím u-modím, lifnéi Mélej maljéi ha-melajím, ha-Kadósh Barúj Hu.
She-Hu notéh shamáyim ve-yoséd áretz, u-moshav yekaró ba-shamáyim mi-máal, u-shjinát uzó be-govhéi meromím. Hu Elohéinu éin od, emét Malkénu, éfes zulató, ka-katúv be-Torató: Ve-yadáta ha-yom va-hashevóta el levavéja, ki YHVH Hu ha-Elohím ba-shamáyim mi-máal ve-al ha-áretz mi-tájat, éin od.

Al ken nekavéh lejá YHVH Elohéinu, lir'ót meheráh be-tif'éret uzáj, lehaavír gilulím min ha-áretz, ve-ha-elilím karót yikaretún, le-takén olám be-maljút Shadái, ve-jol benéi vasár yikre'ú vi-shméja, lehafnot eléja kol rish'éi áretz.
Yakíru ve-yede'ú kol yoshvéi tevel, ki lejá tijrá kol bérej, tishavá kol lashón.
Lefanéja YHVH Elohéinu yijre'ú ve-yipólu, ve-lijvód shimjá yekár yiténu, vi-ykabelú julám et ol maljutéja, ve-timlój aleihém meheráh le-olám va-ed.
Ki ha-maljút sheljá hi, u-l'olméi ad timlój be-javód, ka-katúv be-Toratáj: YHVH yimlój le-olám va-ed.
Ve-neemár: Ve-hayáh YHVH le-Mélej al kol ha-áretz, ba-yom ha-hu yihyéh YHVH Ejád, u-shmó Ejád.`,
          spanish: `Es nuestro deber alabar al Soberano de todo, atribuir grandeza al Creador del principio, que no nos hizo como a las naciones idólatras de las tierras ni nos ubicó como a las familias paganas del suelo; que no asignó nuestra porción como la de ellos ni nuestro destino como el de toda su multitud.
Pues ellos se postran ante la vanidad y el vacío, y dirigen sus ruegos a ídolos inertes que no pueden salvar.
Y nosotros doblamos las rodillas, nos prosternamos reverentes y expresamos gratitud ante el Supremo Rey de reyes, el Santo, bendito sea Él.
Él es Quien extiende los cielos y establece la tierra, el trono de Su gloria está en los cielos en lo alto y la Presencia de Su majestad en las alturas supremas. Él es nuestro Dios y no hay otro; verdad absoluta es nuestro Rey, nada existe fuera de Él, conforme está escrito en Su sagrada Torá: "Y sabrás hoy y asentarás en tu corazón que YHVH es el Dios en los cielos en lo alto y sobre la tierra abajo; no hay ningún otro" (Deuteronomio 4:39).

Por tanto en Ti esperamos, YHVH nuestro Dios, para contemplar prontamente el esplendor de Tu majestad, erradicar los ídolos abominables de la faz de la tierra y extirpar por completo las falsas deidades; para perfeccionar el mundo bajo el Reinado del Omnipotente, y que todos los seres humanos invoquen Tu Nombre, haciendo retornar a Ti a todos los descarriados de la tierra.
Reconocerán y sabrán todos los habitantes del orbe que ante Ti se doblará toda rodilla y jurará fidelidad toda lengua.
Ante Tu presencia, YHVH nuestro Dios, se arrodillarán y postrarán, y a la gloria de Tu Nombre tributarán honor, asumiendo todos el yugo de Tu reinado, y reinarás sobre ellos prontamente y por siempre jamás.
Pues la soberanía es únicamente Tuya, y por los siglos de los siglos reinarás con gloria, según está escrito en Tu Torá: "¡YHVH reinará por siempre jamás!" (Éxodo 15:18).
Y fue dicho por el profeta: "Y será YHVH Rey Soberano sobre toda la tierra; en aquel día YHVH será Uno y Su Nombre Uno" (Zacarías 14:9).`,
        },
      ],
    },
  ],
};
