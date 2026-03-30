import React, { useState } from 'react';
import phoneCondition from "../../../../../assets/notificationInfoImages/phoneCondition.svg"

const Condition = () => {
    const [condi, setCondi] = useState("Fair")
    return (
        <>
            <img className='titleImg' src={phoneCondition} alt="" />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>

                <button
                    style={{ padding: ".5rem 1rem", borderRadius: ".5rem", border: condi === "Fair" ? "1px solid" : ""}}

                    onClick={() => { setCondi("Fair") }}>Fair</button>
                <button
                style={{ padding: ".5rem 1rem", borderRadius: ".5rem", border: condi === "Good" ? "1px solid" : ""}}
                onClick={() => { setCondi("Good") }}>Good</button>
                <button
                    style={{ padding: ".5rem 1rem", borderRadius: ".5rem", border: condi === "Excellent" ? "1px solid" : ""}}
                onClick={() => { setCondi("Excellent") }}>Excellent</button>
            </div>

            {condi === "Fair" &&
                <div>
                    <p>Battery Health: 80% - 85%</p>
                    <p>Screen: May have micro-scratches which could be slightly noticeable when the screen is turned on</p>
                    <p>Body: Has visible scratches and/or dents</p>
                </div>
            }
            {
                condi === "Good" &&

                <div>
                    <p>Battery Health: 85% - 90%</p>
                    <p>Screen: Perfect condition</p>
                    <p>Body: May have micro-scratches visible from 8 inches away</p>
                </div>
            }
            {condi === "Excellent" &&
                <div>
                    <p>Battery Health: 90% - 99%</p>
                    <p>Screen: Perfect condition</p>
                    <p>Body: May have barely visible micro-scratches, not noticeable from 8 inches away</p>
                </div>
            }
        </>
    );
};

export default Condition;