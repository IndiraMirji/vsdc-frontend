import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";
import api from "../api";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchTodaySummary();
    }
  }, [navigate]);

  const fetchTodaySummary = async () => {
    try {
      setLoading(true);
      const response = await api.get("/attendance/today/summary");
      setSummary(response.data);
    } catch (error) {
      console.error("Fetch failed", error);
      toast.error("Could not update dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* Header with Title and Add Staff Button */}
      <header className="dashboard-header">
        <div>
          <h1>🏥 Vijayapur Scanning Centre</h1>
          <p className="date-display">{moment().format("dddd, MMMM DD, YYYY")}</p>
        </div>
        <button className="nav-btn1" onClick={() => navigate("/staff")}>
          + Add Staff
        </button>
      </header>

      {/* Statistics Section */}
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

      {/* Sunday Section - Only shows if it's Sunday */}
      {summary?.isSunday && (
        <section className="sunday-section" style={{ marginTop: '20px' }}>
          <h2>📅 Sunday Duty Staff ({summary?.sundayDutyStaff?.length || 0})</h2>
          <div className="stats-grid">
            {summary?.sundayDutyStaff?.map((staff) => (
              <div key={staff._id} className="stat-card leave">
                <h4 style={{ margin: 0 }}>{staff.name}</h4>
                <p style={{ fontSize: '12px', color: '#666' }}>Department: {staff.department}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Navigation Buttons at Bottom */}
      <footer className="dashboard-footer">
        <button className="nav-btn main" onClick={() => navigate("/attendance")}>
          Mark Attendance
        </button>
        <button className="nav-btn" onClick={() => navigate('/reports')}>
          View Reports
        </button>
      </footer>
    </div>
  );
};

export default Dashboard;