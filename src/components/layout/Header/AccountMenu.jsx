import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { userContext } from '../../../utilities/UserContextProvider';
import { ACCOUNT_LINKS_SIGNED_IN, ADMIN_LINK, SIGN_IN_LINK } from './navigationData';

const MENU_ID = 'header-account-menu';

// md and up only — on mobile the account block lives at the bottom of the
// drawer, where there is room to spell out the signed-in state.
const AccountMenu = () => {
    const { user, loading, logOut } = useContext(userContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const wrapRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handlePointerDown = (event) => {
            if (wrapRef.current && !wrapRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return;
            setIsOpen(false);
            buttonRef.current?.focus();
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleLogOut = async () => {
        setIsOpen(false);
        await logOut?.();
        navigate('/');
    };

    const itemClass = 'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-apple-text outline-none transition-colors duration-200 ease-smooth hover:bg-apple-bg focus-visible:ring-2 focus-visible:ring-brand-red';

    return (
        <div ref={wrapRef} className="relative hidden md:block">
            <button
                ref={buttonRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={MENU_ID}
                aria-label="Account menu"
                onClick={() => setIsOpen((open) => !open)}
                className="flex h-11 items-center gap-0.5 rounded-full pl-2.5 pr-1.5 text-apple-text outline-none transition-colors duration-200 ease-smooth hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white [&_svg]:!text-[22px]"
            >
                <PersonOutlineIcon aria-hidden="true" />
                <ExpandMoreIcon
                    aria-hidden="true"
                    className={`!text-[18px] transition-transform duration-200 ease-smooth ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    id={MENU_ID}
                    className="absolute right-0 top-[calc(100%+8px)] z-40 w-56 rounded-2xl border border-black/[0.08] bg-white p-2 shadow-surface"
                >
                    {loading ? (
                        <p className="px-3 py-2 text-[13px] font-medium text-apple-gray">Checking your account…</p>
                    ) : user ? (
                        <>
                            <p className="truncate px-3 pb-2 pt-1 text-[12px] font-medium text-apple-gray">
                                {user.displayName || user.email}
                            </p>

                            {ACCOUNT_LINKS_SIGNED_IN.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className={itemClass}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {user.role === 'admin' && (
                                <Link
                                    to={ADMIN_LINK.to}
                                    onClick={() => setIsOpen(false)}
                                    className={itemClass}
                                >
                                    {ADMIN_LINK.label}
                                </Link>
                            )}

                            <button type="button" onClick={handleLogOut} className={`${itemClass} mt-1 border-t border-black/[0.06] pt-3`}>
                                <LogoutRoundedIcon aria-hidden="true" className="!text-[18px] text-apple-gray" />
                                Log out
                            </button>
                        </>
                    ) : (
                        <Link
                            to={SIGN_IN_LINK.to}
                            onClick={() => setIsOpen(false)}
                            className={itemClass}
                        >
                            {SIGN_IN_LINK.label}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccountMenu;
