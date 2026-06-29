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

  // ---- Adeptus Mechanicus Quotes (Lexicanum) ----
  {
    id: "admech-flesh-is-weak",
    title: "The Flesh Is Weak",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Common Adeptus Mechanicus litany",
    text: "The flesh is weak.",
  },
  {
    id: "admech-no-truth-in-flesh",
    title: "No Truth in Flesh",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "The Horus Heresy: Inferno",
    text:
      "There is no truth in flesh, only betrayal.\n" +
      "There is no strength in flesh, only weakness.\n" +
      "There is no constancy in flesh, only decay.\n" +
      "There is no certainty in flesh but death.",
  },
  {
    id: "admech-weakness-of-flesh",
    title: "The Weakness of My Flesh",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Magos-Dominus Reditus",
    text:
      "From the moment I understood the weakness of my flesh,\n" +
      "it disgusted me. I craved the strength and certainty of steel.\n" +
      "I aspired to the purity of the Blessed Machine.\n" +
      "Your kind cling to your flesh, as if it will not decay and fail you.\n" +
      "One day the crude biomass that you call a temple will wither,\n" +
      "and you will beg my kind to save you.\n" +
      "But I am already saved, for the Machine is immortal...\n" +
      "even in death I serve the Omnissiah.",
  },
  {
    id: "admech-make-whole",
    title: "Make Whole That Which Was Sundered",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Cult Mechanicus",
    text:
      "Thus do we invoke the Machine God.\n" +
      "Thus do we make whole that which was sundered.",
  },
  {
    id: "admech-litany-of-ignition",
    title: "The Litany of Ignition",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "The Litany of Ignition",
    text:
      "The soul of the Machine God surrounds thee.\n" +
      "The power of the Machine God invests thee.\n" +
      "The hate of the Machine God drives thee.\n" +
      "The Machine God endows thee with life. Live!",
  },
  {
    id: "admech-iron-over-flesh",
    title: "Iron Over Flesh",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Ferropsalm of the Fabricator General",
    text:
      "Iron over flesh, cogitation over thought,\n" +
      "information over conjecture.\n" +
      "Thus is purity, and victory, assured.",
  },
  {
    id: "admech-blessed-mind",
    title: "Blessed Is the Mind Too Small for Doubt",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Adeptus Mechanicus",
    text: "Blessed is the mind too small for doubt.",
  },
  {
    id: "admech-alien-looks-back",
    title: "The Alien Looks Back",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Aphorisms 56",
    text: "Look not upon the alien, for the alien looks back.",
  },
  {
    id: "admech-bring-guns",
    title: "Bring Guns as Well as Prayers",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Aphorisms 31",
    text: "Bring guns as well as prayers.",
  },
  {
    id: "admech-purify-flames",
    title: "Purify It With Flames",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Aphorisms 43",
    text: "Purify it with flames, for this is the wish of the Omnissiah!",
  },
  {
    id: "admech-by-flame",
    title: "By Flame Shall the Unclean Be Made Clean",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Gathalamorians 71.6",
    text:
      "By flame shall the unclean be made clean,\n" +
      "by fire shall the unholy be made holy.",
  },
  {
    id: "admech-hatred",
    title: "The Only Logical Response",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Verses Macrologica 17.4",
    text: "The only logical response to the presence of the xenos is hatred.",
  },
  {
    id: "admech-ritual-faith",
    title: "Ritual Honours the Machine Spirit",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Warnings of the Cult Mechanicus, Axioms XV/XVI",
    text:
      "Flesh is fallible, but ritual honours the machine spirit.\n" +
      "To break with ritual is to break with faith.",
  },
  {
    id: "admech-duty-not-complete",
    title: "Even in Death, Our Duty Is Not Complete",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "The Lives of the Logic-Saints, Psalm 61",
    text: "Even in death, our duty is not complete.",
  },
  {
    id: "admech-destroyer-of-worlds",
    title: "My Name Is Legion",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Coaltadel the Omnipresent, Tech-Priest Dominus",
    text:
      "I am Skitarius. I am Sicarian.\n" +
      "I am the data-tether that connects them.\n" +
      "The gunsights they aim down. The eyes and ears\n" +
      "of every unit in this Battle Congregation.\n" +
      "The orbital lances that precede their advance.\n" +
      "My name is legion, and I am the destroyer of worlds.",
  },
  {
    id: "admech-cawl-creed",
    title: "The Soul Must Be Understood",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Archmagos Dominus Belisarius Cawl",
    text:
      "Our creed says the flesh is weak, and so it is.\n" +
      "That is why we strive to improve upon it and replace it,\n" +
      "as the Machine God desires.\n" +
      "But we abandon His numinous gifts at our peril.\n" +
      "To give up one's soul is the great sin of my religion.\n" +
      "The soul must be understood, not despised.",
  },
  {
    id: "admech-cawl-anything",
    title: "I Can Do Anything",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Archmagos Belisarius Cawl",
    text: "I'm Belisarius Cawl and I can do anything.",
  },
  {
    id: "admech-zeth",
    title: "Machines That Think",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Adept Koriel Zeth, Forge Mistress",
    text:
      "It is my great regret that we live in an age\n" +
      "that is proud of machines that think\n" +
      "and suspicious of people who try to.",
  },
  {
    id: "admech-eternal-vigilance",
    title: "Eternal Vigilance",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Codex: Adeptus Mechanicus",
    text:
      "Eternal vigilance is the duty of all the Machine God's servants.\n" +
      "Thus do the Skitarii have their eyelids removed upon inception,\n" +
      "that they might behold the Omnissiah's works\n" +
      "until the day their servitude is ended.",
  },
  {
    id: "admech-memory-stored",
    title: "May Their Memory Be Stored",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "A common Mechanicus mourning rite",
    text: "May their memory be stored.",
  },
  {
    id: "admech-iron-fist",
    title: "Fear the Iron Fist",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Grand Master Ferromort, Ordo Sinister",
    text: "Fear the iron fist, for its grip is death.",
  },
  {
    id: "admech-machine-is-my-temple",
    title: "The Machine Is My Temple",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Hymnal of Engine Commencement",
    text:
      "The Machine is my Temple, each one a sacred shrine.\n" +
      "I name each piston blessed, and every gear divine.",
  },
  {
    id: "admech-omnissiah-envelop",
    title: "Omnissiah, Envelop Me",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Litany burned into Cyclae's engrams",
    text:
      "Omnissiah, envelop me.\n" +
      "Guide my cogitations to your truth.\n" +
      "Shape my thoughts and calm my flesh.\n" +
      "Guard me against emotion,\n" +
      "that it will not overcome clarity.\n" +
      "Sustain my systems with visions of efficiency\n" +
      "and the Quest for Knowledge.",
  },
  {
    id: "admech-privilege-of-cogs",
    title: "The Privilege of Cogs",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "7-Cyclae, Skitarii Alpha Primus, Stygies VIII",
    text:
      "It is the privilege of cogs to be ground down\n" +
      "that the machine may run, magos.",
  },
  {
    id: "admech-march",
    title: "None May Stay Our March",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Cult Mechanicus",
    text:
      "Sing the song of the Machine-God. None may stay our march.\n" +
      "Let the merciless logic of the Machine-God invest thee.\n" +
      "None may stay our march.\n" +
      "Praise and glory be to the Machine-God.\n" +
      "None may stay our march.",
  },
  {
    id: "admech-cleanse",
    title: "Spirit of the Machine",
    category: "Adeptus Mechanicus (Lexicanum)",
    source: "Tech-Priest Adept Lakius Danzager",
    text:
      "Mechanism, I restore thy spirit!\n" +
      "Let the God-Machine breathe half-life unto thy veins\n" +
      "and render thee functional.",
  },
];

export const LITANIES: Litany[] = [...RAW_LITANIES].sort((a, b) =>
  a.title.localeCompare(b.title)
);

export const CATEGORIES: string[] = Array.from(
  new Set(LITANIES.map((l) => l.category))
).sort((a, b) => a.localeCompare(b));
