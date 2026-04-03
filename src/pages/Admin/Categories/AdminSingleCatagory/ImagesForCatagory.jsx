import React from 'react';

const ImagesForCatagory = ({ image, setImages }) => {
    const handleDelete = () => {
        alert("Storage deletion logic has been removed. Please implement your new storage provider.");
        setImages((prev) => prev.filter((item) => item.url !== image.url));
    };

    return (
        <div className="relative overflow-hidden rounded-[20px] border border-black/[0.08] bg-white p-2">
            <img src={image?.url} alt='product' className="h-24 w-24 rounded-2xl object-cover" />
            <button className="absolute inset-x-2 bottom-2 rounded-xl bg-apple-text px-3 py-2 text-xs font-bold text-white" onClick={handleDelete}>
                Delete
            </button>
        </div>
    );
};

export default ImagesForCatagory;
