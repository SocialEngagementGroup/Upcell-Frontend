import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// All of the header's "which thing is open" behaviour lives here so the three
// bars, the mega menu and the drawer stay presentational.
//
// Owns: the open mega panel, hover-intent timers, Escape, outside click, the
// body scroll lock for the drawer, and closing everything on a route change.

// A pointer crossing the category row on its way somewhere else should not
// flash a panel open, hence the open delay. The close delay covers the gap
// between a trigger and the panel below it, so the panel does not blink out
// mid-travel.
const OPEN_DELAY = 120;
const CLOSE_DELAY = 180;

const useHeaderNav = ({ headerRef } = {}) => {
    const location = useLocation();

    const [openPanelId, setOpenPanelId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openTimerRef = useRef(null);
    const closeTimerRef = useRef(null);
    // The category row + panel, for outside-click detection.
    const navRef = useRef(null);
    // The hamburger, so the drawer can hand focus back to it.
    const menuButtonRef = useRef(null);
    const triggerNodesRef = useRef(new Map());
    // Mirrors openPanelId and isSearchOpen so document listeners read current values.
    const openPanelIdRef = useRef(null);
    const isSearchOpenRef = useRef(false);

    openPanelIdRef.current = openPanelId;
    isSearchOpenRef.current = isSearchOpen;

    const clearOpenTimer = useCallback(() => {
        if (openTimerRef.current) {
            clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
    }, []);

    const clearCloseTimer = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    // Ref callback factory. Triggers register themselves so Escape can return
    // focus to the one that opened the panel.
    const registerTrigger = useCallback((id) => (node) => {
        if (node) triggerNodesRef.current.set(id, node);
        else triggerNodesRef.current.delete(id);
    }, []);

    const focusTrigger = useCallback((id) => {
        triggerNodesRef.current.get(id)?.focus();
    }, []);

    const openSearch = useCallback(() => {
        clearCloseTimer();
        clearOpenTimer();
        setOpenPanelId(null);
        setIsSearchOpen(true);
    }, [clearCloseTimer, clearOpenTimer]);

    const closeSearch = useCallback(() => {
        setIsSearchOpen(false);
    }, []);

    const toggleSearch = useCallback(() => {
        setIsSearchOpen((prev) => !prev);
    }, []);

    const openPanel = useCallback((id, { immediate = false } = {}) => {
        clearCloseTimer();
        clearOpenTimer();
        setIsSearchOpen(false);

        if (immediate) {
            setOpenPanelId(id);
            return;
        }

        openTimerRef.current = setTimeout(() => {
            openTimerRef.current = null;
            setOpenPanelId(id);
        }, OPEN_DELAY);
    }, [clearCloseTimer, clearOpenTimer]);

    const closePanel = useCallback(({ immediate = false, restoreFocus = false } = {}) => {
        clearOpenTimer();
        clearCloseTimer();

        const finish = () => {
            const previousId = openPanelIdRef.current;
            setOpenPanelId(null);
            if (restoreFocus && previousId) focusTrigger(previousId);
        };

        if (immediate) {
            finish();
            return;
        }

        closeTimerRef.current = setTimeout(() => {
            closeTimerRef.current = null;
            finish();
        }, CLOSE_DELAY);
    }, [clearCloseTimer, clearOpenTimer, focusTrigger]);

    const togglePanel = useCallback((id) => {
        clearOpenTimer();
        clearCloseTimer();
        setIsSearchOpen(false);
        setOpenPanelId((current) => (current === id ? null : id));
    }, [clearCloseTimer, clearOpenTimer]);

    const openDrawer = useCallback(() => {
        clearOpenTimer();
        clearCloseTimer();
        setOpenPanelId(null);
        setIsSearchOpen(false);
        setIsDrawerOpen(true);
    }, [clearCloseTimer, clearOpenTimer]);

    const closeDrawer = useCallback(({ restoreFocus = true } = {}) => {
        setIsDrawerOpen(false);
        if (restoreFocus) menuButtonRef.current?.focus();
    }, []);

    // Escape closes the search or mega-panel.
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return;
            if (isSearchOpenRef.current) {
                event.stopPropagation();
                setIsSearchOpen(false);
                return;
            }
            if (!openPanelIdRef.current) return;
            event.stopPropagation();
            closePanel({ immediate: true, restoreFocus: true });
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closePanel]);

    // Outside click.
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (isSearchOpenRef.current) {
                if (headerRef?.current && !headerRef.current.contains(event.target)) {
                    setIsSearchOpen(false);
                }
                return;
            }
            if (!openPanelIdRef.current) return;
            if (navRef.current && navRef.current.contains(event.target)) return;
            closePanel({ immediate: true });
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [closePanel, headerRef]);

    // Body scroll lock while the drawer is open. The scrollbar width is added
    // back as padding so the page does not jump sideways on lock/unlock.
    useEffect(() => {
        if (!isDrawerOpen) return undefined;

        const { body } = document;
        const previousOverflow = body.style.overflow;
        const previousPaddingRight = body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPaddingRight;
        };
    }, [isDrawerOpen]);

    // Close on route change. Focus is deliberately not restored here: the user
    // clicked a link, so focus belongs to the new page, not back on the header.
    useEffect(() => {
        clearOpenTimer();
        clearCloseTimer();
        setOpenPanelId(null);
        setIsDrawerOpen(false);
        setIsSearchOpen(false);
    }, [location.pathname, location.search, clearCloseTimer, clearOpenTimer]);

    useEffect(() => () => {
        clearOpenTimer();
        clearCloseTimer();
    }, [clearCloseTimer, clearOpenTimer]);

    return {
        openPanelId,
        isDrawerOpen,
        isSearchOpen,
        navRef,
        menuButtonRef,
        openSearch,
        closeSearch,
        toggleSearch,
        openPanel,
        closePanel,
        togglePanel,
        registerTrigger,
        focusTrigger,
        openDrawer,
        closeDrawer,
    };
};

export default useHeaderNav;
