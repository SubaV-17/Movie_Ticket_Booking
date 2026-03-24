import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Footer } from '../components/Layout';

export default function MyBookings() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) { nav('/login'); return; }
    API.get('/bookings/mine/').then(r => { setBookings(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await API.post(`/bookings/cancel/${id}/`);
      setBookings(bs => bs.map(b => b._id === id ? {...b, status:'cancelled'} : b));
    } catch(e) { alert(e.response?.data?.error || 'Could not cancel.'); }
  };

  return (
    <div className="page" style={{ padding:'20px 5% 40px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32, flexWrap:'wrap', gap:12 }}>
        <div>
          <span style={{ color:'var(--red)', fontSize:12, fontWeight:700, letterSpacing:3, textTransform:'uppercase', display:'block', marginBottom:6 }}>Account</span>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(24px,3.5vw,38px)', fontWeight:700 }}>My Bookings</h1>
        </div>
        <button className="btn btn-red" style={{ padding:'9px 20px', fontSize:13 }} onClick={() => nav('/movies')}>+ Book a Movie</button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:14, marginBottom:36 }}>
        {[
          ['🎬','Total',    bookings.length],
          ['✅','Confirmed', bookings.filter(b=>b.status==='confirmed').length],
          ['❌','Cancelled', bookings.filter(b=>b.status==='cancelled').length],
          ['💰','Spent',    `₹${bookings.filter(b=>b.status==='confirmed').reduce((s,b)=>s+b.total_amount,0)}`],
        ].map(([icon,label,val]) => (
          <div key={label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'18px', textAlign:'center' }}>
            <span style={{ fontSize:26, display:'block', marginBottom:8 }}>{icon}</span>
            <p style={{ fontSize:20, fontWeight:700, color:'var(--gold)', marginBottom:3 }}>{val}</p>
            <p style={{ color:'var(--muted)', fontSize:12 }}>{label}</p>
          </div>
        ))}
      </div>

      {loading && <div style={{ textAlign:'center', padding:'60px 0' }}><span className="spin" style={{ width:36, height:36, borderWidth:3 }} /></div>}

      {!loading && bookings.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <p style={{ fontSize:52, marginBottom:16 }}>🎬</p>
          <h3 style={{ fontSize:20, marginBottom:8 }}>No bookings yet</h3>
          <p style={{ color:'var(--muted)', marginBottom:24 }}>Book your first movie now!</p>
          <button className="btn btn-red" onClick={() => nav('/movies')}>Browse Movies</button>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {bookings.map(b => (
          <div key={b._id} style={{ background:'var(--card)', border:`1px solid ${b.status==='cancelled'?'rgba(239,68,68,.2)':'var(--border)'}`, borderRadius:14, padding:20, display:'flex', alignItems:'center', gap:18, flexWrap:'wrap', opacity: b.status==='cancelled'?.7:1 }}>
            <div style={{ width:50, height:68, borderRadius:8, background:'var(--card2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🎬</div>
            <div style={{ flex:1, minWidth:0 }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.movie_title}</h3>
              <p style={{ color:'var(--muted2)', fontSize:13, marginBottom:3 }}>🎭 {b.theatre}</p>
              <p style={{ color:'var(--muted)', fontSize:13, marginBottom:3 }}>📅 {b.show_date} · 🕐 {b.show_time}</p>
              <p style={{ color:'var(--muted)', fontSize:13 }}>💺 {b.seats?.join(', ')}</p>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <span className={`badge ${b.status==='confirmed'?'b-green':''}`}
                style={b.status==='cancelled'?{background:'rgba(239,68,68,.15)',color:'#f87171',border:'1px solid rgba(239,68,68,.3)'}:{}}
              >{b.status==='confirmed'?'✓ Confirmed':'✗ Cancelled'}</span>
              <p style={{ color:'var(--gold)', fontWeight:700, fontSize:18, margin:'8px 0 4px' }}>₹{b.total_amount}</p>
              <p style={{ color:'var(--muted)', fontSize:11, marginBottom: b.status==='confirmed'?8:0 }}>{b._id?.slice(-8).toUpperCase()}</p>
              {b.status === 'confirmed' && (
                <button onClick={() => cancel(b._id)} style={{ background:'rgba(239,68,68,.12)', border:'1px solid rgba(239,68,68,.3)', color:'#f87171', padding:'5px 12px', borderRadius:7, fontSize:12, cursor:'pointer', fontFamily:'Poppins,sans-serif' }}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
