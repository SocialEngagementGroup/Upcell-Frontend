import "./MyFooter.css"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

// Modern Icons
const SocialIcons = {
    Instagram: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    Facebook: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    Twitter: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
};

const MyFooter = () => {
    const handleSubmit = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        toast.success("Thank you for subscribing!")
        e.target.email.value = ''
    }

    return (
        <footer className="modern-footer">
            <div className="container-max">
                <div className="footer-grid">
                    <div className="footer-col brand-col">
                        <img className='footer-logo' src='/staticImages/upcellLogo.png' alt="UpCell" />
                        <p className="brand-mission">
                            Making technology affordable and sustainable by extending the life of premium electronics.
                        </p>
                        <div className="social-links">
                            <a href="https://instagram.com" target="_blank" rel="noreferrer"><SocialIcons.Instagram /></a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer"><SocialIcons.Facebook /></a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer"><SocialIcons.Twitter /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Shop</h4>
                        <Link to="/shop">All Products</Link>
                        <Link to="/iphone/refurbished">Refurbished iPhones</Link>


                    </div>

                    <div className="footer-col">
                        <h4>Support</h4>
                        <Link to="/contactus">Contact Us</Link>
                        <Link to="/return-policy">Returns & Warranty</Link>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/about-us">Our Story</Link>
                    </div>

                    <div className="footer-col newsletter-col">
                        <h4>Stay in the loop</h4>
                        <p>Get the latest deals and tech news.</p>
                        <form className="newsletter-form" onSubmit={handleSubmit}>
                            <input type="email" name="email" placeholder="Email address" required />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} UpCell. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default MyFooter