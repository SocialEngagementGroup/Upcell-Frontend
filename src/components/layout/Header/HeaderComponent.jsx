import { useLayoutEffect, useRef } from 'react';

import UtilityBar from './UtilityBar';
import PrimaryBar from './PrimaryBar';
import CategoryBar from './CategoryBar';
import MegaMenu from './MegaMenu';
import MobileDrawer from './MobileDrawer';
import useHeaderNav from './useHeaderNav';
import { CATEGORY_NAV } from './navigationData';

// Storefront header: a sticky three-row shell.
//
//   row 1  utility links          md and up, 32px
//   row 2  logo / search / actions  56 -> 64 -> 72px
//   row 3  categories + mega menu  md and up
//
// Below md rows 1 and 3 collapse into the drawer and the search moves onto its
// own line under row 2.
//
// The header is sticky rather than fixed, so it occupies flow space and the
// page below needs no compensating top padding — the reason <main> in App.jsx
// is left alone.
const HeaderComponent = () => {
    const {
        openPanelId,
        isDrawerOpen,
        navRef,
        menuButtonRef,
        openPanel,
        closePanel,
        togglePanel,
        registerTrigger,
        openDrawer,
        closeDrawer,
    } = useHeaderNav();

    const activeItem = CATEGORY_NAV.find((item) => item.id === openPanelId && item.panel);

    // Publish the rendered header height so anything that has to clear the
    // bars can read it instead of hardcoding one. Currently that is the toast
    // container in index.css. Measured rather than assumed, because the height
    // changes across two breakpoints and again when the search line wraps.
    const headerRef = useRef(null);

    useLayoutEffect(() => {
        const node = headerRef.current;
        if (!node) return undefined;

        const publish = () => {
            const { height } = node.getBoundingClientRect();
            if (!height) return;
            document.documentElement.style.setProperty('--app-header-height', `${Math.round(height)}px`);
        };

        publish();

        // The layout-effect measurement can land before the stylesheet and
        // Roboto have applied, which reports a much taller header. Timers are
        // used to correct it rather than requestAnimationFrame, because a
        // backgrounded or non-compositing tab never runs a frame callback and
        // the wrong value would stick there.
        const timers = [setTimeout(publish, 0), setTimeout(publish, 300)];
        document.fonts?.ready.then(publish).catch(() => {});

        // Resize covers the breakpoint changes; the observer covers the search
        // line wrapping, which changes the height without the window moving.
        window.addEventListener('resize', publish);

        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(publish);
        observer?.observe(node);

        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener('resize', publish);
            observer?.disconnect();
        };
    }, []);

    return (
        <>
            <header ref={headerRef} className="sticky top-0 z-50 bg-white">
                <UtilityBar />

                <PrimaryBar
                    menuButtonRef={menuButtonRef}
                    onOpenDrawer={openDrawer}
                    isDrawerOpen={isDrawerOpen}
                />

                {/* Row 3 and the panel share one positioned wrapper: the panel
                    anchors to it, and the hook treats it as a single region for
                    outside-click purposes so travelling from a trigger down
                    into the panel never counts as leaving. */}
                <div ref={navRef} className="relative hidden border-b border-black/[0.06] md:block">
                    <CategoryBar
                        openPanelId={openPanelId}
                        registerTrigger={registerTrigger}
                        onTriggerEnter={(id) => openPanel(id)}
                        onTriggerLeave={() => closePanel()}
                        onTriggerToggle={togglePanel}
                        onOpenPanel={openPanel}
                        onClosePanel={closePanel}
                    />

                    {activeItem && (
                        <MegaMenu
                            panel={activeItem.panel}
                            onPointerEnter={() => openPanel(activeItem.id, { immediate: true })}
                            onPointerLeave={() => closePanel()}
                        />
                    )}
                </div>
            </header>

            {/* Dims the page behind an open panel. A sibling at z-40 rather
                than a child of the header, so it lands above the page and
                below the header's own z-50 without any negative-z trickery. */}
            {activeItem && (
                <div
                    aria-hidden="true"
                    onClick={() => closePanel({ immediate: true })}
                    className="fixed inset-0 z-40 hidden bg-apple-text/25 md:block"
                />
            )}

            <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
        </>
    );
};

export default HeaderComponent;
