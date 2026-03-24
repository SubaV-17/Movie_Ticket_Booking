import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import './Auth.css';

function AuthCard({ title, subtitle, children, bottom }) {
  return (
    <div className="auth-bg">
      <div className="auth-card afu">
        <div style={{ textAlign:'center', marginBottom:26 }}>
          <div style={{ fontSize:38, marginBottom:10 }}>🎬</div>
          <h2 style={{ fontSize:22, fontWeight:600 }}>Movie<strong style={{ color:'var(--red)' }}>Time</strong></h2>
          <p style={{ color:'var(--muted)', fontSize:13, marginTop:5 }}>{subtitle}</p>
        </div>
        {children}
        <p style={{ textAlign:'center', color:'var(--muted)', fontSize:13, marginTop:20 }}>{bottom}</p>
      </div>
    </div>
  );
}

export function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (!email || !password) { setError('Please fill all fields.'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/login/', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }));
      nav('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Login failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <AuthCard subtitle="Welcome back! Sign in to continue."
      bottom={<>New here? <Link to="/register" style={{ color:'var(--red)', fontWeight:600, textDecoration:'none' }}>Create account</Link></>}>
      {error && <div className="err-box">{error}</div>}
      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:15 }}>
        <div>
          <label className="auth-lbl">Email</label>
          <input className="fi" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" required />
        </div>
        <div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <label className="auth-lbl">Password</label>
            <a href="#" style={{ fontSize:12, color:'var(--red)', textDecoration:'none' }}>Forgot?</a>
          </div>
          <input className="fi" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <button type="submit" className="btn btn-red" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:15, borderRadius:12, marginTop:4 }} disabled={loading}>
          {loading ? <><span className="spin" /> Signing in…</> : 'Login →'}
        </button>
      </form>
    </AuthCard>
  );
}

export function Register() {
  const [form, setForm]     = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState('');
  const nav = useNavigate();
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return; }
    setLoad(true);
    try {
      const res = await API.post('/auth/register/', { name: form.name, email: form.email, phone: form.phone, password: form.password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }));
      nav('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed.');
      setLoad(false);
    }
  };

  return (
    <AuthCard subtitle="Create your account and start booking."
      bottom={<>Already have an account? <Link to="/login" style={{ color:'var(--red)', fontWeight:600, textDecoration:'none' }}>Login</Link></>}>
      {error && <div className="err-box">{error}</div>}
      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {[['name','Full Name','text','Your name'],['email','Email','email','you@email.com'],['phone','Phone','tel','+91 98765 43210']].map(([k,l,t,ph]) => (
          <div key={k}>
            <label className="auth-lbl">{l}</label>
            <input className="fi" type={t} value={form[k]} onChange={upd(k)} placeholder={ph} required={k!=='phone'} />
          </div>
        ))}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div><label className="auth-lbl">Password</label><input className="fi" type="password" value={form.password} onChange={upd('password')} placeholder="Min 6 chars" required /></div>
          <div><label className="auth-lbl">Confirm</label><input className="fi" type="password" value={form.confirm} onChange={upd('confirm')} placeholder="Repeat" required /></div>
        </div>
        <button type="submit" className="btn btn-red" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:15, borderRadius:12 }} disabled={loading}>
          {loading ? <><span className="spin" /> Creating…</> : 'Create Account →'}
        </button>
      </form>
    </AuthCard>
  );
}
