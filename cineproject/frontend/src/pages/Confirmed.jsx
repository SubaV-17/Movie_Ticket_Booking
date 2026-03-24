import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Confirmed() {
  const { state } = useLocation();
  const nav       = useNavigate();
  const { bookingId, movie, show, seats = [], total = 0 } = state || {};
  const [show_, setShow_] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow_(true), 80); return () => clearTimeout(t); }, []);

  if (!bookingId) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, paddingTop:80 }}>
      <p>No booking found. <span style={{ color:'var(--red)', cursor:'pointer' }} onClick={()=>nav('/movies')}>Go to movies</span></p>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'100px 16px 60px', background:'radial-gradient(ellipse 60% 40% at 50% 15%,rgba(34,197,94,.07) 0%,transparent 60%),var(--bg)' }}>
      <div style={{ width:'100%', maxWidth:500, textAlign:'center', opacity: show_?1:0, transform: show_?'translateY(0)':'translateY(28px)', transition:'all .55s cubic-bezier(.16,1,.3,1)' }}>

        {/* Check icon */}
        <div style={{ width:72, height:72, borderRadius:'50%', border:'2px solid #22c55e', background:'rgba(34,197,94,.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 22px', fontSize:32, filter:'drop-shadow(0 0 14px rgba(34,197,94,.4))' }}>✓</div>

        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(24px,3.5vw,36px)', fontWeight:700, marginBottom:8 }}>Booking Confirmed!</h1>
        <p style={{ color:'var(--muted)', fontSize:14, marginBottom:30 }}>Your tickets are confirmed. Enjoy the show! 🎬</p>

        {/* Ticket */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border2)', borderRadius:18, overflow:'hidden', marginBottom:28, textAlign:'left', boxShadow:'0 20px 50px rgba(0,0,0,.5)' }}>
          <div style={{ display:'flex', gap:16, padding:20 }}>
            {movie && <img src={movie.image} alt="" style={{ width:72, height:98, objectFit:'cover', borderRadius:10, flexShrink:0 }} onError={e=>e.target.src='/images/black.jpg'} />}
            <div style={{ flex:1 }}>
              <p style={{ fontSize:16, fontWeight:700, marginBottom:12 }}>{movie?.title}</p>
              {[['Theatre', show?.theatre || 'PVR IMAX'],['Time', show?.time || ''],['Seats', seats.join(', ')]].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ color:'var(--muted)', fontSize:12 }}>{k}</span>
                  <span style={{ fontSize:12, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Perforation */}
          <div style={{ display:'flex', alignItems:'center', padding:'0 -4px', position:'relative' }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--bg)', marginLeft:-10, flexShrink:0 }} />
            <div style={{ flex:1, borderTop:'2px dashed rgba(255,255,255,.08)', margin:'0 8px' }} />
            <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--bg)', marginRight:-10, flexShrink:0 }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'16px 20px' }}>
            <div>
              <p style={{ color:'var(--muted)', fontSize:11, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Booking ID</p>
              <p style={{ fontWeight:700, fontSize:14, letterSpacing:1 }}>{bookingId?.slice(-10).toUpperCase()}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ color:'var(--muted)', fontSize:11, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Total Paid</p>
              <p style={{ color:'var(--gold)', fontSize:22, fontWeight:800 }}>₹{total}</p>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="btn btn-red"   onClick={() => nav('/bookings')}>My Bookings</button>
          <button className="btn btn-ghost" onClick={() => nav('/movies')}>Book Another</button>
        </div>
      </div>
    </div>
  );
}
