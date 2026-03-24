import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../api';
import './Payment.css';

export default function Payment() {
  const { id }     = useParams();
  const { state }  = useLocation();
  const nav        = useNavigate();
  const { show, movie, seats = [], total = 0 } = state || {};
  const fee        = 30;
  const grandTotal = total + fee;

  const [method,  setMethod]  = useState('upi');
  const [upi,     setUpi]     = useState('');
  const [card,    setCard]     = useState({ number:'', name:'', expiry:'', cvv:'' });
  const [bank,    setBank]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handlePay = async () => {
    setError('');
    if (!seats.length) { setError('No seats selected.'); return; }
    setLoading(true);
    try {
      const res = await API.post('/bookings/create/', {
        movie_id:    movie._id,
        movie_title: movie.title,
        theatre:     show.theatre,
        show_id:     show.id,
        show_time:   show.time,
        show_date:   'Today',
        seats,
        price:       show.price || movie.price,
      });
      nav('/confirmed', { state: { bookingId: res.data.booking_id, movie, show, seats, total: grandTotal } });
    } catch (e) {
      setError(e.response?.data?.error || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!movie || !show) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:80 }}>
      <p>No booking data. <span style={{ color:'var(--red)', cursor:'pointer' }} onClick={() => nav('/movies')}>Browse movies</span></p>
    </div>
  );

  return (
    <div className="pay-page page">
      <div className="pay-wrap">
        <button className="btn btn-ghost" style={{ padding:'7px 16px', fontSize:13, marginBottom:22, display:'inline-flex' }} onClick={() => nav(-1)}>← Back</button>
        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(22px,3vw,34px)', fontWeight:700, marginBottom:28 }}>Complete Payment</h1>

        <div className="pay-layout">
          {/* LEFT */}
          <div>
            <div className="pay-card">
              <p className="pay-card-hd">Payment Method</p>
              <div style={{ display:'flex', gap:9, marginBottom:22, flexWrap:'wrap' }}>
                {[['upi','📱 UPI'],['card','💳 Card'],['netbanking','🏦 Net Banking']].map(([k,l]) => (
                  <button key={k} onClick={() => setMethod(k)}
                    className={`meth-tab ${method===k?'meth-on':''}`}>{l}</button>
                ))}
              </div>

              {method === 'upi' && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div>
                    <label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>UPI ID</label>
                    <input className="fi" value={upi} onChange={e=>setUpi(e.target.value)} placeholder="name@okicici" />
                  </div>
                  <div style={{ display:'flex', gap:9, flexWrap:'wrap' }}>
                    {['GPay','PhonePe','Paytm','BHIM'].map(a => (
                      <button key={a} className="btn btn-ghost" style={{ padding:'7px 14px', fontSize:12 }}>{a}</button>
                    ))}
                  </div>
                </div>
              )}

              {method === 'card' && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>Card Number</label>
                    <input className="fi" value={card.number} onChange={e=>setCard(c=>({...c,number:e.target.value}))} placeholder="1234 5678 9012 3456" /></div>
                  <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>Name on Card</label>
                    <input className="fi" value={card.name} onChange={e=>setCard(c=>({...c,name:e.target.value}))} placeholder="Full name" /></div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>Expiry</label>
                      <input className="fi" value={card.expiry} onChange={e=>setCard(c=>({...c,expiry:e.target.value}))} placeholder="MM/YY" /></div>
                    <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>CVV</label>
                      <input className="fi" type="password" value={card.cvv} onChange={e=>setCard(c=>({...c,cvv:e.target.value}))} placeholder="•••" /></div>
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>Select Bank</label>
                  <select className="fi" value={bank} onChange={e=>setBank(e.target.value)}>
                    <option value="">-- Select bank --</option>
                    {['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak','Bank of Baroda'].map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
              )}
            </div>

            {error && <div className="err-box">{error}</div>}

            <button className="btn btn-red" style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:15, borderRadius:12 }}
              onClick={handlePay} disabled={loading}>
              {loading ? <><span className="spin" /> Processing…</> : `🔒 Pay ₹${grandTotal} Securely`}
            </button>
            <p style={{ textAlign:'center', color:'var(--muted)', fontSize:12, marginTop:10 }}>Secured · 256-bit SSL</p>
          </div>

          {/* RIGHT – Summary */}
          <div className="pay-card">
            <p className="pay-card-hd">Order Summary</p>
            <div style={{ display:'flex', gap:12, marginBottom:18 }}>
              <img src={movie.image} alt="" style={{ width:54, height:74, objectFit:'cover', borderRadius:8, flexShrink:0 }} onError={e=>e.target.src='/images/black.jpg'} />
              <div>
                <p style={{ fontWeight:600, fontSize:15, marginBottom:4 }}>{movie.title}</p>
                <p style={{ color:'var(--muted)', fontSize:12 }}>{movie.language} · {movie.type}</p>
              </div>
            </div>
            <hr style={{ borderColor:'var(--border)', marginBottom:14 }} />
            {[['Theatre', show.theatre],['Time', show.time],['Seats', seats.join(', ')]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:9 }}>
                <span style={{ color:'var(--muted)', fontSize:13 }}>{k}</span>
                <span style={{ fontSize:13, fontWeight:500, textAlign:'right', maxWidth:180 }}>{v}</span>
              </div>
            ))}
            <hr style={{ borderColor:'var(--border)', margin:'12px 0' }} />
            {[[`${seats.length} × ₹${show.price||movie.price}`, `₹${total}`],['Convenience Fee', `₹${fee}`]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ color:'var(--muted)', fontSize:13 }}>{k}</span>
                <span style={{ fontSize:13 }}>{v}</span>
              </div>
            ))}
            <hr style={{ borderColor:'var(--border)', margin:'12px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:700 }}>Total</span>
              <span style={{ color:'var(--gold)', fontSize:22, fontWeight:800 }}>₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
