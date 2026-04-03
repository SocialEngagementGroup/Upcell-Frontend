import { useEffect, useState } from 'react';
import axiosInstance from '../../../../utilities/axiosInstance';
import SingleProductForAdmin from '../../../../components/SingleProduct/SingleProductForAdmin';

const AllProduct = () => {
    const [allProduct, setAllProduct] = useState([]);

    useEffect(() => {
        axiosInstance.get('product').then((res) => setAllProduct(res.data)).catch((error) => console.log(error));
    }, []);

    return (
        <section className="space-y-6">
            <div className="admin-panel rounded-[36px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10">
                <span className="eyebrow mb-5">Products</span>
                <h1 className="text-[clamp(2rem,3.8vw,3.6rem)] leading-[0.94]">Manage product inventory.</h1>
                <p className="mt-4 text-base leading-8 text-ink-soft">Review every listing, then edit or remove products without leaving the dashboard.</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                {allProduct.map((product) => (
                    <SingleProductForAdmin key={product?._id} product={product} setAllProduct={setAllProduct} />
                ))}
            </div>
        </section>
    );
};

export default AllProduct;
