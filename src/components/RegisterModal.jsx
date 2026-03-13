import { useState, useRef } from 'react';
import './RegisterModal.css';

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

const VERIFIED_BANKS = [
    { id: 1, name: 'Red Cross Blood Bank', city: 'New York', state: 'NY' },
    { id: 2, name: 'LifeStream Blood Bank', city: 'Los Angeles', state: 'CA' },
    { id: 3, name: 'Central Blood Bank', city: 'Chicago', state: 'IL' },
    { id: 4, name: 'City Hospital Blood Center', city: 'Houston', state: 'TX' },
    { id: 5, name: 'Metro Blood Bank', city: 'Phoenix', state: 'AZ' },
    { id: 6, name: 'Community Blood Services', city: 'Philadelphia', state: 'PA' },
    { id: 7, name: 'National Blood Transfusion Center', city: 'San Antonio', state: 'TX' },
    { id: 8, name: 'Regional Blood Bank', city: 'San Diego', state: 'CA' },
    { id: 9, name: 'Apollo Blood Bank', city: 'Mumbai', state: 'MH' },
    { id: 10, name: 'AIIMS Blood Bank', city: 'Delhi', state: 'DL' },
    { id: 11, name: 'Rotary Blood Bank', city: 'Delhi', state: 'DL' },
    { id: 12, name: 'Prathama Blood Centre', city: 'Ahmedabad', state: 'GJ' },
    { id: 13, name: 'Sankalp Blood Bank', city: 'Bangalore', state: 'KA' },
    { id: 14, name: 'Lions Blood Bank', city: 'Chennai', state: 'TN' },
    { id: 15, name: 'Government Blood Bank', city: 'Hyderabad', state: 'TS' },
    { id: 16, name: 'Sahyadri Blood Bank', city: 'Pune', state: 'MH' },
];

export default function RegisterModal({ isOpen, onClose, onRegister }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bloodGroup: '',
        city: '',
        selectedBank: null,
        fitnessCert: null,
        noDiseaseCert: null,
    });
    const [errors, setErrors] = useState({});
    const [bankSearch, setBankSearch] = useState('');
    const [bankNotFound, setBankNotFound] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const fitnessRef = useRef(null);
    const diseaseRef = useRef(null);

    if (!isOpen) return null;

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    // ===== Step 1: Validate General info =====
    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\d\-+() ]{7,15}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Please select your blood group';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ===== Step 2: Validate Blood Bank =====
    const filteredBanks = VERIFIED_BANKS.filter((bank) => {
        const query = bankSearch.toLowerCase().trim();
        if (!query) return true;
        return (
            bank.name.toLowerCase().includes(query) ||
            bank.city.toLowerCase().includes(query) ||
            bank.state.toLowerCase().includes(query)
        );
    });

    const handleBankSearch = () => {
        if (!formData.city.trim()) {
            setErrors({ city: 'Please enter your city' });
            return;
        }
        const cityQuery = formData.city.toLowerCase().trim();
        const found = VERIFIED_BANKS.some(
            (bank) => bank.city.toLowerCase().includes(cityQuery)
        );
        setBankNotFound(!found);
        setBankSearch(formData.city);
    };

    const validateStep2 = () => {
        if (!formData.selectedBank) {
            setErrors({ bank: 'Please select a verified blood bank' });
            return false;
        }
        return true;
    };

    // ===== Step 3: Validate Documents =====
    const handleFileChange = (field, file) => {
        if (file) {
            // Validate file type
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setErrors((prev) => ({ ...prev, [field]: 'Please upload PDF, JPG, or PNG files only' }));
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, [field]: 'File size must be under 5MB' }));
                return;
            }
            updateField(field, file);
        }
    };

    const validateStep3 = () => {
        const newErrors = {};
        if (!formData.fitnessCert) newErrors.fitnessCert = 'Fitness Certificate is required';
        if (!formData.noDiseaseCert) newErrors.noDiseaseCert = 'No-Disease Declaration is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ===== Navigation =====
    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
        else if (step === 3 && validateStep3()) setStep(4);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const initiateSubmit = () => {
        setShowConfirm(true);
    };

    const handleActualSubmit = () => {
        setShowConfirm(false);
        setIsSubmitting(true);
        setTimeout(() => {
            const newDonor = {
                id: Date.now(),
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bloodGroup: formData.bloodGroup,
                city: formData.selectedBank?.city || formData.city,
                available: true,
                bank: formData.selectedBank?.name,
                isRegistered: true,
            };
            onRegister(newDonor);
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    const handleCloseModal = () => {
        setStep(1);
        setFormData({
            name: '', email: '', phone: '', bloodGroup: '',
            city: '', selectedBank: null, fitnessCert: null, noDiseaseCert: null,
        });
        setErrors({});
        setBankSearch('');
        setBankNotFound(false);
        setSubmitted(false);
        setShowConfirm(false);
        onClose();
    };

    // ===== Success Screen =====
    if (submitted) {
        return (
            <div className="modal-overlay" onClick={handleCloseModal}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal__success">
                        <div className="modal__success-icon">🎉</div>
                        <h2 className="modal__success-title">Registration Complete!</h2>
                        <p className="modal__success-text">
                            Thank you, <strong>{formData.name}</strong>! You are now a registered blood donor.
                        </p>
                        <div className="modal__success-info">
                            <div className="modal__success-row">
                                <span>📛 Name</span>
                                <strong>{formData.name}</strong>
                            </div>
                            <div className="modal__success-row">
                                <span>📧 Email</span>
                                <strong>{formData.email}</strong>
                            </div>
                            <div className="modal__success-row">
                                <span>📱 Phone</span>
                                <strong>{formData.phone}</strong>
                            </div>
                            <div className="modal__success-row">
                                <span>🩸 Blood Group</span>
                                <strong>{formData.bloodGroup}</strong>
                            </div>
                            <div className="modal__success-row">
                                <span>🏥 Blood Bank</span>
                                <strong>{formData.selectedBank?.name}</strong>
                            </div>
                        </div>
                        <p className="modal__success-note">
                            Your profile is now visible to patients in need. Every drop counts! ❤️
                        </p>
                        <button className="modal__btn modal__btn--primary" onClick={handleCloseModal} id="close-success-btn">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()} id="register-modal">
                {/* Header */}
                <div className="modal__header">
                    <div className="modal__header-info">
                        <h2 className="modal__title">🩸 Be A Donor</h2>
                        <p className="modal__subtitle">Your blood can save someone's life today</p>
                    </div>
                    <button className="modal__close" onClick={handleCloseModal} id="modal-close-btn" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="modal__progress">
                    {[
                        { num: 1, label: 'Your Info' },
                        { num: 2, label: 'Blood Bank' },
                        { num: 3, label: 'Documents' },
                        { num: 4, label: 'Confirm' },
                    ].map((s) => (
                        <div key={s.num} className={`modal__progress-step ${step >= s.num ? 'modal__progress-step--active' : ''} ${step > s.num ? 'modal__progress-step--done' : ''}`}>
                            <div className="modal__progress-circle">
                                {step > s.num ? '✓' : s.num}
                            </div>
                            <span className="modal__progress-label">{s.label}</span>
                        </div>
                    ))}
                    <div className="modal__progress-bar">
                        <div className="modal__progress-fill" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="modal__body">
                    {/* ===== STEP 1: General Information ===== */}
                    {step === 1 && (
                        <div className="modal__step" key="step1">
                            <div className="modal__step-header">
                                <h3 className="modal__step-title">📋 General Information</h3>
                                <p className="modal__step-desc">Tell us about yourself. All fields are required.</p>
                            </div>

                            <div className="modal__fields">
                                <div className={`modal__field ${errors.name ? 'modal__field--error' : ''}`}>
                                    <label className="modal__label" htmlFor="reg-name">Full Name</label>
                                    <input
                                        id="reg-name"
                                        type="text"
                                        className="modal__input"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                    />
                                    {errors.name && <span className="modal__error">{errors.name}</span>}
                                </div>

                                <div className={`modal__field ${errors.email ? 'modal__field--error' : ''}`}>
                                    <label className="modal__label" htmlFor="reg-email">Email Address</label>
                                    <input
                                        id="reg-email"
                                        type="email"
                                        className="modal__input"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                    />
                                    {errors.email && <span className="modal__error">{errors.email}</span>}
                                </div>

                                <div className={`modal__field ${errors.phone ? 'modal__field--error' : ''}`}>
                                    <label className="modal__label" htmlFor="reg-phone">Phone Number</label>
                                    <input
                                        id="reg-phone"
                                        type="tel"
                                        className="modal__input"
                                        placeholder="+1 (234) 567-8900"
                                        value={formData.phone}
                                        onChange={(e) => updateField('phone', e.target.value)}
                                    />
                                    {errors.phone && <span className="modal__error">{errors.phone}</span>}
                                </div>

                                <div className={`modal__field ${errors.bloodGroup ? 'modal__field--error' : ''}`}>
                                    <label className="modal__label" htmlFor="reg-blood">Blood Group</label>
                                    <select
                                        id="reg-blood"
                                        className="modal__select"
                                        value={formData.bloodGroup}
                                        onChange={(e) => updateField('bloodGroup', e.target.value)}
                                    >
                                        <option value="">Select your blood group</option>
                                        {BLOOD_GROUPS.map((group) => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </select>
                                    {errors.bloodGroup && <span className="modal__error">{errors.bloodGroup}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== STEP 2: Nearest Blood Bank ===== */}
                    {step === 2 && (
                        <div className="modal__step" key="step2">
                            <div className="modal__step-header">
                                <h3 className="modal__step-title">🏥 Nearest Blood Bank</h3>
                                <p className="modal__step-desc">
                                    Enter your city to find verified blood banks nearby. You must register with a verified bank.
                                </p>
                            </div>

                            <div className="modal__fields">
                                <div className={`modal__field ${errors.city ? 'modal__field--error' : ''}`}>
                                    <label className="modal__label" htmlFor="reg-city">Your City</label>
                                    <div className="modal__search-row">
                                        <input
                                            id="reg-city"
                                            type="text"
                                            className="modal__input"
                                            placeholder="Enter your city name..."
                                            value={formData.city}
                                            onChange={(e) => {
                                                updateField('city', e.target.value);
                                                setBankNotFound(false);
                                            }}
                                        />
                                        <button className="modal__search-btn" onClick={handleBankSearch} id="search-bank-btn">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                            </svg>
                                            Search
                                        </button>
                                    </div>
                                    {errors.city && <span className="modal__error">{errors.city}</span>}
                                </div>

                                {bankNotFound && (
                                    <div className="modal__bank-warning">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                                        </svg>
                                        <div>
                                            <strong>No verified banks found in "{formData.city}"</strong>
                                            <p>Please choose from the nearest available banks listed below.</p>
                                        </div>
                                    </div>
                                )}

                                {bankSearch && (
                                    <div className="modal__field">
                                        <label className="modal__label">
                                            {bankNotFound ? 'All Verified Banks (choose nearest)' : `Verified Banks near "${bankSearch}"`}
                                        </label>
                                        <div className="modal__bank-list" id="bank-list">
                                            {(bankNotFound ? VERIFIED_BANKS : filteredBanks).map((bank) => (
                                                <div
                                                    key={bank.id}
                                                    className={`modal__bank-item ${formData.selectedBank?.id === bank.id ? 'modal__bank-item--selected' : ''}`}
                                                    onClick={() => {
                                                        updateField('selectedBank', bank);
                                                        setErrors((prev) => ({ ...prev, bank: '' }));
                                                    }}
                                                    id={`bank-${bank.id}`}
                                                >
                                                    <div className="modal__bank-radio">
                                                        {formData.selectedBank?.id === bank.id && (
                                                            <div className="modal__bank-radio-dot"></div>
                                                        )}
                                                    </div>
                                                    <div className="modal__bank-info">
                                                        <span className="modal__bank-name">{bank.name}</span>
                                                        <span className="modal__bank-location">📍 {bank.city}, {bank.state}</span>
                                                    </div>
                                                    {formData.selectedBank?.id === bank.id && (
                                                        <span className="modal__bank-check">✓</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {errors.bank && <span className="modal__error modal__error--standalone">{errors.bank}</span>}

                                {!bankSearch && (
                                    <div className="modal__hint">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                                        </svg>
                                        Enter your city and click "Search" to see verified blood banks in your area.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ===== STEP 3: Upload Documents ===== */}
                    {step === 3 && (
                        <div className="modal__step" key="step3">
                            <div className="modal__step-header">
                                <h3 className="modal__step-title">📄 Required Documents</h3>
                                <p className="modal__step-desc">
                                    Please upload the following documents from a certified hospital.
                                    Registration <strong>cannot be completed</strong> without both documents.
                                </p>
                            </div>

                            <div className="modal__fields">
                                {/* Fitness Certificate */}
                                <div className={`modal__upload ${errors.fitnessCert ? 'modal__upload--error' : ''} ${formData.fitnessCert ? 'modal__upload--done' : ''}`}>
                                    <div className="modal__upload-header">
                                        <div className="modal__upload-icon">
                                            {formData.fitnessCert ? '✅' : '🏋️'}
                                        </div>
                                        <div>
                                            <h4 className="modal__upload-title">Fitness Certificate</h4>
                                            <p className="modal__upload-desc">
                                                A certificate from a hospital confirming you are physically fit for blood donation.
                                            </p>
                                        </div>
                                    </div>

                                    <input
                                        ref={fitnessRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="modal__file-input"
                                        id="fitness-cert-input"
                                        onChange={(e) => handleFileChange('fitnessCert', e.target.files[0])}
                                    />

                                    {formData.fitnessCert ? (
                                        <div className="modal__upload-file">
                                            <span className="modal__upload-filename">📎 {formData.fitnessCert.name}</span>
                                            <button
                                                className="modal__upload-remove"
                                                onClick={() => {
                                                    updateField('fitnessCert', null);
                                                    if (fitnessRef.current) fitnessRef.current.value = '';
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="modal__upload-btn"
                                            onClick={() => fitnessRef.current?.click()}
                                            id="upload-fitness-btn"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                            </svg>
                                            Upload Certificate
                                        </button>
                                    )}
                                    {errors.fitnessCert && <span className="modal__error">{errors.fitnessCert}</span>}
                                </div>

                                {/* No-Disease Declaration */}
                                <div className={`modal__upload ${errors.noDiseaseCert ? 'modal__upload--error' : ''} ${formData.noDiseaseCert ? 'modal__upload--done' : ''}`}>
                                    <div className="modal__upload-header">
                                        <div className="modal__upload-icon">
                                            {formData.noDiseaseCert ? '✅' : '🛡️'}
                                        </div>
                                        <div>
                                            <h4 className="modal__upload-title">No-Disease Declaration</h4>
                                            <p className="modal__upload-desc">
                                                A medical declaration confirming you have no communicable diseases and are safe to donate blood.
                                            </p>
                                        </div>
                                    </div>

                                    <input
                                        ref={diseaseRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="modal__file-input"
                                        id="disease-cert-input"
                                        onChange={(e) => handleFileChange('noDiseaseCert', e.target.files[0])}
                                    />

                                    {formData.noDiseaseCert ? (
                                        <div className="modal__upload-file">
                                            <span className="modal__upload-filename">📎 {formData.noDiseaseCert.name}</span>
                                            <button
                                                className="modal__upload-remove"
                                                onClick={() => {
                                                    updateField('noDiseaseCert', null);
                                                    if (diseaseRef.current) diseaseRef.current.value = '';
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="modal__upload-btn"
                                            onClick={() => diseaseRef.current?.click()}
                                            id="upload-disease-btn"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                            </svg>
                                            Upload Declaration
                                        </button>
                                    )}
                                    {errors.noDiseaseCert && <span className="modal__error">{errors.noDiseaseCert}</span>}
                                </div>

                                <div className="modal__upload-note">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Accepted formats: PDF, JPG, PNG (max 5MB each). Your documents are kept secure and confidential.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== STEP 4: Confirmation ===== */}
                    {step === 4 && (
                        <div className="modal__step" key="step4">
                            <div className="modal__step-header">
                                <h3 className="modal__step-title">✅ Confirm & Register</h3>
                                <p className="modal__step-desc">
                                    Please review your details below. Once submitted, your <strong>Name</strong>, <strong>Email</strong>, and <strong>Phone</strong> will be listed publicly to help patients find you.
                                </p>
                            </div>

                            <div className="modal__review">
                                <div className="modal__review-section">
                                    <h4 className="modal__review-heading">Personal Information</h4>
                                    <div className="modal__review-grid">
                                        <div className="modal__review-item">
                                            <span className="modal__review-label">Name</span>
                                            <span className="modal__review-value">{formData.name}</span>
                                        </div>
                                        <div className="modal__review-item">
                                            <span className="modal__review-label">Email</span>
                                            <span className="modal__review-value">{formData.email}</span>
                                        </div>
                                        <div className="modal__review-item">
                                            <span className="modal__review-label">Phone</span>
                                            <span className="modal__review-value">{formData.phone}</span>
                                        </div>
                                        <div className="modal__review-item">
                                            <span className="modal__review-label">Blood Group</span>
                                            <span className="modal__review-value modal__review-value--blood">{formData.bloodGroup}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal__review-section">
                                    <h4 className="modal__review-heading">Blood Bank</h4>
                                    <div className="modal__review-bank">
                                        <span>🏥 {formData.selectedBank?.name}</span>
                                        <span>📍 {formData.selectedBank?.city}, {formData.selectedBank?.state}</span>
                                    </div>
                                </div>

                                <div className="modal__review-section">
                                    <h4 className="modal__review-heading">Uploaded Documents</h4>
                                    <div className="modal__review-docs">
                                        <div className="modal__review-doc">
                                            <span>✅ Fitness Certificate</span>
                                            <span className="modal__review-doc-name">{formData.fitnessCert?.name}</span>
                                        </div>
                                        <div className="modal__review-doc">
                                            <span>✅ No-Disease Declaration</span>
                                            <span className="modal__review-doc-name">{formData.noDiseaseCert?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal__review-notice">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                                    </svg>
                                    <p>
                                        By clicking "Register as Donor," you agree to make your <strong>Name, Email, and Phone Number</strong> publicly visible on PulsePact so patients in urgent need can reach you directly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="modal__footer">
                    {step > 1 && (
                        <button className="modal__btn modal__btn--back" onClick={handleBack} id="modal-back-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    )}
                    <div className="modal__footer-spacer"></div>
                    {step < 4 ? (
                        <button className="modal__btn modal__btn--primary" onClick={handleNext} id="modal-next-btn">
                            Continue
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            className={`modal__btn modal__btn--submit ${isSubmitting ? 'modal__btn--loading' : ''}`}
                            onClick={initiateSubmit}
                            disabled={isSubmitting}
                            id="modal-submit-btn"
                        >
                            {isSubmitting ? (
                                <><span className="modal__btn-spinner"></span> Registering...</>
                            ) : (
                                <>🩸 Register as Donor</>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Custom Confirm Dialog Overlay */}
            {showConfirm && (
                <div className="modal-overlay" style={{ zIndex: 3000 }} onClick={() => setShowConfirm(false)}>
                    <div className="modal modal--small" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', padding: 'var(--space-xl)', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>⚠️</div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: 'var(--space-md)' }}>Important Notice</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-xl)' }}>
                            Make sure all the documents are correct. They will be verified once again from your Chosen Blood Bank and any sort of wrong information can lead to a <strong>blacklist</strong>.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center' }}>
                            <button className="modal__btn modal__btn--back" onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="modal__btn modal__btn--primary" onClick={handleActualSubmit}>I Understand, Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
