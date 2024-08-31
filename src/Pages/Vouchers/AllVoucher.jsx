import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllVoucher = () => {
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get('http://localhost:9000/api/v1/getAllVouncher');
                setVouchers(response.data.data);
            } catch (error) {
                console.error("Error fetching vouchers:", error);
            }
        };

        fetchVouchers();
    }, []);

    const markActive = async (id) => {
        try {
            await axios.put(`http://localhost:9000/api/v1/vouchers/activateVoucher/${id}`);
            setVouchers(vouchers.map(voucher => voucher._id === id ? { ...voucher, isActive: true } : voucher));
        } catch (error) {
            console.error("Error marking voucher as active:", error);
        }
    };

    const markInActive = async (id) => {
        try {
            await axios.put(`http://localhost:9000/api/v1/vouchers/deactivateVoucher/${id}`);
            setVouchers(vouchers.map(voucher => voucher._id === id ? { ...voucher, isActive: false } : voucher));
        } catch (error) {
            console.error("Error marking voucher as inactive:", error);
        }
    };

    const markDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9000/api/v1/deleteVouncher/${id}`);
            setVouchers(vouchers.filter(voucher => voucher._id !== id));
        } catch (error) {
            console.error("Error deleting voucher:", error);
        }
    };

    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>All Vouchers</h4>
                </div>
                <div className="links">
                    <Link to="/add-voucher" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <section className="mt-2 d-table table-responsive">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Coupon Code</th>
                            <th scope="col">Discount Percentage</th>
                            <th scope="col">Status</th>
                            <th scope="col">Mark Active</th>
                            <th scope="col">Mark In-Active</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers && vouchers.map(voucher => (
                            <tr key={voucher._id}>
                                <td>{voucher.CouponCode}</td>
                                <td>{voucher.descountpercent}%</td>
                                <td>{voucher.isActive ? 'Yes' : 'No'}</td>
                                <td>
                                    <button className="btn btn-success btn-sm" onClick={() => markActive(voucher._id)}>Active</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => markInActive(voucher._id)}>De-Active</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => markDelete(voucher._id)}>Delete <i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllVoucher;
