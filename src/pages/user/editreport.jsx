import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./editreport.css";

function EditReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user_token = localStorage.getItem("user_token");

    const [categories, setCategories] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [areas, setAreas] = useState([]);
    const [districtChanged, setDistrictChanged] = useState(false);

    const [formData, setFormData] = useState({
        categoryId: "",
        districtId: "",
        areaId: "",
        problemDescription: "",
        latitude: "",
        longitude: "",
        image: null,
        existingImage: "",
    });

    // Fetch categories & districts
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [catRes, distRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/user/categories", { headers: { Authorization: `Bearer ${user_token}` } }),
                    axios.get("http://localhost:5000/api/user/districts", { headers: { Authorization: `Bearer ${user_token}` } }),
                ]);
                setCategories(catRes.data);
                setDistricts(distRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDropdowns();
    }, [user_token]);

    // Fetch existing issue
    useEffect(() => {
        if (!id) return;

        const fetchIssue = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/issues/${id}`, {
                    headers: { Authorization: `Bearer ${user_token}` },
                });

                const issue = res.data;

                setFormData({
                    categoryId: issue.categoryId,
                    districtId: issue.districtId,
                    areaId: issue.areaId,
                    problemDescription: issue.problemDescription,
                    latitude: issue.latitude,
                    longitude: issue.longitude,
                    image: null,
                    existingImage: issue.image,
                });

                // Prefill areas for the current district
                if (issue.districtId) {
                    const areasRes = await axios.get(
                        `http://localhost:5000/api/user/areas?districtId=${issue.districtId}`,
                        { headers: { Authorization: `Bearer ${user_token}` } }
                    );
                    setAreas(areasRes.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchIssue();
    }, [id, user_token]);

    // Fetch areas when district changes (user manually changes district)
    useEffect(() => {
        if (!formData.districtId) return;

        const fetchAreas = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/user/areas?districtId=${formData.districtId}`,
                    { headers: { Authorization: `Bearer ${user_token}` } }
                );
                setAreas(res.data);

                // Reset areaId only if district changed manually
                if (districtChanged) {
                    setFormData(prev => ({ ...prev, areaId: "" }));
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchAreas();
    }, [formData.districtId, user_token, districtChanged]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "districtId") setDistrictChanged(true);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

       const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                },
                (error) => {
                    console.error(error);
                    alert("Unable to retrieve your location");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("categoryId", formData.categoryId);
        data.append("districtId", formData.districtId);
        data.append("areaId", formData.areaId);
        data.append("problemDescription", formData.problemDescription);
        data.append("latitude", formData.latitude);
        data.append("longitude", formData.longitude);
        if (formData.image) data.append("image", formData.image);

        try {
            await axios.put(`http://localhost:5000/api/issues/${id}`, data, {
                headers: { Authorization: `Bearer ${user_token}` },
            });
            alert("Issue updated successfully");
            navigate("/myreport");
        } catch (err) {
            console.error(err);
            alert("Update failed ");
        }
    };

    return (
        <div className="report-container">
            <div className="report-card">
                <h2>Edit Report</h2>

                <form onSubmit={handleSubmit}>
                    {/* CATEGORY */}
                    <div className="form-group">
                        <label>Category</label>
                        <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    {/* DISTRICT */}
                    <div className="form-group">
                        <label>District</label>
                        <select name="districtId" value={formData.districtId} onChange={handleChange}>
                            <option value="">Select District</option>
                            {districts.map(d => (
                                <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
                            ))}
                        </select>
                    </div>

                    {/* AREA */}
                    <div className="form-group">
                        <label>Area</label>
                        <select name="areaId" value={formData.areaId} onChange={handleChange}>
                            <option value="">Select Area</option>
                            {areas.map(a => (
                                <option key={a.areaId} value={a.areaId}>{a.areaName}</option>
                            ))}
                        </select>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="form-group">
                        <label>Problem Description</label>
                        <textarea
                            name="problemDescription"
                            value={formData.problemDescription}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Problem Description"
                            required
                        />
                    </div>

                     <button type="button" onClick={handleUseCurrentLocation} className="location-btn">
                        Use My Current Location
                    </button>

                    {/* LAT / LONG */}
                    <div className="form-group">
                        <label>Latitude</label>
                        <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Longitude</label>
                        <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} />
                    </div>

                    {/* IMAGE */}
                    <div className="form-group">
                        <label>Upload Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    {formData.image ? (
                        <p>Selected file: {formData.image.name}</p>
                    ) : formData.existingImage ? (
                        <div>
                            <p>Existing image:</p>
                            <img src={`http://localhost:5000/uploads/${formData.existingImage}`} alt="Existing" width="120" />
                        </div>
                    ) : null}

                    <button type="submit" className="submit-btn">Update Issue</button>
                </form>
            </div>
        </div>
    );
}

export default EditReport;
