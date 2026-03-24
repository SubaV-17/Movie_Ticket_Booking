import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Footer } from '../components/Layout';
import './Home.css';

export default function Home() {
  const [movies,  setMovies]  = useState([]);
  const [hero,    setHero]    = useState(0);
  const [fade,    setFade]    = useState(true);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    API.get('/movies/').then(r => { setMovies(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!movies.length) return;
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setHero(h => (h + 1) % Math.min(movies.length, 5)); setFade(true); }, 350);
    }, 5000);
    return () => clearInterval(t);
  }, [movies]);

  const hm = movies[hero];
  const stars = (r) => '★'.repeat(Math.round(r / 2)) + '☆'.repeat(5 - Math.round(r / 2));

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:70 }}>
      <span className="spin" style={{ width:40, height:40, borderWidth:3 }} />
    </div>
  );

  return (
    <div>
      {/* ── HERO ── */}
      {hm && (
        <section className="hero" style={{ backgroundImage:`url(${hm.bg_image})` }}>
          <div className="hero-overlay" />
          <div className={`hero-content ${fade ? 'hero-in' : 'hero-out'}`}>
            {hm.tag && <span className="badge b-red" style={{ marginBottom:12, display:'inline-block' }}>{hm.tag}</span>}
            <h1 className="hero-title">{hm.title}</h1>
            <div className="hero-meta">
              <span style={{ color:'var(--gold)' }}>{stars(hm.imdb)}</span>
              <strong style={{ color:'var(--gold)' }}>{hm.imdb}</strong>
              <span className="hero-sep">|</span>
              <span>{hm.duration}</span>
              <span className="hero-sep">|</span>
              <span>{hm.language}</span>
            </div>
            <p className="hero-desc">{hm.desc?.slice(0, 180)}…</p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button className="btn btn-red" onClick={() => nav(`/movies/${hm._id}`)}>▶ Book Now</button>
              <button className="btn btn-ghost" onClick={() => nav(`/movies/${hm._id}`)}>ℹ Details</button>
            </div>
          </div>

          {/* Dots */}
          <div className="hero-dots">
            {movies.slice(0,5).map((_,i) => (
              <span key={i} onClick={() => {setHero(i);setFade(true);}} className={`hero-dot ${i===hero?'hd-on':''}`} />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div className="hero-thumbs">
            {movies.slice(0,5).map((m,i) => (
              <img key={m._id} src={m.image} alt={m.title}
                className={`hero-thumb ${i===hero?'ht-on':''}`}
                onClick={() => {setHero(i);setFade(true);}}
                onError={e => e.target.style.display='none'} />
            ))}
          </div>
        </section>
      )}

      {/* ── NOW SHOWING ── */}
      <section style={{ padding:'60px 5%' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32 }}>
          <div>
            <span style={{ color:'var(--red)', fontSize:12, fontWeight:700, letterSpacing:3, textTransform:'uppercase', display:'block', marginBottom:6 }}>On Screen</span>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(26px,3.5vw,38px)', fontWeight:700 }}>Now Showing</h2>
          </div>
          <button className="btn btn-ghost" style={{ padding:'8px 18px', fontSize:13 }} onClick={() => nav('/movies')}>See all →</button>
        </div>

        <div className="movie-grid">
          {movies.map((m, i) => (
            <div key={m._id} className="mcard afu" style={{ animationDelay:`${i*.06}s` }} onClick={() => nav(`/movies/${m._id}`)}>
              <div className="mcard-img">
                <img src={m.image} alt={m.title} onError={e => { e.target.src='/images/black.jpg'; }} />
                {m.tag && <span className="badge b-red mcard-tag">{m.tag}</span>}
                <div className="mcard-hover"><button className="btn btn-red" style={{ padding:'9px 18px', fontSize:13 }}>▶ Book</button></div>
                <div className="mcard-rating"><span style={{ color:'var(--gold)' }}>★</span>{m.imdb}</div>
              </div>
              <div style={{ padding:'12px 12px 14px' }}>
                <div style={{ display:'flex', gap:5, marginBottom:6 }}>
                  <span className="badge b-gray">{m.type}</span>
                  <span className="badge b-gray">{m.rating}</span>
                </div>
                <h3 style={{ fontSize:14, fontWeight:600, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.title}</h3>
                <p style={{ color:'var(--muted)', fontSize:12, marginBottom:10 }}>{m.genre} · {m.duration}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ color:'var(--gold)', fontWeight:700, fontSize:14 }}>₹{m.price}</span>
                  <span className="badge b-gold">{m.language}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', padding:'60px 5%' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <span style={{ color:'var(--red)', fontSize:12, fontWeight:700, letterSpacing:3, textTransform:'uppercase', display:'block', marginBottom:8 }}>Why Us</span>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(24px,3vw,36px)', fontWeight:700 }}>The MovieTime Experience</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20 }}>
          {[['🎬','4K IMAX Screens','Crystal-clear Dolby Atmos experience.'],
            ['💺','Smart Seat Selection','Live seat availability before you book.'],
            ['⚡','Instant Booking','Confirm tickets in under 60 seconds.'],
            ['🎁','Member Deals','Discounts and early-bird pricing.']
          ].map(([icon,title,desc]) => (
            <div key={title} className="why-card">
              <div style={{ fontSize:34, marginBottom:12 }}>{icon}</div>
              <h3 style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>{title}</h3>
              <p style={{ color:'var(--muted)', fontSize:13, lineHeight:1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
