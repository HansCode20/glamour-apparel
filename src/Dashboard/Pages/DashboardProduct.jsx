  import React, { useState, useEffect } from 'react';
  import { FaTrash } from 'react-icons/fa';
  import {FaPencil} from 'react-icons/fa6';
  import { IoMdClose, IoIosCreate } from 'react-icons/io';
  import Loading from "../../Features/Loading";

  const DashboardProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [newProduct, setNewProduct] = useState({
      title: '',
      price: '',
      description: '',
      image: '',
      category: 'jewelery' // Default category
    });

    const [editProduct, setEditProduct] = useState({
      id: '',
      title: '',
      price: '',
      description: '',
      image: '',
      category: 'jewelery' // Default category
    });

    useEffect(() => {
      getProducts();
    }, []);


    const [editImageFile, setEditImageFile] = useState(null);

    const getProducts = () => {
      setLoading(true);
      setTimeout(() => {  
        fetch('https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4')
          .then(response => response.json())
          .then(data => {
            const productsData = Object.entries(data).map(([key, value]) => ({
              ...value,
              id: key,
              price: parseInt(value.price) // Parse price to integer for proper display
            }));
            setProducts(productsData);
          })
          .catch(error => {
            console.error('Error fetching products:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      }, 1000);
    };

    

    
    const addProduct = async () => {
      try {
        const response = await fetch('https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4', {
          method: 'POST',
          body: JSON.stringify(newProduct),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to add product');
        }
        const data = await response.json();
        const addedProduct = { ...newProduct, id: data.name };
        setProducts([...products, addedProduct]);
        setNewProduct({ title: '', price: '', description: '', image: '', category: 'jewelery' });
      } catch (error) {
        console.error('Error adding product:', error);
      }
    };

    const updateProduct = async (id) => {
      try {
        const formData = new FormData();
        formData.append('title', editProduct.title);
        formData.append('price', editProduct.price);
        formData.append('description', editProduct.description);
        if (editImageFile) {
          formData.append('image', editImageFile);
        }

        const response = await fetch(`https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store/${id}.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4`, {
          method: 'PUT',
          body: JSON.stringify(editProduct),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }
        const updatedProduct = { ...editProduct, id };
        setProducts(products.map(product => (product.id === id ? updatedProduct : product)));
        setEditProduct({ id: '', title: '', price: '', description: '', image: '', category: 'jewelery' });
        setEditImageFile(null);
        document.getElementById('updatemodal').close();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    };

    const deleteProduct = async (id) => {
      try {
        const response = await fetch(`https://restapistore-default-rtdb.asia-southeast1.firebasedatabase.app/Store/${id}.json?auth=QVdNWO3MDXvTdszmf7YUy0tcjRjR3drAmOlmNrc4`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };

    const handleEditClick = (product) => {
      setEditProduct(product);
      document.getElementById('updatemodal').showModal();
    };

    const handleNewProductChange = (e) => {
      const { name, value } = e.target;
      if (name === 'image') {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProduct({ ...newProduct, image: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        setNewProduct({ ...newProduct, [name]: value });
      }
    };

    const handleEditProductChange = (e) => {
      const { name, value } = e.target;
      if (name === 'image') {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditProduct({ ...editProduct, image: reader.result });
          setEditImageFile(file); // Store the file for upload
        };
        reader.readAsDataURL(file);
      } else {
        setEditProduct({ ...editProduct, [name]: value });
      }
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    if (loading) {
      return (
        <div>
          <Loading />
        </div>
    );
    }

    return (
      <div className="w-full p-4">
        {/* Button Create */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className="text-xl md:text-2xl lg:text-2xl font-bold ">Product Dashboard</h2>
          <button
            className='btn flex bg-black/80 hover:bg-gray-300 text-white font-bold py-2 px-4 justify-center items-center rounded'
            onClick={() => document.getElementById('createmodal').showModal()}>
            <IoIosCreate className='mr-2' size={25} />
            Create
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-max lg:min-w-full table-auto text-left border-collapse">
            <thead>
              <tr>
                {["ID", "Image", "Name", "Description", "Price", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="border-b border-gray-200 bg-gray-100 p-4 text-gray-600 font-semibold text-sm"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id} className="border ">
                  <td className="p-4 border">{product.id}</td>
                  <td className="p-4 border">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover object-center"
                    />
                  </td>
                  <td className="p-4 border">{product.title}</td>
                  <td className="p-4 border">{product.description}</td>
                  <td className="p-4 border">Rp{Number(product.price).toLocaleString('id-ID')}</td>
                  <td className='flex gap-4 p-10 justify-center items-center'>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="btn bg-black text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-300 flex items-center justify-center"
                    >
                      <FaPencil />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 flex items-center justify-center"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 mx-2"
          >
            Previous
          </button>
          <span className="text-gray-700 mx-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 mx-2"
          >
            Next
          </button>
        </div>

        {/* Modal Create */}
        <dialog id="createmodal" className="modal modal-bottom sm:modal-middle w-[90%] max-w-5xl rounded bg-white/10 backdrop-blur-sm">
          <div className="modal-box p-10">
            <div className='flex justify-end'>
              <button
                className="btn bg-white text-black font-bold py-4 px-4 rounded-full"
                onClick={() => document.getElementById('createmodal').close()}
              >
                <IoMdClose />
              </button>
            </div>
            <div className="modal-action">
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-center text-black">Add New Product</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newProduct.title}
                    onChange={handleNewProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  />
                  <input
                    type="text"
                    name="price"
                    id='dengan_rupiah'
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={handleNewProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={handleNewProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  />
                  <input
                    type="file"
                    name="image"
                    accept='image/*'
                    onChange={handleNewProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  />
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleNewProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  >
                    <option value="jewelery">Jewelery</option>
                    <option value="men's clothing">Men's clothing</option>
                    <option value="women's clothing">Women's clothing</option>
                  </select>
                  <button
                    onClick={addProduct}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-500  transition duration-100"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>

        {/* Modal Update */}
        <dialog id="updatemodal" className="modal modal-bottom sm:modal-middle w-[90%] max-w-5xl rounded bg-white/10 backdrop-blur-sm">
          <div className="modal-box p-10">
            <div className='flex justify-end'>
              <button
                className="btn bg-white text-black font-bold py-4 px-4 rounded-full"
                onClick={() => document.getElementById('updatemodal').close()}
              >
                <IoMdClose />
              </button>
            </div>
            <div className="modal-action">
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-center text-black">Edit Product</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={editProduct.title}
                    onChange={handleEditProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  />
                  <input
                    type="text"
                    name="price"
                    id="dengan_rupiah"
                    placeholder="Price"
                    value={editProduct.price}
                    onChange={handleEditProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={editProduct.description}
                    onChange={handleEditProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  />
                  <input
                    type="file"
                    name="image"
                    accept='image/*'
                    onChange={handleEditProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  />
                  <select
                    name="category"
                    value={editProduct.category}
                    onChange={handleEditProductChange}
                    className="border border-gray-300 p-2 rounded bg-gray-50 text-black"
                  >
                    <option value="jewelery">Jewelery</option>
                    <option value="men's clothing">Men's clothing</option>
                    <option value="women's clothing">Women's clothing</option>
                  </select>
                  <button
                    onClick={() => updateProduct(editProduct.id)}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-500 transition duration-300"
                  >
                    Edit Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>

      </div>
    );
  };

  export default DashboardProduct;
