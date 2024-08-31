import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend} from 'chart.js';

import './custom.css'
ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/v1/Dashboard-Data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const barChartData = {
    labels: ['Categories', 'Banners', 'News', 'Orders'],
    datasets: [
      {
        label: 'Counts',
        data: [ data.counts.categories,data.counts.banners,data.counts.news,data.counts.orders],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const pieChartData = {
    labels: ['Products', 'Videos', 'Vouchers', 'Contacts'],
    datasets: [
      {
        data: [
          data.counts.products,
          data.counts.videos,
          data.counts.vouchers,
          data.counts.contacts
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="container relative mt-4">

      <div className="row">
        <div className="col-12 mb-4">
          <div className="card border-primary shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Total Money Received</h5>
              <p className="card-text display-4">
                <i className="fa-solid text-success fa-money-bill-trend-up"></i> {data.totalFinalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {[
          { label: 'Categories', value: data.counts.categories, icon: 'fa-solid fa-image', border: 'border-primary' },
          { label: 'Banners', value: data.counts.banners, icon: 'fa-solid fa-image', border: 'border-secondary' },
          { label: 'News', value: data.counts.news, icon: 'fa-solid fa-newspaper', border: 'border-info' },
          { label: 'Orders', value: data.counts.orders, icon: 'fa-solid fa-bag-shopping', border: 'border-warning' },
          { label: 'Products', value: data.counts.products, icon: 'fa-solid fa-carrot', border: 'border-danger' },
          { label: 'Videos', value: data.counts.videos, icon: 'fa-solid fa-video', border: 'border-success' },
          { label: 'Vouchers', value: data.counts.vouchers, icon: 'fa-solid fa-ticket', border: 'border-dark' },
          { label: 'Contacts', value: data.counts.contacts, icon: 'fa-regular fa-address-book', border: 'border-light' }
        ].map((item, index) => (
          <div key={index} className="col-md-3 mb-4">
            <div className={`card ${item.border} shadow-sm`}>
              <div className="card-body text-center">
                <h5 className="card-title">{item.label}</h5>
                <p className="card-text display-4">
                  <i className={item.icon}></i> {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row bar">
        <div className="col-md-6 mb-4">
          <div className="card border-info shadow-sm">
            <div className="card-body">
              {/* <h5 className="card-title text-center">Bar Chart</h5> */}
              <Bar data={barChartData} options={{ maintainAspectRatio: false }} height={400} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card border-info shadow-sm">
            <div className="card-body">
              {/* <h5 className="card-title text-center">Pie Chart</h5> */}
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} height={400} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
