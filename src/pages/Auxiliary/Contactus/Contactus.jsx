import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axiosInstance from '../../../utilities/axiosInstance';

const faqs = [
    { q: 'How do I contact UpCell?', a: 'Email is the fastest path for order support, trade-ins, or return requests. Social channels are also monitored regularly and typically see responses within 24 hours.' },
    { q: 'How do I cancel an order?', a: 'Send your order ID as quickly as possible. If the order has not shipped, we can usually help before dispatch. Once an item is with our carrier, the standard return process applies.' },
    { q: 'Where can I find order details?', a: 'Signed-in customers can review past order information inside the account area after purchase. You will also receive automated tracking updates via email.' },
    { q: 'How do you grade device condition?', a: "Every unit undergoes a 40-point inspection. 'Pristine' indicates zero cosmetic wear, while 'Like New' may have a single, nearly invisible mark. We never sell units with cracked glass or structural damage." },
    { q: 'What is the shipping timeline?', a: 'Most orders are processed within 1 business day. Standard shipping typically takes 3-5 days across the US, while expedited options are available at checkout for urgent needs.' },
    { q: 'Do products come with a warranty?', a: 'Yes. All UpCell devices include a comprehensive 12-month limited warranty covering internal hardware defects. We also offer extended protection plans for accidental damage.' },
];

const Contactus = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (field) => (event) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            await axiosInstance.post('contact-submissions', {
                name: formData.name.trim(),
                email: formData.email.trim(),
                subject: formData.subject.trim(),
                message: formData.message.trim(),
            });
            setSubmitMessage('Message sent successfully. Our team will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setSubmitMessage(error?.response?.data?.error || 'Unable to send your message right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-shell">
            <section className="page-container pb-10 pt-6">
                <div className="premium-card rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/" className="hover:text-apple-text transition-colors">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span className="text-apple-text">Support</span>
                    </nav>
                    <h1 className="text-[clamp(2.8rem,5vw,5rem)] leading-[0.92]">Contact UpCell — Refurbished Apple Device Support</h1>
                    <p className="mt-5 max-w-[680px] text-lg leading-8 text-ink-soft">
                        Questions about a certified refurbished iPhone, iPad, or MacBook? Need help with a trade-in quote, order update, or return? Our team responds within 24 hours — reach us by email, Facebook, or Instagram.
                    </p>
                </div>
            </section>

            <section className="page-container pb-24">
                <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="flex flex-col justify-center space-y-10 py-6">
                        <div className="grid gap-6">
                            {[
                                { icon: <EmailOutlinedIcon />, title: 'Email support', info: 'usa.Upcells@gmail.com', href: 'mailto:usa.Upcells@gmail.com' },
                                { icon: <FacebookOutlinedIcon />, title: 'Facebook Messenger', info: 'facebook.com/usa.Upcells', href: 'https://www.facebook.com/usa.Upcells' },
                                { icon: <InstagramIcon />, title: 'Instagram Direct', info: '@Upcells_usa', href: 'https://www.instagram.com/Upcells_usa/' },
                            ].map((item) => (
                                <a 
                                    key={item.title} 
                                    href={item.href} 
                                    target={item.href.startsWith('http') ? '_blank' : undefined} 
                                    rel="noreferrer" 
                                    className="group flex items-center gap-5 transition-transform hover:translate-x-2"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-apple-gray/5 text-apple-text transition-all group-hover:bg-apple-text group-hover:text-white">
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-black uppercase tracking-widest text-apple-gray group-hover:text-apple-text transition-colors">{item.title}</span>
                                        <span className="text-lg text-apple-text">{item.info}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card rounded-[48px] bg-white p-10 md:p-14 shadow-medium transition-shadow hover:shadow-hover">
                        <div className="mb-10">
                            <h3 className="text-3xl font-black">Send us a message</h3>
                            <p className="mt-3 text-apple-gray">Direct inquiries are monitored 6 days a week.</p>
                        </div>
                        <form className="grid gap-6" onSubmit={handleSubmit}>
                            <div className="grid gap-6 md:grid-cols-2">
                                <input className="premium-input bg-apple-gray/5 border-transparent focus:bg-white" placeholder="Full name" value={formData.name} onChange={handleChange('name')} required />
                                <input className="premium-input bg-apple-gray/5 border-transparent focus:bg-white" type="email" placeholder="Email address" value={formData.email} onChange={handleChange('email')} required />
                            </div>
                            <input className="premium-input bg-apple-gray/5 border-transparent focus:bg-white" placeholder="Subject" value={formData.subject} onChange={handleChange('subject')} required />
                            <textarea className="premium-input min-h-[220px] resize-none py-4 bg-apple-gray/5 border-transparent focus:bg-white" placeholder="Tell us how we can help." value={formData.message} onChange={handleChange('message')} required />
                            {submitMessage && (
                                <p className="text-sm text-apple-gray">{submitMessage}</p>
                            )}
                            <button type="submit" disabled={isSubmitting} className="h-[56px] px-10 rounded-full bg-apple-text text-white font-black text-lg transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70">
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="page-container pb-24">
                <div className="mx-auto max-w-[800px]">
                    <div className="mb-14 text-center">
                        <h2 className="text-[clamp(2.4rem,4vw,3.6rem)] tracking-tight">Frequently asked questions.</h2>
                    </div>
                    
                    <div className="grid gap-4">
                        {faqs.map((item, index) => (
                            <div 
                                key={index} 
                                className={`overflow-hidden rounded-[32px] border transition-all duration-500 ${openIndex === index ? 'border-apple-text bg-white shadow-medium' : 'border-apple-gray/10 bg-apple-gray/5 hover:border-apple-gray/30'}`}
                            >
                                <button 
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    className="flex w-full items-center justify-between p-8 text-left"
                                >
                                    <h3 className="pr-8 text-xl font-black tracking-tight md:text-2xl">{item.q}</h3>
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${openIndex === index ? 'bg-apple-text text-white rotate-180' : 'bg-white text-apple-text'}`}>
                                        {openIndex === index ? <RemoveIcon className="!text-lg" /> : <AddIcon className="!text-lg" />}
                                    </div>
                                </button>
                                
                                <div 
                                    className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-8 pb-8 text-lg leading-relaxed text-ink-soft opacity-80">
                                        {item.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contactus;
