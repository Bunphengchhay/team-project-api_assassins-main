import React, { useState } from 'react';
import '../styles/upcomingmovie.css';
function UpcomingMovie({ images }){
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    if (index < images.length - 1) {
      setIndex(index + 1);
    }
  };

  const prevImage = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="carousel">
      <div className="carousel-images" style={{ transform: `translateX(${-index * 100}%)` }}>
        {images.map((image, i) => (
            <img key={i} src={image.image} alt={`Slide ${i}`} className="carousel-image" />
        ))}
      </div>
      {index > 0 && (
        <button onClick={prevImage} className="arrow left">
          &lt;
        </button>
      )}
      {index < images.length - 1 && (
        <button onClick={nextImage} className="arrow right">
          &gt;
        </button>
      )}
    </div>
  );
};

export default UpcomingMovie;
