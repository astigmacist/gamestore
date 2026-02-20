import { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating = 0, onRate, readOnly = false, size = 'normal' }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className={`star-rating ${size}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${star <= (hover || Math.round(rating)) ? 'filled' : ''} ${readOnly ? 'readonly' : ''}`}
                    onClick={() => !readOnly && onRate && onRate(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                >
                    ★
                </span>
            ))}
            {!readOnly && rating > 0 && (
                <span className="rating-value">{rating.toFixed(1)}</span>
            )}
        </div>
    );
};

export default StarRating;
