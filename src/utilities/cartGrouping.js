// A customer picks a device and, on that same page, the accessories that go
// with it. The cart is one flat list of ids, so those came back as three
// unrelated purchases sitting side by side: a phone, a case and a protector,
// each looking like something chosen from a different corner of the shop.
//
// Underneath they are separate products, and they need to stay that way — that
// is what lets the cart, checkout, tax, receipts and refunds handle them with
// no special cases. Only the presentation groups them.
//
// The cart is in the order things were added and a device is always added
// immediately before its own accessories, so each accessory belongs to the
// nearest device before it.
//
// Positions are carried through rather than ids. A customer who puts the same
// case on two different phones has that one id in the cart twice, and pressing
// "remove" under the second phone has to take away that phone's case, not the
// first one's.

/**
 * Fold a flat cart into one entry per device, each carrying its accessories.
 *
 * @param {string[]} cart       ids in the order they were added
 * @param {object[]} products   the resolved products for those ids
 * @returns {Array<{key: string, device: object|null, deviceIndices: number[],
 *                  accessories: Array<{product: object, indices: number[]}>}>}
 */
export const groupCartItems = (cart = [], products = []) => {
    const byId = new Map(products.map((product) => [product._id, product]));
    const groups = [];
    let current = null;

    cart.forEach((id, index) => {
        const product = byId.get(id);
        // Ids with no product are dropped elsewhere; ignoring them here keeps
        // this function from inventing an empty row for them.
        if (!product) return;

        if (product.isAccessory) {
            // An accessory ahead of any device — the cart was edited, or an
            // older cart is being restored. Stand it on its own rather than
            // losing it.
            if (!current) {
                current = { key: `loose-${index}`, device: null, deviceIndices: [], accessories: [] };
                groups.push(current);
            }

            const existing = current.accessories.find((entry) => entry.product._id === id);
            if (existing) existing.indices.push(index);
            else current.accessories.push({ product, indices: [index] });
            return;
        }

        // The same device added twice is one line, however far apart the two
        // entries sit in the cart.
        let group = groups.find((entry) => entry.device?._id === id);
        if (!group) {
            group = { key: id, device: product, deviceIndices: [], accessories: [] };
            groups.push(group);
        }

        group.deviceIndices.push(index);
        current = group;
    });

    return groups;
};

/** What a group costs, leaving out a device that has since sold. */
export const groupSubtotal = (group) => {
    const device = group.device && !group.device.outOfStock
        ? group.device.price * group.deviceIndices.length
        : 0;

    return group.accessories.reduce(
        (sum, entry) => sum + entry.product.price * entry.indices.length,
        device
    );
};

/** The end of a group, so a newly added accessory lands inside it. */
export const groupLastIndex = (group) => Math.max(
    ...group.deviceIndices,
    ...group.accessories.flatMap((entry) => entry.indices),
    -1
);
