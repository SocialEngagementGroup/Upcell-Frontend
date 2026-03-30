import { useContext } from "react"
import "./singleproduct.css"
import { CartContext } from "../../App"
import { useNavigate } from "react-router"

const SingleProduct = ({ product }) => {
  const { parentCatagory, _id, productName, description, storage, color, price, discountPrice, originalPrice, reviewScore, peopleReviewed, condition, image } = product
  
  const { cart, setCart } = useContext(CartContext)

  const navigate  = useNavigate()

  const handleAddCart = (event) => {
    event.stopPropagation()
    setCart(prev => [...prev, _id])
  }

  const handleShowProduct = () =>{
    navigate(`/iphone/${parentCatagory}/${_id}`)
  }

  return (
    <div className='single-product' onClick={handleShowProduct}>
      <div className="product-image-container">
        <img className='product-image' src={image ? image : "/staticImages/notAvailable.webp"} alt={productName} />
        {condition && <span className="product-condition-badge">{condition}</span>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{productName}</h3>
        <p className="product-specs">
          {storage} • {color.name}
        </p>

        <div className="product-price-row">
            <span className="product-price">${price}</span>
            {originalPrice > price && <span className="product-old-price">${originalPrice}</span>}
        </div>
      </div>

      <div className="product-card-actions">
        <button className="btn-details" onClick={(e) => { e.stopPropagation(); handleShowProduct(); }}>View Details</button>
        <button onClick={handleAddCart} className="btn-cart-add">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </button>
      </div>
    </div>
  )
}

export default SingleProduct