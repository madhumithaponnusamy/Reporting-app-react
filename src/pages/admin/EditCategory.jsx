import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function EditCategory() {
  const [categories, setCategories] = useState([]);
  
  const admin_token = localStorage.getItem("admin_token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/user/categories`, {
      headers: {
        Authorization: `Bearer ${admin_token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleUpdate = async (id, newName) => {
    const res = await fetch(
      `${BASE_URL}/api/admin/categories/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin_token}`,
        },
        body: JSON.stringify({ categoryName: newName }),
      }
    );

    if (res.ok) {
      alert("Category updated");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete?")) return;

    const res = await fetch(
     `${BASE_URL}/api/admin/categories/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin_token}`,
        },
      }
    );

    if (res.ok) {
      setCategories(prev => prev.filter(c => c.categoryId !== id));
    }
  };

  return (
    <div className="container">
      <h2>Edit / Delete Categories</h2>

      {categories.map(cat => (
        <div key={cat.categoryId} className="category-row">
          <input
            type="text"
            defaultValue={cat.categoryName}
            onBlur={(e) => handleUpdate(cat.categoryId, e.target.value)}
          />

            <button
            className="update-btn"
            onClick={() =>
              handleUpdate(cat.categoryId, cat.editableName)
            }
          >
            Update
          </button>

          <button onClick={() => handleDelete(cat.categoryId)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
