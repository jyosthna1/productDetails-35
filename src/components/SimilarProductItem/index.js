// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProductDetails} = props
  const {imageUrl, brand, title, rating, price} = eachProductDetails
  return (
    <li className="similar-item-container">
      <img
        src={imageUrl}
        alt={`similar  product ${title}`}
        className="product-image-similar"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="brand">by {brand}</p>
      <div className="price-rating-similar-container">
        <p className="similar-price">Rs {price}/-</p>
        <div className="rating-similar-container">
          <p className="rating-similar">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-similar"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
