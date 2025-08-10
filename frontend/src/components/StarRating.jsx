import React from 'react';

const StarRating = ({ rating }) => {
    const totalStars = 5;
    const filledStars = Math.round(rating || 0);
    const starColor = '#FFD700'; // Gold color for stars
    const emptyStarColor = '#D3D3D3'; // Light gray for empty stars

    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
        stars.push(
            <span key={i} style={{ color: i <= filledStars ? starColor : emptyStarColor }}>
                ★
            </span>
        );
    }

    return <div className="flex items-center text-xl">{stars}</div>;
};

export default StarRating;