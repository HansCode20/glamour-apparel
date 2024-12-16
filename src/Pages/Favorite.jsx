import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromFavorite, addToCart } from '../Features/CartSlice';
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";

const Favorite = () => {
  const favoriteProducts = useSelector((state) => state.cart.favoriteItems);
  const dispatch = useDispatch();


  return (
    <div className='pt-[140px]'>
      <h1 className="text-3xl font-bold mb-4 text-center">Favorite</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10">
        {favoriteProducts.length === 0 ? (
          <div className='text-center col-span-3'>
            <p className='text-2xl font-semibold'>No favorite products found.</p>
            <Link to="/" className='flex justify-center mt-4 gap-2 hover:underline hover:text-blue-500'>
              <FaArrowCircleLeft className='text-3xl'/>
              <span className='text-xl font-semibold'>
                Back to Home
              </span>
            </Link>
          </div>
        ) : (
          favoriteProducts.map((product) => (
            <div key={product.id} className="rounded-lg shadow-md p-4 space-y-4">

              <div>
                <img src={product.image} alt={product.title} className="w-30 h-48 object-cover mb-4 mx-auto" />
                <h2 className="text-lg font-bold mb-2 text-center w-2/3 lg:w-full md:w-full sm:w-full mx-auto ">{product.title}</h2>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <button onClick={() => window.location.href = `/product/${product.id}`} className='flex items-center  gap-4 bg-black shadow-md  text-white hover:bg-gray-300 hover:text-black duration-300 font-bold py-2 px-4 rounded '>
                  <FaSearch className='mx-auto md:mx-0'/>
                  <span className='text-xs font-medium hidden md:block'>View</span>
                </button>

                <button onClick={() => dispatch(removeFromFavorite(product))} className='flex items-center  gap-4 bg-black text-white hover:bg-gray-300 hover:text-black duration-300 shadow-md  font-bold py-2 px-4 rounded '>
                  <FaTrash className='mx-auto md:mx-0'/>
                  <span className='text-xs font-medium hidden md:block'>Remove</span>
                </button>

                <button onClick={() => dispatch(addToCart(product))} className='flex  items-center  gap-4 bg-black text-white hover:bg-gray-300 hover:text-black duration-300 shadow-md  font-bold py-2 px-4 rounded '>
                  <FaShoppingBag className='mx-auto md:mx-0'/>
                  <span className='text-xs font-medium hidden md:block'>Add to Cart</span>
                </button>
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorite;
