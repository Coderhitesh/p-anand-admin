import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:9000/api/v1/AllUser');
                // console.log(res.data.data)
                setUsers(res.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        
        fetchUsers();
    }, []);

    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>All Users</h4>
                </div>
                <div className="links">
                    {/* Additional links or actions can be placed here */}
                </div>
            </div>

            <section className="d-table-h">
            <div className="table-responsive mt-4">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Role</th>
                            <th scope="col">Active</th>
                            <th scope="col">Created At</th>
                            {/* Add more columns as needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((user, index) => (
                            <tr key={user._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{user.FullName}</td>
                                <td>{user.Email}</td>
                                <td>{user.ContactNumber}</td>
                                <td>{user.Role}</td>
                                <td>{user.isActive ? 'Yes' : 'No'}</td>
                                <td>{new Date(user.createdAt).toLocaleString()}</td>
                                {/* Render more columns if needed */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </section>
        </>
    );
};

export default AllUsers;
