"use client"
import React, { createElement, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import axiosInstance from '../../../../utilities/axiosInstance'
import { storage } from '../../../../utilities/firebaseConfig'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import ImagesForCatagory from '../AdminSingleCatagory/ImagesForCatagory'


const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  gap: 1rem;
  margin-top: 1rem;

  input{
    border: 1px solid;
    border-radius: 5px;
    padding: 5px;
    padding-left: 1rem;
  }

  button{
    color: white;
    background: black;
    border-radius: 5px;
  }
`

const StyledBtn = styled.button`
  background: black;
  color: white;
  padding: 5px;
  border-radius: 5px;
  display: block;
  margin: auto;
`

const AddCatagory = () => {

  const [images, setImages] = useState([])
  const [porgressPercent, setProgressPercent] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const modelName = e.target.productModel.value
    const description = e.target.description.value

    axiosInstance.post("catagory", { modelName, description, images })
    .then(result => { 
      console.log(result);
      e.target.productModel.value = ""; 
      e.target.description.value = "";
      setImages([])
    }
    ).catch(error => console.log("error ***: ", error))
  }



  const handleAddImage = (e) => {
    const input = document.createElement("input")
    input.type = "file"
    input.click()

    input.onchange = e => {
      let file = e.target.files[0];
      console.log(file)
      if (!file) return;

      const filename = `files/${file.name}`

      const storageRef = ref(storage, filename )
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on("state_changed", (snapshot) => {
        const porgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgressPercent(porgress)
      },
        (error) => {
          alert(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(getDownloadURL => {
            setImages(prev => [...prev, {url: getDownloadURL, filename}])
          })
        })
    }

  }



  return (
    <div className='pt-5'>
      <h3 style={{ textAlign: "center", paddingBottom: "10px", fontWeight: "bold" }}>Add catagores</h3>

      {images.map((image, ind) => {
        return <ImagesForCatagory key={ind} setImages={setImages} image={image}></ImagesForCatagory>
      })}


      <p style={{textAlign:"center"}}>progress percent is {porgressPercent}</p>
      <StyledBtn onClick={handleAddImage}>Add Image</StyledBtn>

      <StyledForm onSubmit={handleSubmit}>
        <input name="productModel" type='text' placeholder='product model name' required />
        <input name="description" type="text" placeholder='product description(optional)' />
        <button type="submit"> submit </button>
      </StyledForm>
    </div>
  )
}

export default AddCatagory