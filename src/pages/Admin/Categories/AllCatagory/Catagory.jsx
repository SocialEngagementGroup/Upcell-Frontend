import axiosInstance from '../../../../utilities/axiosInstance.js';
import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SingleCatagory from '../AdminSingleCatagory/SingleCatagory.jsx';

const AllCatagories = () => {
    const [allCatagories, setAllCatagories] = useState([]);
    const [productGroups, setProductGroups] = useState([]);
    const [update, setUpdate] = useState(false);
    const outletContext = useOutletContext() || {};
    const searchQuery = outletContext.categorySearchQuery || '';

    useEffect(() => {
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
        }).catch((error) => console.log("Error fetching categories/products:", error));
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

    return (
        <section className="space-y-6">
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

            {filteredCategories.length === 0 && (
                <div className="admin-panel rounded-[30px] p-12 text-center">
                    <p className="text-xl font-medium text-ink-soft">No categories found.</p>
                </div>
            )}
        </section>
    );
};

export default AllCatagories;
