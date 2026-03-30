import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import HeaderComponent from './components/layout/Header/HeaderComponent'
import MyFooter from './components/layout/Footer/MyFooter'

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createContext, useEffect, useState } from 'react'
export const CartContext = createContext([])

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
      <div className="app-layout">
        <HeaderComponent />
        <Outlet />
        <MyFooter />
        <ToastContainer position="top-center" autoClose={1000} />
      </div>
    </CartContext.Provider>
  )
}

export default App
