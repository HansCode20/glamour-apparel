import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import axios from 'axios';
import '../../../style/BoxImage.css';

const BoxImage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const getProduct = () => {
    axios
      .get("https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4")
      .then((res) => {
        const productsArray = Object.keys(res.data).map(key => ({
          id: key,
          ...res.data[key]
        }));
        setProducts(productsArray);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className='p-5 lg:p-5 md:p-5 sm:p-5 mt-10 shadow-none md:shadow-lg rounded-lg '>
      <div className='mt-5'>
        <h1 className='font-bold text-2xl mb-2'>Products Glamour Apparel😊</h1>
        <p className='mb-4'>Some of your products already in stock</p>
      </div>

      <div className="container mt-10 p-0 sm:p-10 lg:p-10 md:p-10">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Swiper
              modules={[EffectCoverflow, Navigation]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={1}
              coverflowEffect={{
                rotate: 0,
                stretch: 10,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              navigation
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.realIndex);
              }}
              className="mySwiper"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="swiper-slide-content  ">
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <p className="slide-title font-bold text-xl mt-4">{products[activeIndex]?.title}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default BoxImage;
