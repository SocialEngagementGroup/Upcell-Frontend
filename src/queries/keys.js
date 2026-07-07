// A single stable reference so `data = EMPTY_ARRAY` fallbacks don't create a
// new array every render while a query is loading — a fresh `[]` literal on
// each render breaks referential equality for anything that depends on it.
export const EMPTY_ARRAY = [];

export const productKeys = {
    list: () => ['products'],
    byParent: (parentId) => ['products', 'byParent', parentId],
};

export const categoryKeys = {
    parents: () => ['categories'],
    parent: (id) => ['categories', id],
    shop: () => ['shopCategories'],
};
