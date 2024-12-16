import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowCircleLeft, FaTrash } from 'react-icons/fa';
import { fetchProducts } from '../Features/ProductSlice';
import { clearCart, removeFromCart, decreaseCart, increaseCart, clearCartWithoutNotification } from '../Features/CartSlice';
import '../style/Cart.css';

function Cart() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.product.items);
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const cartItems = useSelector(state => state.cart.cartitems);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleRemoveFromCart = item => {
    dispatch(removeFromCart(item));
  };

  const handleDecreaseQuantity = item => {
    dispatch(decreaseCart(item));
  };

  const handleIncreaseQuantity = item => {
    dispatch(increaseCart(item));
  };

  useEffect(() => {
    const handleSnapOpen = () => {
      document.body.style.overflow = 'hidden';
    };
    const handleSnapClose = () => {
      document.body.style.overflow = '';
    };

    document.addEventListener('snap-open', handleSnapOpen);
    document.addEventListener('snap-close', handleSnapClose);

    return () => {
      document.removeEventListener('snap-open', handleSnapOpen);
      document.removeEventListener('snap-close', handleSnapClose);
    };
  }, []);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setIsLoading(true);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);

    const customerDetails = {
      firstName: username?.split(' ')[0] || username,
      lastName: username?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '08123456789'
    };

    const orderDetails = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.cartQuantity,
      image: item.image
    }));

    try {
      const response = await fetch('http://localhost:3001/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalAmount, customer: customerDetails, order: orderDetails }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { token } = await response.json();
      console.log('Transaction Token:', token);

      // Midtrans Snap
      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log('Success:', result);
          dispatch(clearCartWithoutNotification());
          navigate('/success');
        },
        onPending: function (result) {
          console.log('Pending:', result);
        },
        onError: function (result) {
          console.error('Error:', result);
        },
        onClose: function () {
          console.log('Customer closed the popup without finishing the payment');
        }
      });

    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[140px]">
      <div className="flex flex-col justify-center items-center gap-10 ">
        <h1 className="text-5xl font-bold justify-center">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div>
            <p className="text-3xl font-semibold mb-2">Your cart is empty</p>
            <div>
              <Link to="/" className="flex items-center justify-center gap-2 group">
                <FaArrowCircleLeft className="text-3xl group-hover:text-[blue] group-hover:underline" />
                <span className="text-2xl font-semibold group-hover:text-[blue] group-hover:underline">Start Shopping</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 lg:p-0 md:p-0">
            <div className="container mx-auto grid grid-cols-4 gap-4 text-center border-b-2 font-bold pb-2 mb-4">
              <h3>Product</h3>
              <h3>Price</h3>
              <h3>Quantity</h3>
              <h3>Total</h3>
            </div>
            <div className="max-h-[70vh] overflow-y-auto ">
              {cartItems.map(item => (
                <div key={item.id} className=" grid grid-cols-4 lg:grid-cols-4 md:grid-cols-4 gap-4 items-center justify-center border-b py-4 ">
                  <div className="flex flex-col lg:flex-row md:flex-row items-center justify-center ">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover " />
                    <div className="ml-4 w-[200px]">
                      <h3 className="text-lg mb-2 hidden lg:block md:block ">{item.title}</h3>
                      <button onClick={() => handleRemoveFromCart(item)} className="flex gap-2 px-3 py-2 bg-black text-white rounded ml-[60px] lg:ml-0 md:ml-0 mt-5 lg:mt-0 md:mt-0">
                        <FaTrash className="text-xl" />
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-center mt-[-50px] lg:mt-0 md:mt-0 number-overflow">Rp{Number(item.price).toLocaleString('id-ID')}</div>
                  <div className="flex items-center justify-center border-2 p-2 rounded w-20 lg:w-24 md:w-24 gap-2 mx-auto mt-[-50px] lg:mt-0 md:mt-0">
                    <button onClick={() => handleDecreaseQuantity(item)}>-</button>
                    <span className="mx-2">{item.cartQuantity}</span>
                    <button onClick={() => handleIncreaseQuantity(item)}>+</button>
                  </div>
                  <div className="text-center mt-[-50px] lg:mt-0 md:mt-0 number-overflow">Rp{Number(item.price * item.cartQuantity).toLocaleString('id-ID')}</div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col lg:flex-row md:flex-row justify-between">
              <div>
                <button onClick={handleClearCart} className="bg-red-600 text-white px-4 py-3 rounded hover:bg-red-700">Clear Cart</button>
              </div>
              <div className="mt-10 lg:mt-0 md:mt-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xl">Subtotal</span>
                  <span className="font-semibold text-xl number-overflow">Rp{Number(cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0)).toLocaleString('id-ID')}</span>
                </div>
                <p className="text-gray-500 mt-2">Taxes and Shipping calculated at checkout</p>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-600 text-white w-full px-4 py-3 rounded mt-2 hover:bg-blue-700">
                  {isLoading ? 'Processing...' : 'Checkout'}
                </button>
                <Link to="/" className="flex items-center justify-center mt-2 text-blue-600 hover:underline mb-10">
                  <FaArrowCircleLeft />
                  <span className="ml-2 ">Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
