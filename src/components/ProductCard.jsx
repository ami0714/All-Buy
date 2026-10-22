import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { name, slug: productSlug, default_price, image_url,max_price,min_price } = product;
  const slug = productSlug 
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
            src={image_url || "https://via.placeholder.com/300x400?text=Product+Image"}
            alt={name}
            className="home-product-card__image"
          />
        </div>
        <div className="home-product-card__info">
          <h3 className="home-product-card__title">{name}</h3>
          <div className="home-product-card__bottom">
            <span className="home-product-card__price">RM{!min_price && !max_price ? default_price : min_price +'-'+'RM'+ max_price }</span>
          </div>
        </div>
      </NavLink>
      <button
        className="home-product-card__add"
        type="button"
        aria-label={`Lihat ${name}`}
        onClick={() => navigate(productPath, { state: { product } })}
      >
        +
      </button>
    </div>
  );
};

export default ProductCard;