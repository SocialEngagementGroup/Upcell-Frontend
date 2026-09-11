import React, { useContext, useEffect, useMemo, useState } from 'react';
import Seo, { productJsonLd } from '../../../components/Seo/Seo';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import ScrollToTop from '../../../utilities/ScrollToTop';
import { CartContext } from '../../../App';
import { toast } from 'sonner';
import { TOAST_ICONS } from '../../../utilities/toastIcons';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useProductBySlugQuery, useRecommendedProductsQuery, useAccessoriesQuery } from '../../../queries/products';
import { EMPTY_ARRAY } from '../../../queries/keys';
import { pickVariant } from '../../../utilities/catalog';
import { resolveProductImage } from '../../../utilities/productImages';
import { gradeFor, carrierLabelFor, batteryLabelFor } from '../../../constants/deviceGrades';
import { resolveImageRef } from '../../../utilities/cloudinary';
import ModernProductCard from '../../../components/ModernProductCard/ModernProductCard';
import RouteLoadingScreen from '../../../components/RouteLoadingScreen/RouteLoadingScreen';



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
    const { slug } = useParams();
    const navigate = useNavigate();

    // One request for the variant, its family and its parent — the page cannot
    // draw anything without all three.
    //
    // isLoading is true only on the very first load. Switching variants keeps
    // the previous product on screen (see placeholderData in the hook), so the
    // skeleton below never reappears mid-browse.
    const { data, isLoading, isError, error, isPlaceholderData } = useProductBySlugQuery(slug);
    const notFound = error?.response?.status === 404;

    const product = notFound ? undefined : data?.product;

    // The three facts a used-phone buyer checks first. All were in the data
    // and none was on the page: the grade was shown from the old free-text
    // field, and the battery and carrier were not shown at all.
    const grade = gradeFor(product);
    const battery = batteryLabelFor(product);
    const carrier = carrierLabelFor(product);

    // The one page where structured data earns its place. itemCondition is
    // the point: Google shows a "Used" badge on a result that declares
    // UsedCondition, and a listing that does not say so competes against new
    // stock on price alone and loses.
    const canonicalPath = product?.slug ? `/product/${product.slug}` : undefined;
    const socialImage = product ? resolveProductImage(product, { width: 1200 }) : undefined;
    const allProducts = data?.family || EMPTY_ARRAY;
    const { data: recommendedPool = EMPTY_ARRAY } = useRecommendedProductsQuery(product?.parentCatagory);

    const [quantity, setQuantity] = useState(1);
    const [addonQtys, setAddonQtys] = useState({});
    const { setCart } = useContext(CartContext);

    // Derived from the URL, not copied into state by an effect.
    //
    // The old version resolved the product with `find(...) || allProducts[0]`,
    // so a URL that named a product which did not exist quietly showed a
    // different phone — same page, same buy button, wrong device. The server
    // now answers 404 for an unknown slug and this renders that.
    //
    // The colour and storage pickers read straight off the product for the same
    // reason: three pieces of state kept in step by an effect could disagree
    // with each other for a render, and did.
    const selectedColor = product?.color;
    const selectedStorage = product?.storage;

    // The photos this product page can show.
    //
    // The variant's own photo comes first, because that is the one chosen to
    // represent this exact storage and colour. The rest of the product's
    // uploaded photos follow, minus that one so it is not listed twice.
    //
    // Before this the page rendered three copies of a single image: the
    // thumbnails were a literal [1, 2, 3].map. Every extra photo an admin
    // uploaded was stored in Cloudinary and never displayed anywhere.
    const galleryImages = useMemo(() => {
        if (!product) return EMPTY_ARRAY;

        const refs = [
            { publicId: product.imagePublicId, url: product.image },
            ...(data?.parent?.images || []).filter((image) => (
                (image?.publicId || image?.url) !== (product.imagePublicId || product.image)
            )),
        ];

        return refs
            .map((ref) => ({
                key: ref?.publicId || ref?.url,
                full: resolveImageRef(ref, { width: 1000 }),
                thumbnail: resolveImageRef(ref, { width: 200 }),
            }))
            .filter((image) => image.key && image.full);
    }, [data?.parent?.images, product]);

    // Reset to the variant's own photo whenever the variant changes — holding
    // an index across a colour switch would leave the page showing the previous
    // variant's third photo.
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    useEffect(() => { setActiveImageIndex(0); }, [product?.slug]);

    const activeImage = galleryImages[activeImageIndex]?.full
        || galleryImages[0]?.full
        // A product whose photos predate the gallery has none of the above.
        || resolveProductImage(product, { width: 1000 });

    // The server has already grouped these and excluded the current parent —
    // all that is left is dropping families this section does not show and
    // taking the first four.
    const recommendedProducts = useMemo(() => (
        recommendedPool
            .filter((item) => ['iPhone', 'iPad', 'MacBook'].includes(item.family))
            .slice(0, 4)
    ), [recommendedPool]);

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

    // Switching colour or storage is a navigation, not a state change. The URL
    // is the single source of truth for which variant is shown, so the address
    // bar always matches the page and the link can be shared or bookmarked.
    // replace: true keeps Back going to the previous page rather than walking
    // through every swatch the customer tried.
    const goToVariant = (variant) => {
        if (variant?.slug) navigate(`/product/${variant.slug}`, { replace: true });
    };

    const handleColorSelect = (color) => goToVariant(pickVariant(allProducts, {
        colorName: color?.name, storage: selectedStorage, anchor: 'color',
    }));

    const handleStorageSelect = (storage) => goToVariant(pickVariant(allProducts, {
        colorName: selectedColor?.name, storage, anchor: 'storage',
    }));

    // Accessories come from the catalogue, so their ids are real product ids.
    //
    // They used to be a hard-coded list with invented ids like "addon_case".
    // The cart keeps only real database ids, so those were silently dropped:
    // the customer saw "Product and accessories added", was charged for the
    // phone alone, and never received the accessories.
    // Through React Query rather than its own effect, so the same two
    // accessories are fetched once and reused as the customer moves between
    // product pages instead of being refetched on every one.
    //
    // Defaulting to an empty array on failure is deliberate: the device is
    // still purchasable without add-ons, so a failed accessories call must not
    // take the buy button down with it.
    const { data: addons = EMPTY_ARRAY } = useAccessoriesQuery();

    const addonTotal = addons.reduce((sum, a) => sum + (addonQtys[a._id] || 0) * a.price, 0);
    const grandTotal = product ? product.price * quantity + addonTotal : 0;

    const handleAddToCart = () => {
        if (!product?._id || product.outOfStock) return;
        const itemsToAdd = Array.from({ length: quantity }, () => product._id);
        addons.forEach((addon) => {
            const qty = addonQtys[addon._id] || 0;
            for (let i = 0; i < qty; i++) itemsToAdd.push(addon._id);
        });
        setCart((prev) => [...prev, ...itemsToAdd]);
        toast.success(addonTotal > 0 ? 'Product and accessories added' : 'Product added to cart', { icon: TOAST_ICONS.cart });
        setAddonQtys({});
    };

    const setAddonQty = (id, delta) => {
        setAddonQtys(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
    };



    // Was never actually checked before — this page just happened to always
    // have the catalog already cached, back when the shop page fetched from
    // this exact same endpoint. Now that the shop page has its own lighter
    // data source, a direct link or a slow connection can land here before
    // the catalog has loaded, and "no product yet" must not be read as
    // "product doesn't exist" while the real answer is still in flight.
    if (isLoading) {
        return (
            <div className="page-shell">
            {product ? (
                <Seo
                    title={product.productName}
                    description={[
                        product.productName,
                        grade ? `in ${grade.label} condition` : null,
                        product.storage,
                        battery ? `battery ${battery}` : null,
                    ].filter(Boolean).join(', ') + '. Tested, graded and covered by a 30-day free return.'}
                    path={canonicalPath}
                    image={socialImage}
                    jsonLd={productJsonLd({
                        product,
                        url: canonicalPath ? `https://www.upcellit.com${canonicalPath}` : undefined,
                        image: socialImage,
                    })}
                />
            ) : null}
                <RouteLoadingScreen />
            </div>
        );
    }

    // Three outcomes, three messages. They used to be one: any failure showed
    // "no longer available", which tells someone whose connection dropped that
    // the product is gone, and tells someone with a mistyped URL to keep
    // waiting.
    if (notFound || !product) {
        return (
            <div className="page-shell">
                <div className="page-container py-24">
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <h2>Product not found</h2>
                        <p className="mt-4 text-ink-soft">
                            We couldn&apos;t find that product. It may have sold out and been removed.
                        </p>
                        <Link to="/shop" className="premium-button mt-6">Browse the shop</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="page-shell">
                <div className="page-container py-24">
                    <div className="premium-card rounded-[36px] px-8 py-16 text-center">
                        <h2>Something went wrong</h2>
                        <p className="mt-4 text-ink-soft">
                            We couldn&apos;t load this product just now. Please try again.
                        </p>
                        <button type="button" onClick={() => window.location.reload()} className="premium-button mt-6">
                            Try again
                        </button>
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
                    <div className="premium-card rounded-[28px] p-4 sm:rounded-[40px] sm:p-6 md:p-8">
                        <div className="flex gap-4">
                            {galleryImages.length > 1 && (
                                <div className="hidden w-[92px] flex-col gap-3 md:flex">
                                    {galleryImages.map((image, index) => (
                                        <button
                                            key={image.key}
                                            type="button"
                                            onClick={() => setActiveImageIndex(index)}
                                            aria-label={`Photo ${index + 1} of ${product.productName}`}
                                            aria-current={index === activeImageIndex}
                                            className={`flex h-[92px] items-center justify-center rounded-[24px] border bg-[linear-gradient(180deg,#f8f8fa_0%,#eef1f5_100%)] transition-all ${
                                                index === activeImageIndex
                                                    ? 'border-[#eb0000] shadow-[0_0_0_2px_rgba(235,0,0,0.12)]'
                                                    : 'border-black/[0.06] hover:border-black/20'
                                            }`}
                                        >
                                            <img src={image.thumbnail} alt="" className="h-[72%] w-auto object-contain" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative flex min-h-[340px] flex-1 items-center justify-center overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#fbfbfd_0%,#edf0f5_100%)] px-4 py-8 sm:min-h-[460px] sm:rounded-[34px] sm:px-6 sm:py-10 lg:min-h-[560px]">
                                <div className="absolute inset-x-[18%] top-[12%] h-[70%] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.92),_rgba(220,225,232,0.35)_55%,_transparent_72%)] blur-2xl" />
                                <img
                                    src={activeImage}
                                    alt={product.productName}
                                    className="relative z-[2] max-h-[280px] w-auto object-contain drop-shadow-[0_35px_80px_rgba(15,23,42,0.18)] sm:max-h-[460px]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="premium-card rounded-[28px] p-6 sm:rounded-[40px] sm:p-8 md:p-10">
                    <div className="md:mt-0">
                        <h1 className="text-[clamp(2rem,4vw,4.3rem)] leading-[1] sm:leading-[0.95]">{product.productName}</h1>
                        <div className="mt-3 text-3xl font-extrabold text-apple-text sm:text-4xl">${product.price} <span className="text-lg font-semibold text-ink-soft">USD</span></div>
                        {/* The grade, the battery and the carrier lock: the three
                            things a used-phone buyer checks before anything else.
                            They were all in the data and none of them was shown. */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            {grade ? (
                                <span
                                    title={grade.explanation}
                                    className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-surface-alt px-4 py-1.5 text-[13px] font-bold text-apple-text"
                                >
                                    Condition: {grade.label}
                                </span>
                            ) : null}

                            {battery ? (
                                <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-surface-alt px-4 py-1.5 text-[13px] font-bold text-apple-text">
                                    Battery {battery}
                                </span>
                            ) : null}

                            {carrier ? (
                                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-bold ${
                                    product.carrierStatus === 'UNLOCKED'
                                        ? 'border border-black/[0.08] bg-surface-alt text-apple-text'
                                        // A lock is a restriction and reads as one. Burying
                                        // it in the same grey as everything else is how a
                                        // customer finds out after it arrives.
                                        : 'border border-brand-red/20 bg-brand-red/[0.06] text-brand-red'
                                }`}>
                                    {carrier}
                                </span>
                            ) : null}
                        </div>

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
                                    const variantForStorage = allProducts.find(
                                        (p) => p.color?.name === selectedColor?.name && p.storage === storage
                                    );
                                    // Every storage listed here exists somewhere in the family —
                                    // the list is derived from the family itself. So a size is
                                    // only genuinely unavailable when every colour of it is out
                                    // of stock. It used to be marked "Out of stock" whenever the
                                    // *selected colour* lacked it, which told a customer a size
                                    // was sold out when it was simply a different colour.
                                    const allOfThisStorage = allProducts.filter((p) => p.storage === storage);
                                    const isAvailable = allOfThisStorage.some((p) => !p.outOfStock);
                                    // Shown in another colour: clicking switches to it, so name
                                    // the colour rather than letting the swatch change unexplained.
                                    const otherColorVariant = !variantForStorage
                                        ? (allOfThisStorage.find((p) => !p.outOfStock) || allOfThisStorage[0])
                                        : null;
                                    const switchesToColor = otherColorVariant?.color?.name;
                                    const switchesToColorValue = otherColorVariant?.color?.value;
                                    const variantPrice = variantForStorage?.price
                                        ?? (allOfThisStorage.find((p) => !p.outOfStock) || allOfThisStorage[0])?.price;

                                    return (
                                        <button
                                            key={storage}
                                            disabled={!isAvailable}
                                            className={`relative flex h-20 min-w-[110px] flex-1 basis-[120px] flex-col items-center justify-center rounded-[18px] border px-6 py-4 transition-all duration-200 ${
                                                selectedStorage === storage
                                                    ? 'border-[#eb0000] bg-white text-black shadow-[0_0_0_3px_rgba(235,0,0,0.08)]'
                                                    : isAvailable
                                                        ? 'border-black/[0.06] bg-white/50 text-apple-gray hover:border-black/10'
                                                        : 'cursor-not-allowed border-black/[0.04] bg-apple-text/[0.03] text-apple-text/20 opacity-40'
                                            }`}
                                            onClick={() => handleStorageSelect(storage)}
                                        >
                                            {selectedStorage === storage && (
                                                <div className="pointer-events-none absolute -inset-1 rounded-[22px] border-2 border-[#eb0000]" />
                                            )}
                                            <div className="text-base font-black">{storage}</div>
                                            {variantPrice && (
                                                <div className={`mt-1 text-[11px] font-bold ${selectedStorage === storage ? 'text-apple-text/60' : 'text-apple-gray'}`}>
                                                    ${variantPrice}
                                                </div>
                                            )}
                                            {!isAvailable && (
                                                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider">Out of stock</div>
                                            )}
                                            {isAvailable && switchesToColor && (
                                                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-apple-text/70">
                                                    <span
                                                        className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/20"
                                                        style={{ backgroundColor: switchesToColorValue }}
                                                    />
                                                    {switchesToColor}
                                                </div>
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

                            {/* Hidden entirely when there is nothing to offer, so a
                                failed fetch or an empty accessory list does not leave
                                an "Add protection" heading with nothing under it. */}
                            {addons.length ? (
                            <>
                            <div className="my-4 border-t border-black/[0.06]" />

                            <div className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-apple-text">Add protection</div>
                            <div className="mt-3 space-y-2">
                                {addons.map((addon) => {
                                    const qty = addonQtys[addon._id] || 0;
                                    return (
                                        <div key={addon._id} className={`flex items-center justify-between rounded-[16px] px-4 py-3 transition-all duration-200 ${qty > 0 ? 'bg-black/[0.04]' : 'bg-transparent hover:bg-black/[0.02]'}`}>
                                            <div className="mr-4 flex-1">
                                                <div className="text-[14px] font-bold text-apple-text">{addon.productName} <span className="font-extrabold text-apple-gray">· ${addon.price}</span></div>
                                                <div className="text-[11px] font-medium text-apple-gray">{addon.description}</div>
                                            </div>
                                            <div className="flex h-9 items-center gap-1 rounded-full border border-black/[0.08] bg-white px-1.5">
                                                <button className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-apple-gray transition-colors hover:text-black" onClick={() => setAddonQty(addon._id, -1)}>−</button>
                                                <span className="min-w-[20px] text-center text-xs font-bold text-apple-text">{qty}</span>
                                                <button className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-apple-gray transition-colors hover:text-black" onClick={() => setAddonQty(addon._id, 1)}>+</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            </>
                            ) : null}
                        </div>

                        <button
                            className="premium-button mt-5 h-[56px] w-full text-base shadow-[0_16px_32px_rgba(0,0,0,0.10)] active:scale-[0.98]"
                            onClick={handleAddToCart}
                            disabled={product.outOfStock}
                        >
                            {product.outOfStock ? 'Out of stock' : `Add to cart · $${grandTotal}`}
                        </button>

                        </div>
                    </div>
                </div>
            </section>

            <section className="page-container pb-10">
                <div className="premium-card rounded-[28px] p-6 sm:rounded-[40px] sm:p-8 md:p-10">
                    <h2 className="text-[clamp(1.7rem,3vw,2.6rem)]">Product details</h2>

                    {product.description && (
                        <p className="mt-4 max-w-[760px] text-base leading-7 text-ink-soft">{product.description}</p>
                    )}

                    <div className="mt-8 grid gap-8 lg:grid-cols-2">
                        <div>
                            <h3 className="text-xl font-bold text-apple-text">Specifications</h3>
                            <dl className="mt-4 divide-y divide-black/[0.06] border-t border-black/[0.06]">
                                <div className="flex justify-between gap-4 py-3">
                                    <dt className="text-sm font-semibold text-apple-gray">Model</dt>
                                    <dd className="text-sm font-bold text-apple-text text-right">{product.productName}</dd>
                                </div>
                                {product.storage && (
                                    <div className="flex justify-between gap-4 py-3">
                                        <dt className="text-sm font-semibold text-apple-gray">Storage</dt>
                                        <dd className="text-sm font-bold text-apple-text text-right">{product.storage}</dd>
                                    </div>
                                )}
                                {product.color?.name && (
                                    <div className="flex justify-between gap-4 py-3">
                                        <dt className="text-sm font-semibold text-apple-gray">Finish</dt>
                                        <dd className="text-sm font-bold text-apple-text text-right">{product.color.name}</dd>
                                    </div>
                                )}
                                {grade && (
                                    <div className="flex justify-between gap-4 py-3">
                                        <dt className="text-sm font-semibold text-apple-gray">Condition grade</dt>
                                        <dd className="text-sm font-bold text-apple-text text-right">
                                            {grade.label}
                                            {grade.explanation && (
                                                <span className="mt-1 block text-xs font-normal text-ink-soft">{grade.explanation}</span>
                                            )}
                                        </dd>
                                    </div>
                                )}
                                {battery && (
                                    <div className="flex justify-between gap-4 py-3">
                                        <dt className="text-sm font-semibold text-apple-gray">Battery health</dt>
                                        <dd className="text-sm font-bold text-apple-text text-right">
                                            {battery}
                                            {/* Said plainly, because a number with no floor
                                                beside it invites the question. */}
                                            <span className="mt-1 block text-xs font-normal text-ink-soft">
                                                We do not list a device below 80%.
                                            </span>
                                        </dd>
                                    </div>
                                )}
                                {carrier && (
                                    <div className="flex justify-between gap-4 py-3">
                                        <dt className="text-sm font-semibold text-apple-gray">Carrier</dt>
                                        <dd className="text-sm font-bold text-apple-text text-right">{carrier}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-apple-text">Certified &amp; included</h3>
                            <dl className="mt-4 divide-y divide-black/[0.06] border-t border-black/[0.06]">
                                {CERTIFICATION_DETAILS.map((detail) => (
                                    <div key={detail.label} className="py-3">
                                        <dt className="text-sm font-bold text-apple-text">{detail.label}</dt>
                                        <dd className="mt-1 text-sm leading-6 text-ink-soft">{detail.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-container pb-10">
                <div className="rounded-[28px] bg-[linear-gradient(135deg,#0f1012_0%,#1b1d22_55%,#2c3138_100%)] px-6 py-8 text-white shadow-medium sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <div className="grid gap-6 sm:mt-2 md:grid-cols-3">
                        {featureCards.map((card) => (
                            <div key={card.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <h3 className="text-2xl text-white">{card.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-white/72">{card.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-container pb-16 pt-12 md:pt-20">
                <div className="mb-8 text-center md:mb-10 md:text-left">
                    <h2 className="text-[clamp(2rem,3vw,3.2rem)]">Continue the collection.</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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




