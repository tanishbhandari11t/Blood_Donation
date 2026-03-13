import { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import DonorCard from './components/DonorCard';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import RegisterModal from './components/RegisterModal';
import GlobalMap from './components/GlobalMap';
import './App.css';

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

function mapUserToDonor(user, index) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.address?.city || 'Unknown',
    bloodGroup: BLOOD_GROUPS[index % BLOOD_GROUPS.length],
    available: index % 3 !== 0, // ~66% availability
  };
}

export default function App() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchCity, setSearchCity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showRegister, setShowRegister] = useState(false);

  // Handle new donor registration
  const handleRegister = (newDonor) => {
    setDonors((prev) => {
      // Save just the user-created donors to local storage to persist
      const customDonors = JSON.parse(localStorage.getItem('customDonors') || '[]');
      localStorage.setItem('customDonors', JSON.stringify([newDonor, ...customDonors]));
      return [newDonor, ...prev];
    });
  };

  // Fetch donor data on mount
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch donors');
        const users = await response.json();
        const mapped = users.map(mapUserToDonor);

        // Load custom registered donors from localStorage and merge at the top
        const savedDonors = JSON.parse(localStorage.getItem('customDonors') || '[]');
        setDonors([...savedDonors, ...mapped]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Simulate a slight loading delay for UX
    const timer = setTimeout(fetchDonors, 800);
    return () => clearTimeout(timer);
  }, []);

  // Derived filtered & sorted donors
  const filteredDonors = useMemo(() => {
    let result = [...donors];

    // Filter by blood group
    if (selectedGroup !== 'All') {
      result = result.filter((d) => d.bloodGroup === selectedGroup);
    }

    // Filter by city search
    if (searchCity.trim()) {
      const query = searchCity.toLowerCase().trim();
      result = result.filter((d) => d.city.toLowerCase().includes(query));
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'city':
        result.sort((a, b) => a.city.localeCompare(b.city));
        break;
      case 'availability':
        result.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [donors, selectedGroup, searchCity, sortBy]);

  const availableDonors = useMemo(
    () => filteredDonors.filter((d) => d.available).length,
    [filteredDonors]
  );

  const totalAvailable = useMemo(
    () => donors.filter((d) => d.available).length,
    [donors]
  );

  return (
    <div className="app">
      <Navbar onBeADonor={() => setShowRegister(true)} />
      <Hero totalDonors={donors.length} availableDonors={totalAvailable} />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={handleRegister}
      />

      <main className="main" id="main-content">
        <FilterBar
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          searchCity={searchCity}
          onSearchCity={setSearchCity}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availableCount={availableDonors}
        />

        <section className="donors-section" id="donors-grid-section">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-state" id="error-state">
              <div className="error-state__icon">⚠️</div>
              <h3 className="error-state__title">Connection Error</h3>
              <p className="error-state__message">{error}</p>
              <button
                className="error-state__retry"
                onClick={() => window.location.reload()}
                id="retry-btn"
              >
                Try Again
              </button>
            </div>
          ) : filteredDonors.length === 0 ? (
            <EmptyState searchCity={searchCity} selectedGroup={selectedGroup} />
          ) : (
            <div className="donors-grid" id="donors-grid">
              {filteredDonors.map((donor, index) => (
                <DonorCard key={donor.id} donor={donor} index={index} />
              ))}
            </div>
          )}
        </section>

        <GlobalMap />
      </main>

      <footer className="footer" id="footer">
        <div className="footer__container">
          <div className="footer__brand">
            <span className="footer__logo">🩸 PULSE<span className="footer__logo-accent">PACT</span></span>
            <p className="footer__tagline">Connecting donors. Saving lives.</p>
          </div>
          <div className="footer__info">
            <p className="footer__copyright">© 2026 PulsePact. All rights reserved.</p>
            <p className="footer__note">Every drop of blood donated is a life saved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
