import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import { BOTTOM_NAV } from './mobileHomeData';

const ICONS = {
    offer: LocalOfferOutlinedIcon,
    cart: ShoppingCartOutlinedIcon,
    home: HomeOutlinedIcon,
    tradein: SwapHorizOutlinedIcon,
    account: PersonOutlineOutlinedIcon,
};

// How far down the page the bar waits before rising. Far enough that it does
// not cover the hero on first paint, close enough that it is there as soon as
// someone is actually browsing.
const REVEAL_AFTER = 240;

// The tab bar that rises from the bottom once the page is scrolled.
//
// Mobile only — it is rendered by MobileHome, which itself only mounts below
// the md breakpoint, so there is no desktop cost and nothing to hide with a
// media query.
const MobileBottomNav = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > REVEAL_AFTER);

        // Run once on mount: the browser can restore a scroll position before
        // this ever fires, and the bar should already be up in that case.
        onScroll();

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            aria-label="Quick navigation"
            aria-hidden={!visible}
            className={`fixed inset-x-0 bottom-0 z-40 border-t border-solid border-black/[0.08] bg-white transition-transform duration-300 ease-smooth ${
                visible ? 'translate-y-0' : 'translate-y-full'
            }`}
            // Clear of the home indicator on iOS, and 0 everywhere else.
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <ul className="m-0 flex list-none items-stretch justify-between p-0">
                {BOTTOM_NAV.map((item) => {
                    const Icon = ICONS[item.icon];

                    return (
                        <li key={item.id} className="flex-1">
                            <NavLink
                                to={item.to}
                                end={item.to === '/'}
                                // Hidden from the tab order while the bar is
                                // down, so a keyboard user cannot tab into
                                // controls that are off screen.
                                tabIndex={visible ? undefined : -1}
                                className={({ isActive }) => [
                                    'flex h-16 flex-col items-center justify-center gap-1 text-[0.75rem] font-medium outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-inset [&_svg]:!text-[22px]',
                                    isActive ? 'text-brand-red' : 'text-ink-soft',
                                ].join(' ')}
                            >
                                <Icon aria-hidden="true" />
                                {item.label}
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default MobileBottomNav;
