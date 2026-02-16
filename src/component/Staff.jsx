// import React, { useEffect, useState } from 'react'
// import { toast } from 'react-toastify';
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

// import api from '../api';
// const Staff = () => {
// const navigate = useNavigate();
// const [staff, setStaff] = useState([]);
// const [editId, setEditId] = useState(null); 
// const [formData, setFormData] = useState({
//     staffId: '',
//     name: '',
//     email: '',
//     phone: '',
//     department: 'Radiologist',
//     joiningDate: '',
//     sundayDuty: false
// });

// const fetchStaff = async() =>{
//     try{
//         const res = await api.get("http://localhost:8080/api/staff");
//         setStaff(res.data);
//     } catch(error){
//         toast.error("Failed to fetch staff");
//     }   
// };

// const handleInputChange = (e) => {
//   const {name, value,type,checked} = e.target;
//   setFormData({
//     ...formData,
//     [name]: type === "checkbox" ? checked : value
//   });
// }

// const handleSubmit = async(e) => {
//   e.preventDefault();
//   try {
//   if (editId) {
//     // UPDATE
//     await api.put(`http://localhost:8080/api/staff/${editId}`, formData);
//     toast.success("Staff updated successfully");
//   } else {
//     // ADD
//     await api.post("http://localhost:8080/api/staff", formData);
//     toast.success("Staff added successfully");
//   }

//   fetchStaff(); // ✅ this will fetch updated list
//   resetForm();
// } catch (error) {
//   toast.error("Failed");
// }

// };

// const handleEdit = (staffMember) => {
//   setEditId(staffMember._id);

//   setFormData({
//     staffId: staffMember.staffId,
//     name: staffMember.name,
//     email: staffMember.email,
//     phone: staffMember.phone,
//     department: staffMember.department,
//     joiningDate: staffMember.joiningDate?.slice(0, 10),
//     sundayDuty: staffMember.sundayDuty,
//   });
// };

// const resetForm = () => {
//   setFormData({
//     staffId:"",
//     name:"",
//     email:"",
//     phone:"",
//     department:"Radiologist",
//     joiningDate:"",
//     sundayDuty: false,
//   });
//   setEditId(null);
// }

// const handleDelete = async(id) => {
//   if(window.confirm("Are you sure you want to delete this staff member?")){
//     try{
//       await axios.delete(`http://localhost:8080/api/staff/${id}`);
//       toast.success("Staff deleted successfully");
//       fetchStaff();
//     } catch(error){
//       toast.error("Failed to delete staff");
//       console.log(error);
//     }

//   }
// }

// const toggleSundayDuty = async (id) => {
//   try{
//     await api.patch(`http://localhost:8080/api/staff/${id}/sundayDuty`);
//     toast.success("Sunday Duty updated");
//     fetchStaff();
//   } catch(error){
//     toast.error("Failed to update Sunday Duty")
//   }
// };


// useEffect(() =>{
//     fetchStaff();
// },[]);

//   return (
//     <div>
//       <h2>Staff List</h2>
//       <table className="staff-table">
//   <thead>
//     <tr>
//       <th>Staff ID</th>
//       <th>Name</th>
//       <th>Email</th>
//       <th>Phone</th>
//       <th>Sunday Duty</th>
//       <th>Actions</th>
//     </tr>
//   </thead>

//   <tbody>
//     {staff.map((member) => (
//       <tr key={member._id}>
//         <td>{member.staffId}</td>
//         <td>{member.name}</td>
//         <td>{member.email}</td>
//         <td>{member.phone}</td>
//         <td>{member.department}</td>
//         <td>{member.sundayDuty ? "Yes" : "No"}</td>
//         <td>
//           <button onClick={() => handleEdit(member)}>Edit</button>

//           <button onClick={() => toggleSundayDuty(member._id)}>Sunday Duty</button>
//           <button onClick={() => handleDelete(member._id)}>Delete</button>
//           <button onClick={() => navigate("/attendance")}> Mark Attendance</button>
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>



// {/* //form to perform crud operations for staff */}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>StaffId</label>
//           <input type="text" name="staffId" value={formData.staffId} onChange={handleInputChange} required/>
//         </div>

//         <div>
//           <label>Name</label>
//           <input type="text" name="name" value={formData.name} onChange={handleInputChange} required/>
//         </div>

//         <div>
//           <label>email</label>
//           <input type="text" name="email" value={formData.email} onChange={handleInputChange}required/>
//         </div>

//         <div>
//           <label>phone</label>
//           <input type="number" name="phone" value={formData.phone} onChange={handleInputChange} required/>
//         </div>

//         <div>
//           <label>department</label>
//           <input type="text" name="department" value={formData.department} onChange={handleInputChange} required/>
//         </div>

//         <div>
//           <label>joiningDate</label>
//           <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required/>
//         </div>

//         <div>
//           <label>
//             <input type="checkbox" name="sundayDuty" checked={formData.sundayDuty} onChange={handleInputChange} />
//           </label>
//           <span>Sunday Duty</span>
//         </div>

//        <button type="submit">
//   {editId ? "Update Staff" : "Add Staff"}
// </button>


//       </form>
//     </div>
//   )
// }

// export default Staff


import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // This now handles our Render URL automatically

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

    // 1. FETCH ALL STAFF
    const fetchStaff = async () => {
        try {
            const res = await api.get("/api/staff");
            setStaff(res.data);
        } catch (error) {
            toast.error("Failed to fetch staff list from server");
            console.error(error);
        }   
    };

    // 2. HANDLE INPUT CHANGES
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // 3. SUBMIT (ADD OR UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // UPDATE EXISTING
                await api.put(`/api/staff/${editId}`, formData);
                toast.success("Staff details updated!");
            } else {
                // ADD NEW
                await api.post("/api/staff", formData);
                toast.success("New staff added successfully!");
            }
            fetchStaff(); 
            resetForm();
        } catch (error) {
            toast.error("Operation failed. Check your connection.");
        }
    };

    // 4. PREPARE EDIT MODE
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

    // 5. DELETE STAFF
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this staff member?")) {
            try {
                await api.delete(`/api/staff/${id}`);
                toast.success("Staff record deleted");
                fetchStaff();
            } catch (error) {
                toast.error("Failed to delete staff");
            }
        }
    };

    // 6. TOGGLE SUNDAY DUTY
    const toggleSundayDuty = async (id) => {
        try {
            await api.patch(`/api/staff/${id}/sundayDuty`);
            toast.success("Sunday Duty status changed");
            fetchStaff();
        } catch (error) {
            toast.error("Failed to update Sunday Duty");
        }
    };

    // 7. RESET FORM
    const resetForm = () => {
        setFormData({
            staffId: "",
            name: "",
            email: "",
            phone: "",
            department: "Radiologist",
            joiningDate: "",
            sundayDuty: false,
        });
        setEditId(null);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    return (
        <div className="staff-container">
            <h2>VSDC Staff Management</h2>
            
            {/* TABLE SECTION */}
            <table className="staff-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
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
                            <td>{member.department}</td>
                            <td>{member.sundayDuty ? "✅ Yes" : "❌ No"}</td>
                            <td>
                                <button className="btn-edit" onClick={() => handleEdit(member)}>Edit</button>
                                <button className="btn-sunday" onClick={() => toggleSundayDuty(member._id)}>Toggle Sunday</button>
                                <button className="btn-delete" onClick={() => handleDelete(member._id)}>Delete</button>
                                <button className="btn-att" onClick={() => navigate("/attendance")}>Mark Attendance</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />

            {/* FORM SECTION */}
            <h3>{editId ? "Edit Staff Member" : "Add New Staff Member"}</h3>
            <form onSubmit={handleSubmit} className="staff-form">
                <div className="form-group">
                    <label>Staff ID:</label>
                    <input type="text" name="staffId" value={formData.staffId} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Full Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Department:</label>
                    <input type="text" name="department" value={formData.department} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Joining Date:</label>
                    <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required />
                </div>
                <div className="form-group checkbox-group">
                    <label>
                        <input type="checkbox" name="sundayDuty" checked={formData.sundayDuty} onChange={handleInputChange} />
                        Assign Sunday Duty
                    </label>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn-submit">
                        {editId ? "Update Record" : "Register Staff"}
                    </button>
                    {editId && <button type="button" onClick={resetForm}>Cancel</button>}
                </div>
            </form>
        </div>
    );
};

export default Staff;