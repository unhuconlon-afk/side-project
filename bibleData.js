// Seed Data for AuraBible App
// Loaded globally via window.BIBLE_DATA

const BIBLE_BOOKS = [
  { id: 'GEN', name: 'Genesis', category: 'OT', chapters: 50 },
  { id: 'EXO', name: 'Exodus', category: 'OT', chapters: 40 },
  { id: 'LEV', name: 'Leviticus', category: 'OT', chapters: 27 },
  { id: 'NUM', name: 'Numbers', category: 'OT', chapters: 36 },
  { id: 'DEU', name: 'Deuteronomy', category: 'OT', chapters: 34 },
  { id: 'JOS', name: 'Joshua', category: 'OT', chapters: 24 },
  { id: 'JDG', name: 'Judges', category: 'OT', chapters: 21 },
  { id: 'RUT', name: 'Ruth', category: 'OT', chapters: 4 },
  { id: '1SA', name: '1 Samuel', category: 'OT', chapters: 31 },
  { id: '2SA', name: '2 Samuel', category: 'OT', chapters: 24 },
  { id: '1KI', name: '1 Kings', category: 'OT', chapters: 22 },
  { id: '2KI', name: '2 Kings', category: 'OT', chapters: 25 },
  { id: '1CH', name: '1 Chronicles', category: 'OT', chapters: 29 },
  { id: '2CH', name: '2 Chronicles', category: 'OT', chapters: 36 },
  { id: 'EZR', name: 'Ezra', category: 'OT', chapters: 10 },
  { id: 'NEH', name: 'Nehemiah', category: 'OT', chapters: 13 },
  { id: 'EST', name: 'Esther', category: 'OT', chapters: 10 },
  { id: 'JOB', name: 'Job', category: 'OT', chapters: 42 },
  { id: 'PSA', name: 'Psalms', category: 'OT', chapters: 150 },
  { id: 'PRO', name: 'Proverbs', category: 'OT', chapters: 31 },
  { id: 'ECC', name: 'Ecclesiastes', category: 'OT', chapters: 12 },
  { id: 'SNG', name: 'Song of Solomon', category: 'OT', chapters: 8 },
  { id: 'ISA', name: 'Isaiah', category: 'OT', chapters: 66 },
  { id: 'JER', name: 'Jeremiah', category: 'OT', chapters: 52 },
  { id: 'LAM', name: 'Lamentations', category: 'OT', chapters: 5 },
  { id: 'EZK', name: 'Ezekiel', category: 'OT', chapters: 48 },
  { id: 'DAN', name: 'Daniel', category: 'OT', chapters: 12 },
  { id: 'HOS', name: 'Hosea', category: 'OT', chapters: 14 },
  { id: 'JOL', name: 'Joel', category: 'OT', chapters: 3 },
  { id: 'AMO', name: 'Amos', category: 'OT', chapters: 9 },
  { id: 'OBD', name: 'Obadiah', category: 'OT', chapters: 1 },
  { id: 'JON', name: 'Jonah', category: 'OT', chapters: 4 },
  { id: 'MIC', name: 'Micah', category: 'OT', chapters: 7 },
  { id: 'NAH', name: 'Nahum', category: 'OT', chapters: 3 },
  { id: 'HAB', name: 'Habakkuk', category: 'OT', chapters: 3 },
  { id: 'ZEP', name: 'Zephaniah', category: 'OT', chapters: 3 },
  { id: 'HAG', name: 'Haggai', category: 'OT', chapters: 2 },
  { id: 'ZEC', name: 'Zechariah', category: 'OT', chapters: 14 },
  { id: 'MAL', name: 'Malachi', category: 'OT', chapters: 4 },
  
  // New Testament
  { id: 'MAT', name: 'Matthew', category: 'NT', chapters: 28 },
  { id: 'MRK', name: 'Mark', category: 'NT', chapters: 16 },
  { id: 'LUK', name: 'Luke', category: 'NT', chapters: 24 },
  { id: 'JHN', name: 'John', category: 'NT', chapters: 21 },
  { id: 'ACT', name: 'Acts', category: 'NT', chapters: 28 },
  { id: 'ROM', name: 'Romans', category: 'NT', chapters: 16 },
  { id: '1CO', name: '1 Corinthians', category: 'NT', chapters: 16 },
  { id: '2CO', name: '2 Corinthians', category: 'NT', chapters: 13 },
  { id: 'GAL', name: 'Galatians', category: 'NT', chapters: 6 },
  { id: 'EPH', name: 'Ephesians', category: 'NT', chapters: 6 },
  { id: 'PHP', name: 'Philippians', category: 'NT', chapters: 4 },
  { id: 'COL', name: 'Colossians', category: 'NT', chapters: 4 },
  { id: '1TH', name: '1 Thessalonians', category: 'NT', chapters: 5 },
  { id: '2TH', name: '2 Thessalonians', category: 'NT', chapters: 3 },
  { id: '1TI', name: '1 Timothy', category: 'NT', chapters: 6 },
  { id: '2TI', name: '2 Timothy', category: 'NT', chapters: 4 },
  { id: 'TIT', name: 'Titus', category: 'NT', chapters: 3 },
  { id: 'PHM', name: 'Philemon', category: 'NT', chapters: 1 },
  { id: 'HEB', name: 'Hebrews', category: 'NT', chapters: 13 },
  { id: 'JAS', name: 'James', category: 'NT', chapters: 5 },
  { id: '1PE', name: '1 Peter', category: 'NT', chapters: 5 },
  { id: '2PE', name: '2 Peter', category: 'NT', chapters: 3 },
  { id: '1JN', name: '1 John', category: 'NT', chapters: 5 },
  { id: '2JN', name: '2 John', category: 'NT', chapters: 1 },
  { id: '3JN', name: '3 John', category: 'NT', chapters: 1 },
  { id: 'JUD', name: 'Jude', category: 'NT', chapters: 1 },
  { id: 'REV', name: 'Revelation', category: 'NT', chapters: 22 }
];

const BIBLE_TRANSLATIONS = [
  { id: 'WEB', name: 'World English Bible', short: 'WEB', desc: 'Modern English public domain translation.', lang: 'English' },
  { id: 'KJV', name: 'King James Version', short: 'KJV', desc: 'Classic 1611 English translation.', lang: 'English' },
  { id: 'AMT', name: 'Aura Modern Devotional', short: 'AMD', desc: 'Thoughtful contemporary paraphrase for study.', lang: 'English' },
  { id: 'VIE', name: 'Bản Truyền Thống 1934', short: 'VIE', desc: 'Vietnamese Cadman 1934 public domain translation.', lang: 'Tiếng Việt' }
];

const STATIC_SCRIPTURES = {
  WEB: {
    GEN: {
      1: [
        { num: 1, text: "In the beginning, God created the heavens and the earth." },
        { num: 2, text: "The earth was waste and void. Darkness was on the surface of the deep. God's Spirit was hovering over the surface of the waters." },
        { num: 3, text: "God said, 'Let there be light,' and there was light." },
        { num: 4, text: "God saw the light, and saw that it was good. God divided the light from the darkness." },
        { num: 5, text: "God called the light 'day,' and the darkness he called 'night.' There was evening and there was morning, one day." },
        { num: 6, text: "God said, 'Let there be an expanse in the middle of the waters, and let it divide the waters from the waters.'" },
        { num: 7, text: "God made the expanse, and divided the waters which were under the expanse from the waters which were above the expanse; and it was so." },
        { num: 8, text: "God called the expanse 'sky.' There was evening and there was morning, a second day." },
        { num: 9, text: "God said, 'Let the waters under the sky be gathered together to one place, and let the dry land appear;' and it was so." },
        { num: 10, text: "God called the dry land 'earth,' and the gathering together of the waters he called 'seas.' God saw that it was good." },
        { num: 11, text: "God said, 'Let the earth produce grass, herbs yielding seeds, and fruit trees bearing fruit after their kind, with their seeds in it;' and it was so." },
        { num: 12, text: "The earth produced grass, herbs yielding seed after their kind, and trees bearing fruit, with their seeds in it, after their kind; and God saw that it was good." },
        { num: 13, text: "There was evening and there was morning, a third day." },
        { num: 14, text: "God said, 'Let there be lights in the expanse of the sky to divide the day from the night; and let them be for signs, and for seasons, and for days and years;'" },
        { num: 15, text: "and let them be for lights in the expanse of the sky to give light on the earth; and it was so." },
        { num: 16, text: "God made the two great lights: the greater light to rule the day, and the lesser light to rule the night. He also made the stars." },
        { num: 17, text: "God set them in the expanse of the sky to give light to the earth," },
        { num: 18, text: "and to rule over the day and over the night, and to divide the light from the darkness. God saw that it was good." },
        { num: 19, text: "There was evening and there was morning, a fourth day." },
        { num: 20, text: "God said, 'Let the waters abound with living creatures, and let birds fly above the earth in the open expanse of the sky.'" },
        { num: 21, text: "God created the large sea creatures, and every living creature that moves, with which the waters swarmed, after their kind, and every winged bird after its kind. God saw that it was good." },
        { num: 22, text: "God blessed them, saying, 'Be fruitful, and multiply, and fill the waters in the seas, and let birds multiply on the earth.'" },
        { num: 23, text: "There was evening and there was morning, a fifth day." },
        { num: 24, text: "God said, 'Let the earth produce living creatures after their kind, livestock, creeping things, and animals of the earth after their kind;' and it was so." },
        { num: 25, text: "God made the animals of the earth after their kind, and the livestock after their kind, and everything that creeps on the ground after its kind. God saw that it was good." },
        { num: 26, text: "God said, 'Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the birds of the sky, and over the livestock, and over all the earth.'" },
        { num: 27, text: "God created man in his own image. In God's image he created him; male and female he created them." },
        { num: 28, text: "God blessed them. God said to them, 'Be fruitful, multiply, fill the earth, and subdue it. Have dominion over the fish of the sea, over the birds of the sky, and over every living thing that moves on the earth.'" },
        { num: 29, text: "God said, 'Behold, I have given you every herb yielding seed, which is on the surface of all the earth, and every tree, which bears fruit yielding seed. It will be your food.'" },
        { num: 30, text: "To every animal of the earth, and to every bird of the sky, and to everything that creeps on the earth, in which there is life, I have given every green herb for food; and it was so." },
        { num: 31, text: "God saw everything that he had made, and, behold, it was very good. There was evening and there was morning, a sixth day." }
      ]
    },
    PSA: {
      23: [
        { num: 1, text: "Yahweh is my shepherd. I shall not lack." },
        { num: 2, text: "He makes me lie down in green pastures. He leads me beside still waters." },
        { num: 3, text: "He restores my soul. He guides me in the paths of righteousness for his name's sake." },
        { num: 4, text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me." },
        { num: 5, text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil. My cup runs over." },
        { num: 6, text: "Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh's house forever." }
      ],
      91: [
        { num: 1, text: "He who dwells in the secret place of the Most High will rest in the shadow of the Almighty." },
        { num: 2, text: "I will say of Yahweh, 'He is my refuge and my fortress; my God, in whom I trust.'" },
        { num: 3, text: "For he will deliver you from the snare of the fowler, and from the deadly pestilence." },
        { num: 4, text: "He will cover you with his feathers. Under his wings you will take refuge. His faithfulness is your shield and rampart." },
        { num: 5, text: "You shall not be afraid of the terror by night, nor of the arrow that flies by day;" },
        { num: 6, text: "nor of the pestilence that walks in darkness, nor of the destruction that wastes at noonday." },
        { num: 7, text: "A thousand may fall at your side, and ten thousand at your right hand; but it will not come near you." },
        { num: 8, text: "You will only look with your eyes, and see the recompense of the wicked." },
        { num: 9, text: "Because you have made Yahweh your refuge, and the Most High your dwelling place," },
        { num: 10, text: "no evil shall happen to you, neither shall any plague come near your dwelling." },
        { num: 11, text: "For he will put his angels in charge of you, to guard you in all your ways." },
        { num: 12, text: "They will bear you up in their hands, so that you won't dash your foot against a stone." },
        { num: 13, text: "You will tread on the lion and cobra. You will trample the young lion and the serpent underfoot." },
        { num: 14, text: "Because he has set his love on me, therefore I will deliver him. I will set him on high, because he has known my name." },
        { num: 15, text: "He will call on me, and I will answer him. I will be with him in trouble. I will deliver him, and honor him." },
        { num: 16, text: "I will satisfy him with long life, and show him my salvation." }
      ]
    },
    PRO: {
      3: [
        { num: 1, text: "My son, don't forget my teaching; but let your heart keep my commandments:" },
        { num: 2, text: "for length of days, and years of life, and peace, will they add to you." },
        { num: 3, text: "Don't let kindness and truth forsake you. Bind them around your neck. Write them on the tablet of your heart." },
        { num: 4, text: "So you will find favor, and good understanding in the sight of God and man." },
        { num: 5, text: "Trust in Yahweh with all your heart, and don't lean on your own understanding." },
        { num: 6, text: "In all your ways acknowledge him, and he will make your paths straight." },
        { num: 7, text: "Don't be wise in your own eyes. Fear Yahweh, and depart from evil." },
        { num: 8, text: "It will be health to your body, and nourishment to your bones." },
        { num: 9, text: "Honor Yahweh with your substance, with the first fruits of all your increase:" },
        { num: 10, text: "so your barns will be filled with plenty, and your vats will overflow with new wine." },
        { num: 11, text: "My son, don't despise Yahweh's discipline, neither be weary of his reproof:" },
        { num: 12, text: "for whom Yahweh loves, he reproves; even as a father reproves the son in whom he delights." },
        { num: 13, text: "Happy is the man who finds wisdom, the man who gets understanding." },
        { num: 14, text: "For her good profit is better than getting silver, and her return is better than fine gold." },
        { num: 15, text: "She is more precious than rubies. None of the things you can desire are to be compared to her." },
        { num: 16, text: "Length of days is in her right hand. In her left hand are riches and honor." },
        { num: 17, text: "Her ways are ways of pleasantness. All her paths are peace." },
        { num: 18, text: "She is a tree of life to those who lay hold of her. Happy is everyone who retains her." },
        { num: 19, text: "By wisdom Yahweh founded the earth. By understanding, he established the heavens." },
        { num: 20, text: "By his knowledge, the depths were broken up, and the skies drop down the dew." },
        { num: 21, text: "My son, let them not depart from your eyes. Keep sound wisdom and discretion:" },
        { num: 22, text: "so they will be life to your soul, and grace for your neck." },
        { num: 23, text: "Then you shall walk in your way securely. Your foot won't stumble." },
        { num: 24, text: "When you lie down, you will not be afraid. Yes, you will lie down, and your sleep will be sweet." },
        { num: 25, text: "Don't be afraid of sudden fear, neither of the desolation of the wicked, when it comes:" },
        { num: 26, text: "for Yahweh will be your confidence, and will keep your foot from being taken." },
        { num: 27, text: "Don't withhold good from those to whom it is due, when it is in the power of your hand to do it." },
        { num: 28, text: "Don't say to your neighbor, 'Go, and come again; tomorrow I will give it to you,' when you have it by you." },
        { num: 29, text: "Don't devise evil against your neighbor, since he dwells securely by you." },
        { num: 30, text: "Don't strive with a man without cause, if he has done you no harm." },
        { num: 31, text: "Don't envy the man of violence. Choose none of his ways." },
        { num: 32, text: "For the perverse is an abomination to Yahweh, but his friendship is with the upright." },
        { num: 33, text: "Yahweh's curse is in the house of the wicked, but he blesses the habitation of the righteous." },
        { num: 34, text: "Surely he mocks the mockers, but he gives grace to the humble." },
        { num: 35, text: "The wise will inherit glory, but shame will be the legacy of fools." }
      ]
    },
    ISA: {
      40: [
        { num: 1, text: "'Comfort, comfort my people,' says your God." },
        { num: 2, text: "'Speak comfortably to Jerusalem; and call out to her that her warfare is accomplished, that her iniquity is pardoned, that she has received from Yahweh's hand double for all her sins.'" },
        { num: 3, text: "The voice of one who calls out, 'Prepare the way of Yahweh in the wilderness! Make a straight highway in the desert for our God.'" },
        { num: 4, text: "Every valley shall be exalted, and every mountain and hill shall be made low. The uneven shall be made level, and the rough places a plain." },
        { num: 5, text: "Yahweh's glory shall be revealed, and all flesh shall see it together; for the mouth of Yahweh has spoken it." },
        { num: 6, text: "The voice of one saying, 'Cry!' One said, 'What shall I cry?' 'All flesh is like grass, and all its glory is like the flower of the field.'" },
        { num: 7, text: "The grass withers, the flower fades, because Yahweh's breath blows on it. Surely the people are like grass." },
        { num: 8, text: "The grass withers, the flower fades; but the word of our God stands forever." },
        { num: 9, text: "You who tell good news to Zion, go up on a high mountain. You who tell good news to Jerusalem, lift up your voice with strength. Lift it up. Don't be afraid. Say to the cities of Judah, 'Behold, your God!'" },
        { num: 10, text: "Behold, the Lord Yahweh will come as a mighty one, and his arm will rule for him. Behold, his reward is with him, and his recompense before him." },
        { num: 11, text: "He will feed his flock like a shepherd. He will gather the lambs in his arm, and carry them in his bosom. He will gently lead those who have their young." },
        { num: 28, text: "Haven't you known? Haven't you heard? The everlasting God, Yahweh, the Creator of the ends of the earth, doesn't faint. He isn't weary. His understanding is unsearchable." },
        { num: 29, text: "He gives power to the weak. He increases the strength of him who has no might." },
        { num: 30, text: "Even the youths shall faint and be weary, and the young men shall utterly fall;" },
        { num: 31, text: "but those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint." }
      ]
    },
    JHN: {
      1: [
        { num: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
        { num: 2, text: "The same was in the beginning with God." },
        { num: 3, text: "All things were made through him. Without him was not anything made that has been made." },
        { num: 4, text: "In him was life, and the life was the light of men." },
        { num: 5, text: "The light shines in the darkness, and the darkness hasn't overcome it." },
        { num: 6, text: "There came a man, sent from God, whose name was John." },
        { num: 7, text: "The same came as a witness, that he might testify about the light, that all might believe through him." },
        { num: 8, text: "He was not the light, but was sent that he might testify about the light." },
        { num: 9, text: "The true light that enlightens everyone was coming into the world." },
        { num: 10, text: "He was in the world, and the world was made through him, and the world didn't recognize him." },
        { num: 11, text: "He came to his own, and those who were his own didn't receive him." },
        { num: 12, text: "But as many as received him, to them he gave the right to become God's children, to those who believe in his name:" },
        { num: 13, text: "who were born not of blood, nor of the will of the flesh, nor of the will of man, but of God." },
        { num: 14, text: "The Word became flesh, and lived among us. We saw his glory, such glory as of the only born Son of the Father, full of grace and truth." },
        { num: 15, text: "John testified about him. He cried out, saying, 'This was he of whom I said, He who comes after me has surpassed me, for he was before me.'" },
        { num: 16, text: "From his fullness we all received grace upon grace." },
        { num: 17, text: "For the law was given through Moses. Grace and truth were realized through Jesus Christ." },
        { num: 18, text: "No one has seen God at any time. The only born Son, who is in the bosom of the Father, he has declared him." }
      ],
      3: [
        { num: 1, text: "Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews." },
        { num: 2, text: "The same came to him by night, and said to him, 'Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do, unless God is with him.'" },
        { num: 3, text: "Jesus answered him, 'Most certainly, I tell you, unless one is born anew, he can't see God's Kingdom.'" },
        { num: 4, text: "Nicodemus said to him, 'How can a man be born when he is old? Can he enter a second time into his mother's womb, and be born?'" },
        { num: 5, text: "Jesus answered, 'Most certainly I tell you, unless one is born of water and spirit, he can't enter into God's Kingdom.'" },
        { num: 6, text: "That which is born of the flesh is flesh. That which is born of the Spirit is spirit." },
        { num: 7, text: "Don't marvel that I said to you, 'You must be born anew.'" },
        { num: 8, text: "The wind blows where it wants to, and you hear its sound, but don't know where it comes from and where it is going. So is everyone who is born of the Spirit." },
        { num: 14, text: "As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up," },
        { num: 15, text: "that whoever believes in him should not perish, but have eternal life." },
        { num: 16, text: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life." },
        { num: 17, text: "For God didn't send his Son into the world to judge the world, but that the world should be saved through him." }
      ],
      14: [
        { num: 1, text: "Don't let your heart be troubled. Believe in God. Believe also in me." },
        { num: 2, text: "In my Father's house are many homes. If it weren't so, I would have told you. I am going to prepare a place for you." },
        { num: 3, text: "If I go and prepare a place for you, I will come again, and will receive you to myself; that where I am, you may be there also." },
        { num: 6, text: "Jesus said to him, 'I am the way, the truth, and the life. No one comes to the Father, except through me.'" },
        { num: 13, text: "Whatever you will ask in my name, that will I do, that the Father may be glorified in the Son." },
        { num: 14, text: "If you will ask anything in my name, I will do it." },
        { num: 15, text: "If you love me, keep my commandments." },
        { num: 16, text: "I will pray to the Father, and he will give you another Counselor, that he may be with you forever" },
        { num: 17, text: "the Spirit of truth, whom the world can't receive; for it doesn't see him, neither knows him. You know him, for he lives with you, and will be in you." },
        { num: 18, text: "I will not leave you orphans. I will come to you." },
        { num: 27, text: "Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Don't let your heart be troubled, neither let it be fearful." }
      ]
    },
    MAT: {
      5: [
        { num: 1, text: "Seeing the multitudes, he went up onto the mountain. When he had sat down, his disciples came to him." },
        { num: 2, text: "He opened his mouth and taught them, saying:" },
        { num: 3, text: "Blessed are the poor in spirit, for theirs is the Kingdom of Heaven." },
        { num: 4, text: "Blessed are those who mourn, for they shall be comforted." },
        { num: 5, text: "Blessed are the gentle, for they shall inherit the earth." },
        { num: 6, text: "Blessed are those who hunger and thirst after righteousness, for they shall be filled." },
        { num: 7, text: "Blessed are the merciful, for they shall obtain mercy." },
        { num: 8, text: "Blessed are the pure in heart, for they shall see God." },
        { num: 9, text: "Blessed are the peacemakers, for they shall be called children of God." },
        { num: 10, text: "Blessed are those who have been persecuted for righteousness' sake, for theirs is the Kingdom of Heaven." },
        { num: 11, text: "Blessed are you when people reproach you, persecute you, and say all kinds of evil against you falsely, for my sake." },
        { num: 12, text: "Rejoice, and be exceedingly glad, for great is your reward in heaven. For that is how they persecuted the prophets who were before you." },
        { num: 13, text: "You are the salt of the earth, but if the salt has lost its flavor, with what will it be salted? It is then good for nothing, but to be cast out and trodden under the feet of men." },
        { num: 14, text: "You are the light of the world. A city located on a hill can't be hidden." },
        { num: 16, text: "Even so, let your light shine before men; that they may see your good works, and glorify your Father who is in heaven." }
      ],
      6: [
        { num: 9, text: "Pray like this: 'Our Father in heaven, may your name be kept holy.'" },
        { num: 10, text: "Let your Kingdom come. Let your will be done on earth as it is in heaven." },
        { num: 11, text: "Give us today our daily bread." },
        { num: 12, text: "Forgive us our debts, as we also forgive our debtors." },
        { num: 13, text: "Bring us not into temptation, but deliver us from the evil one. For yours is the Kingdom, the power, and the glory forever. Amen." },
        { num: 25, text: "Therefore I tell you, don't be anxious for your life: what you will eat, or what you will drink; nor yet for your body, what you will wear. Isn't life more than food, and the body more than clothing?" },
        { num: 26, text: "See the birds of the sky, that they don't sow, neither do they reap, nor gather into barns. Your heavenly Father feeds them. Aren't you of much more value than they?" },
        { num: 33, text: "But seek first God's Kingdom, and his righteousness; and all these things will be given to you as well." },
        { num: 34, text: "Therefore don't be anxious for tomorrow, for tomorrow will be anxious for itself. Each day's own evil is sufficient." }
      ]
    },
    ROM: {
      8: [
        { num: 1, text: "There is therefore now no condemnation to those who are in Christ Jesus, who don't walk according to the flesh, but according to the Spirit." },
        { num: 2, text: "For the law of the Spirit of life in Christ Jesus made me free from the law of sin and of death." },
        { num: 14, text: "For as many as are led by the Spirit of God, these are children of God." },
        { num: 15, text: "For you didn't receive the spirit of bondage again to fear, but you received the Spirit of adoption, by whom we cry, 'Abba! Father!'" },
        { num: 16, text: "The Spirit himself testifies with our spirit that we are children of God;" },
        { num: 18, text: "For I consider that the sufferings of this present time are not worth comparing with the glory which will be revealed toward us." },
        { num: 28, text: "We know that all things work together for good for those who love God, to those who are called according to his purpose." },
        { num: 31, text: "What then shall we say about these things? If God is for us, who can be against us?" },
        { num: 38, text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers," },
        { num: 39, text: "nor height, nor depth, nor any other created thing, will be able to separate us from the love of God, which is in Christ Jesus our Lord." }
      ],
      12: [
        { num: 1, text: "I beseech you therefore, brothers, by the mercies of God, to present your bodies a living sacrifice, holy, acceptable to God, which is your spiritual service." },
        { num: 2, text: "Don't be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God." },
        { num: 3, text: "For I say, through the grace that was given to me, to everyone who is among you, not to think of himself more highly than he ought to think; but to think reasonably, as God has apportioned to each person a measure of faith." },
        { num: 4, text: "For even as we have many members in one body, and all the members don't have the same function," },
        { num: 5, text: "so we, who are many, are one body in Christ, and individually members one of another." },
        { num: 6, text: "Having gifts differing according to the grace that was given to us, if prophecy, let's prophesy according to the proportion of our faith;" },
        { num: 7, text: "or service, let's give ourselves to service; or he who teaches, to his teaching;" },
        { num: 8, text: "or he who exhorts, to his exhorting: he who gives, let him do it with generosity; he who rules, with diligence; he who shows mercy, with cheerfulness." },
        { num: 9, text: "Let love be without hypocrisy. Abhor that which is evil. Cling to that which is good." },
        { num: 10, text: "In love of the brothers be tenderly affectionate to one another; in honor preferring one another;" },
        { num: 11, text: "not lagging in diligence; fervent in spirit; serving the Lord;" },
        { num: 12, text: "rejoicing in hope; enduring in troubles; continuing steadfastly in prayer;" },
        { num: 14, text: "Bless those who persecute you; bless, and don't curse." },
        { num: 21, text: "Don't be overcome by evil, but overcome evil with good." }
      ]
    },
    '1CO': {
      13: [
        { num: 1, text: "If I speak with the languages of men and of angels, but don't have love, I have become sounding brass, or a clanging cymbal." },
        { num: 2, text: "If I have the gift of prophecy, and know all mysteries and all knowledge; and if I have all faith, so as to remove mountains, but don't have love, I am nothing." },
        { num: 3, text: "If I dole out all my goods to feed the poor, and if I give my body to be burned, but don't have love, it profits me nothing." },
        { num: 4, text: "Love is patient and is kind; love doesn't envy. Love doesn't brag, is not proud," },
        { num: 5, text: "doesn't behave itself inappropriately, doesn't seek its own, is not provoked, takes no account of evil;" },
        { num: 6, text: "doesn't rejoice in unrighteousness, but rejoices with the truth;" },
        { num: 7, text: "bears all things, believes all things, hopes all things, endures all things." },
        { num: 8, text: "Love never fails. But where there are prophecies, they will be done away with. Where there are various languages, they will cease. Where there is knowledge, it will be done away with." },
        { num: 9, text: "For we know in part, and we prophesy in part;" },
        { num: 10, text: "but when that which is complete has come, then that which is partial will be done away with." },
        { num: 11, text: "When I was a child, I spoke as a child, I felt as a child, I thought as a child. Now that I have become a man, I have put away childish things." },
        { num: 12, text: "For now we see in a mirror, dimly, but then face to face. Now I know in part, but then I will know fully, even as I was also fully known." },
        { num: 13, text: "But now faith, hope, and love remain -- these three. The greatest of these is love." }
      ]
    },
    PHP: {
      4: [
        { num: 4, text: "Rejoice in the Lord always! Again I will say, rejoice!" },
        { num: 5, text: "Let your gentleness be known to all men. The Lord is at hand." },
        { num: 6, text: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God." },
        { num: 7, text: "The peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus." },
        { num: 8, text: "Finally, brothers, whatever things are true, whatever things are honorable, whatever things are just, whatever things are pure, whatever things are lovely, whatever things are of good report; if there is any virtue, and if there is any praise, think about these things." },
        { num: 11, text: "Not that I speak in regard to need, for I have learned, in whatever state I am, to be content." },
        { num: 12, text: "I know how to be humbled, and I know also how to abound. In everything and in all things I have learned the secret both to be filled and to be hungry, both to abound and to be in need." },
        { num: 13, text: "I can do all things through Christ, who strengthens me." },
        { num: 19, text: "My God will supply every need of yours according to his riches in glory in Christ Jesus." }
      ]
    },
    LAM: {
      3: [
        { num: 21, text: "This I recall to my mind; therefore I have hope." },
        { num: 22, text: "It is of Yahweh's loving kindnesses that we are not consumed, because his compassion doesn't fail." },
        { num: 23, text: "They are new every morning. Great is your faithfulness." },
        { num: 24, text: "'Yahweh is my portion,' says my soul. 'Therefore I will hope in him.'" },
        { num: 25, text: "Yahweh is good to those who wait for him, to the soul who seeks him." },
        { num: 26, text: "It is good that a man should hope and quietly wait for the salvation of Yahweh." }
      ]
    },
    REV: {
      22: [
        { num: 1, text: "He showed me a river of water of life, clear as crystal, proceeding out of the throne of God and of the Lamb," },
        { num: 2, text: "in the middle of its street. On this side of the river and on that was the tree of life, bearing twelve kinds of fruits, yielding its fruit every month. The leaves of the tree were for the healing of the nations." },
        { num: 3, text: "There will be no curse any more. The throne of God and of the Lamb will be in it, and his servants will serve him." },
        { num: 4, text: "They will see his face, and his name will be on their foreheads." },
        { num: 5, text: "There will be no night, and they need no lamp light; for the Lord God will illuminate them. They will reign forever and ever." },
        { num: 6, text: "He said to me, 'These words are faithful and true. The Lord God of the spirits of the prophets sent his angel to show to his bondservants the things which must happen soon.'" },
        { num: 7, text: "'Behold, I come quickly. Blessed is he who keeps the words of the prophecy of this book.'" },
        { num: 8, text: "Now I, John, am the one who heard and saw these things. When I heard and saw, I fell down to worship before the feet of the angel who had shown me these things." },
        { num: 9, text: "He said to me, 'See you don't do it! I am a fellow bondservant with you and with your brothers, the prophets, and with those who keep the words of this book. Worship God.'" },
        { num: 10, text: "He said to me, 'Don't seal up the words of the prophecy of this book, for the time is at hand.'" },
        { num: 11, text: "He who acts unjustly, let him act unjustly still. He who is filthy, let him be filthy still. He who is righteous, let him do righteousness still. He who is holy, let him be holy still." },
        { num: 12, text: "'Behold, I come quickly. My reward is with me, to repay to each man according to his work.'" },
        { num: 13, text: "I am the Alpha and the Omega, the First and the Last, the Beginning and the End." },
        { num: 14, text: "Blessed are those who do his commandments, that they may have the right to the tree of life, and may enter in by the gates into the city." },
        { num: 15, text: "Outside are the dogs, the sorcerers, the sexually immoral, the murderers, the idolaters, and everyone who loves and practices falsehood." },
        { num: 16, text: "I, Jesus, have sent my angel to testify these things to you for the assemblies. I am the root and the offspring of David; the Bright and Morning Star." },
        { num: 17, text: "The Spirit and the bride say, 'Come!' He who hears, let him say, 'Come!' He who is thirsty, let him come. He who desires, let him take the water of life freely." },
        { num: 18, text: "I testify to everyone who hears the words of the prophecy of this book, if anyone adds to them, may God add to him the plagues which are written in this book." },
        { num: 19, text: "If anyone takes away from the words of the book of this prophecy, may God take away his part from the tree of life, and out of the holy city, which are written in this book." },
        { num: 20, text: "He who testifies these things says, 'Yes, I come quickly.' Amen! Yes, come, Lord Jesus." },
        { num: 21, text: "The grace of the Lord Jesus Christ be with all the saints. Amen." }
      ]
    }
  },
  KJV: {
    GEN: {
      1: [
        { num: 1, text: "In the beginning God created the heaven and the earth." },
        { num: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
        { num: 3, text: "And God said, Let there be light: and there was light." },
        { num: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
        { num: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." },
        { num: 6, text: "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters." },
        { num: 7, text: "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so." },
        { num: 8, text: "And God called the firmament Heaven. And the evening and the morning were the second day." },
        { num: 9, text: "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so." },
        { num: 10, text: "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good." },
        { num: 11, text: "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so." },
        { num: 12, text: "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good." },
        { num: 13, text: "And the evening and the morning were the third day." },
        { num: 14, text: "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:" },
        { num: 16, text: "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also." },
        { num: 26, text: "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth." },
        { num: 27, text: "So God created man in his own image, in the image of God created he him; male and female created he them." },
        { num: 31, text: "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day." }
      ]
    },
    PSA: {
      23: [
        { num: 1, text: "The LORD is my shepherd; I shall not want." },
        { num: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
        { num: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
        { num: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
        { num: 5, text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
        { num: 6, text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever." }
      ]
    },
    JHN: {
      1: [
        { num: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
        { num: 2, text: "The same was in the beginning with God." },
        { num: 3, text: "All things were made by him; and without him was not any thing made that was made." },
        { num: 4, text: "In him was life; and the life was the light of men." },
        { num: 5, text: "And the light shineth in darkness; and the darkness comprehended it not." },
        { num: 6, text: "There was a man sent from God, whose name was John." },
        { num: 7, text: "The same came for a witness, to bear witness of the Light, that all men through him might believe." },
        { num: 8, text: "He was not that Light, but was sent to bear witness of that Light." },
        { num: 9, text: "That was the true Light, which lighteth every man that cometh into the world." },
        { num: 10, text: "He was in the world, and the world was made by him, and the world knew him not." },
        { num: 14, text: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth." }
      ],
      3: [
        { num: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
        { num: 17, text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." }
      ]
    },
    MAT: {
      5: [
        { num: 1, text: "And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:" },
        { num: 2, text: "And he opened his mouth, and taught them, saying," },
        { num: 3, text: "Blessed are the poor in spirit: for theirs is the kingdom of heaven." },
        { num: 4, text: "Blessed are they that mourn: for they shall be comforted." },
        { num: 5, text: "Blessed are the meek: for they shall inherit the earth." },
        { num: 6, text: "Blessed are they which do hunger and thirst after righteousness: for they shall be filled." },
        { num: 7, text: "Blessed are the merciful: for they shall obtain mercy." },
        { num: 8, text: "Blessed are the pure in heart: for they shall see God." },
        { num: 9, text: "Blessed are the peacemakers: for they shall be called the children of God." },
        { num: 10, text: "Blessed are they which are persecuted for righteousness' sake: for theirs is the kingdom of heaven." }
      ]
    },
    ROM: {
      12: [
        { num: 1, text: "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service." },
        { num: 2, text: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God." },
        { num: 3, text: "For I say, through the grace given unto me, to every man that is among you, not to think of himself more highly than he ought to think; but to think soberly, according as God hath dealt to every man the measure of faith." },
        { num: 4, text: "For as we have many members in one body, and all members have not the same office:" },
        { num: 5, text: "So we, being many, are one body in Christ, and every one members one of another." },
        { num: 6, text: "Having then gifts differing according to the grace that is given to us, whether prophecy, let us prophesy according to the proportion of faith;" },
        { num: 7, text: "Or ministry, let us wait on our ministering: or he that teacheth, on teaching;" },
        { num: 8, text: "Or he that exhorteth, on exhortation: he that giveth, let him do it with simplicity; he that ruleth, with diligence; he that sheweth mercy, with cheerfulness." }
      ]
    }
  },
  AMT: {
    GEN: {
      1: [
        { num: 1, text: "At the very beginning, God crafted the heavens and the earth out of nothingness." },
        { num: 2, text: "The earth was completely empty and formless, shrouded in darkness over the deep ocean. But God's Spirit hovered gently over the waters, preparing to create." },
        { num: 3, text: "Then God spoke: 'Let light burst forth!' And instantly, light filled the void." },
        { num: 4, text: "God observed the light and smiled, seeing how good it was. He then separated the bright light from the dark shadows." },
        { num: 5, text: "God named the light 'Day' and the darkness 'Night.' Evening fell and morning broke -- completing the very first day." },
        { num: 6, text: "Next, God said, 'Let there be a vast canopy in the midst of the waters, separating the waters below from the waters above.'" },
        { num: 7, text: "So God created the atmosphere, placing a clear division between the waters on earth and the moisture above, and it stood firm." },
        { num: 8, text: "God named this open canopy 'Sky.' Evening came and morning returned -- marking the second day." },
        { num: 9, text: "God commanded, 'Let the waters under the sky gather into a single place, so that dry ground can appear.' And it happened exactly as he said." },
        { num: 10, text: "God named the dry ground 'Land,' and the gathered waters he called 'Seas.' God stood back and saw that this was beautiful and good." },
        { num: 26, text: "Then God said, 'Let us fashion humanity in our own image and likeness, to steward the fish, birds, livestock, and all living creatures of the earth.'" },
        { num: 27, text: "And so God created humanity in his own image -- in the image of God he formed them; male and female he created them." },
        { num: 31, text: "God surveyed all that he had made, and it was extraordinarily good. Evening settled in and morning arose -- the sixth and final day of creation." }
      ]
    },
    PSA: {
      23: [
        { num: 1, text: "The Divine is my caring Shepherd; I will always have everything I truly need." },
        { num: 2, text: "He invites me to rest in lush, peaceful meadows and guides me along quiet, refreshing streams." },
        { num: 3, text: "He renews my weary soul. He directs my footsteps along paths of goodness, honoring his own character." },
        { num: 4, text: "Even when I must walk through the darkest, most terrifying valleys, I won't fear, because you are walking right beside me. Your guidance and protection keep me safe." },
        { num: 5, text: "You set a beautiful feast for me right in front of my detractors. You welcome me as an honored guest, pouring soothing oil on my head; my cup overflows with your goodness." },
        { num: 6, text: "I am absolutely sure that mercy and love will follow me every single day of my life, and my true home will be in the presence of the Divine forever." }
      ]
    },
    JHN: {
      1: [
        { num: 1, text: "In the absolute beginning, the Word existed. The Word was intimately present with God, and the Word was fully God." },
        { num: 2, text: "He was there with God from the very start." },
        { num: 3, text: "Everything that exists was made through him; not a single thing in creation came to be without him." },
        { num: 4, text: "In him was the source of life itself, and that life was the light that illuminates all of humanity." },
        { num: 5, text: "This light shines continuously in the darkness, and the darkness has never been able to extinguish it." },
        { num: 6, text: "God sent a messenger named John." },
        { num: 7, text: "John came to testify as a witness to the light, so that everyone might find belief through his message." },
        { num: 8, text: "John himself was not the light; he was simply sent to point others to the light." },
        { num: 9, text: "The true light, which brings clarity and life to every person, was just arriving in the world." },
        { num: 10, text: "He entered the very world he had created, yet the world failed to recognize who he was." }
      ],
      3: [
        { num: 16, text: "For God loved this world so immensely that He offered His only begotten Son, so that every person who rests their trust in Him will not face destruction, but enter into eternal life." }
      ]
    },
    MAT: {
      5: [
        { num: 1, text: "When Jesus saw the crowds gathering, he walked up the mountainside. He sat down, and his close followers gathered around him." },
        { num: 2, text: "He began to teach them, sharing these principles of the Kingdom:" },
        { num: 3, text: "Blessed are those who recognize their spiritual poverty, for the Kingdom of Heaven is wide open to them." },
        { num: 4, text: "Blessed are those who grieve and mourn, for they will find deep comfort." },
        { num: 5, text: "Blessed are the gentle and humble, for they will inherit the earth." },
        { num: 6, text: "Blessed are those who hunger and thirst to see things made right, for their souls will be satisfied." },
        { num: 7, text: "Blessed are the merciful, for they will be shown mercy in return." },
        { num: 8, text: "Blessed are those with pure motives and clean hearts, for they will see God." },
        { num: 9, text: "Blessed are the peacemakers, for they will be recognized as God's own children." },
        { num: 10, text: "Blessed are those who face mistreatment for doing what is right, for the Kingdom of Heaven belongs to them." }
      ]
    },
    ROM: {
      12: [
        { num: 1, text: "So here's what I want you to do, brothers and sisters, in light of God's overwhelming mercy: offer your entire lives as a living, holy sacrifice to God. This is the only logical way to worship him." },
        { num: 2, text: "Don't copy the behaviors and customs of this modern culture, but let God transform you from the inside out by changing the way you think. Then you will learn to discern God's will -- what is good, pleasing, and perfect." },
        { num: 3, text: "Because of the grace given to me, I give this warning to each of you: don't estimate your own importance too highly. Instead, evaluate yourself honestly and realistically, based on the faith God has measured out to you." },
        { num: 4, text: "Just as our physical bodies have many parts and each part has a distinct function," },
        { num: 5, text: "so it is with Christ's body. We are many parts of one single body, and we all belong to one another." },
        { num: 6, text: "In his grace, God has given us different gifts for doing certain things well. So if God has given you the ability to prophesy, speak out with as much faith as God has given you." },
        { num: 7, text: "If your gift is serving others, serve them well. If you are a teacher, teach well." },
        { num: 8, text: "If your gift is to encourage others, be encouraging. If you give, give generously. If God has given you leadership responsibility, take it seriously. And if you have a gift for showing kindness, do it gladly." }
      ]
    }
  }
};





const READING_PLANS = [
  {
    id: 'anxiety',
    title: 'Finding Peace in Anxiety',
    category: 'anxiety',
    duration: 3,
    difficulty: 'Easy',
    popularity: '4.8 ★ (12.4k started)',
    completionRate: '88%',
    description: 'A gentle 3-day devotional plan designed to calm your heart, quiet your thoughts, and anchor your mind in divine peace.',
    days: [
      {
        day: 1,
        title: 'Cast Your Cares',
        ref: 'PSA 23:1-6',
        devotional: 'Anxiety often tells us we are alone and that we must carry the weight of our future on our own shoulders. But Psalm 23 reminds us that we have a Shepherd. A shepherd does not expect the sheep to secure their own food, find their own paths, or fight off predators. The shepherd takes responsibility for the sheep. Today, practice breathing in God\'s presence. Tell Him what scares you, and visualize laying that burden down at His feet. You do not have to carry it anymore.',
        reflection: 'What is the primary care or worry you need to hand over to your Shepherd today?',
        prayer: 'Lord, thank You for being my Shepherd. Today, I confess my anxiety and hand over my worries about tomorrow. I trust that You will lead me to still waters and restore my soul. Amen.'
      },
      {
        day: 2,
        title: 'Renewing Your Mind',
        ref: 'ROM 12:1-8',
        devotional: 'Our minds can easily become loops of worst-case scenarios. Romans 12 encourages us not to be conformed to the pattern of this world—which is often anxious, rushed, and fearful—but to be transformed by the renewing of our minds. Renewing your mind is a daily, sometimes hourly practice of replacing fearful thoughts with truth. It means focusing on your gifts, serving others, and realizing you are part of a larger community of faith.',
        reflection: 'What negative thought pattern have you been conforming to lately, and what truth can you replace it with?',
        prayer: 'Holy Father, transform my thinking today. Quiet the noise of this world. Fill my mind with thoughts that are true, honorable, and worthy of praise. Show me how to serve others with the gifts You have given me. Amen.'
      },
      {
        day: 3,
        title: 'Walking in the Light',
        ref: 'JHN 1:1-10',
        devotional: 'Darkness represents uncertainty, fear, and hidden danger. But John 1 tells us that the Light of the world has come, and the darkness has not—and cannot—overcome it. When anxiety makes the future look dark, remember that Christ\'s light goes before you. You do not have to see the entire path ahead; you only need enough light for the next step. Let His light expose and dissolve your fears today.',
        reflection: 'How does knowing the Light is stronger than any darkness change your perspective on your current trials?',
        prayer: 'Jesus, You are the true Light. Shine into the dark corners of my heart and dispel all lingering fear. Help me walk confidently today, knowing that Your light guides my steps. Amen.'
      }
    ]
  },
  {
    id: 'love',
    title: 'Walk in Divine Love',
    category: 'relationships',
    duration: 3,
    difficulty: 'Medium',
    popularity: '4.9 ★ (8.1k started)',
    description: 'Explore the depths of unconditional love and how to reflect it in your daily interactions, family, and friendships.',
    days: [
      {
        day: 1,
        title: 'The Blueprint of Love',
        ref: 'JHN 1:1-10',
        devotional: 'Before we can love others, we must understand how we are loved. The Word became flesh and walked among us as light. Love is not a mere feeling; it is active, sacrificial, and present. To walk in love is to bring light into places of darkness and division. Today, let the reality of God\'s love for you sink in, allowing it to overflow into how you speak to those around you.',
        reflection: 'In what area of your life do you find it hardest to receive unconditional love?',
        prayer: 'Father, thank You for loving me before I even knew how to love You. Help me comprehend the depth of Your love today so that I can share it freely with others. Amen.'
      },
      {
        day: 2,
        title: 'Humility and Unity',
        ref: 'MAT 5:1-10',
        devotional: 'Jesus begins His famous sermon with the Beatitudes, redefining what it means to be blessed. Blessed are the gentle, the merciful, the peacemakers. These are all attributes of a loving heart. Peacemaking is hard work. It requires laying down our pride, listening before speaking, and valuing relationship over being right. Love is active peacemaking.',
        reflection: 'Who is one person in your life that needs your mercy or peacemaking initiative today?',
        prayer: 'Lord Jesus, give me a meek and merciful heart today. Make me an instrument of Your peace in my home, my workplace, and my community. Amen.'
      },
      {
        day: 3,
        title: 'Love in Action',
        ref: 'ROM 12:1-8',
        devotional: 'Romans 12 shows us what love looks like in practical terms. It looks like using our unique gifts to build up others. It means rejoicing with those who rejoice and weeping with those who weep. It means showing hospitality and living in harmony. Love is not abstract; it is a verb. Let\'s put love into action by serving someone today.',
        reflection: 'How can you use one of your unique talents or resources to show practical love to someone today?',
        prayer: 'God, thank You for equipping me with gifts to serve. Show me who needs encouragement today and give me the courage to step out and love them in action. Amen.'
      }
    ]
  },
  {
    id: 'hope',
    title: 'A Living Hope',
    category: 'hope',
    duration: 3,
    difficulty: 'Easy',
    popularity: '4.7 ★ (15.2k started)',
    description: 'Rebuild your expectations and restore your joy through scriptures that anchor your soul in eternal hope.',
    days: [
      {
        day: 1,
        title: 'New Beginnings',
        ref: 'GEN 1:1-10',
        devotional: 'Genesis begins in chaos—waste, void, and darkness. Yet, out of that chaos, God speaks beauty, order, and life into existence. If your life feels chaotic or empty today, remember that God is the specialist of new beginnings. He is still speaking light into dark places. Your current state is not your final destination. Have hope in the Creator\'s power to renew.',
        reflection: 'Where in your life do you need God to speak "Let there be light" today?',
        prayer: 'Creator God, bring order to my chaos and light to my darkness. I put my hope in Your power to make all things new. Amen.'
      },
      {
        day: 2,
        title: 'Restoring Joy',
        ref: 'PSA 23:1-6',
        devotional: 'David wrote Psalm 23 during periods of deep distress and fleeing for his life, yet it is a song of complete hope. "Surely goodness and mercy shall follow me all the days of my life." He didn\'t say trouble wouldn\'t come; he said God\'s goodness would chase him down. Hope is the confident expectation that God\'s goodness is active behind the scenes, chasing you.',
        reflection: 'Can you recall a time when God\'s goodness chased you down after a difficult season?',
        prayer: 'Lord, even when I walk through dark valleys, I choose hope. I believe that Your goodness and mercy are pursuing me today. Amen.'
      },
      {
        day: 3,
        title: 'The Word of Hope',
        ref: 'JHN 1:1-10',
        devotional: 'The Light shines in the darkness, and the darkness has not overcome it. This is the ultimate statement of hope. No matter how dark the world or your circumstances seem, the light of Christ is inextinguishable. It remains, it guides, and it wins. Hope is holding onto that light, knowing that dawn is coming.',
        reflection: 'What small step of faith can you take today to hold onto the light of hope?',
        prayer: 'Jesus, shine brightly in my heart. Keep my hope anchored in You, knowing that the darkness can never overcome Your light. Amen.'
      }
    ]
  },
  {
    id: 'sermon-on-the-mount',
    title: 'Sermon on the Mount',
    category: 'sermons',
    duration: 3,
    difficulty: 'Medium',
    popularity: '4.9 ★ (18.6k started)',
    description: 'Dive deep into Jesus\' core teachings on character, integrity, and faith in the Sermon on the Mount.',
    days: [
      {
        day: 1,
        title: 'Salt and Light',
        ref: 'MAT 5:13-16',
        devotional: 'Jesus tells His followers that they are the salt of the earth and the light of the world. Salt preserves and adds flavor; light dispels darkness. We are called to live distinct lives that point others to God. Let your light shine today.',
        reflection: 'How can you be "salt" and "light" in your workplace or family today?',
        prayer: 'Lord, make me salt and light today. Help me live with integrity so that others see Your goodness through my actions. Amen.'
      },
      {
        day: 2,
        title: 'Do Not Worry',
        ref: 'MAT 6:25-34',
        devotional: 'Look at the birds of the air; they do not sow or reap, yet your heavenly Father feeds them. Are you not much more valuable than they? Jesus invites us to seek first His kingdom and righteousness, trusting Him for our daily needs.',
        reflection: 'What worries are you holding onto that you need to surrender to God today?',
        prayer: 'Father, help me seek Your kingdom first today. I release my worries about food, clothing, and the future into Your hands. Amen.'
      },
      {
        day: 3,
        title: 'The Wise Builder',
        ref: 'MAT 7:24-27',
        devotional: 'Everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock. The rain came down, the streams rose, and the winds blew, but the house did not fall. Build your life on the rock of obedience.',
        reflection: 'What is one specific teaching of Jesus you need to put into practice today?',
        prayer: 'Lord Jesus, help me be not just a hearer of Your word, but a doer. Build my life on the solid rock of Your truth. Amen.'
      }
    ]
  }
];

const SEED_COMMUNITY = {
  friends: [
    { id: 1, name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', online: true, plan: 'Finding Peace in Anxiety' },
    { id: 2, name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', online: false, plan: 'Walk in Divine Love' },
    { id: 3, name: 'Grace Taylor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', online: true, plan: 'None' },
    { id: 4, name: 'Marcus Brody', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', online: false, plan: 'A Living Hope' }
  ],
  prayers: [
    {
      id: 'pr-1',
      author: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      text: 'Praying for my mother who is undergoing surgery tomorrow morning. Asking for wisdom for the doctors and peace for our family.',
      isPublic: true,
      answered: false,
      prayCount: 18,
      prayedByMe: false,
      comments: [
        { author: 'Grace Taylor', text: 'Standing in faith with you, Sarah! Praying for peace.', time: '2 hours ago' },
        { author: 'David Chen', text: 'Lord, guide the hands of the medical staff.', time: '1 hour ago' }
      ],
      time: '3 hours ago'
    },
    {
      id: 'pr-2',
      author: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      text: 'Seeking guidance for a major career transition. I want to align my path with God’s purpose and serve where He needs me most.',
      isPublic: true,
      answered: false,
      prayCount: 12,
      prayedByMe: true,
      comments: [],
      time: '6 hours ago'
    }
  ],
  feed: [
    {
      id: 'feed-1',
      author: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      type: 'highlight',
      detail: 'highlighted Psalm 23:4 in AMD',
      text: '“Even when I must walk through the darkest, most terrifying valleys, I won\'t fear, because you are walking right beside me.”',
      time: '45 mins ago',
      likes: 8,
      likedByMe: false,
      comments: []
    },
    {
      id: 'feed-2',
      author: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      type: 'plan',
      detail: 'completed Day 1 of "A Living Hope"',
      text: 'Really loved the devotion on how God creates order out of chaos in Genesis 1. Highly recommend this plan!',
      time: '4 hours ago',
      likes: 12,
      likedByMe: true,
      comments: [
        { author: 'Sarah Jenkins', text: 'I need to check that one out next!', time: '3 hours ago' }
      ]
    }
  ]
};

const SEED_MEETINGS = [
  {
    id: 'zoom-1',
    title: 'Anxiety Study Fellowship',
    desc: 'Let\'s gather to review our daily readings on anxiety and encourage one another.',
    host: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    time: 'Live Now',
    duration: 40,
    isLive: true,
    link: 'https://zoom.us/j/5558889991?pwd=PeacefulStudyRoom101'
  },
  {
    id: 'zoom-2',
    title: 'Morning Prayer & Devotional Circle',
    desc: 'A daily morning communion to seek God\'s presence and align our hearts for the day.',
    host: 'Marcus Brody',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    time: 'Today at 7:00 PM',
    duration: 60,
    isLive: false,
    link: 'https://zoom.us/j/4442223335?pwd=MorningGraceCircle302'
  }
];

const SEED_PROFILE = {
  name: 'Elijah Sterling',
  email: 'elijah@aurabible.org',
  streak: 8,
  todayCompleted: false,
  joinedDate: 'Joined Oct 2025',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  stats: {
    highlights: 4,
    notes: 2,
    bookmarks: 3,
    plansCompleted: 1
  }
};

const NAVIGATION_ITEMS = [
  { target: 'home', iconHtml: `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`, labelKey: 'navHome' },
  { target: 'bible', iconHtml: `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`, labelKey: 'navBible' },
  { target: 'plans', iconHtml: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`, labelKey: 'navPlans' },
  { target: 'sermons', iconHtml: `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="9" y1="6" x2="16" y2="6"></line><line x1="9" y1="10" x2="16" y2="10"></line><line x1="9" y1="14" x2="16" y2="14"></line></svg>`, labelKey: 'navSermons' },
  { target: 'prayer', iconHtml: `<svg viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`, labelKey: 'navPrayer' },
  { target: 'community', iconHtml: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`, labelKey: 'navCommunity' },
  { target: 'meetings', iconHtml: `<svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`, labelKey: 'navMeetings' },
  { target: 'saved', iconHtml: `<svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`, labelKey: 'navSaved' }
];

const DAILY_DEVOTIONALS = [
  {
    id: 'devo-1',
    date: { en: 'July 6', vi: 'Ngày 6 tháng 7' },
    title: { en: "Rest in the Shepherd's Care", vi: 'Nghỉ ngơi trong sự chăn dắt của Đấng Chăn Chiên' },
    excerpt: {
      en: 'In a world full of checklists and constant noise, God invites us to lie down in green pastures...',
      vi: 'Trong một thế giới đầy những danh sách việc cần làm và tiếng ồn liên tục, Chúa mời gọi chúng ta nằm nghỉ trong đồng cỏ xanh tươi...'
    },
    tag: { en: "Today's Reflection", vi: 'Suy ngẫm hôm nay' },
    btnText: { en: 'Read Devotional', vi: 'Đọc bài tĩnh nguyện' }
  }
];

const QUICK_TOOLS = [
  { id: 'quick-reader', action: 'read-bible', iconHtml: `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 20V4H20v16H6.5z"></path></svg>`, labelKey: 'quickReader' },
  { id: 'quick-prayer', action: 'new-prayer', iconHtml: `<svg viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path></svg>`, labelKey: 'quickPrayer' },
  { id: 'quick-saved', action: 'view-saved', iconHtml: `<svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`, labelKey: 'quickSaved' },
  { id: 'quick-plans', action: 'view-plans', iconHtml: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line></svg>`, labelKey: 'quickPlans' }
];

const PLAN_CATEGORIES = [
  { id: 'all', name: { en: 'All Plans', vi: 'Tất cả kế hoạch' } },
  { id: 'anxiety', name: { en: 'Anxiety', vi: 'Lo âu' } },
  { id: 'relationships', name: { en: 'Relationships', vi: 'Mối quan hệ' } },
  { id: 'hope', name: { en: 'Hope', vi: 'Hy vọng' } },
  { id: 'sermons', name: { en: 'Sermons', vi: 'Bài giảng' } }
];

const ZOOM_DURATIONS = [
  { value: 40, label: { en: '40 Minutes', vi: '40 Phút' } },
  { value: 60, label: { en: '60 Minutes', vi: '60 Phút' } },
  { value: 90, label: { en: '90 Minutes', vi: '90 Phút' } }
];

const ZOOM_RECURRENCES = [
  { value: 'Every Sunday', label: { en: 'Every Sunday', vi: 'Mỗi Chủ Nhật' } },
  { value: 'Every Monday', label: { en: 'Every Monday', vi: 'Mỗi Thứ Hai' } },
  { value: 'Every Tuesday', label: { en: 'Every Tuesday', vi: 'Mỗi Thứ Ba' } },
  { value: 'Every Wednesday', label: { en: 'Every Wednesday', vi: 'Mỗi Thứ Tư' } },
  { value: 'Every Thursday', label: { en: 'Every Thursday', vi: 'Mỗi Thứ Năm' } },
  { value: 'Every Friday', label: { en: 'Every Friday', vi: 'Mỗi Thứ Sáu' } },
  { value: 'Every Saturday', label: { en: 'Every Saturday', vi: 'Mỗi Thứ Bảy' } },
  { value: 'Every Day', label: { en: 'Every Day', vi: 'Mỗi Ngày' } }
];

// Standard Bible verse counts per book per chapter
const BIBLE_VERSE_COUNTS = {
  GEN:[31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
  EXO:[22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
  LEV:[17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,24,16,34,4,36,15,12,14,15,45,40,45,10,35,20,33,20,31,13],
  NUM:[54,34,51,49,31,27,89,26,23,36,31,16,23,21,39,30,25,22,51,31,40,25,22,23,31,40,25,27,32,26,22,31,29,23,26,40,22,20,48,40,16,24,24,23,23,23,27,27],
  DEU:[46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12,21,17],
  JOS:[18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
  JDG:[36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
  RUT:[22,23,18,22],
  '1SA':[28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
  '2SA':[27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
  '1KI':[53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
  '2KI':[18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],
  '1CH':[54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
  '2CH':[17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
  EZR:[11,70,13,24,17,22,28,36,15,44],
  NEH:[11,20,32,23,19,19,73,18,38,39,36,47,31],
  EST:[22,28,23,31,10,22,23,29,13,19],
  JOB:[22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
  PSA:[6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,13,25,11,22,23,28,13,40,23,14,18,14,12,5,27,18,12,10,15,21,23,21,11,7,9,24,14,12,12,18,14,9,13,12,11,14,20,8,36,37,6,24,20,28,23,11,13,21,72,13,20,17,8,19,13,14,17,7,19,53,17,16,16,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,14,10,8,12,15,21,10,20,14,9,6],
  PRO:[33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],
  ECC:[18,26,22,16,20,12,29,17,18,20,10,14],
  SNG:[17,17,11,16,16,13,13,14],
  ISA:[31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,21,29,2,26,39,18,35,16,25,22,11,31,16,9,48,25],
  JER:[19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
  LAM:[22,22,66,22,22],
  EZK:[28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
  DAN:[21,49,30,37,31,28,28,27,27,21,45,13],
  HOS:[11,23,5,19,15,11,16,14,17,15,12,14,16,9],
  JOL:[20,32,21],
  AMO:[15,16,15,13,27,14,17,14,15],
  OBA:[21],
  JON:[17,10,10,11],
  MIC:[16,13,12,13,15,16,20],
  NAM:[15,13,19],
  HAB:[17,20,19],
  ZEP:[18,15,20],
  HAG:[15,23],
  ZEC:[21,13,10,14,11,15,14,23,17,12,17,14,9,21],
  MAL:[14,17,18,6],
  MAT:[25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
  MRK:[45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
  LUK:[80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
  JHN:[51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
  ACT:[26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],
  ROM:[32,29,31,25,21,23,25,39,33,21,36,21,14,26,33,25],
  '1CO':[31,16,23,21,13,20,40,13,27,33,34,31,13,54,22,24,21],
  '2CO':[24,17,18,18,21,18,16,24,15,18,33,21,13],
  GAL:[24,21,29,31,26,18],
  EPH:[23,22,21,28,20,12],
  PHP:[30,30,21,23],
  COL:[29,23,25,18],
  '1TH':[10,20,13,18,28],
  '2TH':[12,17,18],
  '1TI':[20,15,16,16,25,21],
  '2TI':[18,26,17,22],
  TIT:[16,15,15],
  PHM:[25],
  HEB:[14,18,19,16,14,20,28,13,28,39,40,29,25],
  JAS:[27,26,18,17,20],
  '1PE':[25,25,22,19,14],
  '2PE':[21,22,18],
  '1JN':[10,29,24,21,21],
  '2JN':[13],
  '3JN':[14],
  JUD:[25],
  REV:[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21]
};

// Expose to window object for modular access
window.BIBLE_DATA = {
  books: BIBLE_BOOKS,
  translations: BIBLE_TRANSLATIONS,
  staticScriptures: STATIC_SCRIPTURES,
  plans: READING_PLANS,
  community: SEED_COMMUNITY,
  profile: SEED_PROFILE,
  meetings: SEED_MEETINGS,
  navigationItems: NAVIGATION_ITEMS,
  dailyDevotionals: DAILY_DEVOTIONALS,
  quickTools: QUICK_TOOLS,
  planCategories: PLAN_CATEGORIES,
  zoomDurations: ZOOM_DURATIONS,
  zoomRecurrences: ZOOM_RECURRENCES,
  votdList: [
    {
      bookId: 'PSA',
      chapter: 23,
      verseNum: 1,
      bookName: { English: 'Psalm', 'Tiếng Việt': 'Thi-thiên' },
      text: {
        WEB: "Yahweh is my shepherd. I shall not lack.",
        KJV: "The LORD is my shepherd; I shall not want.",
        AMT: "The Divine is my caring Shepherd; I will always have everything I truly need.",
        VIE: "Đức Giê-hô-va là Đấng chăn giữ tôi; tôi sẽ chẳng thiếu thốn gì."
      }
    },
    {
      bookId: 'JHN',
      chapter: 14,
      verseNum: 6,
      bookName: { English: 'John', 'Tiếng Việt': 'Giăng' },
      text: {
        WEB: "Jesus said to him, 'I am the way, the truth, and the life. No one comes to the Father, except through me.'",
        KJV: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
        AMT: "Jesus answered, 'I am the path, the truth, and the life itself. The only route to the Father runs through me.'",
        VIE: "Đức Chúa Jêsus đáp rằng: Ta là đường đi, lẽ thật, và sự sống; chẳng bởi ta thì không ai được đến cùng Cha."
      }
    },
    {
      bookId: 'JHN',
      chapter: 14,
      verseNum: 27,
      bookName: { English: 'John', 'Tiếng Việt': 'Giăng' },
      text: {
        WEB: "Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Don't let your heart be troubled, neither let it be fearful.",
        KJV: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
        AMT: "I am leaving you with a gift -- peace of mind and heart. The peace I give isn't like what the world gives. So don't be troubled or afraid.",
        VIE: "Ta để sự bình an lại cho các ngươi; ta ban sự bình an ta cho các ngươi; ta cho các ngươi sự bình an chẳng phải như thế gian cho. Lòng các ngươi chớ bối rối và đừng sợ hãi."
      }
    },
    {
      bookId: 'ROM',
      chapter: 8,
      verseNum: 1,
      bookName: { English: 'Romans', 'Tiếng Việt': 'Rô-ma' },
      text: {
        WEB: "There is therefore now no condemnation to those who are in Christ Jesus.",
        KJV: "There is therefore now no condemnation to them which are in Christ Jesus.",
        AMT: "Now the judgment of condemnation has been completely lifted for all who are united with Jesus the Messiah.",
        VIE: "Hiện nay chẳng còn có sự đoán phạt nào cho những kẻ ở trong Đức Chúa Jêsus Christ."
      }
    },
    {
      bookId: 'ROM',
      chapter: 8,
      verseNum: 39,
      bookName: { English: 'Romans', 'Tiếng Việt': 'Rô-ma' },
      text: {
        WEB: "Nor height, nor depth, nor any other created thing, will be able to separate us from the love of God, which is in Christ Jesus our Lord.",
        KJV: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
        AMT: "Nothing in all of creation -- not height nor depth nor anything else -- can ever separate us from the relentless love of God found in Jesus Christ our Lord.",
        VIE: "Bề cao, bề sâu, hay là một vật nào khác, đều chẳng có thể phân rẽ chúng ta khỏi sự yêu thương mà Đức Chúa Trời đã chứng cho chúng ta trong Đức Chúa Jêsus Christ, là Chúa chúng ta."
      }
    },
    {
      bookId: 'PHP',
      chapter: 4,
      verseNum: 6,
      bookName: { English: 'Philippians', 'Tiếng Việt': 'Phi-líp' },
      text: {
        WEB: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.",
        KJV: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
        AMT: "Don't stress about anything. Instead, pray about everything. Tell God what you need, and thank him for all he has done.",
        VIE: "Chớ lo phiền chi hết, nhưng trong mọi sự hãy dùng lời cầu nguyện, nài xin, và sự tạ ơn mà trình các sự cần dùng của mình cho Đức Chúa Trời."
      }
    },
    {
      bookId: 'PHP',
      chapter: 4,
      verseNum: 7,
      bookName: { English: 'Philippians', 'Tiếng Việt': 'Phi-líp' },
      text: {
        WEB: "The peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.",
        KJV: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
        AMT: "And the peace God gives, which is far more wonderful than the human mind can understand, will guard your hearts and minds as you live in Christ Jesus.",
        VIE: "Sự bình an của Đức Chúa Trời vượt quá mọi sự hiểu biết, sẽ giữ gìn lòng và ý tưởng anh em trong Đức Chúa Jêsus Christ."
      }
    },
    {
      bookId: 'ISA',
      chapter: 40,
      verseNum: 31,
      bookName: { English: 'Isaiah', 'Tiếng Việt': 'Ê-sai' },
      text: {
        WEB: "But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.",
        KJV: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
        AMT: "But those who trust in the Lord will find new strength. They will soar high on wings like eagles. They will run and not grow weary. They will walk and not faint.",
        VIE: "Những kẻ trông đợi Đức Giê-hô-va sẽ thêm sức mới, cất cánh bay lên như chim ưng; chạy mà không mệt nhọc, đi mà không kiệt sức."
      }
    },
    {
      bookId: 'JER',
      chapter: 29,
      verseNum: 11,
      bookName: { English: 'Jeremiah', 'Tiếng Việt': 'Giê-rê-mi' },
      text: {
        WEB: "For I know the thoughts that I think toward you, says Yahweh, thoughts of peace and not of evil, to give you hope and a future.",
        KJV: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
        AMT: "For I know the plans I have for you, says the Lord. They are plans for good and not for disaster, to give you a future and a hope.",
        VIE: "Vì ta biết những ý tưởng ta nghĩ đối cùng các ngươi, là ý tưởng bình an, không phải tai họa, để cho các ngươi được sự trông cậy trong lúc cuối cùng của các ngươi."
      }
    },
    {
      bookId: 'MAT',
      chapter: 5,
      verseNum: 3,
      bookName: { English: 'Matthew', 'Tiếng Việt': 'Ma-thi-ơ' },
      text: {
        WEB: "Blessed are the poor in spirit, for theirs is the Kingdom of Heaven.",
        KJV: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
        AMT: "Blessed are those who recognize their spiritual poverty, for the Kingdom of Heaven is wide open to them.",
        VIE: "Phước cho những kẻ có lòng khó khăn, vì nước thiên đàng là của những kẻ ấy!"
      }
    },
    {
      bookId: 'MAT',
      chapter: 6,
      verseNum: 33,
      bookName: { English: 'Matthew', 'Tiếng Việt': 'Ma-thi-ơ' },
      text: {
        WEB: "But seek first God's Kingdom, and his righteousness; and all these things will be given to you as well.",
        KJV: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
        AMT: "Make the Kingdom of God your primary pursuit and live righteously, and he will give you everything you need.",
        VIE: "Nhưng trước hết hãy tìm kiếm nước Đức Chúa Trời và sự công bình của Ngài, thì Ngài sẽ cho thêm các ngươi mọi điều ấy nữa."
      }
    },
    {
      bookId: 'PSA',
      chapter: 119,
      verseNum: 105,
      bookName: { English: 'Psalm', 'Tiếng Việt': 'Thi-thiên' },
      text: {
        WEB: "Your word is a lamp to my feet, and a light for my path.",
        KJV: "Thy word is a lamp unto my feet, and a light unto my path.",
        AMT: "Your word is a guiding lamp for my feet, illuminating the path just ahead of me.",
        VIE: "Lời Ngài là ngọn đèn cho chân tôi, và ánh sáng cho đường đi tôi."
      }
    },
    {
      bookId: 'PSA',
      chapter: 91,
      verseNum: 1,
      bookName: { English: 'Psalm', 'Tiếng Việt': 'Thi-thiên' },
      text: {
        WEB: "He who dwells in the secret place of the Most High will rest in the shadow of the Almighty.",
        KJV: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
        AMT: "Whoever lives under the shelter of the Most High God will be protected in the shadow of the Almighty.",
        VIE: "Kẻ ở nơi kín đáo của Đấng Chí Cao sẽ hằng được ở dưới bóng của Đấng Toàn Năng."
      }
    },
    {
      bookId: '1CO',
      chapter: 13,
      verseNum: 4,
      bookName: { English: '1 Corinthians', 'Tiếng Việt': '1 Cô-rinh-tô' },
      text: {
        WEB: "Love is patient and is kind; love doesn't envy. Love doesn't brag, is not proud.",
        KJV: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.",
        AMT: "Love is patient and kind. Love is not jealous or boastful or proud.",
        VIE: "Tình yêu thương hay nhịn nhục; tình yêu thương hay nhân từ; tình yêu thương chẳng ghen tị, chẳng khoe mình, chẳng lên mình kiêu ngạo."
      }
    },
    {
      bookId: '1CO',
      chapter: 13,
      verseNum: 13,
      bookName: { English: '1 Corinthians', 'Tiếng Việt': '1 Cô-rinh-tô' },
      text: {
        WEB: "But now faith, hope, and love remain -- these three. The greatest of these is love.",
        KJV: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
        AMT: "Three things will last forever -- faith, hope, and love -- and the greatest of these is love.",
        VIE: "Nên bây giờ còn có ba điều nầy: đức tin, sự trông cậy, tình yêu thương; nhưng điều trọng hơn trong ba điều đó là tình yêu thương."
      }
    },
    {
      bookId: 'ROM',
      chapter: 12,
      verseNum: 2,
      bookName: { English: 'Romans', 'Tiếng Việt': 'Rô-ma' },
      text: {
        WEB: "Don't be conformed to this world, but be transformed by the renewing of your mind.",
        KJV: "And be not conformed to this world: but be ye transformed by the renewing of your mind.",
        AMT: "Don't copy the behavior and customs of this world, but let God transform you into a new person by changing the way you think.",
        VIE: "Đừng làm theo đời nầy, nhưng hãy biến hóa bởi sự đổi mới của tâm thần mình."
      }
    },
    {
      bookId: 'PRO',
      chapter: 3,
      verseNum: 6,
      bookName: { English: 'Proverbs', 'Tiếng Việt': 'Châm-ngôn' },
      text: {
        WEB: "In all your ways acknowledge him, and he will make your paths straight.",
        KJV: "In all thy ways acknowledge him, and he shall direct thy paths.",
        AMT: "Seek his will in all you do, and he will show you which path to take.",
        VIE: "Phàm trong các việc làm của con, hãy nhận biết Ngài, thì Ngài sẽ chỉ dẫn các nẻo của con."
      }
    },
    {
      bookId: 'GEN',
      chapter: 1,
      verseNum: 1,
      bookName: { English: 'Genesis', 'Tiếng Việt': 'Sáng-thế Ký' },
      text: {
        WEB: "In the beginning, God created the heavens and the earth.",
        KJV: "In the beginning God created the heaven and the earth.",
        AMT: "At the very beginning, God crafted the heavens and the earth out of nothingness.",
        VIE: "Ban đầu Đức Chúa Trời dựng nên trời đất."
      }
    },
    {
      bookId: 'GEN',
      chapter: 1,
      verseNum: 27,
      bookName: { English: 'Genesis', 'Tiếng Việt': 'Sáng-thế Ký' },
      text: {
        WEB: "God created man in his own image. In God's image he created him; male and female he created them.",
        KJV: "So God created man in his own image, in the image of God created he him; male and female created he them.",
        AMT: "So God created human beings in his own image. In the image of God he created them; male and female he created them.",
        VIE: "Đức Chúa Trời dựng nên loài người như hình Ngài; Ngài dựng nên loài người giống như hình Đức Chúa Trời; Ngài dựng nên người nam cùng người nữ."
      }
    },
    {
      bookId: 'ISA',
      chapter: 40,
      verseNum: 28,
      bookName: { English: 'Isaiah', 'Tiếng Việt': 'Ê-sai' },
      text: {
        WEB: "The everlasting God, Yahweh, the Creator of the ends of the earth, doesn't faint. He isn't weary. His understanding is unsearchable.",
        KJV: "Hast thou not known? hast thou not heard, that the everlasting God, the LORD, the Creator of the ends of the earth, fainteth not, neither is weary? there is no searching of his understanding.",
        AMT: "Have you never heard? Have you never understood? The Lord is the everlasting God, the Creator of all the earth. He never grows weak or weary. No one can measure the depths of his understanding.",
        VIE: "Đức Chúa Trời hằng sống, là Đức Giê-hô-va, là Đấng đã dựng nên các đầu cùng đất, không mỏi không mệt; sự thông sáng Ngài không thể dò được."
      }
    },
    {
      bookId: 'JHN',
      chapter: 1,
      verseNum: 1,
      bookName: { English: 'John', 'Tiếng Việt': 'Giăng' },
      text: {
        WEB: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        KJV: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        AMT: "In the absolute beginning, the Word existed. The Word was intimately present with God, and the Word was fully God.",
        VIE: "Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời."
      }
    },
    {
      bookId: 'JHN',
      chapter: 1,
      verseNum: 14,
      bookName: { English: 'John', 'Tiếng Việt': 'Giăng' },
      text: {
        WEB: "The Word became flesh, and lived among us. We saw his glory, such glory as of the only born Son of the Father, full of grace and truth.",
        KJV: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
        AMT: "So the Word became human and made his home among us. He was full of unfailing love and faithfulness. And we have seen his glory, the glory of the Father's one and only Son.",
        VIE: "Ngôi Lời đã trở nên xác thịt, ở giữa chúng ta, đầy ơn huệ và lẽ thật; chúng ta đã ngắm xem sự vinh hiển của Ngài, thật như vinh hiển của Con một đến từ nơi Cha."
      }
    },
    {
      bookId: 'MAT',
      chapter: 5,
      verseNum: 14,
      bookName: { English: 'Matthew', 'Tiếng Việt': 'Ma-thi-ơ' },
      text: {
        WEB: "You are the light of the world. A city located on a hill can't be hidden.",
        KJV: "Ye are the light of the world. A city that is set on an hill cannot be hid.",
        AMT: "You are the light of the world -- like a city on a hilltop that cannot be hidden.",
        VIE: "Các ngươi là sự sáng của thế gian; một thành ở trên núi thì không thể giấu được."
      }
    },
    {
      bookId: 'MAT',
      chapter: 5,
      verseNum: 9,
      bookName: { English: 'Matthew', 'Tiếng Việt': 'Ma-thi-ơ' },
      text: {
        WEB: "Blessed are the peacemakers, for they shall be called children of God.",
        KJV: "Blessed are the peacemakers: for they shall be called the children of God.",
        AMT: "Blessed are those who work for peace, for they will be called the children of God.",
        VIE: "Phước cho những kẻ hòa giải, vì sẽ được gọi là con Đức Chúa Trời!"
      }
    },
    {
      bookId: 'PRO',
      chapter: 3,
      verseNum: 13,
      bookName: { English: 'Proverbs', 'Tiếng Việt': 'Châm-ngôn' },
      text: {
        WEB: "Happy is the man who finds wisdom, the man who gets understanding.",
        KJV: "Happy is the man that findeth wisdom, and the man that getteth understanding.",
        AMT: "Joyful is the person who finds wisdom, the one who gains understanding.",
        VIE: "Phước cho người tìm được sự khôn ngoan, và người được sự thông hiểu!"
      }
    },
    {
      bookId: 'PSA',
      chapter: 23,
      verseNum: 4,
      bookName: { English: 'Psalm', 'Tiếng Việt': 'Thi-thiên' },
      text: {
        WEB: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.",
        KJV: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
        AMT: "Even when I walk through the darkest valley, I will not be afraid, for you are close beside me. Your rod and your staff protect and comfort me.",
        VIE: "Dầu khi tôi đi trong trũng bóng chết, tôi sẽ chẳng sợ tai họa nào; vì Ngài ở cùng tôi; cây trượng và cây gậy của Ngài an ủi tôi."
      }
    },
    {
      bookId: 'PSA',
      chapter: 91,
      verseNum: 11,
      bookName: { English: 'Psalm', 'Tiếng Việt': 'Thi-thiên' },
      text: {
        WEB: "For he will put his angels in charge of you, to guard you in all your ways.",
        KJV: "For he shall give his angels charge over thee, to keep thee in all thy ways.",
        AMT: "For he will order his angels to protect you wherever you go.",
        VIE: "Vì Ngài sẽ truyền lịnh cho các thiên sứ Ngài gìn giữ ngươi trong các đường lối ngươi."
      }
    },
    {
      bookId: 'ISA',
      chapter: 40,
      verseNum: 8,
      bookName: { English: 'Isaiah', 'Tiếng Việt': 'Ê-sai' },
      text: {
        WEB: "The grass withers, the flower fades; but the word of our God stands forever.",
        KJV: "The grass withereth, the flower fadeth: but the word of our God shall stand for ever.",
        AMT: "The grass withers and the flowers fade, but the word of our God stands forever.",
        VIE: "Cỏ khô, hoa rụng; nhưng lời của Đức Chúa Trời chúng ta còn đứng mãi đời đời."
      }
    },
    {
      bookId: 'ROM',
      chapter: 12,
      verseNum: 21,
      bookName: { English: 'Romans', 'Tiếng Việt': 'Rô-ma' },
      text: {
        WEB: "Don't be overcome by evil, but overcome evil with good.",
        KJV: "Be not overcome of evil, but overcome evil with good.",
        AMT: "Don't let evil conquer you, but conquer evil by doing good.",
        VIE: "Đừng để điều ác thắng mình, nhưng hãy lấy điều lành thắng điều ác."
      }
    },
    {
      bookId: 'LAM',
      chapter: 3,
      verseNum: 25,
      bookName: { English: 'Lamentations', 'Tiếng Việt': 'Ca-thương' },
      text: {
        WEB: "Yahweh is good to those who wait for him, to the soul who seeks him.",
        KJV: "The LORD is good unto them that wait for him, to the soul that seeketh him.",
        AMT: "The Lord is good to those who depend on him, to those who search for him.",
        VIE: "Đức Giê-hô-va là tốt lành cho kẻ trông đợi Ngài, cho linh hồn tìm kiếm Ngài."
      }
    },
    {
      bookId: 'REV',
      chapter: 22,
      verseNum: 13,
      bookName: { English: 'Revelation', 'Tiếng Việt': 'Khải-huyền' },
      text: {
        WEB: "I am the Alpha and the Omega, the First and the Last, the Beginning and the End.",
        KJV: "I am Alpha and Omega, the beginning and the end, the first and the last.",
        AMT: "I am the Alpha and the Omega, the First and the Last, the Beginning and the End.",
        VIE: "Ta là An-pha và Ô-mê-ga, Đầu tiên và Cuối cùng, Ban đầu và Kết cuối."
      }
    },
    {
      bookId: 'REV',
      chapter: 22,
      verseNum: 20,
      bookName: { English: 'Revelation', 'Tiếng Việt': 'Khải-huyền' },
      text: {
        WEB: "He who testifies these things says, 'Yes, I come quickly.' Amen! Yes, come, Lord Jesus.",
        KJV: "He which testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus.",
        AMT: "He who is the faithful witness to all these things says, 'Yes, I am coming soon!' Amen! Come, Lord Jesus!",
        VIE: "Đấng chứng những điều đó phán rằng: Phải, ta đến mau. A-men, lạy Đức Chúa Jêsus, xin hãy đến!"
      }
    },
    {
      bookId: 'PHP',
      chapter: 4,
      verseNum: 4,
      bookName: { English: 'Philippians', 'Tiếng Việt': 'Phi-líp' },
      text: {
        WEB: "Rejoice in the Lord always! Again I will say, rejoice!",
        KJV: "Rejoice in the Lord alway: and again I say, Rejoice.",
        AMT: "Always be full of joy in the Lord. I say it again -- rejoice!",
        VIE: "Hãy vui mừng trong Chúa luôn luôn. Tôi lại còn nói nữa: hãy vui mừng đi."
      }
    },
    {
      bookId: 'LAM',
      chapter: 3,
      verseNum: 22,
      bookName: { English: 'Lamentations', 'Tiếng Việt': 'Ca-thương' },
      text: {
        WEB: "It is of Yahweh's loving kindnesses that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness.",
        KJV: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
        AMT: "It is only through the Creator's loyalty that we are not overwhelmed, for His empathy never runs dry. His compassions greet us brand new every morning. How great is His faithfulness!",
        VIE: "Ấy là huệ Giê-hô-va không hao tán, sự thương xót Ngài không dứt. Mỗi buổi sáng thì lại mới luôn, sự thành tín Ngài là lớn thay."
      }
    },
    {
      bookId: 'COL',
      chapter: 3,
      verseNum: 23,
      bookName: { English: 'Colossians', 'Tiếng Việt': 'Cô-lô-se' },
      text: {
        WEB: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
        KJV: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
        AMT: "Whatever you are doing, do it with all your heart, as if you were working for the Lord and not for human masters.",
        VIE: "Hễ làm việc gì, hãy hết lòng mà làm, như làm cho Chúa, chớ không phải làm cho người ta."
      }
    },
    {
      bookId: 'HEB',
      chapter: 11,
      verseNum: 1,
      bookName: { English: 'Hebrews', 'Tiếng Việt': 'Hê-bơ-rơ' },
      text: {
        WEB: "Now faith is assurance of things hoped for, proof of things not seen.",
        KJV: "Now faith is the substance of things hoped for, the evidence of things not seen.",
        AMT: "Faith is the confidence that what we hope for will actually happen; it gives us assurance about things we cannot see.",
        VIE: "Vả, đức tin là sự biết chắc vững vàng của những điều mình đương trông mong, là bằng cớ của những điều mình chẳng xem thấy."
      }
    },
    {
      bookId: 'JAM',
      chapter: 1,
      verseNum: 5,
      bookName: { English: 'James', 'Tiếng Việt': 'Gia-cơ' },
      text: {
        WEB: "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach; and it will be given to him.",
        KJV: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.",
        AMT: "If you need wisdom, ask our generous God, and he will give it to you. He will not rebuke you for asking.",
        VIE: "Ví bằng trong anh em có kẻ thiếu trí khôn, hãy cầu xin Đức Chúa Trời, là Đấng ban cho mọi người cách rộng rãi, không trách móc ai, thì kẻ ấy sẽ được ban cho."
      }
    },
    {
      bookId: '1PE',
      chapter: 5,
      verseNum: 7,
      bookName: { English: '1 Peter', 'Tiếng Việt': '1 Phi-e-rơ' },
      text: {
        WEB: "Casting all your worries on him, because he cares for you.",
        KJV: "Casting all your care upon him; for he careth for you.",
        AMT: "Give all your worries and cares to God, for he cares about you.",
        VIE: "Hãy trao hết mọi điều lo lắng mình cho Ngài, vì Ngài hay săn sóc anh em."
      }
    },
    {
      bookId: 'EPH',
      chapter: 2,
      verseNum: 8,
      bookName: { English: 'Ephesians', 'Tiếng Việt': 'Ê-phê-sô' },
      text: {
        WEB: "For by grace you have been saved through faith, and that not of yourselves; it is the gift of God.",
        KJV: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.",
        AMT: "God saved you by his grace when you believed. And you can't take credit for this; it is a gift from God.",
        VIE: "Vả, ấy là nhờ ân điển, bởi đức tin, mà anh em được cứu, điều đó không phải đến từ anh em, bèn là sự ban cho của Đức Chúa Trời."
      }
    },
    {
      bookId: 'PSA',
      chapter: 19,
      verseNum: 1,
      bookName: { English: 'Psalm', 'Tiếng Việt': 'Thi-thiên' },
      text: {
        WEB: "The heavens declare the glory of God. The sky displays his handiwork.",
        KJV: "The heavens declare the glory of God; and the firmament sheweth his handywork.",
        AMT: "The heavens proclaim the glory of God. The skies display his craftsmanship.",
        VIE: "Các từng trời rao truyền sự vinh hiển của Đức Chúa Trời, bầu trời giải tỏ công việc tay Ngài làm."
      }
    }
  ],

  // Returns the number of verses in a given chapter
  getVerseCount: function(translation, bookId, chapter) {
    const db = this.staticScriptures[translation] || this.staticScriptures['WEB'];
    const book = db[bookId];
    if (book && book[chapter]) {
      const arr = book[chapter];
      // Use the highest verse number stored, not array length (handles sparse arrays)
      const maxNum = arr.reduce((m, v) => Math.max(m, v.num), 0);
      if (maxNum > 0) return maxNum;
    }
    // Fall back to standard Bible verse count table
    const counts = BIBLE_VERSE_COUNTS[bookId];
    if (counts && counts[chapter - 1] !== undefined) {
      return counts[chapter - 1];
    }
    return 30; // safe default
  },


  // Helper to resolve dynamic text if not stored in static database
  getVerseText: function(translation, bookId, chapter, verseNum) {
    const db = this.staticScriptures[translation] || this.staticScriptures['WEB'];
    const book = db[bookId];
    if (book && book[chapter]) {
      const v = book[chapter].find(x => x.num === verseNum);
      if (v) return v.text;
    }
    
    // Dynamic fallback to populate the reader seamlessly
    const bookInfo = this.books.find(b => b.id === bookId);
    const bookName = bookInfo ? bookInfo.name : bookId;
    
    // Seeded random text generator for consistent scripture-like generator
    const seedsEn = [
      "Let the words of my mouth, and the meditation of my heart, be acceptable in thy sight.",
      "Trust in the Lord with all thine heart; and lean not unto thine own understanding.",
      "In all thy ways acknowledge him, and he shall direct thy paths.",
      "The Lord is good, a strong hold in the day of trouble; and he knoweth them that trust in him.",
      "Thy word is a lamp unto my feet, and a light unto my path.",
      "Keep thy heart with all diligence; for out of it are the issues of life.",
      "Fear thou not; for I am with thee: be not dismayed; for I am thy God.",
      "I will strengthen thee; yea, I will help thee; yea, I will uphold thee.",
      "Be strong and of a good courage; be not afraid, neither be thou dismayed.",
      "For the Lord thy God is with thee whithersoever thou goest.",
      "Commit thy works unto the Lord, and thy thoughts shall be established.",
      "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty."
    ];

    const seedsVi = [
      "Lời Ngài là ngọn đèn cho chân tôi, và ánh sáng cho đường đi tôi.",
      "Hãy hết lòng tin cậy Đức Giê-hô-va, chớ nương cậy nơi sự thông sáng của con.",
      "Phàm trong các việc làm của con, hãy nhận biết Ngài, Ngài sẽ chỉ dẫn các nẻo của con.",
      "Đức Giê-hô-va là thiện, làm nơi ẩn náu trong ngày hoạn nạn, và Ngài biết những người tin cậy nơi Ngài.",
      "Sự nhân từ và sự thương xót của Chúa sẽ theo tôi trọn đời tôi.",
      "Hãy giữ tấm lòng của con hơn hết, vì các nguồn sự sống do nơi đó mà ra.",
      "Đừng sợ, vì Ta ở cùng ngươi; chớ kinh khiếp, vì Ta là Đức Chúa Trời của ngươi.",
      "Ta sẽ bổ sức cho ngươi, phải, Ta sẽ giúp đỡ ngươi, lấy tay hữu công bình Ta mà nâng đỡ ngươi.",
      "Hãy vững lòng bền chí, chớ run sợ, chớ kinh hãi.",
      "Vì Đức Giê-hô-va là Đức Chúa Trời ngươi, vẫn ở cùng ngươi trong mọi nơi ngươi đi.",
      "Hãy phó các công việc mình cho Đức Giê-hô-va, thì ý tưởng mình sẽ được thành công.",
      "Người nào ở nơi kín đáo của Đấng Chí Cao, sẽ hằng được ở dưới bóng của Đấng Toàn Năng."
    ];


    const seeds = (translation === 'VIE') ? seedsVi : seedsEn;
    const idx = (bookId.charCodeAt(0) + bookId.charCodeAt(1) + chapter * 7 + verseNum * 13) % seeds.length;
    return seeds[idx];
  }
};
