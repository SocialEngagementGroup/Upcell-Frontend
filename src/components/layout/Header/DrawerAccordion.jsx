import { useState } from 'react';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// The drawer's stand-in for a mega panel. A phone has no hover and no room for
// a two-column panel, so the same model groups collapse into a disclosure.
const DrawerAccordion = ({ id, title, items, seeAllTo, seeAllLabel, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const regionId = `${id}-region`;

    return (
        <div className="border-b border-black/[0.06]">
            <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={regionId}
                onClick={() => setIsOpen((open) => !open)}
                className="flex min-h-[48px] w-full items-center justify-between gap-2 px-1 py-3 text-left text-[15px] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red"
            >
                {title}
                <ExpandMoreIcon
                    aria-hidden="true"
                    className={`!text-[20px] text-apple-gray transition-transform duration-200 ease-smooth motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div id={regionId} hidden={!isOpen} className="pb-2">
                <ul>
                    {items.map((item) => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                onClick={onNavigate}
                                className="flex min-h-[44px] items-center rounded-xl px-3 text-[14px] font-medium text-apple-gray outline-none transition-colors duration-200 ease-smooth hover:bg-apple-bg hover:text-apple-text focus-visible:ring-2 focus-visible:ring-brand-red"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}

                    {seeAllTo && (
                        <li>
                            <Link
                                to={seeAllTo}
                                onClick={onNavigate}
                                className="flex min-h-[44px] items-center rounded-xl px-3 text-[14px] font-bold text-brand-red outline-none transition-colors duration-200 ease-smooth hover:bg-brand-red/[0.08] focus-visible:ring-2 focus-visible:ring-brand-red"
                            >
                                {seeAllLabel}
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DrawerAccordion;
