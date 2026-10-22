import { SidurTefila } from '../types';

/**
 * Liturgia Completa de Birkat HaMazón (Bendición tras el Pan)
 * Tradición y Rito Sefardí-Marroquí (Núsaj Kehilot Maroko)
 * 100% íntegro: texto completo sin elipsis ni recortes.
 */
export const BIRKAT_HAMAZON_DATA: SidurTefila = {
  id: 'birkat_hamazon',
  nameHebrew: 'בִּרְכַּת הַמָּזוֹן',
  nameSpanish: 'Birkat HaMazón (Núsaj Marroquí)',
  nameTranslit: 'Birkat HaMazón',
  timeOfDay: 'anytime',
  description: `Agradecimiento preceptivo de la Torá tras haber comido pan y saciado el apetito: Salmo 126 íntegro, Zimún tradicional, las 4 bendiciones completas y la entrañable letanía marroquí de HaRajamán con bendición al hogar y comensales.`,
  sections: [
    {
      id: 'birkat_hamazon_complete',
      order: 1,
      titleHebrew: 'סֵדֶר בִּרְכַּת הַמָּזוֹן הַשָּׁלֵם',
      titleSpanish: 'Orden Completo de Birkat HaMazón',
      titleTranslit: 'Séder Birkat HaMazón',
      description: `Salmo 126, Convocatoria (Zimún), Las 4 Bendiciones preceptivas y las Peticiones de HaRajamán.`,
      segments: [
        {
          id: 'shir_hamaalot_126',
          titleHebrew: 'שִׁיר הַמַּעֲלוֹת (תְּהִלִּים קכ״ו שָׁלֵם)',
          titleSpanish: 'Salmo 126 Íntegro · Cuando Dios retorne el cautiverio de Sión',
          titleTranslit: 'Shir HaMaalót',
          posture: { type: 'sitting', label: 'Sentado a la mesa' },
          hebrew: `שִׁיר הַמַּעֲלוֹת:
בְּשׁוּב יהוה אֶת־שִׁיבַת צִיּוֹן, הָיִינוּ כְּחֹלְמִים:
אָז יִמָּלֵא שְׂחוֹק פִּינוּ, וּלְשׁוֹנֵנוּ רִנָּה,
אָז יֹאמְרוּ בַגּוֹיִם: הִגְדִּיל יהוה לַעֲשׂוֹת עִם־אֵלֶּה:
הִגְדִּיל יהוה לַעֲשׂוֹת עִמָּנוּ, הָיִינוּ שְׂמֵחִים:
שׁוּבָה יהוה אֶת־שְׁבִיתֵנוּ, כַּאֲפִיקִים בַּנֶּגֶב:
הַזֹּרְעִים בְּדִמְעָה, בְּרִנָּה יִקְצֹרוּ:
הָלוֹךְ יֵלֵךְ וּבָכֹה, נֹשֵׂא מֶשֶׁךְ־הַזָּרַע,
בֹּא־יָבוֹא בְרִנָּה, נֹשֵׂא אֲלֻמֹּתָיו:`,
          transliteration: `Shir ha-maalót:
Be-shuv YHVH et shivát Tziyón, hayínu ke-jolmím.
Az yimalé sejók pínu, u-leshonénu rináh,
az yomerú va-goyím: higdíl YHVH laasót im éleh.
Higdíl YHVH laasót imánu, hayínu smejím.
Shuváh YHVH et sheviténu, ka-afikím ba-Négev.
Ha-zor'ím be-dim'áh, be-rináh yiktzóru.
Halój yeléj u-vajó, nosé méshej ha-zára,
bo yavó ve-rináh, nosé alumotáv.`,
          spanish: `Cántico de las gradas:
Cuando YHVH haga retornar a los cautivos de Sión, seremos como quienes sueñan.
Entonces se colmará nuestra boca de risa y nuestra lengua de cántico de júbilo;
entonces proclamarán entre las naciones: "¡Grandes cosas ha hecho YHVH con estos!".
Grandes cosas ha hecho YHVH con nosotros, ¡y estuvimos llenos de alegría!
Haz volver, oh YHVH, a nuestros cautivos, como torrentes en el desierto del Néguev.
Quienes siembran con lágrimas, cosecharán con clamores de regocijo.
El sembrador que avanza llorando llevando la bolsa de semilla,
regresará con júbilo portando sus gavillas (Salmo 126).`,
        },
        {
          id: 'zimun_morocco',
          titleHebrew: 'זִמּוּן לִבְרָכָה',
          titleSpanish: 'Convocatoria Comunitaria (Zimún Marroquí)',
          titleTranslit: 'Zimún',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `(המזמן): הַב לָן וְנִבְרִיךְ לְמַלְכָּא עִלָּאָה קַדִּישָׁא:
(או): בִּרְשׁוּת מוֹרַי וְרַבּוֹתַי, נְבָרֵךְ (בעשרה: אֱלֹהֵינוּ) שֶׁאָכַלְנוּ מִשֶּׁלּוֹ:
(הקהל עונה): בָּרוּךְ (אֱלֹהֵינוּ) שֶׁאָכַלְנוּ מִשֶּׁלּוֹ וּבְטוּבוֹ חָיִינוּ:
(והמזמן חוזר): בָּרוּךְ (אֱלֹהֵינוּ) שֶׁאָכַלְנוּ מִשֶּׁלּוֹ וּבְטוּבוֹ חָיִינוּ:`,
          transliteration: `(Líder): Hav lán ve-nivríj le-Malká ila'áh kadishá.
(O bien): Birshút morái ve-rabotái, nevaréj (con 10 varones: Elohéinu) she-ajálnu mi-sheló.
(Comensales): Barúj (Elohéinu) she-ajálnu mi-sheló u-ve-tuvó jayínu.
(Líder repite): Barúj (Elohéinu) she-ajálnu mi-sheló u-ve-tuvó jayínu.`,
          spanish: `(Líder): Dispongámonos a bendecir al Rey Supremo y Santo.
(O bien): Con la anuencia de mis maestros y señores, bendigamos (con 10: a nuestro Dios) de Cuyo sustento hemos comido.
(Comensales): ¡Bendito sea (nuestro Dios) de Cuyo sustento hemos comido y por Cuya infinita bondad vivimos!
(Líder repite): ¡Bendito sea (nuestro Dios) de Cuyo sustento hemos comido y por Cuya infinita bondad vivimos!`,
          moroccanNote: `En el rito marroquí, cuando hay tres varones o más, el líder suele abrir el Zimún con la fórmula aramea sagrada: "Hav lán ve-nivríj le-Malká ila\'áh kadishá".`,
        },
        {
          id: 'beraja_1_hazan',
          titleHebrew: 'בְּרָכָה א׳: בִּרְכַּת הַזָּן אֶת הַכֹּל',
          titleSpanish: '1. Bendición del Sustentador Universal (HaZán)',
          titleTranslit: 'Birkat HaZán',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הָאֵל הַזָּן אוֹתָנוּ וְאֶת־הָעוֹלָם כֻּלּוֹ בְּטוּבוֹ, בְּחֵן בְּחֶסֶד וּבְרַחֲמִים:
הוּא נוֹתֵן לֶחֶם לְכָל־בָּשָׂר, כִּי לְעוֹלָם חַסְדּוֹ:
וּבְטוּבוֹ הַגָּדוֹל תָּמִיד לֹא חָסַר לָנוּ, וְאַל יֶחְסַר לָנוּ מָזוֹן לְעוֹלָם וָעֶד, כִּי הוּא אֵל זָן וּמְפַרְנֵס לַכֹּל, וּמֵטִיב לַכֹּל, וּמֵכִין מָזוֹן לְכָל־בְּרִיּוֹתָיו אֲשֶׁר בָּרָא:
בָּרוּךְ אַתָּה יהוה, הַזָּן אֶת־הַכֹּל:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, ha-El ha-zán otánu ve-et ha-olám kuló be-tuvó, be-jén be-jésed u-ve-rajamím.
Hu notén léjem le-jol basár, ki le-olám jasdó.
U-ve-tuvó ha-gadól tamíd lo jásar lánu, ve-al yejsár lánu mazón le-olám va-ed, ki Hu El zán u-mefarnés la-kól, u-metív la-kól, u-mejín mazón le-jol beriyotáv ashér bará.
Barúj Atáh YHVH, ha-zán et ha-kól.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, Dios que nos sustenta a nosotros y al mundo entero con Su infinita bondad, con gracia, benevolencia y compasión.
Él provee pan a toda criatura, pues eterna es Su benevolencia.
Y por Su inmensa generosidad jamás nos ha faltado ni nos faltará alimento por siempre jamás, pues Él es Dios que alimenta y sustenta a todos, beneficia a todos y prepara alimento para todas las criaturas que creó.
Bendito eres Tú, YHVH, que alimenta a todos.`,
        },
        {
          id: 'beraja_2_aretz',
          titleHebrew: 'בְּרָכָה ב׳: עַל הָאָרֶץ וְעַל הַמָּזוֹן',
          titleSpanish: '2. Por la Tierra Prometida y el Alimento (Birkat HaÁretz)',
          titleTranslit: 'Birkat HaÁretz',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `נוֹדֶה לְּךָ יהוה אֱלֹהֵינוּ, עַל שֶׁהִנְחַלְתָּ לַאֲבוֹתֵינוּ אֶרֶץ חֶמְדָּה טוֹבָה וּרְחָבָה, בְּרִית וְתוֹרָה, חַיִּים וּמָזוֹן, עַל שֶׁהוֹצֵאתָנוּ מֵאֶרֶץ מִצְרַיִם וּפְדִיתָנוּ מִבֵּית עֲבָדִים, וְעַל בְּרִיתְךָ שֶׁחָתַמְתָּ בִּבְשָׂרֵנוּ, וְעַל תּוֹרָתְךָ שֶׁלִּמַּדְתָּנוּ, וְעַל חֻקֵּי רְצוֹנָךְ שֶׁהוֹדַעְתָּנוּ, וְעַל חַיִּים וּמָזוֹן שָׁאַתָּה זָן וּמְפַרְנֵס אוֹתָנוּ תָּמִיד, בְּכָל־יוֹם וּבְכָל־עֵת וּבְכָל־שָׁעָה:
וְעַל הַכֹּל יהוה אֱלֹהֵינוּ אֲנַחְנוּ מוֹדִים לָךְ וּמְבָרְכִים אֶת־שְׁמֶךָ, יִתְבָּרַךְ שִׁמְךָ בְּפִי כָּל־חַי תָּמִיד לְעוֹלָם וָעֶד, כַּכָּתוּב: וְאָכַלְתָּ וְשָׂבָעְתָּ, וּבֵרַכְתָּ אֶת־יהוה אֱלֹהֶיךָ עַל־הָאָרֶץ הַטֹּבָה אֲשֶׁר נָתַן־לָךְ:
בָּרוּךְ אַתָּה יהוה, עַל הָאָרֶץ וְעַל הַמָּזוֹן:`,
          transliteration: `Nodéh lejá YHVH Elohéinu, al she-hinjálta la-avotéinu éretz jemdáh továh u-rjaváh, berít ve-Toráh, jayím u-mazón, al she-hotzetánu me-éretz Mitzráyim u-fditánu mi-béit avadím, ve-al beritjá she-jatámta bi-vsarénu, ve-al Toratjá she-limadtánu, ve-al jukéi retzonáj she-hoda'tánu, ve-al jayím u-mazón she-Atáh zán u-mefarnés otánu tamíd, be-jol yom u-ve-jol et u-ve-jol shaáh.
Ve-al ha-kól YHVH Elohéinu anájnu modím laj u-mvarjím et sheméja, yitbaráj shimjá be-fi kol jai tamíd le-olám va-ed, ka-katúv: Ve-ajaltá ve-saváta, u-verajtá et YHVH Elohéja al ha-áretz ha-továh ashér natán laj.
Barúj Atáh YHVH, al ha-áretz ve-al ha-mazón.`,
          spanish: `Te damos gracias, YHVH nuestro Dios, por haber legado a nuestros antepasados una tierra codiciable, buena y amplia, pacto y Torá, vida y sustento; por habernos sacado de la tierra de Egipto y rescatado de la casa de servidumbre; por Tu pacto sellado en nuestra carne, por Tu Torá que nos enseñaste, por los preceptos de Tu voluntad que nos hiciste conocer, y por la vida y el alimento con que nos sustentas y provees continuamente, en todo día, en todo momento y a toda hora.
Y por todo ello, YHVH nuestro Dios, nosotros Te expresamos gratitud y bendecimos Tu Santo Nombre; bendito sea Tu Nombre en la boca de todo ser viviente continuamente por siempre jamás, según está escrito en Tu Torá: "Y comerás y te saciarás, y bendecirás a YHVH tu Dios por la buena tierra que te ha entregado" (Deuteronomio 8:10).
Bendito eres Tú, YHVH, por la tierra y por el sustento.`,
        },
        {
          id: 'beraja_3_yerushalayim',
          titleHebrew: 'בְּרָכָה ג׳: בּוֹנֵה יְרוּשָׁלָיִם',
          titleSpanish: '3. Reconstrucción de Jerusalén y el Templo',
          titleTranslit: 'Bonéh Yerushaláyim',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `רַחֶם נָא יהוה אֱלֹהֵינוּ עָלֵינוּ, וְעַל יִשְׂרָאֵל עַמֶּךָ, וְעַל יְרוּשָׁלַיִם עִירָךְ, וְעַל הַר צִיּוֹן מִשְׁכַּן כְּבוֹדָךְ, וְעַל מַלְכוּת בֵּית דָּוִד מְשִׁיחָךְ, וְעַל הַבַּיִת הַגָּדוֹל וְהַקָּדוֹשׁ שֶׁנִּקְרָא שִׁמְךָ עָלָיו:
אָבִינוּ, רְעֵנוּ, זוּנֵנוּ, פַּרְנְסֵנוּ, כַּלְכְּלֵנוּ, וְהַרְוִיחֵנוּ מְהֵרָה מִכָּל־צָרוֹתֵינוּ, וְנָא אַל תַּצְרִיכֵנוּ יהוה אֱלֹהֵינוּ לִידֵי מַתְּנַת בָּשָׂר וָדָם, וְלֹא לִידֵי הַלְוָאָתָם, כִּי אִם לְיָדְךָ הַמְּלֵאָה, הַפְּתוּחָה, הַקְּדוֹשָׁה וְהָרְחָבָה, שֶׁלֹּא נֵבוֹשׁ וְלֹא נִכָּלֵם לְעוֹלָם וָעֶד:
וּבְנֵה יְרוּשָׁלַיִם עִיר הַקֹּדֶשׁ בִּמְהֵרָה בְיָמֵינוּ:
בָּרוּךְ אַתָּה יהוה, בּוֹנֵה יְרוּשָׁלָיִם (אָמֵן):`,
          transliteration: `Rajém na YHVH Elohéinu aléinu, ve-al Yisraél améja, ve-al Yerushaláyim iráj, ve-al har Tziyón mishkán kevodáj, ve-al maljút beit Davíd meshijáj, ve-al ha-báyit ha-gadól ve-ha-kadósh she-nikrá shimjá aláv.
Avínu, re'énu, zunénu, parnesénu, kalkelénu, ve-harvijénu meheráh mi-kol tzarotéinu, ve-na al tatzrijénu YHVH Elohéinu li-ydéi matnát basár va-dam, ve-lo li-ydéi halvaatám, ki im le-yadjá ha-meleáh, ha-ptujáh, ha-kedosháh ve-ha-rjaváh, she-lo nevósh ve-lo nikalém le-olám va-ed.
U-vnéh Yerushaláyim ir ha-kódesh bi-mheráh ve-yameínu.
Barúj Atáh YHVH, bonéh Yerushaláyim (Amén).`,
          spanish: `Ten compasión, por favor, YHVH nuestro Dios, de nosotros y de Tu pueblo Israel, de Jerusalén Tu ciudad, del monte Sión morada de Tu gloria, del reinado de la casa de David Tu ungido y del Gran y Santo Templo sobre el cual fue proclamado Tu Nombre.
Padre nuestro: pastoréanos, aliméntanos, susténtanos, mantennos y alívianos con prontitud de todas nuestras tribulaciones; y no nos hagas dependientes, por favor, YHVH nuestro Dios, de las dádivas de seres de carne y hueso ni de sus préstamos humillantes, sino únicamente de Tu mano generosa, colmada, abierta, sagrada y amplia, para que jamás quedemos avergonzados ni humillados por la eternidad.
Y reconstruye a Jerusalén, la ciudad santa, con presteza en nuestros días.
Bendito eres Tú, YHVH, Reconstructor de Jerusalén (Amén).`,
        },
        {
          id: 'beraja_4_hatov',
          titleHebrew: 'בְּרָכָה ד׳: הַטּוֹב וְהַמֵּטִיב',
          titleSpanish: '4. El Rey Bondadoso y Bienhechor',
          titleTranslit: 'HaTov ve-HaMetív',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, לָעַד הָאֵל אָבִינוּ מַלְכֵּנוּ, אַדִּירֵנוּ, בּוֹרְאֵנוּ, גּוֹאֲלֵנוּ, יוֹצְרֵנוּ, קְדוֹשֵׁנוּ קְדוֹשׁ יַעֲקֹב, רוֹעֵנוּ רוֹעֵה יִשְׂרָאֵל, הַמֶּלֶךְ הַטּוֹב וְהַמֵּטִיב לַכֹּל:
שֶׁבְּכָל־יוֹם וָיוֹם הוּא הֵטִיב, הוּא מֵטִיב, הוּא יֵיטִיב לָנוּ, הוּא גְמָלָנוּ, הוּא גוֹמְלֵנוּ, הוּא יִגְמְלֵנוּ לָעַד, לְחֵן וּלְחֶסֶד וּלְרַחֲמִים וּלְרֶוַח, הַצָּלָה וְהַצְלָחָה, בְּרָכָה וִישׁוּעָה, נֶחָמָה, פַּרְנָסָה וְכַלְכָּלָה, וְרַחֲמִים וְחַיִּים וְשָׁלוֹם וְכָל־טוֹב, וּמִכָּל־טוּב לְעוֹלָם אַל יְחַסְּרֵנוּ:`,
          transliteration: `Barúj Atáh YHVH, Elohéinu Mélej ha-olám, la-ad ha-El Avínu Malkénu, Adirénu, Bor'énu, Goalénu, Yotzrénu, Kedoshénu Kedósh Yaakóv, Ro'énu Ro'éh Yisraél, ha-Mélej ha-Tov ve-ha-Metív la-kól.
She-be-jol yom va-yom Hu hetív, Hu metív, Hu yeitív lánu, Hu gmalánu, Hu gomlénu, Hu yigmelénu la-ad, le-jén u-le-jésed u-le-rajamím u-le-révaj, hatzaláh ve-hatzlajáh, berajáh vi-yshuáh, nejamáh, parnasáh ve-jalcaláh, ve-rajamím ve-jayím ve-shalóm ve-jol tov, u-mi-kol tuv le-olám al yejaserénu.`,
          spanish: `Bendito eres Tú, YHVH nuestro Dios, Rey del universo, eternamente Dios, Padre nuestro, Rey nuestro, Soberano excelso, Creador nuestro, Redentor nuestro, Formador nuestro, Santo nuestro, Santo de Jacob, Pastor nuestro, Pastor de Israel, el Rey que es bondadoso y prodiga el bien a todos.
Que en cada día Él hizo el bien, hace el bien y hará el bien con nosotros; Él nos retribuyó, nos retribuye y nos retribuirá siempre con gracia, benevolencia, misericordia, desahogo, rescate, éxito, bendición, salvación, consuelo, sustento y provisión, clemencia, vida, paz y todo bien, y de ningún bien jamás nos privará.`,
        },
        {
          id: 'harajaman_series',
          titleHebrew: 'הָרַחֲמָן (סִדְרַת בִּרְכוֹת מָרוֹקוֹ)',
          titleSpanish: 'La Letanía Tradicional Marroquí de HaRajamán',
          titleTranslit: 'HaRajamán',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: `הָרַחֲמָן, הוּא יִשְׁתַּבַּח עַל כִּסֵּא כְבוֹדוֹ:
הָרַחֲמָן, הוּא יִשְׁתַּבַּח בַּשָּׁמַיִם וּבָאָרֶץ:
הָרַחֲמָן, הוּא יִשְׁתַּבַּח בָּנוּ לְדוֹר דּוֹרִים:
הָרַחֲמָן, הוּא יִשְׁלַח לָנוּ בְּרָכָה מְרֻבָּה בַּבַּיִת הַזֶּה, וְעַל שֻׁלְחָן זֶה שֶׁאָכַלְנוּ עָלָיו:
הָרַחֲמָן, הוּא יְבָרֵךְ אֶת־בַּעַל הַבַּיִת הַזֶּה, וְאֶת־בַּעַל הַשֻּׁלְחָן הַזֶּה, אוֹתוֹ וְאֶת־בָּנָיו וְאֶת־אִשְׁתּוֹ וְאֶת־כָּל־אֲשֶׁר לוֹ:
הָרַחֲמָן, הוּא יְבָרֵךְ אֶת־כָּל־הַמְסֻבִּין כָּאן:
הָרַחֲמָן, הוּא יִשְׁלַח לָנוּ אֶת־אֵלִיָּהוּ הַנָּבִיא זָכוּר לַטּוֹב, וִיבַשֵּׂר לָנוּ בְּשׂוֹרוֹת טוֹבוֹת יְשׁוּעוֹת וְנֶחָמוֹת:
הָרַחֲמָן, הוּא יְזַכֵּנוּ לִימוֹת הַמָּשִׁיחַ, וּלְחַיֵּי הָעוֹלָם הַבָּא:
מַגְדִּיל (בשבת: מִגְדּוֹל) יְשׁוּעוֹת מַלְכּוֹ, וְעֹשֶׂה חֶסֶד לִמְשִׁיחוֹ, לְדָוִד וּלְזַרְעוֹ עַד־עוֹלָם:
כְּפִירִים רָשׁוּ וְרָעֵבוּ, וְדֹרְשֵׁי יהוה לֹא־יַחְסְרוּ כָל־טוֹב:
הוֹדוּ לַיהוה כִּי־טוֹב, כִּי לְעוֹלָם חַסְדּוֹ:
פּוֹתֵחַ אֶת־יָדֶךָ, וּמַשְׂבִּיעַ לְכָל־חַי רָצוֹן:
בָּרוּךְ הַגֶּבֶר אֲשֶׁר יִבְטַח בַּיהוה, וְהָיָה יהוה מִבְטַחוֹ:
יהוה עֹז לְעַמּוֹ יִתֵּן, יהוה יְבָרֵךְ אֶת־עַמּוֹ בַשָּׁלוֹם:
עוֹשֶׂה שָׁלוֹם בִּמְרוֹמָיו, הוּא בְּרַחֲמָיו יַעֲשֶׂה שָׁלוֹם עָלֵינוּ, וְעַל כָּל־יִשְׂרָאֵל, וְאִמְרוּ אָמֵן:`,
          transliteration: `Ha-Rajamán, Hu yishtabáj al kisé kevodó.
Ha-Rajamán, Hu yishtabáj ba-shamáyim u-va-áretz.
Ha-Rajamán, Hu yishtabáj bánu le-dor dorím.
Ha-Rajamán, Hu yishláj lánu berajáh merubáh ba-báyit ha-zéh, ve-al shulján zeh she-ajálnu aláv.
Ha-Rajamán, Hu yevaréj et baal ha-báyit ha-zéh, ve-et baal ha-shulján ha-zéh, otó ve-et banáv ve-et ishtó ve-et kol ashér lo.
Ha-Rajamán, Hu yevaréj et kol ha-mesubín kan.
Ha-Rajamán, Hu yishláj lánu et Eliyáhu ha-Naví zajúr la-tov, vi-yvasér lánu besorót tovót, yeshuót ve-nejamót.
Ha-Rajamán, Hu yezakénu li-ymót ha-Mashíaj, u-le-jayéi ha-Olám ha-Bá.
Magdíl (en Shabat: Migdól) yeshuót malkó, ve-oséh jésed li-mshijó, le-Davíd u-le-zar'ó ad olám.
Kfirím rashú ve-ra'évu, ve-dorshéi YHVH lo yajserú jol tov.
Hodú la-YHVH ki tov, ki le-olám jasdó.
Potéaj et yadéja, u-masbía le-jól jai ratzón.
Barúj ha-géver ashér yivtáj ba-YHVH, ve-hayáh YHVH mivtajó.
YHVH oz le-amó yitén, YHVH yevaréj et amó va-shalóm.
Oséh shalóm bi-mromáv, Hu be-rajamáv yaaséh shalóm aléinu ve-al kol Yisraél, ve-imrú Amén.`,
          spanish: `El Misericordioso sea alabado sobre el trono de Su gloria.
El Misericordioso sea loado en los cielos y en la tierra.
El Misericordioso sea glorificado en nosotros de generación en generación.
El Misericordioso envíe abundante bendición a este hogar y sobre esta mesa en la que hemos comido.
El Misericordioso bendiga al anfitrión de este hogar y dueño de esta mesa, a él, a sus hijos, a su esposa y a todo lo que le pertenece.
El Misericordioso bendiga a todos los comensales aquí reunidos.
El Misericordioso nos envíe al profeta Elías, recordado para bien, para que nos anuncie buenas nuevas de salvación y consuelo.
El Misericordioso nos haga merecedores de los días del Mesías y de la vida del Mundo Venidero.
Engrandece las salvaciones de Su rey, y otorga benevolencia a Su ungido, a David y a su descendencia por la eternidad.
Los leoncillos padecen necesidad y sufren hambre, mas los que buscan a YHVH no carecerán de ningún bien.
Alabad a YHVH porque es bondadoso, porque para siempre es Su benevolencia.
Abres Tu mano generosa y sacias a todo ser viviente con complacencia.
Bendito es el varón que confía en YHVH, y cuya seguridad es YHVH.
YHVH dará fortaleza a Su pueblo; YHVH bendecirá a Su pueblo con la paz.
Quien hace la paz en Sus alturas celestiales, que Él con Su misericordia haga descender la paz sobre nosotros y sobre todo el pueblo de Israel, y digan: Amén.`,
          moroccanNote: `En las mesas marroquíes, la recitación de las peticiones de HaRajamán se entona comunitariamente a coro con júbilo y aplausos al llegar a "Magdíl yeshuót malkó", augurando sustento y bendición para la casa.`,
        },
      ],
    },
  ],
};
