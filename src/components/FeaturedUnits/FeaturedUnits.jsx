import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utilities/axiosInstance';
import { groupProductsByParent, normalizeProduct } from '../../utilities/catalog';

const FeaturedUnits = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axiosInstance.get('product')
            .then((res) => {
                const featured = groupProductsByParent(res.data.map(normalizeProduct)).slice(0, 6).map((p) => ({
                    id: p._id,
                    label: p.family === "iPhone" ? "AVAILABLE NOW" : p.family === "MacBook" ? "POWERHOUSE" : "CREATIVE TOOL",
                    title: p.productName,
                    price: `$${p.price}`,
                    image: p.image,
                    parentId: p.parentCatagory,
                    productId: p._id,
                }));
                setProducts(featured);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <section className="px-4 py-12 md:px-6 md:py-16">
            <div className="page-container">
                <div className="mb-10 flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
                    <div>
                        <span className="eyebrow mb-4">Featured</span>
                        <h2 className="mb-2 tracking-[-0.01em]">Selected for condition, color, and value.</h2>
                        <p className="text-lg text-ink-soft">A tighter, more premium edit of our best Apple inventory.</p>
                    </div>
                    <Link to="/shop" className="kicker-link">View all devices</Link>
                </div>
                
                <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
                    {products.map(product => (
                        <Link 
                            to={`/iphone/${product.parentId}/${product.productId}`} 
                            key={product.id} 
                            className="premium-card block overflow-hidden rounded-[32px] p-6 transition-all duration-[400ms] ease-bounce-out hover:-translate-y-2 hover:shadow-medium"
                        >
                            <div className="mb-6 flex h-[300px] items-center justify-center overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#f8f8fa_0%,#eef1f5_100%)]">
                                <img src={product.image} alt={product.title} className="h-[84%] w-auto object-contain drop-shadow-[0_25px_45px_rgba(15,23,42,0.12)]" />
                            </div>
                            <div>
                                <span className="mb-2 block text-[11px] font-bold tracking-[0.18em] text-apple-gray uppercase">{product.label}</span>
                                <h3 className="mb-3 text-[28px]">{product.title}</h3>
                                <p className="mb-6 text-sm leading-7 text-ink-soft">Professionally checked, cleanly presented, and ready for immediate setup.</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-extrabold text-apple-text">{product.price}</span>
                                    <div className="premium-button-secondary px-5 py-3 text-xs">View Product</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedUnits;
