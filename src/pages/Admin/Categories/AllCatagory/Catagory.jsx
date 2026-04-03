import { Link } from 'react-router-dom';
import axiosInstance from '../../../../utilities/axiosInstance.js';
import React, { useEffect, useState } from 'react';
import SingleCatagory from '../AdminSingleCatagory/SingleCatagory.jsx';

const AllCatagories = () => {
    const [allCatagories, setAllCatagories] = useState([]);
    const [productGroups, setProductGroups] = useState([]);
    const [update, setUpdate] = useState(false);

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

    return (
        <section className="space-y-6">
            <div className="space-y-5">
                {allCatagories.map((catagory) => (
                    <SingleCatagory 
                        key={catagory._id} 
                        catagory={catagory} 
                        setUpdate={setUpdate} 
                        productGroups={productGroups}
                        setProductGroups={setProductGroups}
                    />
                ))}
            </div>
        </section>
    );
};

export default AllCatagories;
