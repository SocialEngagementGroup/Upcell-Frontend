import React, { useState } from 'react'
import { styled } from 'styled-components'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"

import axiosInstance from "../../../../utilities/axiosInstance"
import { storage } from '../../../../utilities/firebaseConfig'

import ImagesForCatagory from './ImagesForCatagory'

const StyeldDiv = styled.div`
  border-bottom: 1px solid black;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem;
  max-width: 700px;
  margin: auto;

  span button{
    background: black;
    color: white;
    padding: 5px;
    border-radius: 5px;
    margin: 5px;
  }

  div{
    grid-column: 1/ span 2;
  }

`

const StyledForm = styled.form`
  width: 100%;
  grid-column: span 2;
  margin:3rem 0;
  display: block;

  input{
    border: 1px solid;
    border-radius: 5px;
    padding: 5px;
    padding-left: 1rem;
    margin-right: 1rem;
  }

  button {
    background: black;
    color: white;
    padding: 5px;
  }
`

const StyledBtn = styled.button`
  color: black;
  background: #7CFFBB;
  padding: 5px;
  border-radius: 5px;
  display: block;
`

const SingleCatagory = ({ catagory, setUpdate }) => {
  const [editClicked, setEditClicked] = useState(false)
  const [porgressPercent, setProgressPercent] = useState(0)
  const [images, setImages] = useState(catagory.images || [])


  const handleAddImage = (e) => {
    const input = document.createElement("input")
    input.type = "file"
    input.click()

    input.onchange = e => {
      let file = e.target.files[0];
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


  function clicked() {
    setEditClicked(prev => !prev)
  }

  function handleSubmit(e) {
    e.preventDefault()

    axiosInstance.patch(`catagory/${catagory._id}`, {
      modelName: e.target.productModel.value,
      description: e.target.description.value,
      images

    }).then(res => {
      setUpdate(prev => !prev)
      clicked()
    }).catch(error => console.log(error))
  }

  function handleDelete() {
    let confirmaiton = confirm("are you sure, want to delete this catagory ?")
    if (confirmaiton) {
      axiosInstance.delete(`catagory/${catagory._id}`)
        .then(res => setUpdate(prev => !prev))
        .catch(error => console.log(error))
    }
  }
  return (
    <StyeldDiv>
      <big>{catagory?.modelName}</big>

      <span>
        <button onClick={clicked}>{editClicked ? "close" : "edit"}  </button>
        <button onClick={handleDelete}> delete</button>
      </span>

      {!editClicked ? "" :
        <div>
          {images.map((image, ind) =>
            <ImagesForCatagory image={image} setImages={setImages} key={ind}></ImagesForCatagory>
          )}

          <StyledBtn onClick={handleAddImage}> Add image</StyledBtn>

          <StyledForm onSubmit={handleSubmit}>
            <input name="productModel" type='text' placeholder='updated model name' required />
            <input name="description" type="text" placeholder='updatedd description' />
            <button type="submit"> submit </button>
          </StyledForm>
        </div>

      }

    </StyeldDiv>
  )
}

export default SingleCatagory