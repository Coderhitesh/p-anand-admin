import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditTemplate = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const editor = useRef(null);

  useEffect(() => {
    handleFetchTemplate();
  }, []);

  const handleFetchTemplate = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/v1/get-all-templates');
      const template = res.data.find((item) => item._id === id);  // Adjust '_id' if your id field name is different
      if (template) {
        setSubject(template.subject || '');
        setContent(template.message || '');
      } else {
        toast.error('Template not found.');
      }
    } catch (error) {
      console.error('There was an error fetching the templates!', error);
      toast.error('Failed to fetch the template.');
    }
  };

  const handleEditTemplate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9000/api/v1/edit-template/${id}`, {
        subject,
        message:content,
      });
      toast.success('Template updated successfully!');
       window.location.href = `/Send-Mails`
    } catch (error) {
      console.error('There was an error updating the template!', error);
      toast.error('Failed to update the template.');
    }
  };

  const handlePreview = () => {
    Swal.fire({
      title: subject,
      html: content,
      confirmButtonText: 'Close'
    });
  };

  return (
    <div className="container mt-4">
      <h2>Edit Template</h2>
      <form onSubmit={handleEditTemplate}>
        <div className="form-group mb-3">
          <label htmlFor="templateSubject">Subject</label>
          <input
            type="text"
            className="form-control"
            id="templateSubject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="templateContent">Message</label>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
            config={{
              readonly: false
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Save Template</button>
        <button type="button" className="btn btn-secondary" onClick={handlePreview}>Preview</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditTemplate;
