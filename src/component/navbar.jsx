import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./navbar.css";


export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
   
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role");
    navigate("/");
  };
  return (
    <>
      <nav className="navbar">
          <div className="navbar-inner">
        <Link to="/user/dashboard">Dashboard</Link>
        <Link to="/myreport">My Reports</Link>

        {localStorage.getItem("user_token") && (
          <button  onClick={handleLogout}>
            Logout
          </button>
        )}

        </div>

      </nav>

      <Outlet />
    </>
  );
}


