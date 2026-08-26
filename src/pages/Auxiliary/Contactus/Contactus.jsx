import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utilities/axiosInstance';
import { extractApiError, validateEmailAddress, validateRequiredText } from '../../../utilities/formValidation';
import useFormAnalytics from '../../../utilities/useFormAnalytics';

const faqs = [
    { q: 'How do I contact UpCell IT Inc.?', a: 'Email is the fastest path for order support, trade-ins, or return requests. Social channels are also monitored regularly and typically see responses within 24 hours.' },
    { q: 'How do I cancel an order?', a: 'Send your order ID as quickly as possible. If the order has not shipped, we can usually help before dispatch. Once an item is with our carrier, the standard return process applies.' },
    { q: 'Where can I find order details?', a: 'Signed-in customers can review past order information inside the account area after purchase. You will also receive automated tracking updates via email.' },
    { q: 'How do you grade device condition?', a: "Every unit undergoes a 40-point inspection. 'Pristine' indicates zero cosmetic wear, while 'Like New' may have a single, nearly invisible mark. We never sell units with cracked glass or structural damage." },
    { q: 'What is the shipping timeline?', a: 'Most orders are processed within 1 business day. Standard shipping typically takes 3-7 business days across the US, while expedited options are available at checkout for urgent needs.' },
    { q: 'Do products come with a warranty?', a: 'Yes. All UpCell IT Inc. devices include a comprehensive 12-month limited warranty covering internal hardware defects. We also offer extended protection plans for accidental damage.' },
];

// Contact channels kept as content; the icons that fronted them were design.
const CONTACT_CHANNELS = [
    { title: 'Phone support', info: '+1 (380) 266-3942', href: 'tel:+13802663942' },
    { title: 'Email support', info: 'usa.Upcells@gmail.com', href: 'mailto:usa.Upcells@gmail.com' },
    { title: 'Facebook Messenger', info: 'facebook.com/usa.Upcells', href: 'https://www.facebook.com/usa.Upcells' },
    { title: 'Instagram Direct', info: '@Upcells_usa', href: 'https://www.instagram.com/Upcells_usa/' },
    { title: 'Our location', info: '973 Harrisburg Pike, Columbus, OH 43223', href: 'https://maps.google.com/?q=973+Harrisburg+Pike,+Columbus,+OH+43223' },
];

const Contactus = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const { markInteraction, trackSuccess, trackFailure } = useFormAnalytics('contact_support');

    const handleChange = (field) => (event) => {
        markInteraction();
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        const nameError = validateRequiredText('Name', formData.name, { min: 2, max: 120 });
        const emailError = validateEmailAddress(formData.email);
        const subjectError = validateRequiredText('Subject', formData.subject, { min: 4, max: 180 });
        const messageError = validateRequiredText('Message', formData.message, { min: 10, max: 3000 });
        const validationMessage = nameError || emailError || subjectError || messageError;

        if (validationMessage) {
            setSubmitMessage(validationMessage);
            trackFailure(validationMessage, { source: 'contact-form', phase: 'validation' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            await axiosInstance.post('contact-submissions', {
                name: formData.name.trim(),
                email: formData.email.trim(),
                subject: formData.subject.trim(),
                message: formData.message.trim(),
            });
            trackSuccess({ source: 'contact-form' });
            setFormData({ name: '', email: '', subject: '', message: '' });
            navigate('/contact-thank-you');
        } catch (error) {
            const failureMessage = extractApiError(error, 'Unable to send your message right now.');
            setSubmitMessage(failureMessage);
            trackFailure(failureMessage, { source: 'contact-form', phase: 'request' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // TODO(redesign): build the new support page UI here.
    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <span>Support</span>
            </nav>

            <h1>Contact UpCell IT Inc.: Premium Apple Device Support</h1>
            <p>
                Questions about a certified premium iPhone, iPad, or MacBook? Need help with a
                trade-in quote, order update, or return? Our team responds within 24 hours. Reach us
                by phone, email, Facebook, or Instagram.
            </p>

            <ul>
                {CONTACT_CHANNELS.map((item) => (
                    <li key={item.title}>
                        <a
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel="noreferrer"
                        >
                            <span>{item.title}</span>
                            <span>{item.info}</span>
                        </a>
                    </li>
                ))}
            </ul>

            <h2>Send us a message</h2>
            <p>Direct inquiries are monitored 6 days a week.</p>
            <form onSubmit={handleSubmit}>
                <input placeholder="Full name" value={formData.name} onChange={handleChange('name')} required />
                <input type="email" placeholder="Email address" value={formData.email} onChange={handleChange('email')} required />
                <input placeholder="Subject" value={formData.subject} onChange={handleChange('subject')} required />
                <textarea placeholder="Tell us how we can help." value={formData.message} onChange={handleChange('message')} required />
                {submitMessage && <p>{submitMessage}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>

            <h2>Frequently asked questions.</h2>
            <div>
                {faqs.map((item, index) => (
                    <div key={index}>
                        <button
                            type="button"
                            aria-expanded={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                        >
                            {item.q}
                        </button>
                        {openIndex === index && <p>{item.a}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Contactus;
