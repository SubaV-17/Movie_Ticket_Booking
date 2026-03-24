import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Footer } from '../components/Layout';

const LANGS  = ['All','Tamil','Telugu','Hindi','English'];
const GENRES = ['All','Action','Romance','Drama','Thriller','War / Drama','Fantasy'];

export default function Movies() {
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [lang,    setLang]    = useState('All');
  const [genre,   setGenre]   = useState('All');
  const nav = useNavigate();

  useEffect(() => {
    API.get('/movies/').then(r => { setMovies(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = movies.filter(m => {
    const ml = lang  === 'All' || m.language === lang;
    const mg = genre === 'All' || m.genre    === genre;
    const ms = m.title.toLowerCase().includes(search.toLowerCase());
    return ml && mg && ms;
  });

  return (
    <div>
      {/* Banner */}
      <div style={{ position:'relative', height:300, background:`url(/images/theatre.jpg) center/cover`, display:'flex', alignItems:'flex-end' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg,rgba(10,10,15,1) 0%,rgba(10,10,15,.5) 65%)' }} />
        <div style={{ position:'relative', zIndex:1, padding:'36px 5%' }}>
          <span style={{ color:'var(--red)', fontSize:12, fontWeight:700, letterSpacing:3, textTransform:'uppercase', display:'block', marginBottom:8 }}>What\'s On</span>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,5vw,52px)', fontWeight:700 }}>Now Showing</h1>
        </div>
      </div>

      {/* Filters — sticky */}
      <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', position:'sticky', top:68, zIndex:100, padding:'16px 5%' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'14px 20px', alignItems:'center' }}>
          <input className="fi" style={{ width:220, padding:'9px 14px', fontSize:13 }}
            placeholder="🔍  Search movies…"
            value={search} onChange={e => setSearch(e.target.value)} />

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:'var(--muted)', fontSize:13 }}>Lang:</span>
            {LANGS.map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{ background: lang===l ? 'var(--red)' : 'var(--card)', border:`1px solid ${lang===l?'var(--red)':'var(--border2)'}`, color: lang===l ? '#fff' : 'var(--muted2)', padding:'5px 13px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Poppins,sans-serif', transition:'all .18s' }}>
                {l}
              </button>
            ))}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span style={{ color:'var(--muted)', fontSize:13 }}>Genre:</span>
            {GENRES.map(g => (
              <button key={g} onClick={() => setGenre(g)}
                style={{ background: genre===g ? 'var(--red)' : 'var(--card)', border:`1px solid ${genre===g?'var(--red)':'var(--border2)'}`, color: genre===g ? '#fff' : 'var(--muted2)', padding:'5px 13px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Poppins,sans-serif', transition:'all .18s' }}>
                {g}
              </button>
            ))}
          </div>

          <span style={{ marginLeft:'auto', color:'var(--muted)', fontSize:13 }}>
            <strong style={{ color:'var(--text)' }}>{filtered.length}</strong> movies
          </span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding:'40px 5%' }}>
        {loading && (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <span className="spin" style={{ width:40, height:40, borderWidth:3 }} />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 0', color:'var(--muted)' }}>
            <p style={{ fontSize:48, marginBottom:16 }}>🎬</p>
            <p style={{ fontSize:15 }}>No movies found. Try different filters.</p>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:22 }}>
          {filtered.map((m, i) => (
            <div key={m._id} onClick={() => nav(`/movies/${m._id}`)}
              style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden', cursor:'pointer', transition:'all .28s', animationDelay:`${i*.05}s` }}
              className="afu"
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='var(--red)'; e.currentTarget.style.boxShadow='0 14px 34px rgba(229,9,20,.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow=''; }}>

              {/* Poster */}
              <div style={{ position:'relative', paddingTop:'145%', overflow:'hidden' }}>
                <img src={m.image} alt={m.title}
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s' }}
                  onMouseEnter={e => e.target.style.transform='scale(1.07)'}
                  onMouseLeave={e => e.target.style.transform=''}
                  onError={e => { e.target.src='/images/black.jpg'; }} />
                {m.tag && <span className="badge b-red" style={{ position:'absolute', top:9, left:9 }}>{m.tag}</span>}
                <div style={{ position:'absolute', top:9, right:9, background:'rgba(10,10,15,.88)', border:'1px solid rgba(245,197,24,.4)', borderRadius:7, padding:'3px 8px', fontSize:12, fontWeight:600, color:'var(--gold)', display:'flex', gap:4 }}>
                  <span>★</span>{m.imdb}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding:'12px 13px 15px' }}>
                <div style={{ display:'flex', gap:5, marginBottom:7 }}>
                  <span className="badge b-gray">{m.language}</span>
                  <span className="badge b-gray">{m.type}</span>
                  <span className="badge b-gray">{m.rating}</span>
                </div>
                <h3 style={{ fontSize:14, fontWeight:600, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.title}</h3>
                <p style={{ color:'var(--muted)', fontSize:12, marginBottom:12 }}>{m.genre} · {m.duration}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ color:'var(--gold)', fontWeight:700, fontSize:14 }}>From ₹{m.price}</span>
                  <button className="btn btn-red" style={{ padding:'6px 14px', fontSize:12, borderRadius:7 }}>Book →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
