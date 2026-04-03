import React from 'react';
import axiosInstance from '../../utilities/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SingleProductForAdmin = ({ product, setAllProduct }) => {
    const navigate = useNavigate();
    const { _id, productName, description, storage, color, price, discountPrice, originalPrice, reviewScore, peopleReviewed, condition, image } = product;

    const handleDelete = () => {
        if (window.confirm('Delete this product permanently?')) {
            axiosInstance.delete(`product/${_id}`).then(() => {
                setAllProduct((prev) => prev.filter((item) => item._id !== _id));
            });
        }
    };

    return (
        <div className="admin-panel rounded-[30px] p-6">
            <div className="flex gap-5">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[24px] bg-surface-alt">
                    <img className="max-h-[80%] w-auto object-contain" src={image} alt={productName} />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-[28px]">{productName}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink-soft">{description || 'No description added yet.'}</p>
                </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                    `Storage: ${storage || '-'}`,
                    `Condition: ${condition || '-'}`,
                    `Color: ${color?.name || '-'}`,
                    `Price: $${price || 0}`,
                    `Discount: $${discountPrice || 0}`,
                    `Original: $${originalPrice || 0}`,
                    `Review score: ${reviewScore || 0}`,
                    `Reviewed by: ${peopleReviewed || 0}`,
                ].map((item) => (
                    <div key={item} className="rounded-2xl bg-surface-alt px-4 py-3 text-sm font-semibold text-apple-text">{item}</div>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <button className="premium-button" onClick={() => navigate(`/admin-secret/editProduct/${_id}`)}>Edit product</button>
                <button className="premium-button-secondary" onClick={handleDelete}>Delete product</button>
            </div>
        </div>
    );
};

export default SingleProductForAdmin;
