import React, { useState } from 'react';

const faqs = [
    {
        q: `What are certified premium devices ?`,
        a: `Certified premium is not the same thing as used or secondhand. The sellers we partner with are held to rigorous quality guidelines that ensure every item we sell runs like new. The certification process they adhere to includes meticulously cleaning, testing, and assessing every item, as well as replacing aging parts with high-quality new components. Meanwhile, with secondhand or used items, you’re left to the private seller’s good word as to their true condition, and with no guarantee or warranty.`,
    },
    {
        q: `What does the 30 days warranty cover ?`,
        a: `This warranty is limited to technical defects and component issues that affect the functionality of your item. It doesn't cover accidental breakage or compatibility and software upgrade issues, so make sure you read up about the limits of older models and check your phone carrier's website for models they don't support.`,
    },
    {
        q: `Will I be able to update the software on this phone ?`,
        a: `Yes! This device is compatible with the latest software updates.`,
    },
    {
        q: `Which payment methods are availbale ?`,
        a: `We accept Visa, MasterCard, Discover, and American Express, as well as PayPal. We don’t accept payments via bank transfer, check, or cash.`,
    },
    {
        q: `What's the Upcell quality assurance fee for ?`,
        a: `This fee allows us to vet and monitor the sellers we partner with, ensuring they meet our rigorous quality and customer-service standards. Your happiness is our top priority!`,
    },
];

const FrequestlyAsked = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                    <div key={faq.q} className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
                        <button
                            type="button"
                            onClick={() => setOpenIndex(isOpen ? -1 : index)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between gap-4 bg-transparent px-5 py-4 text-left"
                        >
                            <h3 className={`m-0 text-base font-bold transition-colors duration-300 ${isOpen ? 'text-brand-red' : 'text-apple-text'}`}>{faq.q}</h3>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-red' : 'text-apple-gray'}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        <div className={`grid transition-all duration-300 ease-smooth ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                                <p className="px-5 pb-5 text-[15px] leading-relaxed text-apple-gray">{faq.a}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FrequestlyAsked;
