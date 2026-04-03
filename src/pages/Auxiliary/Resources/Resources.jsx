import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import unlockedPhoneImg from "../../../assets/notificationInfoImages/americanExpress.svg";
import phoneconditon from "../../../assets/notificationInfoImages/phoneCondition.svg";
import warranty from "../../../assets/notificationInfoImages/warranty-modal.svg";
import rrate from "../../../assets/r-rate.svg";

const articles = [
    { image: unlockedPhoneImg, title: 'Make your Apple purchase smarter', body: 'What to look for in a premium pre-owned device, from storage choices to condition grading.' },
    { image: rrate, title: 'Creative work on Apple hardware', body: 'How to choose the right iPhone, iPad, or MacBook for content, study, and everyday workflows.' },
    { image: warranty, title: 'Battery health and long-term value', body: 'A quick guide to preserving performance and understanding what battery condition means in real life.' },
    { image: phoneconditon, title: 'When to trade in your current device', body: 'Timing, condition, and model demand can all shape the value you receive back.' },
];

const faqs = [
    'How do I contact UpCell?',
    'How do I cancel an order?',
    'Where can I find my order details?',
    'How do refunds work?',
    'Which payment methods are accepted?',
    'What does the warranty cover?',
];

const Resources = () => {
    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Journal</span>
                    </nav>
                    <h1 className="text-[clamp(2.8rem,5vw,5rem)] leading-[0.92]">Guidance for buying, caring for, and trading premium Apple devices.</h1>
                    <p className="mt-5 max-w-[700px] text-lg leading-8 text-ink-soft">
                        A cleaner editorial space for practical device advice, support answers, and lifecycle thinking.
                    </p>
                </div>
            </section>

            <section className="page-container pb-10">

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {articles.map((article) => (
                        <div key={article.title} className="premium-card overflow-hidden rounded-[32px] p-5">
                            <div className="flex h-[220px] items-center justify-center rounded-[24px] bg-surface-alt p-6">
                                <img src={article.image} alt={article.title} className="max-h-full w-auto object-contain" />
                            </div>
                            <h3 className="mt-6 text-[30px]">{article.title}</h3>
                            <p className="mt-3 text-base leading-8 text-ink-soft">{article.body}</p>
                            <button className="premium-button-secondary mt-6">Read article</button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="page-container pb-10">
                <div className="mb-8">
                    <span className="eyebrow mb-4">Support answers</span>
                    <h2>Frequently asked questions.</h2>
                </div>
                <div className="grid gap-5">
                    {faqs.map((faq) => (
                        <div key={faq} className="premium-card rounded-[28px] p-6">
                            <h3 className="text-[26px]">{faq}</h3>
                            <p className="mt-3 text-base leading-8 text-ink-soft">Our support team can help with this quickly through email, and many answers are also reflected in your account and order flow.</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="page-container pb-16">
                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        { title: 'Customer first', body: 'We measure success by how clear and reliable the experience feels.' },
                        { title: 'Eco-conscious', body: 'Longer device lifecycles help reduce unnecessary electronic waste.' },
                        { title: 'Built on trust', body: 'Condition, price, and support all need to feel straightforward.' },
                    ].map((item) => (
                        <div key={item.title} className="premium-card rounded-[32px] p-8">
                            <h3 className="text-[28px]">{item.title}</h3>
                            <p className="mt-3 text-base leading-8 text-ink-soft">{item.body}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Resources;
