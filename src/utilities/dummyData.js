// Centralized Dummy Product Data for UpCell Store
// Includes multiple variations per parentId to support Color/Storage filters on the detail page

const allDummyProducts = [
    // --- iPhone 15 Pro Max ---
    {
        _id: "p1",
        parentId: "iphone-15-pro-max",
        category: "IPHONE",
        productName: "iPhone 15 Pro Max",
        price: 1199,
        image: "https://via.placeholder.com/600x700?text=iPhone+15+Pro+Max+Titanium",
        color: { name: "Natural Titanium", value: "#A7A5A0" },
        storage: "256GB"
    },
    {
        _id: "p1-v2",
        parentId: "iphone-15-pro-max",
        category: "IPHONE",
        productName: "iPhone 15 Pro Max",
        price: 1399,
        image: "https://via.placeholder.com/600x700?text=iPhone+15+Pro+Max+Titanium",
        color: { name: "Natural Titanium", value: "#A7A5A0" },
        storage: "512GB"
    },
    {
        _id: "p1-v3",
        parentId: "iphone-15-pro-max",
        category: "IPHONE",
        productName: "iPhone 15 Pro Max",
        price: 1199,
        image: "https://via.placeholder.com/600x700?text=iPhone+15+Pro+Max+Blue",
        color: { name: "Blue Titanium", value: "#5B6370" },
        storage: "256GB"
    },

    // --- iPhone 15 Pro ---
    {
        _id: "p2",
        parentId: "iphone-15-pro",
        category: "IPHONE",
        productName: "iPhone 15 Pro",
        price: 999,
        image: "https://via.placeholder.com/600x700?text=iPhone+15+Pro+Black",
        color: { name: "Black Titanium", value: "#3B3D3F" },
        storage: "128GB"
    },
    {
        _id: "p2-v2",
        parentId: "iphone-15-pro",
        category: "IPHONE",
        productName: "iPhone 15 Pro",
        price: 1099,
        image: "https://via.placeholder.com/600x700?text=iPhone+15+Pro+Black",
        color: { name: "Black Titanium", value: "#3B3D3F" },
        storage: "256GB"
    },

    // --- iPhone 15 ---
    {
        _id: "p3",
        parentId: "iphone-15",
        category: "IPHONE",
        productName: "iPhone 15",
        price: 799,
        image: "https://via.placeholder.com/600x700?text=iPhone+15+Pink",
        color: { name: "Pink", value: "#E7C5C9" },
        storage: "128GB"
    },

    // --- iPhone 14 Pro ---
    {
        _id: "p4",
        parentId: "iphone-14-pro",
        category: "IPHONE",
        productName: "iPhone 14 Pro",
        price: 899,
        image: "https://via.placeholder.com/600x700?text=iPhone+14+Pro+Deep+Purple",
        color: { name: "Deep Purple", value: "#594F61" },
        storage: "128GB"
    },

    // --- MacBook Pro 14" M3 ---
    {
        _id: "p8",
        parentId: "macbook-pro-14",
        category: "MACBOOK",
        productName: "MacBook Pro 14\" M3",
        price: 1599,
        image: "https://via.placeholder.com/600x700?text=MacBook+Pro+14+Space+Gray",
        color: { name: "Space Gray", value: "#5E5F61" },
        storage: "512GB"
    },
    {
        _id: "p8-v2",
        parentId: "macbook-pro-14",
        category: "MACBOOK",
        productName: "MacBook Pro 14\" M3",
        price: 1799,
        image: "https://via.placeholder.com/600x700?text=MacBook+Pro+14+Space+Gray",
        color: { name: "Space Gray", value: "#5E5F61" },
        storage: "1TB"
    },

    // --- MacBook Air 15" M2 ---
    {
        _id: "p9",
        parentId: "macbook-air-15",
        category: "MACBOOK",
        productName: "MacBook Air 15\" M2",
        price: 1299,
        image: "https://via.placeholder.com/600x700?text=MacBook+Air+15+Midnight",
        color: { name: "Midnight", value: "#2E3641" },
        storage: "256GB"
    },

    // --- iPad Pro 12.9" M2 ---
    {
        _id: "p12",
        parentId: "ipad-pro-12",
        category: "IPAD",
        productName: "iPad Pro 12.9\" M2",
        price: 1099,
        image: "https://via.placeholder.com/600x700?text=iPad+Pro+12.9+Silver",
        color: { name: "Silver", value: "#E3E5E6" },
        storage: "128GB"
    },
    {
        _id: "p12-v2",
        parentId: "ipad-pro-12",
        category: "IPAD",
        productName: "iPad Pro 12.9\" M2",
        price: 1199,
        image: "https://via.placeholder.com/600x700?text=iPad+Pro+12.9+Silver",
        color: { name: "Silver", value: "#E3E5E6" },
        storage: "256GB"
    },

    // --- iPad Air 5th Gen ---
    {
        _id: "p14",
        parentId: "ipad-air",
        category: "IPAD",
        productName: "iPad Air 5th Gen",
        price: 599,
        image: "https://via.placeholder.com/600x700?text=iPad+Air+Blue",
        color: { name: "Blue", value: "#99B2CA" },
        storage: "64GB"
    },

    // --- Apple Watch Ultra 2 ---
    {
        _id: "p17",
        parentId: "watch-ultra",
        category: "WATCH",
        productName: "Apple Watch Ultra 2",
        price: 799,
        image: "https://via.placeholder.com/600x700?text=Watch+Ultra+2",
        color: { name: "Titanium", value: "#D1D1D1" },
        storage: "GPS + Cellular"
    }
];

export default allDummyProducts;
export const getProductsByParentId = (parentId) => allDummyProducts.filter(p => p.parentId === parentId);
export const getProductById = (id) => allDummyProducts.find(p => p._id === id);
