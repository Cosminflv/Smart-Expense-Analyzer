import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import AuthPage from "./pages/AuthPage/AuthPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import "@mantine/core/styles.css";

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Dashboard />} />
          <Route path="/transactions" element={<Dashboard />} />
          <Route path="/analystics" element={<Dashboard />} />
          <Route path="/budgets" element={<Dashboard />} />
          <Route path="/logout" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
