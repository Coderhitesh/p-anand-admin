import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllPartners = () => {
  const [logos, setLogos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedLogoId, setSelectedLogoId] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch logos
  const handleFetch = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-company-logos');
      setLogos(res.data.data || []);
    } catch (error) {
      console.error('There was an error fetching the logos!', error);
    }
  };

  // Handle delete logo
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:9000/api/v1/delete-company-logo/${selectedLogoId}`);
      handleFetch();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('There was an error deleting the logo!', error);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle upload logo
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      await axios.post('http://localhost:9000/api/v1/upload-logo-of-Company', formData);
      handleFetch();
      setShowUploadModal(false);
    } catch (error) {
      console.error('There was an error uploading the logo!', error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">All Partners</h1>
      <button className="btn btn-primary mb-3" onClick={() => setShowUploadModal(true)}>Upload Logo</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Logo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logos.map((logo, index) => (
            <tr key={logo._id}>
              <td>{index + 1}</td>
              <td>
                <img src={logo.image.url} alt="Logo" style={{ height: '50px', width: 'auto' }} />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setSelectedLogoId(logo.image.public_id);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Logo</h5>
              <button type="button" className="close" onClick={() => setShowDeleteModal(false)}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this logo?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Close</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <div className={`modal fade ${showUploadModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showUploadModal ? 'block' : 'none' }} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload Logo</h5>
              <button type="button" className="close" onClick={() => setShowUploadModal(false)}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input type="file" name='image' className="form-control" onChange={handleFileChange} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleUpload}>Upload</button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AllPartners;
