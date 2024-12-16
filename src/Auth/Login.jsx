  import React, { useEffect, useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { auth, db } from './Firebase';
  import { doc, getDoc } from "firebase/firestore";
  import { toast } from 'sonner';
  import Logo from '../assets/Images/PureLogo.png';
  import Background from '../assets/Images/Background auth.jpg';
  import { FaRegEye } from "react-icons/fa";
  import { TbEyeClosed } from "react-icons/tb";
  import Avatar from '../assets/Images/DefaultAvatar.jpg';

  function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Mengambil Nama Dari Username
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        const username = userData.username;
        const role = userData.role;
        const profileImageUrl = userData.profileImageUrl  || Avatar;

        // Menyimpan di LocalStorage
        localStorage.setItem('token', user.accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('username', username);
        localStorage.setItem('profileImage', profileImageUrl);
        localStorage.setItem('role', role);

        console.log("Username saved in LocalStorage:", username);

        toast.success(`Welcome ${username}`, {
          position: 'top-center',
          autoClose: 1000,
        });

        navigate('/');

      } catch (error) {
        console.error(error);
        if (error.code === 'auth/user-not-found') {
          toast.error('User not found');
        } 
        else if (error.code === 'auth/wrong-password') {
          toast.error('Wrong password');
        }
        else if (error.code === 'auth/too-many-requests') {
          toast.error('Too many requests. Please try again later.');
        }
        else if (error.code === 'auth/invalid-email') {
          toast.error('Invalid email');
        }
        else if (error.code === 'auth/missing-email') {
          toast.error('Missing email');
        }
        else if (error.code === 'auth/missing-password') {
          toast.error('Missing password');
        } else if ( error.code === 'auth/invalid-credential') {
          toast.error('wrong password or email');
        }
      }
    };

    const handlePasswordReset = async () => {
      const auth = getAuth();
      try {
          await sendPasswordResetEmail(auth, email);
          toast.success('Password reset email sent!');
      } catch (error) {
          toast.error('Failed to send password reset email.');
          console.error('Error resetting password:', error);
      }
  };

 
  

    return (
      <div className="relative flex justify-center items-center min-h-screen">

        <div className="absolute inset-0 bg-cover" style={{ backgroundImage: `url(${Background})` }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-lg"></div>
        </div>

        <div className="relative space-y-10 bg-white p-10 sm:p-20 rounded-xl w-11/12 sm:w-3/4 lg:w-1/3 md:w-1/2 z-10">
          <div>
            <img src={Logo} alt="IkonLogo" className="w-20 mx-auto" />
            <h1 className="text-2xl font-bold text-center">Glamour Apparel</h1>
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Welcome</h1>
            <p className="text-xl">Login to your account</p>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <div className="flex flex-col">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="YourEmail@gmail.com" 
                  className="bg-white border-2 border-gray-300 p-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col relative">
                <label>Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="YourPassword" 
                  className="bg-white border-2 border-gray-300 p-2 rounded pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 top-5 pr-3 flex items-center ">
                  {showPassword ? (
                    <FaRegEye className="cursor-pointer" onClick={togglePasswordVisibility} />
                  ) : (
                    <TbEyeClosed className="cursor-pointer" onClick={togglePasswordVisibility} />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button type="submit" className="bg-black hover:bg-[#e5e7eb] text-white hover:text-black font-bold py-3 px-5 rounded w-full">
                  Login
                </button>
                <div className='flex lg:flex-row flex-col justify-center gap-2'>
                  <p className="block text-center text-xs">Don't have an account?</p>
                  <Link to="/register"> 
                    <p className='text-blue-500 hover:underline hover:text-blue-700 text-center text-xs'>Register Now</p>
                  </Link>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    );
  }

  export default Login;
