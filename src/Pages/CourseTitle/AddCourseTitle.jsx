import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddCourseTitle() {
    const [formData, setFormData] = useState({
        courseTitle: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/v1/get-all-tag');
            setTags(response.data.data); // Assuming tags are returned in response.data.data
            // console.log(response.data.data)
        } catch (error) {
            console.error('Error fetching tags:', error);
            toast.error('Failed to fetch tags');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation
        if (!formData.courseTitle) {
            toast.error('Please submit all fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:9000/api/v1/create-course-title', formData);
            setIsLoading(false);
            toast.success("Course Title Added Successfully !!");
            // Optionally, redirect or reset the form here
            window.location.href = '/all-course-title';
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Course Title</h4>
                </div>
                <div className="links">
                    <Link to="/all-tags" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="courseTitle" className="form-label">Course Title</label>
                        <input type="text" onChange={handleChange} name='courseTitle' value={formData.courseTitle} className="form-control" id="courseTitle" />
                    </div>
                    {/* <div className="col-md-6">
                        <label htmlFor="tagColour" className="form-label">Tag Color</label>
                        <input type="color" onChange={handleChange} name='tagColour' value={formData.tagColour} className="form-control" id="TagColour" />
                    </div> */}

                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Add Course Title"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Display Tags */}
            {/* <div className="tags-list">
                <h5>Existing Tags</h5>
                <ul>
                    {tags.map((tag, index) => (
                        <li key={index}>{tag.tagName} - <span style={{ backgroundColor: tag.tagColour, padding: '2px 8px', borderRadius: '4px', color: 'white' }}>{tag.tagColour}</span></li>
                    ))}
                </ul>
            </div> */}
        </>
    );
}

export default AddCourseTitle
