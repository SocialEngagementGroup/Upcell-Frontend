import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Handshake } from "@mui/icons-material";

const values = [
    { title: "Customer First", desc: "We design every experience around clarity, support, and long-term satisfaction." },
    { title: "Earn Trust", desc: "Honest grading, transparent pricing, and clear communication matter more than hype." },
    { title: "Simplify", desc: "We reduce friction in buying, trading, and supporting premium technology." },
    { title: "Responsible Growth", desc: "Giving Apple products a longer life reduces waste and extends value." },
    { title: "Collaboration", desc: "Our work blends technical care, service thinking, and real human support." },
    { title: "Do Good", desc: "We aim to make premium technology more accessible without losing quality." },
];

const AboutUs = () => {
    return (
        <div className="page-shell">
            <section className="page-container py-8">
                <div className="premium-card overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">About</span>
                    </nav>
                    <h1 className="text-[clamp(2.8rem,5vw,5rem)] leading-[0.92]">About UpCell — Certified Refurbished Apple Devices You Can Trust</h1>
                    <p className="mt-5 max-w-[700px] text-lg leading-8 text-ink-soft">
                        UpCell is a certified reseller of pre-owned Apple hardware — sourcing, inspecting, and presenting every refurbished iPhone, iPad, and MacBook to a higher standard than a typical secondhand marketplace.
                    </p>
                </div>
            </section>

            <section className="page-container py-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
                    <div className="premium-card rounded-[36px] p-8 md:p-10">
                        <h2>Our mission</h2>
                        <p className="mt-5 text-lg leading-8 text-ink-soft">
                            We source and certify pre-owned Apple devices against a rigorous 40-point inspection standard covering hardware performance, battery health, and cosmetic condition. Every refurbished iPhone, iPad, and MacBook is graded honestly — so you know exactly what you're getting.
                        </p>
                        <p className="mt-5 text-lg leading-8 text-ink-soft">
                            That means transparent pricing, accurate condition grades, a 12-month warranty on every device, and an experience that respects both the product and the customer choosing it.
                        </p>
                    </div>
                    <div className="premium-card overflow-hidden rounded-[36px] p-3">
                        <img src="/staticImages/bgAboutUs.png" alt="About UpCell" className="h-full w-full rounded-[28px] object-cover" />
                    </div>
                </div>
            </section>

            <section className="page-container pb-24 pt-8">
                <div className="mb-12">
                    <h2>What guides UpCell.</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {values.map((value, index) => (
                        <div key={index} className="premium-card rounded-[32px] p-8">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-alt">
                                {index === 4 ? <Handshake /> : <span className="text-lg font-extrabold text-apple-text">{index + 1}</span>}
                            </div>
                            <h3 className="text-[28px]">{value.title}</h3>
                            <p className="mt-3 text-base leading-8 text-ink-soft">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
