import { Outlet, ScrollRestoration } from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createContext, useEffect, useState } from 'react'
export const CartContext = createContext([])

// The old Header and Footer were deleted with the rest of the previous design.
// Rebuild them as src/components/layout/Header/HeaderComponent.jsx and
// src/components/layout/Footer/MyFooter.jsx, then mount them around <Outlet />
// below — the shell keeps that slot ready.
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
        {/* TODO(redesign): <HeaderComponent /> */}
        <main>
          <Outlet />
        </main>
        {/* TODO(redesign): <MyFooter /> */}
        <ToastContainer position="top-center" autoClose={1000} />
      </div>
    </CartContext.Provider>
  )
}

export default App
