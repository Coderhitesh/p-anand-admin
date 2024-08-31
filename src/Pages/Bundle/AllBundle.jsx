import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllBundle() {
    const [bundle, setBundle] = useState([]);
    const [course, setCourse] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedModes, setSelectedModes] = useState({}); // State to keep track of selected modes

    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 8;

    const handleFetchBundle = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/api/v1/get-all-Bundles`);
            const reverseData = res.data.data.reverse();
            setBundle(reverseData);
        } catch (error) {
            console.error('There was an error fetching the bundles!', error);
        }
    };

    const handleFechCourse = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-course');
            setCourse(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFetchCategory = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-category');
            setCategory(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(bundle.length / itemPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const indexOfLastItem = Math.min(currentPage * itemPerPage, bundle.length);
    const indexOfFirstItem = Math.max(indexOfLastItem - itemPerPage, 0);
    const currentItems = bundle.slice(indexOfFirstItem, indexOfLastItem);

    const getCourseNamesByIds = (courseIds) => {
        const courseIdArray = Array.isArray(courseIds) ? courseIds : [courseIds];
        const courseNames = courseIdArray
            .map((courseId) => {
                const foundCourse = course.find((c) => c._id === courseId.id);
                return foundCourse ? foundCourse.courseName : null;
            })
            .filter(courseName => courseName !== null);

        return courseNames.length > 0 ? courseNames.join(', ') : 'No Courses Available';
    };

    const getCategoryNameById = (categoryId) => {
        const foundCategory = category.find(categorie => categorie._id === categoryId);
        return foundCategory ? foundCategory.categoryName : "Unknown Category";
    };

    const handleModeChange = (bundleId, selectedModeId) => {
        setSelectedModes(prevState => ({
            ...prevState,
            [bundleId]: selectedModeId
        }));
    };

    useEffect(() => {
        handleFetchCategory();
        handleFechCourse();
        handleFetchBundle();
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
                    await axios.delete(`http://localhost:9000/api/v1/delete-bundle/${id}`);
                    toast.success("Bundle Deleted Successfully");
                    handleFetchBundle();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Bundle List </h4>
                </div>
                <div className="links">
                    <Link to="/add-bundle" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <div className="filteration">
                <div className="selects"></div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="d-table-h">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Sr.No.</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Bundle Name</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Category</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Course</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Image</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Starting Price</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Ending Price</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Bundle Mode</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Bundle Price</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Bundle Final Price</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Bundle Price Discount %</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Edit</th>
                            <th style={{whiteSpace:'nowrap'}} scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((bundle, index) => {
                            const selectedMode = bundle.bundleMode.find(mode => mode._id === selectedModes[bundle._id]);
                            return (
                                <tr key={bundle._id}>
                                    <th scope="row">{indexOfFirstItem + index + 1}</th>
                                    <td>{bundle.bundleName}</td>
                                    <td>{getCategoryNameById(bundle.categoryId)}</td>
                                    <td>{getCourseNamesByIds(bundle.bundleCourseId)}</td>
                                    <td><img src={bundle.bundleImage.url} alt={bundle.bundleName} style={{ maxWidth: '100px' }} /></td>
                                    <td>{bundle.bundleStartingPrice}</td>
                                    <td>{bundle.bundleEndingPrice}</td>
                                    <td>
                                        <select
                                            value={selectedModes[bundle._id] || ''}
                                            onChange={(e) => handleModeChange(bundle._id, e.target.value)}
                                        >
                                            <option value="">Select Mode</option>
                                            {bundle.bundleMode.map((mode) => (
                                                <option key={mode._id} value={mode._id}>
                                                    {mode.modeType}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedModes[bundle._id] && selectedMode && (
                                            <div>
                                                {/* <strong>Price After Discount:</strong> {selectedMode.coursePriceAfterDiscount} <br />
                                                <strong>Discount %:</strong> {selectedMode.courseDiscountPercent}% <br /> */}
                                                {selectedMode.courseLink && (
                                                    <div>
                                                        <strong>Course Link:</strong>{' '}
                                                        <a href={selectedMode.courseLink} target="_blank" rel="noopener noreferrer">
                                                            Open Link
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td>{selectedMode ? selectedMode.coursePriceAfterDiscount : bundle.bundleTotalPrice}</td>
                                    <td>{selectedMode ? selectedMode.coursePriceAfterDiscount : bundle.bundleDiscountPrice}</td>
                                    <td>{selectedMode ? selectedMode.courseDiscountPercent : bundle.bundleDisCountPercenatgae}</td>
                                    <td>
                                        <Link style={{whiteSpace:'nowrap'}} to={`/edit-bundle/${bundle._id}`} className="bt edit">Edit <i className="fa-solid fa-pen-to-square"></i></Link>
                                    </td>
                                    <td>
                                        <button style={{whiteSpace:'nowrap'}} onClick={() => handleDelete(bundle._id)} className="bt delete">Delete <i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(bundle.length / itemPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>
        </>
    );
}

export default AllBundle;
