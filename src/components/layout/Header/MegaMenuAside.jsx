import { Link } from 'react-router-dom';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

// The promo rail down the left of the panel. It answers the questions that
// stop a refurb purchase — what happens to my old device, when does it arrive,
// what if it is wrong — next to the products rather than three clicks away.
//
// Runs to the viewport's left edge and stretches to the panel's full height,
// which is what gives the menu the two-band look of the reference rather than
// a card floating on white.
const ICONS = {
    '/trade-in': AutorenewRoundedIcon,
    '/delivery-policy': LocalShippingOutlinedIcon,
    '/return-policy': VerifiedUserOutlinedIcon,
};

const MegaMenuAside = ({ aside }) => {
    if (!aside) return null;

    return (
        <aside className="w-[240px] shrink-0 bg-surface-alt px-6 py-7 lg:w-[268px] lg:py-8">
            <h2 className="text-[16px] font-medium text-ink-soft">
                {aside.heading}
            </h2>

            <ul className="mt-5 space-y-2">
                {aside.items.map((item) => {
                    const Icon = ICONS[item.to] || VerifiedUserOutlinedIcon;

                    return (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                className="group -mx-2 flex items-start gap-3 rounded-xl px-2 py-2 outline-none transition-colors duration-200 ease-smooth hover:bg-white focus-visible:ring-2 focus-visible:ring-brand-red"
                            >
                                {/* Tinted tile, not a white one: on the rail's
                                    own grey the icon needs its own ground to
                                    read as a mark rather than a stray glyph. */}
                                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/[0.08] text-brand-red transition-colors duration-200 ease-smooth group-hover:bg-brand-red group-hover:text-white [&_svg]:!text-[22px]">
                                    <Icon aria-hidden="true" />
                                </span>

                                <span className="min-w-0">
                                    <span className="block text-[14px] font-bold leading-tight text-apple-text">
                                        {item.title}
                                    </span>
                                    <span className="mt-1 block text-[13px] font-normal leading-snug text-apple-gray">
                                        {item.copy}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default MegaMenuAside;
