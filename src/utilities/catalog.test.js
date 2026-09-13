import { describe, expect, it } from 'vitest';
import { groupVariantsByParent, pickVariant } from './catalog';

// This replaced a .filter() run once per parent. The two must agree exactly,
// so each case here is written against what that filter would have returned.
const oldWay = (parents, variants) => parents.map((parent) => ({
    parentId: parent._id,
    variants: variants.filter((v) => String(v.parentCatagory) === String(parent._id)),
}));

const newWay = (parents, variants) => {
    const byParent = groupVariantsByParent(variants);
    return parents.map((parent) => ({
        parentId: parent._id,
        variants: byParent.get(String(parent._id)) || [],
    }));
};

describe('groupVariantsByParent', () => {
    it('puts every variant under its own parent', () => {
        const variants = [
            { _id: 'a', parentCatagory: 'p1' },
            { _id: 'b', parentCatagory: 'p2' },
            { _id: 'c', parentCatagory: 'p1' },
        ];

        const grouped = groupVariantsByParent(variants);

        expect(grouped.get('p1').map((v) => v._id)).toEqual(['a', 'c']);
        expect(grouped.get('p2').map((v) => v._id)).toEqual(['b']);
    });

    it('keeps variants in the order they arrived, as the filter did', () => {
        const variants = [
            { _id: '256gb', parentCatagory: 'p1' },
            { _id: '128gb', parentCatagory: 'p1' },
            { _id: '512gb', parentCatagory: 'p1' },
        ];

        expect(groupVariantsByParent(variants).get('p1').map((v) => v._id))
            .toEqual(['256gb', '128gb', '512gb']);
    });

    it('matches an ObjectId against its string form, which is why the old code called String()', () => {
        const objectId = { toString: () => 'p1' };
        const grouped = groupVariantsByParent([{ _id: 'a', parentCatagory: objectId }]);

        expect(grouped.get('p1')).toHaveLength(1);
    });

    it('has no entry for a parent with no variants, so callers must default', () => {
        expect(groupVariantsByParent([]).get('p1')).toBeUndefined();
    });

    it('agrees with the filter it replaced', () => {
        const parents = [{ _id: 'p1' }, { _id: 'p2' }, { _id: 'p3' }];
        const variants = [
            { _id: 'a', parentCatagory: 'p1' },
            { _id: 'b', parentCatagory: 'p3' },
            { _id: 'c', parentCatagory: 'p1' },
            { _id: 'd', parentCatagory: 'orphan' },
        ];

        expect(newWay(parents, variants)).toEqual(oldWay(parents, variants));
    });
});

describe('pickVariant', () => {
    // Modelled on the real "Far Add cat": every variant in stock, but each
    // storage exists in only one colour. Black is 64GB and 2TB only.
    const variants = [
        { slug: 'a', storage: '64GB', color: { name: 'Black' }, price: 111, outOfStock: false },
        { slug: 'b', storage: '128GB', color: { name: 'Silver' }, price: 222, outOfStock: false },
        { slug: 'c', storage: '256GB', color: { name: 'Blue' }, price: 333, outOfStock: false },
        { slug: 'd', storage: '2TB', color: { name: 'Black' }, price: 111, outOfStock: false },
    ];

    it('returns the exact pair when it exists', () => {
        expect(pickVariant(variants, { colorName: 'Black', storage: '2TB' }).slug).toBe('d');
    });

    it('picks a colour that has the storage, rather than doing nothing', () => {
        // The old code required an exact match and silently returned nothing,
        // so this click did not move the page at all.
        expect(pickVariant(variants, { colorName: 'Black', storage: '128GB', anchor: 'storage' }).slug)
            .toBe('b');
    });

    it('keeps the colour the customer just clicked and finds it a storage', () => {
        expect(pickVariant(variants, { colorName: 'Blue', storage: '64GB', anchor: 'color' }).slug)
            .toBe('c');
    });

    it('prefers an in-stock variant over a sold-out one', () => {
        const stock = [
            { slug: 'out', storage: '1TB', color: { name: 'Pink' }, outOfStock: true },
            { slug: 'in', storage: '1TB', color: { name: 'Gold' }, outOfStock: false },
        ];

        expect(pickVariant(stock, { colorName: 'Black', storage: '1TB', anchor: 'storage' }).slug)
            .toBe('in');
    });

    it('still returns the exact pair when it is out of stock, so the page can say so', () => {
        const stock = [{ slug: 'x', storage: '1TB', color: { name: 'Pink' }, outOfStock: true }];

        expect(pickVariant(stock, { colorName: 'Pink', storage: '1TB' }).slug).toBe('x');
    });

    it('returns null when nothing matches at all', () => {
        expect(pickVariant(variants, { colorName: 'Gold', storage: '8TB', anchor: 'color' })).toBeNull();
    });
});
