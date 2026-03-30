import SingleCatagory from '../AdminSingleCatagory/SingleCatagory.jsx'
import axiosInstance from '../../../../utilities/axiosInstance.js'

import "./Catagory.css"

import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'


const AllCatagories = () => {
  const [allCatagories, setAllCatagories] = useState([])
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    axiosInstance.get("catagory").then(result => setAllCatagories(result.data))
  }, [, update])

  return (
    <div>

      <Outlet></Outlet>

      {allCatagories.map(catagory => {
        return <SingleCatagory key={catagory._id} catagory={catagory} setUpdate={setUpdate}></SingleCatagory>
      })}

    </div>
  )
}

export default AllCatagories