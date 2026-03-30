import React, { useEffect } from 'react';
import "./LeftSlider.css";
import UnlockedPhones from './InfoPages/UnlockedPhones';
import Warranty from './InfoPages/Warranty';
import Condition from './InfoPages/Condition';
import Technical from './InfoPages/Technical';
import PerksAndBenefits from './InfoPages/PerksAndBenefits';
import FrequestlyAsked from './InfoPages/FrequestlyAsked';


const LeftSlider = ({handleHideButton, notifyTitle, product}) => {

    return (
        <div id='left-slider' className='hidden' onClick={handleHideButton}>

            <div id='hide-show-toggle' className='hidden'
            onClick={(event)=>{event.stopPropagation()}}
            >
                <div className='toggle-title'>
                    <h2>{notifyTitle}</h2>
                    <button
                        onClick={handleHideButton}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                    </button>
                </div>

                <div className='toggle-info'>
                    {notifyTitle === "Unlocked phones" && <UnlockedPhones></UnlockedPhones>}
                    {notifyTitle === "Warranty Policy" && <Warranty></Warranty>}
                    {notifyTitle === "Conditions" && <Condition></Condition>}
                    {notifyTitle === "Technical specification" && <Technical product={product}></Technical>}
                    {notifyTitle === "Perks & benefits" && <PerksAndBenefits></PerksAndBenefits>}
                    {notifyTitle === "Frequently asked questions" && <FrequestlyAsked></FrequestlyAsked>}
                </div>
            </div>

        </div>
    );
};

export default LeftSlider;