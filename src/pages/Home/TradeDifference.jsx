import "./TradeDifference.css"

const TradeDifference = () => {
    return (
        <section id="tradeDifference">
            <div id="experience" className="container-max">
                <h3>Experience the Trade Difference</h3>
                <p>We believe buying used phones should be just as exciting as buying new. 
                   Here’s how Global Traders is changing the game.</p>
            </div>

            <div id="before-section" className="container-td">
                <h4>BEFORE</h4>
                <div className="grid-td">
                    <div className="td-card">
                        <img src="/logos/beforeIcons1.svg" alt="Haggling" />
                        <p>Haggling was mandatory</p>
                        <p>You had to negotiate a good deal with a dealer or private seller. Trust was always a gamble.</p>
                    </div>
                    <div className="td-card">
                        <img src="/logos/beforeIcons2.svg" alt="Hidden Problems" />
                        <p>Hidden problems</p>
                        <p>You thought you scored a great phone, only to find functional issues weeks later.</p>
                    </div>
                    <div className="td-card">
                        <img src="/logos/beforeIcons3.svg" alt="Buyer's Remorse" />
                        <p>Buyer’s remorse? You’re stuck</p>
                        <p>No returns, no guarantees. Once you paid, any problem was your problem alone.</p>
                    </div>
                    <div className="td-card">
                        <img src="/logos/beforeIcons4.svg" alt="Protection" />
                        <p>Only new phones were protected</p>
                        <p>Device protections generally cover new phones, leaving second-hand owners vulnerable.</p>
                    </div>
                </div>
            </div>

            <div id="after-section" className="container-td">
                <h4>AFTER</h4>
                <div className="grid-td">
                    <div className="td-card">
                        <img src="/logos/afterIcons1.svg" alt="Fair Value" />
                        <p>Phones priced at fair market value</p>
                        <p>No scammers here. You get what you pay for, at a fair deal, with no surprises.</p>
                    </div>
                    <div className="td-card">
                        <img src="/logos/afterIcons2.svg" alt="Inspection" />
                        <p>Multi-point inspection</p>
                        <p>Every phone passes our rigorous process and includes a full history report.</p>
                    </div>
                    <div className="td-card">
                        <img src="/logos/afterIcons3.svg" alt="Trial" />
                        <p>30-day trial</p>
                        <p>Use the phone as you normally would. If you’re not satisfied, we’ll take it back.</p>
                    </div>
                    <div className="td-card">
                        <img src="/logos/afterIcons4.svg" alt="GT Protect" />
                        <p>Global Traders Protect</p>
                        <p>Extended hardware warranty and technical support for a small monthly fee.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradeDifference;