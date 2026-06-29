export interface Litany {
  id: string;
  title: string;
  category: string;
  source: string;
  text: string;
}

/**
 * Curated library of Warhammer 40,000 litanies, catechisms and prayers.
 * Texts are well-known Imperial canticles collected in the spirit of the
 * Lexicanum "Quotes" sections. They are sorted alphabetically by title at
 * the bottom of this module so the UI always receives an ordered list.
 */
const RAW_LITANIES: Litany[] = [
  {
    id: "fede-imperialis",
    title: "Fede Imperialis",
    category: "Prayers",
    source: "Imperial Cult",
    text:
      "I am the Emperor's shield. I am His sword and His wrath.\n" +
      "Through me, His will is done.\n" +
      "Where I stand, the enemy shall not pass.\n" +
      "Where I strike, the enemy shall fall.\n" +
      "For the Emperor. For mankind. For the Imperium.",
  },
  {
    id: "litany-of-hate",
    title: "Litany of Hate",
    category: "Battle Litanies",
    source: "Adeptus Astartes — Chaplains",
    text:
      "Let the hatred flow through you.\n" +
      "Let the wrath of the Emperor be your shield,\n" +
      "and His scorn be your sword.\n" +
      "Hate the alien. Hate the heretic. Hate the mutant.\n" +
      "Grant us the strength to pierce their inhuman flesh\n" +
      "and lay waste to their citadels with hurricanes of fire.",
  },
  {
    id: "litany-of-faith",
    title: "Litany of Faith",
    category: "Battle Litanies",
    source: "Adeptus Astartes — Chaplains",
    text:
      "Faith is my shield, the Emperor my guide.\n" +
      "No wound can fell the soul that does not falter.\n" +
      "No fear can break the heart that holds the light.\n" +
      "In His name we endure. In His name we prevail.",
  },
  {
    id: "catechism-of-fire",
    title: "Catechism of Fire",
    category: "Battle Litanies",
    source: "Adeptus Astartes — Chaplains",
    text:
      "By bolt and blade, by flame and fury,\n" +
      "we deliver the Emperor's judgement.\n" +
      "Burn away the corruption. Cleanse the unclean.\n" +
      "Let nothing of the enemy remain.",
  },
  {
    id: "exhortation-of-rage",
    title: "Exhortation of Rage",
    category: "Battle Litanies",
    source: "Adeptus Astartes — Chaplains",
    text:
      "Rise up, sons of the Emperor!\n" +
      "Let righteous anger guide your aim.\n" +
      "Show the foe no mercy, for they deserve none.\n" +
      "Forward, unto the breach, and let the galaxy tremble.",
  },
  {
    id: "litany-of-the-electro-priest",
    title: "Litany of the Machine God",
    category: "Adeptus Mechanicus",
    source: "Cult Mechanicus",
    text:
      "From the weakness of the mind, Omnissiah save us.\n" +
      "From the lies of the Antipath, circuit preserve us.\n" +
      "From the rage of the Beast, iron protect us.\n" +
      "From the temptations of the Fleshlord, silica cleanse us.\n" +
      "From the ravages of the Destroyer, anima shield us.\n" +
      "From this rotting cage of biomatter, Machine God set us free.",
  },
  {
    id: "rite-of-awakening",
    title: "Rite of Awakening",
    category: "Adeptus Mechanicus",
    source: "Cult Mechanicus",
    text:
      "Spirit of the machine, hear my prayer.\n" +
      "I anoint thee with sacred oils.\n" +
      "I gird thee with blessed incantations.\n" +
      "Awaken now, and serve the Omnissiah.",
  },
  {
    id: "fear-not-the-witch",
    title: "Catechism Against the Witch",
    category: "Catechisms",
    source: "Holy Ordos",
    text:
      "Suffer not the witch to live.\n" +
      "Suffer not the alien to draw breath.\n" +
      "Suffer not the heretic to spread his lies.\n" +
      "For the Emperor watches, and the Emperor judges.",
  },
  {
    id: "imperial-creed-tenets",
    title: "Tenets of the Imperial Creed",
    category: "Catechisms",
    source: "Ecclesiarchy",
    text:
      "The Emperor is the Master of Mankind.\n" +
      "The Emperor is the Defender of Humanity.\n" +
      "The Emperor protects.\n" +
      "Praise be His name unto the ending of the stars.",
  },
  {
    id: "blessing-of-the-bolter",
    title: "Blessing of the Bolter",
    category: "Prayers",
    source: "Adeptus Astartes",
    text:
      "Blessed is the mind too small for doubt.\n" +
      "Blessed is the bolt that finds the heretic's heart.\n" +
      "Blessed is the hand that does not waver.\n" +
      "The Emperor guides my aim.",
  },
  {
    id: "prayer-of-the-faithful",
    title: "Prayer of the Faithful",
    category: "Prayers",
    source: "Adepta Sororitas",
    text:
      "Through faith we are made strong.\n" +
      "Through the Emperor we are made whole.\n" +
      "Let the fire of devotion burn within us,\n" +
      "and let our enemies know only ash.",
  },
  {
    id: "hymn-of-the-saints",
    title: "Hymn of the Saints",
    category: "Hymns",
    source: "Adepta Sororitas",
    text:
      "Sing, sisters, of the martyrs gone before.\n" +
      "Sing of their sacrifice, their unyielding faith.\n" +
      "In death they served. In memory they guide.\n" +
      "We are the Emperor's daughters, and we do not kneel.",
  },
  {
    id: "guardsman-prayer",
    title: "The Guardsman's Prayer",
    category: "Prayers",
    source: "Astra Militarum",
    text:
      "I am a man of the Imperium.\n" +
      "I will hold the line.\n" +
      "I will not break, I will not flee.\n" +
      "If I die, I die for the Emperor,\n" +
      "and a thousand more will take my place.",
  },
  {
    id: "only-in-death",
    title: "Only in Death Does Duty End",
    category: "Maxims",
    source: "Imperial Infantryman's Uplifting Primer",
    text:
      "A small mind is easily filled with faith.\n" +
      "A weak body is easily protected by armour.\n" +
      "But only in death does duty end.",
  },
  {
    id: "fear-denies-faith",
    title: "Fear Denies Faith",
    category: "Maxims",
    source: "Imperial Maxim",
    text:
      "Fear denies faith.\n" +
      "Faith denies fear.\n" +
      "Stand firm, and the darkness shall not claim you.",
  },
  {
    id: "innocence-proves-nothing",
    title: "Innocence Proves Nothing",
    category: "Maxims",
    source: "Inquisitorial Maxim",
    text:
      "Innocence proves nothing.\n" +
      "Trust no one, and place your faith only in the Emperor.\n" +
      "For corruption hides behind the kindest of faces.",
  },
  {
    id: "slavte-imperatora",
    title: "Славьте Императора",
    category: "Молитвы (RU)",
    source: "Имперский культ",
    text:
      "Славьте Императора, ибо он вечный!\n" +
      "Славьте Императора, ибо он пастырь наш!\n" +
      "Славьте Императора, ибо Он тот,\n" +
      "кто ведёт нас путём истины!\n" +
      "Да защитит Он нас в час тёмный!\n" +
      "Да упокоит наши души в бою праведном!\n" +
      "Да уничтожим врагов во славу Его!",
  },
  {
    id: "litany-of-devotion",
    title: "Litany of Devotion",
    category: "Battle Litanies",
    source: "Adeptus Astartes — Chaplains",
    text:
      "My devotion is eternal, my service unending.\n" +
      "I give my body, my mind, and my soul to the Emperor.\n" +
      "Let my faith be the armour that no blade can pierce.",
  },

  // ---- Quotes collected from Lexicanum quote sections ----
  {
    id: "quote-rotting-carcass",
    title: "A Rotting Carcass",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman",
    text:
      "Why do I still live? What more do you want from me?\n" +
      "I gave everything I had to you, to them.\n" +
      "Look what they've made of our dream.\n" +
      "This bloated, rotting carcass of an empire is driven\n" +
      "not by reason and hope but by fear, hate and ignorance.\n" +
      "Better that we had all burned in the fires of Horus' ambition\n" +
      "than live to see this.",
  },
  {
    id: "quote-idolatry",
    title: "Idolatry & Ignorance",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman — White Dwarf, May 2017",
    text:
      "Thousands of years. And look what has become of them.\n" +
      "Of us. Idolatry. Ignorance. Suffering and squalor,\n" +
      "in the name of a god who never desired the title.",
  },
  {
    id: "quote-know-no-fear",
    title: "Know No Fear",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman",
    text:
      "The warrior who acts out of honour cannot fail.\n" +
      "His duty is honour itself. Even his death —\n" +
      "if it is honourable — is a reward and can be no failure,\n" +
      "for it has come through duty.\n" +
      "Seek honour as you act, therefore, and you will know no fear.",
  },
  {
    id: "quote-admit-defeat",
    title: "To Admit Defeat",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman",
    text: "To admit defeat is to blaspheme against the Emperor.",
  },
  {
    id: "quote-are-we-not",
    title: "Are We Not Space Marines?",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman — The Horus Heresy: Tempest",
    text:
      "Are we not Space Marines?\n" +
      "Is this not the very task we were created for?",
  },
  {
    id: "quote-gods-of-old",
    title: "Gods of Old",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman — Apocrypha of Skaros",
    text:
      "Let them bestride the galaxy like the gods of old,\n" +
      "sheltering Mankind from destruction\n" +
      "at the hands of an uncaring universe.",
  },
  {
    id: "quote-worthless-ground",
    title: "The Worthless Ground",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman — On War",
    text:
      "In any battle, great or small, the most insignificant of terrain\n" +
      "and the most worthless of ground can for minutes,\n" +
      "or perhaps hours, become so valuable that the blood of heroes\n" +
      "and the wealth of an army's supply does not outweigh it.",
  },
  {
    id: "quote-two-fronts",
    title: "Two Fronts",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman — Codicil 19:23",
    text:
      "To conduct battle on two fronts is an act of either\n" +
      "desperation or utter foolishness. In such an arena it is\n" +
      "neither skill nor firepower that brings victory,\n" +
      "but the ability to manipulate that of your enemy.",
  },
  {
    id: "quote-emperors-will",
    title: "The Emperor's Will",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman — Nightbringer (attributed)",
    text: "Whatever the Emperor's will is, be sure it will find you out.",
  },
  {
    id: "quote-great-irony",
    title: "The Great Irony",
    category: "Quotes (Lexicanum)",
    source: "Roboute Guilliman — Know No Fear",
    text:
      "It is the great irony of the Legiones Astartes:\n" +
      "engineered to kill to achieve a victory of peace\n" +
      "that they can then be no part of.",
  },
  {
    id: "quote-codex-astartes",
    title: "Angels of Death",
    category: "Quotes (Lexicanum)",
    source: "Codex Astartes, opening — Roboute Guilliman",
    text:
      "They shall be pure of heart and strong of body,\n" +
      "untainted by doubt and unsullied by self-aggrandisement.\n" +
      "They will be bright stars on the firmament of battle,\n" +
      "Angels of Death whose shining wings bring swift annihilation\n" +
      "to the enemies of Man.",
  },
  {
    id: "quote-only-war",
    title: "Only War",
    category: "Quotes (Lexicanum)",
    source: "Warhammer 40,000",
    text: "In the grim darkness of the far future, there is only war.",
  },
];

export const LITANIES: Litany[] = [...RAW_LITANIES].sort((a, b) =>
  a.title.localeCompare(b.title)
);

export const CATEGORIES: string[] = Array.from(
  new Set(LITANIES.map((l) => l.category))
).sort((a, b) => a.localeCompare(b));
