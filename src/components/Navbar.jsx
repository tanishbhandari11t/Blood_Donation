import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ onBeADonor }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
            <div className="navbar__container">
                <a href="#" className="navbar__logo" id="logo-link">
                    <span className="navbar__logo-icon">🩸</span>
                    <span className="navbar__logo-text">
                        PULSE<span className="navbar__logo-accent">PACT</span>
                    </span>
                </a>
                <div className="navbar__links">
                    <a href="#hero" className="navbar__link" id="nav-home">Home</a>
                    <a href="#donors" className="navbar__link" id="nav-donors">Find Donor</a>
                    <a href="#stats" className="navbar__link" id="nav-stats">Statistics</a>
                </div>
                <div className="navbar__actions">
                    <button className="navbar__donor-btn" onClick={onBeADonor} id="be-a-donor-btn">
                        <span className="navbar__donor-btn-pulse"></span>
                        <span className="navbar__donor-btn-icon">❤️</span>
                        BE A DONOR
                    </button>
                </div>
            </div>
        </nav>
    );
}
