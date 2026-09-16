import React, { useState, useCallback, useRef } from 'react';
import DinoCanvas from './DinoCanvas.jsx';
import SlangQuizModal from './modals/SlangQuizModal.jsx';
import CollisionModal from './modals/CollisionModal.jsx';
import GameOverModal from './modals/GameOverModal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const DIFFICULTY_CONFIG = {
  easy: {
    label: '🐢 Easy',
    desc: 'Tốc độ chậm, ít vật cản — dành cho người mới',
    color: '#10b981',
    colorBg: 'rgba(16,185,129,0.1)',
    colorBorder: 'rgba(16,185,129,0.4)',
    badge: 'BEGINNER'
  },
  medium: {
    label: '⚡ Medium',
    desc: 'Cân bằng — thử thách vừa phải',
    color: '#38bdf8',
    colorBg: 'rgba(56,189,248,0.1)',
    colorBorder: 'rgba(56,189,248,0.4)',
    badge: 'NORMAL'
  },
  hard: {
    label: '🔥 Hard',
    desc: 'Tốc độ cao, chim dày đặc — dành cho pro!',
    color: '#f43f5e',
    colorBg: 'rgba(244,63,94,0.1)',
    colorBorder: 'rgba(244,63,94,0.4)',
    badge: 'EXPERT'
  }
};

const FALLBACK_QUIZZES = [
  {
    id: 101,
    term: 'Chiobu',
    culture: 'SG',
    question: 'Trong tiếng lóng giảng đường Singapore (Singlish), từ "Chiobu" dùng để chỉ ai?',
    options: ['Một bạn nữ xinh đẹp / thu hút', 'Giáo sư khó tính', 'Kỳ thi tốt nghiệp', 'Món cơm gà Hải Nam'],
    correct_index: 0,
    explanation: '"Chiobu" (gốc Phúc Kiến) là từ lóng cực kỳ phổ biến tại các trường đại học Singapore dùng để chỉ một cô gái xinh xắn, thu hút.'
  },
  {
    id: 102,
    term: 'Gánh team',
    culture: 'VN',
    question: 'Sinh viên Việt Nam dùng cụm từ "Gánh team" trong bài tập nhóm với ý nghĩa gì?',
    options: ['Cùng chia đều công việc', 'Một mình làm phần lớn công việc để nhóm qua môn', 'Bỏ học đi chơi game', 'Đi ăn mừng sau khi nộp bài'],
    correct_index: 1,
    explanation: '"Gánh team" xuất phát từ thuật ngữ game, chỉ người có năng lực vượt trội đứng ra gánh vác phần lớn deadline cho cả nhóm.'
  },
  {
    id: 103,
    term: 'Makan',
    culture: 'SG',
    question: 'Bạn sinh viên Singapore nhắn: "Let\'s go makan at canteen!", nghĩa là gì?',
    options: ['Đi học nhóm', 'Đi ăn cơm trưa / ăn uống', 'Đi tập gym', 'Đi mượn sách thư viện'],
    correct_index: 1,
    explanation: '"Makan" là từ gốc Mã Lai được người Singapore sử dụng hàng ngày để rủ nhau đi ăn.'
  },
  {
    id: 104,
    term: 'Phao',
    culture: 'VN',
    question: 'Trong môi trường học đường Việt Nam, "Phao thi" là gì?',
    options: ['Phao bơi giải nhiệt mùa hè', 'Tài liệu thu nhỏ dùng để gian lận trong phòng thi', 'Học bổng cứu trợ sinh viên', 'Điểm cộng chuyên cần'],
    correct_index: 1,
    explanation: '"Phao" là tài liệu quay cóp thu nhỏ bất hợp pháp mà sinh viên hay nói đùa vào mùa thi cử.'
  },
  {
    id: 105,
    term: 'Ponteng',
    culture: 'SG',
    question: 'Sinh viên Singapore bảo: "Don\'t ponteng today\'s lecture!", từ "Ponteng" nghĩa là gì?',
    options: ['Cúp học / trốn tiết', 'Ghi chép bài', 'Đặt câu hỏi cho giảng viên', 'Nộp bài trễ'],
    correct_index: 0,
    explanation: '"Ponteng" là từ lóng Singlish gốc Mã Lai có nghĩa là cúp học, trốn tiết không tham gia lớp.'
  },
  {
    id: 106,
    term: 'Cột sống Gen Z',
    culture: 'VN',
    question: 'Thuật ngữ Gen Z "Cột sống" thường được sinh viên chơi chữ với từ nào?',
    options: ['Cuộc sống (áp lực deadline khiến đau lưng)', 'Cột mốc cuộc đời', 'Sống còn', 'Cột cờ trường'],
    correct_index: 0,
    explanation: '"Cột sống" là lối chơi chữ hóm hỉnh của "Cuộc sống" khi sinh viên ngồi học và cày deadline quá nhiều dẫn đến đau lưng.'
  },
  {
    id: 107,
    term: 'Jio',
    culture: 'SG',
    question: 'Khi bạn học người Singapore phàn nàn: "Why you never jio me?", từ "Jio" có nghĩa là gì?',
    options: ['Rủ rê / Mời đi chơi cùng', 'Cho mượn tiền', 'Chỉ bài tập', 'Gửi tài liệu ôn thi'],
    correct_index: 0,
    explanation: '"Jio" (gốc Phúc Kiến) nghĩa là rủ, mời ai đó tham gia một hoạt động hoặc buổi đi chơi.'
  },
  {
    id: 108,
    term: 'Xu cà na',
    culture: 'VN',
    question: 'Khi gặp chuyện xui xẻo hoặc làm bài thi không như ý, sinh viên Việt Nam hay thốt lên cụm từ nào?',
    options: ['Xu cà na', 'Ngon cơm', 'Đỉnh nóc kịch trần', 'Bách phát bách trúng'],
    correct_index: 0,
    explanation: '"Xu cà na" là tiếng lóng cửa miệng của giới trẻ chỉ sự xui xẻo, đen đủi hoặc kết quả không như mong đợi.'
  }
];

export default function DinoGameArena({ activeSkin, onPlayerUpdate, playerData, user, onOpenAuth, onOpenProfile }) {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState('idle'); // idle | playing | collision | quiz | gameover
  const [difficulty, setDifficulty] = useState('medium');
  const [showDiffPicker, setShowDiffPicker] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizType, setQuizType] = useState('diamond'); // diamond | revive
  const [score, setScore] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [collisionType, setCollisionType] = useState('cactus');
  const [encounteredSlangs, setEncounteredSlangs] = useState([]);
  const dinoRef = useRef(null);

  const fetchQuiz = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const uid = user?.id || user?.player_id || '';

      // Try Node server with user personalization
      let res = await fetch(`/api/game/quiz?type=visual_rebus&stage=1&userId=${uid}`, { signal: controller.signal }).catch(() => null);
      if (!res || !res.ok) {
        // Try Flask server next
        res = await fetch('/api/game/next', { signal: controller.signal }).catch(() => null);
      }
      clearTimeout(timeoutId);

      if (res && res.ok) {
        const d = await res.json();
        if (d.success && d.data) return d.data;
        if (d.question && d.options) return d;
      }
    } catch {}

    // Smart personalized fallback matching user culture if possible
    if (user?.target_culture && user.target_culture !== 'ALL') {
      const cultMatches = FALLBACK_QUIZZES.filter(q => q.culture === user.target_culture);
      if (cultMatches.length) return cultMatches[Math.floor(Math.random() * cultMatches.length)];
    }

    // Instant rich fallback
    return FALLBACK_QUIZZES[Math.floor(Math.random() * FALLBACK_QUIZZES.length)];
  };

  const showReward = (text, color, top = '30%') => {
    const el = document.createElement('div');
    el.className = 'reward-float';
    el.style.top = top;
    el.style.color = color;
    el.style.textShadow = `0 0 12px ${color}`;
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  };

  const handleCoinCollect = useCallback((amount, multiplier) => {
    setSessionCoins(c => c + amount);
    if (multiplier >= 3) showReward(`+${amount} 🪙  x${multiplier} COMBO!`, '#f97316', '25%');
    else showReward(`+${amount} 🪙`, '#fbbf24', '28%');
  }, []);

  const handleDiamondCollect = useCallback(async () => {
    setQuizType('diamond');
    setGameState('quiz');
    const quiz = await fetchQuiz();
    setQuizData(quiz);
    // Track which slangs were encountered for post-game review
    if (quiz) setEncounteredSlangs(prev => {
      const already = prev.find(s => s.id === quiz.id || s.term === quiz.term);
      return already ? prev : [...prev, quiz].slice(-6); // keep max 6
    });
  }, []);

  const handleCollision = useCallback((type) => {
    setCollisionType(type || 'cactus');
    setGameState('collision');
  }, []);

  const handleCombo = useCallback((count) => {
    setMaxCombo(c => Math.max(c, count));
  }, []);

  const handleTryMore = async () => {
    setQuizType('revive');
    setGameState('quiz');
    const quiz = await fetchQuiz();
    setQuizData(quiz);
  };

  const handleGiveUp = () => setGameState('gameover');

  const handleQuizAnswer = useCallback((result) => {
    if (quizType === 'diamond') {
      if (result.is_correct) {
        setSessionCoins(c => c + 100);
        setSessionXp(x => x + 50);
        showReward('+100 🪙  +1 💎  +50 ⭐ CHÍNH XÁC!', '#38bdf8', '22%');
      } else {
        showReward('Tiếc quá, chưa đúng! Tiếp tục chạy...', '#94a3b8', '24%');
      }
      // Tiếp tục chạy ngay tại vị trí vừa ăn kim cương kèm 2s khiên bảo vệ
      setGameState('playing');
      dinoRef.current?.resume({ shield: true, shieldDuration: 120, clearThreats: true });
    } else {
      // Hồi sinh sau khi va chạm
      if (result.is_correct) {
        setSessionCoins(c => c + 80);
        setSessionXp(x => x + 25);
        showReward('+80 🪙  +25 ⭐  🛡️ HỒI SINH THÀNH CÔNG!', '#10b981', '22%');
        setGameState('playing');
        dinoRef.current?.revive();
      } else {
        showReward('Sai rồi! Lượt chơi kết thúc!', '#f43f5e', '24%');
        setGameState('gameover');
      }
    }
    setQuizData(null);

    if (result.rewards && (result.rewards.coins || result.rewards.xp)) {
      fetch('/api/player/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result.rewards,
          userId: user?.id || user?.player_id
        })
      }).then(r => r.json()).then(d => onPlayerUpdate?.(d.data)).catch(() => {});
    }
  }, [quizType, onPlayerUpdate, user]);

  const handleRestart = () => {
    setScore(0); setSessionCoins(0); setSessionXp(0); setMaxCombo(0);
    setEncounteredSlangs([]);
    setGameState('idle');
    setTimeout(() => setGameState('playing'), 10);
  };

  const handleStart = () => {
    setScore(0); setSessionCoins(0); setSessionXp(0); setMaxCombo(0);
    setGameState('playing');
  };

  const diffCfg = DIFFICULTY_CONFIG[difficulty];
  const diffLabel = t(`game.difficulty.${difficulty}.label`);
  const diffDesc = t(`game.difficulty.${difficulty}.desc`);
  const diffBadge = t(`game.difficulty.${difficulty}.badge`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* Game Canvas */}
      <div className="game-cabinet scanlines" style={{ position: 'relative', width: '100%' }}>
        {/* Corner LEDs */}
        {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
          <div key={`${v}-${h}`} style={{
            position:'absolute', zIndex:2, width:'20px', height:'20px',
            [v]:'8px', [h]:'8px',
            borderTop: v==='top' ? '2px solid rgba(56,189,248,0.5)' : 'none',
            borderBottom: v==='bottom' ? '2px solid rgba(56,189,248,0.5)' : 'none',
            borderLeft: h==='left' ? '2px solid rgba(56,189,248,0.5)' : 'none',
            borderRight: h==='right' ? '2px solid rgba(56,189,248,0.5)' : 'none',
          }} />
        ))}

        <DinoCanvas
          ref={dinoRef}
          activeSkin={activeSkin}
          difficulty={difficulty}
          gameState={gameState}
          gameActive={gameState === 'playing'}
          onCoinCollect={handleCoinCollect}
          onDiamondCollect={handleDiamondCollect}
          onCollision={handleCollision}
          onCombo={handleCombo}
          onScoreUpdate={setScore}
        />

        {/* ── Start Screen ── */}
        {gameState === 'idle' && (
          <div style={{
            position:'absolute', inset:0, zIndex:10,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px',
            background:'rgba(7,10,18,0.82)', backdropFilter:'blur(6px)'
          }}>
            <div style={{ fontSize:'4rem', animation:'float 2s ease-in-out infinite' }}>🦖</div>

            <h1 style={{
              fontFamily:'var(--font-arcade)', fontSize:'1.5rem',
              color:'var(--neon-cyan)', letterSpacing:'0.1em',
              textShadow:'0 0 30px rgba(56,189,248,0.6)', textAlign:'center'
            }}>{t('game.title')}</h1>

            {/* Info pills */}
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center' }}>
              {[t('game.pills.coins'), t('game.pills.quizzes'), t('game.pills.birds'), t('game.pills.jump')].map(pill => (
                <span key={pill} style={{
                  padding:'4px 12px', borderRadius:'999px', fontSize:'0.76rem',
                  background:'rgba(56,189,248,0.12)', border:'1px solid rgba(56,189,248,0.35)',
                  color:'#ffffff', fontFamily:'var(--font-heading)', fontWeight:'500',
                  boxShadow:'0 0 10px rgba(56,189,248,0.1)'
                }}>{pill}</span>
              ))}
            </div>

            {/* AI Personalization Status Banner */}
            {user ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(139,92,246,0.12))',
                border: '1px solid rgba(56,189,248,0.35)',
                borderRadius: '12px', padding: '8px 16px',
                display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
                maxWidth: '460px', boxShadow: '0 0 20px rgba(56,189,248,0.08)'
              }}>
                <span style={{ fontSize: '0.95rem' }}>✨</span>
                <div style={{ fontSize: '0.72rem', color: '#e2e8f0', fontFamily: 'var(--font-heading)' }}>
                  <strong style={{ color: 'var(--neon-cyan)' }}>{user.username}</strong> • {t('game.aiBannerTitle')}{' '}
                  <span style={{ color: 'var(--neon-emerald)', fontWeight: '700' }}>
                    {user.interests?.[0]?.toUpperCase() || 'CAMPUS'}
                  </span>{' '}
                  •{' '}
                  <span style={{ color: 'var(--neon-gold)', fontWeight: '700' }}>
                    {user.english_level?.toUpperCase() || 'INTERMEDIATE'}
                  </span>
                </div>
                {onOpenProfile && (
                  <button
                    onClick={onOpenProfile}
                    style={{
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px', color: '#94a3b8', fontSize: '0.65rem', padding: '2px 8px', cursor: 'pointer'
                    }}
                    title={t('game.changeProfile')}
                  >
                    {t('game.changeProfile')}
                  </button>
                )}
              </div>
            ) : (
              <div style={{
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: '12px', padding: '8px 16px',
                display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
                maxWidth: '460px'
              }}>
                <span style={{ fontSize: '0.9rem' }}>⚡</span>
                <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontFamily: 'var(--font-heading)' }}>
                  {t('game.guestBannerTitle')}
                </span>
                {onOpenAuth && (
                  <button
                    onClick={onOpenAuth}
                    className="btn-arcade btn-gold"
                    style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '700', cursor: 'pointer'
                    }}
                  >
                    {t('game.guestLoginBtn')}
                  </button>
                )}
              </div>
            )}

            {/* Difficulty picker */}
            <div style={{ width:'100%', maxWidth:'380px' }}>
              <p style={{ fontFamily:'var(--font-arcade)', fontSize:'0.65rem', color:'#94a3b8', textAlign:'center', marginBottom:'10px', letterSpacing:'0.1em' }}>
                {t('game.selectDifficulty')}
              </p>
              <div style={{ display:'flex', gap:'8px' }}>
                {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    style={{
                      flex:1, padding:'10px 8px', borderRadius:'12px', cursor:'pointer',
                      background: difficulty === key ? cfg.colorBg : 'rgba(13,20,36,0.7)',
                      border: `1.5px solid ${difficulty === key ? cfg.color : 'rgba(255,255,255,0.06)'}`,
                      color: difficulty === key ? cfg.color : '#94a3b8',
                      fontFamily:'var(--font-heading)', fontWeight:'600', fontSize:'0.82rem',
                      display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
                      transition:'all 0.25s ease',
                      boxShadow: difficulty === key ? `0 0 20px ${cfg.color}33` : 'none'
                    }}
                  >
                    <span style={{ fontSize:'1.1rem' }}>{t(`game.difficulty.${key}.label`)}</span>
                    <span style={{ fontSize:'0.62rem', opacity:0.8, fontWeight:'400', textAlign:'center', lineHeight:1.3, color: difficulty === key ? cfg.color : '#cbd5e1' }}>
                      {t(`game.difficulty.${key}.desc`)}
                    </span>
                    {difficulty === key && (
                      <span style={{
                        marginTop:'2px', fontSize:'0.55rem', fontFamily:'var(--font-arcade)',
                        padding:'2px 8px', borderRadius:'4px',
                        background:`${cfg.color}22`, border:`1px solid ${cfg.color}44`,
                        color: cfg.color, letterSpacing:'0.1em'
                      }}>{t(`game.difficulty.${key}.badge`)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <button
              className="btn-arcade animate-pulse-glow"
              onClick={handleStart}
              style={{
                fontSize:'1.05rem', padding:'14px 44px', borderRadius:'14px',
                letterSpacing:'0.08em', fontWeight:'700',
                background:`linear-gradient(135deg, ${diffCfg.color}cc, ${diffCfg.color})`,
                color:'#070a12', border:'none', cursor:'pointer',
                boxShadow:`0 4px 20px ${diffCfg.color}55, 0 0 40px ${diffCfg.color}22`
              }}
            >{t('game.startBtn')}</button>

            <p style={{ fontSize:'0.65rem', color:'#94a3b8', fontFamily:'var(--font-arcade)', letterSpacing:'0.05em' }}>
              {t('game.controlsHint')}
            </p>
          </div>
        )}
      </div>

      {/* Session Stats Bar */}
      {gameState !== 'idle' && (
        <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap', alignItems:'center' }}>
          {/* Difficulty badge */}
          <span style={{
            padding:'6px 12px', borderRadius:'8px',
            background: diffCfg.colorBg,
            border:`1px solid ${diffCfg.colorBorder}`,
            color: diffCfg.color,
            fontFamily:'var(--font-arcade)', fontSize:'0.65rem', letterSpacing:'0.08em'
          }}>{diffCfg.label}</span>

          {[
            { label: t('game.stats.score'), value:String(score).padStart(5,'0'), color:'var(--neon-cyan)' },
            { label: t('game.stats.coins'), value:`+${sessionCoins}`, color:'var(--neon-gold)' },
            { label: t('game.stats.combo'), value:`x${maxCombo}`, color:'var(--neon-rose)' },
            { label: t('game.stats.xp'), value:`+${sessionXp}`, color:'var(--neon-emerald)' }
          ].map(s => (
            <div key={s.label} style={{
              background:'var(--bg-card)', border:'1px solid var(--border-subtle)',
              borderRadius:'10px', padding:'7px 16px',
              display:'flex', gap:'8px', alignItems:'center'
            }}>
              <span style={{ fontFamily:'var(--font-arcade)', fontSize:'0.6rem', color:'var(--text-muted)' }}>{s.label}</span>
              <span style={{ fontFamily:'var(--font-arcade)', fontSize:'0.85rem', fontWeight:'700', color:s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {gameState === 'collision' && (
        <CollisionModal score={score} collisionType={collisionType} onGiveUp={handleGiveUp} onTryMore={handleTryMore} />
      )}

      {gameState === 'quiz' && quizData && (
        <SlangQuizModal
          quiz={quizData}
          quizType={quizType}
          onAnswer={handleQuizAnswer}
          onClose={() => {
            if (quizType === 'diamond') {
              // Tắt modal câu hỏi kim cương -> vẫn tiếp tục chạy tiếp tại vị trí đó!
              setGameState('playing');
              dinoRef.current?.resume({ shield: true, shieldDuration: 90, clearThreats: true });
            } else {
              // Đóng modal hồi sinh -> Game Over
              setGameState('gameover');
            }
            setQuizData(null);
          }}
        />
      )}

      {gameState === 'quiz' && !quizData && (
        <div className="modal-overlay">
          <div style={{ textAlign:'center', color:'var(--neon-cyan)', fontFamily:'var(--font-arcade)' }}>
            <div style={{ fontSize:'2rem', animation:'spin-slow 0.8s linear infinite', display:'inline-block' }}>⚙️</div>
            <p style={{ marginTop:'10px', fontSize:'0.8rem' }}>Loading quiz...</p>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <GameOverModal
          score={score}
          coins={sessionCoins}
          xp={sessionXp}
          activeSkin={activeSkin}
          user={user}
          onOpenAuth={onOpenAuth}
          onRestart={handleRestart}
          onClose={() => setGameState('idle')}
          encounteredSlangs={encounteredSlangs}
        />
      )}
    </div>
  );
}
