import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// React Icons
import { FaBox } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { BiCategoryAlt } from "react-icons/bi";
import { TbCategory2 } from "react-icons/tb";

const ItemBox = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productTrend, setProductTrend] = useState('');
    const [categoryCount, setCategoryCount ] = useState({}); // State to store category counts
    const prevProductCount = useRef(0);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await axios.get('https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4');
                console.log("Response data:", response.data);

                if (response.data) {
                    const productsArray = Object.values(response.data);
                    console.log("Products array:", productsArray);
                    setProducts(productsArray);

                    // Calculate category counts
                   const categoryCount = {};
                    productsArray.forEach(product => {
                        if (categoryCount[product.category]) {
                            categoryCount[product.category]++;
                        } else {
                            categoryCount[product.category] = 1;
                        }
                    });
                    setCategoryCount(categoryCount);

                    // Determine product trend
                    const currentProductCount = productsArray.length;
                    if (currentProductCount > prevProductCount.current) {
                        setProductTrend('increase');
                    } else if (currentProductCount < prevProductCount.current) {
                        setProductTrend('decrease');
                    }
                    prevProductCount.current = currentProductCount;
                } else {
                    console.log("No data found");
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 p-5'>
            {/* Products */}
            <div className='flex items-center gap-5 shadow-lg p-5 rounded-lg'>
                <div className='bg-gray-200 rounded-full p-3'>
                    <FaBox />
                </div>
                <div>
                    <h1 className='text-xs'>Total Products</h1>
                    <div className='flex items-center gap-2'>
                        <p className={`font-bold ${loading ? 'text-base' : 'text-xl'}`}>
                            {loading ? 'Loading...' : products.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Product */}
            <div className='flex items-center gap-5 shadow-lg p-5 rounded-lg'>
                <div className='bg-gray-200 rounded-full p-3'>
                    <BiSolidCategory className='text-xl' />
                </div>
                <div>
                    <h1 className='text-xs'>Category Product</h1>
                    <div className='flex flex-col gap-2'>
                            <div  className='flex items-center gap-2'>
                                    <p className={`font-bold ${loading ? 'text-base' : 'text-xl'}`}>
                                        {loading ? 'Loading...' : Object.keys(categoryCount).length}
                                    </p>
                            </div>
                    </div>
                </div>
            </div>

            {/* Canceled Order */}
            <div className='flex items-center gap-5 shadow-lg p-5 rounded-lg'>
                <div className='bg-gray-200 rounded-full p-3'>
                    <BiCategoryAlt className='text-xl' />
                </div>
                <div>
                    <h1 className='text-xs'>men's Product</h1>
                    <div className='flex items-center gap-2'>
                                     <p className={`font-bold ${loading ? 'text-base' : 'text-xl'}`}>
                                        {loading ? 'Loading...' : (categoryCount["men's clothing"] || 0)}
                                    </p>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className='flex items-center gap-5 shadow-lg p-5 rounded-lg '>
                <div className='bg-gray-200 rounded-full p-3'>
                    <TbCategory2 className='text-xl' />
                </div>
                <div>
                    <h1 className='text-xs'>Women's Product</h1>    
                    <div className='flex items-center gap-2'>
                                    <p className={`font-bold ${loading ? 'text-base' : 'text-xl'}`}>
                                        {loading ? 'Loading...' : (categoryCount["women's clothing"] || 0)}
                                    </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemBox;
