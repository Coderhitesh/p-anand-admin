import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllVideos = () => {
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [showModal, setShowModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const BackendUrl = "http://localhost:9000/api/v1";

    const handleFetch = async () => {
        try {
            const res = await axios.get(`${BackendUrl}/get-all-video`);
            const reverseData = res.data.data.reverse();
            setVideos(reverseData);
        } catch (error) {
            console.error('There was an error fetching the videos!', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = videos.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        handleFetch();
    }, []);

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${BackendUrl}/delete-video/${id}`);
                    console.log(res.data);
                    toast.success("Video Deleted Successfully");
                    handleFetch();
                    Swal.fire({
                        title: "Deleted!",
                        text: "The video has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to delete video.");
                }
            }
        });
    };

    const handleUpdate = async () => {
        try {
            const res = await axios.post(`${BackendUrl}/update-Video/${selectedVideo._id}`, selectedVideo);
            // console.log(res.data);
            toast.success("Video Updated Successfully");
            setShowModal(false);
            handleFetch();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update video.");
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Video List</h4>
                </div>
                <div className="links">
                    <Link to="/add-video" className="btn btn-primary">
                        Add New <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    {/* Add any additional filter options here */}
                </div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="d-table-h">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">VideoUrl</th>
                            <th scope="col">isActive</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((video, index) => (
                            <tr key={video._id}>
                                <th scope="row">{indexOfFirstItem + index + 1}</th>
                                <td>{video.VideoUrl.substring(0, 50) + '...'}</td>
                                <td>{video.isActive ? 'Active' : 'Inactive'}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedVideo(video);
                                            setShowModal(true);
                                        }}
                                        className="bt edit"
                                    >
                                        Edit <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(video._id)}
                                        className="bt delete"
                                    >
                                        Delete <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(videos.length / itemsPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Video</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="form-group">
                                        <label htmlFor="videoUrl">Video URL</label>
                                        <input
                                            type="text"
                                            id="videoUrl"
                                            value={selectedVideo?.VideoUrl || ''}
                                            onChange={(e) => setSelectedVideo({ ...selectedVideo, VideoUrl: e.target.value })}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="isActive">Active</label>
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={selectedVideo?.isActive || false}
                                            onChange={(e) => setSelectedVideo({ ...selectedVideo, isActive: e.target.checked })}
                                            className="form-check-input"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdate}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllVideos;
