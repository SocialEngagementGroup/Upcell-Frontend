import { Link } from 'react-router-dom';

import MegaMenuCard from './MegaMenuCard';
import MegaMenuAside from './MegaMenuAside';

// The hover panel. Rendered inside the sticky header so it can be full-bleed
// under the bars without measuring anything, and so it inherits the header's
// stacking context — the scrim that dims the page sits between the two.
//
// Deliberately NOT inside .header-shell: the other three rows are capped at
// 1200px, but this panel spans the viewport, with the promo rail running to
// the left edge exactly as in the reference. Capping it here would leave the
// rail floating in the middle of a white band.
const MegaMenu = ({ panel, onPointerEnter, onPointerLeave }) => (
    <div
        id={panel.id}
        role="group"
        aria-label={panel.heading}
        className="absolute inset-x-0 top-full hidden border-t border-black/[0.08] bg-white shadow-surface md:block"
        onMouseEnter={onPointerEnter}
        onMouseLeave={onPointerLeave}
    >
        <div className="flex items-stretch">
            <MegaMenuAside aside={panel.aside} />

            <div className="min-w-0 flex-1 px-6 py-7 lg:px-10 lg:py-8">
                <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[16px] font-medium text-ink-soft">
                        {panel.heading}
                    </p>

                    <Link
                        to={panel.seeAll.to}
                        className="shrink-0 rounded-sm text-[15px] font-bold text-apple-text underline underline-offset-4 outline-none transition-colors duration-200 ease-smooth hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                        {panel.seeAll.label}
                    </Link>
                </div>

                {/* The cap is sized so a four-group family fills the row at
                    1440 rather than trailing off into dead space, while
                    auto-fill still stops MacBook's two tiles from stretching
                    to twice the width of iPhone's four. */}
                <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(200px,250px))] gap-x-5 gap-y-6">
                    {panel.tiles.map((tile) => (
                        <MegaMenuCard key={tile.to} tile={tile} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default MegaMenu;
