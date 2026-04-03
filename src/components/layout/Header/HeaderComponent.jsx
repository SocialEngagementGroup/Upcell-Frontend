import { useContext, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CartContext } from '../../../App'

// Material Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


const HeaderComponent = () => {
  const [navOn, setNavOn] = useState(false)
  const navEle = useRef()
  const { cart } = useContext(CartContext)

  const primaryLinks = [
    { label: 'Store', to: '/shop' },
    { label: 'Trade In', to: '/sell-device' },
    { label: 'About', to: '/about-us' },
    { label: 'Journal', to: '/resources' },
    { label: 'Support', to: '/contactus' },
  ]

  function handleNav() {
    navEle.current?.classList.toggle("visible")
    setNavOn(prev => !prev)
  }

  return (
    <header className="fixed left-0 top-0 z-[1000] w-full px-4 pt-3 md:px-6">
      <div className="surface-panel mx-auto flex h-[72px] max-w-site items-center justify-between rounded-full px-5 md:px-8">
        <div>
          <Link to="/" className="flex items-center">
            <img src="/staticImages/upcellLogo.png" alt="Upcell Logo" className="h-[90px] w-auto object-contain" />
          </Link>
        </div>

        <nav 
          className={`surface-panel absolute left-4 right-4 top-[84px] flex-col gap-3 rounded-[28px] p-5 md:left-6 md:right-6 lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-2 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none ${navOn ? 'flex' : 'hidden lg:flex'}`}
          ref={navEle}
        >

          {primaryLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setNavOn(false)}
              className={({ isActive }) =>
                `rounded-full px-4 py-3 text-[13px] font-bold transition-colors ${
                  isActive ? 'bg-black/[0.04] text-apple-text' : 'text-apple-gray hover:bg-black/[0.03] hover:text-apple-text'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="lg:hidden">
            <Link
              to="/shop"
              onClick={() => setNavOn(false)}
              className="premium-button w-full"
            >
              Explore Collection
            </Link>
          </div>
        </nav>

        <div className='flex items-center gap-2 md:gap-3'>
          <Link to="/myaccount" className='flex h-11 w-11 items-center justify-center rounded-full text-apple-text transition-colors hover:bg-black/[0.04] [&_svg]:!text-[21px]'>
            <PersonOutlineIcon />
          </Link>

          <Link to="/cart" className='relative flex h-11 w-11 items-center justify-center rounded-full text-apple-text transition-colors hover:bg-black/[0.04] [&_svg]:!text-[21px]'>
            <ShoppingBagOutlinedIcon />
            {cart?.length > 0 && (
              <span className='absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-apple-text px-1 text-[10px] font-extrabold text-white'>
                {cart.length}
              </span>
            )}
          </Link>



          <button className='flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.04] lg:hidden' onClick={handleNav}>
            {navOn ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default HeaderComponent;
