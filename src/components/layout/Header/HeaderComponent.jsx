import { useContext, useRef, useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import "./HeaderComponent.css"
import { CartContext } from '../../../App'

// Material Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HeaderComponent = () => {
  const [navOn, setNavOn] = useState(false)
  const navEle = useRef()
  const navigate = useNavigate()
  const { cart } = useContext(CartContext)



  function handleNav() {
    navEle.current.classList.toggle("visible")
    setNavOn(prev => !prev)
  }

  return (
    <header className="site-navbar">
      <div className='header-container container-max'>
        {/* Left Side (Brand) */}
        <div className='header-left'>
          <Link to="/" className='gt-logo'>
            <img src="/staticImages/upcellLogo.png" alt="UpCell" className="nav-logo" />
          </Link>
        </div>

        {/* Center (Primary Navigation) */}
        <nav className={`header-center ${navOn ? 'mobile-visible' : ''}`} ref={navEle}>
          <div className='nav-links-wrapper'>
            {/* Shop Dropdown */}
            <div className='nav-item dropdown'>
              <span className='nav-link-text'>Shop <KeyboardArrowDownIcon className='dropdown-arrow' /></span>
              <div className='dropdown-menu glass-dropdown'>
                <Link to="/shop?category=iPhone" onClick={() => setNavOn(false)}>iPhone</Link>
                <Link to="/shop?category=iPad" onClick={() => setNavOn(false)}>iPad</Link>
                <Link to="/shop?category=MacBook" onClick={() => setNavOn(false)}>MacBook</Link>
                <hr className='dropdown-divider' />
                <Link to="/shop" className='special-link' onClick={() => setNavOn(false)}>Shop All</Link>
              </div>
            </div>

            {/* Sell Device - High Vis */}
            <Link to="/sell-device" className='nav-item sell-link-highlight' onClick={() => setNavOn(false)}>
              Sell Device <span className='badge-get-paid'>Get Paid</span>
            </Link>

            {/* New links */}
            <NavLink to="/about-us" className='nav-item' onClick={() => setNavOn(false)}>About us</NavLink>
            <NavLink to="/resources" className='nav-item' onClick={() => setNavOn(false)}>Blogs</NavLink>


            {/* Support Dropdown */}
            <div className='nav-item dropdown'>
              <span className='nav-link-text'>Support <KeyboardArrowDownIcon className='dropdown-arrow' /></span>
              <div className='dropdown-menu glass-dropdown'>
                <Link to="/contactus" onClick={() => setNavOn(false)}>Contact Us</Link>
                <Link to="/resources" onClick={() => setNavOn(false)}>FAQs</Link>
                <Link to="/return-policy" onClick={() => setNavOn(false)}>Warranty & Returns</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Right Side (Actions) */}
        <div className='header-right'>

          
          <Link to="/myaccount" className='nav-icon-btn account-icon'>
            <PersonOutlineIcon />
          </Link>

          <Link to="/cart" className='nav-icon-btn cart-icon'>
            <ShoppingBagOutlinedIcon />
            {cart?.length > 0 && <span className='cart-badge-dot'></span>}
          </Link>

          <button className='mobile-menu-btn' onClick={handleNav}>
            {navOn ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>


    </header>
  )
}

export default HeaderComponent;