import { Link } from 'react-router-dom';

import { cloudinaryUrl } from '../../../utilities/cloudinary';

// One model-group tile: product shot above, label beneath — the arrangement
// the reference uses. The image sits on a tinted panel rather than bleeding to
// the tile edge, because catalogue shots are cut out on white and would
// otherwise dissolve into the menu behind them.
//
// Width and height are set on the <img> so the row reserves its space before
// the shot loads; without them the labels jump down as each one arrives.
const MegaMenuCard = ({ tile }) => (
    <Link
        to={tile.to}
        className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
        <span className="block overflow-hidden rounded-2xl bg-surface-alt transition-colors duration-200 ease-smooth group-hover:bg-apple-bg">
            {tile.image ? (
                <img
                    src={cloudinaryUrl(tile.image, { width: 440 })}
                    alt=""
                    width="440"
                    height="330"
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[4/3] w-full object-contain p-4 transition-transform duration-300 ease-smooth group-hover:scale-[1.03]"
                />
            ) : (
                <span className="block aspect-[4/3] w-full" />
            )}
        </span>

        <span className="mt-3 block text-[16px] font-bold leading-tight text-apple-text transition-colors duration-200 ease-smooth group-hover:text-brand-red">
            {tile.label}
        </span>
    </Link>
);

export default MegaMenuCard;
