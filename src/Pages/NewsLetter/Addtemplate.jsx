import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addtemplate = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const editor = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:9000/api/v1/add-template', {
                subject,
                message:content,
            });
            toast.success('Template added successfully!');
            setSubject('');
            setContent('');
        } catch (error) {
            toast.error('Error adding template!');
            console.error('There was an error adding the template!', error);
        }
    };

    const handlePreview = () => {
        Swal.fire({
            title: 'Template Preview',
            html: `<h3>${subject}</h3><div>${content}</div>`,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Close',
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Add New Template</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="templateSubject">Subject</label>
                    <input
                        type="text"
                        className="form-control"
                        id="templateSubject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="templateContent">Message</label>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        onChange={(newContent) => setContent(newContent)}
                        config={{
                            readonly: false
                        }}
                    />
                </div>
                <button type="submit" className="btn btn-primary me-2">Add Template</button>
                <button type="button" className="btn btn-secondary" onClick={handlePreview}>Preview</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Addtemplate;
