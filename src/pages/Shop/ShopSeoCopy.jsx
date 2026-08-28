import { SEO_SECTIONS } from './shopContent';

// The long-form block the reference closes its listing pages with.
//
// The copy is UpCell's own, written against what the site already publishes —
// see the note at the top of shopContent.js. Two things the reference's block
// does are deliberately absent: a headline savings percentage, and a
// side-by-side comparison against named marketplaces. Neither is something
// this catalogue can support.
const ShopSeoCopy = () => (
    <section aria-labelledby="about-refurbished-heading" className="bg-white py-10 md:py-14">
        <div className="site-shell">
            <div className="max-w-[900px]">
                <h2
                    id="about-refurbished-heading"
                    className="text-[1.625rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[2rem]"
                >
                    Buying a Certified Premium Apple device
                </h2>

                {SEO_SECTIONS.map((block) => (
                    <div key={block.id} className="mt-8">
                        <h3 className="text-[1.1875rem] font-bold leading-snug tracking-[-0.01em] text-apple-text md:text-[1.375rem]">
                            {block.heading}
                        </h3>

                        {block.paragraphs.map((paragraph, index) => (
                            <p
                                key={index}
                                className="mt-3 text-[1rem] font-normal leading-relaxed text-ink-soft md:text-[1.0625rem]"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default ShopSeoCopy;
