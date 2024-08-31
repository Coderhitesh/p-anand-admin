import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EddTeacherRate() {
  const { id } = useParams(); // Get the teacher rating ID from the URL
  const [teacher, setTeacher] = useState([]);
  const [formData, setFormData] = useState({
    teacherId: "",
    rating: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all teachers
  const handleFetchingTeacher = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-teacher');
      console.log(res.data.data);
      setTeacher(res.data.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  // Fetch the single teacher rating data
  const fetchTeacherRating = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/v1/get-single-teacher-rating/${id}`);
      const ratingData = res.data.data;
      setFormData({
        teacherId: ratingData.teacherId,
        rating: ratingData.rating
      });
    } catch (error) {
      console.error('Error fetching teacher rating:', error);
    }
  };

  useEffect(() => {
    handleFetchingTeacher();
    fetchTeacherRating();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.teacherId) {
      toast.error('Please select a teacher.');
      return;
    }

    const ratingNumber = parseFloat(formData.rating);
    if (!formData.rating || isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      toast.error('Please enter a valid rating between 1 and 5.');
      return;
    }

    setIsLoading(true);

    const data = {
      teacherId: formData.teacherId,
      rating: formData.rating,
    };

    try {
      await axios.put(`http://localhost:9000/api/v1/update-teacher-rating/${id}`, data);
      setIsLoading(false);
      toast.success("Rating Updated Successfully!");
      window.location.href = '/all-teacher-rating';
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error);
      toast.error(error.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Teacher Rating</h4>
        </div>
        <div className="links">
          <Link to="/all-teacher-rating" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="teacherId" className="form-label">Teacher Name</label>
            <select
              name="teacherId"
              className="form-select"
              id="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              required
            >
              <option value="">Choose Teacher</option>
              {teacher && teacher.map((item, index) => (
                <option key={index} value={item._id}>{item.teacherName}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="rating" className="form-label">Rating</label>
            <input
              type="text"
              name="rating"
              className="form-control"
              id="rating"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" disabled={isLoading} className={`btn ${isLoading ? 'not-allowed' : 'allowed'}`}>
              {isLoading ? "Please Wait..." : "Update Rating"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EddTeacherRate;
