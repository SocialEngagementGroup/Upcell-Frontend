import React, { useState } from 'react';
import axiosInstance from '../../../../utilities/axiosInstance';
import ImagesForCatagory from '../AdminSingleCatagory/ImagesForCatagory';

const AddCatagory = () => {
    const [images, setImages] = useState([]);
    const [progressPercent] = useState(0);
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const modelName = e.target.productModel.value;
        const description = e.target.description.value;

        axiosInstance.post("catagory", { modelName, description, images })
            .then(() => {
                e.target.productModel.value = "";
                e.target.description.value = "";
                setImages([]);
            })
            .catch((error) => console.log("error ***: ", error));
    };

    const handleAddImage = () => {
        if (!imageUrl.trim()) return;
        setImages((prev) => [...prev, { url: imageUrl.trim() }]);
        setImageUrl("");
    };

    return (
        <section className="admin-panel rounded-[36px] p-8 md:p-10">
            <h2 className="text-[34px]">Add category</h2>
            <p className="mt-3 text-base leading-8 text-ink-soft">Create a new product family and attach shopfront imagery once your storage provider is ready.</p>

            <div className="mt-6 flex flex-wrap gap-3">
                {images.map((image, index) => (
                    <ImagesForCatagory key={index} setImages={setImages} image={image} />
                ))}
            </div>

            <div className="mt-6 rounded-[24px] bg-surface-alt p-5">
                <p className="text-sm text-ink-soft">Upload progress: <strong className="text-apple-text">{progressPercent}%</strong></p>
                <div className="mt-4 flex gap-3">
                    <input className="admin-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL" />
                    <button className="premium-button" type="button" onClick={handleAddImage}>Add image</button>
                </div>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
                <input className="admin-input" name="productModel" type='text' placeholder='Product model name' required />
                <input className="admin-input" name="description" type="text" placeholder='Short description (optional)' />
                <button className="premium-button w-fit" type="submit">Create category</button>
            </form>
        </section>
    );
};

export default AddCatagory;
