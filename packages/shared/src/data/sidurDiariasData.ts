import { SidurTefila } from '../types';

/**
 * Liturgia Completa de Oraciones Cotidianas y del Camino
 * Tradición y Rito Sefardí-Marroquí (Núsaj Kehilot Maroko)
 * 100% íntegro: texto completo sin elipsis ni recortes.
 */
export const ORACIONES_DIARIAS_DATA: SidurTefila = {
  id: 'oraciones_diarias',
  nameHebrew: 'תְּפִלּוֹת וּבְרָכוֹת שְׁכִיחוֹת',
  nameSpanish: 'Oraciones Cotidianas y del Camino',
  nameTranslit: 'Tefilót u-Vrajót Shejijót',
  timeOfDay: 'anytime',
  description: `Plegarias indispensables de la vida cotidiana: Tefilát HaDérej (Oración del Viajero) completa con versículos de escolta angelical, y Keriát Shemá al HaMitá (antes de dormir) con HaMapíl, Shemá, Salmo 91 íntegro y la invocación de los cuatro ángeles custodios.`,
  sections: [
    // ------------------------------------------------------------------------
    // SECCIÓN 1: TEFILAT HADEREJ
    // ------------------------------------------------------------------------
    {
      id: 'tefilat_haderej_section',
      order: 1,
      titleHebrew: 'תְּפִלַּת הַדֶּרֶךְ',
      titleSpanish: 'Oración del Viajero (Tefilat HaDerej)',
      titleTranslit: 'Tefilát HaDérej',
      description: `Plegaria protectora al emprender un viaje por carretera, mar o aire fuera de los límites de la ciudad.`,
      segments: [
        {
          id: 'tefilat_haderej_seg',
          titleHebrew: 'תְּפִלַּת הַדֶּרֶךְ הַשְּׁלֵמָה וּפְסוּקֵי שְׁמִירָה',
          titleSpanish: 'Plegaria del Viajero Completa con Versículos de Custodia',
          titleTranslit: 'Tefilát HaDérej HaShelemáh',
          posture: {
            type: 'standing',
            label: 'De pie (o sentado si se está en tránsito)',
            instruction: `Se recita una vez que se ha dejado atrás el perímetro urbano, preferentemente de pie o con calma durante el trayecto.`,
          },
          hebrew: `יְהִי רָצוֹן מִלְּפָנֶיךָ יהוה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ,
שֶׁתּוֹלִיכֵנוּ לְשָׁלוֹם, וְתַצְעִידֵנוּ לְשָׁלוֹם, וְתַדְרִיכֵנוּ לְשָׁלוֹם, וְתִסְמְכֵנוּ לְשָׁלוֹם, וְתַגִּיעֵנוּ לִמְחוֹז חֶפְצֵנוּ לְחַיִּים וּלְשִׂמְחָה וּלְשָׁלוֹם,
וְתַצִּילֵנוּ מִכַּף כָּל־אוֹיֵב וְאוֹרֵב וְלִסְטִים וְחַיּוֹת רָעוֹת בַּדֶּרֶךְ, וּמִכָּל־מִינֵי פֻּרְעָנֻיּוֹת הַמִּתְרַגְּשׁוֹת לָבוֹא לָעוֹלָם,
וְתִשְׁלַח בְּרָכָה בְּכָל־מַעֲשֵׂה יָדֵינוּ,
וְתִתְּנֵנוּ לְחֵן וּלְחֶסֶד וּלְרַחֲמִים בְּעֵינֶיךָ וּבְעֵינֵי כָל־רוֹאֵינוּ,
וְתִשְׁמַע קוֹל תַּחֲנוּנֵינוּ, כִּי אֵל שׁוֹמֵעַ תְּפִלָּה וְתַחֲנוּן אָתָּה:
בָּרוּךְ אַתָּה יהוה, שׁוֹמֵעַ תְּפִלָּה:

הִנֵּה אָנֹכִי שֹׁלֵחַ מַלְאָךְ לְפָנֶיךָ, לִשְׁמָרְךָ בַּדָּרֶךְ, וְלַהֲבִיאֲךָ אֶל־הַמָּקוֹם אֲשֶׁר הֲכִנֹתִי:
יְבָרֶכְךָ יהוה וְיִשְׁמְרֶךָ: יָאֵר יהוה פָּנָיו אֵלֶיךָ וִיחֻנֶּךָּ: יִשָּׂא יהוה פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם:
יהוה יִשְׁמָר־צֵאתְךָ וּבוֹאֶךָ, מֵעַתָּה וְעַד־עוֹלָם:`,
          transliteration: `Yehí ratzón mi-lefanéja YHVH Elohéinu ve-Elohéi avotéinu,
she-tolijénu le-shalóm, ve-tatz'idénu le-shalóm, ve-tadrijénu le-shalóm, ve-tismejénu le-shalóm, ve-tagi'énu li-mjóz jeftzénu le-jayím u-le-simjáh u-le-shalóm,
ve-tatzilénu mi-kaf kol oyév ve-orév ve-listím ve-jayót raót ba-dérej, u-mi-kol minéi pur'aniyót ha-mitragshot la-vó la-olám,
ve-tishláj berajáh be-jol maaséh yadéinu,
ve-titnénu le-jén u-le-jésed u-le-rajamím be-eynéja u-vi-ynéi kol roéinu,
ve-tishmá kol tajanunéinu, ki El shoméa tefiláh ve-tajanún Atáh.
Barúj Atáh YHVH, shoméa tefiláh.

Hinéh Anojí sholéaj mal'áj lefanéja, li-shmorjá va-dárej, ve-lahavijá el ha-makóm ashér hejinóti.
Yevarejejá YHVH ve-yishmeréja. Yaér YHVH panáv eléja vi-yjunéka. Yisá YHVH panáv eléja ve-yasém lejá shalóm.
YHVH yishmor tzetjá u-voéja, me-atáh ve-ad olám.`,
          spanish: `Sea Tu voluntad, YHVH nuestro Dios y Dios de nuestros antepasados, encaminarnos hacia la paz, dirigir nuestros pasos hacia la paz, guiarnos hacia la paz, sostenernos en la paz y hacernos llegar a nuestro destino deseado con vida, alegría y paz.
Líbranos de manos de todo enemigo, emboscada, asaltantes y fieras del camino, y de toda clase de calamidades que puedan suscitarse en el mundo.
Envía bendición en toda obra de nuestras manos y concédenos gracia, benevolencia y misericordia ante Tus ojos y ante los ojos de cuantos nos vean, y atiende la voz de nuestra súplica, pues Tú eres Dios que escucha la oración y el ruego.
Bendito eres Tú, YHVH, que escucha la oración.

He aquí que Yo envío un ángel delante de ti para que te guarde en el camino y te introduzca en el lugar que he preparado (Éxodo 23:20).
Que YHVH te bendiga y te preserve; que YHVH ilumine Su rostro hacia ti y te agracie; que YHVH eleve Su semblante hacia ti y te conceda la paz (Números 6:24-26).
YHVH guardará tus salidas y tus entradas, desde ahora y para siempre jamás (Salmo 121:8).`,
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 2: KERIÁT SHEMÁ AL HAMITÁ
    // ------------------------------------------------------------------------
    {
      id: 'shema_al_hamita_section',
      order: 2,
      titleHebrew: 'קְרִיאַת שְׁמַע עַל הַמִּטָּה',
      titleSpanish: 'Shemá antes de Dormir (Keriát Shemá al HaMitá)',
      titleTranslit: 'Keriát Shemá al HaMitáh',
      description: `Entrega del alma en manos de Dios antes del descanso nocturno: bendición de HaMapíl, Shemá, Salmo 91 íntegro y la invocación de los ángeles custodios.`,
      segments: [
        {
          id: 'hamapil',
          titleHebrew: 'בִּרְכַּת הַמַּפִּיל',
          titleSpanish: 'Bendición de HaMapíl · El Sueño Reparador',
          titleTranslit: 'Birkat HaMapíl',
          posture: {
            type: 'sitting',
            label: 'Sentado en el lecho',
            instruction: `Se recita sentado en la cama inmediatamente antes de disponerse a dormir, evitando hablar tras su recitación.`,
          },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַמַּפִּיל חֶבְלֵי שֵׁנָה עַל־עֵינָי, וּתְנוּמָה עַל־עַפְעַפָּי, וּמֵאִיר לְאִישׁוֹן בַּת־עָיִן:
וִיהִי רָצוֹן מִלְּפָנֶיךָ יהוה אֱלֹהַי וֵאלֹהֵי אֲבוֹתַי, שֶׁתַּשְׁכִּיבֵנִי לְשָׁלוֹם, וְתַעֲמִידֵנִי לְחַיִּים טוֹבִים וּלְשָׁלוֹם, וְתֵן חֶלְקִי בְּתוֹרָתֶךָ, וְתַרְגִּילֵנִי לִדְבַר מִצְוָה, וְאַל תַּרְגִּילֵנִי לִדְבַר עֲבֵרָה, וְאַל תְּבִיאֵנִי לִידֵי חֵטְא, וְלֹא לִידֵי נִסָּיוֹן, וְלֹא לִידֵי בִזָּיוֹן, וְיִשְׁלוֹט בִּי יֵצֶר הַטּוֹב, וְאַל יִשְׁלוֹט בִּי יֵצֶר הָרָע, וְתַצִּילֵנִי מִפֶּגַע רָע וּמֵחֳלָיִים רָעִים, וְאַל יְבַהֲלוּנִי רַעְיוֹנַי וַחֲלוֹמוֹת רָעִים וְהַרְהוֹרִים רָעִים, וּתְהֵא מִטָּתִי שְׁלֵמָה לְפָנֶיךָ, וְהָאֵר עֵינַי פֶּן אִישַׁן הַמָּוֶת:
בָּרוּךְ אַתָּה יהוה, הַמֵּאִיר לָעוֹלָם כֻּלּוֹ בִּכְבוֹדוֹ:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ha-mapíl jevléi shenáh al eynái, u-tnumáh al af'apái, u-meír le-ishón bat áyin.
Vi-hí ratzón mi-lefanéja YHVH Elohái ve-Elohéi avotái, she-tashkivéni le-shalóm, ve-taamidéni le-jayím tovím u-le-shalóm, ve-ten jelkí be-Toratéja, ve-targiléni li-dvar mitzváh, ve-al targiléni li-dvar averáh, ve-al tevi'éni li-ydéi jet, ve-lo li-ydéi nisayón, ve-lo li-ydéi vizayón, ve-yishlót bi yétzer ha-tov, ve-al yishlót bi yétzer ha-ra, ve-tatziléni mi-péga ra u-me-jolayím raím, ve-al yevahalúni ra'yonái va-jalomót raím ve-hirhurím raím, u-t'hé mitatí shelemáh lefanéja, ve-haér einái pen ishán ha-mávet.
Barúj Atáh YHVH, ha-meír la-olám kuló bi-jvodó.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, que posa los lazos del sueño sobre mis ojos y la modorra sobre mis párpados, y que alumbra la pupila del ojo.
Y sea Tu voluntad, YHVH mi Dios y Dios de mis antepasados, hacerme acostar en paz y hacerme levantar a una vida buena y en paz; concede mi porción en Tu Torá y habitúame al cumplimiento de los mandamientos; no me acostumbres a la transgresión, ni me introduzcas en las garras del pecado, ni en la prueba, ni en la humillación. Que predomine en mí la inclinación al bien y no prevalezca sobre mí la inclinación al mal; rescátame de cualquier percance dañino y de enfermedades dolorosas; que no me perturben pensamientos aciagos, ni malos sueños ni fantasías perniciosas; que mi lecho familiar sea íntegro ante Ti, e ilumina mis ojos para no dormir el sueño de la muerte.
Bendito eres Tú, YHVH, que alumbra al universo entero con Su gloria.`,
        },
        {
          id: 'shema_al_hamita_verse',
          titleHebrew: 'שְׁמַע יִשְׂרָאֵל שֶׁעַל הַמִּטָּה',
          titleSpanish: 'Shemá Israel y Entrega del Alma en el Lecho',
          titleTranslit: 'Shemá Yisraél',
          posture: { type: 'cover_eyes', label: 'Cubrirse los ojos' },
          hebrew: `שְׁמַע יִשְׂרָאֵל: יהוה אֱלֹהֵינוּ, יהוה אֶחָד:
(בלחש): בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד:
וְאָהַבְתָּ אֵת יהוה אֱלֹהֶיךָ, בְּכָל־לְבָבְךָ וּבְכָל־נַפְשְׁךָ וּבְכָל־מְאֹדֶךָ: וְהָיוּ הַדְּבָרִים הָאֵלֶּה, אֲשֶׁר אָנֹכִי מְצַוְּךָ הַיּוֹם, עַל־לְבָבֶךָ: וְשִׁנַּנְתָּם לְבָנֶיךָ, וְדִבַּרְתָּ בָּם, בְּשִׁבְתְּךָ בְּבֵיתֶךָ, וּבְלֶכְתְּךָ בַדֶּרֶךְ, וּבְשָׁכְבְּךָ וּבְקוּמֶךָ: וּקְשַׁרְתָּם לְאוֹת עַל־יָדֶךָ, וְהָיוּ לְטֹטָפֹת בֵּין עֵינֶיךָ: וּכְתַבְתָּם עַל־מְזֻזוֹת בֵּיתֶךָ, וּבִשְׁעָרֶיךָ:`,
          transliteration: `Shemá Yisraél: YHVH Elohéinu, YHVH Ejád!
(En voz baja): Barúj shem kevód maljutó le-olám va-ed.
Ve-ahavtá et YHVH Elohéja, be-jol levavjá u-ve-jol nafshejá u-ve-jol meodéja. Ve-hayú ha-dvarím ha-éleh ashér anojí metzavjá ha-yom al levavéja. Ve-shinantám le-vanéja ve-dibartá bam, be-shivtejá be-vetéja, u-ve-lejtejá va-dérej, u-ve-shojbejá u-ve-kuméja. U-kshartám le-ot al yadéja, ve-hayú le-totafót bein eynéja. U-jtavtám al mezuzót betéja u-vi-sh'aréja.`,
          spanish: `¡Escucha, Israel: YHVH es nuestro Dios, YHVH es Uno!
(En voz baja): Bendito sea el Nombre de la majestad de Su reino por siempre jamás.
Amarás a YHVH tu Dios con todo tu corazón, con toda tu alma y con todos tus recursos. Y estas palabras que Yo te ordeno hoy estarán sobre tu corazón. Las inculcarás con esmero a tus hijos y hablarás de ellas estando en tu casa, andando por el camino, al acostarte y al levantarte. Las atarás por señal en tu brazo y serán por divisas entre tus ojos; y las escribirás en los postes de tu casa y en tus portales (Deuteronomio 6:4-9).`,
        },
        {
          id: 'salmo_91_yoshev_beseter',
          titleHebrew: 'יוֹשֵׁב בְּסֵתֶר עֶלְיוֹן (תְּהִלִּים צ״א שָׁלֵם)',
          titleSpanish: 'Salmo 91 Íntegro · Salmo del Amparo y Custodia Divina',
          titleTranslit: 'Yoshév be-Séter Elyón',
          posture: { type: 'sitting', label: 'Sentado / Recostado' },
          hebrew: `יֹשֵׁב בְּסֵתֶר עֶלְיוֹן, בְּצֵל שַׁדַּי יִתְלוֹנָן:
אֹמַר לַיהוה מַחְסִי וּמְצוּדָתִי, אֱלֹהַי אֶבְטַח־בּוֹ:
כִּי הוּא יַצִּילְךָ מִפַּח יָקוּשׁ, מִדֶּבֶר הַוּוֹת:
בְּאֶבְרָתוֹ יָסֶךְ לָךְ וְתַחַת־כְּנָפָיו תֶּחְסֶה, צִנָּה וְסֹחֵרָה אֲמִתּוֹ:
לֹא־תִירָא מִפַּחַד לָיְלָה, מֵחֵץ יָעוּף יוֹמָם:
מִדֶּבֶר בָּאֹפֶל יַהֲלֹךְ, מִקֶּטֶב יָשׁוּד צָהֳרָיִם:
יִפֹּל מִצִּדְּךָ אֶלֶף וּרְבָבָה מִימִינֶךָ, אֵלֶיךָ לֹא יִגָּשׁ:
רַק בְּעֵינֶיךָ תַבִּיט, וְשִׁלֻּמַת רְשָׁעִים תִּרְאֶה:
כִּי־אַתָּה יהוה מַחְסִי, עֶלְיוֹן שַׂמְתָּ מְעוֹנֶךָ:
לֹא־תְאֻנֶּה אֵלֶיךָ רָעָה, וְנֶגַע לֹא־יִקְרַב בְּאָהֳלֶךָ:
כִּי מַלְאָכָיו יְצַוֶּה־לָּךְ, לִשְׁמָרְךָ בְּכָל־דְּרָכֶיךָ:
עַל־כַּפַּיִם יִשָּׂאוּנְךָ, פֶּן־תִּגֹּף בָּאֶבֶן רַגְלֶךָ:
עַל־שַׁחַל וָפֶתֶן תִּדְרֹךְ, תִּרְמֹס כְּפִיר וְתַנִּין:
כִּי בִי חָשַׁק וַאֲפַלְּטֵהוּ, אֲשַׂגְּבֵהוּ כִּי־יָדַע שְׁמִי:
יִקְרָאֵנִי וְאֶעֱנֵהוּ, עִמּוֹ־אָנֹכִי בְצָרָה, אֲחַלְּצֵהוּ וַאֲכַבְּדֵהוּ:
אֹרֶךְ יָמִים אַשְׂבִּיעֵהוּ, וְאַרְאֵהוּ בִּישׁוּעָתִי:
אֹרֶךְ יָמִים אַשְׂבִּיעֵהוּ, וְאַרְאֵהוּ בִּישׁוּעָתִי:

בְּשֵׁם יהוה אֱלֹהֵי יִשְׂרָאֵל: מִימִינִי מִיכָאֵל, וּמִשְּׂמֹאלִי גַּבְרִיאֵל, וּמִלְּפָנַי אוֹרִיאֵל, וּמֵאַחֲרַי רְפָאֵל, וְעַל רֹאשִׁי שְׁכִינַת אֵל:`,
          transliteration: `Yoshév be-séter Elyón, be-tzél Shadái yitlonán.
Omár la-YHVH majsí u-metzudatí, Elohái evtaj bo.
Ki Hu yatziljá mi-paj yakúsh, mi-déver havót.
Be-evrató yásej laj ve-tájat kenafáv tejséh, tzináh ve-sojeráh amitó.
Lo tirá mi-pájad láylah, me-jetz yaúf yomám.
Mi-déver ba-ófel yahalój, mi-kétev yashúd tzohoráyim.
Yipól mi-tzidjá élef u-revaváh mi-yminéja, eléja lo yigásh.
Rak be-eynéja tabít, ve-shilumát reshaím tir'éh.
Ki Atáh YHVH majsí, Elyón sámta meonéja.
Lo teunéh eléja raáh, ve-néga lo yikráv be-aholéja.
Ki mal'ajáv yetzavéh laj, li-shmorjá be-jol drajéja.
Al kapáyim yisaúnja, pen tigóf ba-éven ragléja.
Al shájal va-féten tidrój, tirmós kfír ve-tanín.
Ki vi jashák va-afaltéhu, asagvéhu ki yadá Shemí.
Yikraéni ve-e\'enéhu, imó Anojí ve-tzaráh, ajaletzéhu va-ajabedéhu.
Órej yamím asbi'éhu, ve-ar'éhu bi-yshuatí.
Órej yamím asbi'éhu, ve-ar'éhu bi-yshuatí.

Be-shém YHVH Elohéi Yisraél: Mi-yminí Mijaél, u-mi-smolí Gavriél, u-mi-lefanái Uriél, u-me-ajarái Refaél, ve-al roshí Shejinát El.`,
          spanish: `El que habita al abrigo del Altísimo, morará bajo la sombra del Omnipotente.
Digo de YHVH: "Refugio mío y fortaleza mía, mi Dios en Quien confío".
Pues Él te librará de la trampa del cazador, de la peste destructora.
Con Sus alas te cubrirá y bajo Sus plumas hallarás refugio; escudo y coraza es Su verdad.
No temerás al espanto nocturno, ni a la saeta que vuela de día;
ni a la peste que se desliza en la oscuridad, ni a la mortandad que asuela al mediodía.
Caerán a tu lado mil y diez mil a tu diestra; mas a ti no se acercará.
Ciertamente con tus propios ojos contemplarás y verás la retribución de los impíos.
Porque Tú, YHVH, eres mi amparo; al Altísimo has puesto por tu morada.
Ningún mal te acontecerá, ni plaga alguna rozará tu morada.
Pues a Sus ángeles ordenará acerca de ti, para guardarte en todos tus caminos.
En las palmas de las manos te sostendrán, para que no tropiece tu pie en la piedra.
Sobre el león y la víbora pisarás; hollarás al cachorro de león y al dragón.
"Por cuanto en Mí puso su anhelo, Yo lo libraré; lo exaltaré a lugar seguro pues ha conocido Mi Nombre.
Me invocará y Yo le responderé; con él estaré en la aflicción; lo libraré y lo colmaré de honor.
Con largura de días lo saciaré, y le mostraré Mi salvación" (Salmo 91).

En el Nombre de YHVH, Dios de Israel: a mi derecha Miguel, a mi izquierda Gabriel, delante de mí Uriel, detrás de mí Rafael, y sobre mi cabeza la Presencia Divina de Dios.`,
        },
      ],
    },
  ],
};
