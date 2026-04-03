import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const ModernProductCard = ({ product }) => {
    // If productId/parentId are already strings in the props, use them. 
    // If we're passing the raw API object, we map them.
    const parentId = product.parentId || product.parentCatagory;
    const productId = product.productId || product._id;
    const title = product.title || product.productName;
    const family = product.family;
    const image = product.image;
    const price = product.price.toString().startsWith('$') ? product.price : `$${product.price}`;
    const availableColors = product.availableColors || [];

    return (
        <Link 
            to={`/iphone/${parentId}/${productId}`} 
            className="group relative block overflow-hidden rounded-[40px] border border-apple-gray/5 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-medium"
        >
            <div className="relative mb-8 flex h-[240px] items-center justify-center">
                <img src={image} alt={title} className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105" />
                
                <div className="absolute -right-2 top-0 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button className="flex h-11 w-11 items-center justify-center rounded-full bg-apple-gray/5 text-apple-text backdrop-blur-sm transition-colors hover:bg-apple-text hover:text-white" onClick={(e) => e.preventDefault()}>
                        <CompareArrowsIcon className="!text-[20px]" />
                    </button>
                    <button className="flex h-11 w-11 items-center justify-center rounded-full bg-apple-gray/5 text-apple-text backdrop-blur-sm transition-colors hover:bg-apple-text hover:text-white" onClick={(e) => e.preventDefault()}>
                        <FavoriteBorderIcon className="!text-[20px]" />
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-apple-gray/50">{family}</span>
                <h3 className="text-xl font-extrabold text-apple-text leading-[1.2]">
                    {family === 'MacBook' && title.includes('(') ? (
                        <>
                            {title.split('(')[0].trim()}
                            <br />
                            ({title.split('(')[1]}
                        </>
                    ) : title}
                </h3>
                {availableColors.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {availableColors.map((swatch) => (
                            <span
                                key={swatch.name}
                                className="h-4 w-4 rounded-full border border-black/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
                                style={{ backgroundColor: swatch.value }}
                                title={swatch.name}
                                aria-label={swatch.name}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-end justify-between">
                <div>
                    <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-apple-gray/65">
                        From
                    </div>
                    <span className="text-[32px] font-black leading-none text-apple-text">{price}</span>
                </div>
                <div className="group/link flex items-center gap-2 text-[15px] font-bold text-apple-text">
                    View Product
                    <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                </div>
            </div>
        </Link>
    );
};

export default ModernProductCard;
