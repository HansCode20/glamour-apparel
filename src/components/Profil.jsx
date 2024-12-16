import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Image Assets
import Avatar from '../assets/Images/DefaultAvatar.jpg';

// Notifacitions Sonner
import { toast } from 'sonner';

// Redux Logout
import { logout } from '../Auth/UseAuth';

// React Icons
import { FaRegTrashCan } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import { LuPenLine } from "react-icons/lu"; 
import { IoMdLogOut } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";


// Firebase Database
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from '../Auth/Firebase';
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newRole, setNewRole] = useState(''); 
    const [uploading, setUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const storedUsername = localStorage.getItem('username');
            const storedProfileImage = localStorage.getItem('profileImage');

            if (storedUser && storedUsername) {
                setUser({ ...storedUser, username: storedUsername });
                setProfileImage(storedProfileImage || Avatar);
            }
        };
        fetchUser();
    }, []);

    // Jika user tidak mengupload Profile Image, maka yang ditampilkan Avatar
    useEffect(() => {
        if (profileImage === undefined) {
            setProfileImage(Avatar);
        }
    }, []);

    // Jika sudah mengupload Maka Tampilanya berubah
    useEffect(() => {
        if (uploadedImage) {
            setUploadedImage(profileImage);
        }
    }, [uploadedImage, profileImage]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleUploadImage = () => {
        if (!profileImage || profileImage === Avatar) return;

        const storageRef = ref(storage, `profileImages/${user.uid}/${profileImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, profileImage);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                setUploading(true);
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error);
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateDoc(doc(db, 'users', user.uid), { profileImageUrl: downloadURL });
                    setUploadedImage(downloadURL);
                    localStorage.setItem('profileImage', downloadURL);
                    setProfileImage(downloadURL);
                    setUploading(false);
                    toast.success('Profile image updated successfully');

                    // Emit custom event after updating profile image
                    window.dispatchEvent(new CustomEvent('profileUpdated'));
                });
            }
        );
    };

    const handleDeleteImage = async () => {
        try {
            const profileImageUrl = localStorage.getItem('profileImage');
            if (profileImageUrl && profileImageUrl !== Avatar) {
                const imageRef = ref(storage, profileImageUrl);
                await deleteObject(imageRef);
            }
            
            localStorage.removeItem('profileImage');
            setUploadedImage(null);
            setProfileImage(Avatar);

            await updateDoc(doc(db, 'users', user.uid), { profileImageUrl: '' });

            toast.success('Profile image deleted successfully');
            window.dispatchEvent(new CustomEvent('profileUpdated'));
        } catch (error) {
            console.error('Error deleting image: ', error);
            toast.error('Failed to delete profile image');
        }
    };


    const handleUpdateProfile = async () => {
        try {
            if (newUsername || newRole) {
                const timestamp = serverTimestamp();

                await updateDoc(doc(db, 'users', user.uid), { 
                    username: newUsername,
                    role: newRole,
                    updatedAt: timestamp,
                });

                if (newUsername) {
                localStorage.setItem('username', newUsername);
                setUser((prevUser) => ({ ...prevUser, username: newUsername }));
                console.log("Updated username in LocalStorage:", newUsername);
                toast.success('Username updated successfully');
                }
                
                if (newRole) {
                localStorage.setItem('role', newRole);
                setUser((prevUser) => ({ ...prevUser, role: newRole }));
                console.log("Updated role in LocalStorage:", newRole);
                toast.success('Role updated successfully');
                }

                // Emit custom event after updating username
                window.dispatchEvent(new CustomEvent('profileUpdated'));
            } else {
                toast.error('Please enter a new username or role');
            }
        } catch (error) {
            console.error('Firebase Error:', error);

            if (error.code === 'auth/operation-not-allowed') {
                toast.error('Please verify the new email address before updating.');
            } else {
                toast.error('Failed to update profile');
            }
        }
    };

    const handleLogout = async () => {
        const auth = getAuth();
        await auth.signOut();
        logout();
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
        dispatchEvent(new Event('userLogout'));
    };

    if (!user) {
        return (
            <Link to="/login ">
                <button className='flex gap-4 justify-center items-center mt-[200px] lg:mt-[350px] md:mt-[200px] mx-auto bg-black hover:bg-gray-400 text-white font-bold py-3 px-5 rounded text-sm lg:text-2xl'>
                    <IoLogIn className='text-3xl'/>
                    <span>Login</span>
                </button>
            </Link>
        );
    }

   

    return (
        <div className='flex justify-center items-center h-screen mt-[55px] lg:mt-10 md:mt-10 bg-white shadow-lg'>
             {/* Black Background */}
             <div className="absolute top-0 left-0 w-full h-1/2 bg-black/80 opacity-80 z-0 "></div>
            
            {/* White Background */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white z-0"></div>

            {/* Profile Image Section */}
            <div className="relative z-10 flex flex-col justify-center items-center h-64 gap-5">
                <img src={profileImage || Avatar} alt="Product" className="w-32 h-32 rounded-full shadow-lg" />
                <h1 className='text-2xl font-semibold'>{user.username}</h1>

                <div className='flex flex-col md:flex-row justify-center items-center gap-5'>

                    <div className='flex justify-between items-center gap-4 shadow-md hover:shadow-lg px-2 py-2 rounded-lg duration-300'>
                        <LuPenLine className="text-md medium"/>
                        <button className="btn text-md font-medium " onClick={() => document.getElementById('my_modal_3').showModal()}>
                            Edit Profile
                        </button>
                    </div>

                        <div className="flex justify-between items-center gap-4 shadow-md hover:shadow-lg p-2 rounded-lg duration-300">
                        <IoMdLogOut className='text-md'/>
                        <button className='btn text-md font-medium' onClick={handleLogout}>Logout</button>
                    </div>

                </div>

            </div>

            <dialog id="my_modal_3" className="modal rounded-lg ">
                    <div className="modal-box p-5 md:p-20 lg:p-20">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                        </form>
                        <div className='flex flex-col  lg:flex-row md:flex-row justify-between '>
                            <div className=' mt-5 '>
                            <input type="file" onChange={handleImageChange} className='  '/>
                            </div>
                            <div className='flex items-center mt-4 '>
                                <button onClick={handleUploadImage} className=' p-2 mr-4 bg-blue-500 text-white rounded'>
                                    {uploading ? 'Uploading...' : <FiUpload className='text-xl  '/>}
                                </button>
                                <button onClick={handleDeleteImage} className=' p-2 bg-red-500 text-white rounded'>
                                    <FaRegTrashCan className='text-xl '/>
                                </button>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <input
                                type="text"
                                placeholder="New Username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className='w-full p-2 border border-gray-300 rounded mt-2'
                            />

                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className='w-full p-2 border border-gray-300 rounded mt-2'
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                            <button onClick={handleUpdateProfile} className='mt-4 p-2 bg-white text-black rounded w-full'>
                                Update Profile
                            </button>
                        </div>
                    </div>
                </dialog>


        </div>
    );
};

export default Profile;
