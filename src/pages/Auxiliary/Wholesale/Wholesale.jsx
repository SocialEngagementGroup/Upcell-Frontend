import { toast } from "react-toastify";
import "./Wholesale.css"
import axiosInstance from "../../../utilities/axiosInstance";

const Wholesale = () => {

    const handleWholesale = (e) => {
        e.preventDefault()
        const name = e.target.name.value
        const phone = e.target.phone.value
        const email = e.target.email.value
        const company = e.target.company.value
        const note = e.target.note.value
        
        const data = {name, phone, email, company, note}

        axiosInstance.post('/add-run-form-submit/', data)
            .then(res => {
                toast("Thank you for your query. We will contact you soon.!!")
                e.target.reset()
            })
            .catch(err => {
                toast.error("Something went wrong. Please try again later.")
                console.log(err)
            })

    }
    return (
        <section className="wholesale-page">
            <div className="wholesale-hero">
                <div className="container-max">
                    <h1>Buy Bulk Products <span>at Wholesale Prices</span></h1>
                    <p>Unlock exclusive pricing for high-volume orders. Provide your details below and our team will provide a custom quotation within 24 hours.</p>
                </div>
            </div>

            <div className="container-max">
                <div className="wholesale-container">
                    <div className="wholesale-content-side">
                        <h2>Why Choose Upcell Wholesale?</h2>
                        <div className="wholesale-benefits">
                            <div className="benefit-item">
                                <div className="benefit-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                </div>
                                <div className="benefit-text">
                                    <h4>Unmatched Scalability</h4>
                                    <p>From 10 units to 10,000, we scale our supply to meet your business demands seamlessly.</p>
                                </div>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <div className="benefit-text">
                                    <h4>Certified Quality</h4>
                                    <p>Every single unit undergoes a 50+ point inspection to ensure the highest standards of reliability.</p>
                                </div>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                </div>
                                <div className="benefit-text">
                                    <h4>Global Logistics</h4>
                                    <p>Insured expedited shipping to over 50 countries with real-time tracking and dedicated support.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="wholesale-form-container">
                        <form onSubmit={handleWholesale} id="wholeSale-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input id="name" name="name" type="text" placeholder="Your name" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input id="phone" name="phone" type="text" placeholder="+1 (555) 000-0000" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Work Email</label>
                                <input id="email" name="email" type="email" placeholder="name@company.com" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="company">Company Name</label>
                                <input id="company" name="company" type="text" placeholder="Your business name" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="note">Order Requirements</label>
                                <textarea id="note" name="note" rows="4" placeholder="Tell us about the products and quantities you need..." required />
                            </div>

                            <button type="submit" className="btn-wholesale-submit">Request Custom Quote</button>
                        </form>
                    </div>
                </div>

                <div className="wholesale-process">
                    <h2>Our Wholesale Process</h2>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h4>Submit Inquiry</h4>
                            <p>Fill out the form with your requirements and contact information.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h4>Review Quote</h4>
                            <p>Our team will prepare a personalized quotation with special bulk pricing.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h4>Swift Delivery</h4>
                            <p>Once confirmed, your order is prioritized for rapid, insured shipping.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Wholesale;