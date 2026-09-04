import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import SingleCatagory from '../AdminSingleCatagory/SingleCatagory.jsx';
import AdminStatsGrid from '../../../../components/AdminStatsGrid/AdminStatsGrid.jsx';
import AdminLoadingState from '../../../../components/AdminState/AdminLoadingState.jsx';
import AdminEmptyState from '../../../../components/AdminState/AdminEmptyState.jsx';
import { useCategoriesWithCountsQuery, useShopCategoriesQuery } from '../../../../queries/categories';
import { EMPTY_ARRAY } from '../../../../queries/keys';
import { resolveImageRef } from '../../../../utilities/cloudinary';

const AllCatagories = () => {
    const outletContext = useOutletContext() || {};
    const searchQuery = outletContext.categorySearchQuery || '';

    const { data: shopCategories = EMPTY_ARRAY, isLoading: shopCategoriesLoading } = useShopCategoriesQuery();
    // Variant counts and one sample price per product, computed server-side —
    // this page used to fetch every ParentProduct AND every SingleVariation
    // (956+ documents) just to count matches per parent in a JS loop.
    const { data: parentsWithCounts = EMPTY_ARRAY, isLoading: parentsLoading } = useCategoriesWithCountsQuery();

    const isLoading = shopCategoriesLoading || parentsLoading;

    const allCatagories = useMemo(() => (
        [...shopCategories].sort((left, right) => (left.modelName || '').localeCompare(right.modelName || ''))
    ), [shopCategories]);

    const productGroups = useMemo(() => parentsWithCounts.map((parent) => ({
        parentId: parent._id,
        productName: parent.modelName,
        categoryName: parent.categoryName || '',
        image: resolveImageRef(parent.images?.[0], { width: 160 }) || '',
        variantCount: parent.variantCount || 0,
        samplePrice: parent.samplePrice,
    })), [parentsWithCounts]);

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
