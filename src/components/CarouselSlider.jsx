import React, { useState, useEffect } from "react";
import slide1 from "../assets/img/slide1.svg";
import slide2 from "../assets/img/slide2.svg";
import slide3 from "../assets/img/slide3.svg";
import slide4 from "../assets/img/slide4.svg";
import slide5 from "../assets/img/slide5.svg";
import slide6 from "../assets/img/slide6.svg";

const CarouselSlider = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    { id: 1, image: slide1 },
    { id: 2, image: slide2 },
    { id: 3, image: slide3 },
    { id: 4, image: slide4 },
    { id: 5, image: slide5 },
    { id: 6, image: slide6 },
  ];

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const getLeftSlideIndex = () => {
    return (activeIndex - 1 + slides.length) % slides.length;
  };

  const getRightSlideIndex = () => {
    return (activeIndex + 1) % slides.length;
  };

  return (
    <section className="carousel-section">
      <div className="container">
        <div className="carousel-wrapper">
          <div className="carousel-container">

            <div className="carousel-slide left" onClick={handlePrev}>
              <div className="carousel-slide-image">
                <img
                  src={slides[getLeftSlideIndex()].image}
                  alt="Предыдущий слайд"
                  draggable="false"
                />
              </div>
              <div className="carousel-overlay"></div>
            </div>


            <div className="carousel-slide center">
              <div className="carousel-slide-image">
                <img
                  src={slides[activeIndex].image}
                  alt="Центральный слайд"
                  draggable="false"
                />
              </div>
            </div>


            <div className="carousel-slide right" onClick={handleNext}>
              <div className="carousel-slide-image">
                <img
                  src={slides[getRightSlideIndex()].image}
                  alt="Следующий слайд"
                  draggable="false"
                />
              </div>
              <div className="carousel-overlay"></div>
            </div>
          </div>

          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarouselSlider;
