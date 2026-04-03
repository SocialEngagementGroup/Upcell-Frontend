import SingleCatagory from '../AdminSingleCatagory/SingleCatagory.jsx';
import axiosInstance from '../../../../utilities/axiosInstance.js';
import React, { useEffect, useState } from 'react';
import { SHOP_SIDEBAR_MODELS } from '../../../../constants/shopModels.js';

const AllCatagories = () => {
    const [allCatagories, setAllCatagories] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        axiosInstance.get("shop-categories").then((result) => {
            const filteredCategories = result.data.filter((category) =>
                SHOP_SIDEBAR_MODELS.includes(category.modelName)
            );
            const orderedCategories = SHOP_SIDEBAR_MODELS
                .map((modelName) => filteredCategories.find((category) => category.modelName === modelName))
                .filter(Boolean);
            setAllCatagories(orderedCategories);
        });
    }, [update]);

    return (
        <section className="space-y-6">

            <div className="space-y-5">
                {allCatagories.map((catagory) => (
                    <SingleCatagory key={catagory._id} catagory={catagory} setUpdate={setUpdate} />
                ))}
            </div>
        </section>
    );
};

export default AllCatagories;
