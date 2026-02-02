import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./myreports.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function MyReports() {
  const [reports, setReports] = useState([]);
  const user_token = localStorage.getItem("user_token");

  useEffect(() => {
    fetchReports();
  }, []);

  

  const fetchReports = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/myreport`,
        {
          headers: {
            Authorization: `Bearer ${user_token}`,
          },
        }
      );
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  //  Delete report
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/issues/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user_token}`,
          },
        }
      );

      setReports((prev) =>
        prev.filter((report) => report.issueId !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };



  const navigate = useNavigate();

  //  Edit report
  const handleEdit = (id) => {
    navigate(`/edit-report/${id}`);
  };

  return (
    <div className="myreports-container">
      <h2>My Reports</h2>

      {reports.length === 0 ? (
        <p className="no-reports">No reports found</p>
      ) : (
        reports.map((report) => (
          <div key={report.issueId} className="report-card">
            {/* Header */}
            <div className="report-header">
              <h4>{report.categoryName}</h4>

              <span className={`status ${report.status}`}>
                {report.status}
              </span>

            </div>

            <p>{report.problemDescription}</p>

            <p className="report-location">
              {report.districtName} - {report.areaName}
            </p>

            {report.image && (
              <img
                src={`${BASE_URL}uploads/${report.image}`}
                alt="issue"
              />
            )}

            {/* Actions */}
            <div className="report-actions">
              <button
                className="btn-edit"
                onClick={() => handleEdit(report.issueId)}
              >
                Edit
              </button>

              <button
                className="btn-delete"
                onClick={() => handleDelete(report.issueId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyReports;
