import { useState } from 'react';
import { createPortal } from 'react-dom';
import './DonorCard.css';

export default function DonorCard({ donor, index }) {
    const [requested, setRequested] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [reqData, setReqData] = useState({ name: '', phone: '', email: '' });
    const [reqErrors, setReqErrors] = useState({});

    const handleRequestClick = () => {
        if (requested) return;
        setShowRequestForm(true);
    };

    const handleFormSubmit = () => {
        const errors = {};
        if (!reqData.name.trim()) errors.name = 'Required';
        if (!reqData.phone.trim()) errors.phone = 'Required';
        if (!reqData.email.trim()) errors.email = 'Required';

        if (Object.keys(errors).length > 0) {
            setReqErrors(errors);
            return;
        }

        setShowRequestForm(false);
        setIsAnimating(true);
        setTimeout(() => {
            setRequested(true);
            setIsAnimating(false);
            setShowSuccessMessage(true);
        }, 800);
    };

    const getBloodGroupColor = (group) => {
        const colors = {
            'A+': '#e63946', 'A−': '#d63384',
            'B+': '#ff6f3c', 'B−': '#fd7e14',
            'AB+': '#6f42c1', 'AB−': '#7950f2',
            'O+': '#2ed573', 'O−': '#20c997',
        };
        return colors[group] || '#e63946';
    };

    const bgColor = getBloodGroupColor(donor.bloodGroup);

    return (
        <div
            className={`donor-card ${!donor.available ? 'donor-card--unavailable' : ''} ${donor.isRegistered ? 'donor-card--registered' : ''}`}
            style={{ animationDelay: `${index * 0.08}s` }}
            id={`donor-card-${donor.id}`}
        >
            <div className="donor-card__glow" style={{ background: bgColor }}></div>

            {donor.isRegistered && (
                <div className="donor-card__new-badge">⭐ NEW DONOR</div>
            )}

            <div className="donor-card__header">
                <div className="donor-card__avatar" style={{ background: `linear-gradient(135deg, ${bgColor}, ${bgColor}88)` }}>
                    {donor.name.charAt(0)}
                </div>
                <div className="donor-card__info">
                    <h3 className="donor-card__name">{donor.name}</h3>
                    <p className="donor-card__city">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {donor.city}
                    </p>
                </div>
                <div className="donor-card__blood-badge" style={{ background: `${bgColor}20`, borderColor: `${bgColor}40`, color: bgColor }}>
                    {donor.bloodGroup}
                </div>
            </div>

            <div className="donor-card__details">
                <div className="donor-card__detail">
                    <span className="donor-card__detail-label">Phone</span>
                    <span className="donor-card__detail-value">{donor.phone}</span>
                </div>
                <div className="donor-card__detail">
                    <span className="donor-card__detail-label">Email</span>
                    <span className="donor-card__detail-value donor-card__detail-email">{donor.email}</span>
                </div>
                {donor.bank && (
                    <div className="donor-card__detail">
                        <span className="donor-card__detail-label">Blood Bank</span>
                        <span className="donor-card__detail-value">🏥 {donor.bank}</span>
                    </div>
                )}
            </div>

            {donor.isRegistered && (
                <div className="donor-card__verified">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Verified &amp; Documented
                </div>
            )}

            <div className="donor-card__footer">
                <div className={`donor-card__availability ${donor.available ? 'donor-card__availability--active' : ''}`}>
                    <span className="donor-card__availability-dot"></span>
                    {donor.available ? 'Available' : 'Unavailable'}
                </div>

                <button
                    className={`donor-card__btn ${requested ? 'donor-card__btn--sent' : ''} ${isAnimating ? 'donor-card__btn--loading' : ''}`}
                    onClick={handleRequestClick}
                    disabled={!donor.available || requested}
                    id={`request-btn-${donor.id}`}
                >
                    {isAnimating ? (
                        <span className="donor-card__btn-spinner"></span>
                    ) : requested ? (
                        <>Request Sent ✅</>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72" />
                            </svg>
                            Request Help
                        </>
                    )}
                </button>
            </div>

            {showRequestForm && createPortal(
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.8)', padding: '20px'
                }} onClick={() => setShowRequestForm(false)}>
                    <div style={{
                        background: 'var(--color-bg-card)', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px',
                        border: '1px solid var(--color-border)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '15px'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'white', marginBottom: '5px' }}>Request Blood</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                            Please provide your details. This information will be securely shared with the donor and the selected hospital.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                            <input
                                type="text"
                                value={reqData.name}
                                onChange={e => setReqData({ ...reqData, name: e.target.value })}
                                style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-surface)', border: `1px solid ${reqErrors.name ? 'var(--color-red-primary)' : 'var(--color-border)'}`, color: 'white' }}
                                placeholder="Patient or Requester Name"
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
                            <input
                                type="tel"
                                value={reqData.phone}
                                onChange={e => setReqData({ ...reqData, phone: e.target.value })}
                                style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-surface)', border: `1px solid ${reqErrors.phone ? 'var(--color-red-primary)' : 'var(--color-border)'}`, color: 'white' }}
                                placeholder="Emergency Contact Number"
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                            <input
                                type="email"
                                value={reqData.email}
                                onChange={e => setReqData({ ...reqData, email: e.target.value })}
                                style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-surface)', border: `1px solid ${reqErrors.email ? 'var(--color-red-primary)' : 'var(--color-border)'}`, color: 'white' }}
                                placeholder="Your Email"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button style={{
                                flex: 1, padding: '12px', background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                            }} onClick={() => setShowRequestForm(false)}>Cancel</button>

                            <button style={{
                                flex: 1, padding: '12px', background: 'linear-gradient(135deg, var(--color-red-primary), var(--color-accent-crimson))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                            }} onClick={handleFormSubmit}>Send Request</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showSuccessMessage && createPortal(
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.8)', padding: '20px'
                }} onClick={() => setShowSuccessMessage(false)}>
                    <div style={{
                        background: 'var(--color-bg-card)', padding: '30px', borderRadius: '15px', maxWidth: '400px',
                        border: '1px solid var(--color-success)', textAlign: 'center', boxShadow: '0 10px 40px rgba(46, 213, 115, 0.2)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: '3rem', margin: '0 auto 15px', display: 'flex', justifyContent: 'center' }}>
                            <div style={{ background: 'rgba(46, 213, 115, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'white', marginBottom: '10px' }}>Request Dispatched</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>
                            Your details (<strong>{reqData.name}</strong>) have been securely shared with the hospital and an urgent notification was sent to <strong>{donor.name}</strong>.
                        </p>
                        <button style={{
                            padding: '12px 30px', background: 'var(--color-success)', color: 'white', border: 'none',
                            borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s'
                        }} onClick={() => setShowSuccessMessage(false)}>
                            Understood
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
