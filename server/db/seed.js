import { v4 as uuidv4 } from 'uuid';
import { getDb } from './database.js';

export const SLANGS = [
  // =========================================================================
  // 🇸🇬 SINGAPORE CAMPUS & YOUTH SLANGS (20 ITEMS)
  // =========================================================================
  {
    id: 'sg_chope',
    term: 'Chope',
    culture: 'SG',
    phonetic: '/tʃoʊp/',
    literal_translation: 'Reserve / Claim',
    cultural_meaning: 'To reserve a seat or spot by placing a personal item (usually a tissue packet) on it. A uniquely Singaporean hawker centre etiquette.',
    whatsapp_example: 'Eh bro, I already chope the seats at the corner la. Come faster!',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400',
    visual_caption: '🧻 A tissue packet placed on a plastic chair at a hawker centre'
  },
  {
    id: 'sg_kiasu',
    term: 'Kiasu',
    culture: 'SG',
    phonetic: '/kiːəsuː/',
    literal_translation: 'Afraid to lose (Hokkien)',
    cultural_meaning: 'The extreme fear of missing out or losing to others, leading to overly competitive or hyper-prepared behaviour.',
    whatsapp_example: 'She queue 2 hours for that bubble tea sia. So kiasu lor.',
    category: 'personality',
    visual_rebus_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
    visual_caption: '😰 A student raising hand aggressively to answer first in class'
  },
  {
    id: 'sg_arrow',
    term: 'Arrow',
    culture: 'SG',
    phonetic: '/ˈærəʊ/',
    literal_translation: 'To point / assign',
    cultural_meaning: 'To be unfairly assigned an unwanted task by your leader or peer without discussion. The victim is said to have been "arrowed".',
    whatsapp_example: 'Siao leh, group leader arrow me to do the entire frontend alone again!',
    category: 'career',
    visual_rebus_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    visual_caption: '🏹 Arrow pointing directly at one stressed person in a meeting'
  },
  {
    id: 'sg_shiok',
    term: 'Shiok',
    culture: 'SG',
    phonetic: '/ʃiːɒk/',
    literal_translation: 'Extremely pleasing (Hokkien)',
    cultural_meaning: 'Expressing extreme pleasure, satisfaction, or delight. Commonly used for delicious food, cool breezes, or triumphant victories.',
    whatsapp_example: 'Wah this iced Milo dinosaur damn shiok sia! Perfect after exam.',
    category: 'food',
    visual_rebus_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
    visual_caption: '😍 Person taking first bite of incredible food with eyes rolling back in pleasure'
  },
  {
    id: 'sg_bao_ka_liao',
    term: 'Bao Ka Liao',
    culture: 'SG',
    phonetic: '/baʊ kɑː liːaʊ/',
    literal_translation: 'Wrapped up everything (Hokkien)',
    cultural_meaning: 'All-inclusive, covers everything. Used to describe someone who does all project roles or a solution that solves everything.',
    whatsapp_example: "Don't worry, my teammate bao ka liao - he can design, code, and do the pitch!",
    category: 'career',
    visual_rebus_url: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=400',
    visual_caption: '🎁 A single multi-tool knife that can do literally every job'
  },
  {
    id: 'sg_sian',
    term: 'Sian',
    culture: 'SG',
    phonetic: '/siːæn/',
    literal_translation: 'Tired / Bored / Weary',
    cultural_meaning: 'A profound feeling of weariness, boredom, apathy, or frustration with everyday grind and never-ending work.',
    whatsapp_example: 'Sian 1/2 sia, tomorrow 8am lecture still have quiz.',
    category: 'campus',
    visual_rebus_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
    visual_caption: '😴 Sleepy puppy slumped flat on study desk completely exhausted'
  },
  {
    id: 'sg_steady',
    term: 'Steady',
    culture: 'SG',
    phonetic: '/ˈstɛdi/',
    literal_translation: 'Reliable / Agreed',
    cultural_meaning: 'A versatile compliment meaning awesome, dependable, capable, or an enthusiastic agreement to plans.',
    whatsapp_example: 'You submitted the PR before midnight? Steady lah bro, MVP for sure!',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    visual_caption: '🤝 Solid handshake between two smiling collaborative teammates'
  },
  {
    id: 'sg_lobang',
    term: 'Lobang',
    culture: 'SG',
    phonetic: '/loʊbɑːŋ/',
    literal_translation: 'Hole / Opening (Malay)',
    cultural_meaning: 'An insider tip, opportunity, hot lead, or lucrative contact (e.g., paid internship opportunity, cheap food promo).',
    whatsapp_example: 'Eh who got lobang for Google summer internship? Share please!',
    category: 'career',
    visual_rebus_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    visual_caption: '🔑 Golden key opening a mysterious door of bright opportunities'
  },
  {
    id: 'sg_jio',
    term: 'Jio',
    culture: 'SG',
    phonetic: '/dʒiːoʊ/',
    literal_translation: 'Invite (Hokkien)',
    cultural_meaning: 'To invite or ask someone along to an outing, meal, gaming session, or study hangout.',
    whatsapp_example: 'Tonight late night coding at Starbucks, I jio you, want to come?',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
    visual_caption: '👋 Person waving happily inviting friends over to join their table'
  },
  {
    id: 'sg_bo_jio',
    term: 'Bo Jio',
    culture: 'SG',
    phonetic: '/boʊ dʒiːoʊ/',
    literal_translation: 'Never invite (Hokkien)',
    cultural_meaning: 'A mock-accusation or playful expression of FOMO when someone hangs out or eats good food without inviting you.',
    whatsapp_example: 'Wah go supper without me! Bo jio sia, hurts my feelings!',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',
    visual_caption: '🥺 Pouting person looking through window at friends having a pizza party'
  },
  {
    id: 'sg_zai',
    term: 'Zai',
    culture: 'SG',
    phonetic: '/zaɪ/',
    literal_translation: 'Master / Skilled (Hokkien)',
    cultural_meaning: 'Calling someone an absolute genius, pro, or master in a specific skill (e.g., algorithms, gaming, public speaking).',
    whatsapp_example: 'Alex so zai at machine learning, he wrote the neural net in 2 hours.',
    category: 'gaming',
    visual_rebus_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400',
    visual_caption: '🎮 Esports player wearing gaming headset holding shiny championship trophy'
  },
  {
    id: 'sg_chop_chop',
    term: 'Chop-Chop',
    culture: 'SG',
    phonetic: '/tʃɒp tʃɒp/',
    literal_translation: 'Fast / Quickly (Pidgin English)',
    cultural_meaning: 'An urgent call to hurry up and get things done rapidly without dilly-dallying.',
    whatsapp_example: 'Chop-chop finish this slide deck, client presentation starting in 10 mins!',
    category: 'campus',
    visual_rebus_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400',
    visual_caption: '⚡ Person running at lightning speed with stopwatch clicking'
  },
  {
    id: 'sg_can_lah',
    term: 'Can Lah',
    culture: 'SG',
    phonetic: '/kæn lɑː/',
    literal_translation: 'Yes, certainly possible',
    cultural_meaning: 'The ultimate Singaporean reassurance expressing confidence, willingness, and positive problem-solving.',
    whatsapp_example: 'Can we deploy to production before the demo? Can lah, tested already!',
    category: 'expression',
    visual_rebus_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
    visual_caption: '👍 Smiling person giving enthusiastic double thumbs-up in approval'
  },
  {
    id: 'sg_lepak',
    term: 'Lepak',
    culture: 'SG',
    phonetic: '/lɛpɑːk/',
    literal_translation: 'Loiter / Chill (Malay)',
    cultural_meaning: 'To hang out leisurely without any specific agenda; simply relaxing in good company.',
    whatsapp_example: 'After the hackathon finals, let us just lepak at Marina Bay and relax.',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400',
    visual_caption: '🏖️ Friends lounging peacefully on beach hammocks watching sunset'
  },
  {
    id: 'sg_makan',
    term: 'Makan',
    culture: 'SG',
    phonetic: '/mɑːkɑːn/',
    literal_translation: 'Eat (Malay)',
    cultural_meaning: 'The universal call for food, bonding over meals, and hawker feasts with friends.',
    whatsapp_example: '12pm already, time to makan! Craving laksa and chicken rice.',
    category: 'food',
    visual_rebus_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    visual_caption: '🍜 Steaming bowl of delicious noodles surrounded by appetizing dishes'
  },
  {
    id: 'sg_paiseh',
    term: 'Paiseh',
    culture: 'SG',
    phonetic: '/paɪseɪ/',
    literal_translation: 'Shy / Embarrassed (Hokkien)',
    cultural_meaning: 'Feeling embarrassed, shy, or apologetic for bothering someone or causing inconvenience.',
    whatsapp_example: 'Paiseh ah, can you explain that equation one more time? I missed it.',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=400',
    visual_caption: '🙈 Person sheepishly covering eyes blushing with polite smile'
  },
  {
    id: 'sg_ponteng',
    term: 'Ponteng',
    culture: 'SG',
    phonetic: '/pɒntɛŋ/',
    literal_translation: 'Skip / Truant (Malay)',
    cultural_meaning: 'To skip a class, lecture, or compulsory session without a valid medical excuse.',
    whatsapp_example: 'Prof just reading slides again, feel like ponteng and code in library.',
    category: 'campus',
    visual_rebus_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400',
    visual_caption: '🏫 Empty classroom seat with lone notebook left unattended'
  },
  {
    id: 'sg_gabra',
    term: 'Gabra',
    culture: 'SG',
    phonetic: '/ɡɑːbrɑː/',
    literal_translation: 'Panic / Fluster (Hindustani/Malay)',
    cultural_meaning: 'To panic, lose composure, or become thoroughly disoriented under sudden high pressure.',
    whatsapp_example: 'When the projector died, I totally gabra on stage and forgot my lines!',
    category: 'personality',
    visual_rebus_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
    visual_caption: '💥 Cartoonish head spinning in dizziness with question marks popping'
  },
  {
    id: 'sg_chiong',
    term: 'Chiong',
    culture: 'SG',
    phonetic: '/tʃiːɒŋ/',
    literal_translation: 'Charge forward (Hokkien)',
    cultural_meaning: 'To rush with fierce intensity, especially pulling an all-nighter or sprinting towards a project deadline.',
    whatsapp_example: 'Hackathon demo is tomorrow morning, we must chiong all the way tonight!',
    category: 'campus',
    visual_rebus_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
    visual_caption: '🏃 Sprinter bursting out of starting blocks at maximum speed'
  },
  {
    id: 'sg_blur_sotong',
    term: 'Blur like Sotong',
    culture: 'SG',
    phonetic: '/blɜːr laɪk soʊtɒŋ/',
    literal_translation: 'Confused like a squid',
    cultural_meaning: 'Completely clueless, confused, or oblivious to what is going on, akin to a squid inking its own water.',
    whatsapp_example: 'He did not read the project brief at all, during meeting blur like sotong.',
    category: 'personality',
    visual_rebus_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    visual_caption: '🦑 Squid in deep ocean releasing ink cloud looking utterly puzzled'
  },

  // =========================================================================
  // 🇻🇳 VIETNAM CAMPUS & YOUTH GEN Z SLANGS (20 ITEMS)
  // =========================================================================
  {
    id: 'vn_ganh_team',
    term: 'Gánh Team',
    culture: 'VN',
    phonetic: '/ɡan tiːm/',
    literal_translation: 'Carry the team (gaming origin)',
    cultural_meaning: "Single-handedly carrying the group's performance to victory through exceptional effort and skill.",
    whatsapp_example: 'Trận này ông gánh team đỉnh chóp luôn, không có ông là cả nhóm bay màu!',
    category: 'gaming',
    visual_rebus_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    visual_caption: '🏋️ One superhero figure carrying 4 other teammates across the finish line'
  },
  {
    id: 'vn_chay_deadline',
    term: 'Chạy Deadline',
    culture: 'VN',
    phonetic: '/tʃai ˈdɛdlaɪn/',
    literal_translation: 'Sprint before deadline',
    cultural_meaning: 'The frantic, adrenaline-fueled rush to complete academic or project deliverables right before the submission cut-off.',
    whatsapp_example: 'Thôi xong tao đang chạy deadline đồ án, 2 giờ sáng nộp mà chưa debug xong!',
    category: 'campus',
    visual_rebus_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    visual_caption: '⏰ Student sprinting with laptop at 2AM with clock ticking furiously behind'
  },
  {
    id: 'vn_out_trinh',
    term: 'Out-trình',
    culture: 'VN',
    phonetic: '/aʊt tʃɪn/',
    literal_translation: 'Out-class / Out-perform',
    cultural_meaning: "When someone's skill, knowledge, or performance is on a totally superior tier compared to competitors.",
    whatsapp_example: 'Bài thuyết trình của nhóm đó out-trình cả hội trường, slide vừa đẹp vừa cuốn!',
    category: 'career',
    visual_rebus_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400',
    visual_caption: "🚀 One student's rocket launching far into orbit above all other rockets"
  },
  {
    id: 'vn_xu_ca_na',
    term: 'Xu Cà Na',
    culture: 'VN',
    phonetic: '/suː kɑː nɑː/',
    literal_translation: 'Bad luck / Misfortune',
    cultural_meaning: 'A humorous exclamation when experiencing annoying bad luck, unexpected failures, or end-of-month empty pockets.',
    whatsapp_example: 'Vừa dắt xe ra thì thủng lốp, đúng là xu cà na hết phần thiên hạ!',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400',
    visual_caption: '💸 Empty wallet with dust and a single lonely coin falling out'
  },
  {
    id: 'vn_ban_than',
    term: 'Bán Than',
    culture: 'VN',
    phonetic: '/ban tan/',
    literal_translation: 'Sell coal / Dramatize suffering',
    cultural_meaning: 'To over-dramatize your workload or hardship for comic sympathy and comfort among peers.',
    whatsapp_example: 'Thôi bớt bán than lại, thi 9.5 điểm mà cứ lên mạng kêu đề khó!',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
    visual_caption: '😭 Drama actor comically crying torrents of tears holding a tiny test paper'
  },
  {
    id: 'vn_bao_viec',
    term: 'Bào Việc',
    culture: 'VN',
    phonetic: '/baʊ viːɛk/',
    literal_translation: 'Grind through workload tirelessly',
    cultural_meaning: 'Working relentlessly through massive tasks or long hours like a machine to meet project milestones.',
    whatsapp_example: 'Tuần này team mình bào việc từ sáng đến đêm để kịp ra mắt sản phẩm MVP!',
    category: 'career',
    visual_rebus_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    visual_caption: '💻 Office glowing late at night with focused programmer sipping coffee'
  },
  {
    id: 'vn_flex',
    term: 'Flex',
    culture: 'VN',
    phonetic: '/flɛks/',
    literal_translation: 'Show off / Flaunt',
    cultural_meaning: 'Cleverly or playfully showing off achievements, certificates, GPA, or stylish possessions on social networks.',
    whatsapp_example: 'Không có ý flex đâu nhưng team mình vừa ẵm giải Nhất hackathon rồi nhé!',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
    visual_caption: '✨ Sparkling shiny gold medals and trophies lined up proudly'
  },
  {
    id: 'vn_pressing',
    term: 'Pressing',
    culture: 'VN',
    phonetic: '/ˈprɛsɪŋ/',
    literal_translation: 'High-intensity tactical pressure (football origin)',
    cultural_meaning: 'Applying relentless logical or verbal pressure on someone during presentations, Q&A debates, or playful banter.',
    whatsapp_example: 'Giám khảo pressing câu hỏi kỹ thuật dồn dập nhưng nhóm mình phản biện cực mượt!',
    category: 'campus',
    visual_rebus_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    visual_caption: '⚽ Football midfielders surrounding opponent applying intense tactical squeeze'
  },
  {
    id: 'vn_u_la_troi',
    term: 'U Là Trời',
    culture: 'VN',
    phonetic: '/uː lɑː tʃɔɪ/',
    literal_translation: 'Oh my God (OMG)',
    cultural_meaning: 'An exclamation of sheer astonishment, pleasant surprise, or comic disbelief at unexpected events.',
    whatsapp_example: 'U là trời, cái game Dino này đồ họa pixel đỉnh cao vậy luôn á hả!',
    category: 'expression',
    visual_rebus_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
    visual_caption: '😲 Person holding cheeks in wide-eyed joyous wonder and surprise'
  },
  {
    id: 'vn_keo_li',
    term: 'Keo Lì',
    culture: 'VN',
    phonetic: '/kɛoʊ liː/',
    literal_translation: 'Flawless / Gorgeous / Slaying',
    cultural_meaning: 'A glowing Gen Z compliment for something looking stunning, neat, aesthetic, or exceptionally well executed.',
    whatsapp_example: 'Slide thuyết trình của bạn nhìn keo lì tái tê luôn, 10 điểm không có nhưng!',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
    visual_caption: '💎 Brilliant multifaceted diamond sparkling with rainbow reflections'
  },
  {
    id: 'vn_tram_cam',
    term: 'Trầm Cảm',
    culture: 'VN',
    phonetic: '/tʃam kam/',
    literal_translation: 'Hyperbolic exam despair',
    cultural_meaning: 'A humorous Gen Z exaggeration for feeling utterly overwhelmed by a difficult math problem, bug, or tight schedule.',
    whatsapp_example: 'Nhìn quả bug CSS này tao trầm cảm thực sự, sửa 3 tiếng vẫn lệch!',
    category: 'campus',
    visual_rebus_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
    visual_caption: '📉 Humorous dramatic face-palm at a messy tangle of cables'
  },
  {
    id: 'vn_gay_som',
    term: 'Gáy Sớm',
    culture: 'VN',
    phonetic: '/ɡaɪ sɔːm/',
    literal_translation: 'Crow like a rooster too early',
    cultural_meaning: 'To boast or celebrate victory too early before the final whistle or exam grades, often leading to comic karma.',
    whatsapp_example: 'Đừng có gáy sớm ăn tiền, trận đấu còn 5 phút nữa mới biết ai thắng!',
    category: 'gaming',
    visual_rebus_url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400',
    visual_caption: '🐓 Rooster standing on fence crowing loudly at dawn before sunrise'
  },
  {
    id: 'vn_nau_xeng',
    term: 'Nấu Xèng',
    culture: 'VN',
    phonetic: '/naʊ sɛŋ/',
    literal_translation: 'Cooking up coins / Making bank',
    cultural_meaning: 'Winning big prizes, monetizing skills, or securing high-value awards through hackathons or smart work.',
    whatsapp_example: 'Thắng giải Nhất đợt này là team mình nấu xèng ấm no cả học kỳ!',
    category: 'career',
    visual_rebus_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400',
    visual_caption: '💰 Treasure chest overflowing with sparkling gold coins and gems'
  },
  {
    id: 'vn_ca_khia',
    term: 'Cà Khịa',
    culture: 'VN',
    phonetic: '/kɑː xiːə/',
    literal_translation: 'Witty roasting / Friendly banter',
    cultural_meaning: 'Playfully teasing or making witty, sarcastic jabs at close friends to create humor and camaraderie.',
    whatsapp_example: 'Bạn thân là phải cà khịa nhau mỗi ngày tình cảm mới bền chặt được!',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
    visual_caption: '😜 Two close friends laughing out loud sharing funny jokes together'
  },
  {
    id: 'vn_boc_hoi',
    term: 'Bốc Hơi',
    culture: 'VN',
    phonetic: '/bɒk həːɪ/',
    literal_translation: 'Evaporate / Ghost the team',
    cultural_meaning: 'When an irresponsible group member completely vanishes and stops replying right before an important deadline.',
    whatsapp_example: 'Giao phần slide xong ông đó bốc hơi luôn, gọi điện không bắt máy!',
    category: 'campus',
    visual_rebus_url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400',
    visual_caption: '💨 Cloud of white smoke vanishing into thin air leaving behind an empty chair'
  },
  {
    id: 'vn_phong_bat',
    term: 'Phông Bạt',
    culture: 'VN',
    phonetic: '/fɒŋ bat/',
    literal_translation: 'Canvas backdrop / Illusion of wealth',
    cultural_meaning: 'Pretending to have vast wealth, skill, or importance purely for social media clout while lacking true substance.',
    whatsapp_example: 'Làm việc thực chất đi, đừng sống phông bạt chỉ để chụp ảnh đăng mạng.',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
    visual_caption: '🎭 Grand Hollywood movie set backdrop revealing bare scaffoldings behind'
  },
  {
    id: 'vn_check_var',
    term: 'Check Var',
    culture: 'VN',
    phonetic: '/tʃɛk vɑːr/',
    literal_translation: 'Check Video Assistant Referee proof',
    cultural_meaning: 'Checking receipts, logs, or chat evidence to prove who is telling the truth in an argument or task dispute.',
    whatsapp_example: 'Mày bảo nộp bài rồi hả? Để tao mở Git log ra check var liền!',
    category: 'campus',
    visual_rebus_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400',
    visual_caption: '📺 Football referee reviewing high-definition slow-motion video monitors'
  },
  {
    id: 'vn_thao_tung_tam_ly',
    term: 'Thao Túng Tâm Lý',
    culture: 'VN',
    phonetic: '/tʰaʊ tuŋ tam li/',
    literal_translation: 'Gaslighting / Persuasive psychology',
    cultural_meaning: 'Playfully manipulating or sweet-talking someone into taking on chores or going out for milk tea.',
    whatsapp_example: 'Nó lại vừa thao túng tâm lý bảo trà sữa hôm nay giảm giá để rủ mình đi!',
    category: 'social',
    visual_rebus_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
    visual_caption: '🧠 Puppet strings playfully guiding a cheerful wooden chess piece'
  },
  {
    id: 'vn_dinh_noc',
    term: 'Đỉnh Nóc Kịch Trần',
    culture: 'VN',
    phonetic: '/dɪn nɔk kɪk tʃan/',
    literal_translation: 'Peak of the roof, hit the ceiling',
    cultural_meaning: 'The ultimate viral catchphrase representing unmatched perfection, peak excitement, and absolute top performance.',
    whatsapp_example: 'Dự án AI của tụi mình hôm nay demo đỉnh nóc kịch trần bay phấp phới luôn!',
    category: 'career',
    visual_rebus_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    visual_caption: '🏔️ High snowy mountain peak reaching up into golden sunlight clouds'
  },
  {
    id: 'vn_xit_keo',
    term: 'Xịt Keo',
    culture: 'VN',
    phonetic: '/sit kɛoʊ/',
    literal_translation: 'Glued frozen / Speechless shock',
    cultural_meaning: 'Being struck utterly speechless, frozen in shock or awkward silence by unexpected plot twists or comments.',
    whatsapp_example: 'Đang thuyết trình ngon ơ thì thầy hỏi một câu khiến cả nhóm xịt keo cứng đờ!',
    category: 'expression',
    visual_rebus_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
    visual_caption: '🧊 Ice statue of a person frozen in mid-sentence with jaw dropped'
  }
];

function generateOptions(correctTerm, allSlangs) {
  const correctCulture = allSlangs.find(s => s.term === correctTerm)?.culture || 'SG';
  
  // Prefer same culture distractors
  let candidates = allSlangs
    .filter(s => s.term !== correctTerm && s.culture === correctCulture)
    .map(s => s.term);

  // If not enough, draw from other culture
  if (candidates.length < 3) {
    const others = allSlangs.filter(s => s.term !== correctTerm).map(s => s.term);
    candidates = [...candidates, ...others];
  }

  const shuffled = candidates.sort(() => Math.random() - 0.5).slice(0, 3);
  const opts = [correctTerm, ...shuffled].sort(() => Math.random() - 0.5);

  return { options: opts, correct_index: opts.indexOf(correctTerm) };
}

export async function seedDatabase() {
  const db = getDb();
  let insertedCount = 0;

  for (const slang of SLANGS) {
    const existing = db.get('slangs', s => s.term.toLowerCase() === slang.term.toLowerCase());

    if (!existing) {
      db.insertOrIgnore('slangs', slang);

      const { options, correct_index } = generateOptions(slang.term, SLANGS);
      db.insertOrIgnore('challenges', {
        id: `challenge_${slang.id || uuidv4()}`,
        slang_id: slang.id,
        challenge_type: 'visual_rebus',
        scenario_context: 'You collected a mystery diamond! 💎 Solve this slang rebus to earn rewards!',
        question: `Look at this clue: "${slang.visual_caption}"\n\nWhat campus slang does this represent?`,
        options: options,
        options_json: JSON.stringify(options),
        correct_index,
        cultural_explanation: slang.cultural_meaning,
        stage_level: 1
      });

      insertedCount++;
    }
  }

  // Ensure default player exists
  db.insertOrIgnore('players', {
    id: 'default_player',
    player_id: 'default_player',
    coins: 200,
    diamonds: 5,
    xp: 140,
    streak_days: 3,
    active_skin: 'classic',
    owned_skins: ['classic']
  });

  const totalSlangs = db.count('slangs');
  const totalChallenges = db.count('challenges');
  console.log(`📚 Database sync complete: ${totalSlangs} slangs (${insertedCount} new), ${totalChallenges} challenges ready!`);
}

export default seedDatabase;
