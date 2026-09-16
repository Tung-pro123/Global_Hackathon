/**
 * static/dino_game.js - CultureSync Dino Slang Quest (2D Platformer Runner)
 * RETRO-ARCADE ENGINE WITH DYNAMIC MULTI-SKIN WARDROBE & IN-GAME SLANG ECONOMY:
 *   - 6 Unlockable Skins: Classic Emerald, Cyberpunk Neon Visor, Singlish Hawker Champ,
 *     Saigon Street Racer (Nón Lá), Cosmic Nebula, Golden King (Crown & 24K Gold).
 *   - Standalone Skin Preview Renderer for React Skin Shop.
 *   - Dynamic Rewards Economy: +100 Coins for Slang Rebus Quiz, +80 Coins for Revive Quiz.
 *   - 4-layer Parallax (Twinkling stars, celestial body, Singapore/Saigon skyline, neon track).
 *   - Web Audio 8-bit Synthesizer.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. SOUND SYNTHESIZER (Web Audio API - Zero External Dependencies)
  // =========================================================================
  const SoundFX = {
    ctx: null,
    muted: false,

    init() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext && !this.ctx) {
          this.ctx = new AudioContext();
        }
      } catch (e) {
        console.warn('Web Audio not supported');
      }
    },

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    playJump() {
      if (this.muted || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    },

    playCoin() {
      if (this.muted || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    },

    playDiamond() {
      if (this.muted || !this.ctx) return;
      this.resume();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const start = this.ctx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.23);
      });
    },

    playHit() {
      if (this.muted || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.29);
    },

    playFanfare() {
      if (this.muted || !this.ctx) return;
      this.resume();
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chords.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const t = this.ctx.currentTime + i * 0.08;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    }
  };

  // =========================================================================
  // 2. SKINS CATALOG & METADATA
  // =========================================================================
  const SKINS_CATALOG = [
    {
      id: 'classic',
      name: 'Classic Emerald Dino',
      tagline: 'Chiến Binh Dẻo Dai Nguyên Bản',
      rarity: 'COMMON',
      rarityColor: '#10b981',
      price: 0,
      currency: 'COINS',
      owned: true,
      desc: 'Chú khủng long xanh nguyên bản với băng đô đỏ vô địch và đôi giày chạy siêu tốc.',
      perk: 'Tốc độ cân bằng, độ nảy đàn hồi chuẩn xác'
    },
    {
      id: 'cyberpunk',
      name: 'Cyber Neon Visor',
      tagline: 'Kỵ Sĩ Công Nghệ Năm 2026',
      rarity: 'RARE',
      rarityColor: '#06b6d4',
      price: 150,
      currency: 'COINS',
      desc: 'Trang bị kính ngắm lượng tử Cyan HUD và vây lưng dạ quang phát sáng trong đêm.',
      perk: '+5% Điểm cự ly trên đường cao tốc'
    },
    {
      id: 'singlish',
      name: 'Singlish Hawker Champ',
      tagline: 'Nhà Vô Địch Đảo Quốc Sư Tử',
      rarity: 'EPIC',
      rarityColor: '#f43f5e',
      price: 300,
      currency: 'COINS',
      desc: 'Huy hiệu Sư tử Merlion kiêu hãnh, chuyên gia Chope chỗ và không bao giờ Kiasu.',
      perk: '+10% Tiền Vàng nhặt trên đường'
    },
    {
      id: 'saigon',
      name: 'Saigon Street Racer',
      tagline: 'Tay Đua Sài Gòn Nón Lá',
      rarity: 'EPIC',
      rarityColor: '#f59e0b',
      price: 450,
      currency: 'COINS',
      desc: 'Đội Nón Lá truyền thống cực phong cách, lướt qua deadline như xe máy giờ cao điểm.',
      perk: 'Gia tốc nhảy mượt mà hơn khi né cản'
    },
    {
      id: 'cosmic',
      name: 'Cosmic Nebula Dino',
      tagline: 'Thực Thể Dải Ngân Hà',
      rarity: 'LEGENDARY',
      rarityColor: '#a855f7',
      price: 800,
      currency: 'COINS',
      desc: 'Thân hình tạo nên từ bụi sao và cực quang vũ trụ, để lại vệt sáng kỳ ảo khi di chuyển.',
      perk: 'Để lại vệt bụi sao may mắn khi tiếp đất'
    },
    {
      id: 'golden',
      name: 'Golden King Dino',
      tagline: 'Hoàng Đế Dát Vàng 24K',
      rarity: 'LEGENDARY',
      rarityColor: '#fbbf24',
      price: 1200,
      diamondPrice: 5,
      currency: 'COINS',
      desc: 'Bộ giáp hoàng kim 24K nguyên khối và vương miện đính hồng ngọc tôn quý bậc nhất.',
      perk: '+20% Thưởng Coin & XP từ câu đố Slang'
    }
  ];

  // =========================================================================
  // 3. MOCK VISUAL SLANG DATABASE (Nhìn Hình Đoán Chữ)
  // =========================================================================
  const SLANG_QUIZ_BANK = [
    {
      id: "slang_chope",
      term: "Chope",
      culture: "SG",
      stage: 1,
      imageUrl: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&auto=format&fit=crop&q=80",
      imageCaption: "Gói khăn giấy tissue được đặt trên bàn ăn tại hawker centre",
      question: "Nhìn hình ảnh gói khăn giấy đặt trên bàn này, sinh viên Singapore dùng từ lóng nào để chỉ hành động 'giữ chỗ'?",
      options: [
        "Chope (Đặt chỗ / Giữ chỗ ngồi trước)",
        "Kiasu (Sợ thua thiệt người khác)",
        "Bao Ka Liao (Bao trọn tất cả mọi việc)",
        "Sian (Cảm giác chán nản, mệt mỏi)"
      ],
      correctIndex: 0,
      explanation: "Tại Singapore, đặt gói khăn giấy hoặc thẻ sinh viên lên bàn để giữ chỗ gọi là 'chope-ing'. Đây là quy ước bất thành văn thể hiện sự tôn trọng không gian làm việc nhóm."
    },
    {
      id: "slang_kiasu",
      term: "Kiasu",
      culture: "SG",
      stage: 1,
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80",
      imageCaption: "Sinh viên xếp hàng từ 5 giờ sáng để giành chỗ ngồi học tốt nhất",
      question: "Tâm lý 'sợ thua thiệt', luôn muốn đi trước một bước của học sinh - sinh viên Singapore gọi là gì?",
      options: [
        "Lepak (Thong thả dạo chơi)",
        "Kiasu (Sợ thua thiệt / Sợ bỏ lỡ cơ hội)",
        "Shiok (Cực kỳ sảng khoái)",
        "Chop-chop (Nhanh lẹ khẩn trương)"
      ],
      correctIndex: 1,
      explanation: "'Kiasu' (nguồn gốc Phúc Kiến: sợ thua) phản ánh văn hóa cạnh tranh cao độ tại Singapore, thúc đẩy sinh viên luôn chuẩn bị bài vở cực kỳ chu đáo."
    },
    {
      id: "slang_ganh_team",
      term: "Gánh team",
      culture: "VN",
      stage: 1,
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80",
      imageCaption: "Một thành viên miệt mài gõ code thâu đêm để cứu cả nhóm dự án",
      question: "Hình ảnh một thành viên đảm nhận 80% khối lượng bài tập để cứu cả nhóm được sinh viên Việt Nam gọi là gì?",
      options: [
        "Gánh team (Mang trọng trách kéo cả nhóm về đích)",
        "Xụi lơ (Kiệt sức buông xuôi)",
        "Bung lụa (Thoải mái xả hơi)",
        "Ủa alo (Ngạc nhiên bất ngờ)"
      ],
      correctIndex: 0,
      explanation: "'Gánh team' là tiếng lóng bắt nguồn từ cộng đồng game MOBA, nay trở thành từ cửa miệng của sinh viên Việt Nam khi có một thành viên xuất sắc cứu vãn dự án."
    },
    {
      id: "slang_chop_chop",
      term: "Chop-chop",
      culture: "SG",
      stage: 2,
      imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&auto=format&fit=crop&q=80",
      imageCaption: "Đồng hồ bấm giờ đếm ngược chỉ còn 10 phút trước giờ nộp slide",
      question: "Khi trưởng nhóm Singapore nhắn 'Bring your slides chop-chop!', bạn cần phải làm gì?",
      options: [
        "Cắt ngắn nội dung slide thuyết trình",
        "Nhanh tay khẩn trương nộp bài ngay lập tức",
        "Tạm dừng nghỉ giải lao ăn uống",
        "Chỉnh sửa lại toàn bộ thiết kế màu sắc"
      ],
      correctIndex: 1,
      explanation: "'Chop-chop' là thành ngữ phổ biến tại Singapore & Hong Kong có nghĩa là 'nhanh lên, khẩn trương'. Xuất phát từ tiếng Quảng Đông 'chūk-chūk'."
    },
    {
      id: "slang_chay_deadline",
      term: "Chạy deadline",
      culture: "VN",
      stage: 2,
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=80",
      imageCaption: "Cốc cà phê đặc quánh bên cạnh laptop lúc 2 giờ 45 sáng",
      question: "Hình ảnh ly cà phê thâu đêm gắn liền với trạng thái nào của sinh viên Việt Nam trước giờ nộp bài?",
      options: [
        "Chill phết (Thảnh thơi tận hưởng)",
        "Chạy deadline (Tập trung cao độ hoàn thành hạn chót)",
        "Xu cà na (Gặp chuyện xui xẻo)",
        "Bốc hơi (Biến mất không lý do)"
      ],
      correctIndex: 1,
      explanation: "'Chạy deadline' là trạng thái kinh điển của sinh viên đại học khi dồn toàn lực những giờ cuối cùng trước cổng nộp bài kiểm tra trực tuyến."
    },
    {
      id: "slang_arrow",
      term: "Arrow",
      culture: "SG",
      stage: 3,
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80",
      imageCaption: "Cả nhóm cùng chỉ tay vào một người để giao việc thuyết trình trước ban giám khảo",
      question: "Khi cả nhóm cùng đồng thanh chỉ định bạn làm nhiệm vụ thuyết trình khó nhất, bạn vừa bị:",
      options: [
        "Bao Ka Liao (Nhận làm hết mọi việc)",
        "Arrow-ed (Bị 'chỉ định' gán trách nhiệm)",
        "Sian (Chán chường ngán ngẩm)",
        "Tabao (Mua mang đi về nhà)"
      ],
      correctIndex: 1,
      explanation: "'Arrow' là từ lóng học đường và công sở Singapore, nghĩa là bị cấp trên hoặc bạn học chỉ đích danh giao cho một đầu việc khó mà không thể từ chối."
    },
    {
      id: "slang_out_trinh",
      term: "Out-trình",
      culture: "VN",
      stage: 3,
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80",
      imageCaption: "Một bài pitch thuyết phục hoàn toàn ban giám khảo với điểm số vượt trội",
      question: "Khi sản phẩm của nhóm bạn vượt trội hoàn toàn so với đối thủ tại Hackathon, sinh viên Việt Nam dùng từ lóng nào?",
      options: [
        "Out-trình (Vượt trội hẳn về trình độ và đẳng cấp)",
        "Gãy cánh (Thất bại vào phút chót)",
        "Xụi lơ (Mất hết tinh thần chiến đấu)",
        "Bán than (Than thở khó khăn)"
      ],
      correctIndex: 0,
      explanation: "'Out-trình' (Out-play / Out-class) là từ lóng xuất phát từ eSports, hiện rất phổ biến trong sinh viên công nghệ để chỉ sự vượt bậc về năng lực giải pháp."
    }
  ];

  // =========================================================================
  // 4. ENHANCED STAGES CONFIGURATION (AESTHETIC COLOR PALETTES)
  // =========================================================================
  const STAGES = [
    {
      level: 1,
      name: "Campus Sunrise",
      speed: 5.2,
      targetScore: 400,
      skyTop: "#080e1a",
      skyBottom: "#132338",
      celestialType: "sun",
      celestialColor: "#f59e0b",
      groundColor: "#1a2a3a",
      groundPattern: "#24374b",
      groundLine: "#38bdf8",
      accentGlow: "#38bdf8",
      themeTitle: "🌅 Sáng Sớm Tại Campus Singapore"
    },
    {
      level: 2,
      name: "Library Twilight",
      speed: 7.0,
      targetScore: 900,
      skyTop: "#1e0b2e",
      skyBottom: "#3b114d",
      celestialType: "moon",
      celestialColor: "#c084fc",
      groundColor: "#2b0f38",
      groundPattern: "#3e1750",
      groundLine: "#fbbf24",
      accentGlow: "#f59e0b",
      themeTitle: "🌆 Đêm Ôn Thi Chạy Deadline Tại Thư Viện"
    },
    {
      level: 3,
      name: "Hackathon Cyberpunk",
      speed: 8.8,
      targetScore: 1600,
      skyTop: "#030712",
      skyBottom: "#042f2e",
      celestialType: "cyberSun",
      celestialColor: "#10b981",
      groundColor: "#064e3b",
      groundPattern: "#065f46",
      groundLine: "#34d399",
      accentGlow: "#10b981",
      themeTitle: "⚡ Đêm Chung Kết Hackathon 2026"
    }
  ];

  // =========================================================================
  // 5. MASTER DINO SPRITE RENDERER (SHARED BETWEEN GAME & SHOP PREVIEW)
  // =========================================================================
  function renderDinoSprite(ctx, x, y, options = {}) {
    const {
      skinId = 'classic',
      legFrame = 0,
      isGrounded = true,
      headbandWiggle = 0,
      gameTime = 0,
      isInvulnerable = false,
      scale = 1.0,
      isIdle = false
    } = options;

    ctx.save();
    ctx.translate(x, y);
    if (scale !== 1.0) {
      ctx.scale(scale, scale);
    }

    // 1. Invulnerability Shield Effect
    if (isInvulnerable) {
      const pulse = Math.sin(gameTime * 18) * 0.2 + 0.8;
      ctx.strokeStyle = '#10b981';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(24, 24, 34 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      if (Math.floor(gameTime * 20) % 2 === 0) {
        ctx.globalAlpha = 0.55;
      }
    }

    // 2. Determine Color Palette based on Skin
    let bodyGradStart = '#34d399';
    let bodyGradMid = '#10b981';
    let bodyGradEnd = '#047857';
    let bellyColor = '#fef08a';
    let spikeColor = '#fbbf24';
    let shoeColor = '#ef4444';
    let shoeSole = '#ffffff';

    if (skinId === 'cyberpunk') {
      bodyGradStart = '#38bdf8';
      bodyGradMid = '#6366f1';
      bodyGradEnd = '#0f172a';
      bellyColor = '#06b6d4';
      spikeColor = '#a855f7';
      shoeColor = '#06b6d4';
      shoeSole = '#38bdf8';
    } else if (skinId === 'singlish') {
      bodyGradStart = '#f43f5e';
      bodyGradMid = '#e11d48';
      bodyGradEnd = '#9f1239';
      bellyColor = '#fff1f2';
      spikeColor = '#f59e0b';
      shoeColor = '#be123c';
      shoeSole = '#ffffff';
    } else if (skinId === 'saigon') {
      bodyGradStart = '#fbbf24';
      bodyGradMid = '#f59e0b';
      bodyGradEnd = '#b45309';
      bellyColor = '#fef3c7';
      spikeColor = '#ea580c';
      shoeColor = '#dc2626';
      shoeSole = '#fed7aa';
    } else if (skinId === 'cosmic') {
      bodyGradStart = '#c084fc';
      bodyGradMid = '#7c3aed';
      bodyGradEnd = '#1e1b4b';
      bellyColor = '#e9d5ff';
      spikeColor = '#38bdf8';
      shoeColor = '#9333ea';
      shoeSole = '#e2e8f0';
    } else if (skinId === 'golden') {
      bodyGradStart = '#fef08a';
      bodyGradMid = '#facc15';
      bodyGradEnd = '#b45309';
      bellyColor = '#fffbeb';
      spikeColor = '#fef08a';
      shoeColor = '#ca8a04';
      shoeSole = '#fef08a';
    }

    // Golden / Cosmic Radiant Aura
    if (skinId === 'golden') {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 16;
    } else if (skinId === 'cosmic') {
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 14;
    }

    // Body Gradient
    const dinoGrad = ctx.createLinearGradient(0, 0, 32, 45);
    dinoGrad.addColorStop(0, bodyGradStart);
    dinoGrad.addColorStop(0.6, bodyGradMid);
    dinoGrad.addColorStop(1, bodyGradEnd);

    // Head & Snout
    ctx.fillStyle = dinoGrad;
    ctx.beginPath();
    ctx.roundRect(18, 2, 26, 20, 5);
    ctx.fill();

    // Snout Box
    ctx.beginPath();
    ctx.roundRect(36, 8, 10, 14, 3);
    ctx.fill();

    // Cute Smiling Mouth & Little Fang
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(32, 19, 12, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(38, 17, 3, 2); // tooth

    // Soft Blushing Cheek
    ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.beginPath();
    ctx.arc(33, 15, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Big Expressive Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(28, 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    const pupilColor = skinId === 'golden' ? '#991b1b' : '#0f172a';
    ctx.fillStyle = pupilColor;
    ctx.beginPath();
    ctx.arc(29.5, 8, 3, 0, Math.PI * 2);
    ctx.fill();

    // Dual Specular Glisten
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(28.5, 6.5, 1.4, 0, Math.PI * 2);
    ctx.arc(31, 9.5, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Main Body & Tail
    ctx.fillStyle = dinoGrad;
    ctx.beginPath();
    ctx.roundRect(8, 18, 28, 24, 6);
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(10, 26);
    ctx.lineTo(0, 34);
    ctx.lineTo(8, 36);
    ctx.closePath();
    ctx.fill();

    // Soft Belly
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.roundRect(22, 24, 12, 16, 4);
    ctx.fill();

    // Back Spikes (3 Spikes)
    ctx.fillStyle = spikeColor;
    ctx.beginPath();
    ctx.moveTo(5, 20); ctx.lineTo(2, 17); ctx.lineTo(8, 18);
    ctx.moveTo(7, 27); ctx.lineTo(3, 24); ctx.lineTo(9, 25);
    ctx.moveTo(8, 33); ctx.lineTo(4, 31); ctx.lineTo(9, 32);
    ctx.fill();

    // Little Hands
    ctx.fillStyle = bodyGradStart;
    ctx.beginPath();
    ctx.roundRect(32, 27, 8, 4, 2);
    ctx.fill();

    // =======================================================================
    // UNIQUE SKIN ACCESSORIES
    // =======================================================================

    // 1. CLASSIC / SINGLISH: Champion Headband
    if (skinId === 'classic' || skinId === 'singlish') {
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(17, 6, 28, 4);

      // Trailing fluttering ribbons
      const ribbonY = 7 + headbandWiggle;
      ctx.beginPath();
      ctx.moveTo(17, 7);
      ctx.lineTo(6, ribbonY - 2);
      ctx.lineTo(2, ribbonY + 2);
      ctx.lineTo(6, ribbonY + 4);
      ctx.lineTo(17, 9);
      ctx.fill();
    }

    // 2. CYBERPUNK: Glowing HUD Visor
    if (skinId === 'cyberpunk') {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(24, 4, 24, 8, 3);
      ctx.fill();
      ctx.stroke();

      // Scanning HUD beam
      const scanX = 26 + (Math.sin(gameTime * 8) * 0.5 + 0.5) * 18;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(scanX, 5, 2, 6);
    }

    // 3. SINGLISH: Merlion Emblem
    if (skinId === 'singlish') {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🦁', 28, 36);
    }

    // 4. SAIGON: Vietnamese Conical Hat (Nón Lá)
    if (skinId === 'saigon') {
      ctx.save();
      ctx.translate(30, 2);
      ctx.rotate(-0.08);

      // Straw cone body
      const hatGrad = ctx.createLinearGradient(0, -14, 0, 4);
      hatGrad.addColorStop(0, '#fef08a');
      hatGrad.addColorStop(1, '#fde047');
      ctx.fillStyle = hatGrad;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(22, 4);
      ctx.lineTo(-22, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bamboo ring texture
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-12, -2); ctx.lineTo(12, -2);
      ctx.moveTo(-6, -7); ctx.lineTo(6, -7);
      ctx.stroke();

      // Red chin ribbon
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-16, 4);
      ctx.quadraticCurveTo(0, 14, 16, 4);
      ctx.stroke();

      ctx.restore();
    }

    // 5. COSMIC: Twinkling Galaxy Flecks
    if (skinId === 'cosmic') {
      ctx.fillStyle = '#ffffff';
      const twinkle = Math.sin(gameTime * 6) * 0.3 + 0.7;
      ctx.globalAlpha = twinkle;
      ctx.fillRect(14, 22, 2, 2);
      ctx.fillRect(20, 32, 2, 2);
      ctx.fillRect(30, 24, 2, 2);
      ctx.fillRect(24, 12, 1.5, 1.5);
      ctx.globalAlpha = 1.0;
    }

    // 6. GOLDEN: Imperial Royal Crown
    if (skinId === 'golden') {
      ctx.save();
      ctx.translate(28, 0);

      // Gold Crown body
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(-11, 2);
      ctx.lineTo(-13, -8);
      ctx.lineTo(-5, -4);
      ctx.lineTo(0, -11); // center peak
      ctx.lineTo(5, -4);
      ctx.lineTo(13, -8);
      ctx.lineTo(11, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ruby gemstone in center
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -2, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.shadowBlur = 0;

    // Animated Running Legs with Sneakers
    ctx.fillStyle = shoeColor;
    if (isGrounded) {
      if (legFrame === 0 || legFrame === 1 || isIdle) {
        // Left foot forward
        ctx.fillRect(15, 42, 6, 8);
        ctx.fillRect(13, 48, 9, 4);
        ctx.fillStyle = shoeSole;
        ctx.fillRect(13, 51, 9, 2);

        ctx.fillStyle = shoeColor;
        ctx.fillRect(26, 40, 6, 6);
        ctx.fillRect(27, 44, 7, 4);
        ctx.fillStyle = shoeSole;
        ctx.fillRect(27, 47, 7, 2);
      } else {
        // Right foot forward
        ctx.fillRect(15, 40, 6, 6);
        ctx.fillRect(14, 44, 7, 4);
        ctx.fillStyle = shoeSole;
        ctx.fillRect(14, 47, 7, 2);

        ctx.fillStyle = shoeColor;
        ctx.fillRect(25, 42, 6, 8);
        ctx.fillRect(24, 48, 9, 4);
        ctx.fillStyle = shoeSole;
        ctx.fillRect(24, 51, 9, 2);
      }
    } else {
      // Jump tuck
      ctx.fillRect(14, 40, 7, 6);
      ctx.fillRect(24, 39, 7, 6);
      ctx.fillStyle = shoeSole;
      ctx.fillRect(14, 45, 7, 2);
      ctx.fillRect(24, 44, 7, 2);
    }

    ctx.restore();
  }

  // =========================================================================
  // 6. MAIN DINO GAME CLASS (PREMIUM CANVAS ENGINE)
  // =========================================================================
  class DinoSlangQuest {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      // Crisp 800x320 Canvas resolution
      this.width = 800;
      this.height = 320;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      // Ground plane
      this.groundY = 255;

      // Active Skin (Default: Classic Emerald)
      this.activeSkin = 'classic';
      try {
        const savedData = localStorage.getItem('culturesync_player_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.activeSkin) this.activeSkin = parsed.activeSkin;
        }
      } catch (e) {}

      // State machine
      this.state = 'IDLE'; // 'IDLE', 'PLAYING', 'PAUSED_QUIZ', 'COLLISION_CHOICE', 'GAMEOVER', 'STAGE_CLEAR'
      this.stageIndex = 0;
      this.score = 0;
      this.goldCount = 0;
      this.diamondCount = 0;
      this.earnedXP = 0;

      // Animation & Timing
      this.animId = null;
      this.lastTime = 0;
      this.gameTime = 0;

      // Dino Player (Pixel Dino Champion)
      this.dino = {
        x: 75,
        y: this.groundY - 52,
        width: 48,
        height: 52,
        vy: 0,
        gravity: 0.65,
        jumpPower: -13.0,
        isGrounded: true,
        legFrame: 0,
        legTimer: 0,
        isInvulnerable: false,
        invulnerableTimer: 0,
        headbandWiggle: 0
      };

      // Environmental Visual Assets
      this.obstacles = [];
      this.collectibles = [];
      this.floatingTexts = [];
      this.particles = [];

      // Procedural Background elements
      this.initBackgroundDecor();

      // Timers
      this.obstacleTimer = 0;
      this.collectibleTimer = 0;

      // Modals
      this.quizModal = document.getElementById('slangQuizModal');
      this.collisionModal = document.getElementById('dinoCollisionModal');
      this.stageClearModal = document.getElementById('dinoStageClearModal');
      this.activeQuiz = null;
      this.usedQuizIds = new Set();

      this.initEvents();
      this.drawIdleScreen();
    }

    setSkin(skinId) {
      if (SKINS_CATALOG.some(s => s.id === skinId)) {
        this.activeSkin = skinId;
        if (this.state === 'IDLE') {
          this.drawIdleScreen();
        }
      }
    }

    initBackgroundDecor() {
      this.stars = [];
      for (let i = 0; i < 45; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * (this.groundY - 90),
          size: Math.random() * 2 + 0.8,
          alpha: Math.random() * 0.8 + 0.2,
          blinkSpeed: Math.random() * 2 + 1
        });
      }

      this.clouds = [
        { x: 100, y: 35, width: 80, height: 26, speed: 0.18 },
        { x: 380, y: 65, width: 100, height: 32, speed: 0.12 },
        { x: 620, y: 40, width: 70, height: 24, speed: 0.22 },
        { x: 820, y: 75, width: 90, height: 28, speed: 0.15 }
      ];

      this.buildings = [];
      let curX = 0;
      while (curX < this.width + 300) {
        const bWidth = 35 + Math.random() * 50;
        const bHeight = 45 + Math.random() * 75;
        this.buildings.push({
          x: curX,
          width: bWidth,
          height: bHeight,
          hasAntenna: Math.random() > 0.6,
          windowCols: Math.floor(bWidth / 12),
          windowRows: Math.floor(bHeight / 16)
        });
        curX += bWidth + 12 + Math.random() * 20;
      }
    }

    initEvents() {
      const handleJumpAction = (e) => {
        if (this.state === 'PAUSED_QUIZ' || this.state === 'COLLISION_CHOICE') return;

        if (this.state === 'IDLE' || this.state === 'GAMEOVER') {
          this.startGame();
          return;
        }

        if (this.state === 'PLAYING') {
          if (this.dino.isGrounded) {
            this.dino.vy = this.dino.jumpPower;
            this.dino.isGrounded = false;
            SoundFX.playJump();
            this.spawnDust(this.dino.x + 12, this.dino.y + this.dino.height, 6);
          }
        }
      };

      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          handleJumpAction(e);
        }
      });

      this.canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handleJumpAction(e);
      });

      this.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleJumpAction(e);
      }, { passive: false });

      window.addEventListener('culturesync:set-skin', (e) => {
        if (e.detail && e.detail.skinId) {
          this.setSkin(e.detail.skinId);
        }
      });
    }

    startGame() {
      SoundFX.init();
      this.state = 'PLAYING';
      this.score = 0;
      this.goldCount = 0;
      this.diamondCount = 0;
      this.stageIndex = 0;
      this.dino.y = this.groundY - this.dino.height;
      this.dino.vy = 0;
      this.dino.isGrounded = true;
      this.dino.isInvulnerable = false;
      this.dino.invulnerableTimer = 0;
      this.obstacles = [];
      this.collectibles = [];
      this.floatingTexts = [];
      this.particles = [];
      this.obstacleTimer = 0;
      this.collectibleTimer = 0;

      this.hideAllModals();
      this.updateHUD();

      this.lastTime = performance.now();
      if (this.animId) cancelAnimationFrame(this.animId);
      this.loop(this.lastTime);
    }

    resumeGame() {
      this.state = 'PLAYING';
      this.hideAllModals();
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }

    gameOver() {
      this.state = 'GAMEOVER';
      SoundFX.playHit();

      const modal = document.getElementById('dinoGameOverModal');
      if (modal) {
        document.getElementById('goFinalScore').innerText = Math.floor(this.score) + 'm';
        document.getElementById('goGoldCount').innerText = this.goldCount;
        document.getElementById('goDiamondCount').innerText = this.diamondCount;
        document.getElementById('goEarnedXP').innerText = `+${this.earnedXP} XP`;
        modal.style.display = 'flex';
      }
    }

    loop(timestamp) {
      if (this.state !== 'PLAYING') return;

      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;
      this.gameTime += dt;

      this.update(dt);
      this.render();

      this.animId = requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
      const stage = STAGES[this.stageIndex];
      const speed = stage.speed;

      this.score += speed * dt * 10;
      this.updateHUD();

      if (this.stageIndex < STAGES.length - 1 && this.score >= stage.targetScore) {
        this.advanceStage();
        return;
      }

      this.dino.vy += this.dino.gravity;
      this.dino.y += this.dino.vy;

      if (this.dino.y >= this.groundY - this.dino.height) {
        this.dino.y = this.groundY - this.dino.height;
        this.dino.vy = 0;
        this.dino.isGrounded = true;
      } else {
        this.dino.isGrounded = false;
      }

      if (this.dino.isGrounded) {
        this.dino.legTimer += dt * (speed * 2.2);
        this.dino.legFrame = Math.floor(this.dino.legTimer) % 4;
        this.dino.headbandWiggle = Math.sin(this.gameTime * 14) * 3;

        if (Math.floor(this.gameTime * 8) % 2 === 0 && Math.random() < 0.25) {
          this.spawnDust(this.dino.x + 8, this.dino.y + this.dino.height, 2);
        }
      } else {
        this.dino.headbandWiggle = -4;
      }

      if (this.dino.isInvulnerable) {
        this.dino.invulnerableTimer -= dt;
        if (this.dino.invulnerableTimer <= 0) {
          this.dino.isInvulnerable = false;
        }
      }

      this.clouds.forEach(cl => {
        cl.x -= cl.speed * speed * 4 * dt;
        if (cl.x + cl.width < -50) {
          cl.x = this.width + 50 + Math.random() * 100;
          cl.y = 25 + Math.random() * 65;
        }
      });

      this.buildings.forEach(b => {
        b.x -= speed * 8 * dt;
      });
      if (this.buildings.length > 0 && this.buildings[0].x + this.buildings[0].width < -50) {
        const removed = this.buildings.shift();
        const lastB = this.buildings[this.buildings.length - 1];
        removed.x = lastB.x + lastB.width + 12 + Math.random() * 20;
        this.buildings.push(removed);
      }

      this.obstacleTimer += dt;
      const minObsInterval = Math.max(1.3, 2.8 - (this.stageIndex * 0.45));
      if (this.obstacleTimer > minObsInterval) {
        if (Math.random() < 0.85) {
          this.spawnObstacle();
          this.obstacleTimer = 0;
        }
      }

      this.collectibleTimer += dt;
      if (this.collectibleTimer > 2.0) {
        if (Math.random() < 0.75) {
          this.spawnCollectibles();
          this.collectibleTimer = 0;
        }
      }

      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= speed * 60 * dt;

        if (!this.dino.isInvulnerable && this.checkCollision(this.dino, obs)) {
          this.handleCactusCollision(obs);
          return;
        }

        if (obs.x + obs.width < -60) {
          this.obstacles.splice(i, 1);
        }
      }

      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const item = this.collectibles[i];
        item.x -= speed * 60 * dt;
        item.spinAngle = (item.spinAngle || 0) + dt * 6;
        item.bobOffset = Math.sin(this.gameTime * 6 + i) * 4;

        if (this.checkCollision(this.dino, item)) {
          if (item.type === 'COIN') {
            this.goldCount++;
            SoundFX.playCoin();
            this.addFloatingText('+10 🪙', item.x, item.y, '#fbbf24');
            this.spawnSparkles(item.x + 10, item.y + 10, '#fbbf24', 12);
            this.collectibles.splice(i, 1);

            window.dispatchEvent(new CustomEvent('culturesync:reward', {
              detail: { type: 'COIN', coins: 10, diamonds: 0, xp: 2 }
            }));
          } else if (item.type === 'DIAMOND') {
            this.collectibles.splice(i, 1);
            this.handleDiamondTrigger();
            return;
          }
          this.updateHUD();
        } else if (item.x + item.width < -60) {
          this.collectibles.splice(i, 1);
        }
      }

      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y -= 45 * dt;
        ft.alpha -= dt * 1.3;
        if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= dt * 1.8;
        if (p.alpha <= 0) this.particles.splice(i, 1);
      }
    }

    spawnObstacle() {
      const types = [
        { width: 28, height: 48, type: 'single', hasFlower: Math.random() > 0.4 },
        { width: 50, height: 50, type: 'double', hasFlower: Math.random() > 0.5 },
        { width: 32, height: 62, type: 'tall', hasFlower: true }
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      this.obstacles.push({
        x: this.width + 40,
        y: this.groundY - selected.height,
        width: selected.width,
        height: selected.height,
        type: selected.type,
        hasFlower: selected.hasFlower
      });
    }

    spawnCollectibles() {
      const rand = Math.random();
      if (rand < 0.24) {
        this.collectibles.push({
          x: this.width + 60,
          y: this.groundY - 105 - Math.random() * 35,
          width: 28,
          height: 28,
          type: 'DIAMOND',
          spinAngle: 0
        });
      } else {
        const count = 2 + Math.floor(Math.random() * 3);
        const yBase = Math.random() > 0.45 ? this.groundY - 32 : this.groundY - 85;
        for (let j = 0; j < count; j++) {
          this.collectibles.push({
            x: this.width + 50 + j * 30,
            y: yBase,
            width: 22,
            height: 22,
            type: 'COIN',
            spinAngle: j * 0.5
          });
        }
      }
    }

    checkCollision(dino, obj) {
      const padX = 8;
      const padY = 6;
      return (
        dino.x + padX < obj.x + obj.width - padX &&
        dino.x + dino.width - padX > obj.x + padX &&
        dino.y + padY < obj.y + obj.height - padY &&
        dino.y + dino.height - padY > obj.y + padY
      );
    }

    handleDiamondTrigger() {
      this.state = 'PAUSED_QUIZ';
      SoundFX.playDiamond();

      const quiz = this.getRandomQuiz();
      this.activeQuiz = quiz;

      this.openQuizModal({
        badge: "💎 MYSTERY SLANG DISCOVERED!",
        badgeClass: "badge-diamond",
        imageUrl: quiz.imageUrl,
        imageCaption: quiz.imageCaption,
        question: quiz.question,
        options: quiz.options,
        correctIndex: quiz.correctIndex,
        explanation: quiz.explanation,
        rewardText: "+100 Coins 🪙 • +1 Diamond 💎 • +50 XP ⭐",
        onAnswer: (isCorrect) => {
          if (isCorrect) {
            this.diamondCount++;
            this.addFloatingText('+100 🪙 & +1 💎!', this.dino.x + 10, this.dino.y - 30, '#38bdf8');
            SoundFX.playFanfare();
            this.triggerConfetti();
            this.updateGlobalXP(50);

            window.dispatchEvent(new CustomEvent('culturesync:reward', {
              detail: { type: 'DIAMOND_QUIZ', coins: 100, diamonds: 1, xp: 50 }
            }));
          } else {
            this.addFloatingText('Bỏ lỡ Kim Cương!', this.dino.x + 10, this.dino.y - 20, '#94a3b8');
          }
          this.updateHUD();
          setTimeout(() => this.resumeGame(), 350);
        }
      });
    }

    handleCactusCollision(hitObstacle) {
      this.state = 'COLLISION_CHOICE';
      SoundFX.playHit();

      if (this.collisionModal) {
        this.collisionModal.style.display = 'flex';

        const btnGiveUp = document.getElementById('btnGiveUp');
        if (btnGiveUp) {
          btnGiveUp.onclick = () => {
            this.collisionModal.style.display = 'none';
            this.gameOver();
          };
        }

        const btnTryMore = document.getElementById('btnTryMore');
        if (btnTryMore) {
          btnTryMore.onclick = () => {
            this.collisionModal.style.display = 'none';
            this.launchReviveQuiz(hitObstacle);
          };
        }
      }
    }

    launchReviveQuiz(hitObstacle) {
      this.state = 'PAUSED_QUIZ';
      const quiz = this.getRandomQuiz();
      this.activeQuiz = quiz;

      this.openQuizModal({
        badge: "🔥 CƠ HỘI HỒI SINH BẰNG VĂN HÓA!",
        badgeClass: "badge-revive",
        imageUrl: quiz.imageUrl,
        imageCaption: quiz.imageCaption,
        question: quiz.question,
        options: quiz.options,
        correctIndex: quiz.correctIndex,
        explanation: quiz.explanation,
        rewardText: "+80 Coins 🪙 • Hồi Sinh Khiên Plasma 3s • +25 XP ⭐",
        onAnswer: (isCorrect) => {
          if (isCorrect) {
            const idx = this.obstacles.indexOf(hitObstacle);
            if (idx !== -1) this.obstacles.splice(idx, 1);

            this.dino.isInvulnerable = true;
            this.dino.invulnerableTimer = 3.0;

            SoundFX.playFanfare();
            this.addFloatingText('🔥 HỒI SINH! +80 🪙 & Khiên 3s Active', this.dino.x, this.dino.y - 30, '#10b981');
            this.spawnSparkles(this.dino.x + 24, this.dino.y + 24, '#10b981', 16);

            window.dispatchEvent(new CustomEvent('culturesync:reward', {
              detail: { type: 'REVIVE_QUIZ', coins: 80, diamonds: 0, xp: 25 }
            }));

            setTimeout(() => this.resumeGame(), 450);
          } else {
            setTimeout(() => this.gameOver(), 450);
          }
        }
      });
    }

    openQuizModal(config) {
      if (!this.quizModal) return;

      const badgeElem = document.getElementById('quizModalBadge');
      const imgElem = document.getElementById('quizModalImage');
      const captionElem = document.getElementById('quizModalCaption');
      const qElem = document.getElementById('quizModalQuestion');
      const optionsContainer = document.getElementById('quizModalOptions');
      const expContainer = document.getElementById('quizModalExplanation');
      const expText = document.getElementById('quizExplanationText');
      const btnProceed = document.getElementById('btnQuizProceed');

      badgeElem.innerText = config.badge;
      badgeElem.className = 'quiz-badge ' + (config.badgeClass || '');
      imgElem.src = config.imageUrl;
      captionElem.innerText = config.imageCaption || '';
      qElem.innerText = config.question;
      expContainer.style.display = 'none';

      optionsContainer.innerHTML = '';
      let answered = false;

      config.options.forEach((optText, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `<span class="opt-key">${String.fromCharCode(65 + i)}</span> <span>${optText}</span>`;
        btn.onclick = () => {
          if (answered) return;
          answered = true;

          const isCorrect = (i === config.correctIndex);
          if (isCorrect) {
            btn.classList.add('correct');
          } else {
            btn.classList.add('wrong');
            const correctBtn = optionsContainer.children[config.correctIndex];
            if (correctBtn) correctBtn.classList.add('correct');
          }

          expText.innerHTML = (isCorrect ? '✅ <strong>Chuẩn xác!</strong> ' : '❌ <strong>Chưa đúng!</strong> ') + config.explanation;
          expContainer.style.display = 'block';

          btnProceed.onclick = () => {
            this.quizModal.style.display = 'none';
            config.onAnswer(isCorrect);
          };
        };
        optionsContainer.appendChild(btn);
      });

      this.quizModal.style.display = 'flex';
    }

    hideAllModals() {
      if (this.quizModal) this.quizModal.style.display = 'none';
      if (this.collisionModal) this.collisionModal.style.display = 'none';
      if (this.stageClearModal) this.stageClearModal.style.display = 'none';
      const goModal = document.getElementById('dinoGameOverModal');
      if (goModal) goModal.style.display = 'none';
    }

    advanceStage() {
      this.state = 'STAGE_CLEAR';
      SoundFX.playFanfare();
      this.triggerConfetti();

      this.stageIndex++;
      const nextStage = STAGES[this.stageIndex];

      if (this.stageClearModal) {
        document.getElementById('stageClearTitle').innerText = `🏆 HOÀN THÀNH STAGE ${this.stageIndex}!`;
        document.getElementById('stageClearDesc').innerText = `Chuẩn bị bước vào Stage ${this.stageIndex + 1}: ${nextStage.name} (${nextStage.themeTitle}) với tốc độ bứt phá!`;
        this.stageClearModal.style.display = 'flex';

        document.getElementById('btnStartNextStage').onclick = () => {
          this.stageClearModal.style.display = 'none';
          this.obstacles = [];
          this.collectibles = [];
          this.resumeGame();
        };
      }
    }

    getRandomQuiz() {
      const currentStage = this.stageIndex + 1;
      let available = SLANG_QUIZ_BANK.filter(q => q.stage <= currentStage && !this.usedQuizIds.has(q.id));
      if (available.length === 0) {
        this.usedQuizIds.clear();
        available = SLANG_QUIZ_BANK;
      }
      const chosen = available[Math.floor(Math.random() * available.length)];
      this.usedQuizIds.add(chosen.id);
      return chosen;
    }

    // =======================================================================
    // 7. MASTER RENDER ENGINE (PIXEL EXCELLENCE)
    // =======================================================================
    render() {
      const stage = STAGES[this.stageIndex];

      // 1. Sky Gradient
      const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
      skyGrad.addColorStop(0, stage.skyTop);
      skyGrad.addColorStop(1, stage.skyBottom);
      this.ctx.fillStyle = skyGrad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // 2. Twinkling Stars
      this.drawStars();

      // 3. Celestial Moon / Sun / Cyberpunk Grid Sun
      this.drawCelestialBody(stage);

      // 4. Parallax Clouds
      this.drawClouds();

      // 5. Parallax Skyline
      this.drawSkyline(stage);

      // 6. Textured Ground Track
      this.drawGroundTrack(stage);

      // 7. Collectibles
      this.collectibles.forEach(c => this.drawCollectible(c));

      // 8. Obstacles
      this.obstacles.forEach(o => this.drawCactus(o));

      // 9. Dino Champion (With Active Skin)
      this.drawDino();

      // 10. Speed Lines in Stages 2 & 3
      if (this.stageIndex >= 1) {
        this.drawSpeedLines(stage);
      }

      // 11. Floating Score Texts
      this.floatingTexts.forEach(ft => {
        this.ctx.save();
        this.ctx.globalAlpha = ft.alpha;
        this.ctx.fillStyle = ft.color;
        this.ctx.shadowColor = ft.color;
        this.ctx.shadowBlur = 8;
        this.ctx.font = 'bold 15px "Space Grotesk", sans-serif';
        this.ctx.fillText(ft.text, ft.x, ft.y);
        this.ctx.restore();
      });

      // 12. Particles
      this.particles.forEach(p => {
        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 4;
        this.ctx.fillRect(p.x, p.y, p.size, p.size);
        this.ctx.restore();
      });
    }

    drawStars() {
      this.stars.forEach(st => {
        const flicker = Math.sin(this.gameTime * st.blinkSpeed + st.x) * 0.35 + 0.65;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${st.alpha * flicker})`;
        this.ctx.beginPath();
        this.ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }

    drawCelestialBody(stage) {
      this.ctx.save();
      const cx = 680;
      const cy = 60;

      if (stage.celestialType === 'sun') {
        const glow = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, 70);
        glow.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
        glow.addColorStop(0.4, 'rgba(245, 158, 11, 0.35)');
        glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 70, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#fef08a';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (stage.celestialType === 'moon') {
        this.ctx.shadowColor = '#c084fc';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#f3e8ff';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(cx + 12, cy - 6, 24, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'source-over';
      } else {
        const sunRad = 36;
        const grad = this.ctx.createLinearGradient(cx, cy - sunRad, cx, cy + sunRad);
        grad.addColorStop(0, '#34d399');
        grad.addColorStop(1, '#059669');
        this.ctx.fillStyle = grad;
        this.ctx.shadowColor = '#10b981';
        this.ctx.shadowBlur = 25;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, sunRad, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = stage.skyTop;
        for (let s = -sunRad + 14; s < sunRad; s += 9) {
          this.ctx.fillRect(cx - sunRad, cy + s, sunRad * 2, 3);
        }
      }
      this.ctx.restore();
    }

    drawClouds() {
      this.ctx.save();
      this.clouds.forEach(cl => {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.beginPath();
        this.ctx.arc(cl.x + 20, cl.y + 12, 14, 0, Math.PI * 2);
        this.ctx.arc(cl.x + 40, cl.y + 8, 18, 0, Math.PI * 2);
        this.ctx.arc(cl.x + 60, cl.y + 12, 14, 0, Math.PI * 2);
        this.ctx.rect(cl.x + 10, cl.y + 12, 60, 10);
        this.ctx.fill();
      });
      this.ctx.restore();
    }

    drawSkyline(stage) {
      this.ctx.save();
      this.buildings.forEach(b => {
        const bY = this.groundY - b.height;
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        this.ctx.fillRect(b.x, bY, b.width, b.height);

        if (b.hasAntenna) {
          this.ctx.strokeStyle = stage.groundLine;
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(b.x + b.width / 2, bY);
          this.ctx.lineTo(b.x + b.width / 2, bY - 14);
          this.ctx.stroke();

          if (Math.floor(this.gameTime * 3) % 2 === 0) {
            this.ctx.fillStyle = '#ef4444';
            this.ctx.beginPath();
            this.ctx.arc(b.x + b.width / 2, bY - 14, 2, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }

        this.ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
        for (let r = 0; r < b.windowRows - 1; r++) {
          for (let c = 0; c < b.windowCols; c++) {
            if ((r + c + Math.floor(b.x)) % 3 === 0) {
              this.ctx.fillRect(b.x + 4 + c * 11, bY + 8 + r * 14, 4, 6);
            }
          }
        }
      });
      this.ctx.restore();
    }

    drawGroundTrack(stage) {
      this.ctx.save();
      this.ctx.fillStyle = stage.groundColor;
      this.ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

      this.ctx.strokeStyle = stage.groundLine;
      this.ctx.shadowColor = stage.groundLine;
      this.ctx.shadowBlur = 10;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.groundY);
      this.ctx.lineTo(this.width, this.groundY);
      this.ctx.stroke();

      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = stage.groundPattern;
      const patternOffset = (this.score * 8) % 40;
      for (let x = -patternOffset; x < this.width + 40; x += 40) {
        this.ctx.fillRect(x, this.groundY + 8, 22, 3);
        this.ctx.fillRect(x + 12, this.groundY + 24, 16, 2);
      }
      this.ctx.restore();
    }

    drawSpeedLines(stage) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      this.ctx.lineWidth = 1.5;
      const lineOffset = (this.score * 20) % 120;
      for (let y = 50; y < this.groundY - 40; y += 45) {
        const lx = this.width - lineOffset - (y * 2) % 200;
        this.ctx.beginPath();
        this.ctx.moveTo(lx, y);
        this.ctx.lineTo(lx - 40, y);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    drawDino() {
      const x = this.dino.x;
      const y = this.dino.y;

      const distFromGround = (this.groundY - this.dino.height) - y;
      const shadowScale = Math.max(0.3, 1 - distFromGround / 120);
      const shadowAlpha = Math.max(0.1, 0.45 - distFromGround / 200);

      this.ctx.save();
      this.ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
      this.ctx.beginPath();
      this.ctx.ellipse(x + 24, this.groundY - 1, 22 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      renderDinoSprite(this.ctx, x, y, {
        skinId: this.activeSkin,
        legFrame: this.dino.legFrame,
        isGrounded: this.dino.isGrounded,
        headbandWiggle: this.dino.headbandWiggle,
        gameTime: this.gameTime,
        isInvulnerable: this.dino.isInvulnerable,
        scale: 1.0,
        isIdle: false
      });
    }

    drawCactus(obs) {
      this.ctx.save();
      const x = obs.x;
      const y = obs.y;

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      this.ctx.beginPath();
      this.ctx.ellipse(x + obs.width / 2, this.groundY + 1, obs.width / 2 + 4, 4, 0, 0, Math.PI * 2);
      this.ctx.fill();

      const drawSingleStem = (sx, sy, sw, sh) => {
        const grad = this.ctx.createLinearGradient(sx, sy, sx + sw, sy);
        grad.addColorStop(0, '#15803d');
        grad.addColorStop(0.3, '#22c55e');
        grad.addColorStop(0.8, '#16a34a');
        grad.addColorStop(1, '#14532d');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.roundRect(sx, sy, sw, sh, 5);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(sx + sw * 0.35, sy + 4);
        this.ctx.lineTo(sx + sw * 0.35, sy + sh - 4);
        this.ctx.stroke();

        this.ctx.fillStyle = '#fef08a';
        for (let th = sy + 8; th < sy + sh - 6; th += 12) {
          this.ctx.fillRect(sx - 2, th, 2, 2);
          this.ctx.fillRect(sx + sw, th + 4, 2, 2);
        }
      };

      if (obs.type === 'single') {
        drawSingleStem(x + 8, y, 12, obs.height);
        this.ctx.fillStyle = '#16a34a';
        this.ctx.fillRect(x, y + 14, 8, 5);
        drawSingleStem(x, y + 8, 6, 12);
        this.ctx.fillRect(x + 20, y + 20, 8, 5);
        drawSingleStem(x + 22, y + 12, 6, 14);
      } else if (obs.type === 'double') {
        drawSingleStem(x + 4, y + 8, 14, obs.height - 8);
        drawSingleStem(x + 26, y, 16, obs.height);
        this.ctx.fillStyle = '#16a34a';
        this.ctx.fillRect(x + 16, y + 22, 12, 6);
      } else {
        drawSingleStem(x + 10, y, 14, obs.height);
        this.ctx.fillStyle = '#16a34a';
        this.ctx.fillRect(x + 2, y + 18, 9, 6);
        drawSingleStem(x + 2, y + 8, 7, 16);
        this.ctx.fillRect(x + 23, y + 28, 9, 6);
        drawSingleStem(x + 25, y + 18, 7, 16);
      }

      if (obs.hasFlower) {
        this.ctx.fillStyle = '#f43f5e';
        this.ctx.shadowColor = '#fb7185';
        this.ctx.shadowBlur = 6;
        const fx = x + obs.width / 2;
        this.ctx.beginPath();
        this.ctx.arc(fx - 3, y - 2, 3.5, 0, Math.PI * 2);
        this.ctx.arc(fx + 3, y - 2, 3.5, 0, Math.PI * 2);
        this.ctx.arc(fx, y - 5, 3.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#fef08a';
        this.ctx.beginPath();
        this.ctx.arc(fx, y - 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    drawCollectible(item) {
      this.ctx.save();
      const cx = item.x + item.width / 2;
      const cy = item.y + item.height / 2 + (item.bobOffset || 0);

      if (item.type === 'COIN') {
        const scaleX = Math.cos(item.spinAngle);
        this.ctx.translate(cx, cy);
        this.ctx.scale(scaleX, 1);

        this.ctx.fillStyle = '#f59e0b';
        this.ctx.shadowColor = 'rgba(251, 191, 36, 0.7)';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 11, 0, Math.PI * 2);
        this.ctx.fill();

        const coinGrad = this.ctx.createLinearGradient(-10, -10, 10, 10);
        coinGrad.addColorStop(0, '#fef08a');
        coinGrad.addColorStop(0.5, '#fbbf24');
        coinGrad.addColorStop(1, '#d97706');
        this.ctx.fillStyle = coinGrad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 9, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 3, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (item.type === 'DIAMOND') {
        this.ctx.translate(cx, cy);

        const aura = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 20);
        aura.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
        aura.addColorStop(1, 'rgba(56, 189, 248, 0)');
        this.ctx.fillStyle = aura;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#38bdf8';
        this.ctx.shadowColor = '#0284c7';
        this.ctx.shadowBlur = 14;

        this.ctx.beginPath();
        this.ctx.moveTo(0, -14);
        this.ctx.lineTo(13, 0);
        this.ctx.lineTo(0, 14);
        this.ctx.lineTo(-13, 0);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1.6;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -14);
        this.ctx.lineTo(0, 14);
        this.ctx.moveTo(-13, 0);
        this.ctx.lineTo(13, 0);
        this.ctx.stroke();

        const twinkle = Math.sin(this.gameTime * 10) * 0.4 + 0.6;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        this.ctx.fillRect(-2, -2, 4, 4);
      }

      this.ctx.restore();
    }

    drawIdleScreen() {
      const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, '#070d19');
      grad.addColorStop(1, '#0f172a');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.drawStars();

      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 2;
      this.ctx.shadowColor = '#38bdf8';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.groundY);
      this.ctx.lineTo(this.width, this.groundY);
      this.ctx.stroke();

      this.dino.y = this.groundY - this.dino.height;
      this.drawDino();

      this.drawCactus({ x: 280, y: this.groundY - 50, width: 28, height: 50, type: 'single', hasFlower: true });

      this.drawCollectible({ x: 190, y: this.groundY - 70, width: 22, height: 22, type: 'COIN', spinAngle: 0 });
      this.drawCollectible({ x: 380, y: this.groundY - 80, width: 26, height: 26, type: 'DIAMOND', spinAngle: 0 });

      this.ctx.save();
      this.ctx.textAlign = 'center';

      this.ctx.font = '900 28px "Orbitron", "Space Grotesk", sans-serif';
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.shadowColor = '#0284c7';
      this.ctx.shadowBlur = 18;
      this.ctx.fillText('🦖 DINO SLANG QUEST 2D', this.width / 2 + 50, 85);

      this.ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText('Ăn Vàng 🪙 & Kim Cương 💎 | Giải Đố Slang Văn Hóa Kiếm Tiền Mua Skin 🛍️', this.width / 2 + 50, 115);

      const pulse = Math.sin(Date.now() / 250) * 0.25 + 0.75;
      this.ctx.font = '800 16px "Orbitron", sans-serif';
      this.ctx.fillStyle = `rgba(16, 185, 129, ${pulse})`;
      this.ctx.shadowColor = '#10b981';
      this.ctx.shadowBlur = 12;
      this.ctx.fillText('▶ NHẤN SPACEBAR HOẶC CHẠM ĐỂ CHƠI NGAY ◀', this.width / 2 + 50, 165);

      this.ctx.restore();
    }

    addFloatingText(text, x, y, color) {
      this.floatingTexts.push({ text, x, y, color, alpha: 1.0 });
    }

    spawnDust(x, y, count = 3) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x, y,
          vx: -15 - Math.random() * 25,
          vy: -6 - Math.random() * 12,
          size: 2 + Math.random() * 3,
          color: 'rgba(203, 213, 225, 0.7)',
          alpha: 1.0
        });
      }
    }

    spawnSparkles(x, y, color, count = 10) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 35 + Math.random() * 70;
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 2.5,
          color,
          alpha: 1.0
        });
      }
    }

    triggerConfetti() {
      if (typeof window.launchConfetti === 'function') {
        window.launchConfetti();
      }
    }

    updateHUD() {
      const scoreElem = document.getElementById('dinoScoreDisplay');
      const goldElem = document.getElementById('dinoGoldDisplay');
      const diamondElem = document.getElementById('dinoDiamondDisplay');
      const stageElem = document.getElementById('dinoStageBadge');

      if (scoreElem) scoreElem.innerText = Math.floor(this.score) + 'm';
      if (goldElem) goldElem.innerText = this.goldCount;
      if (diamondElem) diamondElem.innerText = this.diamondCount;
      if (stageElem) stageElem.innerText = `Stage ${this.stageIndex + 1}: ${STAGES[this.stageIndex].name}`;
    }

    updateGlobalXP(points) {
      this.earnedXP += points;
      const xpElem = document.getElementById('xpDisplay');
      if (xpElem) {
        const current = parseInt(xpElem.innerText) || 140;
        xpElem.innerText = current + points;
      }
    }

    // =======================================================================
    // STATIC SKIN PREVIEW RENDERER FOR REACT SKIN SHOP
    // =======================================================================
    static renderSkinPreview(canvasElem, skinId, gameTime = 0) {
      if (!canvasElem) return;
      const ctx = canvasElem.getContext('2d');
      const w = canvasElem.width;
      const h = canvasElem.height;

      ctx.clearRect(0, 0, w, h);

      // Cyber Pedestal Stage
      const cx = w / 2;
      const cy = h - 45;

      // Glow beam from bottom
      const beamGrad = ctx.createLinearGradient(0, cy, 0, cy - 80);
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy);
      ctx.lineTo(cx - 30, cy - 70);
      ctx.lineTo(cx + 30, cy - 70);
      ctx.lineTo(cx + 50, cy);
      ctx.closePath();
      ctx.fill();

      // Pedestal Ellipse
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 58, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pedestal Inner Ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 46, 10, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Dino Shadow on Pedestal
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 2, 26, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Idle Breathing Bob
      const idleBob = Math.sin(gameTime * 3) * 2;

      // Render Dino Sprite centered
      const dinoX = cx - 24;
      const dinoY = cy - 54 + idleBob;

      renderDinoSprite(ctx, dinoX, dinoY, {
        skinId,
        legFrame: 0,
        isGrounded: true,
        headbandWiggle: Math.sin(gameTime * 4) * 2,
        gameTime,
        isInvulnerable: false,
        scale: 1.0,
        isIdle: true
      });
    }
  }

  // Expose API to Global Window
  if (typeof window !== 'undefined') {
    window.DinoSlangQuest = DinoSlangQuest;
    window.DinoSoundFX = SoundFX;
    window.SKINS_CATALOG = SKINS_CATALOG;
    window.SLANG_QUIZ_BANK = SLANG_QUIZ_BANK;
    window.renderDinoSprite = renderDinoSprite;

    if (typeof document !== 'undefined') {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('dinoCanvas') && !window.dinoGameInstance) {
          window.dinoGameInstance = new DinoSlangQuest('dinoCanvas');
        }
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DinoSlangQuest, SoundFX, SKINS_CATALOG, SLANG_QUIZ_BANK, STAGES };
    console.log("✅ dino_game.js compiled & validated successfully in Node.js!");
  }

})();
