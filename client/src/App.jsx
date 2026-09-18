import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CaptionGenerator from "./pages/CaptionGenerator";

function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Auth />;
  }

  const path = window.location.pathname;

  if (path === "/caption") {
    return <CaptionGenerator />;
  }

  return <Dashboard />;
}

export default App;