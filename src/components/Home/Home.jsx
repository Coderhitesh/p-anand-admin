import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Header from '../header/Header'
import Dashboard from '../../Pages/Dashboard/Dashboard'
import AllCategory from '../../Pages/Category/AllCategory'
import AddCategory from '../../Pages/Category/AddCategory'
import EditCategory from '../../Pages/Category/EditCategory'
import AllProduct from '../../Pages/Products/AllProduct'
import AddProduct from '../../Pages/Products/AddProduct'
import AllBanner from '../../Pages/Banners/AllBanner'
import AddBanner from '../../Pages/Banners/AddBanner'
import EditBanner from '../../Pages/Banners/EditBanner'
import AllShopBanner from '../../Pages/ShopBanner/AllShopBanner'
import AddShopBanner from '../../Pages/ShopBanner/AddShopBanner'
import EditShopBanner from '../../Pages/ShopBanner/EditShopBanner'
import AllTags from '../../Pages/Tags/AllTags'
import AddTag from '../../Pages/Tags/AddTag'
import EditTag from '../../Pages/Tags/EditTag'
import AllVoucher from '../../Pages/Vouchers/AllVoucher'
import CreateVoucher from '../../Pages/Vouchers/AddVoucher'
import AllOrder from '../../Pages/Orders/AllOrder'
import EditOrder from '../../Pages/Orders/EditOrder'
import AllUsers from '../../Pages/Users/AllUsers'
import EditProduct from '../../Pages/Products/EditProduct'
import AllNews from '../../Pages/News/AllNews'
import AddNews from '../../Pages/News/AddNews'
import EditNews from '../../Pages/News/EditNews'
import AllVideos from '../../Pages/Videos/Video'
import AddVideo from '../../Pages/Videos/AddVideo'
import AllContacts from '../../Pages/contacts/AllContacts'
import AllPartners from '../../Pages/Partners/AllPartners'
import AllNewsSubscribedEmail from '../../Pages/NewsLetter/AllNewsSubscribedEmail'
import MessageTemplate from '../../Pages/NewsLetter/MessageTemplete'
import Addtemplate from '../../Pages/NewsLetter/Addtemplate'
import EditTemplate from '../../Pages/NewsLetter/EditTemplate'
import AllBundle from '../../Pages/Bundle/AllBundle'
// import AddBundle from '../../Pages/Bundle/AddBundle'
import AllTeacher from '../../Pages/Teacher/AllTeacher'
import AddTeacher from '../../Pages/Teacher/AddTeacher'
import EditBundle from '../../Pages/Bundle/EditBundle'
import { elements } from 'chart.js'
import AllTeacherRate from '../../Pages/TeacherRate/AllTeacherRate'
import AddTeacherRate from '../../Pages/TeacherRate/AddTeacherRate'
import EddTeacherRate from '../../Pages/TeacherRate/EddTeacherRate'
import AllCourseRating from '../../Pages/CourseRating/AllCourseRating'
import AddCourseRating from '../../Pages/CourseRating/AddCourseRating'
import EditCourseRating from '../../Pages/CourseRating/EditCourseRating'
import AllCourseTitle from '../../Pages/CourseTitle/AllCourseTitle'
import AddCourseTitle from '../../Pages/CourseTitle/AddCourseTitle'
import EditCourseTitle from '../../Pages/CourseTitle/EditCourseTitle'
import AddBundle from '../../Pages/Bundle/AddBundle'
import AllBookCategory from '../../Pages/BookCategory/AllBookCategory'
import AddBookCategory from '../../Pages/BookCategory/AddBookCategory'
import AllBookTag from '../../Pages/BookTag/AllBookTag'
import AddBookTag from '../../Pages/BookTag/AddBookTag'
import AllBookRating from '../../Pages/BookRating/AllBookRating'
import AddBookRating from '../../Pages/BookRating/AddBookRating'
import EditBookRating from '../../Pages/BookRating/EditBookRating'
import AllBook from '../../Pages/Book/AllBook'
import AddBook from '../../Pages/Book/AddBook'
import EditBook from '../../Pages/Book/EditBook'

const Home = () => {
  return (
    <>

      <Header />
      <div className="rightside">
        <Routes>
          <Route path={"/dashboard"} element={<Dashboard />} />

          {/* Category --  */}
          <Route path={"/all-category"} element={<AllCategory />} />
          <Route path={"/add-category"} element={<AddCategory />} />
          <Route path={"/edit-category/:id"} element={<EditCategory />} />

          {/* Bundle */}
          <Route path={'/all-bundle'} element={<AllBundle />} />
          <Route path={'/add-bundle'} element={<AddBundle />} />
          <Route path={'/edit-bundle/:id'} element={<EditBundle />} />

          {/* Product --  */}
          <Route path={"/all-courses"} element={<AllProduct />} />
          <Route path={"/add-course"} element={<AddProduct />} />
          <Route path={"/edit-course/:id"} element={<EditProduct />} />

          {/* partners */}
          <Route path={"/all-partners"} element={<AllPartners />} />
          {/* Newsleterrs */}
          <Route path={"/all-newsletters"} element={<AllNewsSubscribedEmail />} />
          <Route path={"/Send-Mails"} element={<MessageTemplate />} />
          <Route path={"/add-new-template"} element={<Addtemplate />} />
          <Route path={"/edit-template/:id"} element={<EditTemplate />} />



          {/* --- Orders --- */}
          <Route path={"/all-users"} element={<AllUsers />} />

          {/* --- Vouchers --- */}
          <Route path={"/all-voucher"} element={<AllVoucher />} />   {/* // All Vouchers */}
          <Route path={"/add-voucher"} element={<CreateVoucher />} />

          {/* --- Tags --- */}
          <Route path={"/all-tags"} element={<AllTags />} />
          <Route path={"/add-tag"} element={<AddTag />} />
          <Route path={"/edit-tag/:id"} element={<EditTag />} />

          {/* --- Banners --- */}
          <Route path={"/all-banners"} element={<AllBanner />} />
          <Route path={"/add-banner"} element={<AddBanner />} />
          <Route path={"/edit-banner/:id"} element={<EditBanner />} />

          {/* --- Banners --- */}
          <Route path={"/all-shop-banners"} element={<AllShopBanner />} />
          <Route path={"/add-shop-banner"} element={<AddShopBanner />} />
          <Route path={"/edit-shop-banner/:id"} element={<EditShopBanner />} />

          {/* Teacher */}
          <Route path={'/all-teacher'} element={<AllTeacher />} />
          <Route path={'/add-teacher'} element={<AddTeacher />} />

          {/* --- Orders --- */}
          <Route path={"/all-orders"} element={<AllOrder />} />
          <Route path={"/edit-order/:id"} element={<EditOrder />} />
          {/* --- News --- */}
          <Route path={"/all-news"} element={<AllNews />} />
          <Route path={"/add-news"} element={<AddNews />} />
          <Route path={"/edit-news/:id"} element={<EditNews />} />

          {/* --- Videos --- */}
          <Route path={"/all-Videos"} element={<AllVideos />} />
          <Route path={"/add-video"} element={<AddVideo />} />
          <Route path={"/edit-news/:id"} element={<EditNews />} />

          {/* --- Contacts --- */}
          <Route path={"/all-contact"} element={<AllContacts />} />

          {/* teacher rating */}
          <Route path={'/all-teacher-rating'} element={<AllTeacherRate />} />
          <Route path={'/add-teacher-rating'} element={<AddTeacherRate />} />
          <Route path={'/edit-teacher-rating/:id'} element={<EddTeacherRate />} />

          {/* course rating  */}

          <Route path='/all-course-rating' element={<AllCourseRating />} />
          <Route path='/add-course-rating' element={<AddCourseRating />} />
          <Route path='/edit-course-rating/:id' element={<EditCourseRating />} />

          {/* course title  */}

          <Route path='/all-course-title' element={<AllCourseTitle />} />
          <Route path='/Add-course-title' element={<AddCourseTitle />} />
          <Route path='/Edit-course-title/:id' element={<EditCourseTitle />} />

          {/* Book Category */}

          <Route path='/all-book-category' element={<AllBookCategory />}/>
          <Route path='/add-book-category' element={<AddBookCategory />}/>
          <Route path='/edit-book-category/:id' element={<AddBookCategory />}/>

          {/* Book Tag  */}

          <Route path='/all-book-tags' element={<AllBookTag />} />
          <Route path='/add-book-tag' element={<AddBookTag />} />

          {/* Book Rating  */}

          <Route path='/all-book-rating' element={<AllBookRating />} />
          <Route path='/add-book-rating' element={<AddBookRating />} />
          <Route path='/edit-book-rating' element={<EditBookRating />} />

          {/* Book Routing */}

          <Route path='/all-book' element={<AllBook />} />
          <Route path='/add-book' element={<AddBook />} />
          <Route path='/edit-book' element={<EditBook />} />

          {/* all-shop */}

        </Routes>
      </div>

    </>
  )
}

export default Home