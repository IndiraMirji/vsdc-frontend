import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Staff = () => {
const navigate = useNavigate();
const [staff, setStaff] = useState([]);
const [editId, setEditId] = useState(null); 
const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    email: '',
    phone: '',
    department: 'Radiologist',
    joiningDate: '',
    sundayDuty: false
});

const fetchStaff = async() =>{
    try{
        const res = await axios.get("http://localhost:8080/api/staff");
        setStaff(res.data);
    } catch(error){
        toast.error("Failed to fetch staff");
    }   
};

const handleInputChange = (e) => {
  const {name, value,type,checked} = e.target;
  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value
  });
}

const handleSubmit = async(e) => {
  e.preventDefault();
  try {
  if (editId) {
    // UPDATE
    await axios.put(`http://localhost:8080/api/staff/${editId}`, formData);
    toast.success("Staff updated successfully");
  } else {
    // ADD
    await axios.post("http://localhost:8080/api/staff", formData);
    toast.success("Staff added successfully");
  }

  fetchStaff(); // ✅ this will fetch updated list
  resetForm();
} catch (error) {
  toast.error("Failed");
}

};

const handleEdit = (staffMember) => {
  setEditId(staffMember._id);

  setFormData({
    staffId: staffMember.staffId,
    name: staffMember.name,
    email: staffMember.email,
    phone: staffMember.phone,
    department: staffMember.department,
    joiningDate: staffMember.joiningDate?.slice(0, 10),
    sundayDuty: staffMember.sundayDuty,
  });
};

const resetForm = () => {
  setFormData({
    staffId:"",
    name:"",
    email:"",
    phone:"",
    department:"Radiologist",
    joiningDate:"",
    sundayDuty: false,
  });
  setEditId(null);
}

const handleDelete = async(id) => {
  if(window.confirm("Are you sure you want to delete this staff member?")){
    try{
      await axios.delete(`http://localhost:8080/api/staff/${id}`);
      toast.success("Staff deleted successfully");
      fetchStaff();
    } catch(error){
      toast.error("Failed to delete staff");
      console.log(error);
    }

  }
}

const toggleSundayDuty = async (id) => {
  try{
    await axios.patch(`http://localhost:8080/api/staff/${id}/sundayDuty`);
    toast.success("Sunday Duty updated");
    fetchStaff();
  } catch(error){
    toast.error("Failed to update Sunday Duty")
  }
};


useEffect(() =>{
    fetchStaff();
},[]);

  return (
    <div>
      <h2>Staff List</h2>
      <table className="staff-table">
  <thead>
    <tr>
      <th>Staff ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Sunday Duty</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {staff.map((member) => (
      <tr key={member._id}>
        <td>{member.staffId}</td>
        <td>{member.name}</td>
        <td>{member.email}</td>
        <td>{member.phone}</td>
        <td>{member.department}</td>
        <td>{member.sundayDuty ? "Yes" : "No"}</td>
        <td>
          <button onClick={() => handleEdit(member)}>Edit</button>

          <button onClick={() => toggleSundayDuty(member._id)}>Sunday Duty</button>
          <button onClick={() => handleDelete(member._id)}>Delete</button>
          <button onClick={() => navigate("/attendance")}> Mark Attendance</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>



{/* //form to perform crud operations for staff */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>StaffId</label>
          <input type="text" name="staffId" value={formData.staffId} onChange={handleInputChange} required/>
        </div>

        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required/>
        </div>

        <div>
          <label>email</label>
          <input type="text" name="email" value={formData.email} onChange={handleInputChange}required/>
        </div>

        <div>
          <label>phone</label>
          <input type="number" name="phone" value={formData.phone} onChange={handleInputChange} required/>
        </div>

        <div>
          <label>department</label>
          <input type="text" name="department" value={formData.department} onChange={handleInputChange} required/>
        </div>

        <div>
          <label>joiningDate</label>
          <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required/>
        </div>

        <div>
          <label>
            <input type="checkbox" name="sundayDuty" checked={formData.sundayDuty} onChange={handleInputChange} />
          </label>
          <span>Sunday Duty</span>
        </div>

       <button type="submit">
  {editId ? "Update Staff" : "Add Staff"}
</button>


      </form>
    </div>
  )
}

export default Staff


