import './EmptyState.css';

export default function EmptyState({ searchCity, selectedGroup }) {
    return (
        <div className="empty-state" id="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h3 className="empty-state__title">No Donors Found</h3>
            <p className="empty-state__description">
                {searchCity && selectedGroup !== 'All' ? (
                    <>No donors found for blood group <strong>{selectedGroup}</strong> in <strong>{searchCity}</strong>.</>
                ) : searchCity ? (
                    <>No donors found in <strong>{searchCity}</strong>. Try a different city.</>
                ) : selectedGroup !== 'All' ? (
                    <>No donors found for blood group <strong>{selectedGroup}</strong>. Try a different group.</>
                ) : (
                    <>No donors available at the moment. Please try again later.</>
                )}
            </p>
            <div className="empty-state__suggestions">
                <p className="empty-state__suggestion-title">Try:</p>
                <ul className="empty-state__list">
                    <li>Clearing your search filters</li>
                    <li>Selecting "All Groups" from the dropdown</li>
                    <li>Searching for a different city</li>
                </ul>
            </div>
        </div>
    );
}
