import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const loc  = useLocation();
  const nav  = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [loc]);

  const logout = () => { localStorage.clear(); nav('/login'); };
  const a = (p) => loc.pathname === p ? 'active' : '';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="nav-logo">🎬 Movie<strong>Time</strong></Link>

        <ul className="nav-links" style={{ display: open ? 'flex' : '' }}>
          <li><Link to="/"           className={a('/')}>Home</Link></li>
          <li><Link to="/movies"     className={a('/movies')}>Movies</Link></li>
          <li><Link to="/contact"    className={a('/contact')}>Contact</Link></li>
          {user && <li><Link to="/bookings" className={a('/bookings')}>My Bookings</Link></li>}
        </ul>

        <div className="nav-auth">
          {user ? (
            <div className="nav-user" onClick={logout} title="Click to logout">
              <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <span style={{ fontSize:14, fontWeight:500 }}>{user.name}</span>
              <span style={{ color:'var(--muted)', fontSize:12 }}>▾</span>
            </div>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost" style={{ padding:'8px 18px', fontSize:13 }}>Login</Link>
              <Link to="/register" className="btn btn-red"   style={{ padding:'8px 18px', fontSize:13 }}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(o => !o)} style={{ display:'none', background:'none', border:'none', color:'#fff', fontSize:22, cursor:'pointer' }} id="ham">☰</button>
      </div>

      {/* Mobile */}
      {open && (
        <div style={{ background:'rgba(10,10,15,.97)', padding:'16px 5%', borderTop:'1px solid var(--border)' }}>
          {[['/', 'Home'], ['/movies','Movies'], ['/contact','Contact']].map(([p,l]) => (
            <Link key={p} to={p} style={{ display:'block', padding:'12px 0', color:'rgba(255,255,255,.8)', textDecoration:'none', fontSize:15, borderBottom:'1px solid var(--border)' }}>{l}</Link>
          ))}
          {user ? <button onClick={logout} style={{ marginTop:12, background:'var(--red)', color:'#fff', border:'none', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontFamily:'Poppins,sans-serif' }}>Logout</button>
                : <Link to="/login" style={{ display:'inline-block', marginTop:12, color:'var(--red)', textDecoration:'none', fontWeight:600 }}>Login / Sign Up</Link>}
        </div>
      )}
    </nav>
  );
};

export const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <div className="footer-logo">🎬 Movie<strong>Time</strong></div>
        <p>Your premium cinema booking experience.<br />Kodambakkam, Chennai – 600024</p>
      </div>
      <div className="footer-col">
        <h4>Navigate</h4>
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/bookings">My Bookings</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footer-col">
        <h4>Support</h4>
        <a href="mailto:support@movietime.in">support@movietime.in</a>
        <a href="tel:+919876543210">+91 98765 43210</a>
        <span>Mon–Fri: 9 AM – 7 PM</span>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 MovieTime. All rights reserved.</p>
      <a href="#">Privacy Policy</a>
    </div>
  </footer>
);
