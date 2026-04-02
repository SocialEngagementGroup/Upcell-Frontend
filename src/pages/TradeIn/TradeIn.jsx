import React, { useState } from 'react';
import './TradeIn.css';
import ScrollToTop from '../../utilities/ScrollToTop';

// Material Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PublicIcon from '@mui/icons-material/Public';
import StarsIcon from '@mui/icons-material/Stars';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BoltIcon from '@mui/icons-material/Bolt';
import CloseIcon from '@mui/icons-material/Close';

const TradeIn = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selection, setSelection] = useState({
        device: '',
        model: '',
        condition: '',
        info: { name: '', email: '', phone: '' }
    });

    const steps = [
        { id: 1, label: 'Device' },
        { id: 2, label: 'Model' },
        { id: 3, label: 'Specs' },
        { id: 4, label: 'Condition' },
        { id: 5, label: 'Estimate' },
        { id: 6, label: 'Submit' }
    ];

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
    const handleDeviceSelect = (type) => {
        setSelection({ ...selection, device: type });
        nextStep();
    };

    const handleConditionSelect = (cond) => {
        setSelection({ ...selection, condition: cond });
        nextStep();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-content device-selection">
                        <header className="step-header">
                            <h1>Sell Your Device</h1>
                            <p>Get an instant valuation for your tech. Our cinematic trade-in process ensures you receive the highest market value with surgical precision.</p>
                        </header>
                        
                        <div className="selection-grid">
                            <div className="selection-card" onClick={() => handleDeviceSelect('iPhone')}>
                                <div className="img-box"><img src="https://via.placeholder.com/200x250?text=iPhone" alt="iPhone" /></div>
                                <h2>iPhone</h2>
                                <p>Sell your iPhone 11 to iPhone 15 Pro Max</p>
                            </div>
                            <div className="selection-card" onClick={() => handleDeviceSelect('iPad')}>
                                <div className="img-box black"><img src="https://via.placeholder.com/200x200?text=iPad" alt="iPad" /></div>
                                <h2>iPad</h2>
                                <p>Trade in any iPad Pro, Air, or Mini</p>
                            </div>
                            <div className="selection-card" onClick={() => handleDeviceSelect('MacBook')}>
                                <div className="img-box black"><img src="https://via.placeholder.com/200x200?text=MacBook" alt="MacBook" /></div>
                                <h2>MacBook</h2>
                                <p>Laptops featuring M1, M2, and M3 chips</p>
                            </div>
                        </div>

                        <div className="trust-footer-bar">
                            <div className="trust-item">
                                <SecurityIcon />
                                <div>
                                    <strong>Secure Process</strong>
                                    <span>Bank-grade data encryption and wipe</span>
                                </div>
                            </div>
                            <div className="trust-item">
                                <VerifiedIcon />
                                <div>
                                    <strong>Fair Market Value</strong>
                                    <span>Real-time pricing data for best offers</span>
                                </div>
                            </div>
                            <div className="trust-item">
                                <LocalShippingOutlinedIcon />
                                <div>
                                    <strong>Free Shipping</strong>
                                    <span>Pre-paid labels and insurance included</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step-content condition-selection">
                        <header className="step-header centered">
                            <h1>What's the condition of your <span className="red-text">iPhone 15 Pro</span>?</h1>
                            <p>Be as accurate as possible to ensure your estimate remains the same upon inspection. Honesty helps us process your payment faster.</p>
                        </header>

                        <div className="condition-grid">
                            <div className="condition-card" onClick={() => handleConditionSelect('Mint')}>
                                <StarsIcon className="icon" />
                                <h3>Mint</h3>
                                <p>Like new, no scratches. Looks like it just came out of the box.</p>
                            </div>
                            <div className="condition-card" onClick={() => handleConditionSelect('Excellent')}>
                                <CheckCircleIcon className="icon" />
                                <h3>Excellent</h3>
                                <p>Light signs of use. Minor micro-scratches barely visible to the naked eye.</p>
                            </div>
                            <div className="condition-card" onClick={() => handleConditionSelect('Good')}>
                                <ThumbUpAltIcon className="icon" />
                                <h3>Good</h3>
                                <p>Visible scratches, but no cracks or deep gouges. Fully functional.</p>
                            </div>
                            <div className="condition-card" onClick={() => handleConditionSelect('Poor')}>
                                <WarningAmberIcon className="icon" />
                                <h3>Poor</h3>
                                <p>Cracked glass or damaged chassis. Significant wear and tear.</p>
                            </div>
                        </div>

                        <div className="live-valuation-banner">
                            <div className="valuation-text">
                                <span className="label">LIVE VALUATION</span>
                                <h2>Your Estimated Offer: <span className="offer-price">up to $750</span></h2>
                            </div>
                            <button className="btn-get-estimate" onClick={nextStep}>Get Final Estimate</button>
                        </div>

                        <div className="inspection-guarantee">
                            <img src="https://via.placeholder.com/400x300?text=Inspection" alt="Inspection" />
                            <div className="guarantee-text">
                                <h3>Our Inspection Guarantee</h3>
                                <p>Once your device arrives at our facility, a technician will verify its condition within 24 hours. If it matches your assessment, we release payment immediately via your preferred method.</p>
                                <div className="flash-payment">
                                    <BoltIcon /> <span>Next-day payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="step-content finalize-step">
                        <header className="valuation-hero">
                            <div className="offer-block">
                                <span className="label">YOUR GUARANTEED OFFER</span>
                                <h1 className="guaranteed-price">$750.00</h1>
                                <p>Based on your device condition report, we are ready to pay you immediately upon inspection. No hidden fees, no shipping costs.</p>
                            </div>
                            <div className="trust-mini-cards">
                                <div className="mini-card">
                                    <CheckCircleIcon />
                                    <div>
                                        <strong>Secure Data Wipe</strong>
                                        <span>Military-grade sanitation of all your personal information.</span>
                                    </div>
                                </div>
                                <div className="mini-card">
                                    <BoltIcon />
                                    <div>
                                        <strong>Instant Payment</strong>
                                        <span>Funds released within 24 hours of device verification.</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="finalize-grid">
                            <div className="finalize-product-preview">
                                <img src="https://via.placeholder.com/300x400?text=iPhone+15+Pro+Max" alt="Product" />
                                <div className="p-label">IPHONE 15 PRO MAX</div>
                            </div>

                            <form className="details-form">
                                <h2>Finalize Your Details</h2>
                                <p>Where should we send your shipping kit and payment updates?</p>
                                
                                <div className="form-row">
                                    <div className="input-group">
                                        <label>FULL NAME</label>
                                        <input type="text" placeholder="Enter your full name" />
                                    </div>
                                    <div className="input-group">
                                        <label>EMAIL ADDRESS</label>
                                        <input type="email" placeholder="name@example.com" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>PHONE NUMBER</label>
                                    <input type="tel" placeholder="+1 (555) 000-0000" />
                                </div>

                                <div className="terms-check">
                                    <input type="checkbox" id="terms" />
                                    <label htmlFor="terms">I agree to the <u>terms and conditions</u> and confirm that the device condition stated is accurate to the best of my knowledge.</label>
                                </div>

                                <button className="btn-submit-trade" onClick={nextStep}>Complete Submission</button>
                                <span className="encrypted-msg"><SecurityIcon /> Encrypted 256-bit secure checkout</span>
                            </form>
                        </div>

                        <div className="service-highlights">
                            <div className="service-card">
                                <LocalShippingOutlinedIcon />
                                <h3>Free Shipping Kit</h3>
                                <p>We send you a prepaid box with protective padding for your device.</p>
                            </div>
                            <div className="service-card">
                                <PublicIcon />
                                <h3>Flexible Payments</h3>
                                <p>Get paid via Direct Deposit, PayPal, or UpCell Store Credit (+10%).</p>
                            </div>
                            <div className="service-card">
                                <StarsIcon />
                                <h3>24/7 Concierge</h3>
                                <p>Real humans ready to help you at every stage of your trade-in.</p>
                            </div>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="step-content success-step">
                         <header className="step-header centered">
                            <CheckCircleIcon className="success-icon" />
                            <h1>Submission Received</h1>
                            <p>Check your email for the next steps and your prepaid shipping label.</p>
                            <button className="btn-hero-primary" onClick={() => setCurrentStep(1)}>Go Back Home</button>
                        </header>
                    </div>
                );
            default:
                // For Step 2 & 3 (Model/Specs), skipping for MVP/Demonstration as per common logic
                return (
                    <div className="step-content">
                        <h1>Step {currentStep}</h1>
                        <button onClick={nextStep}>Continue</button>
                    </div>
                );
        }
    };

    return (
        <div className="trade-in-page">
            <ScrollToTop />
            <div className="container-max">
                {/* Stepper Header */}
                <div className="stepper-header">
                   {currentStep < 5 ? (
                     <div className="modern-stepper">
                        {steps.map(step => (
                            <div key={step.id} className={`step-node ${currentStep >= step.id ? 'active' : ''}`}>
                                <div className="step-indicator">
                                    {step.id}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </div>
                        ))}
                     </div>
                   ) : (
                     <div className="progress-top-bar">
                        <div className="left">IPHONE 15 PRO</div>
                        <div className="center">Step {currentStep} of 6 <div className="bar"><div className="fill" style={{width: `${(currentStep/6)*100}%`}}></div></div></div>
                        <div className="right"><CloseIcon /></div>
                     </div>
                   )}
                </div>

                {renderStep()}
            </div>
        </div>
    );
};

export default TradeIn;
