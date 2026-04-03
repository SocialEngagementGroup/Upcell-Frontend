import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../utilities/axiosInstance';
import ProductForm from '../../../../components/ProductForm/ProductForm';
import ImageToSelect from '../../../../components/ImageToSelect/ImageToSelect';

const EditProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [allCatagories, setAllCatagories] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState();

    useEffect(() => {
        axiosInstance.get("catagory")
            .then((result) => {
                setAllCatagories(result.data);
                const allCat = result.data;
                axiosInstance.get(`product/${params.id}`)
                    .then((res) => {
                        setProduct(res.data);
                        const prod = res.data;
                        const imgs = allCat.find((c) => c._id === prod.parentCatagory)?.images || [];
                        setImages(imgs);
                        setSelectedImage(prod.image);
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
    }, [params.id]);

    function handleSubmit(e) {
        e.preventDefault();
        const updatedProduct = { ...product, image: selectedImage };
        let productN = "";
        if (updatedProduct.parentCatagory) {
            productN = allCatagories.find((c) => c._id == updatedProduct.parentCatagory)?.modelName;
        }
        updatedProduct.productName = productN;

        axiosInstance.patch(`product/${updatedProduct._id}`, updatedProduct)
            .then(() => {
                if (window.confirm("Updated. Go back to all product?")) {
                    navigate("/admin-secret/products");
                }
            })
            .catch(() => alert("error happened !!"));
    }

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Edit Product</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Refine an existing product listing.</h1>
            </div>

            <div className="admin-panel rounded-[36px] p-8">
                <div className="mb-6 flex flex-wrap gap-3">
                    {images && images.map((image, index) => (
                        <ImageToSelect key={index} setSelectedImage={setSelectedImage} selectedImage={selectedImage} ImgUrl={image?.url} />
                    ))}
                </div>
                <ProductForm selectedImage={selectedImage} setSelectedImage={setSelectedImage} setImages={setImages} allCatagories={allCatagories} handleSubmit={handleSubmit} product={product} setProduct={setProduct} />
            </div>
        </section>
    );
};

export default EditProduct;
