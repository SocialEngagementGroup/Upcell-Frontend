import { useContext, useRef, useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import "./HeaderComponent.css"
import { CartContext } from '../../../App'

// Material Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HeaderComponent = () => {
  const [navOn, setNavOn] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navEle = useRef()
  const navigate = useNavigate()
  const { cart } = useContext(CartContext)

  function handleSearch(e) {
    e.preventDefault()
    const searchValue = encodeURIComponent(e.target.search.value)
    e.target.search.value = ""
    setIsSearchOpen(false)
    navigate(`/shop?search=${searchValue}`)
  }

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
                <Link to="/offer" className='special-link deals' onClick={() => setNavOn(false)}>Best Deals</Link>
              </div>
            </div>

            {/* Sell Your Device - High Vis */}
            <Link to="/sell-your-device" className='nav-item sell-link-highlight' onClick={() => setNavOn(false)}>
              Sell Your Device <span className='badge-get-paid'>Get Paid</span>
            </Link>

            {/* Deals - Optional but recommended */}
            <NavLink to="/offer" className='nav-item' onClick={() => setNavOn(false)}>Deals</NavLink>

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
          <button className='nav-icon-btn' onClick={() => setIsSearchOpen(true)}>
            <SearchIcon />
          </button>
          
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

      {/* Full-screen Search Overlay */}
      <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
        <div className="search-overlay-content">
           <button className="close-search" onClick={() => setIsSearchOpen(false)}><CloseIcon /></button>
           <form onSubmit={handleSearch}>
             <input 
               type="text" 
               placeholder="Search model (e.g. iPhone 15 Pro)" 
               name="search"
               autoFocus={isSearchOpen}
             />
           </form>
           <div className="quick-links">
             <span>QUICK LINKS:</span>
             <Link to="/shop?category=iPhone" onClick={() => setIsSearchOpen(false)}>iPhone 15 Pro</Link>
             <Link to="/shop?category=MacBook" onClick={() => setIsSearchOpen(false)}>MacBook M3</Link>
             <Link to="/shop?category=iPad" onClick={() => setIsSearchOpen(false)}>iPad Pro</Link>
           </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent;