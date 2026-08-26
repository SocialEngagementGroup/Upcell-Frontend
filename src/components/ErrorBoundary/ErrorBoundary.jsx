import React from 'react';
import { Link } from 'react-router-dom';

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
      // TODO(redesign): build the new error boundary UI here.
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>We encountered an unexpected error, and we are working to make it right.</p>
          <button type="button" onClick={() => window.location.reload()}>Reload page</button>
          <Link to="/" onClick={() => this.setState({ hasError: false })}>Return to home</Link>
          {import.meta.env.DEV && (
            <pre>{this.state.error?.toString()}</pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
