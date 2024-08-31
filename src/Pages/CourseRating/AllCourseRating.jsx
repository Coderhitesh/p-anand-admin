import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllCourseRating() {
    const [teacherRating, setTeacherRating] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [category,setCategory] = useState([])
    const [currentItems, setCurrentItems] = useState([]);

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState('1');
    const itemPerPage = 8;

    const handleFetch = async () => {
        try {
            const resRatings = await axios.get('http://localhost:9000/api/v1/get-all-course-rating');
            const reverseData = resRatings.data.data.reverse();
            setTeacherRating(reverseData);
            paginateData(reverseData, currentPage);

            const resTeachers = await axios.get('http://localhost:9000/api/v1/get-all-course');
            setTeachers(resTeachers.data.data);

            
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    const handleFetchCAtegory = async() => {
        try {
            const resCategory = await axios.get('http://localhost:9000/api/v1/get-all-category')
            setCategory(resCategory.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginateData = (data, pageNumber) => {
        const indexOfLastItem = pageNumber * itemPerPage;
        const indexOfFirstItem = indexOfLastItem - itemPerPage;
        setCurrentItems(data.slice(indexOfFirstItem, indexOfLastItem));
    };

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
                    await axios.delete(`http://localhost:9000/api/v1/delete-course-rating/${id}`);
                    toast.success("Rating Deleted Successfully");
                    handleFetch(); // Re-fetch ratings after deletion
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

    const getTeacherNameById = (courseId) => {
        const foundTeacher = teachers.find(teacher => teacher._id === courseId);
        return foundTeacher ? foundTeacher.courseName : "Unknown Course";
    };

    const getCategoryNameById = (categoryeId) => {
        const foundCategory = category.find(categorie => categorie._id === categoryeId);
        return foundCategory ? foundCategory.categoryName : "Unknown Category";
    };

    useEffect(() => {
        handleFetchCAtegory()
        handleFetch();
    }, []);

    useEffect(() => {
        paginateData(teacherRating, currentPage);
    }, [teacherRating, currentPage]);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Course Ratings</h4>
                </div>
                <div className="links">
                    <Link to="/add-course-rating" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <div className="filteration">
                <div className="selects"></div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="d-table-h overflow-auto">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Sr.No.</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Category</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Course Name</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Rating</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Edit</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((rating, index) => (
                            <tr key={rating._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{getCategoryNameById(rating.categoryId)}</td>
                                <td>{getTeacherNameById(rating.courseId)}</td>
                                <td>{rating.rating}</td>
                                <td><Link to={`/edit-course-rating/${rating._id}`} className="bt edit">Edit <i className="fa-solid fa-pen-to-square"></i></Link></td>
                                <td><Link onClick={() => handleDelete(rating._id)} className="bt delete">Delete <i className="fa-solid fa-trash"></i></Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(teacherRating.length / itemPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>
        </>
    )
}

export default AllCourseRating;
