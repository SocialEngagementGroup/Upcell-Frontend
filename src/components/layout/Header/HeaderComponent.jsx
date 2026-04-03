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
    <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.05)] z-[1000] transition-all duration-300 ease-smooth">
      <div className='h-full flex justify-between items-center max-w-site mx-auto px-[100px] lg:px-10'>
        {/* Left Side (Brand) */}
        <div className='header-left'>
          <Link to="/" className='group'>
            <img src="/staticImages/upcellLogo.png" alt="UpCell" className="h-[75px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]" />
          </Link>
        </div>

        {/* Center (Primary Navigation) */}
        <nav 
          className={`fixed top-20 left-0 w-full bg-white border-b border-black/5 px-10 py-8 flex-col gap-6 shadow-xl transition-all duration-300 ease-smooth z-[999] lg:static lg:flex lg:flex-row lg:h-full lg:w-auto lg:p-0 lg:bg-transparent lg:border-none lg:shadow-none lg:opacity-100 lg:visible ${navOn ? 'flex opacity-100 visible' : 'hidden lg:flex'}`}
          ref={navEle}
        >
          <div className='flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-center lg:h-full'>
            {/* Shop Dropdown */}
            <div className='group relative flex flex-col items-start lg:h-full lg:flex-row lg:items-center cursor-pointer'>
              <span className='flex items-center gap-1 py-2 text-[13px] font-bold text-apple-text hover:text-brand-red transition-colors'>Shop <KeyboardArrowDownIcon className='!text-sm opacity-50' /></span>
              
              {/* Dropdown Menu */}
              <div className='flex flex-col gap-3 pl-4 mt-2 lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-[10px] lg:bg-white lg:border lg:border-black/5 lg:rounded-xl lg:w-[200px] lg:p-4 lg:shadow-[0_10px_40px_rgba(0,0,0,0.1)] lg:opacity-0 lg:invisible lg:transition-all lg:duration-300 lg:ease-smooth lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0 lg:mt-0 lg:pl-0'>
                <Link to="/shop?category=iPhone" onClick={() => setNavOn(false)} className='text-sm font-medium text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03] transition-colors'>iPhone</Link>
                <Link to="/shop?category=iPad" onClick={() => setNavOn(false)} className='text-sm font-medium text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03] transition-colors'>iPad</Link>
                <Link to="/shop?category=MacBook" onClick={() => setNavOn(false)} className='text-sm font-medium text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03] transition-colors'>MacBook</Link>
                <hr className='hidden lg:block border-0 border-t border-black/5 my-1' />
                <Link to="/shop" className='text-sm !font-bold text-apple-text px-3 py-2 rounded-md hover:bg-black/[0.03]' onClick={() => setNavOn(false)}>Shop All</Link>
              </div>
            </div>

            {/* Sell Device - Reordered (Original Look) */}
            <Link 
              to="/sell-device" 
              className='flex items-center gap-1 py-2 text-[13px] font-bold text-apple-text lg:h-full transition-colors hover:text-brand-red' 
              onClick={() => setNavOn(false)}
            >
              Sell Device
              <span className='bg-brand-red text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter'>Get Paid</span>
            </Link>

            {/* Other links */}
            <NavLink to="/about-us" className='flex items-center py-2 text-[13px] font-bold text-apple-text hover:text-brand-red transition-colors lg:h-full' onClick={() => setNavOn(false)}>About us</NavLink>
            <NavLink to="/resources" className='flex items-center py-2 text-[13px] font-bold text-apple-text hover:text-brand-red transition-colors lg:h-full' onClick={() => setNavOn(false)}>Blogs</NavLink>

            {/* Support Dropdown */}
            <div className='group relative flex flex-col items-start lg:h-full lg:flex-row lg:items-center cursor-pointer'>
              <span className='flex items-center gap-1 py-2 text-[13px] font-bold text-apple-text hover:text-brand-red transition-colors'>Support <KeyboardArrowDownIcon className='!text-sm opacity-50' /></span>
              <div className='flex flex-col gap-3 pl-4 mt-2 lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-[10px] lg:bg-white lg:border lg:border-black/5 lg:rounded-xl lg:w-[200px] lg:p-4 lg:shadow-[0_10px_40px_rgba(0,0,0,0.1)] lg:opacity-0 lg:invisible lg:transition-all lg:duration-300 lg:ease-smooth lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0 lg:mt-0 lg:pl-0'>
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

          <button className='block lg:hidden bg-transparent border-none cursor-pointer ml-4' onClick={handleNav}>
            {navOn ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent;