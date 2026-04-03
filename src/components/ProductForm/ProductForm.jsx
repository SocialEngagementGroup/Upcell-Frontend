import React from 'react';

function ProductForm({ allCatagories, handleSubmit, product, setProduct, setImages, setSelectedImage, selectedImage }) {
    const availableColors = [
        { name: "BLACK", value: "#000000" },
        { name: "SIERRA BLUE", value: "#9BB5CE" },
        { name: "GRAPHITE", value: "#5C5B57" },
        { name: "GOLD", value: "#F9E5C9" },
        { name: "ALPINE GREEN", value: "#505F4E" },
        { name: "SILVER", value: "#F5F5F0" },
        { name: "RED", value: "#A50011" },
        { name: "STARLIGHT", value: "#F9F3EE" },
        { name: "MIDNIGHT", value: "#171E27" },
        { name: "BLUE", value: "#215E7C" },
        { name: "PINK", value: "#FAE0D8" },
        { name: "GREEN", value: "#364935" },
    ];

    return (
        <form className="grid gap-5" onSubmit={handleSubmit}>
            <div>
                <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='parent'>Product family</label>
                <select
                    className="admin-select"
                    id="parent"
                    required
                    value={product.parentCatagory}
                    onChange={(e) => {
                        setProduct((prev) => ({ ...prev, parentCatagory: e.target.value }));
                        if (e.target.value) {
                            const images = allCatagories.find((ele) => ele._id === e.target.value)?.images || [];
                            setImages(images);
                        } else {
                            setImages([]);
                            setSelectedImage("");
                        }
                    }}
                >
                    <option value="">None selected</option>
                    {allCatagories.map((catagory) => (
                        <option key={catagory._id} value={catagory._id}>{catagory.modelName}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='description'>Short description</label>
                <textarea
                    className="admin-textarea"
                    id='description'
                    name="description"
                    placeholder='Description'
                    value={product.description}
                    onChange={(e) => setProduct((prev) => ({ ...prev, description: e.target.value }))}
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='image'>Primary image URL</label>
                <input
                    className="admin-input"
                    id='image'
                    name="image"
                    placeholder='https://...'
                    value={selectedImage || ""}
                    onChange={(e) => setSelectedImage(e.target.value)}
                    required
                />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='storage'>Storage</label>
                    <select className="admin-select" name="storage" id="storage" required value={product.storage} onChange={(e) => setProduct((prev) => ({ ...prev, storage: e.target.value }))}>
                        <option value="">None selected</option>
                        <option value="64 GB">64 GB</option>
                        <option value="128 GB">128 GB</option>
                        <option value="256 GB">256 GB</option>
                        <option value="512 GB">512 GB</option>
                        <option value="1 TB">1 TB</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='condition'>Condition</label>
                    <select className="admin-select" name="condition" id="condition" required value={product.condition} onChange={(e) => setProduct((prev) => ({ ...prev, condition: e.target.value }))}>
                        <option value="">None selected</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Refubrished">Refubrished</option>
                        <option value="New">New</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='color'>Color</label>
                <select
                    className="admin-select"
                    id='color'
                    name='color'
                    required
                    value={product.color?.name ? `${product.color.name}:${product.color.value}` : ""}
                    onChange={(e) => {
                        setProduct((prev) => {
                            if (!e.target.value) return { ...prev, color: { name: "", value: "" } };
                            const output = e.target.value.split(":");
                            return { ...prev, color: { name: output[0], value: output[1] } };
                        });
                    }}
                >
                    <option value="">None selected</option>
                    {availableColors.map((singleColor) => (
                        <option key={singleColor.name} value={`${singleColor.name}:${singleColor.value}`}>{singleColor.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='price'>Price</label>
                    <input className="admin-input" id='price' name="price" type='number' required value={product.price} onChange={(e) => setProduct((prev) => ({ ...prev, price: e.target.value }))} />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='discountPrice'>Discount price</label>
                    <input className="admin-input" id='discountPrice' name="discountPrice" type='number' value={product.discountPrice} onChange={(e) => setProduct((prev) => ({ ...prev, discountPrice: e.target.value }))} />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='originalPrice'>Original price</label>
                    <input className="admin-input" id='originalPrice' name="originalPrice" type='number' value={product.originalPrice} onChange={(e) => setProduct((prev) => ({ ...prev, originalPrice: e.target.value }))} />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='reviewScore'>Review score</label>
                    <input className="admin-input" id='reviewScore' name="reviewScore" type='number' min={0} max={5} step={0.5} required value={product.reviewScore} onChange={(e) => setProduct((prev) => ({ ...prev, reviewScore: e.target.value }))} />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor='peopleReviewed'>People reviewed</label>
                    <input className="admin-input" id='peopleReviewed' name="peopleReviewed" type='number' value={product.peopleReviewed} onChange={(e) => setProduct((prev) => ({ ...prev, peopleReviewed: e.target.value }))} />
                </div>
            </div>

            <button className="premium-button w-fit" type="submit">Save product</button>
        </form>
    );
}

export default ProductForm;
