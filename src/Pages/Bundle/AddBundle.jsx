import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from 'jodit-react';
import Select from 'react-select'; // Importing react-select

const AddBundle = () => {
  const editor = useRef(null);
  const [allTag, setAllTag] = useState([])
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]); // State to hold courses
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    bundleName: '',
    bundleStartingPrice: '',
    bundleEndingPrice: '',
    categoryId: '',
    bundleCourseId: [],
    tag: '',
    bundleDescription: '',
    bundleImage: null,
    bundleMode: [],
    feature: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);

    setFormData((prevFormData) => ({
      ...prevFormData,
      bundleImage: file
    }));

    setImagePreview(preview);
  };

  // Fetch courses based on the selected category
  const handleCategoryChange = async (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      categoryId: value,
    }));

    if (value) {
      try {
        const res = await axios.get(`http://localhost:9000/api/v1/get-courses-by-category/${value}`);
        // console.log(res.data.data)
        setCourses(res.data.data); // Update courses based on the selected category
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    } else {
      setCourses([]);
    }
  };

  // Handle multi-select for courses
  const handleCourseChange = (selectedOptions) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      bundleCourseId: selectedOptions.map(option => option.value) // Update bundleCourseId with selected course IDs
    }));
  };

  // Handle other input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateDiscountedPrice = (price, discountPercent) => {
    const discount = (price * discountPercent) / 100;
    return price - discount;
  };

  // Handle changes in bundle mode inputs
  const handleBundleModeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBundleMode = [...formData.bundleMode];
    updatedBundleMode[index] = {
      ...updatedBundleMode[index],
      [name]: value
    };

    // Calculate the discounted price when price or discount percent changes
    if (name === 'coursePrice' || name === 'courseDiscountPercent') {
      const price = parseFloat(updatedBundleMode[index].coursePrice) || 0;
      const discountPercent = parseFloat(updatedBundleMode[index].courseDiscountPercent) || 0;
      updatedBundleMode[index].coursePriceAfterDiscount = calculateDiscountedPrice(price, discountPercent);
    }

    if (name === 'modeType' && value !== 'Google Drive') {
      updatedBundleMode[index].courseLink = '';
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      bundleMode: updatedBundleMode
    }));
  };

  // Add a new bundle mode
  const addBundleMode = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      bundleMode: [...prevFormData.bundleMode, { modeType: 'Live', coursePrice: '', coursePriceAfterDiscount: '', courseDiscountPercent: '', courseLink: '' }]
    }));
  };

  // Remove a bundle mode
  const removeBundleMode = (index) => {
    const updatedBundleMode = [...formData.bundleMode];
    updatedBundleMode.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      bundleMode: updatedBundleMode
    }));
  };

  // Fetch categories for the dropdown
  const handleFetch = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-category');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFetchTag = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-tag')
      setAllTag(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleFetchTag();
    handleFetch();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (key === 'bundleMode' || key === 'bundleCourseId') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'bundleImage') {
          if (formData.bundleImage) {
            formDataToSend.append('bundleImage', formData.bundleImage);
          }
        } else {
          formDataToSend.append(key, key === 'bundleCourseId' ? JSON.stringify(formData[key]) : formData[key]);
        }
      }

      const response = await axios.post('http://localhost:9000/api/v1/create-bundle', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Bundle Added Successfully');
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An Error Occurred');
      setIsLoading(false);
    }
  };

  const editorConfig = {
    readonly: false,
    height: 400
  };

  // Handle changes in the JoditEditor
  const handleEditorChange = useCallback((newContent) => {
    setFormData(prevFormData => ({ ...prevFormData, bundleDescription: newContent }));
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Bundle</h4>
        </div>
        <div className="links">
          <Link to="/all-bundle" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="categoryId" className="form-label">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              className="form-select"
              onChange={handleCategoryChange}
              value={formData.categoryId}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.categoryName}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="tag" className="form-label">Tag</label>
            <select
              className="form-select"
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
            >
              <option value="">Select Tag</option>
              {
                allTag && allTag.map((item, index) => (
                  <option key={index} value={item._id}>{item.tagName}</option>
                ))
              }
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleName" className="form-label">Bundle Name</label>
            <input
              type="text"
              className="form-control"
              id="bundleName"
              name="bundleName"
              value={formData.bundleName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleStartingPrice" className="form-label">Bundle Starting Price</label>
            <input
              type="number"
              className="form-control"
              id="bundleStartingPrice"
              name="bundleStartingPrice"
              value={formData.bundleStartingPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleEndingPrice" className="form-label">Bundle Ending Price</label>
            <input
              type="number"
              className="form-control"
              id="bundleEndingPrice"
              name="bundleEndingPrice"
              value={formData.bundleEndingPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleImage" className="form-label">Bundle Image</label>
            <input
              type="file"
              className="form-control"
              id="bundleImage"
              name="bundleImage"
              onChange={handleFileChange}
            />
            {imagePreview && <img style={{ width: '80px', height: '80px' }} src={imagePreview} alt="Bundle Preview" className="img-preview mt-2" />}
          </div>

          <div className="col-md-6">
            <label htmlFor="bundleCourseId" className="form-label">Select Courses</label>
            <Select
              id="bundleCourseId"
              name="bundleCourseId"
              options={courses.map(course => ({ value: course._id, label: course.courseName }))}
              isMulti
              onChange={handleCourseChange}
              value={courses.filter(course => formData.bundleCourseId.includes(course._id)).map(course => ({ value: course._id, label: course.courseName }))}
            />
          </div>

          {formData.bundleMode.map((mode, index) => (
            <div key={index} className="bundle-mode">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor={`modeType-${index}`} className="form-label">Mode Type</label>
                  <select
                    id={`modeType-${index}`}
                    name="modeType"
                    className="form-select"
                    value={mode.modeType}
                    onChange={(e) => handleBundleModeChange(index, e)}
                  >
                    <option value="Live">Live</option>
                    <option value="Recorded">Recorded</option>
                    <option value="Google Drive">Google Drive</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                {mode.modeType !== 'Google Drive' && (
                  <>
                    <div className="col-md-6">
                      <label htmlFor={`coursePrice-${index}`} className="form-label">Course Price</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`coursePrice-${index}`}
                        name="coursePrice"
                        value={mode.coursePrice}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`coursePriceAfterDiscount-${index}`} className="form-label">Course Price After Discount</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`coursePriceAfterDiscount-${index}`}
                        name="coursePriceAfterDiscount"
                        value={mode.coursePriceAfterDiscount}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`courseDiscountPercent-${index}`} className="form-label">Course Discount Percent</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`courseDiscountPercent-${index}`}
                        name="courseDiscountPercent"
                        value={mode.courseDiscountPercent}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                  </>
                )}
                {mode.modeType === 'Google Drive' && (

                  <>
                    <div className="col-md-6">
                      <label htmlFor={`coursePrice-${index}`} className="form-label">Course Price</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`coursePrice-${index}`}
                        name="coursePrice"
                        value={mode.coursePrice}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`coursePriceAfterDiscount-${index}`} className="form-label">Course Price After Discount</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`coursePriceAfterDiscount-${index}`}
                        name="coursePriceAfterDiscount"
                        value={mode.coursePriceAfterDiscount}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`courseDiscountPercent-${index}`} className="form-label">Course Discount Percent</label>
                      <input
                        type="number"
                        className="form-control"
                        id={`courseDiscountPercent-${index}`}
                        name="courseDiscountPercent"
                        value={mode.courseDiscountPercent}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`courseLink-${index}`} className="form-label">Course Link</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`courseLink-${index}`}
                        name="courseLink"
                        value={mode.courseLink}
                        onChange={(e) => handleBundleModeChange(index, e)}
                      />
                    </div>
                  </>


                )}
                <div className="col-md-12 mt-3">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeBundleMode(index)}
                  >
                    Remove Mode
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="col-md-12 mt-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={addBundleMode}
            >
              Add Mode
            </button>
          </div>

          <div className="col-md-12 mt-3">
            <label htmlFor="bundleDescription" className="form-label">Bundle Description</label>
            <JoditEditor
              ref={editor}
              value={formData.bundleDescription}
              config={editorConfig}
              onBlur={(newContent) => handleEditorChange(newContent)}
            />
          </div>

          <div className="col-md-12 mt-3">
            <label className="form-check-label">
              <input
                type="checkbox"
                name="feature"
                checked={formData.feature}
                onChange={handleChange}
              />
              Feature this bundle
            </label>
          </div>

          <div className="col-md-12 mt-3">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Bundle'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBundle;
