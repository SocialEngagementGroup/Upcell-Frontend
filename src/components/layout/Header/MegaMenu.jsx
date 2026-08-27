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

            {/* No left padding: the rail's column is always at least 32px
                wider than its grey band, so that difference is the gutter.
                Adding padding here would push the grid off the logo's line. */}
            <div className="mega-main min-w-0 flex-1 py-7 lg:py-8">
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

                {/* A fixed four, not auto-fill. Every panel now carries four
                    tiles, and auto-fill was sizing tracks off the maximum —
                    which left a fifth empty track and 552px of dead space at
                    1920. Four columns simply divide whatever the row is. */}
                <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-4">
                    {panel.tiles.map((tile) => (
                        <MegaMenuCard key={tile.to} tile={tile} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default MegaMenu;
