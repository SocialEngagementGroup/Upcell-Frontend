import React from 'react';
import axiosInstance from '../../../../utilities/axiosInstance';

const AddCatagory = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const modelName = e.target.categoryName.value.trim();

        axiosInstance.post("shop-categories", { modelName })
            .then(() => {
                e.target.categoryName.value = "";
                alert("Category created successfully!");
            })
            .catch((error) => console.log("error ***: ", error));
    };

    return (
        <section className="admin-panel rounded-[36px] p-8 md:p-10">
            <h2 className="text-[34px]">Add category</h2>
            <p className="mt-3 text-base leading-8 text-ink-soft">Create a new product family. Descriptions and imagery are no longer required for categories.</p>

            <form className="mt-8 flex gap-4 max-w-2xl" onSubmit={handleSubmit}>
                <input 
                    className="admin-input flex-1" 
                    name="categoryName" 
                    type='text' 
                    placeholder='Enter category name (e.g. iPhone 15 Pro)' 
                    required 
                />
                <button className="premium-button px-8 h-14" type="submit">Create category</button>
            </form>
        </section>
    );
};

export default AddCatagory;
