import { Link } from 'react-router-dom'

// Modern Icons
const SocialIcons = {
    Instagram: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    Facebook: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    Twitter: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
};

const MyFooter = () => {
    return (
        <footer className="bg-obsidian text-white pt-20 pb-10 mt-24 border-t border-white/10">
            <div className="max-w-site mx-auto px-[100px] lg:px-10">
                <div className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-[60px] mb-[60px] max-lg:grid-cols-2 max-lg:gap-10 max-[550px]:grid-cols-1 max-[550px]:text-center">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <img className='h-[85px] w-auto object-contain mb-5 self-start max-[550px]:self-center' src='/staticImages/upcellLogo.png' alt="UpCell" />
                        <p className="text-sm leading-relaxed text-zinc-muted max-w-[280px] mb-6 max-[550px]:mx-auto">
                            Making technology affordable and sustainable by extending the life of premium electronics.
                        </p>
                        <div className="flex gap-5 max-[550px]:justify-center">
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-zinc-muted transition-all duration-300 ease-smooth hover:text-white hover:-translate-y-[3px]"><SocialIcons.Instagram /></a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-zinc-muted transition-all duration-300 ease-smooth hover:text-white hover:-translate-y-[3px]"><SocialIcons.Facebook /></a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-zinc-muted transition-all duration-300 ease-smooth hover:text-white hover:-translate-y-[3px]"><SocialIcons.Twitter /></a>
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-[0.1em] text-white mb-2">Shop</h4>
                        <Link to="/shop" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">All Products</Link>
                        <Link to="/shop?category=iPhone" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">iPhone</Link>
                        <Link to="/shop?category=iPad" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">iPad</Link>
                        <Link to="/shop?category=MacBook" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">MacBook</Link>
                        <Link to="/sell-device" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">Sell Your Device</Link>
                    </div>

                    {/* Company Column */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-[0.1em] text-white mb-2">Company</h4>
                        <Link to="/about-us" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">About Us</Link>
                        <Link to="/resources" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">Blogs & News</Link>
                        <Link to="/contactus" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">Contact Us</Link>
                        <Link to="/myaccount" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">My Account</Link>
                        <Link to="/login" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">Sign In / Register</Link>
                    </div>

                    {/* Legal Column */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-[0.1em] text-white mb-2">Legal</h4>
                        <Link to="/return-policy" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">Warranty & Returns</Link>
                        <Link to="/privacy-policy" className="text-[15px] text-zinc-muted transition-all duration-300 ease-smooth hover:text-brand-red hover:translate-x-1">Privacy Policy</Link>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/10 text-center">
                    <p className="text-[13px] text-zinc-dark">&copy; {new Date().getFullYear()} UpCell. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default MyFooter