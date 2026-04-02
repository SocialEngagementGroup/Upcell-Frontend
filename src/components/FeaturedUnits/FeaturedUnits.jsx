import React from 'react';
import { Link } from 'react-router-dom';
import allDummyProducts from '../../utilities/dummyData';

const FeaturedUnits = () => {
    const products = allDummyProducts.slice(0, 6).map(p => ({
        id: p._id,
        label: p.category === "IPHONE" ? "AVAILABLE NOW" : p.category === "MACBOOK" ? "POWERHOUSE" : "CREATIVE TOOL",
        title: p.productName,
        price: `$${p.price}`,
        image: p.image,
        parentId: p.parentId,
        productId: p._id
    }));

    return (
        <section className="py-24 bg-surface-alt">
            <div className="max-w-site mx-auto px-[100px] lg:px-10">
                <div className="flex justify-between items-end mb-12 max-sm:flex-col max-sm:items-start max-sm:gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold text-apple-text mb-2 tracking-[-0.01em]">Featured Units</h2>
                        <p className="text-lg text-apple-gray">Hand-picked precision, rigorously tested.</p>
                    </div>
                    <Link to="/shop" className="text-base font-semibold text-brand-red no-underline transition-opacity duration-200 hover:opacity-70">View All Devices <span>→</span></Link>
                </div>
                
                <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
                    {products.map(product => (
                        <Link 
                            to={`/iphone/${product.parentId}/${product.productId}`} 
                            key={product.id} 
                            className="block no-underline text-inherit bg-white rounded-3xl p-8 transition-all duration-300 ease-smooth shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                        >
                            <div className="bg-surface-alt rounded-2xl h-[300px] flex justify-center items-center mb-6 overflow-hidden">
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold text-apple-gray tracking-[0.1em] mb-2">{product.label}</span>
                                <h3 className="text-xl font-bold text-apple-text mb-6">{product.title}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-extrabold text-apple-text">{product.price}</span>
                                    <button className="bg-brand-red text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 hover:bg-brand-red-hover hover:scale-[1.03]" onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}>Buy Now</button>
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
