import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllContacts = () => {
    const backend = 'http://localhost:9000/api/v1/get-contact';
    const deleteRoute = 'http://localhost:9000/api/v1/delete-contact/';
    const addMessageRoute = 'http://localhost:9000/api/v1/push-Message/';

    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContactId, setCurrentContactId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get(backend);
            setContacts(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch contacts');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${deleteRoute}${id}`);
            toast.success('Contact deleted successfully');
            fetchContacts();
        } catch (error) {
            toast.error('Failed to delete contact');
        }
    };

    const handleOpenModal = (id) => {
        setCurrentContactId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMessage('');
    };

    const handleAddMessage = async () => {
        try {
            await axios.post(`${addMessageRoute}${currentContactId}`, { AnyMessageByAdmin: message });
            toast.success('Message added successfully');
            handleCloseModal();
            fetchContacts();
        } catch (error) {
            toast.error('Failed to add message');
        }
    };

    // Pagination logic
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <ToastContainer />

            <h1 className="mb-4">All Contacts</h1>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Contact Number</th>
                        <th>ReSolve This</th>
                        <th>Admin Message</th>

                        <th>Message</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentContacts.map((contact, index) => (
                        <tr key={contact._id}>
                            <td>{index + 1}</td>
                            <td>{contact.Email}</td>
                            <td>{contact.Name}</td>
                            <td>{contact.ContactNumber}</td>
                            <td>{contact.isContact ? 'Yes' : 'No'}</td>
                            <td>{contact.AnyMessageByAdmin || 'No Message'}</td>


                            <td>{contact.Message}</td>
                            <td>
                                <button
                                    className="btn btn-danger me-2"
                                    onClick={() => handleDelete(contact._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleOpenModal(contact._id)}
                                >
                                    Add Message
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <nav>
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(contacts.length / contactsPerPage) }, (_, index) => (
                        <li key={index + 1} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                            <a onClick={() => paginate(index + 1)} className="page-link" href="#">
                                {index + 1}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={`model ${isModalOpen ? 'show' : 'fade'}`} id="addMessageModal" tabIndex="-1" role="dialog" aria-labelledby="addMessageModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addMessageModalLabel">Add Message</h5>
                            <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                className="form-control"
                                rows="5"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleAddMessage}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllContacts;
