import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const NotFound = () => {
    return (
        <div className="page-shell">
            <section className="page-container py-12 sm:py-20">
                <div className="premium-card rounded-[28px] px-6 py-12 text-center sm:rounded-[40px] sm:px-8 sm:py-16 md:px-12">
                    <nav className="mb-6 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray sm:mb-8">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Not Found</span>
                    </nav>
                    <h1 className="text-[clamp(2.2rem,5vw,5rem)] leading-[0.96] sm:leading-[0.92]">This page is not here.</h1>
                    <p className="mx-auto mt-4 max-w-[620px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        The link may be outdated, or the page may have been moved while the shopfront was being rebuilt.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                        <Link to="/" className="premium-button w-full sm:w-auto">Go home</Link>
                        <Link to="/shop" className="premium-button-secondary w-full sm:w-auto">Browse shop</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NotFound;
