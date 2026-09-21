import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ListenerDashboard from "./pages/ListenerDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import { API_BASE } from "./config/api";

function AppRoutes() {
  const navigate = useNavigate();
  const logout = () => {
    fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => navigate("/login"));
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ListenerDashboard
            onExit={() => navigate("/")}
            onLogout={logout}
            onUnauthorized={() => navigate("/login")}
          />
        }
      />
      <Route
        path="/artist"
        element={
          <ArtistDashboard
            onExit={() => navigate("/")}
            onLogout={logout}
            onUnauthorized={() => navigate("/login")}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
