import React from "react";

const ProductCard = ({ title, description, specs }) => {
  return (
    <div className="product-card">
      <h3 className="product-card-title">{title}</h3>
      <p className="product-card-description">{description}</p>
      <ul className="product-specs">
        {specs.map((spec, index) => (
          <li key={index}>{spec}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCard;
