import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const NotFound = () => {
    return (
        <div className="page-shell">
            <section className="page-container py-20">
                <div className="premium-card rounded-[40px] px-8 py-16 text-center md:px-12">
                    <nav className="mb-8 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Not Found</span>
                    </nav>
                    <h1 className="text-[clamp(2.8rem,5vw,5rem)] leading-[0.92]">This page is not here.</h1>
                    <p className="mx-auto mt-5 max-w-[620px] text-lg leading-8 text-ink-soft">
                        The link may be outdated, or the page may have been moved while the shopfront was being rebuilt.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/" className="premium-button">Go home</Link>
                        <Link to="/shop" className="premium-button-secondary">Browse shop</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NotFound;
