import { useContext, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { userContext } from './UserContextProvider';
import { fetchSavedCart, saveCart } from '../queries/cart';
import { mergeCarts } from './cartMerge';
import { TOAST_ICONS } from './toastIcons';

// Keeping a signed-in customer's cart on the server as well as in the browser.
//
// localStorage alone means a cart filled on a phone is invisible on a laptop
// and gone when somebody clears their site data. In a shop where every row is
// one physical device that matters more than usual: the phone they put in
// their cart on Tuesday may be the only one, and losing the cart is how they
// find out it sold.
//
// Guests are untouched. The browser is all a guest has.

const WRITE_DELAY_MS = 800;

const useCartSync = (cart, setCart) => {
    const { user } = useContext(userContext) || {};
    const userId = user?.id || null;

    // Nothing may be written until the saved cart has been read and merged in.
    // Without this the first render after sign-in pushes whatever localStorage
    // happens to hold — an empty array, on a new laptop — straight over the
    // cart they filled on their phone.
    const readyFor = useRef(null);
    // What was last sent, so an unchanged cart is not written again on every
    // unrelated re-render.
    const lastSent = useRef(null);

    useEffect(() => {
        if (!userId) {
            // Signed out: stop syncing, keep the cart. They may still buy it.
            readyFor.current = null;
            lastSent.current = null;
            return;
        }
        if (readyFor.current === userId) return;

        let cancelled = false;

        fetchSavedCart()
            .then(({ items, removed }) => {
                if (cancelled) return;

                setCart((current) => {
                    const merged = mergeCarts(current, items);
                    lastSent.current = null;
                    return merged;
                });
                readyFor.current = userId;

                if (removed > 0) {
                    toast.info(
                        removed === 1
                            ? 'One item in your saved cart has sold and was removed.'
                            : `${removed} items in your saved cart have sold and were removed.`,
                        { icon: TOAST_ICONS.cart }
                    );
                }
            })
            // Silent. A customer who has just signed in did not ask for this
            // and cannot act on it going wrong; the cart in front of them still
            // works, and the next change will try again.
            .catch(() => {});

        return () => { cancelled = true; };
    }, [userId, setCart]);

    useEffect(() => {
        if (!userId || readyFor.current !== userId) return;

        const next = cart.map(String).join(',');
        if (lastSent.current === next) return;

        // Debounced, because adding three accessories is three renders and a
        // cart is not worth three writes.
        const timer = setTimeout(() => {
            lastSent.current = next;
            saveCart(cart).catch(() => {
                // Let the next change retry rather than surfacing a failure
                // the customer cannot do anything about.
                lastSent.current = null;
            });
        }, WRITE_DELAY_MS);

        return () => clearTimeout(timer);
    }, [cart, userId]);
};

export default useCartSync;
