import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function AddTeacher() {
  const [categories, setCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    teacherName: '',
    teacherEmail: '',
    teacherQualification: '',
    teacherExperience: '',
    teacherAbout: '',
    teacherExpertise: '',
    currentlyGivingcourse: [],
    teacherImage: null,
    categoryId: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all categories
  const handleFetchCategory = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-category');
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-course');
      setAllCourses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter courses based on selected category
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    // Filter courses based on selected category
    const filtered = allCourses.filter(course => course.courseCategory === categoryId);
    setFilteredCourses(filtered);
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map(option => option.value);
    setFormData(prevData => ({
      ...prevData,
      currentlyGivingcourse: selectedIds
    }));
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    let updatedFormData = { ...formData };

    if (type === 'file') {
      updatedFormData.teacherImage = event.target.files[0];
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  useEffect(() => {
    handleFetchCategory();
    fetchCourses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('teacherName', formData.teacherName);
    data.append('teacherEmail', formData.teacherEmail);
    data.append('teacherQualification', formData.teacherQualification);
    data.append('teacherExperience', formData.teacherExperience);
    data.append('teacherAbout', formData.teacherAbout);
    data.append('teacherExpertise', formData.teacherExpertise);
    data.append('teacherImage', formData.teacherImage);
    data.append('categoryId', selectedCategory);

    formData.currentlyGivingcourse.forEach((courseId) => {
      data.append('currentlyGivingcourse', courseId);
    });

    try {
      const response = await axios.post('http://localhost:9000/api/v1/create-teacher', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsLoading(false);
      toast.success("Teacher Added Successfully !!");
      window.location.href = '/all-teacher';
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error);
      toast.error(error.response?.data?.msg || 'An error occurred');
    }
  };

  const courseOptions = filteredCourses.map(course => ({
    value: course._id,
    label: course.courseName,
  }));

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Teacher</h4>
        </div>
        <div className="links">
          <Link to="/all-teacher" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="teacherName" className="form-label">Teacher Name</label>
            <input type="text" onChange={handleChange} name='teacherName' value={formData.teacherName} className="form-control" id="teacherName" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="teacherImage" className="form-label">Teacher Image</label>
            <input type="file" onChange={handleChange} name='teacherImage' className="form-control" id="teacherImage" />
          </div>
          <div className="col-md-6">
            <label htmlFor="teacherEmail" className="form-label">Teacher Email</label>
            <input type="email" onChange={handleChange} name='teacherEmail' value={formData.teacherEmail} className="form-control" id="teacherEmail" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="teacherQualification" className="form-label">Teacher Qualification</label>
            <input type="text" onChange={handleChange} name='teacherQualification' value={formData.teacherQualification} className="form-control" id="teacherQualification" />
          </div>
          <div className="col-md-6">
            <label htmlFor="teacherExperience" className="form-label">Teacher Experience (in years)</label>
            <input type="number" onChange={handleChange} name='teacherExperience' value={formData.teacherExperience} className="form-control" id="teacherExperience" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="teacherExpertise" className="form-label">Teacher Expertise</label>
            <input type="text" onChange={handleChange} name='teacherExpertise' value={formData.teacherExpertise} className="form-control" id="teacherExpertise" />
          </div>

          <div className="col-md-6">
            <label htmlFor="categoryId" className="form-label">Category</label>
            <select
              name="categoryId"
              className="form-select"
              id="categoryId"
              value={selectedCategory}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Choose Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category._id}>{category.categoryName}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="currentlyGivingcourse" className="form-label">Courses Taught by Teacher</label>
            <Select
              onChange={handleSelectChange}
              isMulti
              options={courseOptions}
            />
          </div>

          <div className="col-md-12">
            <label htmlFor="teacherAbout" className="form-label">Teacher About</label>
            <input type="text" onChange={handleChange} name='teacherAbout' value={formData.teacherAbout} className="form-control" id="teacherAbout" />
          </div>

          <div className="col-12 text-center">
            <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
              {isLoading ? "Please Wait..." : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTeacher;
