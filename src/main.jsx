import React from 'react'
import ReactDOM from 'react-dom/client'

// styles and css 
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'


import App from './App.jsx'

import { createBrowserRouter, RouterProvider} from "react-router-dom"
import Cart from './pages/Cart/Cart.jsx'
import MyAccount from './pages/MyAccount/MyAccount.jsx'
import TradeIn from './pages/TradeIn/TradeIn.jsx'


import ShopPage from "./pages/Shop/ShopPage.jsx"

import Resources from "./pages/Auxiliary/Resources/Resources.jsx"
import Contactus from "./pages/Auxiliary/Contactus/Contactus.jsx"

import Home from './pages/Home/Home.jsx'

import Catagory from './pages/Admin/Categories/AllCatagory/Catagory.jsx';
import AdminSecret from './pages/Admin/AdminSecret/AdminSecret.jsx';
import AddCatagory from './pages/Admin/Categories/AddCatagory/AddCatagory.jsx';
import AdminCatagory from './pages/Admin/Categories/AdminCatagory/AdminCatagory.jsx';
import AdminHome from './pages/Admin/Dashboard/AdminHome/AdminHome.jsx';
import AllProduct from './pages/Admin/Products/AllProduct/AllProduct.jsx';
import AddProduct from './pages/Admin/Products/AddProduct/AddProduct.jsx';
import EditProduct from './pages/Admin/Products/EditProduct/EditProduct.jsx';
import Checkout from './pages/Checkout/Checkout.jsx';
import AdminOrder from './pages/Admin/Orders/AdminOrder/AdminOrder.jsx';
import LoginAndSignup from './pages/Auth/LoginAndSignup/LoginAndSignup.jsx';
import PrivateRoute from './utilities/PrivateRoute.jsx';
import UserContextProvider from './utilities/UserContextProvider.jsx';
import ProductDetailPage from './pages/ProductDetail/ProductDetailPage/ProductDetailPage.jsx';
import ReturnPolicy from './pages/Legal/ReturnPolicy/ReturnPolicy.jsx';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy/PrivacyPolicy.jsx';
import AboutUs from './pages/Legal/AboutUs/AboutUs.jsx';
import AdminPrivateRoute from './utilities/AdminPrivateRoute.jsx';
import ThankYou from './pages/ThankYou/ThankYou.jsx';
import JournalPost from './pages/Auxiliary/Resources/JournalPost.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "",
        element: <Home></Home>
      },
      {
        path: "cart",
        element: <Cart></Cart>
      },
      {
        path: "iphone/:parentId/:productId",
        element: <ProductDetailPage></ProductDetailPage>
      },
      {
        path: "checkout/:id",
        element: <PrivateRoute><Checkout></Checkout></PrivateRoute>
      },
      {
        path: "login",
        element: <LoginAndSignup></LoginAndSignup>
      },
      {
        path: "myaccount",
        element: <PrivateRoute><MyAccount></MyAccount></PrivateRoute>
      },
      {
        path: "shop",
        element: <ShopPage></ShopPage>
      },


      {
        path: "journal",
        element: <Resources></Resources>,
      },
      {
        path: "journal/:slug",
        element: <JournalPost></JournalPost>
      },
      {
        path: "support",
        element: <Contactus></Contactus>
      },

      {
        path:"return-policy",
        element: <ReturnPolicy></ReturnPolicy>
      },
      {
        path:"privacy-policy",
        element:<PrivacyPolicy></PrivacyPolicy>
      },
      {
        path: "about",
        element:<AboutUs></AboutUs>
      },
      {
        path: "trade-in",
        element: <TradeIn></TradeIn>
      },
      {
        path:"succeed",
        element: <ThankYou></ThankYou>
      },
      {
        path: "admin-secret",
        element: <AdminPrivateRoute><AdminSecret></AdminSecret></AdminPrivateRoute>,
        children: [
          {
            path: "",
            element: <AdminHome></AdminHome>
          },
          {
            path: "orders",
            element: <AdminOrder></AdminOrder>
          },
          {
            path: "catagory",
            element: <AdminCatagory></AdminCatagory>,
            children: [
              {
                path: "",
                element: <Catagory></Catagory>,
              },
              {
                path: "addcatagory",
                element: <AddCatagory></AddCatagory>
              }
            ]
          },
          {
            path: "products",
            element: <AllProduct></AllProduct>,
          },
          {
            path: "addproduct",
            element: <AddProduct></AddProduct>
          },
          {
            path: "editProduct/:id",
            element: <EditProduct></EditProduct>
          }
        ]
      },
      {
        path: "*",
        element: <NotFound></NotFound>
      },

    ]
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  

    <UserContextProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </UserContextProvider>

  
)
