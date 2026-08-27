import { Outlet, ScrollRestoration } from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createContext, useEffect, useState } from 'react'
export const CartContext = createContext([])

import HeaderComponent from './components/layout/Header/HeaderComponent'

// The old Footer was deleted with the rest of the previous design. Rebuild it
// as src/components/layout/Footer/MyFooter.jsx, then mount it below <Outlet />
// — the shell keeps that slot ready.
function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <ScrollRestoration />
      <div>
        <HeaderComponent />
        {/* No top offset: the header is sticky, so it sits in flow and does
            not overlap what follows it. */}
        <main>
          <Outlet />
        </main>
        {/* TODO(redesign): <MyFooter /> */}
        <ToastContainer position="top-center" autoClose={1000} className="app-toast-container" />
      </div>
    </CartContext.Provider>
  )
}

export default App
