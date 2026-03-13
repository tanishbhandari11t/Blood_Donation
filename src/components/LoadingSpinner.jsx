import './LoadingSpinner.css';

export default function LoadingSpinner() {
    return (
        <div className="loading" id="loading-spinner">
            <div className="loading__container">
                <div className="loading__blood-drop">
                    <div className="loading__drop-shape">🩸</div>
                    <div className="loading__ripple"></div>
                    <div className="loading__ripple loading__ripple--delayed"></div>
                </div>
                <p className="loading__text">Finding donors near you</p>
                <div className="loading__dots">
                    <span className="loading__dot"></span>
                    <span className="loading__dot"></span>
                    <span className="loading__dot"></span>
                </div>
            </div>
        </div>
    );
}
