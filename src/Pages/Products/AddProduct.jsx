import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';

const AddProduct = () => {
    const editor = useRef(null);
    const [categories, setCategories] = useState([]);
    const [allTags, setTags] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null); // Single image preview
    const [formData, setFormData] = useState({
        courseName: '',
        courseDescription: '',
        courseTagName: '',
        courseCategory: '',
        courseSubCategory: '',
        courseImage: null, // Single file
        courseMode: [],
        feature: false
    });
    const [isLoading, setIsLoading] = useState(false);

    // Predefined course modes
    const courseModes = ['Live', 'Offline', 'Pen Drive', 'Google Drive'];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);

        setFormData((prevFormData) => ({
            ...prevFormData,
            courseImage: file
        }));

        setImagePreview(preview);
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const calculateDiscountedPrice = (price, discountPercent) => {
        const discount = (price * discountPercent) / 100;
        return price - discount;
    };

    const handleCourseModeChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCourseMode = [...formData.courseMode];
        updatedCourseMode[index] = {
            ...updatedCourseMode[index],
            [name]: value
        };

        // Calculate the discounted price when price or discount percent changes
        if (name === 'coursePrice' || name === 'courseDiscountPercent') {
            const price = parseFloat(updatedCourseMode[index].coursePrice) || 0;
            const discountPercent = parseFloat(updatedCourseMode[index].courseDiscountPercent) || 0;
            updatedCourseMode[index].coursePriceAfterDiscount = calculateDiscountedPrice(price, discountPercent);
        }

        if (name === 'modeType' && value !== 'Google Drive') {
            updatedCourseMode[index].courseLink = ''; // Reset courseLink if not Google Drive
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            courseMode: updatedCourseMode
        }));
    };

    const addCourseMode = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            courseMode: [...prevFormData.courseMode, { modeType: 'Live', coursePrice: '', coursePriceAfterDiscount: '', courseDiscountPercent: '', courseLink: '' }]
        }));
    };

    const removeCourseMode = (index) => {
        const updatedCourseMode = [...formData.courseMode];
        updatedCourseMode.splice(index, 1);
        setFormData((prevFormData) => ({
            ...prevFormData,
            courseMode: updatedCourseMode
        }));
    };

    const handleFetch = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-category');
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleTags = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-tag');
            setTags(res.data.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    useEffect(() => {
        handleFetch();
        handleTags();
    }, []);

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

            const response = await axios.post('http://localhost:9000/api/v1/create-course', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Course Added Successfully');
            setIsLoading(false);
            // setFormData({
            //     courseName: '',
            //     courseDescription: '',
            //     courseTagName: '',
            //     courseCategory: '',
            //     courseSubCategory: '',
            //     courseImage: null,
            //     courseMode: [],
            //     feature: false
            // });
            // setImagePreview(null);
        } catch (error) {
            console.error('Error:', error);
            toast.error('An Error Occurred');
            setIsLoading(false);
        }
    };

    const editorConfig = {
        readonly: false,
        height: 400
    };

    const handleEditorChange = useCallback((newContent) => {
        console.log(newContent)
        setFormData(prevFormData => ({ ...prevFormData, courseDescription: newContent }));
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Course</h4>
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
                            onChange={handleFileChange}
                            className="form-control"
                            id="courseImage"
                        />
                        {imagePreview && <img src={imagePreview} alt="Image Preview" className="img-preview" style={{ width: '200px', height: "200px" }} />}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="courseName" className="form-label">Course Name</label>
                        <input type="text" onChange={handleChange} name='courseName' value={formData.courseName} className="form-control" id="courseName" />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="startingPrice" className="form-label">Starting Price</label>
                        <input type="text" onChange={handleChange} name='startingPrice' value={formData.startingPrice} className="form-control" id="startingPrice" />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="endingPrice" className="form-label">Ending Price</label>
                        <input type="text" onChange={handleChange} name='endingPrice' value={formData.endingPrice} className="form-control" id="endingPrice" />
                    </div>

                    <div className="col-md-6">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name='feature'
                                checked={formData.feature}
                                onChange={handleChange}
                                id="feature"
                            />
                            <label className="form-check-label" htmlFor="feature">
                                Feature
                            </label>
                        </div>
                    </div>

                    {formData.courseMode.map((mode, index) => (
                        <div key={index} className="col-md-12 row g-3">
                            <h5>Course Mode {index + 1}</h5>
                            <div className="col-md-6">
                                <label htmlFor={`modeType${index}`} className="form-label">Mode Type</label>
                                <select
                                    name='modeType'
                                    value={mode.modeType}
                                    onChange={(e) => handleCourseModeChange(index, e)}
                                    className="form-select"
                                    id={`modeType${index}`}
                                >
                                    <option value="Live">Live</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Pen Drive">Pen Drive</option>
                                    <option value="Google Drive">Google Drive</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor={`coursePrice${index}`} className="form-label">Course Price</label>
                                <input
                                    type="number"
                                    name='coursePrice'
                                    value={mode.coursePrice}
                                    onChange={(e) => handleCourseModeChange(index, e)}
                                    className="form-control"
                                    id={`coursePrice${index}`}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor={`courseDiscountPercent${index}`} className="form-label">Discount Percent</label>
                                <input
                                    type="number"
                                    name='courseDiscountPercent'
                                    value={mode.courseDiscountPercent}
                                    onChange={(e) => handleCourseModeChange(index, e)}
                                    className="form-control"
                                    id={`courseDiscountPercent${index}`}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor={`coursePriceAfterDiscount${index}`} className="form-label">Price After Discount</label>
                                <input
                                    type="text"
                                    name='coursePriceAfterDiscount'
                                    value={mode.coursePriceAfterDiscount}
                                    onChange={(e) => handleCourseModeChange(index, e)}
                                    className="form-control"
                                    id={`coursePriceAfterDiscount${index}`}
                                    readOnly
                                />
                            </div>

                            <div className="col-md-12">
                                <label htmlFor={`courseLink${index}`} className="form-label">Course Link</label>
                                <input
                                    type="text"
                                    name='courseLink'
                                    value={mode.courseLink}
                                    onChange={(e) => handleCourseModeChange(index, e)}
                                    className="form-control"
                                    id={`courseLink${index}`}
                                    disabled={mode.modeType !== 'Google Drive'}
                                />
                            </div>

                            <button type="button" className="btn btn-danger" onClick={() => removeCourseMode(index)}>Remove Mode</button>
                        </div>
                    ))}

                    <div className="col-md-12">
                        <button type="button" onClick={addCourseMode} className="btn btn-primary">Add Course Mode</button>
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="courseDescription" className="form-label">Course Description</label>
                        <JoditEditor
                            ref={editor}
                            value={formData.courseDescription}
                            config={editorConfig}
                            onBlur={(newContent) => handleEditorChange(newContent)}
                        />
                    </div>

                    <div className="col-md-12">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Course'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddProduct;
