import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../utilities/axiosInstance';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toast } from 'react-toastify';
import AdminConfirmModal from '../../../../components/AdminConfirmModal/AdminConfirmModal';

const currency = (value) => {
    if (value === '' || value === null || typeof value === 'undefined') return '-';
    return `$${value}`;
};

const SingleProductGroup = ({ productGroup, onDelete }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [draftVariants, setDraftVariants] = useState(() => productGroup.variants);
    const [savingVariantId, setSavingVariantId] = useState('');
    const [editingVariantId, setEditingVariantId] = useState('');
    const [confirmState, setConfirmState] = useState({ open: false, mode: '', variant: null });

    const updateDraftVariant = (variantId, patch) => {
        setDraftVariants((current) => current.map((variant) => (
            variant._id === variantId ? { ...variant, ...patch } : variant
        )));
    };

    const sortedVariants = useMemo(() => (
        [...draftVariants].sort((left, right) => {
            const storageCompare = (left.storage || '').localeCompare(right.storage || '', undefined, { numeric: true });
            if (storageCompare !== 0) return storageCompare;
            return (left.color?.name || '').localeCompare(right.color?.name || '');
        })
    ), [draftVariants]);

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`product-family/${productGroup.parentId}`);
            onDelete(productGroup.parentId);
            toast.success('Product family deleted');
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete product family');
        } finally {
            setConfirmState({ open: false, mode: '', variant: null });
        }
    };

    const handleVariantSave = async (variant) => {
        setSavingVariantId(variant._id);
        try {
            await axiosInstance.patch(`product/${variant._id}`, {
                price: variant.price,
                discountPrice: variant.discountPrice,
                originalPrice: variant.originalPrice,
                outOfStock: Boolean(variant.outOfStock),
            });
            setEditingVariantId('');
        } catch (error) {
            console.log(error);
        } finally {
            setSavingVariantId('');
        }
    };

    const handleVariantDelete = async (variant) => {
        setSavingVariantId(variant._id);

        try {
            const isLastVariant = draftVariants.length === 1;
            if (isLastVariant) {
                await axiosInstance.delete(`product-family/${productGroup.parentId}`);
                onDelete(productGroup.parentId);
                toast.success('Last variant deleted with product family');
                return;
            }

            await axiosInstance.delete(`product/${variant._id}`);
            setDraftVariants((current) => current.filter((item) => item._id !== variant._id));
            if (editingVariantId === variant._id) {
                setEditingVariantId('');
            }
            toast.success('Variant deleted');
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete variant');
        } finally {
            setSavingVariantId('');
            setConfirmState({ open: false, mode: '', variant: null });
        }
    };

    const handleStockToggle = async (variant) => {
        const nextOutOfStock = !variant.outOfStock;
        updateDraftVariant(variant._id, { outOfStock: nextOutOfStock });
        setSavingVariantId(variant._id);

        try {
            await axiosInstance.patch(`product/${variant._id}`, {
                outOfStock: nextOutOfStock,
            });
        } catch (error) {
            console.log(error);
            updateDraftVariant(variant._id, { outOfStock: variant.outOfStock });
        } finally {
            setSavingVariantId('');
        }
    };

    const handleQuickEdit = (variantId) => {
        setEditingVariantId(variantId);
    };

    const handleCancelEdit = (variantId) => {
        const originalVariant = productGroup.variants.find((variant) => variant._id === variantId);
        if (!originalVariant) {
            setEditingVariantId('');
            return;
        }

        setDraftVariants((current) => current.map((variant) => (
            variant._id === variantId ? { ...originalVariant } : variant
        )));
        setEditingVariantId('');
    };

    return (
        <div className="admin-panel rounded-[30px] p-6 transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
                <div
                    onClick={() => setIsOpen((current) => !current)}
                    className="group flex cursor-pointer items-start gap-4"
                >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-surface-alt">
                        <img
                            className="max-h-full w-auto object-contain"
                            src={productGroup.image || '/staticImages/notAvailable.webp'}
                            alt={productGroup.productName}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className={`text-[28px] font-medium transition-colors ${isOpen ? 'text-apple-blue' : 'group-hover:text-apple-blue'}`}>
                                {productGroup.productName}
                            </h3>
                            <span className={`text-xl transition-transform duration-300 ${isOpen ? 'rotate-180 text-apple-blue' : 'text-ink-soft'}`}>
                                ⌄
                            </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-bold text-ink-soft">
                                {productGroup.categoryName || 'No category'}
                            </span>
                            <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-bold text-ink-soft">
                                {productGroup.variants.length} Variant{productGroup.variants.length === 1 ? '' : 's'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        className="premium-button-secondary"
                        onClick={() => navigate(`/admin-secret/addproduct?product=${encodeURIComponent(productGroup.productName)}`)}
                    >
                        Edit product
                    </button>
                    <button className="premium-button-secondary" onClick={() => setConfirmState({ open: true, mode: 'family', variant: null })}>
                        Delete product
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
                    <div className="max-h-[520px] overflow-y-auto">
                        <table className="w-full table-fixed text-left">
                            <colgroup>
                                <col className="w-[14%]" />
                                <col className="w-[18%]" />
                                <col className="w-[15%]" />
                                <col className="w-[15%]" />
                                <col className="w-[15%]" />
                                <col className="w-[11%]" />
                                <col className="w-[12%]" />
                            </colgroup>
                            <thead className="sticky top-0 bg-surface-alt/70 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-soft">Storage</th>
                                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-soft">Color</th>
                                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-soft text-center">Price</th>
                                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-soft text-center">Discount</th>
                                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-soft text-center">Original</th>
                                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-soft text-center">Stock</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-ink-soft">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[0.04]">
                                {sortedVariants.map((variant) => (
                                    <tr key={variant._id} className="hover:bg-surface-alt/20 transition-colors">
                                        <td className="px-6 py-4 align-middle text-sm font-semibold text-apple-text">{variant.storage || '-'}</td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="h-4 w-4 rounded-full border border-black/[0.08]"
                                                    style={{ backgroundColor: variant.color?.value || variant.color?.hex || '#d1d5db' }}
                                                />
                                                <span className="text-sm font-semibold text-apple-text">{variant.color?.name || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-middle text-center">
                                            {editingVariantId === variant._id ? (
                                                <input
                                                    className="admin-input mx-auto h-10 w-full max-w-[120px] py-0 text-center"
                                                    type="number"
                                                    min="0"
                                                    value={variant.price ?? ''}
                                                    onChange={(event) => updateDraftVariant(variant._id, { price: event.target.value })}
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-apple-text">{currency(variant.price)}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 align-middle text-center">
                                            {editingVariantId === variant._id ? (
                                                <input
                                                    className="admin-input mx-auto h-10 w-full max-w-[120px] py-0 text-center"
                                                    type="number"
                                                    min="0"
                                                    value={variant.discountPrice ?? ''}
                                                    onChange={(event) => updateDraftVariant(variant._id, { discountPrice: event.target.value })}
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-apple-text">{currency(variant.discountPrice)}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 align-middle text-center">
                                            {editingVariantId === variant._id ? (
                                                <input
                                                    className="admin-input mx-auto h-10 w-full max-w-[120px] py-0 text-center"
                                                    type="number"
                                                    min="0"
                                                    value={variant.originalPrice ?? ''}
                                                    onChange={(event) => updateDraftVariant(variant._id, { originalPrice: event.target.value })}
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-apple-text">{currency(variant.originalPrice)}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 align-middle text-center">
                                            <button
                                                type="button"
                                                className={`inline-flex items-center rounded-full px-1.5 py-1.5 transition-all ${
                                                    variant.outOfStock
                                                        ? 'bg-red-50 hover:bg-red-100'
                                                        : 'bg-emerald-50 hover:bg-emerald-100'
                                                } ${savingVariantId === variant._id ? 'opacity-70' : ''}`}
                                                onClick={() => handleStockToggle(variant)}
                                                disabled={savingVariantId === variant._id}
                                                title={variant.outOfStock ? 'Mark in stock' : 'Mark out of stock'}
                                                aria-label={variant.outOfStock ? 'Mark in stock' : 'Mark out of stock'}
                                                >
                                                    <span
                                                        className={`relative block h-6 w-11 rounded-full transition-colors ${
                                                            variant.outOfStock ? 'bg-red-200' : 'bg-emerald-200'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all ${
                                                                variant.outOfStock ? 'left-1' : 'left-6'
                                                            }`}
                                                        />
                                                    </span>
                                                </button>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            {editingVariantId === variant._id ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-white text-apple-text transition-all hover:border-black/[0.16] hover:bg-surface-alt/60"
                                                        onClick={() => handleCancelEdit(variant._id)}
                                                        disabled={savingVariantId === variant._id}
                                                        title="Cancel"
                                                        aria-label="Cancel"
                                                    >
                                                        <CloseIcon className="!text-[18px]" />
                                                    </button>
                                                    <button
                                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-white text-apple-text transition-all hover:border-black/[0.16] hover:bg-surface-alt/60"
                                                        onClick={() => handleVariantSave(variant)}
                                                        disabled={savingVariantId === variant._id}
                                                        title="Save"
                                                        aria-label="Save"
                                                    >
                                                        <CheckIcon className="!text-[18px]" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-white text-apple-text transition-all hover:border-black/[0.16] hover:bg-surface-alt/60"
                                                        onClick={() => handleQuickEdit(variant._id)}
                                                        title="Quick edit"
                                                        aria-label="Quick edit"
                                                    >
                                                        <EditOutlinedIcon className="!text-[18px]" />
                                                    </button>
                                                    <button
                                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 transition-all hover:bg-red-100 disabled:opacity-60"
                                                        onClick={() => setConfirmState({ open: true, mode: 'variant', variant })}
                                                        disabled={savingVariantId === variant._id}
                                                        title="Delete variant"
                                                        aria-label="Delete variant"
                                                    >
                                                        <DeleteOutlineIcon className="!text-[18px]" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AdminConfirmModal
                open={confirmState.open}
                title={confirmState.mode === 'family' ? 'Delete this product family?' : draftVariants.length === 1 ? 'Delete the final variant and product family?' : 'Delete this variant?'}
                description={confirmState.mode === 'family'
                    ? 'This removes the product family and every variant attached to it from the admin catalog.'
                    : draftVariants.length === 1
                        ? 'This is the last remaining variant, so deleting it will also remove the whole product family.'
                        : 'This removes only the selected variant from the product family.'}
                confirmLabel={confirmState.mode === 'family' ? 'Delete product' : 'Delete variant'}
                isLoading={Boolean(confirmState.variant && savingVariantId === confirmState.variant._id)}
                onCancel={() => setConfirmState({ open: false, mode: '', variant: null })}
                onConfirm={() => {
                    if (confirmState.mode === 'family') {
                        handleDelete();
                        return;
                    }

                    if (confirmState.variant) {
                        handleVariantDelete(confirmState.variant);
                    }
                }}
            />
        </div>
    );
};

export default SingleProductGroup;
