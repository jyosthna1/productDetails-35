// Write your code here
import './index.css'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    apiStatus: apiStatusConstants.initial,
    similarProducts: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductsDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    imageUrl: data.image_url,
    id: data.id,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductsDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const fetchedData = this.getFormattedData(data)
      const similarProductsData = data.similar_products.map(eachData =>
        this.getFormattedData(eachData),
      )
      this.setState({
        similarProducts: similarProductsData,
        productDetails: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onClickIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductsDetails = () => {
    const {productDetails, quantity, similarProducts} = this.state
    const {
      availability,
      brand,
      imageUrl,
      description,
      price,
      id,
      rating,
      title,
      totalReviews,
    } = productDetails

    return (
      <div className="product-details-container">
        <div className="product-details-view">
          <img src={imageUrl} className="product-image" alt="product" />
          <div className="product-info">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-reviews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="available-container">
              <p className="available">Available: </p>
              <p className="available-span">{availability}</p>
            </div>
            <div className="available-container">
              <p className="available">Brand: </p>
              <p className="available-span">{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="item-count-container">
              <button
                type="button"
                className="increment-button"
                testid="minus"
                onClick={this.onClickDecrement}
              >
                <BsDashSquare className="minus" />
              </button>
              <p className="quantity-number">{quantity}</p>
              <button
                type="button"
                className="increment-button"
                testid="plus"
                onClick={this.onClickIncrement}
              >
                <BsPlusSquare className="minus" />
              </button>
            </div>
            <button className="add-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-head">Similar Products</h1>
        <ul className="similar-products-container">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              eachProductDetails={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1 className="not-found-head">Product Not Found</h1>
      <Link to="/products" className="link">
        <button className="continue-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  loaderView = () => (
    <div testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductsStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsDetails()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.loaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderProductsStatus()}</div>
      </>
    )
  }
}

export default ProductItemDetails
