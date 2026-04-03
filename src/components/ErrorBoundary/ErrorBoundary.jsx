import React from 'react';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-6 text-center">
          <div className="premium-card max-w-[500px] rounded-[40px] p-10 md:p-14">
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
                <ErrorOutlineIcon className="!text-[40px]" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-apple-text">Something went wrong.</h1>
            <p className="mb-10 text-lg leading-relaxed text-ink-soft">
              We encountered an unexpected error. This is embarrassing, but we're working to make it right.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="premium-button w-full justify-center"
              >
                Reload page
              </button>
              <Link 
                to="/" 
                onClick={() => this.setState({ hasError: false })}
                className="premium-button-secondary w-full justify-center"
              >
                Return to home
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-10 overflow-hidden rounded-2xl bg-black/5 p-4 text-left text-xs font-mono text-apple-gray">
                <p className="font-bold text-apple-text">Error detail:</p>
                <div className="mt-2 break-words opacity-70">
                  {this.state.error?.toString()}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
