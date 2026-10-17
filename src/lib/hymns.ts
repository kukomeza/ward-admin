export interface HymnInfo {
  number: string;
  pageNumber?: string;
  title: string;
  category: string;
  isSacrament: boolean;
  isChildren?: boolean;
  url: string;
}

/**
 * Catálogo oficial completo de Himnos y Canciones para los niños en español (409 en total):
 * - Himnario tradicional (#1 al #209)
 * - Himnos — Para el hogar y la Iglesia (#1001 al #1072 y #1201 al #1210)
 * - Canciones para los niños / Primaria (#CN 2 al #CN 148)
 * Incluye los enlaces directos a la Biblioteca del Evangelio para escuchar/reproducir el himno y ver la partitura.
 */
export const HYMNS_CATALOG: HymnInfo[] = [
  {
    "number": "1",
    "title": "Ya rompe el alba",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-morning-breaks?lang=spa"
  },
  {
    "number": "2",
    "title": "El Espíritu de Dios",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-spirit-of-god?lang=spa"
  },
  {
    "number": "3",
    "title": "Ya regocijemos",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/now-let-us-rejoice?lang=spa"
  },
  {
    "number": "4",
    "title": "Bandera de Sión",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/high-on-the-mountain-top?lang=spa"
  },
  {
    "number": "5",
    "title": "Oh Dios de Israel",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/redeemer-of-israel?lang=spa"
  },
  {
    "number": "6",
    "title": "Israel, Jesús os llama",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/israel-israel-god-is-calling?lang=spa"
  },
  {
    "number": "7",
    "title": "Id, vosotros mensajeros",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/go-ye-messengers-of-heaven?lang=spa"
  },
  {
    "number": "8",
    "title": "¿Qué es lo que vieron en las alturas?",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/what-was-witnessed-in-the-heavens?lang=spa"
  },
  {
    "number": "9",
    "title": "Un ángel del Señor",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/an-angel-from-on-high?lang=spa"
  },
  {
    "number": "10",
    "title": "Te damos, Señor, nuestras gracias",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/we-thank-thee-o-god-for-a-prophet?lang=spa"
  },
  {
    "number": "11",
    "title": "Dios manda a profetas",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-listen-to-a-prophets-voice?lang=spa"
  },
  {
    "number": "12",
    "title": "Pedimos hoy por ti",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/we-ever-pray-for-thee?lang=spa"
  },
  {
    "number": "13",
    "title": "Bendice, Dios, a nuestro Profeta",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-bless-our-prophet-dear?lang=spa"
  },
  {
    "number": "14",
    "title": "La oración del Profeta",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/joseph-smiths-first-prayer?lang=spa"
  },
  {
    "number": "15",
    "title": "Loor al Profeta",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/praise-to-the-man?lang=spa"
  },
  {
    "number": "16",
    "title": "Un pobre forastero",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/a-poor-wayfaring-man-of-grief?lang=spa"
  },
  {
    "number": "17",
    "title": "¡Oh, está todo bien!",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-come-ye-saints?lang=spa"
  },
  {
    "number": "18",
    "title": "Oh Sión, santuario de libertad",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/o-ye-mountains-high?lang=spa"
  },
  {
    "number": "19",
    "title": "Por Tus dones loor cantamos",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/for-the-strength-of-the-hills?lang=spa"
  },
  {
    "number": "20",
    "title": "Gozoso día llega ya",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-happy-day-at-last-has-come?lang=spa"
  },
  {
    "number": "21",
    "title": "¡Salve, Sión! Es tu día ilustre",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/hail-to-the-brightness-of-zions-glad-morning?lang=spa"
  },
  {
    "number": "22",
    "title": "En las cumbres de los montes",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/zion-stands-with-hills-surrounded?lang=spa"
  },
  {
    "number": "23",
    "title": "Bella Sión",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/beautiful-zion-built-above?lang=spa"
  },
  {
    "number": "24",
    "title": "El alba ya rompe",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-day-dawn-is-breaking?lang=spa"
  },
  {
    "number": "25",
    "title": "Jehová aparece en Su gloria",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/lo-the-mighty-god-appearing?lang=spa"
  },
  {
    "number": "26",
    "title": "Hijos del Señor, venid",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-ye-children-of-the-lord?lang=spa"
  },
  {
    "number": "27",
    "title": "Oh Rey de reyes, ven",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-o-thou-king-of-kings?lang=spa"
  },
  {
    "number": "28",
    "title": "Himno de batalla de la República",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/battle-hymn-of-the-republic?lang=spa"
  },
  {
    "number": "29",
    "title": "Ven, oh día prometido",
    "category": "La Restauración",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-thou-glorious-day-of-promise?lang=spa"
  },
  {
    "number": "30",
    "title": "A Cristo Rey Jesús",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/rejoice-the-lord-is-king?lang=spa"
  },
  {
    "number": "31",
    "title": "Oh, creaciones del Señor",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/all-creatures-of-our-god-and-king?lang=spa"
  },
  {
    "number": "32",
    "title": "Baluarte firme es nuestro Dios",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/a-mighty-fortress-is-our-god?lang=spa"
  },
  {
    "number": "33",
    "title": "Honor, loor y gloria",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/all-glory-laud-and-honor?lang=spa"
  },
  {
    "number": "34",
    "title": "Oh, Santo Dios, omnipotente ser",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-of-our-fathers-whose-almighty-hand?lang=spa"
  },
  {
    "number": "35",
    "title": "Haznos pensar en Ti, Señor",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-of-our-fathers-known-of-old-woodbury?lang=spa"
  },
  {
    "number": "36",
    "title": "Padre bendito, venimos a Ti",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-of-our-fathers-we-come-unto-thee?lang=spa"
  },
  {
    "number": "37",
    "title": "Glorias cantad a Dios",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/glory-to-god-on-high?lang=spa"
  },
  {
    "number": "38",
    "title": "Santos, avanzad",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/press-forward-saints?lang=spa"
  },
  {
    "number": "39",
    "title": "Jehová, sé nuestro guía",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/guide-us-o-thou-great-jehovah-harrison?lang=spa"
  },
  {
    "number": "40",
    "title": "Qué firmes cimientos",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/how-firm-a-foundation?lang=spa"
  },
  {
    "number": "41",
    "title": "¡Grande eres Tú!",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/how-great-thou-art?lang=spa"
  },
  {
    "number": "42",
    "title": "Jesús es mi luz",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-lord-is-my-light?lang=spa"
  },
  {
    "number": "43",
    "title": "Por la belleza terrenal",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/for-the-beauty-of-the-earth?lang=spa"
  },
  {
    "number": "44",
    "title": "El sublime Creador",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-is-love?lang=spa"
  },
  {
    "number": "45",
    "title": "Oración de gratitud",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/prayer-of-thanksgiving?lang=spa"
  },
  {
    "number": "46",
    "title": "Elevemos nuestros himnos",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-ye-thankful-people?lang=spa"
  },
  {
    "number": "47",
    "title": "Caros niños, Dios os ama",
    "category": "Alabanza y agradecimiento",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/dearest-children-god-is-near-you?lang=spa"
  },
  {
    "number": "48",
    "title": "Divina Luz",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/lead-kindly-light?lang=spa"
  },
  {
    "number": "49",
    "title": "Señor, te necesito",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/i-need-thee-every-hour?lang=spa"
  },
  {
    "number": "50",
    "title": "Más cerca, Dios, de ti",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/nearer-my-god-to-thee?lang=spa"
  },
  {
    "number": "51",
    "title": "Guíame, oh Salvador",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/jesus-savior-pilot-me?lang=spa"
  },
  {
    "number": "52",
    "title": "Guíame a Ti",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/guide-me-to-thee?lang=spa"
  },
  {
    "number": "53",
    "title": "¡Oh Jesús, mi gran amor!",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/jesus-lover-of-my-soul?lang=spa"
  },
  {
    "number": "54",
    "title": "Paz, cálmense",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/master-the-tempest-is-raging?lang=spa"
  },
  {
    "number": "55",
    "title": "Dios da valor",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-speed-the-right?lang=spa"
  },
  {
    "number": "56",
    "title": "Jehová mi Pastor es",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-lord-is-my-shepherd?lang=spa"
  },
  {
    "number": "57",
    "title": "El amor del Salvador",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/our-saviors-love?lang=spa"
  },
  {
    "number": "58",
    "title": "Roca de eternidad",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/rock-of-ages?lang=spa"
  },
  {
    "number": "59",
    "title": "Mirad al Salvador",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/behold-the-lamb-of-god?lang=spa"
  },
  {
    "number": "60",
    "title": "Venid a Cristo",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-unto-jesus?lang=spa"
  },
  {
    "number": "61",
    "title": "Venid a Mí",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-follow-me?lang=spa"
  },
  {
    "number": "62",
    "title": "No desmayéis, oh santos",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/take-courage-saints?lang=spa"
  },
  {
    "number": "63",
    "title": "Aunque colmados de pesar",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/though-deepening-trials?lang=spa"
  },
  {
    "number": "64",
    "title": "Venid, los que a Dios amáis",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-we-that-love-the-lord?lang=spa"
  },
  {
    "number": "65",
    "title": "¿Sin contestar?",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/unanswered-yet-the-prayer?lang=spa"
  },
  {
    "number": "66",
    "title": "Cuán dulce la ley de Dios",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/how-gentle-gods-commands?lang=spa"
  },
  {
    "number": "67",
    "title": "Si la vía es penosa",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/if-the-way-be-full-of-trial?lang=spa"
  },
  {
    "number": "68",
    "title": "La fe",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/when-faith-endures?lang=spa"
  },
  {
    "number": "69",
    "title": "¿Dónde hallo el solaz?",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/where-can-i-turn-for-peace?lang=spa"
  },
  {
    "number": "70",
    "title": "Sé humilde",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/be-thou-humble?lang=spa"
  },
  {
    "number": "71",
    "title": "Más santidad dame",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/more-holiness-give-me?lang=spa"
  },
  {
    "number": "72",
    "title": "Creo en Cristo",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/i-believe-in-christ?lang=spa"
  },
  {
    "number": "73",
    "title": "Yo sé que vive mi Señor",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/i-know-that-my-redeemer-lives?lang=spa"
  },
  {
    "number": "74",
    "title": "Vive mi Señor",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/my-redeemer-lives?lang=spa"
  },
  {
    "number": "75",
    "title": "Testimonio",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/testimony?lang=spa"
  },
  {
    "number": "76",
    "title": "Tan sólo con pensar en Ti",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/jesus-the-very-thought-of-thee?lang=spa"
  },
  {
    "number": "77",
    "title": "Deja que el Espíritu te enseñe",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/let-the-holy-spirit-guide?lang=spa"
  },
  {
    "number": "78",
    "title": "Oh dulce, grata oración",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/sweet-hour-of-prayer?lang=spa"
  },
  {
    "number": "79",
    "title": "La oración del alma es",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/prayer-is-the-souls-sincere-desire?lang=spa"
  },
  {
    "number": "80",
    "title": "Secreta oración",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/secret-prayer?lang=spa"
  },
  {
    "number": "81",
    "title": "¿Pensaste orar?",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/did-you-think-to-pray?lang=spa"
  },
  {
    "number": "82",
    "title": "Padre en los cielos",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/father-in-heaven?lang=spa"
  },
  {
    "number": "83",
    "title": "Entonad sagrado son",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/gently-raise-the-sacred-strain?lang=spa"
  },
  {
    "number": "84",
    "title": "Dulce Tu obra es, Señor",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/sweet-is-the-work?lang=spa"
  },
  {
    "number": "85",
    "title": "El día santo del Señor",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/sweet-sabbath-day?lang=spa"
  },
  {
    "number": "86",
    "title": "Nuestro bondadoso Padre",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/o-thou-kind-and-gracious-father?lang=spa"
  },
  {
    "number": "87",
    "title": "Cual rocío, que destila",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/as-the-dew-from-heaven-distilling?lang=spa"
  },
  {
    "number": "88",
    "title": "Placentero nos es trabajar",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/how-pleasing-it-is-to-work?lang=spa"
  },
  {
    "number": "89",
    "title": "Para siempre Dios esté con Vos",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-be-with-you-till-we-meet-again?lang=spa"
  },
  {
    "number": "90",
    "title": "Padre, antes de partir",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/lord-we-ask-thee-ere-we-part?lang=spa"
  },
  {
    "number": "91",
    "title": "Al partir cantemos",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/sing-we-now-at-parting?lang=spa"
  },
  {
    "number": "92",
    "title": "Hemos sentido Tu amor",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/we-have-partaken-of-thy-love?lang=spa"
  },
  {
    "number": "93",
    "title": "A Ti, Señor",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/before-thee-lord-i-bow-my-head?lang=spa"
  },
  {
    "number": "94",
    "title": "Ya termina el día",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/now-the-day-is-over?lang=spa"
  },
  {
    "number": "95",
    "title": "El fuego del Espíritu",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/thy-spirit-lord-has-stirred-our-souls?lang=spa"
  },
  {
    "number": "96",
    "title": "El ocaso viene ya",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/softly-now-the-light-of-day?lang=spa"
  },
  {
    "number": "97",
    "title": "Ante Ti, Señor, Tu grey",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/lord-we-come-before-thee-now?lang=spa"
  },
  {
    "number": "98",
    "title": "Conmigo quédate, Señor",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/abide-with-me-tis-eventide?lang=spa"
  },
  {
    "number": "99",
    "title": "Acompáñame",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/abide-with-me?lang=spa"
  },
  {
    "number": "100",
    "title": "Dios, bendícenos",
    "category": "Súplica",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/lord-dismiss-us-with-thy-blessing?lang=spa"
  },
  {
    "number": "101",
    "title": "Dios, escúchanos orar",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-our-father-hear-us-pray?lang=spa"
  },
  {
    "number": "102",
    "title": "Hoy con humildad te pido",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/in-humility-our-savior?lang=spa"
  },
  {
    "number": "103",
    "title": "La Santa Cena",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/while-of-these-emblems-we-partake-saul?lang=spa"
  },
  {
    "number": "104",
    "title": "Oh Dios, Eterno Padre",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/o-god-the-eternal-father?lang=spa"
  },
  {
    "number": "105",
    "title": "Jesús de Nazaret",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/jesus-of-nazareth-savior-and-king?lang=spa"
  },
  {
    "number": "106",
    "title": "Cuán grato es cantar loor",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/tis-sweet-to-sing-the-matchless-love-hancock?lang=spa"
  },
  {
    "number": "107",
    "title": "Pedimos Tu Espíritu",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/o-lord-of-hosts?lang=spa"
  },
  {
    "number": "108",
    "title": "Mansos, reverentes hoy",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/reverently-and-meekly-now?lang=spa"
  },
  {
    "number": "109",
    "title": "Cantemos todos a Jesús",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/well-sing-all-hail-to-jesus-name?lang=spa"
  },
  {
    "number": "110",
    "title": "En memoria de Tu muerte",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/in-remembrance-of-thy-suffering?lang=spa"
  },
  {
    "number": "111",
    "title": "En el Calvario, en la cruz",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/upon-the-cross-of-calvary?lang=spa"
  },
  {
    "number": "112",
    "title": "El Padre tanto nos amó",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-loved-us-so-he-sent-his-son?lang=spa"
  },
  {
    "number": "113",
    "title": "Ya nos juntamos otra vez",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/again-we-meet-around-the-board?lang=spa"
  },
  {
    "number": "114",
    "title": "Cristo, el Redentor, murió",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/behold-the-great-redeemer-die?lang=spa"
  },
  {
    "number": "115",
    "title": "Nos reunimos, Padre, hoy",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/in-memory-of-the-crucified?lang=spa"
  },
  {
    "number": "116",
    "title": "Jesús, en la corte celestial",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/how-great-the-wisdom-and-the-love?lang=spa"
  },
  {
    "number": "117",
    "title": "¡Murió! El Redentor murió",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/he-died-the-great-redeemer-died?lang=spa"
  },
  {
    "number": "118",
    "title": "Asombro me da",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/i-stand-all-amazed?lang=spa"
  },
  {
    "number": "119",
    "title": "En un lejano cerro fue",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/there-is-a-green-hill-far-away?lang=spa"
  },
  {
    "number": "120",
    "title": "Tan humilde al nacer",
    "category": "La Santa Cena",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/jesus-once-of-humble-birth?lang=spa"
  },
  {
    "number": "121",
    "title": "Himno de la Pascua de Resurrección",
    "category": "La Pascua de Resurrección",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/he-is-risen?lang=spa"
  },
  {
    "number": "122",
    "title": "Cristo ha resucitado",
    "category": "La Pascua de Resurrección",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/christ-the-lord-is-risen-today?lang=spa"
  },
  {
    "number": "123",
    "title": "¡Regocijad! Jesús nació",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/joy-to-the-world?lang=spa"
  },
  {
    "number": "124",
    "title": "Venid, adoremos",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/oh-come-all-ye-faithful?lang=spa"
  },
  {
    "number": "125",
    "title": "Jesús en pesebre",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/away-in-a-manger?lang=spa"
  },
  {
    "number": "126",
    "title": "Cantan santos ángeles",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/angels-we-have-heard-on-high?lang=spa"
  },
  {
    "number": "127",
    "title": "Noche de luz",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/silent-night?lang=spa"
  },
  {
    "number": "128",
    "title": "A medianoche se oyó",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/it-came-upon-the-midnight-clear?lang=spa"
  },
  {
    "number": "129",
    "title": "Oh, pueblecito de Belén",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/o-little-town-of-bethlehem?lang=spa"
  },
  {
    "number": "130",
    "title": "Escuchad el son triunfal",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/hark-the-herald-angels-sing?lang=spa"
  },
  {
    "number": "131",
    "title": "Asombro dio a los magos",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/with-wondering-awe?lang=spa"
  },
  {
    "number": "132",
    "title": "La primera Navidad",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-first-noel?lang=spa"
  },
  {
    "number": "133",
    "title": "Campanas de Navidad",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/i-heard-the-bells-on-christmas-day?lang=spa"
  },
  {
    "number": "134",
    "title": "En la Judea, en tierra de Dios",
    "category": "La Navidad",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/far-far-away-on-judeas-plains?lang=spa"
  },
  {
    "number": "135",
    "title": "Hoy sembramos la semilla",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/we-are-sowing?lang=spa"
  },
  {
    "number": "136",
    "title": "Todos los santos",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/for-all-the-saints?lang=spa"
  },
  {
    "number": "137",
    "title": "Tú me has dado muchas bendiciones, Dios",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/because-i-have-been-given-much?lang=spa"
  },
  {
    "number": "138",
    "title": "Señor, yo te seguiré",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/lord-i-would-follow-thee?lang=spa"
  },
  {
    "number": "139",
    "title": "Ama el Pastor las ovejas",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/dear-to-the-heart-of-the-shepherd?lang=spa"
  },
  {
    "number": "140",
    "title": "A Dios el Padre y a Jesús",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/praise-god-from-whom-all-blessings-flow?lang=spa"
  },
  {
    "number": "141",
    "title": "¿En el mundo he hecho bien?",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/have-i-done-any-good?lang=spa"
  },
  {
    "number": "142",
    "title": "Otro año ha pasado",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/one-more-year-has-gone?lang=spa"
  },
  {
    "number": "143",
    "title": "A Dios ofrecemos gozosa canción",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-joy-and-the-song?lang=spa"
  },
  {
    "number": "144",
    "title": "A la gloria marcharemos",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/we-are-marching-on-to-glory?lang=spa"
  },
  {
    "number": "145",
    "title": "La voz, ya, del eterno",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/improve-the-shining-moments?lang=spa"
  },
  {
    "number": "146",
    "title": "Tengo gozo en mi alma hoy",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/there-is-sunshine-in-my-soul-today?lang=spa"
  },
  {
    "number": "147",
    "title": "Recojamos los destellos",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/catch-the-sunshine?lang=spa"
  },
  {
    "number": "148",
    "title": "Si hay gozo en tu corazón",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/you-can-make-the-pathway-bright?lang=spa"
  },
  {
    "number": "149",
    "title": "Trabajad con fervor",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/today-while-the-sun-shines?lang=spa"
  },
  {
    "number": "150",
    "title": "Siembra gozo",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/scatter-sunshine?lang=spa"
  },
  {
    "number": "151",
    "title": "Oh, hablemos con tiernos acentos",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/let-us-oft-speak-kind-words?lang=spa"
  },
  {
    "number": "152",
    "title": "No hablemos con enojo",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/angry-words-oh-let-them-never?lang=spa"
  },
  {
    "number": "153",
    "title": "Oíd el toque del clarín",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/hark-listen-to-the-trumpeters?lang=spa"
  },
  {
    "number": "154",
    "title": "Haz tú lo justo",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/do-what-is-right?lang=spa"
  },
  {
    "number": "155",
    "title": "Haz el bien",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/choose-the-right?lang=spa"
  },
  {
    "number": "156",
    "title": "Señor del cielo, Jehová",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/jehovah-lord-of-heaven-and-earth?lang=spa"
  },
  {
    "number": "157",
    "title": "Cuenta tus bendiciones",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/count-your-blessings?lang=spa"
  },
  {
    "number": "158",
    "title": "Trabajemos hoy en la obra",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/let-us-all-press-on?lang=spa"
  },
  {
    "number": "159",
    "title": "Con valor marchemos",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/onward-christian-soldiers?lang=spa"
  },
  {
    "number": "160",
    "title": "Tu casa amamos, Dios",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/we-love-thy-house-o-god?lang=spa"
  },
  {
    "number": "161",
    "title": "Llamados a servir",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/called-to-serve?lang=spa"
  },
  {
    "number": "162",
    "title": "Somos los soldados",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/we-are-all-enlisted?lang=spa"
  },
  {
    "number": "163",
    "title": "¡Mirad! Reales huestes",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/behold-a-royal-army?lang=spa"
  },
  {
    "number": "164",
    "title": "Pon tu hombro a la lid",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/put-your-shoulder-to-the-wheel?lang=spa"
  },
  {
    "number": "165",
    "title": "Tu palabra",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/thy-holy-word?lang=spa"
  },
  {
    "number": "166",
    "title": "Firmes creced en la fe",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/true-to-the-faith?lang=spa"
  },
  {
    "number": "167",
    "title": "A vencer",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/carry-on?lang=spa"
  },
  {
    "number": "168",
    "title": "Juventud de Israel",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/hope-of-israel?lang=spa"
  },
  {
    "number": "169",
    "title": "Al mundo ve a predicar",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/go-forth-with-faith?lang=spa"
  },
  {
    "number": "170",
    "title": "¿Quién sigue al Señor?",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/whos-on-the-lords-side?lang=spa"
  },
  {
    "number": "171",
    "title": "La luz de la verdad",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/hark-all-ye-nations?lang=spa"
  },
  {
    "number": "172",
    "title": "Cuando enseñe a Tus hijos",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/help-me-teach-with-inspiration?lang=spa"
  },
  {
    "number": "173",
    "title": "El fin se acerca",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-time-is-far-spent?lang=spa"
  },
  {
    "number": "174",
    "title": "Qué maravillosas Tus obras",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/how-wondrous-and-great?lang=spa"
  },
  {
    "number": "175",
    "title": "A donde me mandes iré",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/ill-go-where-you-want-me-to-go?lang=spa"
  },
  {
    "number": "176",
    "title": "Palabras de amor",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/oh-holy-words-of-truth-and-love?lang=spa"
  },
  {
    "number": "177",
    "title": "¿Qué es la verdad?",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/oh-say-what-is-truth?lang=spa"
  },
  {
    "number": "178",
    "title": "Nuestra mente se refleja",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/truth-reflects-upon-our-senses?lang=spa"
  },
  {
    "number": "179",
    "title": "La barra de hierro",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-iron-rod?lang=spa"
  },
  {
    "number": "180",
    "title": "Al leer las Escrituras",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/as-i-search-the-holy-scriptures?lang=spa"
  },
  {
    "number": "181",
    "title": "Cuando raya el nuevo dia",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-away-to-the-sunday-school?lang=spa"
  },
  {
    "number": "182",
    "title": "Bienvenido, día santo",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/welcome-welcome-sabbath-morning?lang=spa"
  },
  {
    "number": "183",
    "title": "Santos templos de Sión",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/holy-temples-on-mount-zion?lang=spa"
  },
  {
    "number": "184",
    "title": "Id, oh santos, a los templos",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/rise-ye-saints-and-temples-enter?lang=spa"
  },
  {
    "number": "185",
    "title": "En los postreros días",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-glorious-gospel-light-has-shone?lang=spa"
  },
  {
    "number": "186",
    "title": "Volved vuestro corazón",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/turn-your-hearts?lang=spa"
  },
  {
    "number": "187",
    "title": "Oh mi Padre",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/o-my-father?lang=spa"
  },
  {
    "number": "188",
    "title": "Quienes nos brindan su amor",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/each-life-that-touches-ours-for-good?lang=spa"
  },
  {
    "number": "189",
    "title": "Oh Padre, llénanos de amor",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/o-love-that-glorifies-the-son?lang=spa"
  },
  {
    "number": "190",
    "title": "Hay un hogar eterno",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/beautiful-home?lang=spa"
  },
  {
    "number": "191",
    "title": "Con maravillas obra Dios",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/god-moves-in-a-mysterious-way?lang=spa"
  },
  {
    "number": "192",
    "title": "¿Por qué somos?",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/lord-accept-our-true-devotion?lang=spa"
  },
  {
    "number": "193",
    "title": "El hogar es como el cielo",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/home-can-be-a-heaven-on-earth?lang=spa"
  },
  {
    "number": "194",
    "title": "Cuando hay amor",
    "category": "Temas varios",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/love-at-home?lang=spa"
  },
  {
    "number": "195",
    "title": "Las familias pueden ser eternas",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/families-can-be-together-forever?lang=spa"
  },
  {
    "number": "196",
    "title": "Soy un hijo de Dios",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/i-am-a-child-of-god?lang=spa"
  },
  {
    "number": "197",
    "title": "Siempre obedece los mandamientos",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/keep-the-commandments?lang=spa"
  },
  {
    "number": "198",
    "title": "Hazme andar en la luz",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/teach-me-to-walk-in-the-light?lang=spa"
  },
  {
    "number": "199",
    "title": "Dios vive",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/i-know-my-father-lives?lang=spa"
  },
  {
    "number": "200",
    "title": "La luz de Dios",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/the-light-divine?lang=spa"
  },
  {
    "number": "201",
    "title": "Dios cuida a sus hijos",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/gods-daily-care?lang=spa"
  },
  {
    "number": "202",
    "title": "En el pueblo de Sión",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/in-our-lovely-deseret?lang=spa"
  },
  {
    "number": "203",
    "title": "Amad a otros",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/love-one-another?lang=spa"
  },
  {
    "number": "204",
    "title": "Hijos de nuestro Padre",
    "category": "Canciones para niños",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/children-of-our-heavenly-father?lang=spa"
  },
  {
    "number": "205",
    "title": "Sirvamos unidas (Mujeres)",
    "category": "Para mujeres",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/as-sisters-in-zion-women?lang=spa"
  },
  {
    "number": "206",
    "title": "Venid, los que tenéis de Dios el sacerdocio (Hombres)",
    "category": "Para hombres",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/come-all-ye-sons-of-god-men?lang=spa"
  },
  {
    "number": "207",
    "title": "Oh vos que sois llamados (Hombres)",
    "category": "Para hombres",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/ye-who-are-called-to-labor-men?lang=spa"
  },
  {
    "number": "208",
    "title": "Brillan rayos de clemencia (Hombres)",
    "category": "Para hombres",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/brightly-beams-our-fathers-mercy-men?lang=spa"
  },
  {
    "number": "209",
    "title": "Oh élderes de Israel (Hombres)",
    "category": "Para hombres",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/manual/hymns/ye-elders-of-israel-men?lang=spa"
  },
  {
    "number": "1001",
    "title": "Fuente de mis bendiciones",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/come-thou-fount-of-every-blessing?lang=spa"
  },
  {
    "number": "1002",
    "title": "Cuando vuelva el Salvador",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/when-the-savior-comes-again?lang=spa"
  },
  {
    "number": "1003",
    "title": "Reina paz en mi ser",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/it-is-well-with-my-soul?lang=spa"
  },
  {
    "number": "1004",
    "title": "Andaré con Cristo",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/i-will-walk-with-jesus?lang=spa"
  },
  {
    "number": "1005",
    "title": "Él cuida de las aves",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/his-eye-is-on-the-sparrow?lang=spa"
  },
  {
    "number": "1006",
    "title": "En tu corazón entona una canción",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/think-a-sacred-song?lang=spa"
  },
  {
    "number": "1007",
    "title": "En Ti pensamos",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/as-bread-is-broken?lang=spa"
  },
  {
    "number": "1008",
    "title": "Agua viva, pan de vida",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/bread-of-life-living-water?lang=spa"
  },
  {
    "number": "1009",
    "title": "Getsemaní",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/gethsemane?lang=spa"
  },
  {
    "number": "1010",
    "title": "Sublime gracia",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/amazing-grace?lang=spa"
  },
  {
    "number": "1011",
    "title": "Somos niños, de la mano del Señor",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/holding-hands-around-the-world?lang=spa"
  },
  {
    "number": "1012",
    "title": "En cualquier ocasión",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/anytime-anywhere?lang=spa"
  },
  {
    "number": "1013",
    "title": "Dios me da Su gracia",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/gods-gracious-love?lang=spa"
  },
  {
    "number": "1014",
    "title": "Mi buen pastor es Jehová",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/my-shepherd-will-supply-my-need?lang=spa"
  },
  {
    "number": "1015",
    "title": "Oh, cuán pleno, cuán profundo",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/oh-the-deep-deep-love-of-jesus?lang=spa"
  },
  {
    "number": "1016",
    "title": "Mirad las marcas de Jesús",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/behold-the-wounds-in-jesus-hands?lang=spa"
  },
  {
    "number": "1017",
    "title": "El Cristo es",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/this-is-the-christ?lang=spa"
  },
  {
    "number": "1018",
    "title": "Ven, oh, Cristo",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/come-lord-jesus?lang=spa"
  },
  {
    "number": "1019",
    "title": "Amar igual que Tú",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/to-love-like-thee?lang=spa"
  },
  {
    "number": "1020",
    "title": "Tiernamente Jesús hoy nos llama",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/softly-and-tenderly-jesus-is-calling?lang=spa"
  },
  {
    "number": "1021",
    "title": "Cristo me ama, lo sé",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/i-know-that-my-savior-loves-me?lang=spa"
  },
  {
    "number": "1022",
    "title": "Con fe en cada paso",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/faith-in-every-footstep?lang=spa"
  },
  {
    "number": "1023",
    "title": "Firme en las promesas",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/standing-on-the-promises?lang=spa"
  },
  {
    "number": "1024",
    "title": "Tengo fe en Jesús, mi Señor",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/i-have-faith-in-the-lord-jesus-christ?lang=spa"
  },
  {
    "number": "1025",
    "title": "Hoy te doy mi corazón",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/take-my-heart-and-let-it-be-consecrated?lang=spa"
  },
  {
    "number": "1026",
    "title": "Lugares santos",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/holy-places?lang=spa"
  },
  {
    "number": "1027",
    "title": "Soy bienvenido a Su hogar",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/welcome-home?lang=spa"
  },
  {
    "number": "1028",
    "title": "Mi pequeña luz",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/this-little-light-of-mine?lang=spa"
  },
  {
    "number": "1029",
    "title": "Los dones que el Padre derrama",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/i-cant-count-them-all?lang=spa"
  },
  {
    "number": "1030",
    "title": "Dios siempre cerca está",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/close-as-a-quiet-prayer?lang=spa"
  },
  {
    "number": "1031",
    "title": "Venid, oíd la voz de Cristo",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/come-hear-the-word-the-lord-has-spoken?lang=spa"
  },
  {
    "number": "1032",
    "title": "Mirad a Cristo",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/look-unto-christ?lang=spa"
  },
  {
    "number": "1033",
    "title": "Placentero nos es trabajar",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/oh-how-great-is-our-joy?lang=spa"
  },
  {
    "number": "1034",
    "title": "Soy pionero también",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/im-a-pioneer-too?lang=spa"
  },
  {
    "number": "1035",
    "title": "Honraré Su día",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/as-i-keep-the-sabbath-day?lang=spa"
  },
  {
    "number": "1036",
    "title": "El Libro de Mormón leeré",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/read-the-book-of-mormon-and-pray?lang=spa"
  },
  {
    "number": "1037",
    "title": "Vivir, servir, orar y cantar",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/im-gonna-live-so-god-can-use-me?lang=spa"
  },
  {
    "number": "1038",
    "title": "Es Jehová mi buen pastor",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/the-lords-my-shepherd?lang=spa"
  },
  {
    "number": "1039",
    "title": "Es gracias al Señor",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/because?lang=spa"
  },
  {
    "number": "1040",
    "title": "Prevalece Su voz",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/his-voice-as-the-sound?lang=spa"
  },
  {
    "number": "1041",
    "title": "Por mí la vida diste Tú",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/o-lord-who-gave-thy-life-for-me?lang=spa"
  },
  {
    "number": "1042",
    "title": "Clemente Dios, hoy cual ayer",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/thou-gracious-god-whose-mercy-lends?lang=spa"
  },
  {
    "number": "1043",
    "title": "Oh, Redentor, rogamos Tu perdón",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/help-us-remember?lang=spa"
  },
  {
    "number": "1044",
    "title": "Así nos ministró Cristo",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/how-did-the-savior-minister?lang=spa"
  },
  {
    "number": "1045",
    "title": "La senda es Jesús",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/jesus-is-the-way?lang=spa"
  },
  {
    "number": "1046",
    "title": "¿Puedes tú contar los astros?",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/can-you-count-the-stars-in-heaven?lang=spa"
  },
  {
    "number": "1047",
    "title": "Dios me conoce",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/he-cares-for-me?lang=spa"
  },
  {
    "number": "1048",
    "title": "A Ti oramos",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/our-prayer-to-thee?lang=spa"
  },
  {
    "number": "1049",
    "title": "José oró con fe",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/joseph-prayed-in-faith?lang=spa"
  },
  {
    "number": "1050",
    "title": "Ven a mí",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/stand-by-me?lang=spa"
  },
  {
    "number": "1051",
    "title": "Señor, un buen día es hoy",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/this-day-is-a-good-day-lord?lang=spa"
  },
  {
    "number": "1052",
    "title": "¡Oh, qué gozo nos da!",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/joyfully-bound?lang=spa"
  },
  {
    "number": "1053",
    "title": "Mis convenios",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/my-covenants?lang=spa"
  },
  {
    "number": "1054",
    "title": "Al bautizarme a Cristo seguiré",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/when-i-am-baptized?lang=spa"
  },
  {
    "number": "1055",
    "title": "El poder del Santo Espíritu",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/the-power-of-the-holy-ghost?lang=spa"
  },
  {
    "number": "1056",
    "title": "Elías y la suave voz",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/elijah-and-the-still-small-voice?lang=spa"
  },
  {
    "number": "1057",
    "title": "Mi pastor es Cristo",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/jesus-is-my-shepherd?lang=spa"
  },
  {
    "number": "1058",
    "title": "Mi canto en la noche",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/my-song-in-the-night?lang=spa"
  },
  {
    "number": "1059",
    "title": "El mundo es de Dios",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/this-is-my-fathers-world?lang=spa"
  },
  {
    "number": "1060",
    "title": "Un arca construiré",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/build-an-ark?lang=spa"
  },
  {
    "number": "1061",
    "title": "Cuán dulce hogar de amor",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/love-will-bless-our-home?lang=spa"
  },
  {
    "number": "1062",
    "title": "Nuestro ayuno, oh, Señor",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/lord-accept-our-humble-fast?lang=spa"
  },
  {
    "number": "1063",
    "title": "Paz, paz te doy",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/peace-peace-be-still?lang=spa"
  },
  {
    "number": "1064",
    "title": "Fiel eres Tú, mi Dios",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/great-is-thy-faithfulness?lang=spa"
  },
  {
    "number": "1065",
    "title": "Nos enseñó Isaías",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/isaiah-said?lang=spa"
  },
  {
    "number": "1066",
    "title": "La buena batalla",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/fight-the-good-fight?lang=spa"
  },
  {
    "number": "1067",
    "title": "Qué gozo da el evangelio",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/its-joyful-to-live-the-gospel?lang=spa"
  },
  {
    "number": "1068",
    "title": "Dad glorias a Dios",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/to-god-be-the-glory?lang=spa"
  },
  {
    "number": "1069",
    "title": "Habla, Señor",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/speak-to-us-lord?lang=spa"
  },
  {
    "number": "1070",
    "title": "El milagro",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/the-miracle?lang=spa"
  },
  {
    "number": "1071",
    "title": "Esto es lo que pide Dios",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/what-god-calls-us-to?lang=spa"
  },
  {
    "number": "1072",
    "title": "Cuando la cruz contemplo yo",
    "category": "Himnos para el hogar y la Iglesia",
    "isSacrament": true,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/when-i-survey-the-wondrous-cross?lang=spa"
  },
  {
    "number": "1201",
    "title": "Gloria al día de redención",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/hail-the-day-that-sees-him-rise?lang=spa"
  },
  {
    "number": "1202",
    "title": "El divino Jesús nació",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/he-is-born-the-divine-christ-child?lang=spa"
  },
  {
    "number": "1203",
    "title": "¿Qué niño es este?",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/what-child-is-this?lang=spa"
  },
  {
    "number": "1204",
    "title": "Estrella de luz",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/star-bright?lang=spa"
  },
  {
    "number": "1205",
    "title": "En Pascua himnos entonad",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/let-easter-anthems-ring?lang=spa"
  },
  {
    "number": "1206",
    "title": "¿Viste tú?",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/were-you-there?lang=spa"
  },
  {
    "number": "1207",
    "title": "Paz, paz, paz",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/still-still-still?lang=spa"
  },
  {
    "number": "1208",
    "title": "¡Ve! Dilo en las montañas",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/go-tell-it-on-the-mountain?lang=spa"
  },
  {
    "number": "1209",
    "title": "Pequeñito en pesebre",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/little-baby-in-a-manger?lang=spa"
  },
  {
    "number": "1210",
    "title": "Tiempo atrás, en un jardín",
    "category": "Himnos nuevos (Pascua y Navidad)",
    "isSacrament": false,
    "url": "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/long-ago-within-a-garden?lang=spa"
  },
  {
    "number": "CN 2",
    "pageNumber": "2",
    "title": "Soy un hijo de Dios",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-am-a-child-of-god?lang=spa"
  },
  {
    "number": "CN 4",
    "pageNumber": "4",
    "title": "Niños de todo el mundo",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/children-all-over-the-world?lang=spa"
  },
  {
    "number": "CN 6",
    "pageNumber": "6",
    "title": "Oración de un niño",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/a-childs-prayer?lang=spa"
  },
  {
    "number": "CN 8",
    "pageNumber": "8",
    "title": "Dios vive",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-know-my-father-lives?lang=spa"
  },
  {
    "number": "CN 9",
    "pageNumber": "9",
    "title": "Doy gracias, oh Padre",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-thank-thee-dear-father?lang=spa"
  },
  {
    "number": "CN 10",
    "pageNumber": "10",
    "title": "Con reverencia",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/father-i-will-reverent-be?lang=spa"
  },
  {
    "number": "CN 11",
    "pageNumber": "11",
    "title": "Con quietud",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/reverently-quietly?lang=spa"
  },
  {
    "number": "CN 12",
    "pageNumber": "12",
    "title": "La reverencia es amor",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/reverence-is-love?lang=spa"
  },
  {
    "number": "CN 13",
    "pageNumber": "13",
    "title": "Reverencia mostraré",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-will-try-to-be-reverent?lang=spa"
  },
  {
    "number": "CN 14",
    "pageNumber": "14",
    "title": "¿Puede un niño como yo?",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/can-a-little-child-like-me?lang=spa"
  },
  {
    "number": "CN 15",
    "pageNumber": "15",
    "title": "Demos gracias al padre",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/thanks-to-our-father?lang=spa"
  },
  {
    "number": "CN 16",
    "pageNumber": "16",
    "title": "Mi Padre Celestial me ama",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/my-heavenly-father-loves-me?lang=spa"
  },
  {
    "number": "CN 18a",
    "pageNumber": "18a",
    "title": "Rondó de gracias (Rondó)",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/for-health-and-strength-round?lang=spa"
  },
  {
    "number": "CN 18b",
    "pageNumber": "18b",
    "title": "Al orar",
    "category": "Primaria • Nuestro Padre Celestial",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/we-bow-our-heads?lang=spa"
  },
  {
    "number": "CN 20",
    "pageNumber": "20",
    "title": "Mandó a Su Hijo",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/he-sent-his-son?lang=spa"
  },
  {
    "number": "CN 22",
    "pageNumber": "22",
    "title": "Al irse a Belén José",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/when-joseph-went-to-bethlehem?lang=spa"
  },
  {
    "number": "CN 24",
    "pageNumber": "24",
    "title": "La Nochebuena",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/stars-were-gleaming?lang=spa"
  },
  {
    "number": "CN 25",
    "pageNumber": "25",
    "title": "Dentro de un establo humilde",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/once-within-a-lowly-stable?lang=spa"
  },
  {
    "number": "CN 26",
    "pageNumber": "26",
    "title": "Jesús en pesebre",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/away-in-a-manger?lang=spa"
  },
  {
    "number": "CN 28",
    "pageNumber": "28",
    "title": "El arrullo de María",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/marys-lullaby?lang=spa"
  },
  {
    "number": "CN 30",
    "pageNumber": "30",
    "title": "Duerme, mi nene",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/oh-hush-thee-my-baby?lang=spa"
  },
  {
    "number": "CN 32",
    "pageNumber": "32",
    "title": "Canto de Navidad",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-nativity-song?lang=spa"
  },
  {
    "number": "CN 34",
    "pageNumber": "34",
    "title": "Pequeño niño fue Jesús",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/jesus-once-was-a-little-child?lang=spa"
  },
  {
    "number": "CN 35",
    "pageNumber": "35",
    "title": "Me gusta pensar en el Señor",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-think-when-i-read-that-sweet-story?lang=spa"
  },
  {
    "number": "CN 36",
    "pageNumber": "36",
    "title": "Dime la historia de Cristo",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/tell-me-the-stories-of-jesus?lang=spa"
  },
  {
    "number": "CN 37",
    "pageNumber": "37",
    "title": "Fiel amigo es Jesús",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/jesus-is-our-loving-friend?lang=spa"
  },
  {
    "number": "CN 38",
    "pageNumber": "38",
    "title": "Cristo me manda que brille",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/jesus-wants-me-for-a-sunbeam?lang=spa"
  },
  {
    "number": "CN 39",
    "pageNumber": "39",
    "title": "Ama a todos, dijo el Señor",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/jesus-said-love-everyone?lang=spa"
  },
  {
    "number": "CN 40",
    "pageNumber": "40",
    "title": "Yo trato de ser como Cristo",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/im-trying-to-be-like-jesus?lang=spa"
  },
  {
    "number": "CN 42",
    "pageNumber": "42",
    "title": "Siento el amor de mi Salvador",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-feel-my-saviors-love?lang=spa"
  },
  {
    "number": "CN 44",
    "pageNumber": "44",
    "title": "Resucitó Jesús",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/jesus-has-risen?lang=spa"
  },
  {
    "number": "CN 45",
    "pageNumber": "45",
    "title": "¿Vivió Jesús una vez más?",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/did-jesus-really-live-again?lang=spa"
  },
  {
    "number": "CN 46",
    "pageNumber": "46",
    "title": "Cuando venga Jesús",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/when-he-comes-again?lang=spa"
  },
  {
    "number": "CN 48",
    "pageNumber": "48",
    "title": "La Iglesia de Jesucristo",
    "category": "Primaria • Nuestro Salvador",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-church-of-jesus-christ?lang=spa"
  },
  {
    "number": "CN 50",
    "pageNumber": "50",
    "title": "La fe",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/faith?lang=spa"
  },
  {
    "number": "CN 52",
    "pageNumber": "52",
    "title": "Saber perdonar",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/help-me-dear-father?lang=spa"
  },
  {
    "number": "CN 53",
    "pageNumber": "53",
    "title": "Cuando me bautice",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/when-i-am-baptized?lang=spa"
  },
  {
    "number": "CN 54",
    "pageNumber": "54",
    "title": "El bautismo",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/baptism?lang=spa"
  },
  {
    "number": "CN 56",
    "pageNumber": "56",
    "title": "El Espíritu Santo",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-holy-ghost?lang=spa"
  },
  {
    "number": "CN 57",
    "pageNumber": "57",
    "title": "En la primavera",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/on-a-golden-springtime?lang=spa"
  },
  {
    "number": "CN 58",
    "pageNumber": "58",
    "title": "Sigue al Profeta",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/follow-the-prophet?lang=spa"
  },
  {
    "number": "CN 60",
    "pageNumber": "60",
    "title": "El sacerdocio se restauró",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-priesthood-is-restored?lang=spa"
  },
  {
    "number": "CN 61",
    "pageNumber": "61",
    "title": "Las planchas de oro",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-golden-plates?lang=spa"
  },
  {
    "number": "CN 62",
    "pageNumber": "62",
    "title": "Historias del Libro de Mormón",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/book-of-mormon-stories?lang=spa"
  },
  {
    "number": "CN 63",
    "pageNumber": "63",
    "title": "Los libros del Libro de Mormón",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-books-in-the-book-of-mormon?lang=spa"
  },
  {
    "number": "CN 64",
    "pageNumber": "64",
    "title": "El valor de Nefi",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/nephis-courage?lang=spa"
  },
  {
    "number": "CN 66",
    "pageNumber": "66",
    "title": "Escudriñar, meditar y orar",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/search-ponder-and-pray?lang=spa"
  },
  {
    "number": "CN 67",
    "pageNumber": "67",
    "title": "Buscaré al Señor",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/seek-the-lord-early?lang=spa"
  },
  {
    "number": "CN 68",
    "pageNumber": "68",
    "title": "Siempre obedece los mandamientos",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/keep-the-commandments?lang=spa"
  },
  {
    "number": "CN 70",
    "pageNumber": "70",
    "title": "Hazme andar en la luz",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/teach-me-to-walk-in-the-light?lang=spa"
  },
  {
    "number": "CN 71",
    "pageNumber": "71",
    "title": "Obediencia",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/quickly-ill-obey?lang=spa"
  },
  {
    "number": "CN 72",
    "pageNumber": "72",
    "title": "Voy a vivir el Evangelio",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-want-to-live-the-gospel?lang=spa"
  },
  {
    "number": "CN 73",
    "pageNumber": "73",
    "title": "El Señor me dio un templo",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-lord-gave-me-a-temple?lang=spa"
  },
  {
    "number": "CN 74",
    "pageNumber": "74",
    "title": "Amad a otros",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/love-one-another?lang=spa"
  },
  {
    "number": "CN 75",
    "pageNumber": "75",
    "title": "Dime, Señor",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/tell-me-dear-lord?lang=spa"
  },
  {
    "number": "CN 76",
    "pageNumber": "76",
    "title": "Donde hay amor",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/where-love-is?lang=spa"
  },
  {
    "number": "CN 78",
    "pageNumber": "78",
    "title": "Contigo iré",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/ill-walk-with-you?lang=spa"
  },
  {
    "number": "CN 80",
    "pageNumber": "80",
    "title": "Muestra valor",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/dare-to-do-right?lang=spa"
  },
  {
    "number": "CN 81",
    "pageNumber": "81",
    "title": "Defiende el bien",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/stand-for-the-right?lang=spa"
  },
  {
    "number": "CN 82",
    "pageNumber": "82",
    "title": "Escojamos lo correcto",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/choose-the-right-way?lang=spa"
  },
  {
    "number": "CN 83",
    "pageNumber": "83",
    "title": "La bondad por mí empieza",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/kindness-begins-with-me?lang=spa"
  },
  {
    "number": "CN 84",
    "pageNumber": "84",
    "title": "Yo soy como estrella",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-am-like-a-star?lang=spa"
  },
  {
    "number": "CN 85",
    "pageNumber": "85",
    "title": "Voy a ser valiente",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-will-be-valiant?lang=spa"
  },
  {
    "number": "CN 86",
    "pageNumber": "86",
    "title": "El plan de Dios puedo seguir",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-will-follow-gods-plan?lang=spa"
  },
  {
    "number": "CN 88",
    "pageNumber": "88",
    "title": "Joven digno y hábil seré",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/a-young-man-prepared?lang=spa"
  },
  {
    "number": "CN 90",
    "pageNumber": "90",
    "title": "Yo quiero ser un misionero ya",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-want-to-be-a-missionary-now?lang=spa"
  },
  {
    "number": "CN 91",
    "pageNumber": "91",
    "title": "Espero ser llamado a una misión",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-hope-they-call-me-on-a-mission?lang=spa"
  },
  {
    "number": "CN 92",
    "pageNumber": "92",
    "title": "Llevaremos Su verdad al mundo (El ejército de Helamán)",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/well-bring-the-world-his-truth-army-of-helaman?lang=spa"
  },
  {
    "number": "CN 94",
    "pageNumber": "94",
    "title": "Llamados a servir",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/called-to-serve?lang=spa"
  },
  {
    "number": "CN 96",
    "pageNumber": "96",
    "title": "Brilla",
    "category": "Primaria • El Evangelio",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/shine-on?lang=spa"
  },
  {
    "number": "CN 98",
    "pageNumber": "98",
    "title": "Las familias pueden ser eternas",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/families-can-be-together-forever?lang=spa"
  },
  {
    "number": "CN 99",
    "pageNumber": "99",
    "title": "Me encanta ver el templo",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-love-to-see-the-temple?lang=spa"
  },
  {
    "number": "CN 100",
    "pageNumber": "100",
    "title": "Estoy haciendo mi historia familiar",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/family-history-i-am-doing-it?lang=spa"
  },
  {
    "number": "CN 101",
    "pageNumber": "101",
    "title": "Oración familiar",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/family-prayer?lang=spa"
  },
  {
    "number": "CN 102",
    "pageNumber": "102",
    "title": "Allí donde hay amor",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/love-is-spoken-here?lang=spa"
  },
  {
    "number": "CN 104",
    "pageNumber": "104",
    "title": "Una familia feliz",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/a-happy-family?lang=spa"
  },
  {
    "number": "CN 105",
    "pageNumber": "105",
    "title": "El sábado",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/saturday?lang=spa"
  },
  {
    "number": "CN 106",
    "pageNumber": "106",
    "title": "Los nombres más bellos",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-dearest-names?lang=spa"
  },
  {
    "number": "CN 107",
    "pageNumber": "107",
    "title": "Madre, te amo",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/mother-i-love-you?lang=spa"
  },
  {
    "number": "CN 108a",
    "pageNumber": "108a",
    "title": "Madrecita de mi amor",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/mother-dear?lang=spa"
  },
  {
    "number": "CN 108b",
    "pageNumber": "108b",
    "title": "Cuando ayudamos",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/when-were-helping?lang=spa"
  },
  {
    "number": "CN 109",
    "pageNumber": "109",
    "title": "Por campos de trébol paseo",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-often-go-walking?lang=spa"
  },
  {
    "number": "CN 110",
    "pageNumber": "110",
    "title": "Cuando papá vuelve",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/daddys-homecoming?lang=spa"
  },
  {
    "number": "CN 111",
    "pageNumber": "111",
    "title": "Mi papá",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/my-dad?lang=spa"
  },
  {
    "number": "CN 112",
    "pageNumber": "112",
    "title": "La abuelita",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/grandmother?lang=spa"
  },
  {
    "number": "CN 113",
    "pageNumber": "113",
    "title": "Cuando abuelito viene",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/when-grandpa-comes?lang=spa"
  },
  {
    "number": "CN 114",
    "pageNumber": "114",
    "title": "Con un cantar",
    "category": "Primaria • El hogar y la familia",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/sing-your-way-home?lang=spa"
  },
  {
    "number": "CN 116",
    "pageNumber": "116",
    "title": "El arroyito da",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/give-said-the-little-stream?lang=spa"
  },
  {
    "number": "CN 117",
    "pageNumber": "117",
    "title": "Cae la lluvia alrededor",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/rain-is-falling-all-around?lang=spa"
  },
  {
    "number": "CN 118",
    "pageNumber": "118",
    "title": "Palomitas de maíz",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/popcorn-popping?lang=spa"
  },
  {
    "number": "CN 119",
    "pageNumber": "119",
    "title": "Las semillas duermen",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/little-seeds-lie-fast-asleep?lang=spa"
  },
  {
    "number": "CN 120",
    "pageNumber": "120",
    "title": "¿Qué haces en el verano?",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/oh-what-do-you-do-in-the-summertime?lang=spa"
  },
  {
    "number": "CN 121",
    "pageNumber": "121",
    "title": "Éste era un mono",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/once-there-was-a-snowman?lang=spa"
  },
  {
    "number": "CN 122",
    "pageNumber": "122",
    "title": "El mundo es glorioso",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-think-the-world-is-glorious?lang=spa"
  },
  {
    "number": "CN 123",
    "pageNumber": "123",
    "title": "¡El mundo es tan bello!",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-world-is-so-lovely?lang=spa"
  },
  {
    "number": "CN 124",
    "pageNumber": "124",
    "title": "Alza al cielo el son",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/lift-up-your-voice-and-sing?lang=spa"
  },
  {
    "number": "CN 125",
    "pageNumber": "125",
    "title": "Si te sientes feliz",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/if-youre-happy?lang=spa"
  },
  {
    "number": "CN 126",
    "pageNumber": "126",
    "title": "Mis manitas",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-have-two-little-hands?lang=spa"
  },
  {
    "number": "CN 127",
    "pageNumber": "127",
    "title": "Me doblo",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/hinges?lang=spa"
  },
  {
    "number": "CN 128",
    "pageNumber": "128",
    "title": "Sonrisas",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/smiles?lang=spa"
  },
  {
    "number": "CN 129a",
    "pageNumber": "129a",
    "title": "Cabeza, cara, hombros, pies",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/head-shoulders-knees-and-toes?lang=spa"
  },
  {
    "number": "CN 129b",
    "pageNumber": "129b",
    "title": "Qué divertido es",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/fun-to-do?lang=spa"
  },
  {
    "number": "CN 130",
    "pageNumber": "130",
    "title": "¡Hola!",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/hello-song?lang=spa"
  },
  {
    "number": "CN 131",
    "pageNumber": "131",
    "title": "Los colores de nuestra Primaria",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/our-primary-colors?lang=spa"
  },
  {
    "number": "CN 132",
    "pageNumber": "132",
    "title": "El sabio y el imprudente",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-wise-man-and-the-foolish-man?lang=spa"
  },
  {
    "number": "CN 133",
    "pageNumber": "133",
    "title": "Cumpliste años (Rondó)",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/youve-had-a-birthday-round?lang=spa"
  },
  {
    "number": "CN 134",
    "pageNumber": "134",
    "title": "Feliz, feliz cumpleaños",
    "category": "Primaria • Diversión y actividades",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/happy-happy-birthday?lang=spa"
  },
  {
    "number": "CN 136",
    "pageNumber": "136",
    "title": "Pioneros fieles",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/the-handcart-song?lang=spa"
  },
  {
    "number": "CN 137",
    "pageNumber": "137",
    "title": "Niños pioneros",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/pioneer-children-sang-as-they-walked?lang=spa"
  },
  {
    "number": "CN 138",
    "pageNumber": "138",
    "title": "Para ser pionero",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/to-be-a-pioneer?lang=spa"
  },
  {
    "number": "CN 139",
    "pageNumber": "139",
    "title": "Mi mamá nos da amor",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/loving-mother-kind-and-true?lang=spa"
  },
  {
    "number": "CN 140",
    "pageNumber": "140",
    "title": "Belleza por doquier",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/beauty-everywhere?lang=spa"
  },
  {
    "number": "CN 141",
    "pageNumber": "141",
    "title": "Hazlo conmigo",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/do-as-im-doing?lang=spa"
  },
  {
    "number": "CN 142",
    "pageNumber": "142",
    "title": "En el prado",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/in-the-meadow?lang=spa"
  },
  {
    "number": "CN 144",
    "pageNumber": "144",
    "title": "A mi madre",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/my-mother?lang=spa"
  },
  {
    "number": "CN 145",
    "pageNumber": "145",
    "title": "Como el sol en la mañana",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/my-mother-dear?lang=spa"
  },
  {
    "number": "CN 146",
    "pageNumber": "146",
    "title": "Estrella de luz",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/star-bright?lang=spa"
  },
  {
    "number": "CN 148",
    "pageNumber": "148",
    "title": "Viví en los cielos",
    "category": "Primaria • Canciones seleccionadas",
    "isSacrament": false,
    "isChildren": true,
    "url": "https://www.churchofjesuschrist.org/study/manual/childrens-songbook/i-lived-in-heaven?lang=spa"
  }
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Busca un himno o canción de la Primaria por su número (ej. "114", "1001", "CN 2", "P 58", "18a").
 */
export function findHymnByNumber(
  num?: string | null,
  options?: { preferChildren?: boolean }
): HymnInfo | undefined {
  if (!num) return undefined;
  const raw = num.trim();
  if (!raw) return undefined;

  // Detectar si tiene prefijo explícito de Canciones para los niños / Primaria (CN, P, N)
  const childrenPrefixMatch = raw.match(/^(?:cn|c\.n\.|p|primaria|ninos|niños)[\s\-#.]*(\d+[a-z]?)$/i);
  if (childrenPrefixMatch) {
    const targetPage = childrenPrefixMatch[1].toLowerCase();
    return HYMNS_CATALOG.find(
      (h) => h.isChildren && h.pageNumber?.toLowerCase() === targetPage
    );
  }

  const clean = raw.replace(/^#/, "").trim();
  if (!clean) return undefined;

  if (options?.preferChildren) {
    const childMatch = HYMNS_CATALOG.find(
      (h) =>
        h.isChildren &&
        (h.pageNumber?.toLowerCase() === clean.toLowerCase() ||
          h.number.toLowerCase() === clean.toLowerCase())
    );
    if (childMatch) return childMatch;
  }

  return (
    HYMNS_CATALOG.find((h) => h.number.toLowerCase() === clean.toLowerCase()) ||
    HYMNS_CATALOG.find(
      (h) => h.isChildren && h.pageNumber?.toLowerCase() === clean.toLowerCase()
    )
  );
}

/**
 * Busca un himno o canción de la Primaria por coincidencia exacta o parcial de título.
 */
export function findHymnByTitle(title?: string | null): HymnInfo | undefined {
  if (!title) return undefined;
  const norm = normalizeText(title);
  if (!norm) return undefined;
  return (
    HYMNS_CATALOG.find((h) => normalizeText(h.title) === norm) ||
    HYMNS_CATALOG.find((h) => normalizeText(h.title).includes(norm))
  );
}

/**
 * Busca un himno o canción de la Primaria combinando número y título.
 */
export function findHymn(
  hymnNumber?: string | null,
  hymnTitle?: string | null
): HymnInfo | undefined {
  const normTitle = hymnTitle ? normalizeText(hymnTitle) : "";
  const rawNum = hymnNumber ? hymnNumber.replace(/^#/, "").trim().toLowerCase() : "";

  // 1. Si tenemos tanto número como título, buscar coincidencia simultánea (ideal para distinguir #2 de Himnos vs #2 de Primaria)
  if (rawNum && normTitle) {
    const cleanPage = rawNum.replace(/^(?:cn|p|primaria)[\s\-#.]*/i, "").trim();
    const bothMatch = HYMNS_CATALOG.find(
      (h) =>
        (h.number.toLowerCase() === rawNum ||
          h.pageNumber?.toLowerCase() === cleanPage) &&
        normalizeText(h.title) === normTitle
    );
    if (bothMatch) return bothMatch;

    // Si el título coincide exactamente con algún himno/canción del catálogo, priorizar esa coincidencia exacta
    const exactTitleMatch = HYMNS_CATALOG.find(
      (h) => normalizeText(h.title) === normTitle
    );
    if (exactTitleMatch) return exactTitleMatch;
  }

  return findHymnByNumber(hymnNumber) || findHymnByTitle(hymnTitle);
}

/**
 * Obtiene el enlace oficial de la Biblioteca del Evangelio para reproducir y ver el himno o canción de la Primaria.
 * Si no se especifica un himno del catálogo, devuelve el índice de música de la Biblioteca del Evangelio.
 */
export function getHymnGospelLibraryUrl(
  hymnNumber?: string | null,
  hymnTitle?: string | null
): string {
  const found = findHymn(hymnNumber, hymnTitle);
  if (found) {
    return found.url;
  }
  return "https://www.churchofjesuschrist.org/study/manual/hymns?lang=spa";
}

/**
 * Filtra y busca himnos y canciones de la Primaria por número, título o categoría.
 */
export function searchHymns(
  query: string,
  options?: {
    filter?: "ALL" | "SACRAMENT" | "NEW" | "CHILDREN";
    prioritizeSacrament?: boolean;
  }
): HymnInfo[] {
  const cleanQuery = query.trim();
  const normQuery = normalizeText(cleanQuery);
  const pageQuery = cleanQuery
    .replace(/^(?:cn|p|primaria|#)[\s\-.]*/i, "")
    .trim()
    .toLowerCase();

  let list = HYMNS_CATALOG;

  if (options?.filter === "SACRAMENT") {
    list = list.filter((h) => h.isSacrament);
  } else if (options?.filter === "NEW") {
    list = list.filter((h) => !h.isChildren && Number(h.number) >= 1000);
  } else if (options?.filter === "CHILDREN") {
    list = list.filter((h) => Boolean(h.isChildren));
  }

  if (!normQuery) {
    if (options?.prioritizeSacrament && options?.filter === "ALL") {
      return [
        ...list.filter((h) => h.isSacrament),
        ...list.filter((h) => !h.isSacrament),
      ];
    }
    return list;
  }

  return list
    .filter((h) => {
      if (
        pageQuery &&
        (h.number.toLowerCase().startsWith(pageQuery) ||
          h.pageNumber?.toLowerCase().startsWith(pageQuery))
      ) {
        return true;
      }
      if (normalizeText(h.number).includes(normQuery)) return true;
      if (normalizeText(h.title).includes(normQuery)) return true;
      if (normalizeText(h.category).includes(normQuery)) return true;
      return false;
    })
    .sort((a, b) => {
      // Exact number/page match first
      if (pageQuery) {
        const aExact =
          a.number.toLowerCase() === cleanQuery.toLowerCase() ||
          a.number.toLowerCase() === pageQuery ||
          a.pageNumber?.toLowerCase() === pageQuery;
        const bExact =
          b.number.toLowerCase() === cleanQuery.toLowerCase() ||
          b.number.toLowerCase() === pageQuery ||
          b.pageNumber?.toLowerCase() === pageQuery;
        if (aExact && !bExact) return -1;
        if (bExact && !aExact) return 1;
      }
      if (options?.prioritizeSacrament) {
        if (a.isSacrament && !b.isSacrament) return -1;
        if (b.isSacrament && !a.isSacrament) return 1;
      }
      const aNum = parseInt(a.pageNumber || a.number, 10) || 0;
      const bNum = parseInt(b.pageNumber || b.number, 10) || 0;
      return aNum - bNum;
    });
}
