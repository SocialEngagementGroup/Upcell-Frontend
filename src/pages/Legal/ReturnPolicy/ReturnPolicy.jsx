import "./ReturnPolicy.css"
const ReturnPolicy = () => {
    return (
        <div className="return-policy-page">
            <section className="legal-hero">
                <div className="container-max">
                    <h1>Returns & Refund Policy</h1>
                    <p>Hassle-free 30-day return window</p>
                </div>
            </section>

            <main className="container-max">
                <article className="return-content">
                    <p>At UpCell, we believe in that good ol’ saying: when life gives you lemons (or buyer’s remorse), get a return or a refund. </p>

                    <p className="note">30 days to change your mind</p>

                    <p>Once you receive your order you have 30 days to return the item to your seller. All you have to do is reach out. </p>

                    <p>Just a few important things to go over:</p>

                    <ol>
                        <li>Compose an Email: <br /><span>Open your email client and compose a new message.</span></li>
                        <li>Recipient: <br /><span>Address the email to:</span> <a href="mailto:usa.Upcells@gmail.com"> usa.Upcells@gmail.com</a></li>
                        <li>Subject: <br /><span>Please use the subject line: Product Return Request - [Your Order ID]</span></li>

                        <li>Content: <br /><span>In the body of the email, include the following details:</span> <br />
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
                        <li>Send: <br /><span>Once you've filled out all the required information, click 'Send' to submit your return request.</span></li>
                    </ol>

                    <p>Once we receive your email, our customer service team will review your request and provide you with further instructions on how to proceed with the return.</p>

                    <p>If you have any questions or concerns, feel free to include them in your email, and we'll be happy to assist you.</p>

                    <p>Thank you for your cooperation.</p>
                </article>
            </main>
        </div>
    );
};

export default ReturnPolicy;