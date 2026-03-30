import React from 'react';
import warranty from "../../../../../assets/notificationInfoImages/warranty-modal.svg"

import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const Warranty = () => {
    return (
        <>
            <img className='titleImg' src={warranty} alt="image of warranty" />
            <h2>Free 30-day returns</h2>

            <h3><ThumbDownAltOutlinedIcon /> <span>Just not that into your new device?</span></h3>
            <p>Return your item for any reason. All without having to say “it’s not you, it’s me.”</p>

            <h3><ScheduleOutlinedIcon></ScheduleOutlinedIcon><span>Returns are suuuper easy</span></h3>
            <p>Contact us via your Global traders Email account for simple return instructions.</p>

            <h3><PendingActionsOutlinedIcon></PendingActionsOutlinedIcon><span>Be reunited with your cash</span></h3>
            <p>Your original payment method will be refunded within 7 business days</p>

            <hr />

            <h2>30 days warranty</h2>

            <h3><ScheduleOutlinedIcon /> <span> We got you on defects for the first month</span></h3>
            <p>If your item has a technical defect within the first month, we’ll repair or replace it on our dime.</p>

            <h3><LocalShippingOutlinedIcon></LocalShippingOutlinedIcon><span>Ship it back to the seller for repair</span></h3>
            <p>Once we receive the product, we will let you know and start the further process</p>

            <h3><BuildCircleOutlinedIcon/><span>Get a repair or replacement on us</span></h3>
            <p>Your item will be repaired or replaced (if a repair isn’t possible) free of charge. Really.</p>

        </>
    );
};

export default Warranty;