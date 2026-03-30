import "./ReturnPolicy.css"
const ReturnPolicy = () => {
    return (
        <section id='returnPolicy'>
            <h1>Returns & Refund Policy</h1>

            <p>At Global Traders, we believe in that good ol’ saying: when life gives you lemons (or buyer’s remorse), get a return or a refund. </p>

            <p className="note">30 days to change your mind</p>

            <p>Once you receive your order you have 30 days to return the item to your seller. All you have to do is reach out. </p>

            <p>Just a few important things to go over:</p>

            <ol>
                <li>Compose an Email: <br />Open your email client and compose a new message.</li>
                <li>Recipient: <br />Address the email to: <a href="mailto:usa.globaltraders@gmail.com"> usa.globaltraders@gmail.com</a></li>
                <li>Subject: <br />Please use the subject line: Product Return Request - [Your Order ID]</li>

                <li>Content: <br />In the body of the email, include the following details: <br />

                    <ul>
                        <li>Your Order ID: [Your Order ID]</li>
                        <li>Your Name: [Your Name]</li>
                        <li>Address: [Your Address]</li>
                        <li>Order Date: [Order Date]</li>
                        <li>Return Date: [Return Date]</li>
                        <li>Preferred Delivery Method to Return the Product: [e.g., USPS, FedEx, UPS]</li>
                    </ul>
                </li>

                <li>Attach Necessary Documentation (if applicable): </li>
                <li>Send: <br /> Once you've filled out all the required information, click 'Send' to submit your return request.</li>
            </ol>

            <p>Once we receive your email, our customer service team will review your request and provide you with further instructions on how to proceed with the return.</p>

            <p>If you have any questions or concerns, feel free to include them in your email, and we'll be happy to assist you.</p>

            <p>Thank you for your cooperation.</p>
        </section>
    );
};

export default ReturnPolicy;