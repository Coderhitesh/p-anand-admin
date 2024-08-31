import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCourseTitle() {
    const { id } = useParams();

    const [formData, setData] = useState({
        courseTitle: ''
    });

    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...formData,
            [name]: value
        });
    };

    const handleFetch = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/api/v1/get-all-course-title`);
            const tags = res.data.data;
            const filterData = tags.filter((item) => item._id === id);
            if (filterData.length > 0) {
                setData({
                    courseTitle: filterData[0].courseTitle,
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Tags:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setBtnLoading(true);

        try {
            await axios.put(`http://localhost:9000/api/v1/update-course-title/${id}`, formData);
            toast.success("Course Title Updated Successfully!");
            setBtnLoading(false);
            window.location.href = '/all-course-title';
        } catch (error) {
            setBtnLoading(false);
            console.error('Error updating Tag:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    useEffect(() => {
        handleFetch();
    }, [id]);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Tag</h4>
                </div>
                <div className="links">
                    <Link to="/all-tags" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-4">
                            <label htmlFor="courseTitle" className="form-label">Tag Name</label>
                            <input type="text" onChange={handleChange} name='courseTitle' value={formData.courseTitle} className="form-control" id="courseTitle" />
                        </div>
                        {/* <div className="col-md-6">
                            <label htmlFor="tagColour" className="form-label">Tag Color</label>
                            <input type="color" onChange={handleChange} name='tagColour' value={formData.tagColour} className="form-control" id="tagColour" />
                        </div> */}

                        <div className="col-12 text-center">
                            <button type="submit" className={`btn ${btnLoading ? 'not-allowed' : 'allowed'}`} >{btnLoading ? "Please Wait.." : "Update Tag"} </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

export default EditCourseTitle
