import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCourseRating() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseId: '',
    rating: ''
  });
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-course');
      setCourses(res.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchCourseRating = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/v1/get-single-course-rating/${id}`);
      setFormData({
        courseId: res.data.data.courseId,
        rating: res.data.data.rating
      });
    } catch (error) {
      console.error('Error fetching course rating:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCourseRating();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.courseId) {
      toast.error('Please select a course.');
      return;
    }

    const ratingNumber = parseFloat(formData.rating);
    if (!formData.rating || isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      toast.error('Please enter a valid rating between 1 and 5.');
      return;
    }

    setIsLoading(true);

    try {
      await axios.put(`http://localhost:9000/api/v1/update-course-rating/${id}`, {
        courseId: formData.courseId,
        rating: formData.rating
      });
      setIsLoading(false);
      toast.success('Course Rating Updated Successfully!');
      navigate('/all-course-rating');
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating course rating:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Course Rating</h4>
        </div>
        <div className="links">
          <Link to="/all-course-rating" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="courseId" className="form-label">
              Course Name
            </label>
            <select
              name="courseId"
              className="form-select"
              id="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
            >
              <option value="">Choose Course</option>
              {courses &&
                courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <input
              type="number"
              name="rating"
              className="form-control"
              id="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              min="1"
              max="5"
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" disabled={isLoading} className={`btn ${isLoading ? 'not-allowed' : 'allowed'}`}>
              {isLoading ? 'Please Wait...' : 'Update Rating'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditCourseRating;
