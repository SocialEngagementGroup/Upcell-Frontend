import React, { useEffect, useState } from 'react';
import "./EditProduct.css"

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../utilities/axiosInstance';
import styled from 'styled-components';
import ProductForm from '../../../../components/ProductForm/ProductForm';
import ImageToSelect from '../../../../components/ImageToSelect/ImageToSelect';

const StyledDiv = styled.div`
  margin: 1rem;

  h3{
    text-align: center;
    font-size: 1.5rem;
  }
`

const ImagesHolder = styled.div`
  display: flex;
  justify-content: center;
`



const EditProduct = () => {
    const params = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState({})
    const [allCatagories, setAllCatagories] = useState([])


    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState()


    useEffect(() => {
        axiosInstance.get("catagory")
            .then(result => {
                setAllCatagories(result.data)

                const allCat = result.data
                // here we do one calculation with allCatagories , so both request might have a race condition 
                // thats why one request in another , then after finish, do the calculation
                axiosInstance.get(`product/${params.id}`)
                    .then(res => {
                        setProduct(res.data)

                        const prod = res.data

                        const imgs = allCat.find(c => c._id === prod.parentCatagory).images
                        setImages(imgs)
                        setSelectedImage(prod.image)
                    })
                    .catch(error => console.log(error))

            })
            .catch(error => console.log(error))
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        product.image = selectedImage

        let productN = ""
        if (product.parentCatagory) {
            productN = allCatagories.find(c => c._id == product.parentCatagory)?.modelName
        }

        product.productName = productN

        axiosInstance.patch(`product/${product._id}`, product)
            .then(res => {
                if(window.confirm("updated ! go back to all product ?")){
                    navigate("/admin-secret/products")
                }


            })
            .catch(error => alert("error happened !!"))
    }

    return (
        <StyledDiv>
            <h3>Add a product</h3>

            <ImagesHolder>
                {images && images.map((image, ind) => {
                    return <ImageToSelect key={ind} setSelectedImage={setSelectedImage} selectedImage={selectedImage} ImgUrl={image?.url}></ImageToSelect>
                })}
            </ImagesHolder>

            <ProductForm setSelectedImage={setSelectedImage} setImages={setImages} allCatagories={allCatagories} handleSubmit={handleSubmit} product={product} setProduct={setProduct} />

        </StyledDiv >
    )
};

export default EditProduct;