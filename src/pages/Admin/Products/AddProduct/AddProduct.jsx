import { useEffect, useState } from 'react';
import ProductForm from '../../../../components/ProductForm/ProductForm';
import axiosInstance from '../../../../utilities/axiosInstance';
import ImageToSelect from '../../../../components/ImageToSelect/ImageToSelect';
import { toast } from 'react-toastify';

const AddProduct = () => {
    const [allCatagories, setCatagories] = useState([]);
    const [product, setProduct] = useState({ parentCatagory: "", productName: "", image: "", description: "", storage: "", price: "", discountPrice: "", originalPrice: "", reviewScore: "", peopleReviewed: "", condition: "", color: { name: "", value: "" } });
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState();

    useEffect(() => {
        axiosInstance.get("catagory")
            .then((result) => setCatagories(result.data))
            .catch((error) => console.log(error));
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const productN = product.parentCatagory ? allCatagories.find((c) => c._id == product.parentCatagory)?.modelName ?? "" : "";
        const payload = { ...product, image: selectedImage, productName: productN };

        axiosInstance.post("product", payload)
            .then(() => {
                setProduct({ parentCatagory: "", productName: "", image: "", description: "", storage: "", price: "", discountPrice: "", originalPrice: "", reviewScore: "", peopleReviewed: "", condition: "", color: { name: "", value: "" } });
                setSelectedImage("");
                toast("product added !");
            })
            .catch(() => alert("error happened !!"));
    }

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Add Product</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Create a new product listing.</h1>
            </div>

            <div className="admin-panel rounded-[36px] p-8">
                <div className="mb-6 flex flex-wrap gap-3">
                    {images.map((image, index) => (
                        <ImageToSelect key={index} setSelectedImage={setSelectedImage} selectedImage={selectedImage} ImgUrl={image?.url} />
                    ))}
                </div>
                <ProductForm selectedImage={selectedImage} setSelectedImage={setSelectedImage} setImages={setImages} allCatagories={allCatagories} handleSubmit={handleSubmit} product={product} setProduct={setProduct} />
            </div>
        </section>
    );
};

export default AddProduct;
