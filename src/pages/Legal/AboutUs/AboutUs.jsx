import { Link } from "react-router-dom";
import { STATIC_IMAGES, staticImageUrl } from '../../../constants/staticImages';

const values = [
    { title: "Customer First", desc: "We design every experience around clarity, support, and long-term satisfaction." },
    { title: "Earn Trust", desc: "Honest grading, transparent pricing, and clear communication matter more than hype." },
    { title: "Simplify", desc: "We reduce friction in buying, trading, and supporting premium technology." },
    { title: "Responsible Growth", desc: "Giving Apple products a longer life reduces waste and extends value." },
    { title: "Collaboration", desc: "Our work blends technical care, service thinking, and real human support." },
    { title: "Do Good", desc: "We aim to make premium technology more accessible without losing quality." },
];

const AboutUs = () => {
    return (
        <div>
            <section>
                <div>
                    <nav>
                        <Link to="/">Home</Link>
                        
                        <span>About</span>
                    </nav>
                    <h1>About UpCell IT Inc.: Certified Premium Apple Devices You Can Trust</h1>
                    <p>
                        UpCell IT Inc. is a certified reseller of premium Apple hardware. We source, inspect, and present every premium iPhone, iPad, and MacBook to a higher standard than the typical secondhand marketplace.
                    </p>
                </div>
            </section>

            <section>
                <div>
                    <div>
                        <h2>Our mission</h2>
                        <p>
                            We source and certify premium Apple devices against a rigorous 40-point inspection standard covering hardware performance, battery health, and cosmetic condition. Every premium iPhone, iPad, and MacBook is graded honestly, so you know exactly what you're getting.
                        </p>
                        <p>
                            That means transparent pricing, accurate condition grades, a 12-month warranty on every device, and an experience that respects both the product and the customer choosing it.
                        </p>
                    </div>
                    <div>
                        <img src={staticImageUrl(STATIC_IMAGES.ABOUT_US_BG, 900)} alt="About UpCell IT Inc." />
                    </div>
                </div>
            </section>

            <section>
                <div>
                    <h2>What guides UpCell.</h2>
                </div>
                <div>
                    {values.map((value, index) => (
                        <div key={index}>
                            <div>
                                <span>{index + 1}</span>
                            </div>
                            <h3>{value.title}</h3>
                            <p>{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
