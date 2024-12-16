import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../../Auth/Firebase'; // Ensure the path to your Firebase config is correct
import Loading from '../../../Features/Loading';

// React Icons
import { LuClipboardEdit } from "react-icons/lu";

const DashboardUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // Use loading state to indicate data fetching status
    const [editingUser, setEditingUser] = useState(null);
    const [uploading, setUploading] = useState(false); // State to handle image uploading

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Simulate a network delay
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
            } catch (error) {
                console.error('Error fetching users: ', error);
            } finally {
                setLoading(false); // Set loading to false once fetching is complete
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setEditingUser(user);
    };

    const handleSaveEditClick = async () => {
        setUploading(true); // Start uploading state
        try {
            if (editingUser.profileImageFile) {
                const storage = getStorage();
                const storageRef = ref(storage, `profileImages/${editingUser.id}`);
                await uploadBytes(storageRef, editingUser.profileImageFile);
                const profileImageUrl = await getDownloadURL(storageRef);
                editingUser.profileImageUrl = profileImageUrl;
            }

            const userRef = doc(db, 'users', editingUser.id);
            await updateDoc(userRef, {
                username: editingUser.username,
                email: editingUser.email,
                role: editingUser.role,
                profileImageUrl: editingUser.profileImageUrl
            });
            setEditingUser(null); // Exit Edit Mode
            const updatedUsers = users.map(user => user.id === editingUser.id ? editingUser : user);
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error updating user: ', error);
        } finally {
            setUploading(false); // End uploading state
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            const file = files[0];
            setEditingUser({ ...editingUser, profileImageFile: file });
        } else {
            setEditingUser({ ...editingUser, [name]: value });
        }
    };

    return (
        <div className="p-5">
            <h1 className='text-xl font-bold mb-4'>Dashboard User</h1>
            {loading ? (
                <div className='text-center text-gray-600'>
                    <Loading />
                </div>
            ) : (
                <div className='overflow-x-auto'>
                    {editingUser ? (
                        <div>
                            <h2 className='text-lg font-bold mb-4'>Edit User</h2>
                            <form className='mb-4 shadow-md p-3 space-y-4'>
                                <div className='mb-2'>
                                    <label className='block text-gray-700'>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={editingUser.username}
                                        onChange={handleChange}
                                        className='w-full p-2 border border-gray-300 rounded bg-white'
                                    />
                                </div>

                                <div className='mb-2'>
                                    <label className='block text-gray-700'>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editingUser.email}
                                        onChange={handleChange}
                                        className='w-full p-2 border border-gray-300 rounded bg-white'
                                    />
                                </div>

                                <div className='mb-2'>
                                    <label className='block text-gray-700'>Role</label>
                                    <select name="role" value={editingUser.role} onChange={handleChange} className='bg-white w-full border p-2 border-gray-300'>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className='mb-2'>
                                    <label className='block text-gray-700'>Profile Image</label>
                                    <input
                                        type="file"
                                        name="profileImage"
                                        onChange={handleChange} // Handle file input change
                                        className='w-full p-2 border border-gray-300 rounded bg-white'
                                    />
                                </div>

                                <div className='flex space-x-2'>
                                    <button
                                        type="button"
                                        onClick={handleSaveEditClick}
                                        className='bg-black text-white px-4 py-2 rounded'
                                        disabled={uploading} // Disable button while uploading
                                    >
                                        {uploading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className='bg-red-700 text-white px-4 py-2 rounded'
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <table className='min-w-full leading-normal mx-auto'>
                            <thead>
                                <tr>
                                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Username
                                    </th>
                                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Email
                                    </th>
                                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Role
                                    </th>
                                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Profile Image
                                    </th>
                                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Edit Profile
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                            {user.username || 'No Username'}
                                        </td>
                                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                            {user.email}
                                        </td>
                                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                            {user.role}
                                        </td>
                                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                            {user.profileImageUrl ? (
                                                <img src={user.profileImageUrl} alt="Profile" className='w-10 h-10 object-cover rounded-full' />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </td>
                                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                            <button
                                                className='bg-black px-4 py-2 rounded text-white'
                                                onClick={() => handleEditClick(user)}
                                            >
                                                <LuClipboardEdit className='text-xl '/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardUser;
