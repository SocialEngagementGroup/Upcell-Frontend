import { useContext, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
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
  const { cart } = useContext(CartContext)

  function handleNav() {
    navEle.current.classList.toggle("visible")
    setNavOn(prev => !prev)
  }

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white/[0.98] backdrop-blur-[20px] border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.05)] z-[1000] transition-all duration-300 ease-smooth">
      <div className='h-full flex justify-between items-center max-w-site mx-auto px-[100px] lg:px-10'>
        {/* Left Side (Brand) */}
        <div className='header-left'>
          <Link to="/" className='group'>
            <img src="/staticImages/upcellLogo.png" alt="UpCell" className="h-[75px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]" />
          </Link>
        </div>

        {/* Center (Primary Navigation) */}
        <nav className={`${navOn ? 'mobile-visible' : ''}`} ref={navEle}>
          <div className='flex gap-8 items-center'>
            {/* Shop Dropdown */}
            <div className='group relative py-5 text-[13px] font-bold text-apple-text cursor-pointer flex items-center gap-1'>
              <span className='flex items-center gap-1'>Shop <KeyboardArrowDownIcon className='!text-sm opacity-50' /></span>
              <div className='absolute top-full left-1/2 -translate-x-1/2 translate-y-[10px] bg-white border border-black/5 rounded-xl w-[200px] p-4 flex flex-col gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.1)] opacity-0 invisible transition-all duration-300 ease-smooth group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'>
                <Link to="/shop?category=iPhone" onClick={() => setNavOn(false)} className='text-sm font-medium text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03]'>iPhone</Link>
                <Link to="/shop?category=iPad" onClick={() => setNavOn(false)} className='text-sm font-medium text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03]'>iPad</Link>
                <Link to="/shop?category=MacBook" onClick={() => setNavOn(false)} className='text-sm font-medium text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03]'>MacBook</Link>
                <hr className='border-0 border-t border-black/5 my-1' />
                <Link to="/shop" className='text-sm !font-bold text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03]' onClick={() => setNavOn(false)}>Shop All</Link>
              </div>
            </div>

            {/* Sell Device - High Vis */}
            <Link to="/sell-device" className='text-[13px] font-bold text-apple-text flex items-center gap-1' onClick={() => setNavOn(false)}>
              Sell Device <span className='bg-brand-red text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase'>Get Paid</span>
            </Link>

            {/* New links */}
            <NavLink to="/about-us" className='text-[13px] font-bold text-apple-text flex items-center gap-1' onClick={() => setNavOn(false)}>About us</NavLink>
            <NavLink to="/resources" className='text-[13px] font-bold text-apple-text flex items-center gap-1' onClick={() => setNavOn(false)}>Blogs</NavLink>

            {/* Support Dropdown */}
            <div className='group relative py-5 text-[13px] font-bold text-apple-text cursor-pointer flex items-center gap-1'>
              <span className='flex items-center gap-1'>Support <KeyboardArrowDownIcon className='!text-sm opacity-50' /></span>
              <div className='absolute top-full left-1/2 -translate-x-1/2 translate-y-[10px] bg-white border border-black/5 rounded-xl w-[200px] p-4 flex flex-col gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.1)] opacity-0 invisible transition-all duration-300 ease-smooth group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'>
                <Link to="/contactus" onClick={() => setNavOn(false)} className='text-sm font-medium text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03]'>Contact Us</Link>
                <Link to="/resources" onClick={() => setNavOn(false)} className='text-sm font-medium text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03]'>FAQs</Link>
                <Link to="/return-policy" onClick={() => setNavOn(false)} className='text-sm font-medium text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03]'>Warranty & Returns</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Right Side (Actions) */}
        <div className='flex items-center gap-6'>
          <Link to="/myaccount" className='bg-transparent border-none cursor-pointer text-apple-text relative flex items-center [&_svg]:!text-[22px]'>
            <PersonOutlineIcon />
          </Link>

          <Link to="/cart" className='bg-transparent border-none cursor-pointer text-apple-text relative flex items-center [&_svg]:!text-[22px]'>
            <ShoppingBagOutlinedIcon />
            {cart?.length > 0 && <span className='absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-red rounded-full border-2 border-white'></span>}
          </Link>

          <button className='hidden lg:block bg-transparent border-none cursor-pointer' onClick={handleNav}>
            {navOn ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent;