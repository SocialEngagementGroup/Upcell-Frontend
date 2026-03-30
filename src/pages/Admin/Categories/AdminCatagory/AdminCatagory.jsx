import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import "./AdminCatagory.css"

const AdminCatagory = () => {
    return (
        <>
            <div className='catagory-link'>
                <Link to="">All catagories</Link>
                <Link to="addcatagory">Add catagories</Link>
            </div>
            <Outlet></Outlet>
        </>
    );
};

export default AdminCatagory;