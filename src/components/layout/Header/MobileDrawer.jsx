import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { userContext } from '../../../utilities/UserContextProvider';
import {
    ACCOUNT_LINKS_SIGNED_IN,
    ADMIN_LINK,
    DRAWER_FAMILIES,
    DRAWER_PRIMARY_LINKS,
    SIGN_IN_LINK,
    UTILITY_LINKS,
} from './navigationData';
import DrawerAccordion from './DrawerAccordion';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Everything the md+ header shows across three rows, stacked into one column:
// primary links, the model groups as accordions, the account block, then the
// utility links at the bottom, in descending order of how often they are used.
//
// Mounted only while open. There is therefore an enter transition and no exit
// one — a slide-out would mean keeping a closing state alive purely for
// animation, and the drawer has to release focus and the scroll lock the
// instant it closes.
const MobileDrawer = ({ isOpen, onClose }) => {
    const { user, loading, logOut } = useContext(userContext);
    const navigate = useNavigate();
    const panelRef = useRef(null);
    const [isEntered, setIsEntered] = useState(false);

    useEffect(() => {
        if (!isOpen) return undefined;

        // setTimeout rather than requestAnimationFrame: rAF never fires while
        // the tab is hidden, which would leave the panel parked off-screen and
        // focus stranded on <body> until the tab was looked at again.
        const enterTimer = setTimeout(() => setIsEntered(true), 0);

        const focusTimer = setTimeout(() => {
            const first = panelRef.current?.querySelector(FOCUSABLE);
            first?.focus();
        }, 0);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(focusTimer);
            setIsEntered(false);
        };
    }, [isOpen]);

    // Escape closes; Tab is trapped inside the panel for as long as it is open.
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== 'Tab') return;

            const focusables = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) || [])
                .filter((node) => node.offsetParent !== null);
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleLogOut = async () => {
        onClose();
        await logOut?.();
        navigate('/');
    };

    const linkClass = 'flex min-h-[48px] items-center rounded-xl px-1 text-[15px] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red';

    return (
        <div className="fixed inset-0 z-[60] md:hidden">
            <div
                aria-hidden="true"
                onClick={() => onClose()}
                className={`absolute inset-0 bg-apple-text/40 transition-opacity duration-200 ease-smooth motion-reduce:transition-none ${isEntered ? 'opacity-100' : 'opacity-0'}`}
            />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                className={`absolute inset-y-0 left-0 flex w-[min(360px,88vw)] flex-col bg-white shadow-premium transition-transform duration-300 ease-smooth motion-reduce:transition-none ${isEntered ? 'translate-x-0' : '-translate-x-full motion-reduce:translate-x-0'}`}
            >
                <div className="flex h-14 shrink-0 items-center justify-between border-b border-black/[0.06] px-4">
                    <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-apple-gray">Menu</span>
                    <button
                        type="button"
                        onClick={() => onClose()}
                        aria-label="Close menu"
                        className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-apple-text outline-none transition-colors duration-200 ease-smooth hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-brand-red [&_svg]:!text-[24px]"
                    >
                        <CloseIcon aria-hidden="true" />
                    </button>
                </div>

                <nav aria-label="Site menu" className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
                    <ul className="border-b border-black/[0.06] py-2">
                        {DRAWER_PRIMARY_LINKS.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to} onClick={() => onClose({ restoreFocus: false })} className={linkClass}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="py-1">
                        {DRAWER_FAMILIES.map((family) => (
                            <DrawerAccordion
                                key={family.id}
                                id={family.id}
                                title={family.family}
                                items={family.items}
                                seeAllTo={family.seeAllTo}
                                seeAllLabel={`See all ${family.family}`}
                                onNavigate={() => onClose({ restoreFocus: false })}
                            />
                        ))}
                    </div>

                    <div className="border-b border-black/[0.06] py-2">
                        {loading ? (
                            <p className="px-1 py-3 text-[14px] font-medium text-apple-gray">Checking your account…</p>
                        ) : user ? (
                            <>
                                <p className="truncate px-1 pt-2 text-[12px] font-medium text-apple-gray">
                                    {user.displayName || user.email}
                                </p>
                                {ACCOUNT_LINKS_SIGNED_IN.map((link) => (
                                    <Link key={link.to} to={link.to} onClick={() => onClose({ restoreFocus: false })} className={linkClass}>
                                        {link.label}
                                    </Link>
                                ))}
                                {user.role === 'admin' && (
                                    <Link to={ADMIN_LINK.to} onClick={() => onClose({ restoreFocus: false })} className={linkClass}>
                                        {ADMIN_LINK.label}
                                    </Link>
                                )}
                                <button type="button" onClick={handleLogOut} className={`${linkClass} w-full gap-2 text-left`}>
                                    <LogoutRoundedIcon aria-hidden="true" className="!text-[18px] text-apple-gray" />
                                    Log out
                                </button>
                            </>
                        ) : (
                            <Link to={SIGN_IN_LINK.to} onClick={() => onClose({ restoreFocus: false })} className={linkClass}>
                                {SIGN_IN_LINK.label}
                            </Link>
                        )}
                    </div>

                    <ul className="pt-2">
                        {UTILITY_LINKS.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    onClick={() => onClose({ restoreFocus: false })}
                                    className="flex min-h-[44px] items-center rounded-xl px-1 text-[14px] font-medium text-apple-gray outline-none transition-colors duration-200 ease-smooth hover:text-apple-text focus-visible:ring-2 focus-visible:ring-brand-red"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default MobileDrawer;
