import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from './Firebase';
import { toast } from 'sonner'; // Import the toast library
import Logo from '../assets/Images/PureLogo.png';
import Background from '../assets/Images/Background auth.jpg';
import { FaRegEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        role,
        createdAt: new Date()
      });

      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      navigate('/login');
      toast.success('Registration successful. Please login.');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
      <div className="absolute inset-0 bg-cover" style={{ backgroundImage: `url(${Background})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-lg"></div>
      </div>
      <div className="relative space-y-6 bg-white p-8  sm:p-10 rounded-xl w-11/12 sm:w-3/4 lg:w-1/3 md:w-1/2 z-10">
        <div className="text-center">
          <img src={Logo} alt="IkonLogo" className="w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Glamour Apparel</h1>
          <p className="text-xl mt-2">Register your account</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700">Username</label>
            <input 
              type="text" 
              placeholder="YourUsername" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-gray-50 border border-gray-300 p-2 rounded mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Email</label>
            <input 
              type="email" 
              placeholder="YourEmail@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-50 border border-gray-300 p-2 rounded mt-1"
            />
          </div>
          <div className='flex flex-col'>
            <label className='text-gray-700'>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-50 border border-gray-300 p-2 rounded mt-1"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex flex-col relative">
            <label className="text-gray-700">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="YourPassword" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-50 border border-gray-300 p-2 rounded mt-1 pr-10" 
            />
            <div className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center">
              {showPassword ? (
                <FaRegEye className="cursor-pointer text-gray-600" onClick={togglePasswordVisibility} />
              ) : (
                <TbEyeClosed className="cursor-pointer text-gray-600" onClick={togglePasswordVisibility} />
              )}
            </div>
          </div>
          <div className="flex flex-col relative">
            <label className="text-gray-700">Confirm Password</label>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Your Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-gray-50 border border-gray-300 p-2 rounded mt-1 pr-10" 
            />
            <div className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center">
              {showConfirmPassword ? (
                <FaRegEye className="cursor-pointer text-gray-600" onClick={toggleConfirmPasswordVisibility} />
              ) : (
                <TbEyeClosed className="cursor-pointer text-gray-600" onClick={toggleConfirmPasswordVisibility} />
              )}
            </div>
          </div>
          <div className="space-y-3">
            <button type="submit" className="bg-black hover:bg-gray-200 text-white hover:text-black font-bold py-3 px-5 rounded w-full">
              Register
            </button>
            <div className='flex justify-center gap-2'>
              <p className="block text-center text-gray-700">Already have an account?</p>
              <Link to="/login"> 
                <p className='text-blue-500 hover:underline hover:text-blue-700'>Login Now</p>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
