import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import "./Freque.css"

const FrequestlyAsked = () => {
    return (
        <Accordion>
            <Accordion.Item eventKey="0" className='mb-2'>
                <Accordion.Header><h3>What are refurbished devices ?</h3></Accordion.Header>
                <Accordion.Body>
                    <p>Refurbished is not the same thing as used or secondhand. The sellers we partner with are held to rigorous quality guidelines that ensure every item we sell runs like new. The refurbishment process they adhere to includes meticulously cleaning, testing, and assessing every item, as well as replacing aging parts with high-quality new components. Meanwhile, with secondhand or used items, you’re left to the private seller’s good word as to their true condition, and with no guarantee or warranty.</p>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1" className='mb-2'>
                <Accordion.Header><h3>What does the 30 days warranty cover ?</h3></Accordion.Header>
                <Accordion.Body>
                    <p>This warranty is limited to technical defects and component issues that affect the functionality of your item. It doesn't cover accidental breakage or compatibility and software upgrade issues, so make sure you read up about the limits of older models and check your phone carrier's website for models they don't support.</p>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" className='mb-2'>
                <Accordion.Header><h3>Will I be able to update the software on this phone ?</h3></Accordion.Header>
                <Accordion.Body>
                    <p>Yes! This device is compatible with the latest software updates.</p>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3" className='mb-2'>
                <Accordion.Header><h3>Which payment methods are availbale ?</h3></Accordion.Header>
                <Accordion.Body>
                    <p>We accept Visa, MasterCard, Discover, and American Express. PayPal and Klarna are also options if offered by the seller. We don’t accept payments via bank transfer, check, or cash.</p>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4" className='mb-2'>
                <Accordion.Header><h3>What's the Global trader quality assurance fee for ?</h3></Accordion.Header>
                <Accordion.Body>
                    <p>This fee allows us to vet and monitor the sellers we partner with, ensuring they meet our rigorous quality and customer-service standards. Your happiness is our top priority!</p>
                </Accordion.Body>
            </Accordion.Item>

        </Accordion>
    );
};

export default FrequestlyAsked;