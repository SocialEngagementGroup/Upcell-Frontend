import React from 'react'
import { styled } from 'styled-components'

const ImgePrevDiv = styled.div`
  border: 2px solid red;
  display: inline-block;
  position: relative;

  img{
    width: 100px;
    display: inline-flex;
  }

  button{
    position: absolute;
    bottom: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: none;
    color: red;

    background: black;
    padding: 5px;
    border-radius: 5px;
  }

  &:hover button{
    display: block;
  }

`

const ImagesForCatagory = ({ image, setImages }) => {

  function handleDeleteFromFirebase(im) {
    // Firebase Storage has been removed.
    // Implement your new storage deletion logic (e.g. S3, local, etc) here.
    alert("Storage deletion logic has been removed. Please implement your new storage provider.");
    
    // For now, just remove it from the UI state
    setImages(prev => prev.filter(item => item.url !== im.url))
  }


  return (
    <ImgePrevDiv>
      <button onClick={() => handleDeleteFromFirebase(image)}> Delete </button>
      <img src={image?.url} alt='product image' />
    </ImgePrevDiv>
  )
}

export default ImagesForCatagory