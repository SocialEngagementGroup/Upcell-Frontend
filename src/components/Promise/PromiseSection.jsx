import { Link } from 'react-router-dom';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

// The promise block, in the two shapes the reference gives it.
//
// Desktop: a large centred headline, a centred line under it carrying the
// promise as an inline underlined link, then the four facts flat on the page
// background as one row — icon tile with its label beside it, no cards and no
// panel.
//
// Mobile: a left-aligned heading over a panel holding the same four as a 2x2
// grid of cards, icon above label, with a full width button under it.
//
// So the two extras swap rather than stack: the subline is desktop only, the
// button is mobile only, and each carries the same destination.
//
// The name is the site's own — "The UpCellIT Promise" is already what the
// header's first utility link is called, and it already points at /about, so
// this block and that link say the same thing and lead to the same place.
//
// The four facts are UpCell's, not the reference's. Two differ, and both
// differences are the reason for checking:
//
//   * The inspection is 40 points, not 100 (AboutUs, Contactus and the
//     product page all say 40).
//   * Returns are not free. The return policy makes the buyer responsible for
//     return shipping unless the fault is UpCell's, so the window is stated
//     and the word "free" is not.
const PROMISES = [
    {
        id: 'graded',
        Icon: AutoAwesomeOutlinedIcon,
        label: 'Professionally refurbished',
    },
    {
        id: 'inspection',
        Icon: ChecklistRoundedIcon,
        label: '40-point quality inspection',
    },
    {
        id: 'returns',
        Icon: EventRepeatOutlinedIcon,
        label: '30-day return window',
    },
    {
        id: 'warranty',
        Icon: WorkspacePremiumOutlinedIcon,
        label: '12-month warranty',
    },
];

const PromiseSection = () => (
    <section aria-labelledby="promise-heading" className="py-10 md:py-12">
        <div className="site-shell">
            {/* The base layer sizes h2 at text-4xl and font-extrabold; both are
                overridden — Roboto has no 800 face loaded, and the two sizes
                here are set per breakpoint. */}
            <h2
                id="promise-heading"
                className="text-[1.375rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-center md:text-[2.75rem] md:tracking-[-0.04em] lg:text-[3.25rem]"
            >
                <span className="md:hidden">The UpCellIT Promise: every device checked before it ships</span>
                <span className="hidden md:inline">Apple hardware, without the new-device price.</span>
            </h2>

            {/* Desktop only — on mobile the same destination is the button
                under the grid, so showing both would be two routes to /about
                sitting inches apart. */}
            <p className="hidden text-center text-[1.0625rem] font-normal leading-relaxed text-ink-soft md:mx-auto md:mt-4 md:block md:max-w-[64ch] md:text-[1.125rem]">
                Inspected, graded and warrantied before it reaches you. Backed by{' '}
                <Link
                    to="/about"
                    className="font-medium text-apple-text underline underline-offset-2 outline-none hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                >
                    the UpCellIT Promise
                </Link>
                .
            </p>

            <div className="mt-5 rounded-3xl border border-solid border-black/[0.06] bg-surface-alt p-5 md:mt-10 md:rounded-none md:border-0 md:bg-transparent md:p-0">
                <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4 md:gap-8">
                    {PROMISES.map(({ id, Icon, label }) => (
                        <li key={id} className="h-full">
                            {/* Card on mobile, flat row on desktop: the border,
                                background and padding all go at md, and the
                                stack becomes a horizontal pair. */}
                            <div className="flex h-full flex-col rounded-2xl border border-solid border-black/[0.06] bg-white p-4 md:flex-row md:items-center md:gap-3 md:rounded-none md:border-0 md:bg-transparent md:p-0">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-apple-text [&_svg]:!text-[22px]">
                                    <Icon aria-hidden="true" />
                                </span>

                                <p className="mt-8 text-[0.9375rem] font-bold leading-snug text-apple-text md:mt-0 md:text-[1rem]">
                                    {label}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Mobile only — the desktop route to /about is the link in the
                    subline above. */}
                <Link
                    to="/about"
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-apple-text px-8 text-[1rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 md:hidden [&_svg]:!text-[19px]"
                >
                    Our commitment
                    <ArrowForwardRoundedIcon aria-hidden="true" />
                </Link>
            </div>
        </div>
    </section>
);

export default PromiseSection;
