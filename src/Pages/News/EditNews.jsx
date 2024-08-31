import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const EditNews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        CreatedBy: '',
        Headline: '',
        ImageOfNews:'',
        SubHeading: '',
        DateOfNews: new Date().toISOString().split('T')[0],
        NewsData: ''
    });
    const [loading, setLoading] = useState(false);
    const editor = useRef(null);

    useEffect(() => {
        // Fetch news data when component mounts
        const fetchNewsData = async () => {
            try {
                const res = await axios.get(`http://localhost:9000/api/v1/get-single-news/${id}`);
                setFormData(res.data);
            } catch (error) {
                console.error('There was an error fetching the news!', error);
                toast.error("Failed to load news data.");
            }
        };
        fetchNewsData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditorChange = (newContent) => {
        setFormData((prevData) => ({
            ...prevData,
            NewsData: newContent
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://localhost:9000/api/v1/update-news/${id}`, formData);
            toast.success("News updated successfully!");
            navigate('/all-news'); // Redirect to the news list page
        } catch (error) {
            console.error('Error updating news:', error);
            toast.error("Failed to update news.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h2 className="mb-4">Edit News</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="CreatedBy">Created By</label>
                    <input
                        type="text"
                        id="CreatedBy"
                        name="CreatedBy"
                        value={formData.CreatedBy}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="ImageOfNews">News Image</label>
                    <input
                        type="text"
                        id="ImageOfNews"
                        name="ImageOfNews"
                        value={formData.ImageOfNews}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="Headline">Headline</label>
                    <input
                        type="text"
                        id="Headline"
                        name="Headline"
                        value={formData.Headline}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="SubHeading">Sub Heading</label>
                    <input
                        type="text"
                        id="SubHeading"
                        name="SubHeading"
                        value={formData.SubHeading}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="DateOfNews">Date of News</label>
                    <input
                        type="date"
                        id="DateOfNews"
                        name="DateOfNews"
                        value={formData.DateOfNews}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="NewsData">News Data</label>
                    <JoditEditor
                        ref={editor}
                        value={formData.NewsData}
                        tabIndex={1}
                        onChange={handleEditorChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    );
};

export default EditNews;
