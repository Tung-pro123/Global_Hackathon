import React, { createContext, useContext, useState } from 'react';

export const TRANSLATIONS = {
  vi: {
    nav: {
      logoSubtitle: 'SlangArena 2.0',
      login: '🔑 Đăng Nhập / Đăng Ký',
      profileTitle: 'Bấm để chỉnh sửa sở thích & trình độ',
      switchThemeDark: 'Chuyển sang Giao diện Sáng',
      switchThemeLight: 'Chuyển sang Giao diện Tối',
      switchLang: 'Chuyển sang Tiếng Anh (English)',
      tabs: {
        game: 'Đấu Trường Dino',
        shop: 'Cửa Hàng Skin',
        dict: 'Từ Điển Slang',
        ai: 'Thu Thập AI'
      }
    },
    game: {
      title: 'ĐẤU TRƯỜNG SLANG DINO',
      pills: {
        coins: '🪙 Nhặt xu trên đường',
        quizzes: '💎 Giải đố kim cương',
        birds: '🐦 Né chim bay!',
        jump: '↑↑ Nhảy đúp (Double jump)'
      },
      aiBannerTitle: 'AI Cá Nhân Hóa:',
      guestBannerTitle: 'Chế độ Khách (General Slang)',
      changeProfile: '⚙️ Đổi',
      guestPrompt: 'Chơi chế độ khách. Đăng nhập để AI may đo độ khó và sở thích riêng!',
      guestLoginBtn: '✨ Đăng nhập để AI cá nhân hóa (+200🪙)',
      selectDifficulty: 'CHỌN ĐỘ KHÓ',
      difficulty: {
        easy: { label: '🐢 Dễ', desc: 'Tốc độ chậm, ít vật cản — dành cho người mới', badge: 'BEGINNER' },
        medium: { label: '⚡ Vừa', desc: 'Cân bằng — thử thách vừa phải', badge: 'NORMAL' },
        hard: { label: '🔥 Khó', desc: 'Tốc độ cao, chim dày đặc — dành cho cao thủ!', badge: 'EXPERT' }
      },
      startBtn: '▶  BẮT ĐẦU CHƠI',
      controlsHint: 'SPACE / ↑ / CHẠM = NHẢY  •  SPACE ×2 = NHẢY ĐÚP',
      stats: {
        score: 'ĐIỂM SỐ',
        coins: 'XU THƯỞNG',
        combo: 'COMBO TỐT NHẤT',
        xp: 'KILOMÉT / XP'
      }
    },
    shop: {
      title: '🛍️ TỦ ĐỒ TRANG PHỤC DINO',
      subtitle: 'Mở khóa trang phục độc quyền để biến hóa diện mạo Dino và nhận đặc quyền buff điểm!',
      livePreview: 'XEM TRƯỚC TRỰC TIẾP',
      yourWallet: 'VÍ CỦA BẠN',
      coinsLabel: 'Xu',
      diamondsLabel: 'Kim cương',
      equipThis: '⚡ Mặc Trang Phục Này',
      freeStarter: '✅ Miễn phí cho tân thủ',
      equipped: '✅ Đang Mặc',
      equip: '⚡ Trang Bị',
      buyNow: '🛒 Mua Ngay',
      buying: '⌛ Đang Mua...',
      purchased: '✅ Đã Mua Thành Công!',
      failed: '❌ Thất Bại',
      notEnough: '🔒 Chưa Đủ Xu',
      earnHint: 'Chạy đua & giải câu đố Slang để tích lũy thêm xu!'
    },
    pokedex: {
      title: '📚 TỪ ĐIỂN SLANG HỌC ĐƯỜNG',
      subtitle: 'Bách khoa toàn thư tiếng lóng campus 2024–2026. Đã cập nhật {count} từ vựng!',
      searchPlaceholder: '🔍 Tìm kiếm từ lóng, phiên âm hoặc ý nghĩa...',
      filterAll: '🌏 Tất Cả',
      filterSG: '🇸🇬 Singlish',
      filterVN: '🇻🇳 Tiếng Việt',
      loading: 'Đang tải dữ liệu từ lóng...',
      noResults: 'Không tìm thấy từ lóng phù hợp. Hãy thử tính năng Thu Thập AI!',
      literal: 'NGHĨA ĐEN TRỰC DIỆN',
      whatsapp: '💬 VÍ DỤ HỘI THOẠI WHATSAPP',
      aiCrafterDesc: '🤖 AI Skill: Cultural Crafter • Tạo câu mẫu chuẩn bối cảnh & kiểm duyệt an toàn',
      tailorBtn: '✨ Tạo Câu Mẫu AI',
      tailoringBtn: '⚙️ Đang Tạo Câu Mẫu...',
      tailoredTitle: '✨ CÂU MẪu AI TẠO',
      safetyBadge: '🛡️ 100% TIÊU CHUẨN CỘNG ĐỒNG & PHÁP LUẬT',
      translationLabel: 'Dịch nghĩa:',
      contextLabel: 'Bối cảnh:',
      whenToUse: 'NÊN DÙNG:',
      whenToAvoid: 'TRÁNH DÙNG:'
    },
    ai: {
      title: '🤖 CÔNG CỤ THU THẬP SLANG AI',
      subtitle: 'Vận hành bởi Groq + Llama 3.3. Tự động truy quét và cập nhật từ lóng sinh viên Singapore & Việt Nam mới nhất.',
      panelTitle: 'Truy Quét Trí Tuệ Ngôn Ngữ Văn Hóa',
      panelDesc: 'Rà soát từ lóng giảng đường 2024-2026, tự động sinh câu đố rebus thị giác và kiểm duyệt an toàn.',
      runBtn: '🤖 Chạy Quét AI Mới',
      harvestingBtn: 'Đang Thu Thập Dữ Liệu...',
      terminalHeader: 'BẢNG ĐIỀU KHIỂN GROQ TERMINAL — CULTURSYNC v2.0',
      newlyHarvested: '✅ TỪ LÓNG VỪA THU THẬP MỚI',
      justHarvestedTag: '🆕 Mới Thu Thập',
      cards: {
        engine: 'Mô hình Llama 3.3',
        engineDesc: 'Tốc độ phản hồi cực nhanh dưới 1 giây qua nền tảng Groq Cloud',
        culture: 'Song Văn Hóa SG-VN',
        cultureDesc: 'Chuyên sâu tiếng lóng Hawker Singapore và khẩu ngữ Gen Z Việt Nam',
        quiz: 'Sinh Câu Đố Ngay',
        quizDesc: 'Tự động tạo câu đố Rebus thị giác và giải thích ngữ dụng chuẩn mực',
        db: 'Đồng Bộ Database',
        dbDesc: 'Dữ liệu thu thập được nạp ngay vào SQLite để người chơi khám phá tức thì'
      }
    },
    quiz: {
      diamondTitle: 'CÂU ĐỐ KIM CƯƠNG BÍ ẨN',
      diamondSubtitle: 'Nhận diện từ lóng để nhận thưởng lớn!',
      reviveTitle: 'THỬ THÁCH HỒI SINH',
      reviveSubtitle: 'Trả lời đúng để hồi sinh ngay!',
      aiPersonalized: '✨ AI Cá Nhân Hóa Cho Bạn:',
      guestChallenge: '🌐 Thử Thách Tiếng Lóng Tổng Quát (Chế Độ Khách)',
      rewardNotice: '✅ Trả lời đúng nhận thưởng:',
      questionDefault: 'Hình ảnh / gợi ý này đại diện cho từ lóng nào?',
      correct: '🎉 Chính Xác!',
      wrong: '❌ Chưa Đúng!',
      diamondRewards: '+100 🪙 +1 💎 +50 ⭐',
      reviveRewards: '+80 🪙 +25 ⭐ 🛡️ 3s Khiên'
    },
    collision: {
      title: '💥 VA CHẠM RỒI!',
      birdTitle: '🐦 VA CHẠM VỚI CHIM!',
      cactusGotYou: 'Chướng ngại vật đã cản bước bạn! Bạn chọn phương án nào?',
      score: 'ĐIỂM SỐ',
      tryMore: 'Thử Thách Slang Để Hồi Sinh',
      tryMoreSub: 'Trả lời đúng → Hồi sinh ngay + 3s Khiên bảo vệ 🛡️',
      giveUp: '🏳️ Chấp Nhận Dừng Lại — Kết Thúc Lượt Chạy',
      scoreSaved: '🏅 Điểm số của bạn vẫn được ghi nhận trên Bảng Vàng'
    },
    gameover: {
      runComplete: 'LƯỢT CHẠY HOÀN THÀNH',
      newHighscore: '🎉 KỶ LỤC MỚI TRONG TOP {rank}!',
      score: 'ĐIỂM SỐ',
      coins: 'TIỀN VÀNG',
      xp: 'ĐIỂM XP',
      tabs: {
        stats: '📊 Chỉ Số',
        leaderboard: '🏆 Bảng Xếp Hạng',
        flashcards: '📚 Ôn Tập Slang'
      },
      tipTitle: 'Mẹo Chơi:',
      tipText: 'Chạm vào 💎 Kim Cương trên đường để mở câu đố Slang nhận +100 🪙. Dùng tiền mở khóa skin trong 🛍️ Cửa Hàng!',
      doubleJumpTip: 'Nhấn đúp Space hoặc chạm 2 lần để nhảy đúp né chim bay!',
      guestPrompt: '💡 Đang ở Chế độ Khách. Đăng ký tài khoản để lưu điểm vĩnh viễn & mở khóa AI cá nhân hóa!',
      registerBtn: '✨ Đăng Ký Ngay',
      playAgainBtn: '🔄 Chơi Tiếp',
      shopBtn: '🛍️ Vào Cửa Hàng',
      noScores: 'Chưa có điểm nào. Hãy bắt đầu chạy đua!',
      youLabel: '← BẠN'
    },
    auth: {
      title: 'DANH TÍNH CULTURSYNC',
      subtitle: 'Đăng ký tài khoản để may đo câu đố AI theo đúng sở thích và trình độ của bạn!',
      registerTab: '✨ Đăng Ký Mới',
      loginTab: '🔑 Đăng Nhập',
      usernameLabel: 'TÊN NGƯỜI CHƠI (USERNAME) *',
      usernamePlaceholder: 'ví dụ: tung_pro, alex_sg, linh_campus...',
      passwordLabel: 'MẬT KHẨU *',
      passwordPlaceholder: 'Tối thiểu 4 ký tự',
      levelLabel: '🎯 TRÌNH ĐỘ TIẾNG ANH (AI MAY ĐO ĐỘ KHÓ)',
      cultureLabel: '🌏 MỤC TIÊU VĂN HÓA',
      interestsLabel: '🎮 CHỦ ĐỀ YÊU THÍCH (CHỌN 1 HOẶC NHIỀU)',
      submitRegister: '🚀 TẠO TÀI KHOẢN & VÀO GAME (+200 🪙)',
      submitLogin: '🔑 ĐĂNG NHẬP VÀO GAME',
      loadingRegister: '⌛ Đang tạo tài khoản...',
      loadingLogin: '⌛ Đang đăng nhập...',
      orDivider: 'hoặc trải nghiệm nhanh',
      playAsGuest: '⚡ Chơi Chế Độ Khách (Không Cần Mật Khẩu)',
      errorUserShort: 'Tên người dùng phải có ít nhất 3 ký tự!',
      errorPassShort: 'Mật khẩu phải có ít nhất 4 ký tự!',
      errorEmptyLogin: 'Vui lòng nhập Tên đăng nhập và Mật khẩu!',
      errorServer: 'Lỗi kết nối máy chủ! Hãy thử lại.',
      levels: {
        beginner: { label: '🟢 Khám Phá', desc: 'Mới bắt đầu — từ vựng ngắn, trực quan' },
        intermediate: { label: '🔵 Kết Nối', desc: 'Khá — tình huống hội thoại thực tế' },
        advanced: { label: '🟣 Chuyên Gia', desc: 'Chuyên sâu — ngữ cảnh văn hóa & bẫy ngữ dụng' }
      },
      cultures: {
        ALL: '🌏 Song Văn Hóa SG-VN',
        SG: '🇸🇬 Singlish (Singapore)',
        VN: '🇻🇳 Tiếng Lóng Việt Nam'
      },
      interests: {
        gaming: '🎮 Gaming & Esports',
        campus: '📚 Giảng Đường & Deadline',
        food: '☕ Ẩm Thực & Quán Xá',
        social: '💬 Giao Tiếp & Hẹn Hò',
        career: '💼 Nghề Nghiệp & Thực Tập'
      }
    },
    profile: {
      title: 'HỒ SƠ CÁ NHÂN HÓA',
      studentLabel: 'Học viên:',
      levelLabel: '🎯 TRÌNH ĐỘ TIẾNG ANH (AI MAY ĐO ĐỘ KHÓ)',
      cultureLabel: '🌏 MỤC TIÊU VĂN HÓA',
      interestsLabel: '🎮 CHỦ ĐỀ YÊU THÍCH (AI ƯU TIÊN RA CÂU ĐỐ)',
      saveBtn: '💾 LƯU THAY ĐỔI',
      savingBtn: '⌛ Đang lưu...',
      savedSuccess: '✅ Đã lưu hồ sơ thành công!',
      logoutBtn: '🚪 Đăng Xuất'
    },
    footer: {
      tagline: '🦖 CULTURSYNC SLANGARENA • TEAM 14 • GLOBAL HACKATHON 2026 • 🇸🇬 × 🇻🇳'
    }
  },

  en: {
    nav: {
      logoSubtitle: 'SlangArena 2.0',
      login: '🔑 Login / Register',
      profileTitle: 'Click to customize interests & English level',
      switchThemeDark: 'Switch to Light Mode',
      switchThemeLight: 'Switch to Dark Mode',
      switchLang: 'Chuyển sang Tiếng Việt (Vietnamese)',
      tabs: {
        game: 'Dino Arena',
        shop: 'Skin Shop',
        dict: 'Slang Pokédex',
        ai: 'AI Harvester'
      }
    },
    game: {
      title: 'DINO SLANG QUEST',
      pills: {
        coins: '🪙 Collect track coins',
        quizzes: '💎 Diamond quizzes',
        birds: '🐦 Dodge flying birds!',
        jump: '↑↑ Double jump'
      },
      aiBannerTitle: 'AI Tailored for:',
      guestBannerTitle: 'Guest Mode (General Slangs)',
      changeProfile: '⚙️ Edit',
      guestPrompt: 'Playing as Guest. Login to unlock personalized AI slang quizzes and preserve your progress!',
      guestLoginBtn: '✨ Login for AI tailored quizzes (+200🪙)',
      selectDifficulty: 'SELECT DIFFICULTY',
      difficulty: {
        easy: { label: '🐢 Easy', desc: 'Slow speed, fewer obstacles — beginner friendly', badge: 'BEGINNER' },
        medium: { label: '⚡ Medium', desc: 'Balanced rhythm — standard challenge', badge: 'NORMAL' },
        hard: { label: '🔥 Hard', desc: 'High reflex velocity, dense birds — for pros!', badge: 'EXPERT' }
      },
      startBtn: '▶  START QUEST',
      controlsHint: 'SPACE / ↑ / TAP = JUMP  •  SPACE ×2 = DOUBLE JUMP',
      stats: {
        score: 'SCORE',
        coins: 'COINS',
        combo: 'BEST COMBO',
        xp: 'KM / XP'
      }
    },
    shop: {
      title: '🛍️ DINO SKIN WARDROBE',
      subtitle: 'Unlock exclusive skins to customize your Dino and activate powerful gameplay score buffs!',
      livePreview: 'LIVE PREVIEW',
      yourWallet: 'YOUR WALLET',
      coinsLabel: 'Coins',
      diamondsLabel: 'Diamonds',
      equipThis: '⚡ Equip This Skin',
      freeStarter: '✅ Free starter skin',
      equipped: '✅ Equipped',
      equip: '⚡ Equip',
      buyNow: '🛒 Buy Now',
      buying: '⌛ Buying...',
      purchased: '✅ Purchased!',
      failed: '❌ Failed',
      notEnough: '🔒 Not Enough Coins',
      earnHint: 'Sprint on the track and answer slang quizzes to earn more coins!'
    },
    pokedex: {
      title: '📚 SLANG POKÉDEX',
      subtitle: 'Campus slang encyclopedia for 2024–2026. {count} verified entries & growing!',
      searchPlaceholder: '🔍 Search slang terms, phonetics, or meanings...',
      filterAll: '🌏 All Cultures',
      filterSG: '🇸🇬 Singlish',
      filterVN: '🇻🇳 Vietnamese',
      loading: 'Loading slang database...',
      noResults: 'No matching slang terms found. Try the AI Harvester to ingest new entries!',
      literal: 'LITERAL MEANING',
      whatsapp: '💬 WHATSAPP DIALOGUE EXAMPLE',
      aiCrafterDesc: '🤖 AI Skill: Cultural Crafter • Contextual sentence generation with strict safety guardrails',
      tailorBtn: '✨ Generate AI Example',
      tailoringBtn: '⚙️ Generating Example...',
      tailoredTitle: '✨ AI GENERATED EXAMPLE',
      safetyBadge: '🛡️ 100% COMMUNITY & LEGAL COMPLIANCE',
      translationLabel: 'Translation:',
      contextLabel: 'Context:',
      whenToUse: 'WHEN TO USE:',
      whenToAvoid: 'WHEN TO AVOID:'
    },
    ai: {
      title: '🤖 AI SLANG HARVESTER',
      subtitle: 'Powered by Groq + Llama 3.3. Scans and synthesizes trending campus slangs from Singapore & Vietnam.',
      panelTitle: 'Cultural Slang Intelligence Crawl',
      panelDesc: 'Scans university dialects 2024-2026, generates visual rebus challenges, and applies safety checks.',
      runBtn: '🤖 Run AI Harvest',
      harvestingBtn: 'Harvesting Intelligence...',
      terminalHeader: 'GROQ TERMINAL LOGS — CULTURSYNC v2.0',
      newlyHarvested: '✅ NEWLY HARVESTED SLANG ENTRIES',
      justHarvestedTag: '🆕 Just Harvested',
      cards: {
        engine: 'Llama 3.3 Engine',
        engineDesc: 'Sub-second real-time inference powered by Groq Cloud compute',
        culture: 'Dual Culture SG-VN',
        cultureDesc: 'Specialized in Singapore hawker lingo & Vietnamese Gen-Z campus talk',
        quiz: 'Instant Rebus Quiz',
        quizDesc: 'Auto-generates multi-modal visual rebus quiz cards with pragmatic notes',
        db: 'SQLite Ingestion',
        dbDesc: 'Harvested terms are instantly written to the SQLite database for gameplay'
      }
    },
    quiz: {
      diamondTitle: 'MYSTERY DIAMOND QUIZ',
      diamondSubtitle: 'Identify the slang to earn rewards!',
      reviveTitle: 'REVIVAL CHALLENGE',
      reviveSubtitle: 'Answer correctly to revive!',
      aiPersonalized: '✨ AI Tailored for you:',
      guestChallenge: '🌐 General Campus Slang Challenge (Guest Mode)',
      rewardNotice: '✅ Correct answer:',
      questionDefault: 'What campus slang does this clue represent?',
      correct: '🎉 Correct!',
      wrong: '❌ Wrong!',
      diamondRewards: '+100 🪙 +1 💎 +50 ⭐',
      reviveRewards: '+80 🪙 +25 ⭐ 🛡️ 3s Shield'
    },
    collision: {
      title: '💥 COLLISION DETECTED!',
      birdTitle: '🐦 BIRD STRIKE!',
      cactusGotYou: 'An obstacle caught you off guard! Choose your action:',
      score: 'SCORE',
      tryMore: 'Slang Challenge to Revive',
      tryMoreSub: 'Answer correctly → Instant Revive + 3s Invulnerability Shield 🛡️',
      giveUp: '🏳️ Give Up — End This Run',
      scoreSaved: '🏅 Your run score is safely recorded on the leaderboard'
    },
    gameover: {
      runComplete: 'RUN COMPLETE',
      newHighscore: '🎉 NEW TOP {rank} SCORE!',
      score: 'SCORE',
      coins: 'COINS',
      xp: 'XP',
      tabs: {
        stats: '📊 Stats',
        leaderboard: '🏆 Leaderboard',
        flashcards: '📚 Slang Review'
      },
      tipTitle: 'Tip:',
      tipText: 'Touch 💎 Diamonds on the run to answer quizzes for +100 🪙. Use your coins in the 🛍️ Skin Shop!',
      doubleJumpTip: 'Double-tap Spacebar or double-tap screen to jump over low flying birds!',
      guestPrompt: '💡 Playing as Guest. Create a free account to save high scores & unlock AI personalization!',
      registerBtn: '✨ Register Free',
      playAgainBtn: '🔄 Play Again',
      shopBtn: '🛍️ Open Shop',
      noScores: 'No scores yet. Start playing!',
      youLabel: '← YOU'
    },
    auth: {
      title: 'CULTURSYNC IDENTITY',
      subtitle: 'Create your account to tailor AI slang quizzes to your favorite interests & English level!',
      registerTab: '✨ New Register',
      loginTab: '🔑 Login',
      usernameLabel: 'USERNAME *',
      usernamePlaceholder: 'e.g. alex_sg, lin_fpt, tung_champion...',
      passwordLabel: 'PASSWORD *',
      passwordPlaceholder: 'At least 4 characters',
      levelLabel: '🎯 ENGLISH PROFICIENCY (AI DIFFICULTY SCALING)',
      cultureLabel: '🌏 CULTURAL FOCUS',
      interestsLabel: '🎮 TOPICS & INTERESTS (SELECT 1 OR MORE)',
      submitRegister: '🚀 CREATE ACCOUNT & PLAY (+200 🪙)',
      submitLogin: '🔑 LOGIN TO GAME',
      loadingRegister: '⌛ Creating account...',
      loadingLogin: '⌛ Logging in...',
      orDivider: 'or jump straight in',
      playAsGuest: '⚡ Play as Guest (No Password Needed)',
      errorUserShort: 'Username must have at least 3 characters!',
      errorPassShort: 'Password must have at least 4 characters!',
      errorEmptyLogin: 'Please enter your Username and Password!',
      errorServer: 'Server connection error! Please try again.',
      levels: {
        beginner: { label: '🟢 Explorer', desc: 'Beginner — short, visual slangs' },
        intermediate: { label: '🔵 Connector', desc: 'Intermediate — realistic dialogues' },
        advanced: { label: '🟣 Insider', desc: 'Advanced — deep cultural context & nuances' }
      },
      cultures: {
        ALL: '🌏 Dual Culture SG-VN',
        SG: '🇸🇬 Singlish (Singapore)',
        VN: '🇻🇳 Vietnamese Slangs'
      },
      interests: {
        gaming: '🎮 Gaming & Esports',
        campus: '📚 Campus & Deadline',
        food: '☕ Food & Canteen',
        social: '💬 Social & Dating',
        career: '💼 Career & Internship'
      }
    },
    profile: {
      title: 'PERSONALIZED PROFILE',
      studentLabel: 'Student:',
      levelLabel: '🎯 ENGLISH PROFICIENCY (AI DIFFICULTY SCALING)',
      cultureLabel: '🌏 CULTURAL FOCUS',
      interestsLabel: '🎮 TOPICS & INTERESTS (AI TARGETING)',
      saveBtn: '💾 SAVE PREFERENCES',
      savingBtn: '⌛ Saving...',
      savedSuccess: '✅ Preferences saved successfully!',
      logoutBtn: '🚪 Log Out'
    },
    footer: {
      tagline: '🦖 CULTURSYNC SLANGARENA • TEAM 14 • GLOBAL HACKATHON 2026 • 🇸🇬 × 🇻🇳'
    }
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('cultursync_lang') || 'vi';
    } catch {
      return 'vi';
    }
  });

  const setLanguage = (newLang) => {
    if (newLang === 'vi' || newLang === 'en') {
      setLangState(newLang);
      try {
        localStorage.setItem('cultursync_lang', newLang);
      } catch {}
    }
  };

  const toggleLanguage = () => {
    setLanguage(lang === 'vi' ? 'en' : 'vi');
  };

  // Nested key resolver helper (e.g., t('nav.login'))
  const t = (path, params = {}) => {
    const keys = path.split('.');
    let current = TRANSLATIONS[lang];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if missing in Vietnamese
        let fallback = TRANSLATIONS['en'];
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current === 'string') {
      let result = current;
      for (const [paramKey, paramVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      }
      return result;
    }

    return current || path;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
