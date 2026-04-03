import axiosInstance from '../../../../utilities/axiosInstance.js';
import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SingleCatagory from '../AdminSingleCatagory/SingleCatagory.jsx';
import AdminStatsGrid from '../../../../components/AdminStatsGrid/AdminStatsGrid.jsx';
import AdminLoadingState from '../../../../components/AdminState/AdminLoadingState.jsx';
import AdminEmptyState from '../../../../components/AdminState/AdminEmptyState.jsx';

const AllCatagories = () => {
    const [allCatagories, setAllCatagories] = useState([]);
    const [productGroups, setProductGroups] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const outletContext = useOutletContext() || {};
    const searchQuery = outletContext.categorySearchQuery || '';

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            axiosInstance.get("shop-categories"),
            axiosInstance.get("catagory"),
            axiosInstance.get("product"),
        ]).then(([categoryResult, parentResult, productResult]) => {
            const orderedCategories = [...categoryResult.data].sort((left, right) => (
                (left.modelName || '').localeCompare(right.modelName || '')
            ));
            setAllCatagories(orderedCategories);

            const grouped = parentResult.data.map((parent) => ({
                parentId: parent._id,
                productName: parent.modelName,
                categoryName: parent.categoryName || '',
                image: parent.images?.[0]?.url || '',
                variants: productResult.data.filter((variant) => String(variant.parentCatagory) === String(parent._id)),
            }));

            setProductGroups(grouped);
        }).catch((error) => console.log("Error fetching categories/products:", error))
            .finally(() => setIsLoading(false));
    }, [update]);

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
                            setUpdate={setUpdate}
                            productGroups={productGroups}
                            setProductGroups={setProductGroups}
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
