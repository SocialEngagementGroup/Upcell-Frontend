import { useContext, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CartContext } from '../../../App'

// Material Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


const HeaderComponent = () => {
  const [navOn, setNavOn] = useState(false)
  const navEle = useRef()
  const { cart } = useContext(CartContext)

  const primaryLinks = [
    { label: 'Shop', to: '/shop' },
    { label: 'Trade In', to: '/trade-in' },
    { label: 'About', to: '/about' },
    { label: 'Journal', to: '/journal' },
    { label: 'Support', to: '/support' },
  ]

  function handleNav() {
    navEle.current?.classList.toggle("visible")
    setNavOn(prev => !prev)
  }

  return (
    <header className="fixed left-0 top-0 z-[1000] w-full bg-black">
      <div className="surface-panel flex h-[72px] w-full items-center justify-between px-8 md:px-16 lg:px-24">
        <div>
          <Link to="/" className="flex items-center">
            <img src="/staticImages/upcellLogo.png" alt="Upcell Logo" className="h-[90px] w-auto object-contain" />
          </Link>
        </div>

        <nav 
          className={`surface-panel absolute left-0 right-0 top-[72px] flex-col gap-3 rounded-b-3xl border-t border-black/[0.04] p-5 md:left-0 md:right-0 lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-2 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none ${navOn ? 'flex' : 'hidden lg:flex'}`}
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
            <ShoppingCartOutlinedIcon />
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
