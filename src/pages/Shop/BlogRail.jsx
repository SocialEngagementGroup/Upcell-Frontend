import { Link } from 'react-router-dom';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { RAIL_ARROW_CLASS, railArrowTone, useRailScroll } from './useRailScroll';

// A titled rail of journal cards with a button under it — the reference's
// "The more you know" shape, which it reuses further down the page. Built as a
// component for the same reason: the sections differ only by heading, posts
// and button.
//
// The small line above each title is the post's date. The reference puts a
// content category there ("Samsung", "iPhone Articles and Guides"); UpCell's
// posts carry no category field, and inventing a taxonomy to fill the slot
// would be making up structure the journal does not have.
const BlogRail = ({ id, title, posts = [], cta }) => {
    const { trackRef, canScrollBack, canScrollOn, sync, nudge } = useRailScroll(posts.length);

    if (posts.length === 0) return null;

    const headingId = `${id}-heading`;

    return (
        <section id={id} aria-labelledby={headingId} className="scroll-mt-32 py-10 md:py-12">
            <div className="site-shell">
                <div className="flex items-center justify-between gap-4">
                    <h2 id={headingId} className="text-[1.625rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[2rem]">
                        {title}
                    </h2>

                    <div className="hidden shrink-0 items-center gap-3 md:flex">
                        <button
                            type="button"
                            onClick={() => nudge(-1)}
                            disabled={!canScrollBack}
                            aria-label={`Scroll ${title} left`}
                            className={`${RAIL_ARROW_CLASS} ${railArrowTone(canScrollBack)}`}
                        >
                            <ChevronLeftRoundedIcon aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => nudge(1)}
                            disabled={!canScrollOn}
                            aria-label={`Scroll ${title} right`}
                            className={`${RAIL_ARROW_CLASS} ${railArrowTone(canScrollOn)}`}
                        >
                            <ChevronRightRoundedIcon aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <ul
                    ref={trackRef}
                    onScroll={sync}
                    className="scrollbar-hidden -mx-1 mt-5 flex list-none items-stretch gap-4 overflow-x-auto scroll-smooth px-1 pb-1"
                >
                    {/* Card width sits on the li, not the article: a
                        percentage on the article would resolve against the li
                        rather than the track, and collapse to its content.
                        grow + shrink-0 means five or more posts hold the basis
                        and the rail scrolls, while fewer grow to fill the row
                        instead of leaving a gap where the missing ones would
                        be. */}
                    {posts.map((post) => (
                        <li key={post.slug} className="flex w-[260px] shrink-0 md:w-auto md:grow md:basis-[calc((100%-4rem)/5)]">
                            <article className="flex w-full flex-col overflow-hidden rounded-2xl bg-white transition-shadow duration-200 ease-smooth hover:shadow-surface">
                                {/* Placeholder entries carry an explicit
                                    linkTo, because they have no article route
                                    of their own to be built from a slug. */}
                                <Link
                                    to={post.linkTo || `/blogs/${post.slug}`}
                                    className="group flex flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                                >
                                    <span className="block overflow-hidden bg-surface-alt">
                                        {/* blogData resolves `image` to a delivery
                                            URL already — passing it through
                                            staticImageUrl again nests one URL
                                            inside another and the request 404s. */}
                                        <img
                                            src={post.image}
                                            alt=""
                                            width="600"
                                            height="340"
                                            decoding="async"
                                            className="block h-[160px] w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-[1.03]"
                                        />
                                    </span>

                                    <span className="flex flex-1 flex-col px-4 py-4">
                                        <span className="text-[0.875rem] font-normal text-apple-gray">
                                            {post.date}
                                        </span>
                                        <span className="mt-1.5 line-clamp-2 text-[1rem] font-bold leading-snug text-apple-text group-hover:text-brand-red">
                                            {post.title}
                                        </span>
                                    </span>
                                </Link>
                            </article>
                        </li>
                    ))}
                </ul>

                {cta && (
                    <div className="mt-8 flex justify-center">
                        <Link
                            to={cta.to}
                            className="inline-flex h-12 items-center justify-center rounded-lg bg-apple-text px-8 text-[1rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                        >
                            {cta.label}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogRail;
