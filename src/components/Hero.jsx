import './Hero.css';
import heroBg from '../assets/images/hero_bg.jpg';
import cartoonImg from '../assets/images/blood_donation_cartoon.png';

export default function Hero({ totalDonors, availableDonors }) {
    return (
        <section className="hero" id="hero">
            <div className="hero__bg">
                <img src={heroBg} alt="" className="hero__bg-image" />
                <div className="hero__bg-overlay"></div>
            </div>

            <div className="hero__cartoon">
                <img src={cartoonImg} alt="Blood donation illustration" className="hero__cartoon-img" />
            </div>

            <div className="hero__content">
                <div className="hero__badge">
                    <span className="hero__badge-dot"></span>
                    Community Blood Donor Network
                </div>

                <h1 className="hero__title" id="main-heading">
                    <span className="hero__title-line">Find Blood</span>
                    <span className="hero__title-line hero__title-accent">Donors Fast</span>
                </h1>

                <p className="hero__subtitle">
                    Connect with verified blood donors in your community. Every drop counts, every second matters.
                </p>

                <div className="hero__stats">
                    <div className="hero__stat" id="stat-total">
                        <span className="hero__stat-number">{totalDonors}</span>
                        <span className="hero__stat-label">Total Donors</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat hero__stat--available" id="stat-available">
                        <span className="hero__stat-number">{availableDonors}</span>
                        <span className="hero__stat-label">Available Now</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat" id="stat-groups">
                        <span className="hero__stat-number">8</span>
                        <span className="hero__stat-label">Blood Groups</span>
                    </div>
                </div>

                <a href="#donors" className="hero__cta" id="cta-find-donor">
                    <span>Find a Donor</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>

            <div className="hero__scroll-indicator">
                <div className="hero__scroll-line"></div>
                <span>Scroll</span>
            </div>
        </section>
    );
}
