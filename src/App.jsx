import { Outlet, ScrollRestoration } from 'react-router-dom'
import HeaderComponent from './components/layout/Header/HeaderComponent'
import MyFooter from './components/layout/Footer/MyFooter'

import { Toaster } from 'sonner';
import { TOASTER_ICONS } from './utilities/toastIcons';

import { createContext, useEffect, useMemo, useState } from 'react'
export const CartContext = createContext([])

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Memoised because this object is the context value: written inline it is a
  // new object on every App render, so every consumer re-renders whenever
  // anything above them does — the shop grid included, which is the most
  // expensive thing on the site to re-render.
  //
  // setCart is a useState setter and is already stable, so cart is the only
  // real dependency.
  const cartValue = useMemo(() => ({ cart, setCart }), [cart]);

  return (
    <CartContext.Provider value={cartValue}>
      <ScrollRestoration />
      <div className="flex min-h-screen flex-col bg-transparent">
        <HeaderComponent />
        <main className="flex-1">
          <Outlet />
        </main>
        <MyFooter />
        {/*
          Near Black ground with Off White text, per the brand: red is the accent
          that marks an action, never the surface. Errors carry a red left edge so
          a failed action reads at a glance without inventing a colour outside the
          palette — sonner's own icons already separate success from error.

          The border colour is neutralised through sonner's own CSS variable
          rather than a Tailwind border class, so the error variant's left edge is
          the only border rule in play and the two cannot fight over the cascade.

          duration was 1000ms under react-toastify, which dismissed a message
          before it could be read.
        */}
        <Toaster
          position="top-right"
          duration={4000}
          closeButton
          icons={TOASTER_ICONS}
          style={{ '--normal-border': 'transparent' }}
          toastOptions={{
            classNames: {
              // 24px radius and shadow-premium are the storefront card's own
              // values, so a toast reads as part of the same surface family
              // rather than a browser default dropped on top of it. The red
              // left edge is the brand mark: red marks the action, and a toast
              // is the answer to one.
              toast: '!bg-apple-text !text-apple-bg !rounded-[24px] !border-l-[3px] !border-l-brand-red !font-sans !shadow-premium',
              title: '!font-medium !text-[15px]',
              description: '!text-apple-bg/70',
              // Every toast carries the red edge, so the edge cannot also be
              // what separates a failure from a success. The icon does that
              // instead — sonner draws its icons with currentColor, so this
              // turns the error mark red while the success tick stays Off White.
              error: '[&_[data-icon]]:!text-brand-red',
              actionButton: '!bg-brand-red !text-white !font-bold !rounded-full',
              closeButton: '!bg-apple-text !text-apple-bg !border-apple-bg/20',
            },
          }}
        />
      </div>
    </CartContext.Provider>
  )
}

export default App
