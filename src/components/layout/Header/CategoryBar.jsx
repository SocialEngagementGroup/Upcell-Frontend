import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { CATEGORY_NAV } from './navigationData';

// Row 3. Hidden below md, where the same tree is reachable through the drawer
// accordions instead. Scrolls horizontally rather than wrapping, so the header
// keeps a predictable height.
const CategoryBar = ({
    openPanelId,
    registerTrigger,
    onTriggerEnter,
    onTriggerLeave,
    onTriggerToggle,
    onOpenPanel,
    onClosePanel,
}) => {
    const itemNodesRef = useRef([]);

    const setItemNode = (index, id) => (node) => {
        itemNodesRef.current[index] = node;
        if (id) registerTrigger(id)(node);
    };

    // ArrowLeft/ArrowRight walk the row, the way a menubar is expected to
    // behave; Home/End jump to the ends.
    const handleKeyDown = (event, index, item) => {
        const nodes = itemNodesRef.current.filter(Boolean);
        const move = (nextIndex) => {
            event.preventDefault();
            const wrapped = (nextIndex + nodes.length) % nodes.length;
            nodes[wrapped]?.focus();
        };

        if (event.key === 'ArrowRight') return move(index + 1);
        if (event.key === 'ArrowLeft') return move(index - 1);
        if (event.key === 'Home') return move(0);
        if (event.key === 'End') return move(nodes.length - 1);

        if (!item.panel) return undefined;

        // ArrowDown only ever opens. Enter and Space are deliberately left to
        // the button's native click, which runs onTriggerToggle — preventing
        // the default here would make them open-only, and aria-expanded
        // promises a toggle.
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            onOpenPanel(item.id, { immediate: true });
        }

        return undefined;
    };

    return (
        <nav aria-label="Product categories" className="relative hidden bg-white md:block">
            <div className="mx-auto max-w-site px-6 lg:px-10">
                <ul className="scrollbar-hidden flex items-center gap-1 overflow-x-auto">
                    {CATEGORY_NAV.map((item, index) => {
                        const isOpen = openPanelId === item.id;
                        const sharedClass = 'flex h-11 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-4 text-[14px] font-medium outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-1 focus-visible:ring-offset-white';

                        if (!item.panel) {
                            return (
                                <li key={item.id}>
                                    <Link
                                        ref={setItemNode(index, null)}
                                        to={item.to}
                                        onKeyDown={(event) => handleKeyDown(event, index, item)}
                                        onMouseEnter={() => onClosePanel({ immediate: true })}
                                        className={`${sharedClass} text-apple-text hover:bg-apple-bg`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        }

                        // onFocus opens only for :focus-visible. A mouse click
                        // focuses the button too, and without that guard the
                        // focus would open the panel a beat before the click
                        // itself toggled it shut again.
                        return (
                            <li
                                key={item.id}
                                onMouseEnter={() => onTriggerEnter(item.id)}
                                onMouseLeave={onTriggerLeave}
                            >
                                <button
                                    ref={setItemNode(index, item.id)}
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={item.panel.id}
                                    onClick={() => onTriggerToggle(item.id)}
                                    onFocus={(event) => {
                                        if (event.target.matches(':focus-visible')) {
                                            onOpenPanel(item.id, { immediate: true });
                                        }
                                    }}
                                    onKeyDown={(event) => handleKeyDown(event, index, item)}
                                    className={`${sharedClass} ${isOpen ? 'bg-apple-bg text-apple-text' : 'text-apple-text hover:bg-apple-bg'}`}
                                >
                                    {item.label}
                                    <ExpandMoreIcon
                                        aria-hidden="true"
                                        className={`!text-[18px] text-apple-gray transition-transform duration-200 ease-smooth ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <span aria-hidden="true" className="nav-edge-fade" />
        </nav>
    );
};

export default CategoryBar;
