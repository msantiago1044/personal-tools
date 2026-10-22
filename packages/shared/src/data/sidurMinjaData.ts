import { SidurTefila } from '../types';
import { SHAJARIT_DATA } from './sidurShajaritData';

// Obtenemos los segmentos íntegros de la Amidá y Alénu de Shajarit para garantizar uniformidad
const shajaritAmidaSection = SHAJARIT_DATA.sections.find((s) => s.id === 'amida_jol');
const amidaSegments = shajaritAmidaSection ? shajaritAmidaSection.segments : [];
const shajaritAshreiSegment = SHAJARIT_DATA.sections
  .find((s) => s.id === 'pesukei_dezimra')
  ?.segments.find((seg) => seg.id === 'ashrei');
const shajaritPitumSegment = SHAJARIT_DATA.sections
  .find((s) => s.id === 'korbanot')
  ?.segments.find((seg) => seg.id === 'pitum_haketoret');
const shajaritAlenuSegment = SHAJARIT_DATA.sections
  .find((s) => s.id === 'conclusion_shajarit')
  ?.segments.find((seg) => seg.id === 'alenu_leshabeaj');

/**
 * Liturgia Completa de Minjá de Días de Semana (Jol)
 * Rito Sefardí-Marroquí Tradicional (Núsaj Kehilot Maroko)
 * 100% íntegro: texto completo sin elipsis ni recortes.
 */
export const MINJA_DATA: SidurTefila = {
  id: 'minja',
  nameHebrew: 'תְּפִלַּת מִנְחָה לְחוֹל',
  nameSpanish: 'Minjá de Días de Semana',
  nameTranslit: 'Tefilat Minjáh le-Jol',
  timeOfDay: 'afternoon',
  description: `La oración vespertina instituida por nuestro patriarca Isaac en el momento de máxima receptividad celestial: Pitúm HaKetóret, Ashréi de David íntegro, la Amidá de 19 bendiciones completa, Tajanún y Alénu LeShabéaj.`,
  sections: [
    // ------------------------------------------------------------------------
    // SECCIÓN 1: PREPARACIÓN Y ASHRÉI
    // ------------------------------------------------------------------------
    {
      id: 'minja_intro',
      order: 1,
      titleHebrew: 'קָרְבָּנוֹת וְאַשְׁרֵי',
      titleSpanish: 'Preparación: Pitum HaKetoret y Salmo Ashréi',
      titleTranslit: 'Korbanót ve-Ashréi',
      description: `Purificación mediante la rememoración del incienso vespertino y Salmo 145 davídico.`,
      segments: [
        {
          id: 'minja_pitum',
          titleHebrew: 'פִּטּוּם הַקְּטֹרֶת לְמִנְחָה',
          titleSpanish: 'Pitúm HaKetóret Vespertino Íntegro',
          titleTranslit: 'Pitúm HaKetóret de-Minjáh',
          posture: { type: 'sitting', label: 'Sentado' },
          hebrew: shajaritPitumSegment ? shajaritPitumSegment.hebrew : '',
          transliteration: shajaritPitumSegment ? shajaritPitumSegment.transliteration : '',
          spanish: shajaritPitumSegment ? shajaritPitumSegment.spanish : '',
          moroccanNote: `En Marruecos se inicia Minjá invariablemente con la lectura pausada de Pitúm HaKetóret para evocar la ofrenda del atardecer que apacigua el juicio estricto.`,
        },
        {
          id: 'minja_ashrei',
          titleHebrew: 'אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ',
          titleSpanish: 'Salmo 145 Íntegro de la Alef a la Tav',
          titleTranslit: 'Ashréi Yoshvéi Vetéja',
          posture: {
            type: 'sitting',
            label: 'Sentado',
            instruction: `Abra las palmas al decir "Potéaj et yadéja" con concentración plena en la provisión del sustento divino.`,
          },
          hebrew: shajaritAshreiSegment ? shajaritAshreiSegment.hebrew : '',
          transliteration: shajaritAshreiSegment ? shajaritAshreiSegment.transliteration : '',
          spanish: shajaritAshreiSegment ? shajaritAshreiSegment.spanish : '',
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 2: AMIDÁ VESPERTINA (19 BENDICIONES COMPLETAS)
    // ------------------------------------------------------------------------
    {
      id: 'minja_amida_section',
      order: 2,
      titleHebrew: 'עֲמִידָה שֶׁל מִנְחָה (19 בְּרָכוֹת)',
      titleSpanish: 'La Amidá · Las 19 Bendiciones de Minjá',
      titleTranslit: 'Shemonéh Esréh de-Minjáh',
      description: `Las 19 bendiciones tradicionales completas recitadas de pie con pies juntos mirando hacia Jerusalén.`,
      segments: amidaSegments.map((seg) => ({
        ...seg,
        id: `minja_${seg.id}`,
      })),
    },

    // ------------------------------------------------------------------------
    // SECCIÓN 3: TAJANÚN Y ALÉNU LESHABÉAJ
    // ------------------------------------------------------------------------
    {
      id: 'minja_cierre',
      order: 3,
      titleHebrew: 'תַּחֲנוּן וְעָלֵינוּ לְשַׁבֵּחַ',
      titleSpanish: 'Tajanún Vespertino y Alénu LeShabéaj',
      titleTranslit: 'Tajanún u-ve-Alénu LeShabéaj',
      description: `Súplica penitencial del atardecer y magna proclamación final de la Unicidad Divina.`,
      segments: [
        {
          id: 'minja_tajanun',
          titleHebrew: 'וִדּוּי, י״ג מִדּוֹת וְנֶפִילַת אַפַּיִם',
          titleSpanish: 'Vidui, Trece Atributos y Súplica Vespertina',
          titleTranslit: 'Vidúi ve-Yud Guímel Midót',
          posture: {
            type: 'chest_beat',
            label: 'De pie / Inclinación',
            instruction: `Confesión de faltas (Ashamnu) golpeándose el pecho, seguida de los Trece Atributos Divinos y súplica penitencial.`,
          },
          hebrew: `אָנָּא יהוה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ, תָּבֹא לְפָנֶיךָ תְּפִלָּתֵנוּ, וְאַל תִּתְעַלַּם מַלְכֵּנוּ מִתְּחִנָּתֵנוּ:
אָשַׁמְנוּ, בָּגַדְנוּ, גָּזַלְנוּ, דִּבַּרְנוּ דֹפִי:
הֶעֱוִינוּ, וְהִרְשַׁעְנוּ, זַדְנוּ, חָמַסְנוּ, טָפַלְנוּ שֶׁקֶר:
יָעַצְנוּ רָע, כִּזַּבְנוּ, לַצְנוּ, מָרַדְנוּ, נִאַצְנוּ, סָרַרְנוּ, עָוִינוּ, פָּשַׁעְנוּ, צָרַרְנוּ, קִשִּׁינוּ עֹרֶף:
רָשַׁעְנוּ, שִׁחַתְנוּ, תִּעַבְנוּ, תָּעִינוּ, תִּעְתָּעְנוּ:
סַרְנוּ מִמִּצְוֹתֶיךָ וּמִמִּשְׁפָּטֶיךָ הַטּוֹבִים וְלֹא שָׁוָה לָנוּ: וְאַתָּה צַדִּיק עַל כָּל־הַבָּא עָלֵינוּ, כִּי אֱמֶת עָשִׂיתָ וַאֲנַחְנוּ הִרְשָׁעְנוּ:

אֵל מֶלֶךְ יוֹשֵׁב עַל כִּסֵּא רַחֲמִים, וּמִתְנַהֵג בַּחֲסִידוּת, מוֹחֵל עֲוֹנוֹת עַמּוֹ, מַעֲבִיר רִאשׁוֹן רִאשׁוֹן, מַרְבֶּה מְחִילָה לַחַטָּאִים וּסְלִיחָה לַפּוֹשְׁעִים, עוֹשֶׂה צְדָקוֹת עִם כָּל־בָּשָׂר וָרוּחַ, לֹא כְרָעָתָם לָהֶם גּוֹמֵל:
אֵל הוֹרֵתָנוּ לוֹמַר שְׁלֹשׁ עֶשְׂרֵה, זְכָר־לָנוּ הַיּוֹם בְּרִית שְׁלֹשׁ עֶשְׂרֵה, כְּמוֹ שֶׁהוֹדַעְתָּ לֶעָנָו מִקֶּדֶם, כְּמוֹ שֶׁכָּתוּב: וַיֵּרֶד יהוה בֶּעָנָן וַיִּתְיַצֵּב עִמּוֹ שָׁם, וַיִּקְרָא בְשֵׁם יהוה:
וַיַּעֲבֹר יהוה עַל־פָּנָיו וַיִּקְרָא:
יהוה | יהוה | אֵל רַחוּם וְחַנּוּן, אֶרֶךְ אַפַּיִם, וְרַב־חֶסֶד וֶאֱמֶת:
נֹצֵר חֶסֶד לָאֲלָפִים, נֹשֵׂא עָוֹן וָפֶשַׁע וְחַטָּאָה, וְנַקֵּה:
וַאֲנַחְנוּ לֹא נֵדַע מַה־נַּעֲשֶׂה, כִּי עָלֶיךָ עֵינֵינוּ: זְכֹר־רַחֲמֶיךָ יהוה וַחֲסָדֶיךָ, כִּי מֵעוֹלָם הֵמָּה: יְהִי חַסְדְּךָ יהוה עָלֵינוּ, כַּאֲשֶׁר יִחַלְנוּ לָךְ:`,
          transliteration: `Aná YHVH Elohéinu ve-Elohéi avotéinu, tavó lefanéja tefilaténu, ve-al titalám Malkénu mi-tejinaténu:
Ashámnu, bagádnu, gazálnu, dibárnu dófi.
Heevínu, ve-hirshánu, zádnu, jamásnu, tafálnu shéker.
Yaátznu ra, kizávnu, látznu, marádnu, niátznu, sarárnu, avínu, pashánu, tzarárnu, kishínu óref.
Rashánu, shijátnu, tiávnu, taínu, titánu.
Sárnu mi-mitzvotéja u-mi-mishpatéja ha-tovím ve-lo shávah lánu. Ve-Atáh tzadík al kol ha-ba aléinu, ki emét asíta va-anájnu hirshánu.

El Mélej yoshév al kisé rajamím, u-mitnahég ba-jasidút, mojél avonót amó, maavír rishón rishón, marbéh mejiláh la-jataím u-slijáh la-posheím, oséh tzedakót im kol basár va-rúaj, lo je-raatám lahém gomél.
El horetánu lomár shelósh esréh, zjor lánu ha-yom berít shelósh esréh, kemó she-hodáta le-anáv mi-kédem, kemó she-katúv: Va-yéred YHVH be-anán va-yityatzév imó sham, va-yikrá ve-shém YHVH.
Va-yaavór YHVH al panáv va-yikrá:
YHVH | YHVH | El rajúm ve-janún, érej apáyim, ve-rav jésed ve-emét.
Notzér jésed la-alafím, nosé avón va-fésha ve-jataáh, ve-nakéh.
Va-anájnu lo nedá mah naaséh, ki aléja einéinu. Zjór rajaméja YHVH va-jasadéja, ki me-olám hémmah. Yehí jasdejá YHVH aléinu, ka-ashér yijálnu laj.`,
          spanish: `Por favor, YHVH nuestro Dios y Dios de nuestros antepasados, llegue ante Tu presencia nuestra oración y no Te desentiendas, Rey nuestro, de nuestra súplica:
Hemos incurrido en culpa, hemos traicionado, hemos despojado, hemos proferido calumnias;
hemos actuado con iniquidad, hemos delinquido, hemos pecado con soberbia, hemos violentado, hemos tramado falsedades;
hemos dado malos consejos, hemos mentido, nos hemos burlado, nos hemos rebelado, hemos provocado la ira divina, nos hemos apartado del bien, hemos delinquido deliberadamente, hemos hostigado, hemos sido tercos de cerviz;
hemos sido impíos, nos hemos corrompido, hemos actuado abominablemente, nos hemos extraviado y hemos desviado a otros del buen camino.
Nos apartamos de Tus preceptos y de Tus juicios benévolos, y nada bueno nos reportó. Pero Tú eres justo ante todo lo que nos acontece, pues con fidelidad actuaste, mas nosotros hemos obrado con perversidad.

Dios, Rey entronizado sobre el solio de misericordia, que se conduce con generosidad benévola, que perdona las iniquidades de Su pueblo disipando una a una las primeras faltas; que abunda en perdón para los pecadores y clemencia para los transgresores; que obra rectitud con toda criatura y espíritu y no les retribuye según sus malas acciones.
Oh Dios, nos instruiste a recitar los Trece Atributos: evoca para nosotros hoy el pacto de los Trece Atributos tal como revelaste al más humilde de los hombres antaño, según está escrito: "Y descendió YHVH en la nube y se apostó allí con él, y proclamó el Nombre de YHVH. Y pasó YHVH ante su faz y proclamó":
¡YHVH, YHVH! Dios compasivo y clemente, paciente para la ira y abundante en benevolencia y verdad; que preserva Su bondad para millares de generaciones, que perdona la iniquidad, la rebelión y el pecado, y absuelve.
Y nosotros no sabemos qué hacer, pues solo hacia Ti están elevados nuestros ojos. Acuérdate de Tus misericordias, YHVH, y de Tus bondades, que desde la eternidad existen. Sea Tu benevolencia, YHVH, sobre nosotros, tal como en Ti hemos esperado.`,
        },
        {
          id: 'minja_alenu',
          titleHebrew: 'עָלֵינוּ לְשַׁבֵּחַ לְמִנְחָה',
          titleSpanish: 'Alénu LeShabéaj de la Tarde (Completo)',
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
