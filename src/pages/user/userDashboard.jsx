import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userDashboard.css"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function ReportIssue() {
  const [data, setData] = useState({
    category: "",
    district: "",
    area: "",
    problemDescription: "",
    latitude: "",
    longitude: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const user_token = localStorage.getItem("user_token");

    if (!user_token) {
      navigate("/");
    }
  }, [navigate]);


  const user_token = localStorage.getItem("user_token");

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user/categories`, {
          headers: { Authorization: `Bearer ${user_token}` },
        });
        const result = await res.json();
        setCategories(result);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [user_token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_token = localStorage.getItem("user_token");
    if (!user_token) {
      alert("Login again");
      return;
    }

    if (!data.latitude || !data.longitude) {
      alert("Please allow location access or click 'Use My Current Location'");
      return;
    }

    const formData = new FormData();
    formData.append("categoryId", data.category);
    formData.append("districtId", data.district);
    formData.append("areaId", data.area);
    formData.append("problemDescription", data.problemDescription);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("image", data.image);

    try {
      const res = await fetch(`${BASE_URL}/api/issue`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert("Issue submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };



  // Fetch districts
  useEffect(() => {
    const fetchDistricts = async () => {
      const res = await fetch(`${BASE_URL}/api/user/districts`, {
        headers: { Authorization: `Bearer ${user_token}` },
      });
      const result = await res.json();
      setDistricts(result);
    };
    fetchDistricts();
  }, [user_token]);

  // Fetch areas when district changes
  useEffect(() => {
    if (!data.district) return;
    const fetchAreas = async () => {
      const res = await fetch(
        `${BASE_URL}/api/user/areas?districtId=${data.district}`,
        { headers: { Authorization: `Bearer ${user_token}` } }
      );
      const result = await res.json();
      setAreas(result);
      setData((prev) => ({ ...prev, area: "" })); // reset selected area
    };
    fetchAreas();
  }, [data.district, user_token]);


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));


        },
        () => {
          alert("Location access denied or unavailable");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }


  return (
    <div className="report-container">
      <div className="report-card">
        <h2>Report an Issue</h2>

        <form onSubmit={handleSubmit}>
          {/* Category dropdown dynamically loaded */}
          <div className="form-group">
            <label>Category</label>
            <select
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>


          {/* District and Area can stay static for now */}
          <div className="form-group">
            <label>District</label>
            {/* District */}
            <select
              value={data.district}
              onChange={(e) => setData({ ...data, district: e.target.value })}
              required
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.districtId} value={d.districtId}>
                  {d.districtName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Area</label>
            <select
              value={data.area}
              onChange={(e) => setData({ ...data, area: e.target.value })}
              required
            >
              <option value="">Select Area</option>
              {areas.map((a) => (
                <option key={a.areaId} value={a.areaId}>
                  {a.areaName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Problem Description</label>
            <textarea
              placeholder="Describe the issue clearly..."
              value={data.problemDescription}
              onChange={(e) => setData({ ...data, problemDescription: e.target.value })}
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <button
              type="button"
              onClick={getLocation}
              className="location-btn"
            >
              Get My Location
            </button>

            <div className="location-inputs">
              <label>Latitude:</label>
              <input
                type="text"
                value={data.latitude}
                readOnly
                placeholder="Latitude"
              />

              <label>Longitude:</label>
              <input
                type="text"
                value={data.longitude}
                readOnly
                placeholder="Longitude"
              />
            </div>
          </div>


          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setData({ ...data, image: e.target.files[0] })
              }
            />

            {/* Show selected file name */}
            {data.image && (
              <p className="file-name">
                File Name: {data.image.name}
              </p>
            )}
          </div>


          <button type="submit" className="submit-btn">
            Submit Issue
          </button>
        </form>
      </div>
    </div>
  );
}
