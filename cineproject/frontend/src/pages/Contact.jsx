import React, { useState } from 'react';
import { Footer } from '../components/Layout';

export default function Contact() {
  const [form, setForm]     = useState({ name:'', email:'', booking_id:'', subject:'', message:'' });
  const [loading, setLoad]  = useState(false);
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError('');
    setLoad(true);
    try {
      const { default: API } = await import('../api');
      await API.post('/contact/', form);
      setSent(true);
    } catch(e) {
      setError(e.response?.data?.error || 'Failed to send. Try again.');
      setLoad(false);
    }
  };

  return (
    <div>
      {/* Banner */}
      <div style={{ position:'relative', height:300, background:`url(/images/theatre.jpg) center/cover`, display:'flex', alignItems:'flex-end' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg,rgba(10,10,15,1) 0%,rgba(10,10,15,.5) 65%)' }} />
        <div style={{ position:'relative', zIndex:1, padding:'36px 5%' }}>
          <span style={{ color:'var(--red)', fontSize:12, fontWeight:700, letterSpacing:3, textTransform:'uppercase', display:'block', marginBottom:8 }}>Support</span>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4.5vw,48px)', fontWeight:700, marginBottom:6 }}>Contact Us</h1>
          <p style={{ color:'var(--muted)', fontSize:14 }}>Having a booking issue? We reply within 2 hours.</p>
        </div>
      </div>

      <div style={{ padding:'52px 5%' }}>
        {/* Info cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:16, marginBottom:48 }}>
          {[['📧','Email','support@movietime.in'],['📞','Phone','+91 98765 43210'],['💬','Live Chat','9 AM – 11 PM'],['📍','Office','Kodambakkam, Chennai']].map(([icon,lbl,val]) => (
            <div key={lbl} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'22px 16px', textAlign:'center', transition:'all .3s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(229,9,20,.4)';e.currentTarget.style.transform='translateY(-3px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)'}}>
              <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
              <p style={{ color:'var(--muted)', fontSize:11, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>{lbl}</p>
              <p style={{ fontWeight:600, fontSize:13 }}>{val}</p>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:26, alignItems:'start', maxWidth:900, margin:'0 auto' }}>
          {/* Form */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:28 }}>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, marginBottom:22 }}>Send a Message</h2>
            {sent ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:52, marginBottom:14 }}>✅</div>
                <h3 style={{ fontSize:20, marginBottom:8 }}>Message Sent!</h3>
                <p style={{ color:'var(--muted)', fontSize:14 }}>We'll reply to <strong>{form.email}</strong> within 2 hours.</p>
                <button className="btn btn-red" style={{ marginTop:20 }} onClick={() => { setSent(false); setForm({ name:'',email:'',booking_id:'',subject:'',message:'' }); }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:15 }}>
                {error && <div className="err-box">{error}</div>}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>Name *</label><input className="fi" value={form.name} onChange={upd('name')} placeholder="Your name" required /></div>
                  <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>Email *</label><input className="fi" type="email" value={form.email} onChange={upd('email')} placeholder="you@email.com" required /></div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>Booking ID</label><input className="fi" value={form.booking_id} onChange={upd('booking_id')} placeholder="Optional" /></div>
                  <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>Subject *</label>
                    <select className="fi" value={form.subject} onChange={upd('subject')} required>
                      <option value="">-- Select --</option>
                      {['Booking Issue','Payment Failed','Ticket Not Received','Cancellation / Refund','Other'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div><label style={{ fontSize:13, color:'var(--muted2)', display:'block', marginBottom:7 }}>Message *</label><textarea className="fi" rows={5} value={form.message} onChange={upd('message')} placeholder="Describe your issue…" required /></div>
                <button type="submit" className="btn btn-red" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:15, borderRadius:12 }} disabled={loading}>
                  {loading ? <><span className="spin" /> Sending…</> : 'Send Message →'}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>Quick FAQs</h3>
            {[['How do I cancel?','Go to My Bookings and tap Cancel. Refunds take 5–7 days.'],["Didn't get ticket email?",'Check spam first, then contact us with your Booking ID.'],['Can I change seats?','Seat changes are not allowed. Cancel and rebook.'],['Refund timeline?','5–7 business days to your original payment method.']].map(([q,a]) => (
              <details key={q} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, marginBottom:10, overflow:'hidden' }}>
                <summary style={{ padding:'13px 16px', fontSize:13, fontWeight:600, cursor:'pointer', listStyle:'none', display:'flex', justifyContent:'space-between' }}>{q}<span style={{ color:'var(--red)' }}>+</span></summary>
                <p style={{ padding:'0 16px 13px', color:'var(--muted)', fontSize:13, lineHeight:1.65 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
