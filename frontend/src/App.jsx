import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ToolsPage from "./pages/ToolsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tools" element={<ToolsPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
