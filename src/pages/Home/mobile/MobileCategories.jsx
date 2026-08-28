import { Link } from 'react-router-dom';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { cloudinaryUrl } from '../../../utilities/cloudinary';
import { CATEGORIES } from './mobileHomeData';

// "Shop by category" — a mobile-only section, sitting between the hero and the
// shared sections. The desktop page reaches the same families through the
// header's mega menu, which has no mobile equivalent at this size.
const MobileCategories = () => (
    <>
        {/* ===============================================================
            Shop by category.
            =============================================================== */}
        <section aria-labelledby="m-categories-heading" className="px-4 pt-6">
            <div className="flex items-center justify-between gap-3">
                <h2
                    id="m-categories-heading"
                    className="text-[1.1875rem] font-bold leading-tight tracking-[-0.02em] text-apple-text"
                >
                    Shop by category
                </h2>

                <Link
                    to="/shop"
                    className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-full border border-solid border-black/[0.12] bg-white pl-3.5 pr-2.5 text-[0.8125rem] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:border-apple-text focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[16px]"
                >
                    See all
                    <ChevronRightRoundedIcon aria-hidden="true" />
                </Link>
            </div>

            <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-3 p-0">
                {CATEGORIES.map((category) => (
                    <li key={category.id}>
                        <Link
                            to={category.to}
                            className="group flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                        >
                            <span className="flex h-[124px] items-center justify-center overflow-hidden rounded-2xl bg-surface-alt">
                                <img
                                    src={cloudinaryUrl(category.image, { width: 320 })}
                                    alt=""
                                    width="320"
                                    height="320"
                                    decoding="async"
                                    className="block h-[86px] w-auto object-contain transition-transform duration-300 ease-smooth group-hover:scale-105"
                                />
                            </span>
                            <span className="mt-2 text-[0.9375rem] font-bold leading-tight text-apple-text group-hover:text-brand-red">
                                {category.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    </>
);

export default MobileCategories;
