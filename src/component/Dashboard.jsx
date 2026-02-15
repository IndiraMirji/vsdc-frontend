import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodaySummary();
  }, []);

  const fetchTodaySummary = async () => {

  
  try {
    const response = await axios.get("http://localhost:8080/api/attendance/today/summary");
    setSummary(response.data);
    toast.success("DashBoard updated");
  } catch (error) {
    console.error("Fetch failed", error);
  }
};

return (
    <div className="dashboard-container"> {/* Parent container */}
      <header className="dashboard-header">
        <div>
          <h1>🏥 Vijayapur Scanning Centre</h1>
          <p className="date-display">{moment().format("dddd, MMMM DD, YYYY")}</p>
        </div>
        <div className="dashboard-footer" style={{marginTop: 0}}>
           <button className="nav-btn1" onClick={() => navigate("/staff")}>+ Add Staff</button>
        </div>
      </header>

      {/* Grid for the Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card present">
          <h3>Present</h3>
          <p className="stat-number">{summary?.stats?.totalPresent || 0}</p>
        </div>
        <div className="stat-card leave">
          <h3>On Leave</h3>
          <p className="stat-number">{summary?.stats?.totalLeave || 0}</p>
        </div>
        <div className="stat-card absent">
          <h3>Absent</h3>
          <p className="stat-number">{summary?.stats?.totalAbsent || 0}</p>
        </div>
        <div className="stat-card halfday">
          <h3>Half Day</h3>
          <p className="stat-number">{summary?.stats?.totalHalfDay || 0}</p>
        </div>
      </div>

      <hr />

      {/* Sunday Duty Section */}
      {summary?.isSunday && (
        <section className="sunday-section">
          <h2>📅 Sunday Duty Staff ({summary?.sundayDutyStaff?.length || 0})</h2>
          <div className="stats-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
            {summary?.sundayDutyStaff?.length > 0 ? (
              summary.sundayDutyStaff.map((staff) => (
                <div key={staff._id} className="stat-card leave" style={{textAlign: 'left', padding: '15px'}}>
                  <h3 style={{margin: 0}}>{staff.name}</h3>
                  <p style={{margin: 0}}>{staff.staffId} | {staff.department}</p>
                  <span style={{fontSize: '12px', fontWeight: 'bold'}}>ON DUTY</span>
                </div>
              ))
            ) : (
              <p>No staff assigned for Sunday duty today.</p>
            )}
          </div>
        </section>
      )}

      {/* Action Buttons at the bottom */}
      <div className="dashboard-footer">
        <button className="nav-btn main" onClick={() => navigate("/attendance")}>
          Mark Attendance
        </button>
        <button className="nav-btn" onClick={() => navigate('/reports')}>
          View Reports
        </button>
      </div>
    </div>
)};
export default Dashboard;