import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';

import './index.css';

import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from './utilities/PrivateRoute.jsx';
import UserContextProvider from './utilities/UserContextProvider.jsx';
import AdminPrivateRoute from './utilities/AdminPrivateRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import RouteLoadingScreen from './components/RouteLoadingScreen/RouteLoadingScreen.jsx';

const Home = lazy(() => import('./pages/Home/Home.jsx'));
const Cart = lazy(() => import('./pages/Cart/Cart.jsx'));
const MyAccount = lazy(() => import('./pages/MyAccount/MyAccount.jsx'));
const TradeIn = lazy(() => import('./pages/TradeIn/TradeIn.jsx'));
const ShopPage = lazy(() => import('./pages/Shop/ShopPage.jsx'));
const Resources = lazy(() => import('./pages/Auxiliary/Resources/Resources.jsx'));
const Contactus = lazy(() => import('./pages/Auxiliary/Contactus/Contactus.jsx'));
const Catagory = lazy(() => import('./pages/Admin/Categories/AllCatagory/Catagory.jsx'));
const AdminSecret = lazy(() => import('./pages/Admin/AdminSecret/AdminSecret.jsx'));
const AddCatagory = lazy(() => import('./pages/Admin/Categories/AddCatagory/AddCatagory.jsx'));
const AdminCatagory = lazy(() => import('./pages/Admin/Categories/AdminCatagory/AdminCatagory.jsx'));
const AdminHome = lazy(() => import('./pages/Admin/Dashboard/AdminHome/AdminHome.jsx'));
const AllProduct = lazy(() => import('./pages/Admin/Products/AllProduct/AllProduct.jsx'));
const AddProduct = lazy(() => import('./pages/Admin/Products/AddProduct/AddProduct.jsx'));
const EditProduct = lazy(() => import('./pages/Admin/Products/EditProduct/EditProduct.jsx'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout.jsx'));
const AdminOrder = lazy(() => import('./pages/Admin/Orders/AdminOrder/AdminOrder.jsx'));
const LoginAndSignup = lazy(() => import('./pages/Auth/LoginAndSignup/LoginAndSignup.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetail/ProductDetailPage/ProductDetailPage.jsx'));
const ReturnPolicy = lazy(() => import('./pages/Legal/ReturnPolicy/ReturnPolicy.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy/PrivacyPolicy.jsx'));
const AboutUs = lazy(() => import('./pages/Legal/AboutUs/AboutUs.jsx'));
const ThankYou = lazy(() => import('./pages/ThankYou/ThankYou.jsx'));
const JournalPost = lazy(() => import('./pages/Auxiliary/Resources/JournalPost.jsx'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'));
const AdminTradeIn = lazy(() => import('./pages/Admin/TradeIn/AdminTradeIn.jsx'));
const AdminNewsletter = lazy(() => import('./pages/Admin/Newsletter/AdminNewsletter.jsx'));
const AdminContact = lazy(() => import('./pages/Admin/Contact/AdminContact.jsx'));
const AdminAnalytics = lazy(() => import('./pages/Admin/Analytics/AdminAnalytics.jsx'));

const lazyElement = (element) => (
  <Suspense fallback={<RouteLoadingScreen />}>
    {element}
  </Suspense>
);

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: lazyElement(<Home />),
      },
      {
        path: "cart",
        element: lazyElement(<Cart />),
      },
      {
        path: "iphone/:parentId/:productId",
        element: lazyElement(<ProductDetailPage />),
      },
      {
        path: "checkout/:id",
        element: lazyElement(<PrivateRoute><Checkout /></PrivateRoute>),
      },
      {
        path: "login",
        element: lazyElement(<LoginAndSignup />),
      },
      {
        path: "myaccount",
        element: lazyElement(<PrivateRoute><MyAccount /></PrivateRoute>),
      },
      {
        path: "shop",
        element: lazyElement(<ShopPage />),
      },
      {
        path: "blogs",
        element: lazyElement(<Resources />),
      },
      {
        path: "blogs/:slug",
        element: lazyElement(<JournalPost />),
      },
      {
        path: "support",
        element: lazyElement(<Contactus />),
      },
      {
        path: "return-policy",
        element: lazyElement(<ReturnPolicy />),
      },
      {
        path: "privacy-policy",
        element: lazyElement(<PrivacyPolicy />),
      },
      {
        path: "about",
        element: lazyElement(<AboutUs />),
      },
      {
        path: "trade-in",
        element: lazyElement(<TradeIn />),
      },
      {
        path: "succeed",
        element: lazyElement(<ThankYou />),
      },
      {
        path: "admin-secret",
        element: lazyElement(<AdminPrivateRoute><AdminSecret /></AdminPrivateRoute>),
        children: [
          {
            path: "",
            element: lazyElement(<AdminHome />),
          },
          {
            path: "orders",
            element: lazyElement(<AdminOrder />),
          },
          {
            path: "trade-in",
            element: lazyElement(<AdminTradeIn />),
          },
          {
            path: "newsletter",
            element: lazyElement(<AdminNewsletter />),
          },
          {
            path: "contact",
            element: lazyElement(<AdminContact />),
          },
          {
            path: "analytics",
            element: lazyElement(<AdminAnalytics />),
          },
          {
            path: "catagory",
            element: lazyElement(<AdminCatagory />),
            children: [
              {
                path: "",
                element: lazyElement(<Catagory />),
              },
              {
                path: "addcatagory",
                element: lazyElement(<AddCatagory />),
              },
            ],
          },
          {
            path: "products",
            element: lazyElement(<AllProduct />),
          },
          {
            path: "addproduct",
            element: lazyElement(<AddProduct />),
          },
          {
            path: "editProduct/:id",
            element: lazyElement(<EditProduct />),
          },
        ],
      },
      {
        path: "*",
        element: lazyElement(<NotFound />),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

if (!clerkPublishableKey) {
  root.render(
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '520px', border: '1px solid #eee', borderRadius: '24px', padding: '32px', boxShadow: '0 18px 60px rgba(15,23,42,0.08)' }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Missing Vercel environment key</h1>
        <p style={{ color: '#555', lineHeight: 1.6 }}>Add <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> to this Vercel environment, then redeploy.</p>
      </div>
    </div>
  );
} else {
  root.render(
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <UserContextProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </UserContextProvider>
    </ClerkProvider>
  );
}
