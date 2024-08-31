import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const CreateVoucher = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        CouponCode: '',
        descountpercent: '',
        isActive: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.CouponCode || !formData.descountpercent) {
            toast.error('Please submit all fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:9000/api/v1/createVouncher', formData);
            console.log(response.data);
            toast.success('Coupon Code Generated Successfully');
            setIsLoading(false);
            // navigate('/all-voucher');
        } catch (error) {
            console.error("Error creating voucher:", error);
            toast.error(error.response?.data?.error || "Internal Server Error");
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Create Voucher</h4>
                </div>
                <div className="links">
                    <Link to="/all-voucher" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label className="form-label">Coupon Code</label>
                        <input
                            type="text"
                            name="CouponCode"
                            value={formData.CouponCode}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Discount Percentage</label>
                        <input
                            type="number"
                            name="descountpercent"
                            value={formData.descountpercent}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6 form-check">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="form-check-input"
                        />
                        <label className="form-check-label">Active</label>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Create Voucher"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateVoucher;
