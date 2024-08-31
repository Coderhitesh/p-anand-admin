import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddVideo = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const BackendUrl = "http://localhost:9000/api/v1"

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BackendUrl}/Create-Video`, {
                VideoUrl: videoUrl,
                isActive
            });
            console.log(res.data);
            toast.success('Video added successfully');
            setVideoUrl('');
            setIsActive(true);
        } catch (error) {
            console.error(error);
            toast.error('Failed to add video');
        }
    };

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h1 className="mb-4">Add New Video</h1>
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label htmlFor="videoUrl" className="form-label">Video URL</label>
                    <input
                        type="text"
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Enter video URL"
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-check mb-4">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="form-check-input"
                    />
                    <label htmlFor="isActive" className="form-check-label">Active</label>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Add Video
                </button>
            </form>
        </div>
    );
};

export default AddVideo;
