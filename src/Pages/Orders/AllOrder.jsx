import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllOrder = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(15);
    const [filterType, setFilterType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleFetch = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/v1/all-order');
            const reverseData = res.data.data.reverse();
            setOrders(reverseData);
            setFilteredOrders(reverseData); // Initialize filtered orders with all orders
        } catch (error) {
            console.error('There was an error fetching the Orders!', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:9000/api/v1/delete-order/${id}`);
                    toast.success('Order Deleted Successfully');
                    handleFetch();
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your Order has been deleted.',
                        icon: 'success'
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    useEffect(() => {
        handleFetch();
    }, []);

    useEffect(() => {
        // Apply filter if filterType is set
        if (filterType) {
            const filtered = orders.filter(order => {
                const orderDate = new Date(order.OrderDate);
                const now = new Date();
                switch (filterType) {
                    case 'today':
                        return orderDate.getDate() === now.getDate() &&
                               orderDate.getMonth() === now.getMonth() &&
                               orderDate.getFullYear() === now.getFullYear();
                    case 'yesterday':
                        const yesterday = new Date(now);
                        yesterday.setDate(now.getDate() - 1);
                        return orderDate.getDate() === yesterday.getDate() &&
                               orderDate.getMonth() === yesterday.getMonth() &&
                               orderDate.getFullYear() === yesterday.getFullYear();
                    case 'thisWeek':
                        const startOfWeek = new Date(now);
                        startOfWeek.setDate(now.getDate() - now.getDay());
                        const endOfWeek = new Date(now);
                        endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
                        return orderDate >= startOfWeek && orderDate <= endOfWeek;
                    case 'thisMonth':
                        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
                    case 'thisYear':
                        return orderDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders); // Reset to all orders if no filter applied
        }
    }, [filterType, orders]);

    useEffect(() => {
        // Apply search filter if searchTerm is set
        if (searchTerm) {
            const filtered = orders.filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders); // Reset to all orders if search term is empty
        }
    }, [searchTerm, orders]);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Calculate pagination indexes
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Orders</h4>
                </div>
                <div className="links">
                    {/* Additional links or actions can be placed here */}
                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    <select value={filterType} onChange={handleFilterChange}>
                        <option value="">All Orders</option>
                        <option value="today">Today's Orders</option>
                        <option value="yesterday">Yesterday's Orders</option>
                        <option value="thisWeek">This Week's Orders</option>
                        <option value="thisMonth">This Month's Orders</option>
                        <option value="thisYear">This Year's Orders</option>
                    </select>
                </div>
                <div className="search">
                    <label htmlFor="search">Search </label>&nbsp;
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <section className="d-table-h">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Order ID</th>
                            <th scope="col">Items</th>
                            <th scope="col">Final Price</th>
                            <th scope="col">Order Status</th>
                            <th scope="col">Payment Mode</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Order Date</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((order, index) => (
                            <tr key={order._id}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                    <Link to={`/edit-order/${order._id}`}>{order._id}</Link>
                                </td>
                                <td>
                                    {order.items.map((item, idx) => (
                                        <div key={idx}>
                                            <strong>{item.name}</strong><br />
                                            SKU: {item.sku}<br />
                                            Quantity: {item.quantity}<br />
                                            Price: {item.price}
                                        </div>
                                    ))}
                                </td>
                                <td>{order.FinalPrice}</td>
                                <td>{order.OrderStatus}</td>
                                <td>{order.PaymentMode}</td>
                                <td>{order.PaymentStatus}</td>
                                <td>{new Date(order.OrderDate).toLocaleString()}</td>
                                <td>
                                    <Link onClick={() => handleDelete(order._id)} className="bt delete">
                                        Delete <i className="fa-solid fa-trash"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(filteredOrders.length / itemPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>
        </>
    );
};

export default AllOrder;
