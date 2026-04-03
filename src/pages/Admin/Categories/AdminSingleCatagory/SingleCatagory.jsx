import React, { useState } from 'react';
import axiosInstance from "../../../../utilities/axiosInstance";
import ImagesForCatagory from './ImagesForCatagory';

const SingleCatagory = ({ catagory, setUpdate }) => {
    const [editClicked, setEditClicked] = useState(false);
    const [images, setImages] = useState(catagory.images || []);
    const [imageUrl, setImageUrl] = useState("");

    const handleAddImage = () => {
        if (!imageUrl.trim()) return;
        setImages((prev) => [...prev, { url: imageUrl.trim() }]);
        setImageUrl("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.patch(`catagory/${catagory._id}`, {
            modelName: e.target.productModel.value,
            description: e.target.description.value,
            images,
        }).then(() => {
            setUpdate((prev) => !prev);
            setEditClicked(false);
        }).catch((error) => console.log(error));
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            axiosInstance.delete(`catagory/${catagory._id}`)
                .then(() => setUpdate((prev) => !prev))
                .catch((error) => console.log(error));
        }
    };

    return (
        <div className="admin-panel rounded-[30px] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h3 className="text-[28px]">{catagory?.modelName}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink-soft">{catagory?.description || 'No description added yet.'}</p>
                </div>
                <div className="flex gap-3">
                    <button className="premium-button-secondary" onClick={() => setEditClicked((prev) => !prev)}>
                        {editClicked ? 'Close editor' : 'Edit'}
                    </button>
                    <button className="premium-button-secondary" onClick={handleDelete}>Delete</button>
                </div>
            </div>

            {editClicked && (
                <div className="mt-6 border-t border-black/[0.06] pt-6">
                    <div className="mb-5 flex flex-wrap gap-3">
                        {images.map((image, index) => (
                            <ImagesForCatagory image={image} setImages={setImages} key={index} />
                        ))}
                    </div>

                    <div className="mb-5 flex gap-3">
                        <input className="admin-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL" />
                        <button className="premium-button-secondary" type="button" onClick={handleAddImage}>Add image</button>
                    </div>

                    <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
                        <input className="admin-input" name="productModel" type='text' placeholder='Updated model name' defaultValue={catagory?.modelName} required />
                        <input className="admin-input" name="description" type="text" placeholder='Updated description' defaultValue={catagory?.description} />
                        <button className="premium-button w-fit" type="submit">Save changes</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SingleCatagory;
