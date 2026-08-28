import { Link } from 'react-router-dom';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { resolveImageSrc } from '../../utilities/cloudinary';

const money = (value) => Number(value || 0).toFixed(2);

// Price with the cents set smaller and raised, as the reference does. Split
// rather than styled whole so the dollars keep their weight at a glance.
const Price = ({ value }) => {
    const [dollars, cents] = money(value).split('.');

    return (
        <p className="text-[1.375rem] font-bold leading-none text-apple-text">
            <span className="align-top text-[0.875rem]">$</span>
            {dollars}
            <span className="align-top text-[0.875rem]">.{cents}</span>
        </p>
    );
};

// Five stars from reviewScore, halves included. aria-hidden because the
// score is written out in text beside them.
const Stars = ({ score }) => (
    <span aria-hidden="true" className="flex items-center text-brand-red [&_svg]:!text-[15px]">
        {[0, 1, 2, 3, 4].map((i) => {
            const filled = score - i;
            if (filled >= 0.75) return <StarRoundedIcon key={i} />;
            if (filled >= 0.25) return <StarHalfRoundedIcon key={i} />;
            return <StarOutlineRoundedIcon key={i} className="text-apple-gray/50" />;
        })}
    </span>
);

// One product. Every line here is a real field on the product document —
// grade, colour and storage make the spec line, reviewScore and
// peopleReviewed the rating, originalPrice the saving. A card simply omits
// whatever a given product has not been given.
//
// Two presentations of the same card, as the reference has:
//   priceDrop   — the discount is the story: red badge, the saving spelled
//                 out, and the previous price under it.
//   bestSeller  — the product is the story: no badge, no saving, just the
//                 price with the new-device price struck through beside it.
const ProductCard = ({ product, onAddToCart, variant = 'priceDrop' }) => {
    const isPriceDrop = variant === 'priceDrop';
    const was = Number(product.originalPrice || 0);
    const now = Number(product.price || 0);
    const saving = was > now ? was - now : 0;

    const specs = [product.grade, product.color?.name, product.storage].filter(Boolean).join(' · ');
    const score = Number(product.reviewScore || 0);
    const reviews = Number(product.peopleReviewed || 0);

    return (
        <article className="flex h-full w-[240px] shrink-0 flex-col rounded-2xl border border-black/[0.06] bg-white p-3 transition-shadow duration-200 ease-smooth hover:shadow-surface md:w-[260px]">
            <Link
                to={product.linkTo || `/iphone/${product.parentCatagory || product.parentId}/${product._id}`}
                className="group flex flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
            >
                <span className="block overflow-hidden rounded-xl bg-surface">
                    <img
                        src={resolveImageSrc(product.image, { width: 420 })}
                        alt=""
                        width="420"
                        height="420"
                        loading="lazy"
                        decoding="async"
                        className="mx-auto block h-[150px] w-auto object-contain p-3 transition-transform duration-300 ease-smooth group-hover:scale-[1.03]"
                    />
                </span>

                {isPriceDrop && saving > 0 && (
                    <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-md bg-brand-red px-2 py-1 text-[0.75rem] font-bold text-white [&_svg]:!text-[14px]">
                        <TrendingDownRoundedIcon aria-hidden="true" />
                        Price drop
                    </span>
                )}

                <h3 className={`${isPriceDrop && saving > 0 ? 'mt-2' : 'mt-3'} text-[0.9375rem] font-bold leading-tight text-apple-text group-hover:text-brand-red`}>
                    {product.productName}
                </h3>

                {specs && (
                    <p className="mt-1 text-[0.8125rem] font-normal leading-snug text-apple-gray">
                        {specs}
                    </p>
                )}

                {score > 0 && (
                    <span className="mt-2 flex items-center gap-1.5">
                        <Stars score={score} />
                        <span className="text-[0.8125rem] font-medium text-apple-text">{score}/5</span>
                        {reviews > 0 && (
                            <span className="text-[0.8125rem] font-normal text-apple-gray">({reviews.toLocaleString()})</span>
                        )}
                    </span>
                )}

                <span className="mt-3 block">
                    <Price value={now} />

                    {isPriceDrop && saving > 0 && (
                        <>
                            <span className="mt-1 block text-[0.8125rem] font-bold text-brand-red">
                                Save ${money(saving)}
                            </span>
                            {/* "Was", not the reference's "Last lowest price":
                                originalPrice is the list price on the product,
                                not a tracked price history. */}
                            <span className="mt-0.5 flex items-center gap-1 text-[0.75rem] font-normal text-apple-gray">
                                Was ${money(was)}
                                <InfoOutlinedIcon aria-hidden="true" className="!text-[13px]" />
                            </span>
                        </>
                    )}

                    {!isPriceDrop && was > now && (
                        // The reference reads "$629.00 new" — the price struck
                        // through, the word after it plain. originalPrice is the
                        // closest field we hold to a new-device price.
                        <span className="mt-1 block text-[0.8125rem] font-normal text-apple-gray">
                            <s>${money(was)}</s> new
                        </span>
                    )}
                </span>
            </Link>

            <button
                type="button"
                onClick={(event) => onAddToCart(event, product._id)}
                disabled={product.outOfStock}
                className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-solid border-black/[0.12] bg-white text-[0.875rem] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:border-apple-text hover:bg-apple-bg focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-apple-gray disabled:hover:border-black/[0.12] disabled:hover:bg-white [&_svg]:!text-[18px]"
            >
                <AddRoundedIcon aria-hidden="true" />
                {product.outOfStock ? 'Out of stock' : 'Add to cart'}
            </button>
        </article>
    );
};

export default ProductCard;
