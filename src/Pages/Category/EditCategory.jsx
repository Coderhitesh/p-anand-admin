import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCategory = () => {
    const { id } = useParams();

    const [formData, setData] = useState({
        categoryName: '',
        subcategories: [],
        file: null,
        previewImage: '' 
    });

    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            setData({
                ...formData,
                file: file,
                previewImage: URL.createObjectURL(file) 
            });
        } else if (name === 'subcategories') {
            const subcategoriesArray = value
                .split(',')
                .map(item => item.trim())
                .filter(item => item); // Remove empty strings
            setData({
                ...formData,
                subcategories: subcategoriesArray
            });
        } else {
            setData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleFetch = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/api/v1/single-category/${id}`);
            const category = res.data.data;
            if (category) {
                setData({
                    categoryName: category.categoryName || '',
                    subcategories: category.subcategoryName || [],
                    file: null,
                    previewImage: category.categoryImage?.url || '' 
                });
            } else {
                toast.error('Category not found');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching category:', error);
            setLoading(false);
            toast.error('Failed to fetch category');
        }
    };

    const prepareFormData = () => {
        const data = new FormData();
        data.append('categoryName', formData.categoryName);
    
        // Append subcategories array as JSON string
        data.append('subcategoryName', JSON.stringify(formData.subcategories));
    
        if (formData.file) {
            data.append('categoryImage', formData.file);
        }
        return data;
    };
    
    const updateCategory = async (data) => {
        try {
            const response = await axios.put(`http://localhost:9000/api/v1/update-category/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Category Updated Successfully!");
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setBtnLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setBtnLoading(true);
        const formData = prepareFormData();
        await updateCategory(formData);
    };

    useEffect(() => {
        handleFetch();
    }, [id]);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <label htmlFor="categoryName" className="form-label">Category Name</label>
                            <input
                                type="text"
                                onChange={handleChange}
                                name='categoryName'
                                value={formData.categoryName}
                                className="form-control"
                                id="categoryName"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="subcategories" className="form-label">Subcategories (comma-separated)</label>
                            <input
                                type="text"
                                onChange={handleChange}
                                name='subcategories'
                                value={formData.subcategories.join(', ')}
                                className="form-control"
                                id="subcategories"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="file" className="form-label">Category Image</label>
                            <input
                                type="file"
                                onChange={handleChange}
                                name='file'
                                className="form-control"
                                id="file"
                            />
                        </div>
                        {formData.previewImage && (
                            <div className="col-12">
                                <img
                                    src={formData.previewImage}
                                    alt="Category Preview"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            </div>
                        )}
                        <div className="col-12 text-center">
                            <button
                                type="submit"
                                className={`${btnLoading ? 'not-allowed' : 'allowed'}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? "Please Wait..." : "Update Category"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditCategory;