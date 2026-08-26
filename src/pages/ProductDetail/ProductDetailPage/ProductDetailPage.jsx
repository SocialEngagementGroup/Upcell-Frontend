import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import ScrollToTop from '../../../utilities/ScrollToTop';
import { CartContext } from '../../../App';
import { toast } from 'react-toastify';

import { groupProductsByParent } from '../../../utilities/catalog';
import { useProductsQuery } from '../../../queries/products';
import { EMPTY_ARRAY } from '../../../queries/keys';

const featureCards = [
    {
        title: 'Condition clarity',
        body: 'We present every finish, storage tier, and cosmetic grade in a quieter, easier to trust format.',
    },
    {
        title: 'Premium packaging',
        body: 'Devices arrive cleaned, protected, and ready for migration with straightforward setup guidance.',
    },
    {
        title: 'Warranty included',
        body: 'Every order is backed by UpCell IT Inc. support and practical coverage designed for peace of mind.',
    },
];

const ESSENTIAL_ADDONS = [
    { id: 'addon_case', name: 'Clear Case (MagSafe)', price: 39, description: 'Crystal clear, yellowing-resistant protection.' },
    { id: 'addon_protector', name: 'Ultra-Glass Protector', price: 19, description: 'Edge-to-edge scratch and impact defense.' },
];

// Plain-English explanation of each condition grade shown on the listing.
const GRADE_EXPLANATIONS = {
    New: 'Brand new and unused, in factory-sealed packaging.',
    Excellent: 'Minimal to no visible wear. Looks close to new under normal use.',
    Good: 'Light, normal signs of use with minor cosmetic marks. Fully functional.',
    Fair: 'Noticeable cosmetic wear such as light scratches or scuffs. Fully tested and functional.',
    Refurbished: 'Professionally restored and tested to full working condition.',
    Refubrished: 'Professionally restored and tested to full working condition.',
};

// What our certified-premium program includes on every device. These are
// program-wide standards; anything specific to a single unit is noted on its
// listing.
const CERTIFICATION_DETAILS = [
    { label: 'Certification', value: '40-point technician inspection covering hardware, battery health, and cosmetics before every device is listed.' },
    { label: 'Battery health', value: 'Battery performance is verified as part of our inspection. Batteries that fall below our certified threshold are replaced.' },
    { label: 'Unlocked', value: 'Sold unlocked and compatible with all major US carriers, unless the listing states otherwise.' },
    { label: 'Warranty', value: 'Backed by a 12-month UpCell IT Inc. limited warranty from the date of delivery or pickup.' },
    { label: "What's in the box", value: 'Ships in UpCell certified packaging with a compatible charging cable. Original retail box and extra accessories are not guaranteed unless stated on the listing.' },
];

const getStorageSortValue = (storageLabel = '') => {
    const match = storageLabel.trim().match(/^(\d+(?:\.\d+)?)\s*(TB|GB)$/i);
    if (!match) return Number.MAX_SAFE_INTEGER;

    const value = Number(match[1]);
    const unit = match[2].toUpperCase();
    return unit === 'TB' ? value * 1024 : value;
};

const ProductDetailPage = () => {
    const { parentId, productId } = useParams();
    const navigate = useNavigate();
    const { data: products = EMPTY_ARRAY } = useProductsQuery();
    const [product, setProduct] = useState();
    const [selectedColor, setSelectedColor] = useState();
    const [selectedStorage, setSelectedStorage] = useState();
    const [quantity, setQuantity] = useState(1);
    const [addonQtys, setAddonQtys] = useState({});
    const { setCart } = useContext(CartContext);

    const allProducts = useMemo(() => (
        products.filter((item) => item.parentCatagory === parentId || item.parentId === parentId)
    ), [products, parentId]);

    useEffect(() => {
        if (!allProducts.length) return;
        const selectedProduct = allProducts.find((item) => item._id === productId) || allProducts[0];
        setProduct(selectedProduct);
        setSelectedColor(selectedProduct?.color);
        setSelectedStorage(selectedProduct?.storage);
    }, [allProducts, productId]);

    const recommendedProducts = useMemo(() => (
        groupProductsByParent(products)
            .filter((item) => item.parentCatagory !== parentId && ['iPhone', 'iPad', 'MacBook'].includes(item.family))
            .slice(0, 4)
    ), [products, parentId]);

    const availableColors = useMemo(() => {
        const colors = new Map();
        allProducts.forEach((item) => {
            if (item.color?.name) colors.set(item.color.name, item.color);
        });
        return Array.from(colors.values());
    }, [allProducts]);

    const availableStorages = useMemo(() => (
        Array.from(new Set(allProducts.map((item) => item.storage).filter(Boolean)))
            .sort((left, right) => getStorageSortValue(left) - getStorageSortValue(right) || left.localeCompare(right, undefined, { numeric: true }))
    ), [allProducts]);

    const syncSelection = (nextColor, nextStorage) => {
        const matchedProduct = allProducts.find((item) => (
            item.color?.name === nextColor?.name && item.storage === nextStorage && !item.outOfStock
        ));
        if (matchedProduct) {
            setProduct(matchedProduct);
            navigate(`/iphone/${matchedProduct.parentCatagory}/${matchedProduct._id}`, { replace: true });
        }
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        syncSelection(color, selectedStorage);
    };

    const handleStorageSelect = (storage) => {
        setSelectedStorage(storage);
        syncSelection(selectedColor, storage);
    };

    const addonTotal = ESSENTIAL_ADDONS.reduce((sum, a) => sum + (addonQtys[a.id] || 0) * a.price, 0);
    const grandTotal = product ? product.price * quantity + addonTotal : 0;

    const handleAddToCart = () => {
        if (!product?._id || product.outOfStock) return;
        const itemsToAdd = Array.from({ length: quantity }, () => product._id);
        ESSENTIAL_ADDONS.forEach(addon => {
            const qty = addonQtys[addon.id] || 0;
            for (let i = 0; i < qty; i++) itemsToAdd.push(addon.id);
        });
        setCart((prev) => [...prev, ...itemsToAdd]);
        toast.success(addonTotal > 0 ? 'Product and accessories added' : 'Product added to cart');
    };

    const setAddonQty = (id, delta) => {
        setAddonQtys(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
    };

    if (!product) {
        return (
            <div>
                <h2>Product not found</h2>
                <p>This product variation is no longer available.</p>
                <Link to="/shop">Back to shop</Link>
            </div>
        );
    }

    // TODO(redesign): build the new product detail UI here. Variant selection,
    // add-ons, quantity and cart wiring above are all live.
    return (
        <div>
            <ScrollToTop />

            <nav>
                <Link to="/">Home</Link>
                <Link to="/shop">Shop</Link>
                <span>{product.productName}</span>
            </nav>

            <img src={product.image} alt={product.productName} />
            <h1>{product.productName}</h1>
            <p>${product.price}</p>
            {product.outOfStock && <p>Out of stock</p>}

            {/* Colour */}
            <fieldset>
                <legend>Colour</legend>
                {availableColors.map((color) => (
                    <button
                        key={color.name}
                        type="button"
                        aria-pressed={selectedColor?.name === color.name}
                        onClick={() => handleColorSelect(color)}
                    >
                        {color.name}
                    </button>
                ))}
            </fieldset>

            {/* Storage */}
            <fieldset>
                <legend>Storage</legend>
                {availableStorages.map((storage) => (
                    <button
                        key={storage}
                        type="button"
                        aria-pressed={selectedStorage === storage}
                        onClick={() => handleStorageSelect(storage)}
                    >
                        {storage}
                    </button>
                ))}
            </fieldset>

            {/* Condition grade */}
            {product.grade && (
                <p>
                    <strong>{product.grade}</strong> {GRADE_EXPLANATIONS[product.grade]}
                </p>
            )}

            {/* Quantity */}
            <div>
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>

            {/* Add-ons */}
            <div>
                <h2>Essential add-ons</h2>
                {ESSENTIAL_ADDONS.map((addon) => (
                    <div key={addon.id}>
                        <h3>{addon.name}</h3>
                        <p>{addon.description}</p>
                        <span>${addon.price}</span>
                        <button type="button" onClick={() => setAddonQty(addon.id, -1)}>-</button>
                        <span>{addonQtys[addon.id] || 0}</span>
                        <button type="button" onClick={() => setAddonQty(addon.id, 1)}>+</button>
                    </div>
                ))}
            </div>

            <p>Total: ${grandTotal.toFixed(2)}</p>
            <button type="button" onClick={handleAddToCart} disabled={product.outOfStock}>
                Add to cart
            </button>

            {/* Certification */}
            <dl>
                {CERTIFICATION_DETAILS.map((detail) => (
                    <React.Fragment key={detail.label}>
                        <dt>{detail.label}</dt>
                        <dd>{detail.value}</dd>
                    </React.Fragment>
                ))}
            </dl>

            {/* Feature cards */}
            <div>
                {featureCards.map((card) => (
                    <div key={card.title}>
                        <h3>{card.title}</h3>
                        <p>{card.body}</p>
                    </div>
                ))}
            </div>

            {/* Recommendations */}
            {/* TODO(redesign): ModernProductCard was deleted with the old design.
                Rebuild it under src/components/ and render it here. */}
            <section>
                <h2>You may also like</h2>
                <ul>
                    {recommendedProducts.map((item) => (
                        <li key={item._id}>
                            <Link to={`/iphone/${item.parentCatagory}/${item._id}`}>
                                {item.productName} &mdash; ${item.price}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default ProductDetailPage;
