import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBanner = () => {
    const { id } = useParams();

    const [formData, setData] = useState({
        bannerImage: null,
        active: false,
        previewImage: null
    });

    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setData({
                ...formData,
                [name]: checked
            });
        } else if (type === 'file') {
            const file = files[0];
            setData({
                ...formData,
                bannerImage: file,
                previewImage: URL.createObjectURL(file)
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
            const res = await axios.get(`http://localhost:9000/api/v1/get-all-banner`);
            const banners = res.data.data;
            const currentBanner = banners.find((item) => item._id === id);
            if (currentBanner) {
                setData({
                    bannerImage: null,
                    active: currentBanner.active,
                    previewImage: currentBanner.bannerImage.url
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Banner:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setBtnLoading(true);
        const data = new FormData();

        if (formData.bannerImage) {
            data.append('bannerImage', formData.bannerImage);
        }

        data.append('active', formData.active);

        try {
            const response = await axios.put(`http://localhost:9000/api/v1/update-baner/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Banner Updated Successfully!");
            setBtnLoading(false);
            window.location.href = '/all-banners';
        } catch (error) {
            setBtnLoading(false);
            console.error('Error updating Banner:', error);
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
                    <h4>Edit Banner</h4>
                </div>
                <div className="links">
                    <Link to="/all-banners" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-4">
                            <label htmlFor="bannerImage" className="form-label">Banner Image</label>
                            <input type="file" onChange={handleChange} name='bannerImage' className="form-control" id="bannerImage" />
                        </div>
                        {formData.previewImage && (
                            <div className="col-4">
                                <img src={formData.previewImage} alt="Banner Preview" style={{ width: '100%', height: 'auto' }} />
                            </div>
                        )}
                        <div className="col-12">
                            <div className="form-check">
                                <input className="form-check-input" onChange={handleChange} type="checkbox" name="active" id="active" checked={formData.active} />
                                <label className="form-check-label" htmlFor="active">
                                    Active
                                </label>
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            <button type="submit" className={`${btnLoading ? 'not-allowed':'allowed'}`} >{btnLoading ? "Please Wait.." : "Update Banner"} </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditBanner;
