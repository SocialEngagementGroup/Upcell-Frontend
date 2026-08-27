import { Link } from 'react-router-dom';
import AppleIcon from '@mui/icons-material/Apple';

// "Top brands, refurbished".
//
// UpCell sells Apple and nothing else, so only the first card is real. The
// other three are visible placeholders — dashed, unlinked, and labelled as
// such — rather than logos for brands the shop does not stock. A shopper who
// clicked a Dyson tile here would land on an all-Apple catalogue.
//
// When a second brand is actually stocked, replace a placeholder with an
// entry in BRANDS and it renders exactly like the Apple card.
const BRANDS = [
    { id: 'apple', label: 'Apple', to: '/shop' },
];

const PLACEHOLDER_COUNT = 3;

const TopBrands = () => (
    <section aria-labelledby="top-brands-heading" className="pb-10 md:pb-12">
        <div className="site-shell">
            <h2 id="top-brands-heading" className="text-[0.9375rem] font-bold tracking-[-0.01em] text-apple-text md:text-[1rem]">
                Top brands, refurbished
            </h2>

            <ul className="mt-4 grid list-none grid-cols-2 gap-4 md:grid-cols-4">
                {BRANDS.map((brand) => (
                    <li key={brand.id}>
                        <Link
                            to={brand.to}
                            aria-label={`Shop ${brand.label}`}
                            className="flex h-[110px] items-center justify-center rounded-2xl bg-white text-apple-text outline-none transition-shadow duration-200 ease-smooth hover:shadow-surface focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 md:h-[120px] [&_svg]:!text-[52px]"
                        >
                            <AppleIcon aria-hidden="true" />
                        </Link>
                    </li>
                ))}

                {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
                    <li key={`placeholder-${index}`}>
                        {/* Not a link and not a logo: there is nothing behind
                            it yet, and a tile that looks clickable but is not
                            is worse than one that plainly says so. */}
                        <div
                            aria-hidden="true"
                            className="flex h-[110px] items-center justify-center rounded-2xl border border-dashed border-black/[0.14] bg-white/60 text-[0.8125rem] font-medium text-apple-gray md:h-[120px]"
                        >
                            Brand coming soon
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

export default TopBrands;
