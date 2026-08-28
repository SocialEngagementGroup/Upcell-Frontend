import { Link } from 'react-router-dom';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

// The promise block. One component for both sizes: a 2x2 grid of cards on
// mobile, the same four in a row on desktop, with the button full width below
// the grid on mobile and sized to its label on desktop.
//
// The heading is the site's own — "The UpCellIT Promise" is already what the
// header's first utility link is called, and it already points at /about, so
// this section and that link say the same thing and lead to the same place.
//
// The four facts are UpCell's, not the reference's. Two differ from it and
// both differences matter:
//
//   * The inspection is 40 points, not 100 (AboutUs, Contactus and the
//     product page all say 40).
//   * Returns are not free. The return policy makes the buyer responsible for
//     return shipping unless the fault is UpCell's, so the window is stated
//     and the word "free" is not.
const PROMISES = [
    {
        id: 'warranty',
        Icon: WorkspacePremiumOutlinedIcon,
        label: '12-month warranty',
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
        id: 'graded',
        Icon: AutoAwesomeOutlinedIcon,
        label: 'Professionally refurbished',
    },
];

const PromiseSection = () => (
    <section aria-labelledby="promise-heading" className="py-8 md:py-12">
        <div className="site-shell">
            <div className="rounded-3xl border border-solid border-black/[0.06] bg-surface-alt p-5 md:p-8">
                {/* The base layer sizes h2 at text-4xl/extrabold; both are
                    overridden — Roboto has no 800 face loaded, and 36px is a
                    page-title size, not a section one. */}
                <h2
                    id="promise-heading"
                    className="max-w-[22ch] text-[1.25rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.75rem]"
                >
                    The UpCellIT Promise: every device checked before it ships
                </h2>

                <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-3 p-0 md:mt-7 md:grid-cols-4 md:gap-4">
                    {PROMISES.map(({ id, Icon, label }) => (
                        <li key={id} className="h-full">
                            <div className="flex h-full flex-col rounded-2xl border border-solid border-black/[0.06] bg-white p-4 md:p-5">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-alt text-apple-text [&_svg]:!text-[22px]">
                                    <Icon aria-hidden="true" />
                                </span>

                                <p className="mt-8 text-[0.875rem] font-bold leading-snug text-apple-text md:mt-10 md:text-[0.9375rem]">
                                    {label}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>

                <Link
                    to="/about"
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-apple-text px-8 text-[0.9375rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 md:mt-7 md:w-auto [&_svg]:!text-[19px]"
                >
                    Our commitment
                    <ArrowForwardRoundedIcon aria-hidden="true" />
                </Link>
            </div>
        </div>
    </section>
);

export default PromiseSection;
