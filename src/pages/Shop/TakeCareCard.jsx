import { Link } from 'react-router-dom';

import { STATIC_IMAGES, staticImageUrl } from '../../constants/staticImages';

// "Take care of your tech".
//
// The reference runs a video here — a centred heading over a single media card
// with a play control. UpCell has no video footage in the repo, so this is the
// same block built around a still and a real guide instead.
//
// Deliberately no play triangle. A control that looks like it plays a video and
// instead opens an article is a broken promise, not a placeholder. When there
// is footage, this card is where a <video> goes and nothing around it moves.
const TakeCareCard = () => (
    <section aria-labelledby="take-care-heading" className="py-8 md:py-10">
        <div className="site-shell">
            <h2
                id="take-care-heading"
                className="text-center text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.75rem]"
            >
                Take care of your tech
            </h2>

            <div className="mt-6 overflow-hidden rounded-3xl border border-solid border-black/[0.06] bg-white">
                <div className="flex flex-col md:flex-row md:items-stretch">
                    <div className="shrink-0 md:w-[46%]">
                        <img
                            src={staticImageUrl(STATIC_IMAGES.BLOG_BATTERY_HEALTH, 900)}
                            alt=""
                            width="900"
                            height="600"
                            decoding="async"
                            className="block h-[220px] w-full object-cover md:h-full md:min-h-[300px]"
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center p-6 md:p-10">
                        <p className="text-[0.8125rem] font-medium uppercase tracking-wide text-apple-gray">
                            From the Tech Journal
                        </p>

                        <h3 className="mt-2 text-[1.25rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.5rem]">
                            Battery health and long-term value
                        </h3>

                        <p className="mt-2.5 max-w-[52ch] text-[0.9375rem] font-normal leading-relaxed text-ink-soft">
                            A short guide to keeping performance up over time, and to reading what a
                            battery condition figure actually means day to day.
                        </p>

                        <Link
                            to="/blogs/battery-health-guide"
                            className="mt-5 inline-flex h-11 w-fit items-center justify-center rounded-lg bg-apple-text px-6 text-[0.9375rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                        >
                            Read the guide
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default TakeCareCard;
