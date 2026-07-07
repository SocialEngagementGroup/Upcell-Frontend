import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import SingleCatagory from '../AdminSingleCatagory/SingleCatagory.jsx';
import AdminStatsGrid from '../../../../components/AdminStatsGrid/AdminStatsGrid.jsx';
import AdminLoadingState from '../../../../components/AdminState/AdminLoadingState.jsx';
import AdminEmptyState from '../../../../components/AdminState/AdminEmptyState.jsx';
import { useParentCategoriesQuery, useShopCategoriesQuery } from '../../../../queries/categories';
import { useProductsQuery } from '../../../../queries/products';
import { EMPTY_ARRAY } from '../../../../queries/keys';

const AllCatagories = () => {
    const outletContext = useOutletContext() || {};
    const searchQuery = outletContext.categorySearchQuery || '';

    const { data: shopCategories = EMPTY_ARRAY, isLoading: shopCategoriesLoading } = useShopCategoriesQuery();
    const { data: parents = EMPTY_ARRAY, isLoading: parentsLoading } = useParentCategoriesQuery();
    const { data: variants = EMPTY_ARRAY, isLoading: variantsLoading } = useProductsQuery();

    const isLoading = shopCategoriesLoading || parentsLoading || variantsLoading;

    const allCatagories = useMemo(() => (
        [...shopCategories].sort((left, right) => (left.modelName || '').localeCompare(right.modelName || ''))
    ), [shopCategories]);

    const productGroups = useMemo(() => parents.map((parent) => ({
        parentId: parent._id,
        productName: parent.modelName,
        categoryName: parent.categoryName || '',
        image: parent.images?.[0]?.url || '',
        variants: variants.filter((variant) => String(variant.parentCatagory) === String(parent._id)),
    })), [parents, variants]);

    const filteredCategories = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();

        return allCatagories.filter((category) => {
            if (!normalizedSearch) return true;

            const productCount = productGroups.filter(
                (product) => product.categoryName === category?.modelName
            ).length;
            const searchableText = `${category?.modelName || ''} ${category?.description || ''} ${productCount}`.toLowerCase();

            return searchableText.includes(normalizedSearch);
        });
    }, [allCatagories, productGroups, searchQuery]);

    const stats = [
        { label: 'Visible categories', value: filteredCategories.length, sub: 'matching the current search' },
        { label: 'Total categories', value: allCatagories.length, sub: 'saved in the catalog' },
        { label: 'Product families', value: productGroups.length, sub: 'linked across categories' },
    ];

    return (
        <section className="space-y-6">
            <AdminStatsGrid items={stats} />

            {isLoading ? (
                <AdminLoadingState title="Loading categories" description="Pulling saved categories and linked product families." />
            ) : filteredCategories.length ? (
                <div className="space-y-5">
                    {filteredCategories.map((catagory) => (
                        <SingleCatagory
                            key={catagory._id}
                            catagory={catagory}
                            productGroups={productGroups}
                        />
                    ))}
                </div>
            ) : (
                <AdminEmptyState title="No categories found." description="Try a different search term or add a new category to start organizing products." />
            )}
        </section>
    );
};

export default AllCatagories;
