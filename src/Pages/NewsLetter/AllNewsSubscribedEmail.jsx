import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

const AllNewsSubscribedEmail = () => {
    const [emails, setEmails] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmailId, setSelectedEmailId] = useState(null);

    // Fetch all subscribed emails
    const handleFetch = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-subscribe-newsletter-email');
            console.log(res.data)
            setEmails(res.data);
        } catch (error) {
            console.error('There was an error fetching the subscribed emails!', error);
        }
    };

    // Handle delete email
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:9000/api/v1/delete-newsletter-email/${selectedEmailId}`);
            handleFetch();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('There was an error deleting the email!', error);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Subscribed Emails</h1>
            <Link
                to="/Send-Mails"
                className="btn btn-primary mb-4"

            >
                Send Offer On Email
            </Link>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {emails.map((email, index) => (
                        <tr key={email._id}>
                            <td>{index + 1}</td>
                            <td>{email.email}</td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        setSelectedEmailId(email._id);
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

            {/* Delete Modal */}
            <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Email</h5>
                            <button type="button" className="close" onClick={() => setShowDeleteModal(false)}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this email?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Close</button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AllNewsSubscribedEmail;
