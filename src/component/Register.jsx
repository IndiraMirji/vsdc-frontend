import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "staff" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8080/api/auth/register", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("New user registered successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Register New Staff</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};
export default Register;