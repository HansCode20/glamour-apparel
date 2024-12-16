import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCartWithoutNotification } from '../../Features/CartSlice'

const Succes = (isPaymentSuccess) => {
  const dispatch = useDispatch();
 const navigate = useNavigate();

  useEffect(() => {
    if (!isPaymentSuccess) {
      navigate('/notfound');
    } else [
      dispatch(clearCartWithoutNotification()),
    ]
  }, [isPaymentSuccess, navigate, dispatch]);

  return (
    <div className='flex flex-col h-screen justify-center items-center'>
        <img width="96" height="96" src="https://img.icons8.com/color/96/000000/checked--v1.png" alt="checked--v1"/>
        <h1 className='text-3xl font-bold'>Payment Successful</h1>
        <p>Thank you for shopping with us</p>
    </div>
  )
}

export default Succes;