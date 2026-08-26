import { Link } from 'react-router-dom';

const NotFound = () => {
    // TODO(redesign): build the new 404 page here.
    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <span>Not Found</span>
            </nav>
            <h1>This page is not here.</h1>
            <p>The link may be outdated, or the page may have been moved.</p>
            <Link to="/">Go home</Link>
            <Link to="/shop">Browse shop</Link>
        </div>
    );
};

export default NotFound;
