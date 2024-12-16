  import React, { useEffect, useState } from 'react';
  import { Link } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  import { HiOutlineShoppingBag } from "react-icons/hi";
  import { MdFavoriteBorder } from "react-icons/md";
  import { MdOutlineDashboard } from "react-icons/md";
  import classNames from 'classnames';
  import Logo from "../../assets/Images/NoBackgroundLogo.png"; 
  import Avatar from '../../assets/Images/DefaultAvatar.jpg';

  function Navbar() {
    const cartQuantity = useSelector((state) => state.cart.cartTotalQuantity);
    const favoriteQuantity = useSelector((state) => state.cart.favoriteItems.length);
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }

      const storedRole = localStorage.getItem('role');
      if (storedRole) {
        setRole(storedRole);
      }

      const storedProfileImage = localStorage.getItem('profileImage');
      if (storedProfileImage) {
        setProfileImage(storedProfileImage);
      } else if (!storedProfileImage) {
        setProfileImage(Avatar);
      }

      console.log("Loaded username from LocalStorage:", storedUsername);
      console.log("Loaded profile image from LocalStorage:", storedProfileImage);
      console.log("Loaded role from LocalStorage:", storedRole);

      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setIsOpen(false);
        }
      };

      const handleUserLogout = () => {
        setUsername(null);
        setProfileImage(null);
        setRole(null);
      };

      const handleProfileUpdate = () => {
        const updatedUsername = localStorage.getItem('username');
        const updatedProfileImage = localStorage.getItem('profileImage');
        const updatedRole = localStorage.getItem('role');
        setUsername(updatedUsername);
        setProfileImage(updatedProfileImage);
        setRole(updatedRole); 
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('userLogout', handleUserLogout);
      window.addEventListener('profileUpdated', handleProfileUpdate);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('userLogout', handleUserLogout);
        window.removeEventListener('profileUpdated', handleProfileUpdate);
      };
    }, []);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };



    return (
      <nav className="flex justify-between items-center p-1 bg-white shadow-md fixed top-0 left-0 right-0 z-20 ">
        <Link to="/">
          <div className="ml-2">
            <img src={Logo} alt="Logo" className="w-[100px]" />
          </div>
        </Link>

        <div className="lg:hidden mr-4">
          <button onClick={toggleMenu} className={classNames("tham tham-e-squeeze tham-w-6", { 'tham-active': isOpen })}>
            <div className="tham-box">
              <div className="tham-inner" />
            </div>
          </button>
        </div>

        <div className={classNames("lg:flex lg:items-center  ", { 'hidden': !isOpen, 'flex flex-col bg-white absolute top-20 left-0 right-0 p-4 shadow-md space-y-4': isOpen,   })}>
         {role === "admin" && (
            <Link to="/dashboard/">
            <div className='flex justify-start items-center mr-4 gap-2'>
            <MdOutlineDashboard className='text-3xl'/>
            <span className='inline lg:hidden text-lg justify-center items-center'>Dashboard</span>
            </div>
            </Link>
         )}
          <Link to="/favorite" className="flex gap-2 relative mr-4">
            <MdFavoriteBorder className="text-3xl" />
            <span className='inline lg:hidden text-lg justify-center items-center'>Favorite</span>
            {favoriteQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center">
                {favoriteQuantity}
              </span>
            )}
          </Link>
          <Link to="/cart" className="flex gap-2 relative mr-4">
            <HiOutlineShoppingBag className="text-3xl" />
            <span className='inline lg:hidden text-lg justify-center items-center'>Cart</span>
            {cartQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center">
                {cartQuantity}
              </span>
            )}
          </Link>
          <div className="flex relative">
          <Link to="/profile" className="mr-4 ml-[-0.2rem] lg:ml-0">
            <img src={profileImage || Avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover " />
          </Link>
          <div className='flex flex-col justify-center '>
            {username && <span className="mr-4 font-semibold text-sm w-full lg:w-auto">Hi, {username}</span>}
            {role === "admin" && <span className="w-[50px] text-xs font-semibold bg-black text-white rounded p-1">Admin</span>}
            {role === "user" && <span className="w-[50px] text-xs font-semibold bg-black text-white rounded p-1">User</span>}
          </div>
          </div>
        </div>  
      </nav>
    );
  }

  export default Navbar;
