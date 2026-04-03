import SingleCatagory from '../AdminSingleCatagory/SingleCatagory.jsx';
import axiosInstance from '../../../../utilities/axiosInstance.js';
import React, { useEffect, useState } from 'react';

const AllCatagories = () => {
    const [allCatagories, setAllCatagories] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        axiosInstance.get("catagory").then((result) => setAllCatagories(result.data));
    }, [update]);

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Categories</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Organize product families.</h1>
                <p className="mt-4 text-base leading-8 text-ink-soft">Edit Apple product groupings, descriptions, and imagery that power the storefront.</p>
            </div>

            <div className="space-y-5">
                {allCatagories.map((catagory) => (
                    <SingleCatagory key={catagory._id} catagory={catagory} setUpdate={setUpdate} />
                ))}
            </div>
        </section>
    );
};

export default AllCatagories;
