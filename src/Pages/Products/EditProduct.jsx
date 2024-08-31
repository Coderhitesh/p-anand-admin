import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';

const EditProduct = () => {
    const [categories, setCategories] = useState([]);
    const [allTags, setTags] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [courseModes, setCourseModes] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        courseName: '',
        courseDescription: '',
        courseTagName: '',
        courseCategory: '',
        courseSubCategory: '',
        courseImage: null,
        startingPrice: '',
        endingPrice: '',
        courseMode: [],
        feature: false
    });

    const editorConfig = {
        readonly: false,
        height: 400
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);

        setFormData(prevFormData => ({
            ...prevFormData,
            [fieldName]: file
        }));

        if (fieldName === 'courseImage') {
            setImagePreview(preview);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        // Create a copy of formData with the updated field
        const updatedFormData = {
            ...formData,
            [name]: val
        };

        // Calculate coursePriceAfterDiscount if coursePrice or courseDiscountPercent is changed
        if (name === 'coursePrice' || name === 'courseDiscountPercent') {
            const price = name === 'coursePrice' ? parseFloat(val) : parseFloat(updatedFormData.coursePrice);
            const discountPercent = name === 'courseDiscountPercent' ? parseFloat(val) : parseFloat(updatedFormData.courseDiscountPercent);

            if (!isNaN(price) && !isNaN(discountPercent)) {
                const priceAfterDiscount = price - (price * discountPercent / 100);
                updatedFormData.coursePriceAfterDiscount = priceAfterDiscount.toFixed(2);
            } else {
                updatedFormData.coursePriceAfterDiscount = '';
            }
        }

        // Update the state
        setFormData(updatedFormData);
    };

    const handleModeChange = (index, field, value) => {
        const newModes = [...formData.courseMode];
        newModes[index] = { ...newModes[index], [field]: value };
        setFormData(prevFormData => ({
            ...prevFormData,
            courseMode: newModes
        }));
    };

    const handleCategoryChange = async (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            courseCategory: value,
            courseSubCategory: ''
        }));

        if (value) {
            try {
                const response = await axios.get(`http://localhost:9000/api/v1/single-category/${value}`);
                setSubcategories(response.data.data.subcategoryName);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                setSubcategories([]);
            }
        }
    };

    const fetchCategories = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-category');
            setCategories(res.data.data);
        } catch (error) {
            console.error('There was an error fetching the categories!', error);
        }
    }, []);

    const fetchTags = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-tag');
            setTags(res.data.data);
        } catch (error) {
            console.error('There was an error fetching the tags!', error);
        }
    }, []);

    const fetchSingleProduct = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:9000/api/v1/single-course/${id}`);
            const data = res.data.data;

            // Set form data
            setFormData({
                courseName: data.courseName,
                courseDescription: data.courseDescription,
                coursePrice: data.courseMode[0]?.coursePrice || '',
                courseDiscountPercent: data.courseMode[0]?.courseDiscountPercent || '',
                coursePriceAfterDiscount: data.courseMode[0]?.coursePriceAfterDiscount || '',
                courseCategory: data.courseCategory,
                courseSubCategory: data.courseSubCategory,
                courseTagName: data.courseTagName,
                courseImage: null,
                startingPrice: data.startingPrice || '',
                endingPrice: data.endingPrice || '',
                courseMode: data.courseMode || [],
                feature: data.feature || false
            });

            if (data.courseImage) {
                setImagePreview(`http://localhost:9000/uploads/${data.courseImage?.url || ''}`);
            }
        } catch (error) {
            console.error('There was an error fetching the product!', error);
        }
    }, [id]);

    useEffect(() => {
        fetchCategories();
        fetchTags();
        fetchSingleProduct();
    }, [fetchCategories, fetchTags, fetchSingleProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();

            for (const key in formData) {
                if (key === 'courseMode') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (key === 'courseImage') {
                    if (formData.courseImage) {
                        formDataToSend.append('courseImage', formData.courseImage);
                    }
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }

            const response = await axios.put(`http://localhost:9000/api/v1/update-course/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Course Updated Successfully');
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('An Error Occurred');
            setIsLoading(false);
        }
    };

    const handleEditorChange = useCallback((newContent) => {
        setFormData(prevFormData => ({ ...prevFormData, courseDescription: newContent }));
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Course</h4>
                </div>
                <div className="links">
                    <Link to="/all-courses" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="courseCategory" className="form-label">Category</label>
                        <select onChange={handleCategoryChange} name='courseCategory' value={formData.courseCategory} className="form-select" id="courseCategory">
                            <option value="">Choose Category</option>
                            {categories && categories.map((category, index) => (
                                <option key={index} value={category._id}>{category.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="courseSubCategory" className="form-label">Sub Category</label>
                        <select onChange={handleChange} name='courseSubCategory' value={formData.courseSubCategory} className="form-select" id="courseSubCategory">
                            <option value="">Choose Sub Category</option>
                            {subcategories && subcategories.map((subcategory, index) => (
                                <option key={index} value={subcategory}>{subcategory}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="Tag" className="form-label">Tag</label>
                        <select onChange={handleChange} name='courseTagName' value={formData.courseTagName} className="form-select" id="Tag">
                            <option value="">Choose Tag</option>
                            {allTags && allTags.map((tag, index) => (
                                <option key={index} value={tag._id}>{tag.tagName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="courseImage" className="form-label">Course Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'courseImage')}
                            className="form-control"
                            id="courseImage"
                        />
                        {imagePreview && <img src={imagePreview} alt="Preview" width="100" />}
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="courseName" className="form-label">Course Name</label>
                        <input
                            type="text"
                            name="courseName"
                            onChange={handleChange}
                            value={formData.courseName}
                            className="form-control"
                            id="courseName"
                        />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="courseDescription" className="form-label">Course Description</label>
                        <JoditEditor
                            value={formData.courseDescription}
                            config={editorConfig}
                            onChange={handleEditorChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="startingPrice" className="form-label">Starting Price</label>
                        <input
                            type="number"
                            name="startingPrice"
                            onChange={handleChange}
                            value={formData.startingPrice}
                            className="form-control"
                            id="startingPrice"
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="endingPrice" className="form-label">Ending Price</label>
                        <input
                            type="number"
                            name="endingPrice"
                            onChange={handleChange}
                            value={formData.endingPrice}
                            className="form-control"
                            id="endingPrice"
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="coursePrice" className="form-label">Course Price</label>
                        <input
                            type="number"
                            name="coursePrice"
                            onChange={handleChange}
                            value={formData.coursePrice}
                            className="form-control"
                            id="coursePrice"
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="courseDiscountPercent" className="form-label">Discount Percent</label>
                        <input
                            type="number"
                            name="courseDiscountPercent"
                            onChange={handleChange}
                            value={formData.courseDiscountPercent}
                            className="form-control"
                            id="courseDiscountPercent"
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="coursePriceAfterDiscount" className="form-label">Price After Discount</label>
                        <input
                            type="text"
                            name="coursePriceAfterDiscount"
                            value={formData.coursePriceAfterDiscount}
                            className="form-control"
                            id="coursePriceAfterDiscount"
                            readOnly
                        />
                    </div>

                    <div className="col-md-12">
                        <label className="form-label">Course Modes</label>
                        {formData.courseMode.map((mode, index) => (
                            <div key={index} className="course-mode">
                                <input
                                    type="text"
                                    value={mode.mode}
                                    onChange={(e) => handleModeChange(index, 'mode', e.target.value)}
                                    className="form-control"
                                    placeholder="Mode"
                                />
                                <input
                                    type="text"
                                    value={mode.price}
                                    onChange={(e) => handleModeChange(index, 'price', e.target.value)}
                                    className="form-control"
                                    placeholder="Price"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setFormData(prevData => ({
                                ...prevData,
                                courseMode: [...prevData.courseMode, { mode: '', price: '' }]
                            }))}
                        >
                            Add Mode
                        </button>
                    </div>

                    <div className="col-md-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="feature"
                                id="feature"
                                checked={formData.feature}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="feature">
                                Feature
                            </label>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProduct;
