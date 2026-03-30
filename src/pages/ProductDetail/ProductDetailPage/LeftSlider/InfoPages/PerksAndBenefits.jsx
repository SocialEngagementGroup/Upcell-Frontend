import React from 'react';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const PerksAndBenefits = () => {
    return (
        <>
            <h2>Included Services</h2>

            <h3><ConstructionOutlinedIcon></ConstructionOutlinedIcon><span>1-month warranty</span></h3>
            <p>If your item has a technical defect within the first month, we'll repair or replace it.</p>

            <h3><EventAvailableOutlinedIcon></EventAvailableOutlinedIcon><span>30 days to change your mind</span></h3>
            <p>Return your item for any reason within the first 30 days of receiving it. Simple as that!</p>


            <h3><LocalShippingOutlinedIcon></LocalShippingOutlinedIcon><span>Free standard shipping</span></h3>
            <p>Enjoy free standard shipping on all orders, or on express shipping, from $30.00, if you need your item ASAP.</p>

            <h3><FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon><span>Customer support</span></h3>
            <p>You can count on us to always get back to you within 1 business day!</p>
        </>
    );
};

export default PerksAndBenefits;