import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import ScrollToTop from '../../../utilities/ScrollToTop';
import { CartContext } from '../../../App';
import { toast } from 'react-toastify';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FavoriteIcon from '@mui/icons-material/Favorite';

import axiosInstance from '../../../utilities/axiosInstance';
import ModernProductCard from '../../../components/ModernProductCard/ModernProductCard';
import { groupProductsByParent, normalizeProduct } from '../../../utilities/catalog';



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
        body: 'Every order is backed by UpCell support and practical coverage designed for peace of mind.',
    },
];
const ESSENTIAL_ADDONS = [
    { id: 'addon_case', name: 'Clear Case (MagSafe)', price: 39, description: 'Crystal clear, yellowing-resistant protection.' },
    { id: 'addon_protector', name: 'Ultra-Glass Protector', price: 19, description: 'Edge-to-edge scratch and impact defense.' },
];

const ProductDetailPage = () => {
    const { parentId, productId } = useParams();
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [product, setProduct] = useState();
    const [selectedColor, setSelectedColor] = useState();
    const [selectedStorage, setSelectedStorage] = useState();
    const [quantity, setQuantity] = useState(1);
    const [addonQtys, setAddonQtys] = useState({});
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const { setCart } = useContext(CartContext);

    useEffect(() => {
        axiosInstance.get(`allSameParentProducts/${parentId}`)
            .then((res) => {
                const matchedProducts = res.data.map(normalizeProduct);
                if (!matchedProducts.length) return;

                setAllProducts(matchedProducts);
                const selectedProduct = matchedProducts.find((item) => item._id === productId) || matchedProducts[0];
                setProduct(selectedProduct);
                setSelectedColor(selectedProduct?.color);
                setSelectedStorage(selectedProduct?.storage);
            })
            .catch((error) => console.log(error));
    }, [parentId, productId]);

    const availableColors = useMemo(() => {
        const colors = new Map();
        allProducts.forEach((item) => {
            if (item.color?.name) colors.set(item.color.name, item.color);
        });
        return Array.from(colors.values());
    }, [allProducts]);

    const availableStorages = useMemo(() => (
        Array.from(new Set(allProducts.map((item) => item.storage).filter(Boolean)))
    ), [allProducts]);

    useEffect(() => {
        axiosInstance.get('product')
            .then((res) => {
                const related = groupProductsByParent(res.data.map(normalizeProduct))
                    .filter((item) => item.parentCatagory !== parentId && ['iPhone', 'iPad', 'MacBook'].includes(item.family))
                    .slice(0, 4);
                setRecommendedProducts(related);
            })
            .catch((error) => console.log(error));
    }, [parentId]);

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
            <div className="page-shell">
                <div className="page-container py-24">
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <h2>Product not found</h2>
                        <p className="mt-4 text-ink-soft">This product variation is no longer available.</p>
                        <Link to="/shop" className="premium-button mt-6">Back to shop</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-6">
                <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                    <Link to="/">Home</Link>
                    <KeyboardArrowRightIcon className="!text-sm" />
                    <Link to="/shop">Shop</Link>
                    <KeyboardArrowRightIcon className="!text-sm" />
                    <span>{product.productName}</span>
                </nav>

                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="premium-card rounded-[40px] p-6 md:p-8">
                        <div className="flex gap-4">
                            <div className="hidden w-[92px] flex-col gap-3 md:flex">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex h-[92px] items-center justify-center rounded-[24px] border border-black/[0.06] bg-[linear-gradient(180deg,#f8f8fa_0%,#eef1f5_100%)]">
                                        <img src={product.image} alt={product.productName} className="h-[72%] w-auto object-contain" />
                                    </div>
                                ))}
                            </div>

                            <div className="relative flex min-h-[560px] flex-1 items-center justify-center overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,#fbfbfd_0%,#edf0f5_100%)] px-6 py-10">
                                <div className="absolute inset-x-[18%] top-[12%] h-[70%] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.92),_rgba(220,225,232,0.35)_55%,_transparent_72%)] blur-2xl" />
                                <img
                                    src={product.image}
                                    alt={product.productName}
                                    className="relative z-[2] max-h-[460px] w-auto object-contain drop-shadow-[0_35px_80px_rgba(15,23,42,0.18)]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="premium-card rounded-[40px] p-8 md:p-10">
                    <div className="md:mt-0">
                        <h1 className="text-[clamp(2.4rem,4vw,4.3rem)] leading-[0.95]">{product.productName}</h1>
                        <div className="mt-3 text-4xl font-extrabold text-apple-text">${product.price}</div>

                        {/* ─── Color Selection ─── */}
                        <div className="mt-10">
                            <div className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-apple-text">
                                Color: <span className="font-black">{selectedColor?.name || 'Default'}</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-4">
                                {availableColors.map((color) => (
                                    <button
                                        key={color.name}
                                        className={`group relative flex h-14 w-14 items-center justify-center transition-all duration-200`}
                                        onClick={() => handleColorSelect(color)}
                                    >
                                        {/* Selection Ring */}
                                        <div className={`absolute -inset-1 rounded-[18px] border-2 transition-opacity duration-200 ${
                                            selectedColor?.name === color.name ? 'border-[#eb0000] opacity-100' : 'border-transparent opacity-0 group-hover:opacity-30 group-hover:border-black/20'
                                        }`} />
                                        
                                        {/* The Swatch */}
                                        <div 
                                            className="h-11 w-11 rounded-[12px] shadow-sm ring-1 ring-inset ring-black/5" 
                                            style={{ backgroundColor: color.value }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ─── Storage Selection ─── */}
                        <div className="mt-10">
                            <div className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-apple-text">Storage</div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                {availableStorages.map((storage) => {
                                    // Find product for this storage in current color to get the price
                                    const variantForStorage = allProducts.find(
                                        (p) => p.color?.name === selectedColor?.name && p.storage === storage
                                    );
                                    const variantPrice = variantForStorage?.price;
                                    const isAvailable = !!variantForStorage && !variantForStorage.outOfStock;

                                    return (
                                        <button
                                            key={storage}
                                            disabled={!isAvailable}
                                            className={`flex h-20 min-w-[110px] flex-1 basis-[120px] flex-col items-center justify-center rounded-none border-2 px-6 py-4 transition-all duration-200 ${
                                                selectedStorage === storage
                                                    ? 'border-black bg-white text-black'
                                                    : isAvailable
                                                        ? 'border-transparent bg-white/50 text-apple-gray hover:border-black/10'
                                                        : 'cursor-not-allowed border-transparent bg-apple-text/[0.03] text-apple-text/20 opacity-40'
                                            }`}
                                            onClick={() => handleStorageSelect(storage)}
                                        >
                                            <div className="text-base font-black">{storage}</div>
                                            {variantPrice && (
                                                <div className={`mt-1 text-[11px] font-bold ${selectedStorage === storage ? 'text-apple-text/60' : 'text-apple-gray'}`}>
                                                    ${variantPrice}
                                                </div>
                                            )}
                                            {!isAvailable && (
                                                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider">Out of stock</div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ─── Quantity & Protection ─── */}
                        <div className="mt-10 rounded-[24px] border border-black/[0.06] bg-white/60 p-5">
                            <div className="flex items-center justify-between">
                                <div className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-apple-text">Quantity</div>
                                <div className="flex h-11 items-center gap-1 rounded-full border border-black/[0.08] bg-white px-2">
                                    <button className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-apple-gray transition-colors hover:text-black" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>−</button>
                                    <span className="min-w-[28px] text-center text-sm font-bold text-apple-text">{quantity}</span>
                                    <button className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-apple-gray transition-colors hover:text-black" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                                </div>
                            </div>

                            <div className="my-4 border-t border-black/[0.06]" />

                            <div className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-apple-text">Add protection</div>
                            <div className="mt-3 space-y-2">
                                {ESSENTIAL_ADDONS.map((addon) => {
                                    const qty = addonQtys[addon.id] || 0;
                                    return (
                                        <div key={addon.id} className={`flex items-center justify-between rounded-[16px] px-4 py-3 transition-all duration-200 ${qty > 0 ? 'bg-black/[0.04]' : 'bg-transparent hover:bg-black/[0.02]'}`}>
                                            <div className="mr-4 flex-1">
                                                <div className="text-[14px] font-bold text-apple-text">{addon.name} <span className="font-extrabold text-apple-gray">· ${addon.price}</span></div>
                                                <div className="text-[11px] font-medium text-apple-gray">{addon.description}</div>
                                            </div>
                                            <div className="flex h-9 items-center gap-1 rounded-full border border-black/[0.08] bg-white px-1.5">
                                                <button className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-apple-gray transition-colors hover:text-black" onClick={() => setAddonQty(addon.id, -1)}>−</button>
                                                <span className="min-w-[20px] text-center text-xs font-bold text-apple-text">{qty}</span>
                                                <button className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-apple-gray transition-colors hover:text-black" onClick={() => setAddonQty(addon.id, 1)}>+</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            className="premium-button mt-5 h-[56px] w-full text-base shadow-[0_16px_32px_rgba(0,0,0,0.10)] active:scale-[0.98]"
                            onClick={handleAddToCart}
                            disabled={product.outOfStock}
                        >
                            {product.outOfStock ? 'Out of stock' : `Add to cart — $${grandTotal}`}
                        </button>

                        </div>
                    </div>
                </div>
            </section>

            <section className="page-container pb-10">
                <div className="rounded-[40px] bg-[linear-gradient(135deg,#0f1012_0%,#1b1d22_55%,#2c3138_100%)] px-8 py-10 text-white shadow-medium md:px-12 md:py-14">
                    <div className="mt-2 grid gap-6 lg:grid-cols-3">
                        {featureCards.map((card) => (
                            <div key={card.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <h3 className="text-2xl text-white">{card.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-white/72">{card.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-container pb-16 pt-20">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-[clamp(2rem,3vw,3.2rem)]">Continue the collection.</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {recommendedProducts.map((item) => (
                        <ModernProductCard key={item._id} product={item} />
                    ))}
                </div>
                <div className="mt-14 flex justify-center">
                    <Link to="/shop" className="premium-button h-14 min-w-[220px] shadow-sm">
                        View more
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ProductDetailPage;
