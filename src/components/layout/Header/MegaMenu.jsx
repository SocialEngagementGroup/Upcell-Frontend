import { Link } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

import MegaMenuCard from './MegaMenuCard';
import MegaMenuAside from './MegaMenuAside';

// The hover panel. Rendered inside the sticky header so it can be full-bleed
// under the bars without measuring anything, and so it inherits the header's
// stacking context — the scrim that dims the page sits between the two.
const MegaMenu = ({ panel, onPointerEnter, onPointerLeave }) => (
    <div
        id={panel.id}
        role="group"
        aria-label={panel.heading}
        className="absolute inset-x-0 top-full hidden border-t border-black/[0.08] bg-white shadow-surface md:block"
        onMouseEnter={onPointerEnter}
        onMouseLeave={onPointerLeave}
    >
        <div className="mx-auto flex max-w-site gap-6 px-6 py-8 lg:gap-10 lg:px-10">
            <MegaMenuAside aside={panel.aside} />

            <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[18px] font-bold tracking-tight text-apple-text">
                        {panel.heading}
                    </p>

                    <Link
                        to={panel.seeAll.to}
                        className="group flex shrink-0 items-center gap-1 rounded-full text-[13px] font-bold text-brand-red outline-none transition-colors duration-200 ease-smooth hover:text-[#b00a0d] focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                        {panel.seeAll.label}
                        <ArrowForwardRoundedIcon
                            aria-hidden="true"
                            className="!text-[16px] transition-transform duration-200 ease-smooth group-hover:translate-x-0.5"
                        />
                    </Link>
                </div>

                {/* auto-fill with a capped track, not 1fr: MacBook has two
                    model groups and iPhone has four, and stretched tiles would
                    make the two panels look like different components. */}
                <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(200px,220px))] gap-3">
                    {panel.tiles.map((tile) => (
                        <MegaMenuCard key={tile.to} tile={tile} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default MegaMenu;
