import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const faqs = [
    { q: 'How do I contact UpCell?', a: 'Email is the fastest path for order support, trade-ins, or return requests. Social channels are also monitored regularly.' },
    { q: 'How do I cancel an order?', a: 'Send your order ID as quickly as possible. If the order has not shipped, we can usually help before dispatch.' },
    { q: 'Where can I find order details?', a: 'Signed-in customers can review past order information inside the account area after purchase.' },
];

const Contactus = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Contact</span>
                    </nav>
                    <h1 className="text-[clamp(2.8rem,5vw,5rem)] leading-[0.92]">A support experience that feels as considered as the products.</h1>
                    <p className="mt-5 max-w-[680px] text-lg leading-8 text-ink-soft">
                        Reach out for product questions, order updates, trade-in guidance, or returns. We keep communication direct and practical.
                    </p>
                </div>
            </section>

            <section className="page-container pb-10">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-6">
                        {[
                            { icon: <EmailOutlinedIcon />, title: 'Email support', info: 'usa.Upcells@gmail.com', href: 'mailto:usa.Upcells@gmail.com' },
                            { icon: <FacebookOutlinedIcon />, title: 'Facebook', info: 'facebook.com/usa.Upcells', href: 'https://www.facebook.com/usa.Upcells' },
                            { icon: <InstagramIcon />, title: 'Instagram', info: '@Upcells_usa', href: 'https://www.instagram.com/Upcells_usa/' },
                        ].map((item) => (
                            <a key={item.title} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="premium-card flex items-center gap-4 rounded-[30px] p-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-apple-text">{item.icon}</div>
                                <div>
                                    <div className="font-bold text-apple-text">{item.title}</div>
                                    <div className="mt-1 text-sm text-ink-soft">{item.info}</div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="premium-card rounded-[36px] p-8 md:p-10">
                        <h2>Send us a message</h2>
                        <form className="mt-6 grid gap-4" onSubmit={(e) => e.preventDefault()}>
                            <input className="premium-input" placeholder="Full name" required />
                            <input className="premium-input" type="email" placeholder="Email address" required />
                            <input className="premium-input" placeholder="Subject" required />
                            <textarea className="premium-input min-h-[180px] resize-none py-4" placeholder="Tell us how we can help." required />
                            <button className="premium-button mt-2 w-fit">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="page-container pb-16">
                <div className="mb-8">
                    <span className="eyebrow mb-4">FAQs</span>
                    <h2>Quick answers.</h2>
                </div>
                <div className="grid gap-5">
                    {faqs.map((item) => (
                        <div key={item.q} className="premium-card rounded-[28px] p-6">
                            <h3 className="text-[26px]">{item.q}</h3>
                            <p className="mt-3 text-base leading-8 text-ink-soft">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Contactus;
