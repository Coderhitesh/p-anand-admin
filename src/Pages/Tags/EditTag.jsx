import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditTag = () => {
    const { id } = useParams();

    const [formData, setData] = useState({
        tagName: ''
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
            const res = await axios.get(`http://localhost:9000/api/v1/get-all-tag`);
            const tags = res.data.data;
            const filterData = tags.filter((item) => item._id === id);
            if (filterData.length > 0) {
                setData({
                    tagName: filterData[0].tagName,
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
            await axios.put(`http://localhost:9000/api/v1/update-tag/${id}`, formData);
            toast.success("Tag Updated Successfully!");
            setBtnLoading(false);
            window.location.href = '/all-tags';
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
                            <label htmlFor="tagName" className="form-label">Tag Name</label>
                            <input type="text" onChange={handleChange} name='tagName' value={formData.tagName} className="form-control" id="tagName" />
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
};

export default EditTag;
