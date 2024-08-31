import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddBookCategory() {
  const [formData, setData] = useState({
    categoryName: '',
    subcategories: [''],
    categoryImage: null,
});
const [isLoading, setIsLoading] = useState(false);

const handleChange = (event) => {
    const { name, value, type } = event.target;
    if (type === 'file') {
        setData(prevData => ({
            ...prevData,
            categoryImage: event.target.files[0]
        }));
    } else {
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }
};

const handleSubcategoryChange = (index, event) => {
    const updatedSubcategories = [...formData.subcategories];
    updatedSubcategories[index] = event.target.value;
    setData(prevData => ({
        ...prevData,
        subcategories: updatedSubcategories
    }));
};

const addSubcategory = () => {
    setData(prevData => ({
        ...prevData,
        subcategories: [...prevData.subcategories, '']
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('categoryName', formData.categoryName);
    data.append('categoryImage', formData.categoryImage);
    formData.subcategories.forEach(subcategory => {
        if (subcategory.trim()) {
            data.append('subcategoryName', subcategory);
        }
    });

    try {
        await axios.post('http://localhost:9000/api/v1/create-book-category', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        setIsLoading(false);
        toast.success('Category Added Successfully !!');
        window.location.href = '/all-book-category';
    } catch (error) {
        setIsLoading(false);
        console.error('Error:', error.message);
        toast.error(error.response?.data?.message || 'An error occurred');
    }
};


return (
    <>
        <ToastContainer />
        <div className="bread">
            <div className="head">
                <h4>Add Category</h4>
            </div>
            <div className="links">
                <Link to="/all-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
            </div>
        </div>

        <div className="d-form">
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label htmlFor="categoryName" className="form-label">Category Name</label>
                    <input type="text" onChange={handleChange} name='categoryName' value={formData.categoryName} className="form-control" id="categoryName" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="categoryImage" className="form-label">Category Image</label>
                    <input type="file" onChange={handleChange} name='categoryImage' className="form-control" id="categoryImage" />
                </div>
                {formData.subcategories.map((subcategory, index) => (
                    <div className="col-md-6" key={index}>
                        <label htmlFor={`subcategory-${index}`} className="form-label">Subcategory Name</label>
                        <input
                            type="text"
                            onChange={(event) => handleSubcategoryChange(index, event)}
                            value={subcategory}
                            className="form-control"
                            id={`subcategory-${index}`}
                        />
                    </div>
                ))}
                <div className="col-md-6">
                    <button type="button" onClick={addSubcategory} className="btn btn-secondary">Add Subcategory</button>
                </div>
                <div className="col-12 text-center">
                    <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                        {isLoading ? "Please Wait..." : "Add Category"}
                    </button>
                </div>
            </form>
        </div>
    </>
);
}

export default AddBookCategory
