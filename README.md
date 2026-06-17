# Upcell Frontend

The frontend client for the Upcell (Global Traders) platform, a modern e-commerce interface built with React and Vite.

## Tech Stack
- **Framework**: React.js with Vite
- **Styling**: Bootstrap, Styled Components, Emotion
- **State Management**: React Context API (`UserContextProvider`)
- **Backend Communication**: Axios
- **External Services**:
  - **Clerk**: User authentication and role metadata
  - **React Toastify**: User notifications

## Project Structure
- `src/components/`: Modular React components for UI elements and pages.
- `src/utilities/`: Helper functions, Context providers, and API configurations.
- `public/`: Static assets.

## Key Features
- **Product Catalog**: Browsing by category (Premium, Wholesale).
- **Search**: Dynamic product searching functionality.
- **Shopping Cart**: Local and account-based cart management.
- **Admin Dashboard**: Product management, order tracking, and sales analytics.
- **Authentication**: Secure login and signup powered by Clerk.

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_API_URL=https://your-render-backend-url.onrender.com/
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## API Configuration
The frontend communicates with the backend via `axiosInstance.js`. Set `VITE_API_URL` to the correct backend URL for the current environment.
