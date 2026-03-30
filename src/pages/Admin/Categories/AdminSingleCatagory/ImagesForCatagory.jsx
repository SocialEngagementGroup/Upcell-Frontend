import React from 'react'
import { styled } from 'styled-components'

import { ref, deleteObject } from "firebase/storage";
import { storage } from '../../../../utilities/firebaseConfig';


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
    const delRef = ref(storage, im?.filename)

    deleteObject(delRef)
      .then(() => {
        alert("deleted the image")
        setImages(prev => prev.filter(item => item.filename !== im.filename))
      })
      .catch(error => {

        const doNotExist = error.message.includes("(storage/object-not-found)")
        if(doNotExist){
          setImages(prev => prev.filter(item => item.filename !== im.filename))
        }
      })

  }


  return (
    <ImgePrevDiv>
      <button onClick={() => handleDeleteFromFirebase(image)}> Delete </button>
      <img src={image?.url} alt='product image' />
    </ImgePrevDiv>
  )
}

export default ImagesForCatagory