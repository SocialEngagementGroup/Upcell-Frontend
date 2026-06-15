import React from 'react'
import ReactDOM from 'react-dom/client'

// styles and css 
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'


import App from './App.jsx'

import { createBrowserRouter, RouterProvider} from "react-router-dom"
import Cart from './components/Cart/Cart.jsx'
import MyAccount from './components/MyAccount/MyAccount.jsx'

import Preowned from "./components/Preowned/Preowned.jsx"
import Refubrished from "./components/Refubrished/Refubrished.jsx"
import Wholesale from "./components/Wholesale/Wholesale.jsx"
import Resources from "./components/Resources/Resources.jsx"
import Contactus from "./components/Contactus/Contactus.jsx"
import Offer from "./components/Offer/Offer.jsx"
import Home from './components/Home/Home.jsx'

import Catagory from './components/AllCatagory/Catagory.jsx';
import AdminSecret from './components/AdminSecret/AdminSecret';
import AddCatagory from './components/AddCatagory/AddCatagory';
import AdminCatagory from './components/AdminCatagory/AdminCatagory';
import AdminHome from './components/AdminHome/AdminHome';
import AllProduct from './components/AllProduct/AllProduct';
import AddProduct from './components/AddProduct/AddProduct';
import EditProduct from './components/EditProduct/EditProduct';
import Checkout from './components/Checkout/Checkout';
import AdminOrder from './components/AdminOrder/AdminOrder';
import LoginAndSignup from './components/LoginAndSignup/LoginAndSignup.jsx';
import PrivateRoute from './utilities/PrivateRoute.jsx';
import UserContextProvider from './utilities/UserContextProvider.jsx';
import ProductDetailPage from './components/ProductDetailPage/ProductDetailPage.jsx';
import ReturnPolicy from './components/ReturnPolicy/ReturnPolicy.jsx';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy.jsx';
import AboutUs from './components/AboutUs/AboutUs.jsx';
import AdminPrivateRoute from './utilities/AdminPrivateRoute.jsx';
import ThankYou from './components/ThankYou/ThankYou.jsx';

// trigger vercel preview deployment

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
        element: <Checkout></Checkout>
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
        path: "preowned",
        element: <Preowned></Preowned>
      },
      {
        path: "refubrished",
        element: <Refubrished></Refubrished>
      },
      {
        path: "wholesale",
        element: <Wholesale></Wholesale>
      },
      {
        path: "resources",
        element: <Resources></Resources>
      },
      {
        path: "contactus",
        element: <Contactus></Contactus>
      },
      {
        path: "offer",
        element: <Offer></Offer>
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
        path:"about-us",
        element:<AboutUs></AboutUs>
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

    ]
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  

    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>

  
)
