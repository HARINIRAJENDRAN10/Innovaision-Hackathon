import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginTemp";
import Register from "./pages/RegisterTemp";
import Dashboard from "./pages/DashboardTemp";
import ChildList from "./pages/ChildList";
import ChildProfile from "./pages/ChildProfile";
import Donation from "./pages/Donation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<ChildList />} />
        <Route path="/child/:id" element={<ChildProfile />} />
        <Route path="/donation" element={<Donation />} />
      </Routes>
    </Router>
  );
}

export default App;