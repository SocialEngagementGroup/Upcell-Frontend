import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axiosInstance from '../../../utilities/axiosInstance';
import "./ProductDetailPage.css";
import { CartContext } from '../../../App';
import { Link } from 'react-router-dom';
import LeftSlider from './LeftSlider/LeftSlider';
import OfferProducts from '../../../components/OfferProducts/OfferProducts';

import eyes from "../../../assets/eyes.svg";
import stars from "../../../assets/stars.svg";
import fullStars from "../../../assets/fullStar.svg";
import halfStars from "../../../assets/halfStar.svg";
import klarna from "../../../assets/klarna.svg";
import unlocked from "../../../assets/unlocked.svg";
import delivery from "../../../assets/delivery.svg";
import shield from "../../../assets/shield.svg";
import rRate from "../../../assets/r-rate.svg";
import animatedButterfly from "../../../assets/animated-butterfly.svg";
import love from "../../../assets/love.svg";
import visa from "../../../assets/visa.svg";
import master from "../../../assets/master.svg";
import americanExpress from "../../../assets/americanExpress.svg";
import applePay from "../../../assets/applePay.svg";
import paypal from "../../../assets/paypal.svg";
import discover from "../../../assets/discover.svg";
import happyCustomers from "../../../assets/happyCustomers.svg";
import { Handshake } from '@mui/icons-material';
import { toast } from 'react-toastify';





const ProductDetailPage = () => {
    const { parentId, productId } = useParams()
    const [allProducts, setAllProducts] = useState([])

    const [product, setProduct] = useState()

    const [lowestPrice, setLowestPrice] = useState()
    const [mostPopular, setMostPopular] = useState()

    const [selectedColor, setSelectedColor] = useState()
    const [selectedStorage, setSelectedStorage] = useState()
    const [selectedCondition, setSelectedCondition] = useState()

    const [availableConditions, setAvailableConditions] = useState([])
    const [availableColors, setAvailableColors] = useState([])
    const [availableStorages, setAvailableStorages] = useState([])

    const [scrollingDown, setScrollignDown] = useState(false)

    const [notifyTitle, setNotifyTitle] = useState("")

    // cart and set to cart 
    const { cart, setCart } = useContext(CartContext)
    const handleAddToCart = () => {
        if (product?.storage) {
            setCart(prev => [...prev, product?._id])

            toast("Product Added to cart")
        }
    }
    // style selected button 
    const selectedButton = {
        fontWeight: "normal",
        backgroundColor: "#259ff620"
    }

    // using scroll direction 
    const handleScroll = (event) => {
        const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail || -event.deltaY)));
        const direction = delta < 0 ? 'down' : 'up';


        if (direction === "down") {
            setScrollignDown(true)
        } else if (direction === "up") {
            setScrollignDown(false)
        }
    };

    useEffect(() => {
        axiosInstance.get(`/allSameParentProducts/${parentId}`)
            .then(res => {
                const products = res.data
                setAllProducts(products)

                // setting up product and product options 
                const selectedProduct = products.find((p) => p._id === productId)
                setProduct(selectedProduct)
                setSelectedColor(selectedProduct?.color)
                setSelectedStorage(selectedProduct?.storage)
                setSelectedCondition(selectedProduct?.condition)

                // Use reduce to find the object with the lowest and heighest value
                const minObject = products.reduce((min, current) => (current?.price < min?.price ? current : min), products[0]);
                setLowestPrice(minObject)

                const maxObject = products.reduce((min, current) => (current?.price > min?.price ? current : min), products[0]);
                setMostPopular(maxObject)


                const colors = new Set()
                const conditions = new Set()
                const storages = new Set()

                products.forEach(p => {
                    colors.add(p?.color.name + ":" + p?.color.value)
                    conditions.add(p?.condition)
                    storages.add(p?.storage)
                })

                const finalColors = Array.from(colors).map(str => {
                    const [name, value] = str.split(":")
                    return { name, value }
                })

                setAvailableColors(finalColors)
                setAvailableConditions(Array.from(conditions))
                setAvailableStorages(Array.from(storages))

            })
            .catch(error => {
                console.log(error)
            })

        // event listener to listen to window scroll 
        const scrollElement = document.querySelector("body");
        scrollElement.addEventListener('wheel', handleScroll);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            scrollElement.removeEventListener('wheel', handleScroll);
        };
    }, [productId])

    // this function to find proudct when select new option 
    const handleFilterButtonClick = (option, value) => {
        let color = selectedColor
        let condition = selectedCondition
        let storage = selectedStorage

        if (option == "condition") {
            setSelectedCondition(value);
            condition = value
        }
        else if (option == "color") {
            setSelectedColor(value);
            color = value
        }
        else if (option == "storage") {
            setSelectedStorage(value)
            storage = value
        }

        const newProduct = allProducts.find((p) => {
            return (p?.color.name == color?.name) && (p?.condition == condition) && (p?.storage == storage)
        })

        setProduct(newProduct)
    }

    const handleClickLowestPrice = () => {
        setProduct(lowestPrice)
        setSelectedColor(lowestPrice?.color)
        setSelectedStorage(lowestPrice?.storage)
        setSelectedCondition(lowestPrice?.condition)
    }

    const handleClickMostPopular = () => {
        setProduct(mostPopular)
        setSelectedColor(mostPopular?.color)
        setSelectedStorage(mostPopular?.storage)
        setSelectedCondition(mostPopular?.condition)
    }

    function getFutureDate(daysToAdd) {
        const today = new Date()
        const futureDate = new Date(today)

        futureDate.setDate(today.getDate() + daysToAdd)

        const options = { month: "short", day: "numeric" }
        const formattedDate = futureDate.toLocaleDateString('en-US', options);

        return formattedDate
    }


    // handle notification hide and show button 
    const handleHideButton = (event) => {
        event.stopPropagation()
        console.log("button clicked")
        document.getElementById("hide-show-toggle").classList.toggle("hidden")

        document.getElementById("left-slider").classList.toggle("hidden")

    }

    return (
        <section className='singleProductPage'>

            <div id='top-add-to-cart' style={scrollingDown ? { top: 0 } : { top: "-100px" }}>
                <div className='top-cart-product-info'>
                    <img src={product?.image} alt="" />
                    <h1>{product?.productName} • {product?.storage} • {product?.color?.name}</h1>
                </div>

                <div className='top-cart-info'>
                    <p>${product?.price}</p>
                    <button
                        onClick={handleAddToCart}
                        disabled={!product?.image}
                        className='btn-add-cart-sticky'
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            <nav className='breadcrumb container-max'>
                <span><Link to="/">Home</Link></span>
                <span> {">"} </span>
                <span><Link to="/preowned">Pre-owned</Link></span>
                <span> {">"} </span>
                <span><Link to="" className='currentPage'>{product?.productName}</Link></span>
            </nav>

            <div className='productSection'>
                <div className='productImg'>
                    <img src={product?.image ? product.image : "/staticImages/notAvailable.webp"} alt='product image' />
                </div>

                <div className='options'>

                    <div className='butterfly-suggestion'>
                        <Link to="#why-better">
                            <img src={animatedButterfly} alt="animated butterfly" />

                            <span>Our vision</span>
                        </Link>
                    </div>

                    <div className='name-price'>
                        <h1>{product?.productName}</h1>
                        <p className="price-tag">${product?.price}</p>
                    </div>

                    <div className='selection-group'>
                        <div className="selection-label">Best Picks</div>
                        <div className='pill-buttons'>
                            <button
                                className={`pill-button ${product == lowestPrice ? 'selected' : ''}`}
                                onClick={handleClickLowestPrice}
                            >
                                Lowest Price (${lowestPrice?.price})
                            </button>

                            <button
                                className={`pill-button ${product == mostPopular ? 'selected' : ''}`}
                                onClick={handleClickMostPopular}
                            >
                                Most Popular (${mostPopular?.price})
                            </button>
                        </div>
                    </div>

                    <div className='selection-group'>
                        <div className="selection-label">Condition <span className="learn-more" onClick={(e) => { handleHideButton(e); setNotifyTitle("Conditions") }}>Learn more</span></div>
                        <div className='pill-buttons'>
                            {availableConditions.map(condition => (
                                <button
                                    key={condition}
                                    className={`pill-button ${selectedCondition === condition ? 'selected' : ''}`}
                                    onClick={() => { handleFilterButtonClick("condition", condition) }}
                                >
                                    {condition}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='selection-group'>
                        <div className="selection-label">Storage</div>
                        <div className='pill-buttons'>
                            {availableStorages.map(storage => (
                                <button
                                    key={storage}
                                    className={`pill-button ${selectedStorage === storage ? 'selected' : ''}`}
                                    onClick={() => { handleFilterButtonClick("storage", storage) }}
                                >
                                    {storage}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='selection-group'>
                        <div className="selection-label">Color</div>
                        <div className='pill-buttons'>
                            {availableColors.map(color => (
                                <button
                                    className={`pill-button color-swatch-button ${selectedColor?.name === color?.name ? 'selected' : ''}`}
                                    key={color.name}
                                    onClick={() => { handleFilterButtonClick("color", color) }}
                                >
                                    <div className="color-circle" style={{ backgroundColor: color?.value }}></div>
                                    {color.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="trust-signals">
                        <div className="trust-signal">
                            <img src={delivery} alt="delivery" />
                            <div className="trust-signal-text">
                                <span className="trust-signal-title">Free Delivery</span>
                                <span className="trust-signal-sub">by {getFutureDate(5)}</span>
                            </div>
                        </div>
                        <div className="trust-signal">
                            <img src={shield} alt="warranty" />
                            <div className="trust-signal-text">
                                <span className="trust-signal-title">30-Day Warranty</span>
                                <span className="trust-signal-sub">Hassle-free returns</span>
                            </div>
                        </div>
                        <div className="trust-signal">
                            <img src={unlocked} alt="unlocked" />
                            <div className="trust-signal-text">
                                <span className="trust-signal-title">Unlocked</span>
                                <span className="trust-signal-sub">All carriers</span>
                            </div>
                        </div>
                        <div className="trust-signal">
                            <img src={rRate} alt="verified" />
                            <div className="trust-signal-text">
                                <span className="trust-signal-title">Verified Quality</span>
                                <span className="trust-signal-sub">Certified Refurbished</span>
                            </div>
                        </div>
                    </div>

                    <div className='cart-div'>
                        <button
                            onClick={handleAddToCart}
                            disabled={!product?.image}
                            className='btn-details'
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className='info-buttons'>
                        <button onClick={(e) => { handleHideButton(e); setNotifyTitle("Technical specification") }}>
                            <span>Technical specification</span>
                            <span className="arrow">{">"}</span>
                        </button>
                        <button onClick={(e) => { handleHideButton(e); setNotifyTitle("Perks & benefits") }}>
                            <span>Perks & benefits included</span>
                            <span className="arrow">{">"}</span>
                        </button>
                        <button onClick={(e) => { handleHideButton(e); setNotifyTitle("Frequently asked questions") }}>
                            <span>Frequently asked questions</span>
                            <span className="arrow">{">"}</span>
                        </button>
                    </div>

                    <div className='comes-with'>
                        <p>Comes with</p>

                        <span>
                            <img src={love} alt="love svg" />
                            Good Karma
                        </span>
                        <span>
                            <img src={delivery} alt="love svg" />
                            Fast delivery
                        </span>
                    </div>

                    <div className='info-buttons'>
                        <button onClick={(e) => { handleHideButton(e); setNotifyTitle("Technical specification") }}>
                            <span>Technical specification</span>
                            <span>{">"}</span>
                        </button>
                        <button onClick={(e) => { handleHideButton(e); setNotifyTitle("Perks & benefits") }}>
                            <span>Perks & benefits included</span>
                            <span>{">"}</span>
                        </button>
                        <button onClick={(e) => { handleHideButton(e); setNotifyTitle("Frequently asked questions") }}>
                            <span>Frequently asked questions</span>
                            <span>{">"}</span>
                        </button>
                    </div>

                    <div className='customer-and-payment-info'>
                        <div className='quality-assurance'>
                            <img src={happyCustomers} alt="happyCustomers icon" />
                            <div>
                                <p>Quality checked and sold by <Link to={"/"}>Global traders</Link></p>
                                <p className='small-font'>Trusted seller and optimzie customer satisfaction</p>
                            </div>
                        </div>

                        <div className='payment-accepts'>
                            <p className='small-font'>Accepts</p>
                            <div>
                                <img src={visa} alt="visa card" />
                                <img src={master} alt="master card" />
                                <img src={discover} alt="discover card" />
                                <img src={americanExpress} alt="americalExpress card" />
                                <img src={paypal} alt="paypal card" />
                                <img src={applePay} alt="applePay card" />
                                <img src={klarna} alt="klarna card" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className='offer-products'>
                <OfferProducts></OfferProducts>
            </div>

            <div className='advices container-max' id='why-better'>
                <h2 className="vision-title">Our Vision</h2>
                <div className="vision-grid">
                    <div className="vision-card">
                        <svg xmlns="http://www.w3.org/2000/svg" className="vision-icon" viewBox="0 0 16 16">
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5c0 .501-.164.396-.415.235C6.42 6.629 6.218 6.5 6 6.5c-.218 0-.42.13-.585.235C5.164 6.896 5 7 5 6.5 5 5.672 5.448 5 6 5s1 .672 1 1.5m5.331 3a1 1 0 0 1 0 1A4.998 4.998 0 0 1 8 13a4.998 4.998 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5m-1.746-2.765C10.42 6.629 10.218 6.5 10 6.5c-.218 0-.42.13-.585.235C9.164 6.896 9 7 9 6.5c0-.828.448-1.5 1-1.5s1 .672 1 1.5c0 .501-.164.396-.415.235z" />
                        </svg>
                        <h4 className="vision-header">Customers First</h4>
                        <p className="vision-text">We are customer focused and continuously measure against our customer’s success.</p>
                    </div>

                    <div className="vision-card">
                        <svg xmlns="http://www.w3.org/2000/svg" className="vision-icon" viewBox="0 0 16 16">
                            <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242-2.532-4.431zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24l2.552-4.467zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.498.498 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244l-1.716-3.004z" />
                        </svg>
                        <h4 className="vision-header">Think Sustainably</h4>
                        <p className="vision-text">Make environmentally sustainable decisions that last for generations through recycling or trading.</p>
                    </div>

                    <div className="vision-card">
                        <svg xmlns="http://www.w3.org/2000/svg" className="vision-icon" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 14.933a.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                        </svg>
                        <h4 className="vision-header">Earn Trust</h4>
                        <p className="vision-text">Be honest and transparent through every interaction with customers and partners.</p>
                    </div>
                </div>
            </div>

            <div id='mobile-add-to-cart'>
                <div className='top-cart-info'>
                    <p>
                        <span>Special price: </span>${product?.price}
                    </p>
                    <button
                        onClick={handleAddToCart}
                        disabled={product?.image ? false : true}
                        className='add-to-cart-btn'
                    >
                        Add to cart
                    </button>
                </div>
            </div>

            <LeftSlider product={product} notifyTitle={notifyTitle} handleHideButton={handleHideButton}></LeftSlider>
        </section>
    );
};

export default ProductDetailPage;