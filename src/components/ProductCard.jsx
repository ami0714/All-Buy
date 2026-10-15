import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { title, price, image } = product;
  const slug = title.toLowerCase().trim().replace(/\s+/g, '-');
  const productPath = `/product/${slug}`;

  return (
    <div className="home-product-card">
      <NavLink
        to={productPath}
        state={{ product }}
        className="home-product-card__link"
      >
        <div className="home-product-card__image-container">
          <img
            src={image || "https://via.placeholder.com/300x400?text=Product+Image"}
            alt={title}
            className="home-product-card__image"
          />
        </div>
        <div className="home-product-card__info">
          <h3 className="home-product-card__title">{title}</h3>
          <div className="home-product-card__bottom">
            <span className="home-product-card__price">{price}</span>
          </div>
        </div>
      </NavLink>
      <button
        className="home-product-card__add"
        type="button"
        aria-label={`Lihat ${title}`}
        onClick={() => navigate(productPath, { state: { product } })}
      >
        +
      </button>
    </div>
  );
};

export default ProductCard;