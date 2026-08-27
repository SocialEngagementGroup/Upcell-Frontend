import { Link } from 'react-router-dom';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';

// One model-group tile. Deliberately type-only: UpCell has no per-model
// artwork, and a stock photo of the wrong colourway or a repeated hero shot
// reads worse than a well-set label. Hover raises the border to brand red
// rather than moving the tile, so a grid of them stays still under the cursor.
const MegaMenuCard = ({ tile }) => (
    <Link
        to={tile.to}
        className="group flex min-h-[92px] flex-col justify-between rounded-2xl border border-black/[0.08] bg-surface p-4 outline-none transition-colors duration-200 ease-smooth hover:border-brand-red focus-visible:border-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
        <span className="flex items-start justify-between gap-2">
            <span className="text-[15px] font-bold leading-tight text-apple-text">
                {tile.label}
            </span>
            <NorthEastRoundedIcon
                aria-hidden="true"
                className="!text-[16px] shrink-0 text-apple-gray transition-colors duration-200 ease-smooth group-hover:text-brand-red"
            />
        </span>

        {tile.copy && (
            <span className="mt-2 block text-[12px] font-normal leading-snug text-apple-gray">
                {tile.copy}
            </span>
        )}
    </Link>
);

export default MegaMenuCard;
