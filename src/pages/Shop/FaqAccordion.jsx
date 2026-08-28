import { useState } from 'react';
import { Link } from 'react-router-dom';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

import { FAQS } from './shopContent';

// "Popular searches" — the reference's FAQ accordion.
//
// One row open at a time, as the reference has it. The trigger is a real
// button carrying aria-expanded and aria-controls, so the panel it opens is
// announced rather than just appearing.
const FaqAccordion = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section aria-labelledby="faq-heading" className="py-8 md:py-12">
            <div className="site-shell">
                <h2 id="faq-heading" className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.75rem]">
                    Popular searches
                </h2>

                <ul className="mx-auto mt-6 max-w-[900px] list-none p-0">
                    {FAQS.map((faq, index) => {
                        const open = index === openIndex;
                        const panelId = `faq-panel-${index}`;
                        const buttonId = `faq-trigger-${index}`;

                        return (
                            <li key={faq.q} className="border-b border-solid border-black/[0.08]">
                                <h3 className="m-0 text-[1rem]">
                                    <button
                                        type="button"
                                        id={buttonId}
                                        aria-expanded={open}
                                        aria-controls={panelId}
                                        onClick={() => setOpenIndex(open ? -1 : index)}
                                        className="flex w-full items-center justify-between gap-4 bg-transparent px-1 py-5 text-left text-[0.9375rem] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 md:text-[1rem] [&_svg]:!text-[22px]"
                                    >
                                        {faq.q}
                                        {open
                                            ? <RemoveRoundedIcon aria-hidden="true" className="shrink-0 text-apple-gray" />
                                            : <AddRoundedIcon aria-hidden="true" className="shrink-0 text-apple-gray" />}
                                    </button>
                                </h3>

                                {/* Unmounted rather than hidden: a collapsed
                                    answer should not be reachable by tabbing
                                    into a link inside it. */}
                                {open && (
                                    <div id={panelId} role="region" aria-labelledby={buttonId} className="px-1 pb-5">
                                        <p className="max-w-[76ch] text-[0.9375rem] font-normal leading-relaxed text-ink-soft">
                                            {faq.a}
                                        </p>

                                        {faq.to && (
                                            <Link
                                                to={faq.to}
                                                className="mt-2 inline-block text-[0.875rem] font-bold text-apple-text underline underline-offset-2 outline-none hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                                            >
                                                {faq.linkLabel}
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default FaqAccordion;
