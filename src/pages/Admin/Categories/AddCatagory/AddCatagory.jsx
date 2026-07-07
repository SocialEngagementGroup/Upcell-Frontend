import React from 'react';
import { toast } from 'react-toastify';
import { useCreateShopCategoryMutation } from '../../../../queries/categories';

const AddCatagory = () => {
    const createCategory = useCreateShopCategoryMutation();

    const handleSubmit = (e) => {
        e.preventDefault();
        const modelName = e.target.categoryName.value.trim();

        createCategory.mutate({ modelName }, {
            onSuccess: () => {
                e.target.categoryName.value = "";
                toast.success("Category created successfully");
            },
            onError: (error) => {
                console.log("error ***: ", error);
                toast.error("Failed to create category");
            },
        });
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
                <button className="premium-button px-8 h-14" type="submit" disabled={createCategory.isPending}>
                    {createCategory.isPending ? 'Creating…' : 'Create category'}
                </button>
            </form>
        </section>
    );
};

export default AddCatagory;
