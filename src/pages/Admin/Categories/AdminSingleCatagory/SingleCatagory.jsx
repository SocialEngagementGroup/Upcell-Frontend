import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminConfirmModal from '../../../../components/AdminConfirmModal/AdminConfirmModal';
import { useUpdateShopCategoryMutation, useDeleteShopCategoryMutation } from '../../../../queries/categories';
import { useDeleteProductFamilyMutation } from '../../../../queries/products';

const SingleCatagory = ({ catagory, productGroups }) => {
    const navigate = useNavigate();
    const [editClicked, setEditClicked] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [pendingDeleteProduct, setPendingDeleteProduct] = useState(null);
    const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(false);

    const updateCategory = useUpdateShopCategoryMutation();
    const deleteCategory = useDeleteShopCategoryMutation();
    const deleteProductFamily = useDeleteProductFamilyMutation();

    const handleSubmit = (e) => {
        e.preventDefault();
        updateCategory.mutate({
            id: catagory._id,
            patch: { modelName: e.target.categoryName.value.trim() },
        }, {
            onSuccess: () => {
                setEditClicked(false);
                toast.success('Category name updated');
            },
            onError: (error) => {
                console.log(error);
                toast.error('Failed to update category');
            },
        });
    };

    const handleDeleteProduct = (parentId) => {
        deleteProductFamily.mutate(parentId, {
            onSuccess: () => {
                toast.success('Product family deleted');
            },
            onError: (error) => {
                console.log(error);
                toast.error('Failed to delete product family');
            },
            onSettled: () => setPendingDeleteProduct(null),
        });
    };

    const handleDeleteCategory = () => {
        deleteCategory.mutate(catagory._id, {
            onSuccess: () => {
                toast.success('Category deleted');
            },
            onError: (error) => {
                console.log(error);
                toast.error('Failed to delete category');
            },
            onSettled: () => setConfirmDeleteCategory(false),
        });
    };

    const filteredProducts = productGroups.filter(
        (product) => product.categoryName === catagory?.modelName
    );

    return (
        <div className="admin-panel rounded-[30px] p-6 transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
                <div
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="group flex cursor-pointer items-center gap-3"
                >
                    <h3 className={`text-[28px] font-medium transition-colors ${isProductsOpen ? 'text-brand-red' : 'group-hover:text-brand-red'}`}>
                        {catagory?.modelName}
                    </h3>
                    <span className={`text-xl transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-brand-red' : 'text-ink-soft'}`}>
                        ⌄
                    </span>
                    <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-bold text-ink-soft">
                        {filteredProducts.length} Products
                    </span>
                </div>
                <div className="flex gap-3">
                    <button
                        className="premium-button-secondary"
                        onClick={(e) => { e.stopPropagation(); setEditClicked((prev) => !prev); }}
                    >
                        {editClicked ? 'Close editor' : 'Edit name'}
                    </button>
                    <button
                        className="text-sm font-bold text-red-500 hover:underline"
                        onClick={(event) => {
                            event.stopPropagation();
                            setConfirmDeleteCategory(true);
                        }}
                    >
                        Delete category
                    </button>
                    <button
                        className="premium-button h-11 py-0 px-5 text-sm"
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/admin-secret/addproduct?categoryId=${encodeURIComponent(catagory?._id || '')}`);
                        }}
                    >
                        Add product
                    </button>
                </div>
            </div>

            {editClicked && (
                <div className="mt-6 border-t border-black/[0.06] pt-6">
                    <form className="grid max-w-lg gap-4" onSubmit={handleSubmit}>
                        <input
                            className="admin-input"
                            name="categoryName"
                            type='text'
                            placeholder='Category name'
                            defaultValue={catagory?.modelName}
                            required
                        />
                        <button className="premium-button w-fit" type="submit" disabled={updateCategory.isPending}>
                            {updateCategory.isPending ? 'Saving…' : 'Save changes'}
                        </button>
                    </form>
                </div>
            )}

            {isProductsOpen && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
                    <div className="max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-surface-alt/70 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-soft">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-soft">Price</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-ink-soft">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[0.04]">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product.parentId} className="group hover:bg-surface-alt/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-surface-alt p-1">
                                                        <img src={product.image || '/staticImages/notAvailable.webp'} className="h-full w-full object-contain" alt="" />
                                                    </div>
                                                    <div>
                                                        <span className="block font-semibold text-apple-text">{product.productName}</span>
                                                        <span className="block text-xs font-bold text-ink-soft">
                                                            {product.variants.length} variant{product.variants.length === 1 ? '' : 's'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {product.variants[0]?.price ? `$${product.variants[0].price}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => navigate(`/admin-secret/addproduct?product=${encodeURIComponent(product.productName)}&parentId=${product.parentId}`)}
                                                        className="text-sm font-bold text-brand-red hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setPendingDeleteProduct(product)}
                                                        className="text-sm font-bold text-red-500 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-sm text-ink-soft">
                                            No products in this category.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AdminConfirmModal
                open={Boolean(pendingDeleteProduct)}
                title="Delete this product family?"
                description={`This will remove ${pendingDeleteProduct?.productName || 'this product'} and all of its variants from the selected category view.`}
                confirmLabel="Delete product"
                isLoading={Boolean(pendingDeleteProduct) && deleteProductFamily.isPending}
                onCancel={() => setPendingDeleteProduct(null)}
                onConfirm={() => pendingDeleteProduct && handleDeleteProduct(pendingDeleteProduct.parentId)}
            />

            <AdminConfirmModal
                open={confirmDeleteCategory}
                title={`Delete "${catagory?.modelName}"?`}
                description={filteredProducts.length
                    ? `This removes the category entry only — the ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} in it won't be deleted, but they'll need a category re-assigned next time they're edited.`
                    : 'This removes the category entry from the catalog.'}
                confirmLabel="Delete category"
                isLoading={deleteCategory.isPending}
                onCancel={() => setConfirmDeleteCategory(false)}
                onConfirm={handleDeleteCategory}
            />
        </div>
    );
};

export default SingleCatagory;
