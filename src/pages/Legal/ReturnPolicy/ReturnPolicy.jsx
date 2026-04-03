const ReturnPolicy = () => {
    return (
        <div className="bg-white min-h-screen">
            <header className="bg-surface-alt py-24 text-center rounded-b-[60px] mb-20">
                <div className="max-w-site mx-auto px-[100px] lg:px-10">
                    <h1 className="mb-4">Returns & Refund Policy</h1>
                    <p className="text-lg text-apple-gray">Hassle-free 30-day return window</p>
                </div>
            </header>

            <main className="max-w-site mx-auto px-[100px] lg:px-10 pb-24">
                <article className="max-w-[800px] mx-auto [&_p]:text-apple-gray [&_p]:leading-relaxed [&_p]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-apple-gray [&_ol_li]:mb-4 [&_ol_li]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-2 [&_ul_li]:text-apple-gray">
                    <p>At UpCell, we believe in that good ol' saying: when life gives you lemons (or buyer's remorse), get a return or a refund.</p>
                    <p className="!font-bold !text-apple-text !text-lg">30 days to change your mind</p>
                    <p>Once you receive your order you have 30 days to return the item to your seller. All you have to do is reach out.</p>
                    <p>Just a few important things to go over:</p>

                    <ol>
                        <li>Compose an Email: <br /><span>Open your email client and compose a new message.</span></li>
                        <li>Recipient: <br /><span>Address the email to:</span> <a href="mailto:usa.Upcells@gmail.com" className="text-brand-red font-semibold hover:underline"> usa.Upcells@gmail.com</a></li>
                        <li>Subject: <br /><span>Please use the subject line: Product Return Request - [Your Order ID]</span></li>
                        <li>Content: <br /><span>In the body of the email, include the following details:</span>
                            <ul>
                                <li>Your Order ID: [Your Order ID]</li>
                                <li>Your Name: [Your Name]</li>
                                <li>Address: [Your Address]</li>
                                <li>Order Date: [Order Date]</li>
                                <li>Return Date: [Return Date]</li>
                                <li>Preferred Delivery Method to Return the Product: [e.g., USPS, FedEx, UPS]</li>
                            </ul>
                        </li>
                        <li>Attach Necessary Documentation (if applicable)</li>
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