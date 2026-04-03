import React from 'react';
import { Link } from 'react-router-dom';

const CategoryShelf = () => {
    return (
        <section className="py-[60px] bg-[#FAFAFA]">
            <div className="max-w-site mx-auto px-[100px] lg:px-10">
                <div className="grid grid-cols-2 gap-6 h-[700px] max-lg:grid-cols-1 max-lg:h-auto">
                    {/* Left Column - Large iPhone Card */}
                    <div className="bg-white rounded-[28px] overflow-hidden relative flex flex-col p-10 transition-all duration-[400ms] ease-bounce-out shadow-soft hover:-translate-y-2 hover:shadow-medium col-start-1 h-full max-lg:h-[400px] max-lg:p-[30px]">
                        <div>
                            <h3 className="mb-2 max-lg:text-2xl">iPhone</h3>
                            <p className="text-base text-apple-gray mb-10 max-w-[200px] leading-[1.4]">The world's most powerful personal device.</p>
                            <Link to="/shop?category=iPhone" className="text-base font-semibold text-brand-red no-underline transition-opacity duration-200 hover:opacity-70">
                                Explore All <span>→</span>
                            </Link>
                        </div>
                        <div className="absolute w-[60%] -bottom-[5%] -right-[5%] z-[1] max-lg:!w-[45%] max-lg:!bottom-[5%] max-lg:!right-[5%]">
                            <img src="/staticImages/category-iphone.png" alt="iPhone" className="w-full h-auto object-contain" />
                        </div>
                    </div>

                    {/* Right Column - iPad & MacBook Stack */}
                    <div className="flex flex-col h-full gap-6">
                        {/* iPad Card */}
                        <div className="bg-white rounded-[28px] overflow-hidden relative flex flex-col p-10 transition-all duration-[400ms] ease-bounce-out shadow-soft hover:-translate-y-2 hover:shadow-medium flex-1 max-lg:h-[400px] max-lg:p-[30px]">
                            <div>
                                <h3 className="mb-2 max-lg:text-2xl">iPad</h3>
                                <p className="text-base text-apple-gray mb-10 max-w-[200px] leading-[1.4]">Versatility meets portability.</p>
                                <Link to="/shop?category=iPad" className="text-base font-semibold text-brand-red no-underline transition-opacity duration-200 hover:opacity-70">Shop iPad</Link>
                            </div>
                            <div className="absolute w-[50%] top-1/2 right-[5%] -translate-y-[40%] z-[1] max-lg:!w-[45%] max-lg:!bottom-[5%] max-lg:!right-[5%] max-lg:!top-auto max-lg:!translate-y-0">
                                <img src="/staticImages/category-ipad.png" alt="iPad" className="w-full h-auto object-contain" />
                            </div>
                        </div>

                        {/* MacBook Card (Dark Theme) */}
                        <div className="bg-black rounded-[28px] overflow-hidden relative flex flex-col p-10 transition-all duration-[400ms] ease-bounce-out shadow-soft hover:-translate-y-2 hover:shadow-medium flex-1 max-lg:h-[400px] max-lg:p-[30px]">
                            <div>
                                <h3 className="text-white mb-2 max-lg:text-2xl">MacBook</h3>
                                <p className="text-apple-gray mb-10 max-w-[200px] leading-[1.4]">Mind-blowing power. Heart-stopping speed.</p>
                                <Link to="/shop?category=MacBook" className="text-base font-semibold text-brand-red no-underline transition-opacity duration-200 hover:opacity-70">Shop Mac</Link>
                            </div>
                            <div className="absolute w-[60%] bottom-[5%] -right-[5%] z-[1] max-lg:!w-[45%] max-lg:!bottom-[5%] max-lg:!right-[5%]">
                                <img src="/staticImages/category-macbook.png" alt="MacBook" className="w-full h-auto object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryShelf;
