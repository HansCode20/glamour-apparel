import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../Auth/Firebase';

const AllUser = () => {
    const [users, setUsers] = useState([]);

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
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className='mt-10 w-full lg:w-1/2 md:w-3/4 sm:w-4/5'>
            <div className='overflow-y-auto scrollbar-hidden max-h-60 '>
            <table className='min-w-full leading-normal mx-auto'> 
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
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default AllUser;
