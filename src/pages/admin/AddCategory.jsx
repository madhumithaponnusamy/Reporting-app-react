import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("user_token");

    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ categoryName }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message);
      return;
    }

    alert("Category added successfully");
    navigate("/user/dashboard"); 
  };

  return (
    <div >
      <div className="category-btn">
        <h2>Add Category</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
}
