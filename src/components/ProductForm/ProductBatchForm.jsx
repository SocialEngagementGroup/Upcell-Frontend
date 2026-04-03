import React, { useEffect, useMemo, useRef, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB', '4TB'];
const STORAGE_ORDER = STORAGE_OPTIONS.reduce((map, storage, index) => {
    map[storage] = index;
    return map;
}, {});
const COLOR_PRESETS = [
    { name: 'Black', value: '#000000' },
    { name: 'Silver', value: '#D8DADC' },
    { name: 'Blue', value: '#8AA4C4' },
    { name: 'Natural', value: '#B7B1A8' },
    { name: 'Starlight', value: '#F0E8DA' },
    { name: 'Midnight', value: '#2C3440' },
    { name: 'Pink', value: '#E8B7C7' },
    { name: 'Green', value: '#50644F' },
];

const createVariant = () => ({
    storage: '',
    colorName: '',
    colorValue: '#000000',
    useCustomColor: false,
    showColorPicker: false,
    price: '',
    discountPrice: '',
    originalPrice: '',
    outOfStock: false,
});

const getPricingFromMatchingStorage = (variants, storage, currentIndex) => {
    if (!storage) return null;

    for (let index = variants.length - 1; index >= 0; index -= 1) {
        if (index === currentIndex) continue;
        const variant = variants[index];
        if (variant.storage === storage) {
            return {
                price: variant.price || '',
                discountPrice: variant.discountPrice || '',
                originalPrice: variant.originalPrice || '',
            };
        }
    }

    return null;
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const ProductBatchForm = ({ categories, existingProducts, initialProductName, initialCategoryId, onCreateCategory, onSubmit, submitting }) => {
    const [formState, setFormState] = useState({
        productName: '',
        categoryId: '',
    });
    const [useNewCategory, setUseNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [variants, setVariants] = useState([createVariant()]);
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showProductSuggestions, setShowProductSuggestions] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!initialProductName) return;
        setFormState((current) => (
            current.productName === initialProductName
                ? current
                : { ...current, productName: initialProductName }
        ));
    }, [initialProductName]);

    useEffect(() => {
        if (!initialCategoryId || editingProduct) return;
        setFormState((current) => (
            current.categoryId === initialCategoryId
                ? current
                : { ...current, categoryId: initialCategoryId }
        ));
    }, [editingProduct, initialCategoryId]);

    const matchedExistingProduct = useMemo(() => {
        const productName = formState.productName.trim().toLowerCase();
        if (!productName) return null;
        return existingProducts.find((product) => product.productName.trim().toLowerCase() === productName) || null;
    }, [existingProducts, formState.productName]);

    const productSuggestions = useMemo(() => {
        const query = formState.productName.trim().toLowerCase();
        if (!query) return existingProducts.slice(0, 8);

        return existingProducts
            .filter((product) => product.productName.toLowerCase().includes(query))
            .slice(0, 8);
    }, [existingProducts, formState.productName]);

    useEffect(() => {
        if (!matchedExistingProduct) {
            setEditingProduct(null);
            return;
        }

        if (editingProduct?.parentId === matchedExistingProduct.parentId) return;

        setEditingProduct(matchedExistingProduct);
        setUseNewCategory(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
        setFormState({
            productName: matchedExistingProduct.productName,
            categoryId: matchedExistingProduct.categoryId || (
                categories.find((category) => category.modelName === matchedExistingProduct.categoryName)?._id || ''
            ),
        });
        setImages((matchedExistingProduct.images || []).map((image) => image.url).filter(Boolean));
        setVariants(
            matchedExistingProduct.variants.length
                ? matchedExistingProduct.variants.map((variant) => ({
                    storage: variant.storage || '',
                    colorName: variant.colorName || '',
                    colorValue: variant.colorValue || '#000000',
                    useCustomColor: !COLOR_PRESETS.some((color) => (
                        color.name === variant.colorName
                        && color.value.toLowerCase() === (variant.colorValue || '').toLowerCase()
                    )),
                    showColorPicker: false,
                    price: variant.price ?? '',
                    discountPrice: variant.discountPrice ?? '',
                    originalPrice: variant.originalPrice ?? '',
                    outOfStock: Boolean(variant.outOfStock),
                }))
                : [createVariant()]
        );
        setShowProductSuggestions(false);
    }, [categories, editingProduct?.parentId, matchedExistingProduct]);

    const handleProductNameChange = (value) => {
        setFormState((current) => ({ ...current, productName: value }));
        setShowProductSuggestions(true);
    };

    const handleProductSuggestionSelect = (productName) => {
        setFormState((current) => ({ ...current, productName }));
        setShowProductSuggestions(false);
    };

    const canSubmit = useMemo(() => (
        formState.productName.trim()
        && images.length > 0
        && (useNewCategory ? newCategoryName.trim() : formState.categoryId)
        && variants.every((variant) => variant.storage && variant.colorName.trim() && variant.price)
    ), [formState, images.length, newCategoryName, useNewCategory, variants]);

    const sortedVariants = useMemo(() => (
        variants
            .map((variant, index) => ({ variant, index }))
            .sort((left, right) => {
                const leftOrder = STORAGE_ORDER[left.variant.storage] ?? Number.MAX_SAFE_INTEGER;
                const rightOrder = STORAGE_ORDER[right.variant.storage] ?? Number.MAX_SAFE_INTEGER;
                if (leftOrder !== rightOrder) return leftOrder - rightOrder;
                return (left.variant.colorName || '').localeCompare(right.variant.colorName || '');
            })
    ), [variants]);

    const updateVariant = (index, patch) => {
        setVariants((current) => current.map((variant, variantIndex) => (
            variantIndex === index ? { ...variant, ...patch } : variant
        )));
    };

    const handleStorageChange = (index, storage) => {
        setVariants((current) => {
            const pricing = getPricingFromMatchingStorage(current, storage, index);
            return current.map((variant, variantIndex) => {
                if (variantIndex !== index) return variant;

                return {
                    ...variant,
                    storage,
                    ...(pricing ? {
                        price: variant.price || pricing.price,
                        discountPrice: variant.discountPrice || pricing.discountPrice,
                        originalPrice: variant.originalPrice || pricing.originalPrice,
                    } : {}),
                };
            });
        });
    };

    const removeVariant = (index) => {
        setVariants((current) => current.length === 1 ? current : current.filter((_, variantIndex) => variantIndex !== index));
    };

    const duplicateVariant = (index) => {
        setVariants((current) => {
            const source = current[index];
            if (!source) return current;

            const clone = {
                ...source,
                colorName: '',
                colorValue: source.colorValue || '#000000',
                useCustomColor: false,
                showColorPicker: true,
            };

            const next = [...current];
            next.splice(index + 1, 0, clone);
            return next;
        });
    };

    const handlePresetColor = (index, value) => {
        if (!value) {
            updateVariant(index, { colorName: '', colorValue: '#000000', useCustomColor: true, showColorPicker: true });
            return;
        }

        const [name, colorValue] = value.split('|');
        setVariants((current) => {
            const target = current[index];
            if (!target) return current;

            if (!target.colorName || target.colorName === name) {
                return current.map((variant, variantIndex) => (
                    variantIndex === index
                        ? { ...variant, colorName: name, colorValue, useCustomColor: false, showColorPicker: false }
                        : variant
                ));
            }

            const duplicate = {
                ...target,
                colorName: name,
                colorValue,
                useCustomColor: false,
                showColorPicker: false,
            };

            const next = [...current];
            next.splice(index + 1, 0, duplicate);
            return next;
        });
    };

    const addFiles = async (fileList) => {
        const acceptedFiles = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
        if (!acceptedFiles.length) return;

        const dataUrls = await Promise.all(acceptedFiles.map(readFileAsDataUrl));
        setImages((current) => [...current, ...dataUrls]);
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        setIsDragging(false);
        await addFiles(event.dataTransfer.files);
    };

    const handleFileSelect = async (event) => {
        await addFiles(event.target.files);
        event.target.value = '';
    };

    const removeImage = (index) => {
        setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let selectedCategory = categories.find((category) => category._id === formState.categoryId);
        if (useNewCategory) {
            selectedCategory = await onCreateCategory({
                modelName: newCategoryName.trim(),
                description: newCategoryDescription.trim(),
                images: images.map((url) => ({ url })),
            });
        }

        const payload = {
            existingParentId: editingProduct?.parentId,
            productName: formState.productName.trim(),
            categoryId: selectedCategory?._id,
            categoryName: selectedCategory?.modelName || newCategoryName.trim(),
            image: images[0],
            images: images.map((url) => ({ url })),
            variants: variants.map((variant) => ({
                storage: variant.storage,
                color: {
                    name: variant.colorName.trim(),
                    value: variant.colorValue.trim(),
                },
                price: variant.price,
                discountPrice: variant.discountPrice,
                originalPrice: variant.originalPrice,
                outOfStock: Boolean(variant.outOfStock),
            })),
        };

        await onSubmit(payload);
        setFormState({
            productName: '',
            categoryId: '',
        });
        setUseNewCategory(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
        setVariants([createVariant()]);
        setImages([]);
        setEditingProduct(null);
    };

    return (
        <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor="productName">Product name</label>
                    <div className="relative">
                        <input
                            id="productName"
                            className="admin-input"
                            placeholder="e.g. iPhone 16 Pro"
                            value={formState.productName}
                            onChange={(event) => handleProductNameChange(event.target.value)}
                            onFocus={() => setShowProductSuggestions(true)}
                            onBlur={() => {
                                window.setTimeout(() => setShowProductSuggestions(false), 120);
                            }}
                            required
                        />
                        {showProductSuggestions && productSuggestions.length > 0 && (
                            <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-[20px] border border-black/[0.08] bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                                {productSuggestions.map((product) => (
                                    <button
                                        key={product.parentId}
                                        type="button"
                                        className="flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left transition-colors hover:bg-surface-alt/70"
                                        onMouseDown={() => handleProductSuggestionSelect(product.productName)}
                                    >
                                        <span>
                                            <span className="block text-sm font-bold text-apple-text">{product.productName}</span>
                                            <span className="block text-xs text-apple-gray">
                                                {product.categoryName || 'No category'} • {product.variants.length} variant{product.variants.length === 1 ? '' : 's'}
                                            </span>
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-apple-gray">Use</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {editingProduct && (
                        <p className="mt-2 text-sm font-bold text-apple-text">
                            Existing product found. You are editing its saved variants.
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor="category">Category</label>
                    {!useNewCategory ? (
                        <select
                            id="category"
                            className="admin-select"
                            value={formState.categoryId}
                            onChange={(event) => setFormState((current) => ({ ...current, categoryId: event.target.value }))}
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.modelName}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id="category"
                            className="admin-input"
                            placeholder="New category name"
                            value={newCategoryName}
                            onChange={(event) => setNewCategoryName(event.target.value)}
                            required
                        />
                    )}
                    <button
                        type="button"
                        className="mt-3 text-sm font-bold text-apple-text underline-offset-4 hover:underline"
                        onClick={() => setUseNewCategory((current) => !current)}
                    >
                        {useNewCategory ? 'Choose existing category' : 'Add new category from here'}
                    </button>
                </div>
            </div>

            {useNewCategory && (
                <div>
                    <label className="mb-2 block text-sm font-bold text-apple-text" htmlFor="newCategoryDescription">New category description</label>
                    <input
                        id="newCategoryDescription"
                        className="admin-input"
                        placeholder="Optional category description"
                        value={newCategoryDescription}
                        onChange={(event) => setNewCategoryDescription(event.target.value)}
                    />
                </div>
            )}

            <div>
                <div className="mb-2 block text-sm font-bold text-apple-text">Photos</div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <button
                    type="button"
                    className={`flex min-h-[180px] w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed px-6 py-10 text-center transition-all ${
                        isDragging ? 'border-apple-text bg-black/[0.03]' : 'border-black/[0.08] bg-surface-alt/40'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                >
                    <span className="text-lg font-bold text-apple-text">Drag and drop photos here</span>
                    <span className="mt-2 text-sm text-ink-soft">or click to browse from your computer</span>
                    <span className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-apple-gray">First photo becomes the primary product image</span>
                </button>

                {images.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {images.map((image, index) => (
                            <div key={`${image.slice(0, 30)}-${index}`} className="overflow-hidden rounded-[22px] border border-black/[0.06] bg-white">
                                <div className="relative aspect-square bg-surface-alt/40">
                                    <img src={image} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                                    {index === 0 && (
                                        <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                                            Primary
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between px-3 py-3">
                                    <span className="text-xs font-bold text-apple-gray">Photo {index + 1}</span>
                                    <button type="button" className="text-xs font-bold text-apple-text hover:underline" onClick={() => removeImage(index)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-surface-alt/60">
                <div className="p-4 md:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-bold text-apple-text">Variants</h3>
                            <p className="mt-1 text-sm text-ink-soft">Create storage and color combinations with custom pricing and stock state.</p>
                        </div>
                        <button type="button" className="premium-button-secondary" onClick={() => setVariants((current) => [...current, createVariant()])}>
                            Add variant
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-alt/70 backdrop-blur-md">
                            <tr>
                                <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-soft">Storage</th>
                                <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-soft">Color</th>
                                <th className="px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-ink-soft">Price</th>
                                <th className="px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-ink-soft">Discount</th>
                                <th className="px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-ink-soft">Original</th>
                                <th className="px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-ink-soft">Stock</th>
                                <th className="px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-ink-soft">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04] rounded-[22px] border border-black/[0.06] bg-white">
                            {sortedVariants.map(({ variant, index }) => (
                                <React.Fragment key={index}>
                                    <tr className="align-middle hover:bg-surface-alt/20 transition-colors">
                                        <td className="px-4 py-3 align-middle">
                                            <select
                                                className="admin-select h-9 w-full py-0 text-sm"
                                                value={variant.storage}
                                                onChange={(event) => handleStorageChange(index, event.target.value)}
                                                required
                                            >
                                                <option value="">Storage</option>
                                                {STORAGE_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 align-middle">
                                            <button
                                                type="button"
                                                className="flex h-9 w-full items-center justify-between gap-3 rounded-[15px] border border-black/[0.08] bg-white px-3 text-left transition-all hover:border-black/[0.16]"
                                                onClick={() => updateVariant(index, { showColorPicker: !variant.showColorPicker })}
                                            >
                                                <span className="flex min-w-0 items-center gap-3">
                                                    <span
                                                        className="h-4 w-4 rounded-full border border-black/[0.08]"
                                                        style={{ backgroundColor: variant.colorValue || '#000000' }}
                                                    />
                                                    <span className="truncate whitespace-nowrap text-sm font-semibold text-apple-text">
                                                        {variant.colorName || (variant.useCustomColor ? 'Other' : 'Choose color')}
                                                    </span>
                                                </span>
                                                <span className="text-sm text-apple-gray">⌄</span>
                                            </button>
                                        </td>
                                        <td className="px-2 py-3 align-middle text-center">
                                            <input
                                                className="admin-input mx-auto h-9 w-full max-w-[132px] py-0 text-center"
                                                type="number"
                                                min="0"
                                                value={variant.price}
                                                onChange={(event) => updateVariant(index, { price: event.target.value })}
                                                required
                                            />
                                        </td>
                                        <td className="px-2 py-3 align-middle text-center">
                                            <input
                                                className="admin-input mx-auto h-9 w-full max-w-[132px] py-0 text-center"
                                                type="number"
                                                min="0"
                                                value={variant.discountPrice}
                                                onChange={(event) => updateVariant(index, { discountPrice: event.target.value })}
                                            />
                                        </td>
                                        <td className="px-2 py-3 align-middle text-center">
                                            <input
                                                className="admin-input mx-auto h-9 w-full max-w-[132px] py-0 text-center"
                                                type="number"
                                                min="0"
                                                value={variant.originalPrice}
                                                onChange={(event) => updateVariant(index, { originalPrice: event.target.value })}
                                            />
                                        </td>
                                        <td className="px-2 py-3 align-middle text-center">
                                            <button
                                                type="button"
                                                className={`inline-flex items-center rounded-full px-1 py-1 transition-all ${
                                                    variant.outOfStock
                                                        ? 'bg-red-50 hover:bg-red-100'
                                                        : 'bg-emerald-50 hover:bg-emerald-100'
                                                }`}
                                                onClick={() => updateVariant(index, { outOfStock: !variant.outOfStock })}
                                                title={variant.outOfStock ? 'Mark in stock' : 'Mark out of stock'}
                                                aria-label={variant.outOfStock ? 'Mark in stock' : 'Mark out of stock'}
                                            >
                                                <span
                                                    className={`relative block h-5 w-10 rounded-full transition-colors ${
                                                        variant.outOfStock ? 'bg-red-200' : 'bg-emerald-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all ${
                                                            variant.outOfStock ? 'left-1' : 'left-[22px]'
                                                        }`}
                                                    />
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-2 py-3 align-middle text-center">
                                            <button
                                                type="button"
                                                className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 transition-all hover:bg-red-100"
                                                onClick={() => removeVariant(index)}
                                                title="Delete variant"
                                                aria-label="Delete variant"
                                                disabled={variants.length === 1}
                                            >
                                                <DeleteOutlineIcon className="!text-[18px]" />
                                            </button>
                                        </td>
                                    </tr>

                                    {variant.showColorPicker && (
                                        <tr className="bg-surface-alt/25">
                                            <td colSpan="7" className="px-4 py-3">
                                                <div className="rounded-[18px] border border-black/[0.06] bg-white p-3">
                                                    <div className="flex flex-wrap gap-3">
                                                        {COLOR_PRESETS.map((color) => {
                                                            const isActive = !variant.useCustomColor && variant.colorName === color.name && variant.colorValue.toLowerCase() === color.value.toLowerCase();
                                                            return (
                                                                <button
                                                                    key={color.name}
                                                                    type="button"
                                                                    className={`flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${
                                                                        isActive
                                                                            ? 'border-apple-text bg-apple-text text-white'
                                                                            : 'border-black/[0.08] bg-white text-apple-text hover:border-black/[0.16]'
                                                                    }`}
                                                                    onClick={() => handlePresetColor(index, `${color.name}|${color.value}`)}
                                                                >
                                                                    <span
                                                                        className={`h-4 w-4 rounded-full border ${isActive ? 'border-white/60' : 'border-black/[0.08]'}`}
                                                                        style={{ backgroundColor: color.value }}
                                                                    />
                                                                    {color.name}
                                                                </button>
                                                            );
                                                        })}
                                                        <button
                                                            type="button"
                                                            className={`rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${
                                                                variant.useCustomColor
                                                                    ? 'border-apple-text bg-apple-text text-white'
                                                                    : 'border-black/[0.08] bg-white text-apple-text hover:border-black/[0.16]'
                                                            }`}
                                                            onClick={() => updateVariant(index, {
                                                                useCustomColor: true,
                                                                showColorPicker: true,
                                                                colorName: variant.colorName || '',
                                                                colorValue: variant.colorValue || '#000000',
                                                            })}
                                                        >
                                                            Other
                                                        </button>
                                                        {variant.storage && (
                                                            <button
                                                                type="button"
                                                                className="rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-bold text-apple-text transition-all hover:border-black/[0.16]"
                                                                onClick={() => duplicateVariant(index)}
                                                            >
                                                                Add same storage
                                                            </button>
                                                        )}
                                                    </div>

                                                    {variant.useCustomColor && (
                                                        <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,220px)_minmax(0,220px)]">
                                                            <input
                                                                className="admin-input"
                                                                placeholder="Color name"
                                                                value={variant.colorName}
                                                                onChange={(event) => updateVariant(index, { colorName: event.target.value })}
                                                                required
                                                            />
                                                            <div className="flex gap-3">
                                                                <input
                                                                    className="h-9 w-11 rounded-[12px] border border-black/[0.08] bg-white p-1.5"
                                                                    type="color"
                                                                    value={variant.colorValue}
                                                                    onChange={(event) => updateVariant(index, { colorValue: event.target.value })}
                                                                />
                                                                <input
                                                                    className="admin-input"
                                                                    value={variant.colorValue}
                                                                    onChange={(event) => updateVariant(index, { colorValue: event.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button className="premium-button w-fit" type="submit" disabled={!canSubmit || submitting}>
                {submitting ? 'Saving…' : 'Save product'}
            </button>
        </form>
    );
};

export default ProductBatchForm;
