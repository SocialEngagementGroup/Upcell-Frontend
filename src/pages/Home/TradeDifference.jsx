import "./TradeDifference.css"

const TradeDifference = () => {
    return (
        <section className="trade-difference-section">
            <div className="container-max">
                <header className="section-header center">
                    <h3>Experience the Trade Difference</h3>
                    <p>We believe buying used phones should be just as exciting as buying new. Here’s how Global Traders is changing the game.</p>
                </header>

                <div className="comparison-grid">
                    {/* Before Section */}
                    <div className="comparison-column before">
                        <div className="column-header">
                            <h4>The Old Way</h4>
                            <span className="status-label">Legacy Market</span>
                        </div>
                        <div className="comparison-items">
                            <div className="comparison-item">
                                <h5>Haggling & Uncertainty</h5>
                                <p>Mandatory negotiations and constant gambles on trust with private sellers or local dealers.</p>
                            </div>
                            <div className="comparison-item">
                                <h5>Hidden Technical Issues</h5>
                                <p>Risking functional problems discovered only weeks after the "great deal" was made.</p>
                            </div>
                            <div className="comparison-item">
                                <h5>Zero Buyer Protection</h5>
                                <p>No returns, no guarantees. Once paid, every problem becomes your problem alone.</p>
                            </div>
                        </div>
                    </div>

                    {/* After Section */}
                    <div className="comparison-column after">
                        <div className="column-header">
                            <h4>The Global Traders Way</h4>
                            <span className="status-label positive">Our Standard</span>
                        </div>
                        <div className="comparison-items">
                            <div className="comparison-item">
                                <h5>Fair Market Pricing</h5>
                                <p>Scam-free, transparent pricing based on real-time market value and device condition.</p>
                            </div>
                            <div className="comparison-item">
                                <h5>Multi-point Inspection</h5>
                                <p>Every device passes a rigorous 50+ point process and includes a full history report.</p>
                            </div>
                            <div className="comparison-item">
                                <h5>30-Day Risk-Free Trial</h5>
                                <p>Use it, love it, or return it. We stand by our quality with a hassle-free return window.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradeDifference;