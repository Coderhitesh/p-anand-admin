import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddNews = () => {
    const [formData, setFormData] = useState({
        CreatedBy: '',
        ImageOfNews:'',
        Headline: '',
        SubHeading: '',
        DateOfNews: new Date().toISOString().split('T')[0],
        NewsData: ''
    });
    const [loading, setLoading] = useState(false);
    const editor = useRef(null);

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
            const res = await axios.post('http://localhost:9000/api/v1/create-news', formData);
            console.log(res.data);
            toast.success("News added successfully!");
            setFormData({
                CreatedBy: '',
                Headline: '',
                SubHeading: '',
                ImageOfNews:'',
                DateOfNews: new Date().toISOString().split('T')[0],
                NewsData: ''
            });
        } catch (error) {
            console.error('Error adding news:', error);
            toast.error("Failed to add news.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container ">
            <ToastContainer />
            <h2 className="mb-4">Add News</h2>
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
                <div className=''>
                    <div className='row'>
                        <div className='col-md-6'>
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
                        </div>
                        <div className='col-md-6'>
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
                        </div>
                    </div>
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
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AddNews;
