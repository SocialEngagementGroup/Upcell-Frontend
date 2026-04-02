import { useEffect, useState } from 'react'

import "./AddProduct.css"

import ProductForm from '../../../../components/ProductForm/ProductForm'
import axiosInstance from '../../../../utilities/axiosInstance'

import { styled } from 'styled-components'
import ImageToSelect from '../../../../components/ImageToSelect/ImageToSelect'
import { toast } from 'react-toastify'

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

const AddProduct = () => {
    const [allCatagories, setCatagories] = useState([])
    const [product, setProduct] = useState({ parentCatagory: "", productName: "", image: "", description: "", storage: "", price: "", discountPrice: "", originalPrice: "", reviewScore: "", peopleReviewed: "", condition: "", color: { name: "", value: "" } })

    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState()


    useEffect(() => {
        axiosInstance.get("catagory")
            .then(result => setCatagories(result.data))
            .catch(error => console.log(error))
    }, [])

    function handleSubmit(e) {
        e.preventDefault()

        const productN = product.parentCatagory
            ? allCatagories.find(c => c._id == product.parentCatagory)?.modelName ?? ""
            : ""

        const payload = { ...product, image: selectedImage, productName: productN }

        axiosInstance.post("product", payload)
            .then(res => {
                setProduct({ parentCatagory: "", productName: "", image: "", description: "", storage: "", price: "", discountPrice: "", originalPrice: "", reviewScore: "", peopleReviewed: "", condition: "", color: { name: "", value: "" } })
                setSelectedImage("")
                toast("product added !")
            })
            .catch(error => alert("error happened !!"))
    }

    return (
        <StyledDiv>
            <h3>Add a product</h3>

            <ImagesHolder>
                {images.map((image, ind) => {
                    return <ImageToSelect key={ind} setSelectedImage={setSelectedImage} selectedImage={selectedImage} ImgUrl={image?.url}></ImageToSelect>
                })}
            </ImagesHolder>

            <ProductForm setSelectedImage={setSelectedImage} setImages={setImages} allCatagories={allCatagories} handleSubmit={handleSubmit} product={product} setProduct={setProduct} />

        </StyledDiv >
    )
}

export default AddProduct;