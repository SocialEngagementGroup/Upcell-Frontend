import React from 'react';

const FlashDealBanner = () => {
    return (
        <section className="py-[60px] bg-white">
            <div className="max-w-site mx-auto px-[100px] lg:px-10">
                <div className="bg-brand-red rounded-5xl px-[100px] py-20 flex justify-between items-center text-white relative overflow-hidden max-lg:flex-col max-lg:px-10 max-lg:py-[60px] max-lg:text-center">
                    <div className="flex-[1.2] z-[2]">
                        <span className="inline-block bg-black/[0.15] px-3.5 py-1.5 rounded-[10px] text-[11px] font-extrabold tracking-[0.05em] mb-6">FLASH DEAL</span>
                        <h2 className="text-[clamp(40px,6vw,64px)] font-extrabold leading-[1.05] mb-10 tracking-[-0.035em]">Season Finale. <br />Extra 15% OFF.</h2>
                        <div className="mb-12">
                            <p className="text-lg opacity-90">Use code <span className="bg-black text-white px-3 py-1 rounded-md font-extrabold">UPCELL15</span> at checkout.</p>
                        </div>
                        <button className="bg-black text-white px-10 py-4 rounded-xl text-base font-bold transition-all duration-300 ease-smooth hover:bg-apple-text hover:-translate-y-0.5">Shop the Sale</button>
                    </div>
                    <div className="flex-1 flex justify-center items-center max-lg:mt-[60px] max-lg:-order-1">
                        <div className="w-[320px] h-[320px] bg-apple-text rounded-full flex flex-col justify-center items-center shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative max-lg:w-[250px] max-lg:h-[250px]">
                            <span className="text-[64px] font-black text-white tracking-[0.1em] max-lg:text-5xl">DEALS</span>
                            <span className="text-xs font-bold text-apple-gray tracking-[0.2em] mt-2">SAFE FOR WORK</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlashDealBanner;
