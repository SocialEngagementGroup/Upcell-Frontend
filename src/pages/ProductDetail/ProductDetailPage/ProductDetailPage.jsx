import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import ScrollToTop from '../../../utilities/ScrollToTop';
import { CartContext } from '../../../App';
import { toast } from 'react-toastify';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import axiosInstance from '../../../utilities/axiosInstance';
import { groupProductsByParent, normalizeProduct } from '../../../utilities/catalog';

const specHighlights = [
    { main: 'Refined', sub: 'Condition grading' },
    { main: 'Battery', sub: 'Health checked' },
    { main: 'Secure', sub: 'Reset and inspected' },
    { main: 'Fast', sub: 'Insured delivery' },
];

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

const ProductDetailPage = () => {
    const { parentId, productId } = useParams();
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [product, setProduct] = useState();
    const [selectedColor, setSelectedColor] = useState();
    const [selectedStorage, setSelectedStorage] = useState();
    const [quantity, setQuantity] = useState(1);
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
                    .slice(0, 3);
                setRecommendedProducts(related);
            })
            .catch((error) => console.log(error));
    }, [parentId]);

    const syncSelection = (nextColor, nextStorage) => {
        const matchedProduct = allProducts.find((item) => (
            item.color?.name === nextColor?.name && item.storage === nextStorage
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

    const handleAddToCart = () => {
        if (!product?._id) return;
        setCart((prev) => [...prev, ...Array.from({ length: quantity }, () => product._id)]);
        toast.success('Product added to cart');
    };

    const handleBuyNow = () => {
        if (!product?._id) return;
        navigate(`/checkout/${product._id}`);
    };

    if (!product) {
        return (
            <div className="page-shell">
                <div className="page-container py-24">
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <h2>Product not found</h2>
                        <p className="mt-4 text-ink-soft">This product variation is no longer available.</p>
                        <Link to="/shop" className="premium-button mt-6">Back to store</Link>
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
                    <Link to="/shop">Store</Link>
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
                        <span className="eyebrow mb-5">Premium Apple Selection</span>
                        <h1 className="text-[clamp(2.4rem,4vw,4.3rem)] leading-[0.95]">{product.productName}</h1>
                        <div className="mt-5 text-4xl font-extrabold text-apple-text">${product.price}</div>
                        <p className="mt-3 max-w-[560px] text-base leading-8 text-ink-soft">
                            Thoughtfully sourced Apple hardware with verified cosmetic grading, battery inspection, and a simpler purchase flow.
                        </p>

                        <div className="mt-8 rounded-[28px] border border-black/[0.06] bg-surface-alt/70 p-5">
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Finish</div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                {availableColors.map((color) => (
                                    <button
                                        key={color.name}
                                        className={`flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-bold ${
                                            selectedColor?.name === color.name
                                                ? 'border-apple-text bg-white text-apple-text'
                                                : 'border-black/[0.08] bg-white/70 text-apple-gray'
                                        }`}
                                        onClick={() => handleColorSelect(color)}
                                    >
                                        <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.value }} />
                                        {color.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 rounded-[28px] border border-black/[0.06] bg-surface-alt/70 p-5">
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-apple-gray">Storage</div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {availableStorages.map((storage) => (
                                    <button
                                        key={storage}
                                        className={selectedStorage === storage
                                            ? 'rounded-[20px] bg-apple-text px-5 py-4 text-sm font-bold text-white'
                                            : 'rounded-[20px] border border-black/[0.08] bg-white px-5 py-4 text-sm font-bold text-apple-text'}
                                        onClick={() => handleStorageSelect(storage)}
                                    >
                                        {storage}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4">
                            <div className="flex items-center rounded-full border border-black/[0.08] bg-white px-3 py-2">
                                <button className="h-10 w-10 rounded-full text-xl text-apple-gray hover:bg-surface-alt" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                                <span className="min-w-[40px] text-center text-sm font-bold text-apple-text">{quantity}</span>
                                <button className="h-10 w-10 rounded-full text-xl text-apple-gray hover:bg-surface-alt" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                            </div>
                            <button className="premium-button flex-1" onClick={handleAddToCart}>Add to cart</button>
                            <button className="premium-button-secondary flex-1" onClick={handleBuyNow}>Buy now</button>
                        </div>

                        <div className="mt-8 grid gap-4">
                            <div className="flex items-start gap-4 rounded-[24px] border border-black/[0.06] bg-white/80 p-5">
                                <LocalShippingOutlinedIcon className="!text-[22px] text-apple-text" />
                                <div>
                                    <div className="font-bold text-apple-text">Free insured delivery</div>
                                    <p className="mt-1 text-sm leading-7 text-ink-soft">Fast dispatch, protected transit, and clear delivery updates.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 rounded-[24px] border border-black/[0.06] bg-white/80 p-5">
                                <VerifiedUserOutlinedIcon className="!text-[22px] text-apple-text" />
                                <div>
                                    <div className="font-bold text-apple-text">1-year UpCell warranty</div>
                                    <p className="mt-1 text-sm leading-7 text-ink-soft">Support, verification, and practical coverage built in.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {specHighlights.map((item) => (
                                <div key={item.sub} className="rounded-[24px] bg-surface-alt px-4 py-5 text-center">
                                    <div className="text-lg font-extrabold text-apple-text">{item.main}</div>
                                    <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">{item.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-container pb-10">
                <div className="rounded-[40px] bg-[linear-gradient(135deg,#0f1012_0%,#1b1d22_55%,#2c3138_100%)] px-8 py-10 text-white shadow-medium md:px-12 md:py-14">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-white/60">Why it feels premium</span>
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        {featureCards.map((card) => (
                            <div key={card.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <h3 className="text-2xl text-white">{card.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-white/72">{card.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-container pb-16">
                <div className="mb-8">
                    <span className="eyebrow mb-4">You might also like</span>
                    <h2>Continue the collection.</h2>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    {recommendedProducts.map((item) => (
                        <Link
                            key={item._id}
                            to={`/iphone/${item.parentCatagory}/${item._id}`}
                            className="premium-card overflow-hidden rounded-[32px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-medium"
                        >
                            <div className="flex h-[260px] items-center justify-center rounded-[26px] bg-[linear-gradient(180deg,#f8f8fa_0%,#edf0f5_100%)]">
                                <img src={item.image} alt={item.productName} className="h-[78%] w-auto object-contain" />
                            </div>
                            <h3 className="mt-6 text-[28px]">{item.productName}</h3>
                            <p className="mt-2 text-sm leading-7 text-ink-soft">{item.color?.name || 'Apple finish'} • {item.storage}</p>
                            <div className="mt-5 text-xl font-extrabold text-apple-text">${item.price}</div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductDetailPage;
