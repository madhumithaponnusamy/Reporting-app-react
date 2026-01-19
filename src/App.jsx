import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./pages/user/userLogin";
import UserDashboard from "./pages/user/userDashboard";
import AdminLogin from "./pages/admin/adminLogin";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminProtectedRoute from "./pages/admin/adminProtected";
import Navbar from "./component/navbar";
import MyReports from "./pages/user/myreports";
import EditReport from "./pages/user/editreport";
import UserProtectedRoute from "./pages/user/userProtected"
import Signup from "./pages/signup/signup"
import AdminSignUp from "./pages/signup/adminSignup"
import Otp from "./pages/signup/otp"
import AddCategory from "./pages/admin/AddCategory";
import EditCategory from "./pages/admin/EditCategory";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/otp" element={<Otp />} />

        {/* User layout with Navbar */}
        <Route
          element={
            <UserProtectedRoute>
              <Navbar />
            </UserProtectedRoute>
          }
        >
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/myreport" element={<MyReports />} />

          <Route path="/report-issue/:id" element={<MyReports />} />
          <Route path="/edit-report/:id" element={<EditReport />} />
          


        </Route>

       
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
        />
        
          <Route path="/categories/add" element={<AddCategory />} />
           <Route path="/categories/edit" element={<EditCategory />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
