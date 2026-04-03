import allDummyProducts, { getProductById } from "./dummyData";

const KEYS = {
    user: "upcell_user",
    orders: "upcell_orders",
};

const readJson = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.error(`Failed to parse local storage key: ${key}`, error);
        return fallback;
    }
};

const writeJson = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getStoredUser = () => readJson(KEYS.user, null);

export const setStoredUser = (user) => {
    if (user) writeJson(KEYS.user, user);
    else localStorage.removeItem(KEYS.user);
};

export const getStoredOrders = () => readJson(KEYS.orders, []);

export const saveOrder = (order) => {
    const orders = getStoredOrders();
    const nextOrders = [order, ...orders];
    writeJson(KEYS.orders, nextOrders);
    return order;
};

export const getOrderById = (orderId) => getStoredOrders().find((order) => order._id === orderId) || null;

export const buildLineItemsFromCart = (productIds, shipping = "standard") => {
    const uniqueProductIds = [...new Set(productIds)];

    const productLineItems = uniqueProductIds
        .map((productId) => {
            const product = getProductById(productId);
            const quantity = productIds.filter((id) => id === productId).length;

            if (!product || quantity === 0) return null;

            return {
                quantity,
                price_data: {
                    currency: "USD",
                    unit_amount: product.price * 100,
                    product_data: {
                        name: product.productName,
                        description: `${product.color?.name || "Standard"} ${product.storage || ""}`.trim(),
                        images: [product.image],
                        metadata: {
                            productId: product._id,
                            quantity,
                            totalPaid: product.price * quantity,
                        },
                    },
                },
            };
        })
        .filter(Boolean);

    const shippingPrice = shipping === "priority" ? 10.5 : 0;
    const shippingLineItem = {
        quantity: 1,
        price_data: {
            currency: "USD",
            unit_amount: Math.round(shippingPrice * 100),
            product_data: {
                name: shipping === "priority" ? "Priority shipping" : "Standard shipping",
                description: shipping === "priority" ? "2-3 business days" : "5-7 business days",
                images: [],
                metadata: {
                    quantity: 1,
                    totalPaid: shippingPrice,
                },
            },
        },
    };

    return [...productLineItems, shippingLineItem];
};

export const createLocalOrder = ({ customer, productIds, shipping, paymentMethod }) => {
    const createdAt = new Date().toISOString();
    const orderId = `UC-${Date.now().toString(36).toUpperCase()}`;
    const line_items = buildLineItemsFromCart(productIds, shipping);

    const order = {
        _id: orderId,
        line_items,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        postal: customer.postal,
        street: customer.street,
        country: customer.country,
        shipping,
        paid: true,
        status: "Processing",
        paidWith: paymentMethod === "paypal" ? "PayPal" : "Card",
        createdAt,
        updatedAt: createdAt,
    };

    return saveOrder(order);
};

export const getLocalCartProducts = (cartIds) => {
    const uniqueIds = [...new Set(cartIds)];

    return uniqueIds
        .map((id) => getProductById(id))
        .filter(Boolean);
};

export const getFeaturedFallbackOrders = (email) => {
    const now = new Date().toISOString();
    const demoProducts = allDummyProducts.slice(0, 2);

    return [
        {
            _id: "UC-DEMO-ORDER",
            line_items: demoProducts.map((product) => ({
                quantity: 1,
                price_data: {
                    currency: "USD",
                    unit_amount: product.price * 100,
                    product_data: {
                        name: product.productName,
                        description: `${product.color?.name || "Standard"} ${product.storage || ""}`.trim(),
                        images: [product.image],
                        metadata: {
                            productId: product._id,
                            quantity: 1,
                            totalPaid: product.price,
                        },
                    },
                },
            })),
            name: "Local Demo User",
            email,
            phone: "+1 555-0100",
            city: "New York",
            postal: "10001",
            street: "123 UpCell Ave",
            country: "United States",
            shipping: "standard",
            paid: true,
            status: "Delivered",
            paidWith: "Card",
            createdAt: now,
            updatedAt: now,
        },
    ];
};
