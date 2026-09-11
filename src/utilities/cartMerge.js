// The rule for what a cart looks like after somebody signs in.
//
// Kept apart from useCartSync so it can be read and tested as what it is: one
// decision about somebody's shopping, with no network anywhere near it.

// The two lists are merged rather than one replacing the other, because both
// are real: the local cart is what the customer is looking at right now, and
// the saved one is what they left on another device.
//
// Local goes first and keeps its duplicates. Duplicates are quantity here —
// two of the same case is two cases — and the cart page removes a line by its
// position, so reordering or deduplicating the local part would take away the
// wrong thing. Only ids the local cart has never heard of are appended, so
// signing in can add to a cart but can never multiply what is already in it.
export const mergeCarts = (local, saved) => {
    const here = new Set(local.map(String));
    const seen = new Set();

    const brought = saved.filter((id) => {
        const key = String(id);
        if (here.has(key) || seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return [...local, ...brought];
};
