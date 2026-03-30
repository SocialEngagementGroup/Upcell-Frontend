import { useEffect, useState } from 'react';
import "./AllProduct.css"
import axiosInstance from '../../../../utilities/axiosInstance';
import SingleProductForAdmin from '../../../../components/SingleProduct/SingleProductForAdmin';

const AllProduct = () => {
    const [allProduct, setAllProduct] = useState([])

    useEffect(()=>{
        axiosInstance.get("product").then(res =>setAllProduct(res.data)).catch(error => console.log(error))

    }, [])
    return (
        <div className='admin-all-product'>
            {allProduct.map(product =>{
                return <SingleProductForAdmin key={product?._id} product={product} setAllProduct={setAllProduct}></SingleProductForAdmin>
            })}
        </div>
    );
};

export default AllProduct;