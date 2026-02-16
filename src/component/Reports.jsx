// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { toast } from "react-toastify";
// import { FaSearch, FaUserCircle, FaCalendarAlt } from "react-icons/fa";
// import "./Reports.css";
// import api from "../api";

// const Reports = () => {
//   const [staffList, setStaffList] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState("");
//   const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
//   const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   // const fetchStaff = async () => {
//   //   const token = localStorage.getItem("token");
//   //   try {
//   //     const res = await axios.get("http://localhost:8080/api/staff", {
//   //       headers: { Authorization: `Bearer ${token}` }
//   //     });
//   //     setStaffList(res.data);
//   //   } catch (err) {
//   //     toast.error("Error loading staff list");
//   //   }
//   // };
//   const fetchStaff = async () => {
//   try {
//     const res = await api.get("/api/staff"); // Updated (Headers are handled by api.js)
//     setStaffList(res.data);
//   } catch (err) {
//     toast.error("Error loading staff list");
//   }

//   const fetchHistory = async () => {
//   if (!selectedStaff) return toast.warning("Please select a staff member");
//   try {
//     const res = await api.get(`/api/attendance/staff/${selectedStaff}`, { 
//       params: { startDate, endDate } 
//     }); // Updated
//     setHistory(res.data);
//   } catch (err) {
//     toast.error("Error fetching history");
//   }
// };
//   };

//   // Logic for stats
//   const totalDays = history.length;
//   const presentDays = history.filter(r => r.status === "Present").length;
//   const absentDays = history.filter(r => r.status === "Absent").length;

//   return (
//     <div className="reports-container">
//       <header className="reports-header">
//         <h1>Attendance Analytics</h1>
//         <p style={{color: 'var(--text-light)'}}>View and track staff performance history</p>
//       </header>

//       {/* Filter Section */}
//       <div className="filter-card">
//         <h2><FaCalendarAlt /> Report Filters</h2>
//         <div className="filter-grid">
//           <div className="filter-group">
//             <label>Select Staff Member</label>
//             <select onChange={(e) => setSelectedStaff(e.target.value)} value={selectedStaff}>
//               <option value="">Choose Staff</option>
//               {staffList.map(s => (
//                 <option key={s._id} value={s._id}>{s.name} ({s.staffId})</option>
//               ))}
//             </select>
//           </div>

//           <div className="filter-group">
//             <label>From Date</label>
//             <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//           </div>

//           <div className="filter-group">
//             <label>To Date</label>
//             <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//           </div>

//           <button className="btn-search" onClick={fetchHistory}>
//             <FaSearch /> Search
//           </button>
//         </div>
//       </div>

//       {/* Stats Summary Area */}
//       {history.length > 0 && (
//         <div className="stats-summary">
//           <div className="stat-box">
//             <h3>Total Records</h3>
//             <p className="stat-value">{totalDays}</p>
//           </div>
//           <div className="stat-box present">
//             <h3>Present</h3>
//             <p className="stat-value">{presentDays}</p>
//           </div>
//           <div className="stat-box absent">
//             <h3>Absent</h3>
//             <p className="stat-value">{absentDays}</p>
//           </div>
//         </div>
//       )}

//       {/* Table Section */}
//       <div className="table-container">
//         <table className="reports-table">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Status</th>
//               <th>Check In</th>
//               <th>Check Out</th>
//             </tr>
//           </thead>
//           <tbody>
//             {history.length > 0 ? (
//               history.map((rec) => (
//                 <tr key={rec._id}>
//                   <td><strong>{moment(rec.date).format("DD MMM YYYY")}</strong></td>
//                   <td>
//                     <span className={`status-badge status-${rec.status.toLowerCase()}`}>
//                       {rec.status}
//                     </span>
//                   </td>
//                   <td>{rec.checkInTime || "--:--"}</td>
//                   <td>{rec.checkOutTime || "--:--"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="empty-state">
//                   <p>No records found. Select a staff member and date range to begin.</p>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Reports;

import React, { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import "./Reports.css";
import api from "../api"; // Centralized API config

const Reports = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  // ✅ Correctly defined fetchStaff
  const fetchStaff = async () => {
    try {
      const res = await api.get("/api/staff");
      setStaffList(res.data);
    } catch (err) {
      toast.error("Error loading staff list");
    }
  };

  // ✅ Moved this OUTSIDE of fetchStaff so it can be called by the button
  const fetchHistory = async () => {
    if (!selectedStaff) return toast.warning("Please select a staff member");
    try {
      const res = await api.get(`/api/attendance/staff/${selectedStaff}`, { 
        params: { startDate, endDate } 
      });
      setHistory(res.data);
      if (res.data.length === 0) {
        toast.info("No records found for the selected range");
      }
    } catch (err) {
      toast.error("Error fetching history");
    }
  };

  // Stats Logic
  const totalDays = history.length;
  const presentDays = history.filter(r => r.status === "Present").length;
  const absentDays = history.filter(r => r.status === "Absent").length;

  return (
    <div className="reports-container">
      <header className="reports-header">
        <h1>Attendance Analytics</h1>
        <p style={{color: 'var(--text-light)'}}>View and track staff performance history</p>
      </header>

      {/* Filter Section */}
      <div className="filter-card">
        <h2><FaCalendarAlt /> Report Filters</h2>
        <div className="filter-grid">
          <div className="filter-group">
            <label>Select Staff Member</label>
            <select onChange={(e) => setSelectedStaff(e.target.value)} value={selectedStaff}>
              <option value="">Choose Staff</option>
              {staffList.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.staffId})</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>From Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="filter-group">
            <label>To Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <button className="btn-search" onClick={fetchHistory}>
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* Stats Summary Area */}
      {history.length > 0 && (
        <div className="stats-summary">
          <div className="stat-box">
            <h3>Total Records</h3>
            <p className="stat-value">{totalDays}</p>
          </div>
          <div className="stat-box present">
            <h3>Present</h3>
            <p className="stat-value">{presentDays}</p>
          </div>
          <div className="stat-box absent">
            <h3>Absent</h3>
            <p className="stat-value">{absentDays}</p>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((rec) => (
                <tr key={rec._id}>
                  <td><strong>{moment(rec.date).format("DD MMM YYYY")}</strong></td>
                  <td>
                    <span className={`status-badge status-${rec.status.toLowerCase()}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td>{rec.checkInTime || "--:--"}</td>
                  <td>{rec.checkOutTime || "--:--"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-state">
                  <p>No records found. Select a staff member and date range to begin.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;