import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import ScrollToTop from '../../../utilities/ScrollToTop';
import { CartContext } from '../../../App';
import { toast } from 'react-toastify';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

import allDummyProducts, { getProductsByParentId } from '../../../utilities/dummyData';

const ProductDetailPage = () => {
    const { parentId, productId } = useParams()
    const navigate = useNavigate()
    const [allProducts, setAllProducts] = useState([])
    const [product, setProduct] = useState()
    const [selectedColor, setSelectedColor] = useState()
    const [selectedStorage, setSelectedStorage] = useState()
    const [availableColors, setAvailableColors] = useState([])
    const [availableStorages, setAvailableStorages] = useState([])
    const { cart, setCart } = useContext(CartContext)

    const processProductData = (products) => {
        setAllProducts(products)
        const selectedProduct = products.find((p) => p._id === productId) || products[0]
        setProduct(selectedProduct)
        setSelectedColor(selectedProduct?.color)
        setSelectedStorage(selectedProduct?.storage)
        const colors = new Set()
        const storages = new Set()
        products.forEach(p => {
            if (p.color) colors.add(p.color.name + ":" + p.color.value)
            if (p.storage) storages.add(p.storage)
        })
        setAvailableColors(Array.from(colors).map(str => {
            const [name, value] = str.split(":")
            return { name, value }
        }))
        setAvailableStorages(Array.from(storages))
    }

    useEffect(() => {
        const fallbackData = getProductsByParentId(parentId)
        if (fallbackData.length > 0) processProductData(fallbackData)
    }, [productId, parentId])

    const handleFilterButtonClick = (option, value) => {
        let color = selectedColor
        let storage = selectedStorage
        if (option === "color") { setSelectedColor(value); color = value; }
        else if (option === "storage") { setSelectedStorage(value); storage = value; }
        const newProduct = allProducts.find(p => p.color.name === color.name && p.storage === storage)
        if (newProduct) setProduct(newProduct)
    }

    const handleAddToCart = () => {
        if (product?._id) {
            setCart(prev => [...prev, product._id])
            toast.success("Product Added to cart")
        }
    }

    const handleBuyNow = () => {
        if (product?._id) navigate(`/checkout/${product._id}`)
    }

    return (
        <div className="bg-white text-apple-text pt-10 font-sans">
            <ScrollToTop />
            
            <div className="max-w-site mx-auto px-[100px] lg:px-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[11px] font-extrabold text-apple-gray mb-12 tracking-[0.05em] uppercase">
                    <Link to="/" className="text-apple-gray hover:text-apple-text transition-colors">HOME</Link>
                    <KeyboardArrowRightIcon className="!text-sm" />
                    <Link to="/shop" className="text-apple-gray hover:text-apple-text transition-colors">SHOP</Link>
                    <KeyboardArrowRightIcon className="!text-sm" />
                    <span>{product?.productName}</span>
                </nav>

                {/* Hero Section */}
                <section className="grid grid-cols-[1.1fr_0.9fr] gap-20 mb-[140px] items-start max-lg:grid-cols-1 max-lg:gap-[60px]">
                    <div className="flex gap-6 sticky top-[120px]">
                        <div className="flex flex-col gap-3">
                            <img src={product?.image} alt="Thumb 1" className="w-[60px] h-[60px] object-contain bg-surface rounded-xl border-2 border-brand-red scale-105" />
                            <img src={product?.image} alt="Thumb 2" className="w-[60px] h-[60px] object-contain bg-surface rounded-xl border-[1.5px] border-transparent" />
                            <img src={product?.image} alt="Thumb 3" className="w-[60px] h-[60px] object-contain bg-surface rounded-xl border-[1.5px] border-transparent" />
                        </div>
                        <div className="flex-1 bg-surface rounded-4xl flex justify-center items-center p-[60px] h-[640px] transition-all duration-500 ease-smooth max-lg:h-[500px]">
                            <img src={product?.image} alt={product?.productName} className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.06)]" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-12 pt-5">
                        <div>
                            <span className="inline-block text-brand-red text-[11px] font-extrabold tracking-[0.12em] mb-3 uppercase">NEW TITANIUM RENDERING</span>
                            <h1 className="mb-5">{product?.productName}</h1>
                            <div className="flex flex-col gap-1">
                                <span className="text-4xl font-bold tracking-[-0.01em]">${product?.price}</span>
                                <span className="text-base text-apple-gray font-medium">From $45.79/mo. with 0% APR</span>
                            </div>
                        </div>

                        <div className="border-t border-surface-alt pt-8">
                            <label className="block text-[13px] font-bold text-apple-gray mb-5 tracking-[-0.01em]">COLOR: <strong className="text-apple-text ml-2">{selectedColor?.name}</strong></label>
                            <div className="flex gap-4">
                                {availableColors.map(color => (
                                    <button 
                                        key={color.name}
                                        className={`w-11 h-11 rounded-full border-[3px] border-white cursor-pointer transition-all duration-200 ease-smooth p-0 ${selectedColor?.name === color.name ? 'shadow-[0_0_0_2px_#D6001C] scale-110' : 'shadow-[0_0_0_1px_#D2D2D7]'}`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() => handleFilterButtonClick("color", color)}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-surface-alt pt-8">
                            <label className="block text-[13px] font-bold text-apple-gray mb-5 tracking-[-0.01em]">STORAGE: <strong className="text-apple-text ml-2">SELECT CAPACITY</strong></label>
                            <div className="grid grid-cols-2 gap-4">
                                {availableStorages.map(storage => (
                                    <button 
                                        key={storage}
                                        className={`py-6 border rounded-2xl text-base font-bold transition-all duration-200 cursor-pointer text-center flex flex-col gap-1 ${selectedStorage === storage ? 'border-brand-red border-2 bg-white text-apple-text' : 'border-border-light bg-white hover:border-apple-gray'}`}
                                        onClick={() => handleFilterButtonClick("storage", storage)}
                                    >
                                        <span>{storage}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-3">
                            <div className="flex items-center gap-5 bg-surface-alt px-6 rounded-2xl h-16 text-lg font-bold">
                                <span className="cursor-pointer text-2xl text-apple-gray select-none hover:text-apple-text transition-colors">−</span>
                                <strong>1</strong>
                                <span className="cursor-pointer text-2xl text-apple-gray select-none hover:text-apple-text transition-colors">+</span>
                            </div>
                            <button className="flex-1 bg-brand-red !text-white h-16 rounded-2xl font-extrabold text-[17px] transition-all duration-300 ease-smooth hover:bg-brand-red-hover hover:scale-[1.02]" onClick={handleAddToCart}>Add to Cart</button>
                        </div>
                        <button className="bg-apple-text text-white h-16 rounded-2xl font-extrabold text-[17px] transition-all duration-300 ease-smooth hover:bg-black hover:scale-[1.02] -mt-8" onClick={handleBuyNow}>Buy Now</button>

                        <div className="flex flex-col gap-4 bg-[#FAFAFA] p-6 rounded-[20px] border border-[#F2F2F2]">
                            <div className="flex items-start gap-4 text-[13px] font-medium text-apple-text leading-[1.4]">
                                <LocalShippingOutlinedIcon className="text-apple-text !text-[22px]" />
                                <div><strong>Free Express Delivery</strong><p className="text-apple-gray mt-0.5">Delivered within 2–5 business days.</p></div>
                            </div>
                            <div className="flex items-start gap-4 text-[13px] font-medium text-apple-text leading-[1.4]">
                                <VerifiedUserOutlinedIcon className="text-apple-text !text-[22px]" />
                                <div><strong>1-Year UpCell Platinum Warranty</strong><p className="text-apple-gray mt-0.5">Full protection and priority support.</p></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 py-8 border-t border-surface-alt">
                            {[
                                { main: '6.1"', sub: "RETINA XDR" },
                                { main: "A17", sub: "PRO CHIP" },
                                { main: "48MP", sub: "CAMERA" },
                                { main: "USB-C", sub: "SPEED" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center py-4">
                                    <span className="text-[22px] font-extrabold block mb-2">{stat.main}</span>
                                    <span className="text-[10px] font-bold text-apple-gray uppercase tracking-[0.1em]">{stat.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Highlights Section */}
                <section className="py-[140px] bg-black -mx-[100px] px-[100px] text-white lg:-mx-10 lg:px-10">
                    <div className="max-w-[1400px] mx-auto">
                        <h2 className="mb-20 text-center text-white">Product Highlights</h2>
                        <div className="grid grid-cols-[1.5fr_1fr] gap-10 max-lg:grid-cols-1">
                            <div className="bg-[#1C1C1E] rounded-5xl overflow-hidden p-16 relative border border-white/5 flex flex-col justify-between bg-gradient-to-br from-[#1C1C1E] to-black">
                                <div className="max-w-[500px]">
                                    <h3 className="text-[40px] font-extrabold mb-6 tracking-[-0.02em]">The Pro Camera System.</h3>
                                    <p className="text-lg leading-relaxed text-[#A1A1A6]">A 48MP main camera that's advanced like no other. ProRAW, ProRES, and cinematic video in 4K HDR.</p>
                                </div>
                                <img src="https://via.placeholder.com/800x600?text=Camera+System" alt="Camera System" className="mt-[60px] w-full scale-110" />
                            </div>
                            <div className="flex flex-col gap-10">
                                <div className="bg-brand-red rounded-5xl overflow-hidden p-16 border-none flex-1">
                                    <h3 className="text-[32px] font-extrabold text-white mb-4">Titanium.</h3>
                                    <p className="text-lg leading-relaxed text-white/80">Aerospace-grade design. The lightest, strongest Pro models ever.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="bg-[#1C1C1E] rounded-5xl overflow-hidden p-12 border border-white/5">
                                        <div className="text-[28px] font-black mb-6 bg-gradient-to-b from-white to-apple-gray bg-clip-text text-transparent">A17</div>
                                        <h3 className="text-xl font-extrabold mb-2">A17 Pro chip.</h3>
                                        <p className="text-lg leading-relaxed text-[#A1A1A6]">A monster win for gaming.</p>
                                    </div>
                                    <div className="bg-[#1C1C1E] rounded-5xl overflow-hidden p-12 border border-white/5">
                                        <div className="text-[28px] font-black mb-6 bg-gradient-to-b from-white to-apple-gray bg-clip-text text-transparent">USB</div>
                                        <h3 className="text-xl font-extrabold mb-2">USB-C.</h3>
                                        <p className="text-lg leading-relaxed text-[#A1A1A6]">Universal connectivity.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Specs */}
                <section className="py-[140px]">
                    <h2 className="mb-20">Detailed Specifications</h2>
                    <div className="grid grid-cols-2 gap-x-[120px] gap-y-20 max-lg:grid-cols-1">
                        {[
                            { label: "DISPLAY", title: '6.1" Super Retina XDR', detail: "ProMotion technology with adaptive refresh rates up to 120Hz." },
                            { label: "WEIGHT", title: "187 grams", detail: "Lighter than previous generations due to titanium construction." },
                            { label: "BATTERY LIFE", title: "Up to 23 hours video", detail: "MagSafe and Qi2 wireless charging compatible." },
                            { label: "CELLULAR", title: "5G Superfast", detail: "Gigabit LTE and Wi-Fi 6E (802.11ax)." }
                        ].map((spec, i) => (
                            <div key={i} className="border-t border-surface-alt pt-8">
                                <span className="text-xs font-extrabold text-brand-red mb-3 block">{spec.label}</span>
                                <strong className="text-2xl font-bold mb-3 block">{spec.title}</strong>
                                <p className="text-sm text-apple-gray">{spec.detail}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-[140px] bg-surface-alt -mx-[100px] px-[100px] lg:-mx-10 lg:px-10">
                    <div className="max-w-site mx-auto">
                        <h2 className="mb-20">You might also like</h2>
                        <div className="grid grid-cols-3 gap-10 max-lg:grid-cols-1">
                            {[
                                { name: "iPhone 15 Pro Max", price: "$1,199", desc: "Large display, even extra optical zoom.", img: "/staticImages/hero-iphone15.png" },
                                { name: "iPhone 14 Pro", price: "$999", desc: "Dynamic Island. Exceptional performance at a lower price.", img: "/staticImages/hero-iphone15.png" },
                                { name: "iPhone 15", price: "$799", desc: "Colorful, durable, breakthrough camera.", img: "/staticImages/hero-iphone15.png" }
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-3xl p-12 flex flex-col transition-all duration-[400ms] ease-bounce-out shadow-soft hover:-translate-y-2.5 hover:shadow-medium">
                                    <div className="h-[300px] flex justify-center items-center mb-8"><img src={item.img} alt={item.name} className="max-h-full object-contain" /></div>
                                    <h3 className="mb-3">{item.name}</h3>
                                    <p className="text-[15px] leading-relaxed mb-8">{item.desc}</p>
                                    <div className="mt-auto flex justify-between items-baseline">
                                        <span className="text-base">From <strong>{item.price}</strong></span>
                                        <Link to="/shop" className="text-brand-red font-bold text-sm no-underline hover:opacity-70 transition-opacity">View Detail</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            
            <section className="bg-surface-alt py-[140px] rounded-6xl mx-10 mb-[120px]">
                <div className="max-w-site mx-auto px-[100px] lg:px-10">
                    <div className="text-center">
                        <h2 className="text-[clamp(40px,5vw,64px)] mb-4">Stay ahead of the curve.</h2>
                        <p className="max-w-[500px] mx-auto text-lg mb-10">Get early access to exclusive drops and cinematic hardware insights.</p>
                        <div className="flex justify-center gap-3 max-md:flex-col items-center">
                            <input type="email" placeholder="Enter your email" className="h-[72px] bg-white border border-black/10 rounded-xl px-8 w-full max-w-[400px] text-base outline-none focus:border-brand-red transition-colors" />
                            <button className="h-[72px] bg-apple-text text-white px-12 rounded-xl font-bold min-w-[200px] hover:bg-black transition-colors">Join UpCell</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetailPage;
