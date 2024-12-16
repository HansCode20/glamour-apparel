import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import WomanBanner from '../assets/Images/Woman Banner.png';
import BGHero from '../assets/Images/BG_Hero.svg';
import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';

function Banner() {
  // Ref untuk mengakses elemen DOM di mana efek ketik akan ditampilkan
  const typedTarget = useRef(null);
  const background = BGHero;
 
  const handleClick = () => {
    const targetElement = document.getElementById('product');

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Opsi untuk Typed.js
    const options = {
      strings: ["WOMENS", "MAN"],
      typeSpeed: 100,
      backSpeed: 100,
      loop: true,
      showCursor: false // Menyembunyikan kursor
    };

    // Inisialisasi Typed.js pada elemen target
    const typed = new Typed(typedTarget.current, options);

    // Cleanup function untuk menghentikan Typed.js ketika komponen di-unmount
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className=' flex justify-between items-center mx-auto pt-5 mt-[100px] bg-center' style={{backgroundImage: `url(${background})`}} >
      <div className='mx-auto relative p-10 '>
        <div className='flex items-center'>
           <img src="https://img.icons8.com/sf-black-filled/64/horizontal-line.png" alt="horizontal-line" className='w-10 '/>
            <p className='font-semibold text-sm lg:text-sm'>NEW TREND</p>
          </div>
        {/* Judul dan efek ketik */}
        <h1 className='text-3xl lg:text-5xl font-semibold mb-0 lg:mb-5'>
          AUTUMN SALE STYLISH
        </h1>
        {/* Elemen target untuk efek ketik */}
        <span ref={typedTarget} className='element font-bold text-xl lg:text-5xl inline-block absolute bottom-100'></span>
        <div className='mt-10 lg:mt-20'>
          <button className='px-5 py-2 lg:px-10 lg:py-4 md:text-xl bg-black text-white rounded-md hover' onClick={handleClick}>BUY NOW</button>
        </div>
      </div>
      <div className='mx-auto'>
        <img src={WomanBanner} alt="Banner-Foto" width={300} />
      </div>
    </div>
  );
}

export default Banner;


