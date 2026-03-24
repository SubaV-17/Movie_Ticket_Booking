import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { Footer } from '../components/Layout';
import './MovieDetail.css';

const DATES = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MovieDetail() {
  const { id }  = useParams();
  const nav     = useNavigate();
  const [movie,    setMovie]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [dateIdx,  setDateIdx]  = useState(0);
  const [selShow,  setSelShow]  = useState(null);
  const [booked,   setBooked]   = useState({});

  useEffect(() => {
    API.get(`/movies/${id}/`).then(r => { setMovie(r.data); setLoading(false); }).catch(() => nav('/movies'));
  }, [id]);

  // Fetch booked seats count per show
  useEffect(() => {
    if (!movie) return;
    movie.shows?.forEach(s => {
      API.get(`/bookings/seats/${s.id}/`).then(r => {
        setBooked(prev => ({ ...prev, [s.id]: r.data.booked_seats?.length || 0 }));
      }).catch(() => {});
    });
  }, [movie]);

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:70 }}><span className="spin" style={{ width:36,height:36,borderWidth:3 }} /></div>;
  if (!movie)  return null;

  // Group shows by theatre
  const groups = {};
  (movie.shows || []).forEach(s => { if (!groups[s.theatre]) groups[s.theatre]=[]; groups[s.theatre].push(s); });

  const availStatus = (show) => {
    const b = booked[show.id] || 0;
    const left = (show.seats_total || 80) - b;
    if (left <= 0)  return { label: 'Sold Out', cls: 'sh-sold',  disabled: true };
    if (left <= 10) return { label: `${left} left`, cls: 'sh-few', disabled: false };
    return               { label: 'Available',  cls: 'sh-ok',   disabled: false };
  };

  const handleBook = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { nav('/login'); return; }
    nav(`/seats/${movie._id}`, { state: { show: selShow, movie } });
  };

  const stars = (r) => '★'.repeat(Math.round(r/2))+'☆'.repeat(5-Math.round(r/2));

  return (
    <div>
      {/* BACKDROP */}
      <div className="detail-back" style={{ backgroundImage:`url(${movie.bg_image})` }}>
        <div className="detail-back-ov" />
      </div>

      {/* MAIN */}
      <div className="detail-main">
        <img src={movie.image} alt={movie.title} className="detail-poster"
          onError={e => e.target.src='/images/black.jpg'} />
        <div className="detail-info">
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:14 }}>
            <span className="badge b-gray">{movie.genre}</span>
            <span className="badge b-gold">{movie.language}</span>
            <span className="badge b-gray">{movie.type}</span>
            {movie.tag && <span className="badge b-red">{movie.tag}</span>}
          </div>
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            <span style={{ color:'var(--gold)', letterSpacing:2 }}>{stars(movie.imdb)}</span>
            <strong style={{ color:'var(--gold)', fontSize:18 }}>{movie.imdb}</strong>
            <span style={{ color:'rgba(255,255,255,.3)' }}>·</span>
            <span>{movie.duration}</span>
            <span style={{ color:'rgba(255,255,255,.3)' }}>·</span>
            <span>{movie.year}</span>
          </div>
          <p className="detail-desc">{movie.desc}</p>
          <div className="detail-crew">
            <div><span className="crew-lbl">Director</span><span className="crew-val">{movie.director}</span></div>
            <div><span className="crew-lbl">Cast</span><span className="crew-val">{movie.cast?.join(', ')}</span></div>
            <div><span className="crew-lbl">From</span><span className="crew-val" style={{ color:'var(--gold)', fontWeight:700, fontSize:18 }}>₹{movie.price}</span></div>
          </div>
        </div>
      </div>

      {/* SHOWS */}
      <div style={{ padding:'44px 5%' }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20 }}>Select Date & Show</h2>

        {/* Date tabs */}
        <div style={{ display:'flex', gap:10, marginBottom:28, overflowX:'auto', paddingBottom:4 }}>
          {DATES.map((d,i) => (
            <button key={i} onClick={() => { setDateIdx(i); setSelShow(null); }}
              className={`dtab ${dateIdx===i?'dtab-on':''}`}>{d}</button>
          ))}
        </div>

        {/* Theatre groups */}
        {Object.entries(groups).map(([theatre, shows]) => (
          <div key={theatre} className="tcard">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap', gap:8 }}>
              <div>
                <h3 style={{ fontSize:15, fontWeight:600 }}>{theatre}</h3>
                <p style={{ color:'var(--muted)', fontSize:13 }}>📍 Madurai</p>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <span className="badge b-gold">Dolby</span>
                <span className="badge b-gray">4K</span>
              </div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {shows.map(s => {
                const { label, cls, disabled } = availStatus(s);
                const sel = selShow?.id === s.id;
                return (
                  <button key={s.id} disabled={disabled} onClick={() => setSelShow(sel ? null : { ...s, theatre })}
                    className={`shbtn ${cls} ${sel?'shbtn-sel':''}`}>
                    <span style={{ display:'block', fontSize:14, fontWeight:700, color: sel ? 'var(--red)' : 'var(--text)' }}>{s.time}</span>
                    <span style={{ display:'block', fontSize:11, marginTop:3 }}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky CTA */}
      {selShow && (
        <div className="detail-sticky">
          <div>
            <p style={{ fontWeight:600 }}>{movie.title}</p>
            <p style={{ color:'var(--gold)', fontSize:13 }}>{selShow.theatre} · {selShow.time} · ₹{selShow.price}/seat</p>
          </div>
          <button className="btn btn-red" onClick={handleBook}>Select Seats →</button>
        </div>
      )}

      <Footer />
    </div>
  );
}
