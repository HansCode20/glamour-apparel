import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { MdFavoriteBorder } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import '../style/ProductDetail.css';

// Redux Concept
import { useDispatch } from 'react-redux';
import { addToCart, addToFavorite } from '../Features/CartSlice';

const ProductDetail = () => {
    const { id } = useParams();
    console.log(id);

    const [Product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const handleAddToFavorite = (product) => {
        dispatch(addToFavorite(product));
    };

    const getProduct = () => {
        setLoading(true);
        setTimeout(() => {
            axios
                .get(`https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store/${id}.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4`)
                .then((res) => {
                    setLoading(false);
                    setProduct(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }, 2000);
    };

    useEffect(() => {
        getProduct();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center bg-gray-100 h-screen">
                <span className="loader"></span>
            </div>
        );
    }

    return (
        <div className="container flex flex-col md:flex-row justify-center  mt-20 md:mt-40 bg-gradient-to-b from-gray-100 to-white rounded-lg shadow-lg p-5">
            {/* Product Image Section */}
            <div className="mx-auto mt-0 md:mt-10 overflow-hidden">
                <img src={Product.image} alt="Product" className="w-96 h-full object-cover py-10" />
            </div>

            {/* Product Details Section */}
            <div className="mx-auto flex flex-col justify-center items-start px-10 lg:px-0 lg:w-3/5 text-left">
                <h1 className="text-4xl font-semibold text-gray-800 mb-3">{Product.title}</h1>
                <p className="text-2xl font-normal text-indigo-600 mb-5">Rp{Number(Product.price).toLocaleString('id-ID')}</p>
                <p className="text-lg font-light text-gray-600 mb-5 leading-relaxed">{Product.description}</p>

                <hr className="text-gray-300 w-full mb-5" />

                <div className="flex gap-4 w-full">
                    <button
                        className="flex items-center justify-center w-2/3 md:w-1/2 p-3 bg-black text-white rounded-md  hover:scale-105 transform duration-300"
                        onClick={() => handleAddToCart(Product)}
                    >
                        <FaShoppingCart className="mr-2" /> Add to Cart
                    </button>

                    <button
                        className="flex items-center justify-center w-1/3 md:w-1/4 border-2 border-gray-300 p-3 rounded-lg hover:bg-red-100 hover:scale-105 transform duration-300"
                        onClick={() => handleAddToFavorite(Product)}
                    >
                        <MdFavoriteBorder className="w-6 h-6 text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
