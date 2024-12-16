import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalPrice = () => {
    const [totalPrice, setTotalPrice] = useState(0);

    const getProduct = () => {
      axios
        .get("https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4")
        .then((res) => {
          const  totalPrice = Object.keys(res.data).reduce((acc, key) => {
            const product = res.data[key];
            const price = Number(product.price) || 0;
            return acc + price;
            
          }, 0);
          setTotalPrice(totalPrice);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    useEffect (() => {
      getProduct();
    }, []);


  return (
    <div className='p-5 flex lg:flex-row flex-col justify-between'>
      <div>
        <h1 className='text-2xl font-bold'>Your sales report</h1>
        <p className='text-gray-500 mb-8'>Look at your sale</p>
        <p className='text-5xl font-bold mt-0 lg:mt-20'>Rp{totalPrice.toLocaleString("id-ID")}</p>
      </div>
    </div>
  );
};

export default TotalPrice;
