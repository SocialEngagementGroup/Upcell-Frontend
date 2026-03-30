import { useContext, useRef, useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import axiosInstance from '../../../utilities/axiosInstance'

import "./HeaderComponent.css"
import { CartContext } from '../../../App'

import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const HeaderComponent = () => {
  const [navOn, setNavOn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navEle = useRef()
  const navigate = useNavigate()
  const { cart } = useContext(CartContext)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    const searchValue = encodeURIComponent(e.target.search.value)
    e.target.search.value = ""
    navigate(`/preowned?search=${searchValue}`)
  }

  function handleNav() {
    navEle.current.classList.toggle("visible")
    setNavOn(prev => !prev)
  }

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className='header-container container-max'>
        <div className='header-left'>
          <Link to="/" className='gt-logo'>
            <img src="/staticImages/globalgtIcon.png" alt='Global Traders' />
          </Link>
        </div>

        <div className='header-center'>
          <form className='search-bar' onSubmit={handleSearch}>
            <SearchIcon className='search-icon' />
            <input type='text' placeholder='Search for a Phone' name='search' required />
            <button type='submit' className='search-submit'>Search</button>
          </form>
        </div>

        <div className='header-right'>
          <Link to="/myaccount" className='nav-link-icon'>
            <PersonOutlineIcon />
            <span className='link-text'>Account</span>
          </Link>

          <Link to="/cart" className='nav-link-icon cart-link'>
            <ShoppingCartOutlinedIcon />
            {cart?.length > 0 && <span className='cart-badge'>{cart.length}</span>}
            <span className='link-text'>Cart</span>
          </Link>

          <button className='mobile-menu-btn' onClick={handleNav}>
            {navOn ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav className='sub-nav' ref={navEle}>
        <div className='container-max nav-links'>
          <NavLink to="preowned">Pre-owned</NavLink>
          <NavLink to="refubrished">Refurbished</NavLink>
          <NavLink to="wholesale">Wholesale</NavLink>
          <NavLink to="resources">Resources</NavLink>
          <NavLink to="contactus">Contact Us</NavLink>
          <NavLink to="offer" className='offer-link'>Special Offer</NavLink>
        </div>
      </nav>
    </header>
  )
}

export default HeaderComponent