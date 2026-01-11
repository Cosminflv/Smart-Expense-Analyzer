import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import AuthPage from "./pages/AuthPage/AuthPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import "@mantine/core/styles.css";
import UploadPage from "./pages/UploadPage/UploadPage";
import AppLayout from "./layouts/AppLayout";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import { Transactions } from "./pages/Transactions/Transactions";

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/logout" element={<LogoutPage />} />

           <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analystics" element={<Dashboard />} />
          <Route path="/budgets" element={<Dashboard />} />
          <Route path="/logout" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
