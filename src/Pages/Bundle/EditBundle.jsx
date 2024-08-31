import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function EditBundle() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    bundleName: '',
    bundleTotalPrice: '',
    bundleDiscountPrice: '',
    bundleDisCountPercenatgae: '',
    bundleCourseId: [],
    bundleImage: null,
    categoryId: ''
  });

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file && file.size > 0) {
      const preview = URL.createObjectURL(file);
      setFormData(prevFormData => ({
        ...prevFormData,
        [fieldName]: file
      }));
      if (fieldName === 'bundleImage') {
        setImagePreview(preview);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: val
    }));
  };

  const handleSelectChange = (selectedOptions, fieldName) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: selectedValues
    }));
    if (fieldName === 'bundleCourseId') {
      setSelectedCourses(selectedOptions);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-category');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-course');
      setCourses(res.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  const fetchSingleBundle = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/v1/single-bundle/${id}`);
      const data = res.data.data;
      setFormData({
        bundleName: data.bundleName,
        bundleTotalPrice: data.bundleTotalPrice,
        bundleDiscountPrice: data.bundleDiscountPrice,
        bundleDisCountPercenatgae: data.bundleDisCountPercenatgae,
        bundleCourseId: data.bundleCourseId.map(course => course._id),
        bundleImage: data.bundleImage ? data.bundleImage.url : null,
        categoryId: data.categoryId || ''
      });
      if (data.bundleImage) {
        setImagePreview(data.bundleImage.url);
      }
      const selectedCoursesData = data.bundleCourseId.map(courseId => ({
        value: courseId,
        label: courses.find(course => course._id === courseId)?.courseName
      }));
      setSelectedCourses(selectedCoursesData);
    } catch (error) {
      console.error('Error fetching bundle:', error);
    }
  }, [id, courses]);

  useEffect(() => {
    fetchSingleBundle();
    fetchCourses();
    fetchCategories();
  }, [fetchSingleBundle, fetchCourses, fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.bundleName || !formData.bundleTotalPrice || !formData.bundleDiscountPrice || !formData.bundleDisCountPercenatgae || !formData.categoryId) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'bundleCourseId') {
            formData[key].forEach(id => formDataToSend.append('bundleCourseId[]', id));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      }

      if (formData.bundleImage && formData.bundleImage instanceof File) {
        formDataToSend.append('bundleImage', formData.bundleImage);
      }

      await axios.put(`http://localhost:9000/api/v1/update-bundle/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Bundle Updated Successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while updating the bundle.');
    } finally {
      setIsLoading(false);
    }
  };

  // Category options
  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.categoryName,
  }));

  // Course options
  const courseOptions = courses.map(course => ({
    value: course._id,
    label: course.courseName,
  }));

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Bundle</h4>
        </div>
        <div className="links">
          <Link to="/all-bundle" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="bundleName" className="form-label">Bundle Name</label>
            <input onChange={handleChange} type="text" className="form-control" name="bundleName" id="bundleName" value={formData.bundleName} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="bundleCourseId" className="form-label">Courses</label>
            <Select
              isMulti
              name="bundleCourseId"
              options={courseOptions}
              onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'bundleCourseId')}
              value={selectedCourses}
            />
            <div>
              <h5>Selected Courses:</h5>
              <ul>
                {selectedCourses.map(course => (
                  <li key={course.value}>{course.label}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleTotalPrice" className="form-label">Total Price</label>
            <input onChange={handleChange} type="number" className="form-control" name="bundleTotalPrice" id="bundleTotalPrice" value={formData.bundleTotalPrice} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="bundleDisCountPercenatgae" className="form-label">Discount Percentage</label>
            <input onChange={handleChange} type="number" className="form-control" name="bundleDisCountPercenatgae" id="bundleDisCountPercenatgae" value={formData.bundleDisCountPercenatgae} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="bundleDiscountPrice" className="form-label">Discount Price</label>
            <input onChange={handleChange} type="number" className="form-control" name="bundleDiscountPrice" id="bundleDiscountPrice" value={formData.bundleDiscountPrice} required />
          </div>

          <div className="col-md-6">
            <label htmlFor="category" className="form-label">Category</label>
            <Select
              name="categoryId"
              options={categoryOptions}
              onChange={(selectedOption) => setFormData(prevData => ({
                ...prevData,
                categoryId: selectedOption ? selectedOption.value : ''
              }))}
              value={categoryOptions.find(option => option.value === formData.categoryId)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleImage" className="form-label">Bundle Image</label>
            <input onChange={(e) => handleFileChange(e, 'bundleImage')} type="file" className="form-control" name="bundleImage" id="bundleImage" />
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '150px', marginTop: '10px' }} />}
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Bundle'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditBundle;
