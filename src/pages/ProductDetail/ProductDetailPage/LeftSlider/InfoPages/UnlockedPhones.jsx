import React from 'react';
import unlockedPhoneImg from "../../../../../assets/notificationInfoImages/americanExpress.svg"

const UnlockedPhones = () => {
    return (
        <>
            <img className="titleImg" src={unlockedPhoneImg} alt="image of Unlocked phones" />

            <h1>Locked phones: connected to a specific carrier</h1>

            <p>Locked phones are connected to a specific carrier. A software-level lock on the device, often called firmware, prevents the user from using the phone with another carrier.</p>

            <h2>What are unlocked phones?</h2>

            <p>If you have an unlocked phone, you can connect to any carrier in the US and be able to switch carriers in the future.</p>
        </>
    );
};

export default UnlockedPhones;