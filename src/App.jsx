// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
// import Staff from "./component/Staff.jsx";
// import Attendance from "./component/Attendance.jsx";
// import Dashboard from "./component/Dashboard.jsx";
// import Reports from "./component/Reports.jsx";
// import Login from "./component/Login.jsx";
// import axios from 'axios';

// // --- GLOBAL SECURITY PASS ---
// // This stays OUTSIDE the function so it applies to every axios call in the whole app
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// function App() {
//   return (
//     <div>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/staff" element={<Staff />} />
//         <Route path="/attendance" element={<Attendance />} />
//         <Route path="/" element={<Dashboard/>}/>
//         <Route path="/reports" element={<Reports/>}/>
//         <Route path="/login" element={<Login/>}/>
//       </Routes>
//     </BrowserRouter>
//     <ToastContainer position="top-right" autoClose={3000} />
//     </div>
    
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Staff from "./component/Staff.jsx";
import Attendance from "./component/Attendance.jsx";
import Dashboard from "./component/Dashboard.jsx";
import Reports from "./component/Reports.jsx";
import Login from "./component/Login.jsx";

// Note: No need for axios interceptors here anymore 
// because our centralized 'src/api.js' handles the Bearer token!

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          
      
         
        </Routes>
      </BrowserRouter>
      
      {/* Notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;