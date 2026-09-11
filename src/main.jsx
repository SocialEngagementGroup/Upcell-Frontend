import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import './index.css';
import { loadGtm } from './utilities/gtm';

import App from './App.jsx';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import PrivateRoute from './utilities/PrivateRoute.jsx';
import UserContextProvider from './utilities/UserContextProvider.jsx';
import AdminPrivateRoute from './utilities/AdminPrivateRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import RouteLoadingScreen from './components/RouteLoadingScreen/RouteLoadingScreen.jsx';
import RouteError from './components/RouteError/RouteError.jsx';

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
const Checkout = lazy(() => import('./pages/Checkout/Checkout.jsx'));
const AdminOrder = lazy(() => import('./pages/Admin/Orders/AdminOrder/AdminOrder.jsx'));
const LoginAndSignup = lazy(() => import('./pages/Auth/LoginAndSignup/LoginAndSignup.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetail/ProductDetailPage/ProductDetailPage.jsx'));
const ReturnPolicy = lazy(() => import('./pages/Legal/ReturnPolicy/ReturnPolicy.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy/PrivacyPolicy.jsx'));
const TermsConditions = lazy(() => import('./pages/Legal/TermsConditions/TermsConditions.jsx'));
const DeliveryPolicy = lazy(() => import('./pages/Legal/DeliveryPolicy/DeliveryPolicy.jsx'));
const Promotions = lazy(() => import('./pages/Legal/Promotions/Promotions.jsx'));
const PaymentInfo = lazy(() => import('./pages/Legal/PaymentInfo/PaymentInfo.jsx'));
const AboutUs = lazy(() => import('./pages/Legal/AboutUs/AboutUs.jsx'));
const ThankYou = lazy(() => import('./pages/ThankYou/ThankYou.jsx'));
const ContactThankYou = lazy(() => import('./pages/ThankYou/ContactThankYou.jsx'));
const JournalPost = lazy(() => import('./pages/Auxiliary/Resources/JournalPost.jsx'));
const Wholesale = lazy(() => import('./pages/Wholesale/Wholesale.jsx'));
const GuestOrder = lazy(() => import('./pages/OrderLookup/GuestOrder.jsx'));
const TrackOrder = lazy(() => import('./pages/OrderLookup/TrackOrder.jsx'));
const OfferResponse = lazy(() => import('./pages/Returns/OfferResponse.jsx'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'));
const AdminTradeIn = lazy(() => import('./pages/Admin/TradeIn/AdminTradeIn.jsx'));
const AdminRefundRequests = lazy(() => import('./pages/Admin/RefundRequests/AdminRefundRequests.jsx'));
const ReceivingDesk = lazy(() => import('./pages/Admin/RefundRequests/ReceivingDesk.jsx'));
const ReturnsReport = lazy(() => import('./pages/Admin/RefundRequests/ReturnsReport.jsx'));
const LegacyProductRedirect = lazy(() => import('./pages/ProductDetail/LegacyProductRedirect.jsx'));
const SingleTradeInPage = lazy(() => import('./pages/Admin/TradeIn/SingleTradeInPage.jsx'));
const AdminNewsletter = lazy(() => import('./pages/Admin/Newsletter/AdminNewsletter.jsx'));
const AdminContact = lazy(() => import('./pages/Admin/Contact/AdminContact.jsx'));
const AdminAnalytics = lazy(() => import('./pages/Admin/Analytics/AdminAnalytics.jsx'));
const AdminWholesale = lazy(() => import('./pages/Admin/Wholesale/AdminWholesale.jsx'));
const AdminNotifications = lazy(() => import('./pages/Admin/Notifications/AdminNotifications.jsx'));
const AdminEmailSettings = lazy(() => import('./pages/Admin/EmailSettings/AdminEmailSettings.jsx'));
const AdminAuditLog = lazy(() => import('./pages/Admin/AuditLog/AdminAuditLog.jsx'));
const AdminPayments = lazy(() => import('./pages/Admin/Payments/AdminPayments.jsx'));

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
    errorElement: <RouteError />,
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
        path: "product/:slug",
        element: lazyElement(<ProductDetailPage />),
      },
      {
        // Old shared links and bookmarks. The name was wrong as well as the
        // shape — iPads and MacBooks were served from /iphone/ too.
        path: "iphone/:parentId/:productId",
        element: lazyElement(<LegacyProductRedirect />),
      },
      {
        path: "checkout",
        element: <Navigate to="/cart" replace />,
      },
      {
        path: "checkout/:id",
        // No PrivateRoute. Requiring an account to buy a phone was the biggest
        // thing between a visitor and a sale, and the account it forced them
        // to make unlocked nothing but the order they were already placing.
        // /myaccount keeps its guard — that one is an account.
        element: lazyElement(<Checkout />),
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
        path: "terms-conditions",
        element: lazyElement(<TermsConditions />),
      },
      {
        path: "delivery-policy",
        element: lazyElement(<DeliveryPolicy />),
      },
      {
        path: "promotions",
        element: lazyElement(<Promotions />),
      },
      {
        path: "payment-info",
        element: lazyElement(<PaymentInfo />),
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
        // Selling in volume. The backend has taken these since before the
        // September work; there was no page to submit one from.
        path: "wholesale",
        element: lazyElement(<Wholesale />),
      },
      {
        // A guest's own order, from the link in their receipt. No guard: the
        // token in the link is the authorisation.
        path: "order/:id",
        element: lazyElement(<GuestOrder />),
      },
      {
        // Getting a fresh link after deleting the receipt.
        path: "track-order",
        element: lazyElement(<TrackOrder />),
      },
      {
        // Where the revised-offer email lands. No PrivateRoute: the token in
        // the link is the authorisation, and a sign-in wall here is how an
        // offer expires unanswered and a device gets posted back for nothing.
        path: "returns/:id/:decision",
        element: lazyElement(<OfferResponse />),
      },
      {
        path: "succeed",
        // Reached only after a real checkout, which is itself behind
        // PrivateRoute — so the customer's session is already active by the
        // time the bank redirects them here. Guarding it too costs nothing
        // and closes off a bookmarked/shared link from showing even the
        // PII-stripped order view to someone not signed in.
        element: lazyElement(<PrivateRoute><ThankYou /></PrivateRoute>),
      },
      {
        path: "contact-thank-you",
        element: lazyElement(<ContactThankYou />),
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
            path: "refund-requests",
            element: lazyElement(<AdminRefundRequests />),
          },
          {
            // The bench, kept apart from the queue: somebody unpacking parcels
            // wants one box to type into, not twelve tabs.
            path: "receiving",
            element: lazyElement(<ReceivingDesk />),
          },
          {
            path: "returns-report",
            element: lazyElement(<ReturnsReport />),
          },
          {
            path: "trade-in",
            element: lazyElement(<AdminTradeIn />),
          },
          {
            path: "trade-in/:id",
            element: lazyElement(<SingleTradeInPage />),
          },
          {
            path: "notifications",
            element: lazyElement(<AdminNotifications />),
          },
          {
            path: "email-settings",
            element: lazyElement(<AdminEmailSettings />),
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
            path: "audit-log",
            element: lazyElement(<AdminAuditLog />),
          },
          {
            path: "payments",
            element: lazyElement(<AdminPayments />),
          },
          {
            path: "wholesale",
            element: lazyElement(<AdminWholesale />),
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
        ],
      },
      {
        path: "*",
        element: lazyElement(<NotFound />),
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

if (!clerkPublishableKey) {
  // Loads only when VITE_GTM_ID is set. With it empty nothing is requested
  // and every track() call below is a no-op, so the events can be wired now
  // and switched on later without a release.
  loadGtm();

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
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      {/* signInUrl and signUpUrl tell Clerk that this app hosts its own auth
          pages. Without them Clerk falls back to the Account Portal it hosts
          on accounts.dev, and any redirect it starts itself lands there —
          including the one after a cancelled Google sign-in, which dropped
          the customer on an unbranded page in the wrong theme with no way
          back to the shop. */}
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        signInUrl="/login"
        signUpUrl="/login?mode=signup"
      >
        <UserContextProvider>
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </UserContextProvider>
      </ClerkProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
}
