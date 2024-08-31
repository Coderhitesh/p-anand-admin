import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

function AllBook() {
    const [teacher,setTeacher] = useState([])
    const [course, setCourse] = useState([]);
    const [category, setCategory] = useState([]);
    const [tags, setTags] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 6;

    const handleFetchCourses = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-book');
            const reverseData = res.data.data.reverse();
            setCourse(reverseData);
            paginateData(reverseData, currentPage);
        } catch (error) {
            console.error('There was an error fetching the courses!', error);
        }
    };

    const handleFetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-book-category');
            setCategory(res.data.data);
        } catch (error) {
            console.error('There was an error fetching the categories!', error);
        }
    };

    const handleFetchTeacher = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-teacher')
            setTeacher(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFetchTags = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-book-tag');
            setTags(res.data.data);
        } catch (error) {
            console.error('There was an error fetching the tags!', error);
        }
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
                    await axios.delete(`http://localhost:9000/api/v1/delete-book/${id}`);
                    toast.success("Course Deleted Successfully");
                    handleFetchCourses(); // Re-fetch courses after deletion
                    Swal.fire({
                        title: "Deleted!",
                        text: "The course has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    const toggleFeatureStatus = async (courseId, currentStatus) => {
        try {
            const updatedStatus = !currentStatus;
            await axios.put(`http://localhost:9000/api/v1/update-book-feature/${courseId}`, { feature: updatedStatus });
            handleFetchCourses(); // Refresh the course list to reflect changes
            toast.success("Course feature status updated successfully!");
        } catch (error) {
            console.error('Error updating feature status:', error);
            toast.error("Failed to update course feature status.");
        }
    };

    const paginateData = (data, pageNumber) => {
        const indexOfLastItem = pageNumber * itemPerPage;
        const indexOfFirstItem = indexOfLastItem - itemPerPage;
        setCurrentItems(data.slice(indexOfFirstItem, indexOfLastItem));
    };

    const getCategoryNameById = (categoryId) => {
        const foundCategory = category.find(cat => cat._id === categoryId);
        return foundCategory ? foundCategory.categoryName : "No Category";
    };

    const getTagNameById = (tagId) => {
        // console.log(tagId)
        const foundTag = tags.find(tag => tag._id === tagId);
        // console.log(tags.map((item)=>item._id))
        return foundTag ? foundTag.tagName : "No Tag";
    };

    const getTeacehrById = (teacherId) => {
        const foundTeacher = teacher.find(teacher => teacher._id === teacherId);
        return foundTeacher ? foundTeacher.teacherName : "No Teacher";
    };

    useEffect(() => {
        handleFetchTeacher();
        handleFetchCourses();
        handleFetchCategories();
        handleFetchTags(); // Fetch tags when the component loads
    }, []);

    useEffect(() => {
        paginateData(course, currentPage);
    }, [course, currentPage]);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        paginateData(course, pageNumber);
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Course List</h4>
                </div>
                <div className="links">
                    <Link to="/add-book" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <div className="filteration">
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="table-responsive d-table-h table-container">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Sr.No.</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Book Name</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Category</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Sub Category</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Description</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Book Image</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Price</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Discount %</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">After Discount Price</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Tag</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Feature</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Rating</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Rating Count</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Edit</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((course, index) => (
                            <tr key={course._id}>
                                <th scope="row">{(currentPage - 1) * itemPerPage + index + 1}</th>
                                <td>{course.bookName.substring(0, 20) + '....'}</td>
                                <td>{getCategoryNameById(course.bookCategory)}</td>
                                <td>{course.bookSubCategory}</td>
                                <td>{course.bookDescription.substring(0, 14) + '....'}</td>
                                <td><img src={course.bookImage.url} alt={course.bookName} style={{ width: '50px', height: '50px' }} /></td>
                                <td>{course.bookPrice}</td>
                                <td>{course.bookDiscountPresent}</td>
                                <td>{course.bookAfterDiscount}</td>
                                <td>{getTagNameById(course.bookTagName)}</td>
                                <td>
                                    <BootstrapSwitchButton
                                        checked={course.feature}
                                        onlabel="Yes"
                                        offlabel="No"
                                        onChange={() => toggleFeatureStatus(course._id, course.feature)}
                                    />
                                </td>
                                {/* <td>{courseRatings[course._id]?.rating || 'N/A'}</td>
                                <td>{courseRatings[course._id]?.ratingCount || 0}</td> */}
                                <td>{course.bookRating|| 'N/A'}</td>
                                <td>{course.bookCountRating || 0}</td>
                                <td>
                                    <Link to={`/edit-course/${course._id}`}>
                                        <button className="btn btn-info">Edit</button>
                                    </Link>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(course._id)} className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <div className="pagination justify-content-center gap-1">
                {[...Array(Math.ceil(course.length / itemPerPage)).keys()].map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageClick(number + 1)}
                        className={`${currentPage === number + 1 ? 'active' : ''} page-link `}
                    >
                        {number + 1}
                    </button>
                ))}
            </div>
        </>
    );
};

export default AllBook
