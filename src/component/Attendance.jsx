import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { FaEdit, FaLock, FaCalendarAlt, FaUserCheck } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "./Attendance.css";

const Attendance = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [attendanceData, setAttendanceData] = useState({
    status: "Present",
    checkInTime: "",
    checkOutTime: "",
  });
  const [editingAttendance, setEditingAttendance] = useState(null);

  useEffect(() => { fetchStaff(); }, []);
  useEffect(() => { if (selectedDate) fetchAttendance(); }, [selectedDate]);

  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/staff");
      setStaff(res.data);
    } catch (error) { toast.error("Failed to fetch staff"); }
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/attendance/date/${selectedDate}`);
      setAttendance(response.data);
    } catch (error) { toast.error("Failed to fetch Attendance"); }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedStaff) { toast.error("Please select a staff member"); return; }
    const payload = { staffId: selectedStaff, date: selectedDate, ...attendanceData };
    try {
      if (editingAttendance) {
        await axios.put(`http://localhost:8080/api/attendance/${editingAttendance._id}`, payload);
        toast.success("Attendance updated successfully");
      } else {
        await axios.post(`http://localhost:8080/api/attendance`, payload);
        toast.success("Attendance marked successfully");
      }
      setEditingAttendance(null);
      fetchAttendance();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  const handleEdit = (record) => {
    if (!record.canModify) { toast.error("This record is locked"); return; }
    setEditingAttendance(record);
    setSelectedStaff(record.staffId._id || record.staffId);
    setAttendanceData({
      status: record.status,
      checkInTime: record.checkInTime || "",
      checkOutTime: record.checkOutTime || "",
    });
  };

  const resetForm = () => {
    setEditingAttendance(null);
    setSelectedStaff("");
    setAttendanceData({ status: "Present", checkInTime: "", checkOutTime: "" });
  };

  const getRemainingTime = (markedAt) => {
    if(!markedAt) return "N/A";
    const lockTime = moment(markedAt).clone().add(1, "hours");
    const remaining = lockTime.diff(moment());
    if (remaining <= 0) return "Locked";
    const duration = moment.duration(remaining);
    return `${duration.minutes()}m left`;
  };

  return (
    <div className="attendance-container">
      <header className="page-header">
        <h1>Vijayapur Scanning Centre</h1>
        <div className="header-controls">
          <div className="form-group" style={{flexDirection: 'row', alignItems: 'center'}}>
            <FaCalendarAlt color="#667eea" />
            <input 
              type="date" 
              className="date-picker" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('/')}>Dashboard</button>
        </div>
      </header>

      {/* Stats Summary Grid */}
      <div className="attendance-summary">
        <div className="summary-card">
          <h3>Total Marked</h3>
          <p className="summary-value">{attendance.length}</p>
        </div>
        <div className="summary-card present">
          <h3>Present</h3>
          <p className="summary-value">{attendance.filter(a => a.status === "Present").length}</p>
        </div>
        <div className="summary-card absent">
          <h3>Absent</h3>
          <p className="summary-value">{attendance.filter(a => a.status === "Absent").length}</p>
        </div>
        <div className="summary-card leave">
          <h3>On Leave</h3>
          <p className="summary-value">{attendance.filter(a => a.status === "Leave").length}</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <h2>{editingAttendance ? "Edit Attendance" : "Mark Attendance"}</h2>
        <div className="warning-box">
          <FaLock /> Records lock 1 hour after marking. Use edit before then.
        </div>
        
        <form onSubmit={handleMarkAttendance}>
          <div className="form-row">
            <div className="form-group">
              <label>Staff Member</label>
              <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} required>
                <option value="">Select Staff</option>
                {staff.map(member => (
                  <option key={member._id} value={member._id}>{member.staffId} - {member.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select 
                value={attendanceData.status} 
                onChange={(e) => setAttendanceData({ ...attendanceData, status: e.target.value })}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
                <option value="Halfday">Half Day</option>
              </select>
            </div>

            {(attendanceData.status === "Present" || attendanceData.status === "Halfday") && (
              <>
                <div className="form-group">
                  <label>Check In</label>
                  <input 
                    type="time" 
                    value={attendanceData.checkInTime} 
                    onChange={(e) => setAttendanceData({ ...attendanceData, checkInTime: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Check Out</label>
                  <input 
                    type="time" 
                    value={attendanceData.checkOutTime} 
                    onChange={(e) => setAttendanceData({ ...attendanceData, checkOutTime: e.target.value })} 
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingAttendance ? "Update Record" : "Save Attendance"}
            </button>
            <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length > 0 ? (
              attendance.map((rec) => {
                const isLocked = !rec.canModify;
                return (
                  <tr key={rec._id} className={isLocked ? "locked" : ""}>
                    <td><strong>{rec.staffId?.name || "N/A"}</strong></td>
                    <td>
                      <span className={`status-badge status-${rec.status.toLowerCase()}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td>{rec.checkInTime || "--:--"}</td>
                    <td>{rec.checkOutTime || "--:--"}</td>
                    <td>
                      {isLocked ? (
                        <span className="locked-text"><FaLock /> Locked</span>
                      ) : (
                        <button className="btn-edit" onClick={() => handleEdit(rec)}>
                          <FaEdit /> Edit ({getRemainingTime(rec.markedAt)})
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">No attendance records for this date.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;