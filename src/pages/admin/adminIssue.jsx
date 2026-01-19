import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminDashboard.css";
import { IssueStatus } from "./IssueStatus";



export default function AdminIssues() {
  const [issues, setIssues] = useState([]);
  const admin_token = localStorage.getItem("admin_token");

  
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/issues", {
      headers: {
        Authorization: `Bearer ${admin_token}`
      }
    })
      .then(res => res.json())
      .then(data => setIssues(data));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/admin/issues/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin_token}`
      },
      body: JSON.stringify({ status })
    });

    
    setIssues(prev =>
      prev.map(issue =>
        issue.issueId === id ? { ...issue, status } : issue
      )
    );
  };

   return (
<div className="container mt-4 admin-issues">
  <h2 className="mb-4 fw-bold text-center">All User Reports</h2>

  <div className="d-flex justify-content-end mb-3">
    <button className="category-btn" onClick={() => navigate("/categories/add")}>
      + Add Category
    </button>
    <button className="category-btn" onClick={() => navigate("/categories/edit")}>
      Edit Category
    </button>
  </div>


      <div className="admin-card">
    <table className="table">
        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Issue</th>
            <th>Area</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {issues.map(issue => (
            <IssueStatus
              key={issue.issueId}
              issue={issue}
              updateStatus={updateStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
