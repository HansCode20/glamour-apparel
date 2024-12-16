import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart, addToFavorite } from '../Features/CartSlice';



// Animasi aos
import AOS from 'aos';
import 'aos/dist/aos.css';

function Product () {
    const [product, setProduct] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // initialize AOS
    useEffect(() => {
        AOS.init();
    }, []);

   

    const getProduct = () => {
        setLoading(true);
            axios
                .get("https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4")
                .then((res) => {
                    // Convert object to array
                    const productsArray = Object.keys(res.data).map(key => ({
                        id: key,
                        ...res.data[key]
                    }));
                    console.log(productsArray); // Logging data for debugging
                    setProduct(productsArray);
                    setLoading(false);
                
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
    }

    useEffect(() => {
        getProduct();
    }, []);


    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const filterByCategory = (products, category) => {
        if (category === 'all') {
            return products;
        }
        return products.filter(product => product.category === category);
    };

    const filteredProducts = filterByCategory(product, selectedCategory);
     
    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <span class="loader"></span>
            </div>
        )
    };
 

    return (
        <div className='mt-20' id='product'>
            <h1 className='text-3xl font-bold ml-[60px] lg:ml-20 mb-6'>Products For You!</h1>
            <div className='flex gap-4 justify-center p-10 lg:p-0'>
                <button className='px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-2 border-black hover:bg-black hover:text-white duration-300' onClick={() => handleCategoryChange("all")}>All</button>
                
                <div className="relative w-full max-w-sm">
                    <svg className="absolute top-1/2 -translate-y-1/2 left-4 z-10 lg:z-10" width="20" height="20"
                        viewBox="0 0 20 20" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.5555 3.33203H3.44463C2.46273 3.33203 1.66675 4.12802 1.66675 5.10991C1.66675 5.56785 1.84345 6.00813 2.16004 6.33901L6.83697 11.2271C6.97021 11.3664 7.03684 11.436 7.0974 11.5068C7.57207 12.062 7.85127 12.7576 7.89207 13.4869C7.89728 13.5799 7.89728 13.6763 7.89728 13.869V16.251C7.89728 17.6854 9.30176 18.6988 10.663 18.2466C11.5227 17.961 12.1029 17.157 12.1029 16.251V14.2772C12.1029 13.6825 12.1029 13.3852 12.1523 13.1015C12.2323 12.6415 12.4081 12.2035 12.6683 11.8158C12.8287 11.5767 13.0342 11.3619 13.4454 10.9322L17.8401 6.33901C18.1567 6.00813 18.3334 5.56785 18.3334 5.10991C18.3334 4.12802 17.5374 3.33203 16.5555 3.33203Z"
                            stroke="black" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <select
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="h-12 border-2 border-black text-gray-900 pl-11 text-base font-normal leading- rounded-lg block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white transition-all duration-500 hover:border-gray-400 hover:bg-gray-50 focus-within:bg-gray-50">
                        <option value="all">Filter</option>
                        <option value="men's clothing">Men's</option>
                        <option value="women's clothing">Women's</option>
                        <option value="jewelery">Jewelery</option>
                    </select>
                    <svg className="absolute top-1/2 -translate-y-1/2 right-4 z-10 lg:z-10" width="16" height="16"
                        viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609" stroke="#111827" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

            </div>  
            
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-0 lg:mt-10 md:mt-10 p-10'>

            {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                    <Link 
                    to={`/product/${item.id}`} 
                    key={item.id} 
                    className="block bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
                    data-aos="fade-up" 
                    data-aos-duration="1000"
                    >
                    <div className="flex justify-center items-center overflow-hidden mx-auto mb-4 h-96">
                        <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain" 
                        />
                    </div>

                    <div className="px-4 pb-4">
                        <p className="font-medium text-lg truncate">{item.title}</p>
                        <p className="mt-2 font-normal text-gray-500">
                        Rp{Number(item.price).toLocaleString('id-ID')}
                        </p>
                    </div>
                    </Link>
                ))
                ) : (
                <div className="flex justify-center items-center py-10">
                    <h1 className="text-2xl  font-semibold text-gray-700">
                        {filteredProducts ? "Product Not Found" : "Product Coming Soon"}
                    </h1>
                </div>
                )}

            </div>
        </div>
    );
}

export default Product;
