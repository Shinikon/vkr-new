import React, { useState, useEffect, useCallback } from "react";
import slide1 from "../assets/img/slide1.svg";
import slide2 from "../assets/img/slide2.svg";
import slide3 from "../assets/img/slide3.svg";
import slide4 from "../assets/img/slide4.svg";
import slide5 from "../assets/img/slide5.svg";
import slide6 from "../assets/img/slide6.svg";

const CarouselSlider = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageKeys, setImageKeys] = useState({
    left: Date.now(),
    center: Date.now(),
    right: Date.now(),
  });

  const slides = [
    { id: 1, image: slide1 },
    { id: 2, image: slide2 },
    { id: 3, image: slide3 },
    { id: 4, image: slide4 },
    { id: 5, image: slide5 },
    { id: 6, image: slide6 },
  ];

  // Принудительное обновление ключей при смене слайда
  const refreshImageKeys = useCallback(() => {
    setImageKeys({
      left: Date.now(),
      center: Date.now(),
      right: Date.now(),
    });
  }, []);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    refreshImageKeys();
  }, [isAnimating, slides.length, refreshImageKeys]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % slides.length);
    refreshImageKeys();
  }, [isAnimating, slides.length, refreshImageKeys]);

  const goToSlide = useCallback(
    (index) => {
      if (isAnimating || index === activeIndex) return;
      setIsAnimating(true);
      setActiveIndex(index);
      refreshImageKeys();
    },
    [isAnimating, activeIndex, refreshImageKeys],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const getLeftIndex = (activeIndex - 1 + slides.length) % slides.length;
  const getRightIndex = (activeIndex + 1) % slides.length;

  return (
    <section className="carousel-section">
      <div className="container">
        <div className="carousel-wrapper">
          <div className="carousel-container">
            {/* Левый слайд */}
            <div className="carousel-slide left" onClick={handlePrev}>
              <div className="carousel-slide-image">
                <img
                  key={imageKeys.left}
                  src={slides[getLeftIndex].image}
                  alt={`Слайд ${getLeftIndex + 1}`}
                  draggable="false"
                />
              </div>
              <div className="carousel-overlay"></div>
            </div>

            {/* Центральный слайд */}
            <div className="carousel-slide center">
              <div className="carousel-slide-image">
                <img
                  key={imageKeys.center}
                  src={slides[activeIndex].image}
                  alt={`Слайд ${activeIndex + 1}`}
                  draggable="false"
                />
              </div>
            </div>

            {/* Правый слайд */}
            <div className="carousel-slide right" onClick={handleNext}>
              <div className="carousel-slide-image">
                <img
                  key={imageKeys.right}
                  src={slides[getRightIndex].image}
                  alt={`Слайд ${getRightIndex + 1}`}
                  draggable="false"
                />
              </div>
              <div className="carousel-overlay"></div>
            </div>
          </div>

          {/* Точки навигации */}
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarouselSlider;
