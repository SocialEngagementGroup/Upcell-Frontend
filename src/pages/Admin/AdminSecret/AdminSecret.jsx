import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminSecret = () => {
    return (
        <div>
            <nav>
                <Link to=""> Admin home</Link>
                <Link to="catagory"> catagory</Link>
                <Link to="products">All products</Link>
                <Link to="addproduct"> Add product</Link>
                <Link to="orders">All orders</Link>
            </nav>

            <Outlet></Outlet>

        </div>
    );
};

export default AdminSecret;