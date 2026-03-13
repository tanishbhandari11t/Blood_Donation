import './FilterBar.css';

const BLOOD_GROUPS = ['All', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

export default function FilterBar({
    selectedGroup,
    onGroupChange,
    searchCity,
    onSearchCity,
    sortBy,
    onSortChange,
    availableCount,
}) {
    return (
        <div className="filter-bar" id="filter-bar">
            <div className="filter-bar__container">
                <div className="filter-bar__left">
                    <h2 className="filter-bar__title" id="donors">
                        <span className="filter-bar__title-icon">🔍</span>
                        Find Donors
                    </h2>
                    <div className="filter-bar__count" id="available-count">
                        <span className="filter-bar__count-number">{availableCount}</span>
                        <span className="filter-bar__count-label">available donors</span>
                    </div>
                </div>

                <div className="filter-bar__controls">
                    {/* Blood Group Dropdown */}
                    <div className="filter-bar__group">
                        <label className="filter-bar__label" htmlFor="blood-group-select">
                            Blood Group
                        </label>
                        <div className="filter-bar__select-wrapper">
                            <select
                                id="blood-group-select"
                                className="filter-bar__select"
                                value={selectedGroup}
                                onChange={(e) => onGroupChange(e.target.value)}
                            >
                                {BLOOD_GROUPS.map((group) => (
                                    <option key={group} value={group}>
                                        {group === 'All' ? '🩸 All Groups' : `🅰️ ${group}`}
                                    </option>
                                ))}
                            </select>
                            <svg className="filter-bar__select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>

                    {/* City Search */}
                    <div className="filter-bar__group">
                        <label className="filter-bar__label" htmlFor="city-search">
                            Search City
                        </label>
                        <div className="filter-bar__input-wrapper">
                            <svg className="filter-bar__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                id="city-search"
                                type="text"
                                className="filter-bar__input"
                                placeholder="Enter city name..."
                                value={searchCity}
                                onChange={(e) => onSearchCity(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="filter-bar__group">
                        <label className="filter-bar__label" htmlFor="sort-select">
                            Sort By
                        </label>
                        <div className="filter-bar__select-wrapper">
                            <select
                                id="sort-select"
                                className="filter-bar__select"
                                value={sortBy}
                                onChange={(e) => onSortChange(e.target.value)}
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="availability">Availability</option>
                                <option value="city">City (A-Z)</option>
                            </select>
                            <svg className="filter-bar__select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
