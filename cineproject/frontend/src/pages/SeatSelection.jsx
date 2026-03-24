import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../api';
import './Seats.css';

const ROWS = ['A','B','C','D','E','F','G','H'];
const COLS = 10;

export default function SeatSelection() {
  const { id }       = useParams();
  const { state }    = useLocation();
  const nav          = useNavigate();
  const show         = state?.show;
  const movie        = state?.movie;
  const [selected,   setSelected]   = useState([]);
  const [bookedList, setBookedList] = useState([]);

  useEffect(() => {
    if (!show?.id) return;
    API.get(`/bookings/seats/${show.id}/`)
      .then(r => setBookedList(r.data.booked_seats || []))
      .catch(() => {});
  }, [show]);

  if (!show || !movie) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, paddingTop:80 }}>
      <p style={{ fontSize:48 }}>⚠️</p>
      <p>No show selected. <span style={{ color:'var(--red)', cursor:'pointer' }} onClick={() => nav('/movies')}>Go back to movies</span></p>
    </div>
  );

  const toggle = (sid) => {
    if (bookedList.includes(sid)) return;
    setSelected(p => p.includes(sid) ? p.filter(s => s !== sid) : [...p, sid]);
  };

  const seatCls = (sid) => {
    if (bookedList.includes(sid)) return 'seat s-booked';
    if (selected.includes(sid))   return 'seat s-sel';
    return 'seat s-avail';
  };

  const total = selected.length * (show.price || movie.price);

  return (
    <div className="seats-page page">
      {/* Header */}
      <div style={{ padding:'20px 5%', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
        <button className="btn btn-ghost" style={{ padding:'7px 16px', fontSize:13 }} onClick={() => nav(-1)}>← Back</button>
        <div>
          <h2 style={{ fontSize:17, fontWeight:700 }}>{movie.title}</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>{show.theatre} · {show.time} · ₹{show.price}/seat</p>
        </div>
      </div>

      {/* Screen */}
      <div style={{ textAlign:'center', margin:'10px auto 32px', maxWidth:600 }}>
        <div style={{ height:5, background:'linear-gradient(90deg,transparent,rgba(229,9,20,.8),transparent)', borderRadius:3, marginBottom:7 }} />
        <span style={{ color:'var(--muted)', fontSize:11, letterSpacing:5, textTransform:'uppercase' }}>S C R E E N</span>
      </div>

      {/* Grid */}
      <div style={{ overflowX:'auto', padding:'0 4% 16px' }}>
        <div style={{ width:'fit-content', margin:'0 auto', display:'flex', flexDirection:'column', gap:7 }}>
          {ROWS.map(row => (
            <div key={row} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:20, color:'var(--muted)', fontSize:12, textAlign:'center', flexShrink:0 }}>{row}</span>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                {Array.from({ length: COLS }, (_, c) => {
                  const sid = `${row}${c+1}`;
                  return (
                    <React.Fragment key={sid}>
                      {c === 5 && <span style={{ width:16, flexShrink:0 }} />}
                      <div className={seatCls(sid)} onClick={() => toggle(sid)} title={sid}>
                        <span style={{ fontSize:9 }}>{c+1}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              <span style={{ width:20, color:'var(--muted)', fontSize:12, textAlign:'center', flexShrink:0 }}>{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', justifyContent:'center', gap:22, margin:'20px 0', flexWrap:'wrap' }}>
        {[['s-avail','Available'],['s-sel','Selected'],['s-booked','Booked']].map(([cls,lbl]) => (
          <div key={lbl} style={{ display:'flex', alignItems:'center', gap:7, color:'var(--muted2)', fontSize:13 }}>
            <div className={`seat ${cls}`} style={{ pointerEvents:'none', transform:'none', boxShadow:'none' }} />
            {lbl}
          </div>
        ))}
      </div>

      {/* Summary */}
      {selected.length > 0 && (
        <div className="seat-summary">
          <div>
            <p style={{ color:'var(--muted)', fontSize:13 }}>Selected: <strong style={{ color:'var(--text)' }}>{selected.join(', ')}</strong></p>
            <p style={{ marginTop:4 }}>{selected.length} seat(s) · <strong style={{ color:'var(--gold)', fontSize:16 }}>₹{total}</strong></p>
          </div>
          <button className="btn btn-red"
            onClick={() => nav(`/payment/${movie._id}`, { state: { show, movie, seats: selected, total } })}>
            Pay ₹{total} →
          </button>
        </div>
      )}
    </div>
  );
}
