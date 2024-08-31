import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllTeacher() {
    const [teacher, setTeacher] = useState([]);
    const [category,setCategory] = useState([])
    const [courseIdToNameMap, setCourseIdToNameMap] = useState({});
    const [teacherRatings, setTeacherRatings] = useState({});

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState('1');
    const itemPerPage = 8;

    const handleFetchCategory = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-category')
            setCategory(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    // Fetch all teachers
    const handleFetchTeachers = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-teacher');
            const reverseData = res.data.data.reverse();
            setTeacher(reverseData);
        } catch (error) {
            console.error('There was an error fetching the teachers!', error);
        }
    };

    // Fetch all courses and create a mapping of course IDs to course names
    const handleFetchCourses = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-course');
            const fetchedCourses = res.data.data;
            const courseMap = fetchedCourses.reduce((map, courseItem) => {
                map[courseItem._id] = courseItem.courseName;
                return map;
            }, {});
            setCourseIdToNameMap(courseMap);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch all teacher ratings and map them to teachers
    const handleFetchRatings = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/get-all-teacher-rating');
            const fetchedRatings = res.data.data;

            // Create a mapping of teacher ID to their ratings and rating count
            const ratingsMap = teacher.reduce((map, teacherItem) => {
                const relevantRatings = fetchedRatings.filter(rating =>
                    rating.teacherId === teacherItem._id
                );

                const totalRating = relevantRatings.reduce((acc, rating) => acc + rating.rating, 0);
                const ratingCount = relevantRatings.length;
                const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 'N/A';

                map[teacherItem._id] = {
                    rating: averageRating,
                    ratingCount: ratingCount
                };
                return map;
            }, {});

            setTeacherRatings(ratingsMap);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                    await axios.delete(`http://localhost:9000/api/v1/delete-teacher/${id}`);
                    toast.success("Teacher Deleted Successfully");
                    handleFetchTeachers();
                    Swal.fire("Deleted!", "The teacher has been deleted.", "success");
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    useEffect(() => {
        handleFetchCategory();
        handleFetchCourses();
        handleFetchTeachers();
    }, []);

    const getCategoryNameById = (categoryeId) => {
        const foundCategory = category.find(categorie => categorie._id === categoryeId);
        return foundCategory ? foundCategory.categoryName : "Unknown Category";
    };

    useEffect(() => {
        if (teacher.length > 0) {
            handleFetchRatings();
        }
    }, [teacher]);

    // --- Pagination ---
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = teacher.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Teacher List </h4>
                </div>
                <div className="links">
                    <Link to="/add-teacher" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
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
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Teacher Name</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Email</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Qualification</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Experience</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">About</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Image</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Rating</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Rating Count</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Expertise</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Course Category</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Giving Courses</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Edit</th>
                            <th style={{ whiteSpace: 'nowrap' }} scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((teacher, index) => {
                            const coursesArray = Array.isArray(teacher.currentlyGivingcourse)
                                ? teacher.currentlyGivingcourse
                                : [teacher.currentlyGivingcourse];

                            const filteredCourses = coursesArray.filter(courseId => courseIdToNameMap[courseId]);

                            const teacherRating = teacherRatings[teacher._id]?.rating || 'N/A';
                            const teacherRatingCount = teacherRatings[teacher._id]?.ratingCount || 0;

                            return (
                                <tr key={teacher._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{teacher.teacherName}</td>
                                    <td>{teacher.teacherEmail}</td>
                                    <td>{teacher.teacherQualification}</td>
                                    <td>{teacher.teacherExperience}</td>
                                    <td>{teacher.teacherAbout.substring(0, 14) + '....'}</td>
                                    <td><img src={teacher.teacherImage.url} alt={teacher.teacherName} style={{ width: '50px', height: '50px' }} /></td>
                                    <td>{teacherRating}</td>
                                    <td>{teacherRatingCount}</td>
                                    <td>{teacher.teacherExpertise.join(', ')}</td>
                                    <td>{getCategoryNameById(teacher.categoryId)}</td>
                                    <td>
                                        {filteredCourses.length > 0
                                            ? filteredCourses.map(courseId => courseIdToNameMap[courseId]).join(', ')
                                            : 'No course available'
                                        }
                                    </td>
                                    <td>
                                        <Link style={{whiteSpace:"nowrap"}} to={`/edit-teacher/${teacher._id}`} className="bt edit">
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link style={{whiteSpace:'nowrap'}} onClick={() => handleDelete(teacher._id)} className="bt delete">
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(teacher.length / itemPerPage) }, (_, i) => (
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

export default AllTeacher;
