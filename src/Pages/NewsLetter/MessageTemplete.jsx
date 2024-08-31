import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MessageTemplate = () => {
    const [templates, setTemplates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [templatesPerPage] = useState(10); // Adjust the number of templates per page as needed
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Fetch all templates
    const handleFetchTemplates = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-templates');
            setTemplates(res.data || []);
        } catch (error) {
            console.error('There was an error fetching the templates!', error);
        }
    };

    // Handle delete template
    const handleDeleteTemplate = async () => {
        try {
            await axios.delete(`http://localhost:9000/api/v1/delete-template/${selectedTemplate._id}`);
            handleFetchTemplates();
            setShowDeleteModal(false);
            toast.success('Template deleted successfully!');
        } catch (error) {
            console.error('There was an error deleting the template!', error);
            toast.error('Failed to delete template!');
        }
    };

    // Handle send template
    const handleSendTemplate = async (_id) => {
        try {
            await axios.post('http://localhost:9000/api/v1/send-emails-in-batches', {
                id: _id
            });
            toast.success('Emails sent successfully!');
        } catch (error) {
            console.error('There was an error sending the template!', error);
            toast.error('Failed to send emails!');
        }
    };

    // Pagination logic
    const indexOfLastTemplate = currentPage * templatesPerPage;
    const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
    const currentTemplates = templates.slice(indexOfFirstTemplate, indexOfLastTemplate);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        handleFetchTemplates();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Message Templates</h1>
            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    window.location.href = "/add-new-template";
                }}
            >
                Add New Template
            </button>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Template Subject</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTemplates.map((template, index) => (
                        <tr key={template._id}>
                            <td>{indexOfFirstTemplate + index + 1}</td>
                            <td>{template.subject}</td>
                            <td>
                                <button
                                    className="btn btn-secondary me-2"
                                    onClick={() => handleSendTemplate(template._id)}
                                >
                                    Send This To All
                                </button>
                                <button
                                    className="btn btn-primary me-2"
                                    onClick={() => {
                                        window.location.href = `/edit-template/${template._id}`;
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        setSelectedTemplate(template);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <nav>
                <ul className="pagination">
                    {[...Array(Math.ceil(templates.length / templatesPerPage)).keys()].map(number => (
                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                            <a onClick={() => paginate(number + 1)} className="page-link" href="#!">
                                {number + 1}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Delete Modal */}
            <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Template</h5>
                            <button type="button" className="close" onClick={() => setShowDeleteModal(false)}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this template?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Close</button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteTemplate}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default MessageTemplate;
