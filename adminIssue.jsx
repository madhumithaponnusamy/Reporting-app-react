import { useEffect, useState } from "react";
import "./adminDashboard.css";
import { IssueStatus } from "./IssueStatus";



export default function AdminIssues() {
  const [issues, setIssues] = useState([]);
  const admin_token = localStorage.getItem("admin_token");

  
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
    <div className="admin-issues">
      <h2>All User Reports</h2>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Issue</th>
            <th>Area</th>
            <th>Status</th>
          </tr>
        </thead>

                <tbody>
          {issues.map((issue) => (
            <IssueStatus
              key={issue.issueId}
              issue={issue}
              updateStatus={updateStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}