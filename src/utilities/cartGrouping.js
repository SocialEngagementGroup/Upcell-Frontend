// A customer picks a device and, on that same page, the accessories that go
// with it. They also often pick more than one version of the same device — the
// 128GB and the 512GB of one iPad, to compare or to buy both.
//
// The cart is one flat list of ids, and every storage and colour is its own id,
// so all of that came back as unrelated cards sitting side by side: four
// identical "iPad Air 11-inch (M3)" headings whose only difference was a small
// grey pill, and a line total with no way to see how it was reached.
//
// Underneath they stay separate products, and they need to — that is what lets
// the cart, checkout, tax, receipts and refunds handle them with no special
// cases. Only the presentation groups them: one card per device model, each
// version listed inside it, accessories underneath.
//
// The cart is in the order things were added and a device is always added
// immediately before its own accessories, so each accessory belongs to the
// nearest device before it.
//
// Positions are carried through rather than ids. A customer who puts the same
// case on two different devices has that one id in the cart twice, and pressing
// "remove" under the second device has to take away that device's case, not the
// first one's.

// Every version of one device shares a parent. A product with no parent is its
// own group, which is what accessories and any stray one-off row rely on.
const familyOf = (product) => product.parentCatagory || product._id;

/**
 * Fold a flat cart into one entry per device model.
 *
 * @param {string[]} cart       ids in the order they were added
 * @param {object[]} products   the resolved products for those ids
 * @returns {Array<{key: string, title: string, image: string,
 *                  variants: Array<{product: object, indices: number[]}>,
 *                  accessories: Array<{product: object, indices: number[]}>}>}
 */
export const groupCartItems = (cart = [], products = []) => {
    const byId = new Map(products.map((product) => [product._id, product]));
    const groups = [];
    let current = null;

    // One line per exact product, however far apart two entries sit in the cart.
    const addTo = (list, product, index) => {
        const existing = list.find((entry) => entry.product._id === product._id);
        if (existing) existing.indices.push(index);
        else list.push({ product, indices: [index] });
    };

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
                current = { key: `loose-${index}`, title: '', image: '', variants: [], accessories: [] };
                groups.push(current);
            }
            addTo(current.accessories, product, index);
            return;
        }

        const family = familyOf(product);
        let group = groups.find((entry) => entry.key === family);

        if (!group) {
            group = {
                key: family,
                // Every version of a device shares its name and, near enough,
                // its photo. The first one added supplies both.
                title: product.productName,
                image: product.image,
                variants: [],
                accessories: [],
            };
            groups.push(group);
        }

        addTo(group.variants, product, index);
        current = group;
    });

    return groups;
};

/** What one line costs, leaving out a device that has since sold. */
export const lineTotal = (entry) =>
    (entry.product.outOfStock ? 0 : entry.product.price * entry.indices.length);

/** What a whole card costs. */
export const groupSubtotal = (group) =>
    [...group.variants, ...group.accessories].reduce((sum, entry) => sum + lineTotal(entry), 0);

/** How many devices are in the card, counting quantities. */
export const groupUnitCount = (group) =>
    group.variants.reduce((sum, entry) => sum + entry.indices.length, 0);

/** The end of a group, so a newly added accessory lands inside it. */
export const groupLastIndex = (group) => Math.max(
    ...group.variants.flatMap((entry) => entry.indices),
    ...group.accessories.flatMap((entry) => entry.indices),
    -1
);

/** The short "Space Gray · 1TB" line that tells two versions apart. */
export const variantLabel = (product) =>
    [product.color?.name, product.storage].filter(Boolean).join(' · ') || 'Standard';
