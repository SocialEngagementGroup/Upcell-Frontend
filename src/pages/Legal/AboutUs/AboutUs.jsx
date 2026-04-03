import { Handshake } from "@mui/icons-material";

const AboutUs = () => {
    return (
        <div className="bg-white min-h-screen">
            <header className="bg-surface-alt py-24 text-center rounded-b-[60px] mb-20">
                <div className="max-w-site mx-auto px-[100px] lg:px-10">
                    <h1 className="mb-4">Tech with a <span className="text-brand-red">Conscience</span></h1>
                    <p className="max-w-[600px] mx-auto text-lg leading-normal">We are a team of technicians and entrepreneurs specializing in sourcing quality electronics at competitive prices, with over 15 years of industry experience.</p>
                </div>
            </header>

            <section className="py-20">
                <div className="max-w-site mx-auto px-[100px] lg:px-10">
                    <div className="grid grid-cols-2 gap-20 items-center max-lg:grid-cols-1">
                        <div>
                            <h2 className="mb-6">Our Mission</h2>
                            <p className="text-lg leading-relaxed text-apple-gray">
                                Welcome to UpCell. We specialize in sourcing quality pre-owned products at competitive prices, aiming to make premium technology accessible to everyone.
                                We pride ourselves on honesty, quality, and a commitment to longevity. Our products are fairly priced and accurately represented, because we believe in quality over quantity.
                            </p>
                        </div>
                        <div>
                            <img src="/staticImages/bgAboutUs.png" alt="About UpCell" className="w-full rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08)]" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-site mx-auto px-[100px] lg:px-10 border-t border-black/5 pt-20">
                    <div className="text-center mb-16">
                        <h2 className="tracking-tight">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
                        {[
                            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>, title: "Customer First", desc: "Treat customers great and great customers will treat you well. We are customer-focused and measure ourselves against their success." },
                            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>, title: "Earn Trust", desc: "Be honest and transparent through every interaction with customers, employees, and partners. Trust is our most valuable asset." },
                            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>, title: "Simplify", desc: "Never settle for what has been done. Be creative and innovative using first-principle thinking while reducing complexity." },
                            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: "Responsible Growth", desc: "Make environmentally sustainable decisions that last for generations through recycling, reusing, or trading." },
                            { icon: <Handshake />, title: "True Collaboration", desc: "We build positive culture and family spirit. Inclusive environments where all ideas are heard and valued." },
                            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, title: "Do Good", desc: "Be kind and take care of your neighbor. Do what is right, do what is good, and find balance in all things." }
                        ].map((v, i) => (
                            <div key={i} className="bg-surface-alt p-10 rounded-3xl shadow-soft transition-all duration-[400ms] hover:shadow-medium hover:-translate-y-1.5">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">{v.icon}</div>
                                <h4 className="mb-3">{v.title}</h4>
                                <p className="text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;