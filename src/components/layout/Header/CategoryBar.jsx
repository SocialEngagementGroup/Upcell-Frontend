import { useRef } from 'react';
import { Link } from 'react-router-dom';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

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
            <div className="header-shell relative">
                <ul className="scrollbar-hidden flex items-center gap-1 overflow-x-auto">
                    {CATEGORY_NAV.map((item, index) => {
                        const isOpen = openPanelId === item.id;
                        // A 3px rule under the item rather than a pill: it is the indicator the
                        // reference uses. border-solid is explicit because the locked base
                        // layer sets `button { border-none }`, which would otherwise collapse
                        // the width to zero. Carried transparent at rest so hover never
                        // shifts the row by three pixels.
                        const sharedClass = 'flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-[3px] border-solid px-3 text-[0.875rem] font-medium outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-1 focus-visible:ring-offset-white';

                        if (!item.panel) {
                            return (
                                <li key={item.id}>
                                    <Link
                                        ref={setItemNode(index, null)}
                                        to={item.to}
                                        onKeyDown={(event) => handleKeyDown(event, index, item)}
                                        onMouseEnter={() => onClosePanel({ immediate: true })}
                                        className={`${sharedClass} ${item.accent ? 'font-bold text-brand-red' : 'text-apple-text'} border-transparent hover:border-brand-red`}
                                    >
                                        {item.accent && (
                                            <AutoAwesomeRoundedIcon aria-hidden="true" className="!text-[17px]" />
                                        )}
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
                                    className={`${sharedClass} ${isOpen ? 'border-brand-red' : 'border-transparent hover:border-brand-red'} text-apple-text`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {/* Inside the container, not the full-width nav: once the rows
                    are capped at 1200px the fade has to sit at the scroller's
                    right edge, not the viewport's. */}
                <span aria-hidden="true" className="nav-edge-fade" />
            </div>
        </nav>
    );
};

export default CategoryBar;
