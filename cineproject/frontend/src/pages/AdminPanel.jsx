import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// ── Admin API (separate from user API, uses secret key) ──
const ADMIN_KEY = 'movietime-admin-2025'; // must match settings.py
const adm = axios.create({ baseURL: '/api/admin' });
adm.interceptors.request.use(cfg => {
  cfg.headers['X-Admin-Key'] = ADMIN_KEY;
  return cfg;
});

// ── Tiny helpers ─────────────────────────────────────────
const Card = ({ children, style }) => (
  <div style={{ background:'#14141e', border:'1px solid rgba(255,255,255,.08)', borderRadius:14, padding:22, ...style }}>{children}</div>
);
const Btn = ({ onClick, children, color='#e50914', style }) => (
  <button onClick={onClick} style={{ background:color, color:'#fff', border:'none', padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Poppins,sans-serif', ...style }}>{children}</button>
);
const Input = ({ label, value, onChange, placeholder, type='text', required }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
    <label style={{ fontSize:12, color:'#888', fontWeight:500 }}>{label}{required && ' *'}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:9, padding:'10px 13px', color:'#f1f1f1', fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none' }} />
  </div>
);

const TABS = ['Dashboard','Movies','Bookings','Contacts','Users'];

// ── EMPTY MOVIE FORM ─────────────────────────────────────
const EMPTY = { title:'', language:'Tamil', genre:'Action', price:'200', duration:'2h 00m', type:'2D', rating:'U', imdb:'7.0', director:'', cast:'', desc:'', tag:'', image:'', bg_image:'' };

export default function AdminPanel() {
  const [tab,      setTab]      = useState('Dashboard');
  const [stats,    setStats]    = useState(null);
  const [movies,   setMovies]   = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg,      setMsg]      = useState('');
  const [loading,  setLoading]  = useState(false);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  // Load data when tab changes
  useEffect(() => {
    if (tab === 'Dashboard') adm.get('/dashboard/').then(r => setStats(r.data)).catch(() => {});
    if (tab === 'Movies')    adm.get('/movies/').then(r => setMovies(r.data)).catch(() => {});
    if (tab === 'Bookings')  adm.get('/bookings/').then(r => setBookings(r.data)).catch(() => {});
    if (tab === 'Contacts')  adm.get('/contacts/').then(r => setContacts(r.data)).catch(() => {});
    if (tab === 'Users')     adm.get('/users/').then(r => setUsers(r.data)).catch(() => {});
  }, [tab]);

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (m) => {
    setForm({ ...m, price: String(m.price), imdb: String(m.imdb), cast: Array.isArray(m.cast) ? m.cast.join(', ') : m.cast || '' });
    setEditId(m._id); setShowForm(true);
  };

  const saveMovie = async () => {
    if (!form.title || !form.price) { flash('❌ Title and price are required.'); return; }
    setLoading(true);
    const payload = { ...form, price: Number(form.price), imdb: Number(form.imdb), cast: form.cast.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editId) {
        await adm.put(`/movies/edit/${editId}/`, payload);
        flash('✅ Movie updated!');
      } else {
        await adm.post('/movies/add/', payload);
        flash('✅ Movie added!');
      }
      setShowForm(false);
      adm.get('/movies/').then(r => setMovies(r.data));
    } catch (e) { flash('❌ ' + (e.response?.data?.error || 'Error')); }
    setLoading(false);
  };

  const deleteMovie = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await adm.delete(`/movies/delete/${id}/`);
    setMovies(ms => ms.filter(m => m._id !== id));
    flash('🗑️ Movie deleted.');
  };

  const resolveContact = async (id) => {
    await adm.post(`/contacts/resolve/${id}/`);
    setContacts(cs => cs.map(c => c._id === id ? { ...c, resolved: true } : c));
    flash('✅ Marked as resolved.');
  };

  // ── Styles ──────────────────────────────────────────────
  const S = {
    page:    { minHeight:'100vh', background:'#0a0a0f', color:'#f1f1f1', fontFamily:'Poppins,sans-serif', paddingBottom:60 },
    topbar:  { background:'#111118', borderBottom:'1px solid rgba(255,255,255,.07)', padding:'0 5%', display:'flex', alignItems:'center', justifyContent:'space-between', height:62 },
    tabs:    { display:'flex', gap:4, background:'rgba(255,255,255,.04)', borderRadius:10, padding:4 },
    tab:     (active) => ({ background: active?'#e50914':'transparent', color: active?'#fff':'#888', padding:'8px 18px', borderRadius:7, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:'Poppins,sans-serif', transition:'all .18s' }),
    grid4:   { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:28 },
    stat:    { textAlign:'center' },
    table:   { width:'100%', borderCollapse:'collapse' },
    th:      { textAlign:'left', padding:'10px 14px', fontSize:12, fontWeight:600, letterSpacing:1, textTransform:'uppercase', color:'#666', borderBottom:'1px solid rgba(255,255,255,.07)' },
    td:      { padding:'12px 14px', fontSize:13, borderBottom:'1px solid rgba(255,255,255,.05)', verticalAlign:'middle' },
    overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:20 },
    modal:   { background:'#14141e', border:'1px solid rgba(255,255,255,.12)', borderRadius:18, padding:28, width:'100%', maxWidth:600, maxHeight:'90vh', overflowY:'auto' },
  };

  return (
    <div style={S.page}>
      {/* TOP BAR */}
      <div style={S.topbar}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:22 }}>🎬</span>
          <span style={{ fontWeight:700, fontSize:17 }}>Movie<strong style={{ color:'#e50914' }}>Time</strong> <span style={{ color:'#888', fontWeight:400, fontSize:13 }}>Admin</span></span>
        </div>
        <div style={S.tabs}>
          {TABS.map(t => <button key={t} style={S.tab(tab===t)} onClick={() => setTab(t)}>{t}</button>)}
        </div>
        <a href="/" style={{ color:'#888', fontSize:13, textDecoration:'none' }}>← Back to Site</a>
      </div>

      {/* FLASH MSG */}
      {msg && <div style={{ background: msg.startsWith('❌')?'rgba(229,9,20,.15)':'rgba(34,197,94,.15)', border:`1px solid ${msg.startsWith('❌')?'rgba(229,9,20,.3)':'rgba(34,197,94,.3)'}`, color: msg.startsWith('❌')?'#ff8080':'#4ade80', padding:'11px 5%', fontSize:13, fontWeight:500 }}>{msg}</div>}

      <div style={{ padding:'32px 5%' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'Dashboard' && stats && (
          <div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, marginBottom:28 }}>Dashboard Overview</h2>
            <div style={S.grid4}>
              {[['🎬','Movies',stats.movies,'#e50914'],['🎟','Bookings',stats.bookings,'#f5c518'],['✅','Confirmed',stats.confirmed,'#22c55e'],['👥','Users',stats.users,'#3b82f6'],['📬','Messages',stats.contacts,'#a855f7'],['💰','Revenue',`₹${stats.revenue}`,'#f5c518']].map(([icon,label,val,color]) => (
                <Card key={label}>
                  <div style={S.stat}>
                    <div style={{ fontSize:30, marginBottom:8 }}>{icon}</div>
                    <div style={{ fontSize:26, fontWeight:800, color, marginBottom:4 }}>{val}</div>
                    <div style={{ color:'#888', fontSize:12, fontWeight:500, textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent bookings */}
            <Card>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18 }}>Recent Bookings</h3>
              <table style={S.table}>
                <thead><tr>{['Movie','Theatre','Seats','Amount','Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {stats.recent_bookings?.map(b => (
                    <tr key={b._id}>
                      <td style={S.td}><strong>{b.movie_title}</strong></td>
                      <td style={{ ...S.td, color:'#888' }}>{b.theatre}</td>
                      <td style={S.td}>{b.seats?.join(', ')}</td>
                      <td style={{ ...S.td, color:'#f5c518', fontWeight:700 }}>₹{b.total_amount}</td>
                      <td style={S.td}><span style={{ background: b.status==='confirmed'?'rgba(34,197,94,.15)':'rgba(239,68,68,.15)', color: b.status==='confirmed'?'#4ade80':'#f87171', border:`1px solid ${b.status==='confirmed'?'rgba(34,197,94,.3)':'rgba(239,68,68,.3)'}`, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── MOVIES ── */}
        {tab === 'Movies' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700 }}>Manage Movies</h2>
              <Btn onClick={openAdd}>+ Add New Movie</Btn>
            </div>
            <Card style={{ padding:0, overflow:'hidden' }}>
              <table style={S.table}>
                <thead><tr>{['Poster','Title','Language','Genre','Price','IMDB','Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {movies.map(m => (
                    <tr key={m._id}>
                      <td style={S.td}><img src={m.image} alt="" style={{ width:40, height:55, objectFit:'cover', borderRadius:6 }} onError={e => e.target.src='/images/black.jpg'} /></td>
                      <td style={S.td}><strong style={{ fontSize:14 }}>{m.title}</strong>{m.tag && <span style={{ marginLeft:8, background:'rgba(229,9,20,.15)', color:'#ff6b6b', border:'1px solid rgba(229,9,20,.3)', padding:'2px 8px', borderRadius:20, fontSize:11 }}>{m.tag}</span>}</td>
                      <td style={{ ...S.td, color:'#888' }}>{m.language}</td>
                      <td style={{ ...S.td, color:'#888' }}>{m.genre}</td>
                      <td style={{ ...S.td, color:'#f5c518', fontWeight:700 }}>₹{m.price}</td>
                      <td style={S.td}><span style={{ color:'#f5c518' }}>★</span> {m.imdb}</td>
                      <td style={S.td}>
                        <div style={{ display:'flex', gap:7 }}>
                          <Btn onClick={() => openEdit(m)} color='#1e40af' style={{ padding:'6px 14px', fontSize:12 }}>Edit</Btn>
                          <Btn onClick={() => deleteMovie(m._id, m.title)} color='#7f1d1d' style={{ padding:'6px 14px', fontSize:12 }}>Delete</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {tab === 'Bookings' && (
          <div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, marginBottom:24 }}>All Bookings</h2>
            <Card style={{ padding:0, overflow:'hidden' }}>
              <table style={S.table}>
                <thead><tr>{['Movie','User','Theatre','Time','Seats','Amount','Status','Date'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td style={S.td}><strong>{b.movie_title}</strong></td>
                      <td style={{ ...S.td, color:'#888' }}>{b.user_name}</td>
                      <td style={{ ...S.td, color:'#888', fontSize:12 }}>{b.theatre}</td>
                      <td style={{ ...S.td, color:'#888' }}>{b.show_time}</td>
                      <td style={S.td}>{b.seats?.join(', ')}</td>
                      <td style={{ ...S.td, color:'#f5c518', fontWeight:700 }}>₹{b.total_amount}</td>
                      <td style={S.td}><span style={{ background: b.status==='confirmed'?'rgba(34,197,94,.15)':'rgba(239,68,68,.15)', color: b.status==='confirmed'?'#4ade80':'#f87171', border:`1px solid ${b.status==='confirmed'?'rgba(34,197,94,.3)':'rgba(239,68,68,.3)'}`, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>{b.status}</span></td>
                      <td style={{ ...S.td, color:'#888', fontSize:11 }}>{b.booked_at?.slice(0,10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── CONTACTS ── */}
        {tab === 'Contacts' && (
          <div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, marginBottom:24 }}>Contact Messages</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {contacts.map(c => (
                <Card key={c._id} style={{ borderColor: c.resolved ? 'rgba(34,197,94,.2)' : 'rgba(255,255,255,.08)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                        <strong style={{ fontSize:15 }}>{c.name}</strong>
                        <span style={{ color:'#888', fontSize:13 }}>{c.email}</span>
                        {c.booking_id && <span style={{ background:'rgba(245,197,24,.1)', color:'#f5c518', border:'1px solid rgba(245,197,24,.2)', padding:'2px 8px', borderRadius:6, fontSize:11 }}>ID: {c.booking_id}</span>}
                      </div>
                      {c.subject && <p style={{ color:'#e50914', fontSize:13, fontWeight:600, marginBottom:6 }}>{c.subject}</p>}
                      <p style={{ color:'#ccc', fontSize:13, lineHeight:1.6 }}>{c.message}</p>
                      <p style={{ color:'#555', fontSize:11, marginTop:8 }}>{c.submitted_at?.slice(0,16).replace('T',' ')}</p>
                    </div>
                    <div>
                      {c.resolved
                        ? <span style={{ background:'rgba(34,197,94,.15)', color:'#4ade80', border:'1px solid rgba(34,197,94,.3)', padding:'5px 14px', borderRadius:8, fontSize:12, fontWeight:600 }}>✓ Resolved</span>
                        : <Btn onClick={() => resolveContact(c._id)} color='#065f46' style={{ fontSize:12 }}>Mark Resolved</Btn>
                      }
                    </div>
                  </div>
                </Card>
              ))}
              {contacts.length === 0 && <p style={{ color:'#888', textAlign:'center', padding:'40px 0' }}>No messages yet.</p>}
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'Users' && (
          <div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, marginBottom:24 }}>Registered Users</h2>
            <Card style={{ padding:0, overflow:'hidden' }}>
              <table style={S.table}>
                <thead><tr>{['Name','Email','Phone','Joined'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={S.td}><div style={{ display:'flex', alignItems:'center', gap:10 }}><div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#e50914,#7f1d1d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>{u.name?.[0]?.toUpperCase()}</div><strong>{u.name}</strong></div></td>
                      <td style={{ ...S.td, color:'#888' }}>{u.email}</td>
                      <td style={{ ...S.td, color:'#888' }}>{u.phone || '—'}</td>
                      <td style={{ ...S.td, color:'#888', fontSize:12 }}>{u.created_at?.slice(0,10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p style={{ color:'#888', textAlign:'center', padding:'40px 0' }}>No users yet.</p>}
            </Card>
          </div>
        )}
      </div>

      {/* ── ADD / EDIT MOVIE MODAL ── */}
      {showForm && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={S.modal}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700 }}>{editId ? 'Edit Movie' : 'Add New Movie'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', color:'#888', fontSize:22, cursor:'pointer' }}>✕</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <Input label="Title"    value={form.title}    onChange={upd('title')}    placeholder="Movie title"   required />
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, color:'#888', fontWeight:500 }}>Language *</label>
                <select value={form.language} onChange={upd('language')} style={{ background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:9, padding:'10px 13px', color:'#f1f1f1', fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none' }}>
                  {['Tamil','Telugu','Hindi','English','Malayalam'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, color:'#888', fontWeight:500 }}>Genre *</label>
                <select value={form.genre} onChange={upd('genre')} style={{ background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:9, padding:'10px 13px', color:'#f1f1f1', fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none' }}>
                  {['Action','Romance','Drama','Thriller','War / Drama','Fantasy','Comedy','Horror'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <Input label="Duration" value={form.duration} onChange={upd('duration')} placeholder="2h 30m"      required />
              <Input label="Price (₹)" value={form.price}   onChange={upd('price')}   placeholder="200"          required />
              <Input label="IMDB Rating" value={form.imdb}  onChange={upd('imdb')}    placeholder="7.5" />
              <Input label="Director"  value={form.director} onChange={upd('director')} placeholder="Director name" />
              <Input label="Tag"       value={form.tag}     onChange={upd('tag')}      placeholder="Hit / Blockbuster / Advance Booking" />
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, color:'#888', fontWeight:500 }}>Type</label>
                <select value={form.type} onChange={upd('type')} style={{ background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:9, padding:'10px 13px', color:'#f1f1f1', fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none' }}>
                  {['2D','3D','IMAX','4DX'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, color:'#888', fontWeight:500 }}>Rating</label>
                <select value={form.rating} onChange={upd('rating')} style={{ background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:9, padding:'10px 13px', color:'#f1f1f1', fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none' }}>
                  {['U','UA','A'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14, marginTop:14 }}>
              <Input label="Cast (comma separated)" value={form.cast} onChange={upd('cast')} placeholder="Actor 1, Actor 2, Actor 3" />
              <Input label="Poster Image Path" value={form.image} onChange={upd('image')} placeholder="/images/yourposter.jpg" />
              <Input label="Background Image Path" value={form.bg_image} onChange={upd('bg_image')} placeholder="/images/yourposter.jpg" />
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, color:'#888', fontWeight:500 }}>Description</label>
                <textarea value={form.desc} onChange={upd('desc')} rows={3} placeholder="Movie description…"
                  style={{ background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:9, padding:'10px 13px', color:'#f1f1f1', fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none', resize:'vertical' }} />
              </div>
            </div>

            <div style={{ display:'flex', gap:12, marginTop:22, justifyContent:'flex-end' }}>
              <Btn onClick={() => setShowForm(false)} color='#374151'>Cancel</Btn>
              <Btn onClick={saveMovie} color='#e50914' style={{ minWidth:120, justifyContent:'center' }}>
                {loading ? '⏳ Saving…' : editId ? '💾 Update Movie' : '➕ Add Movie'}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
