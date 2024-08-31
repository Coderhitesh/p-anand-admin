import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/api/v1/single-order/${id}`);
            setOrder(res.data.data); // Ensure to access `data` from the response
            setLoading(false);
        } catch (error) {
            console.error('There was an error fetching the Order details!', error);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    if (loading || !order) {
        return <p>Loading...</p>;
    }

    return (
        <>

            <div className="bread">
                <div className="head">
                    <h4>Update Order</h4>
                </div>
                <div className="links">
                    <Link to="/all-orders" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Order Details</h5>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Order ID</th>
                                            <td>{order._id}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">User Name</th>
                                            <td>{order.UserInfo.Name}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Email</th>
                                            <td>{order.UserInfo.Email}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Phone Number</th>
                                            <td>{order.UserDeliveryAddress.HouseNo}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Address</th>
                                            <td>{order.UserDeliveryAddress.Street}, {order.UserDeliveryAddress.City}, {order.UserDeliveryAddress.State}, {order.UserDeliveryAddress.Pincode}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Order Date</th>
                                            <td>{new Date(order.OrderDate).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Final Price</th>
                                            <td>{order.FinalPrice}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Order Status</th>
                                            <td>{order.OrderStatus}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Payment Mode</th>
                                            <td>{order.PaymentMode}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Payment Status</th>
                                            <td>{order.PaymentStatus}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Items</h5>
                            </div>
                            <div className="card-body">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="mb-3">
                                        <strong>{item.name}</strong><br />
                                        <p className="mb-1">SKU: {item.sku}</p>
                                        <p className="mb-1">Quantity: {item.quantity}</p>
                                        <p className="mb-0">Price: {item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <Link to="/all-orders" className="btn btn-secondary">Back</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditOrder;
