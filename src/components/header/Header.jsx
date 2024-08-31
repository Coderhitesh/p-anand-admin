import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const [sidetoggle,setSideToggle] = useState(false)

  const handletoggleBtn =()=>{
    setSideToggle(!sidetoggle)
  }
  return (
    <>
      <header>
        <div className="top-head">
          <div className="right">
            <h2>P Anand</h2>
            <div className="bar" onClick={handletoggleBtn}>
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>
          <div className="left">
            <a href="" target="_blank">
              <i className="fa-solid fa-globe"></i>
              Go To Website
            </a>

            <div className="logout">
              Log Out <i className="fa-solid fa-right-from-bracket"></i>
            </div>
          </div>

        </div>

        <div className={`rightNav ${sidetoggle ? "active" : "" } `  }>
          <ul>
            <li><Link to="/dashboard" onClick={handletoggleBtn}> <i className="fa-solid fa-gauge me-1 "></i> Dashboard</Link></li>
            <li><Link to="/all-category" onClick={handletoggleBtn}> <i className="fa-solid fa-tag me-1 "></i> Manage Category</Link></li>
            <li><Link to="/all-book-category" onClick={handletoggleBtn}> <i className="fa-solid fa-tag me-1 "></i> Manage Book Category</Link></li>
            <li><Link to="/all-bundle" onClick={handletoggleBtn}> <i className="fa-solid fa-tag me-1 "></i> Manage Bundle</Link></li>
            <li><Link to="/all-courses" onClick={handletoggleBtn}> <i className="fa-solid fa-layer-group me-1 "></i> Manage Course</Link></li>
            <li><Link to="/all-book" onClick={handletoggleBtn}> <i className="fa-solid fa-layer-group me-1 "></i> Manage Book</Link></li>
            <li><Link to="/all-tags" onClick={handletoggleBtn}> <i className="fa-solid fa-tag me-1 "></i> Manage Tags</Link></li>
            <li><Link to="/all-book-tags" onClick={handletoggleBtn}> <i className="fa-solid fa-tag me-1 "></i> Manage Book Tags</Link></li>
            <li><Link to="/all-teacher" onClick={handletoggleBtn}> <i className="fa-regular fa-newspaper me-1 "></i> Manage Teacher</Link></li>
            <li><Link to="/all-teacher-rating" onClick={handletoggleBtn}> <i className="fa-regular fa-newspaper me-1 "></i> Manage Teacher Rating</Link></li>
            <li><Link to="/all-course-rating" onClick={handletoggleBtn}> <i className="fa-regular fa-newspaper me-1 "></i> Manage Course Rating</Link></li>
            <li><Link to="/all-book-rating" onClick={handletoggleBtn}> <i className="fa-regular fa-newspaper me-1 "></i> Manage Book Rating</Link></li>
            {/* <li><Link to="/all-videos" onClick={handletoggleBtn}> <i className="fa-solid fa-video me-1 "></i>Manage Videos</Link></li> */}
            {/* <li><Link to="/all-contact" onClick={handletoggleBtn}> <i className="fa-solid fa-address-book me-1 "></i> Manage Contacts</Link></li> */}
            {/* <li><Link to="/all-partners" onClick={handletoggleBtn}> <i className="fa-solid fa-address-book me-1 "></i> Manage Partners</Link></li> */}
            {/* <li><Link to="/all-newsletters" onClick={handletoggleBtn}> <i className="fa-solid fa-address-book me-1 "></i> Manage Newsletter</Link></li> */}

            <li><Link to="/all-banners" onClick={handletoggleBtn}> <i className="fa-regular fa-images me-1 "></i> Manage Banners</Link></li>
            <li><Link to="/all-shop-banners" onClick={handletoggleBtn}> <i className="fa-brands fa-unsplash me-1 "></i> Manage Shop Banners</Link></li>
            {/* <li><Link to="/all-course-title" onClick={handletoggleBtn}> <i className="fa-brands fa-unsplash me-1 "></i> Manage Course Title</Link></li> */}
            {/* <li><Link to="/all-voucher" onClick={handletoggleBtn}> <i className="fa-brands fa-cc-discover me-1 "></i> Manage Voucher</Link></li> */}
            <li><Link to="/all-users" onClick={handletoggleBtn}> <i className="fa-solid fa-user me-1 "></i> All Users</Link></li>
            <li><Link to="/all-orders" onClick={handletoggleBtn}> <i className="fa-solid fa-truck-arrow-right me-1 "></i> Manage Orders</Link></li>
            <div className="mb-5">
            <button className='logout'>Log Out <i className="fa-solid fa-right-from-bracket me-1 "></i></button>
            </div>

          </ul>
        </div>

      </header>
    </>
  )
}

export default Header