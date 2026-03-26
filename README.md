# Upcell Frontend

The frontend client for the Upcell (Global Traders) platform, a modern e-commerce interface built with React and Vite.

## Tech Stack
- **Framework**: React.js with Vite
- **Styling**: Bootstrap, Styled Components, Emotion
- **State Management**: React Context API (`UserContextProvider`)
- **Backend Communication**: Axios
- **External Services**:
  - **Firebase Auth**: User authentication
  - **Firebase Storage**: Image hosting
  - **React Toastify**: User notifications

## Project Structure
- `src/components/`: Modular React components for UI elements and pages.
- `src/utilities/`: Helper functions, Context providers, and API configurations.
- `public/`: Static assets.

## Key Features
- **Product Catalog**: Browsing by category (Pre-owned, Refurbished, Wholesale).
- **Search**: Dynamic product searching functionality.
- **Shopping Cart**: Local and account-based cart management.
- **Admin Dashboard**: Product management, order tracking, and sales analytics.
- **Authentication**: Secure login and signup powered by Firebase.

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_API_KEY=your_firebase_api_key
   VITE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_PROJECT_ID=your_firebase_project_id
   VITE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_MESSAGING_SENDER=your_firebase_messaging_sender
   VITE_APP_ID=your_firebase_app_id
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## API Configuration
The frontend communicates with the backend via `axiosInstance.js`. Ensure the `baseURL` is correctly set to your backend server (e.g., `http://localhost:5000/` for local development).
