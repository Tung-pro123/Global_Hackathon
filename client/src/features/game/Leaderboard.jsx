// Leaderboard.jsx — Local leaderboard stored in localStorage

const LB_KEY = 'cultursync_leaderboard';
const MAX_ENTRIES = 10;

export function saveScore(score, coins, skin = 'classic') {
  const lb = getLeaderboard();
  const entry = {
    score,
    coins,
    skin,
    date: new Date().toLocaleDateString('vi-VN'),
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };
  lb.push(entry);
  lb.sort((a, b) => b.score - a.score);
  const top = lb.slice(0, MAX_ENTRIES);
  localStorage.setItem(LB_KEY, JSON.stringify(top));
  return top.findIndex(e => e === entry || e.score === score);
}

export function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LB_KEY) || '[]');
  } catch { return []; }
}

const RANK_STYLES = [
  { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.4)', color: '#fbbf24', medal: '🥇' },
  { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', color: '#94a3b8', medal: '🥈' },
  { bg: 'rgba(180,100,50,0.1)', border: 'rgba(180,100,50,0.3)', color: '#cd7c3a', medal: '🥉' },
];

export default function Leaderboard({ highlightScore = null }) {
  const lb = getLeaderboard();

  if (lb.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2rem' }}>🏆</div>
        <p style={{ marginTop: '8px', fontFamily: 'var(--font-arcade)', fontSize: '0.75rem' }}>
          No scores yet. Start playing!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {lb.map((entry, i) => {
        const style = RANK_STYLES[i] || { bg: 'transparent', border: 'var(--border-subtle)', color: 'var(--text-muted)', medal: `${i + 1}` };
        const isHighlight = highlightScore !== null && entry.score === highlightScore;

        return (
          <div
            key={i}
            className="lb-row"
            style={{
              background: isHighlight ? 'rgba(56,189,248,0.08)' : style.bg,
              borderColor: isHighlight ? 'rgba(56,189,248,0.5)' : style.border,
              outline: isHighlight ? '2px solid rgba(56,189,248,0.3)' : 'none'
            }}
          >
            <span className="lb-rank" style={{ color: style.color, minWidth: '26px' }}>
              {typeof style.medal === 'string' && style.medal.length > 1 ? style.medal : `#${i + 1}`}
            </span>

            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.85rem', color: isHighlight ? 'var(--neon-cyan)' : 'var(--text-primary)' }}>
                {String(entry.score).padStart(5, '0')}
                {isHighlight && <span style={{ fontSize: '0.65rem', marginLeft: '8px', color: 'var(--neon-cyan)' }}>← YOU</span>}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {entry.date} {entry.time}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.7rem', color: 'var(--neon-gold)' }}>
                🪙 {entry.coins}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
