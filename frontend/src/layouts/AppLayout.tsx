import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../api/dashboard";
import { NavbarComponent } from "../components/navbar/navbar";
import { getCurrentUser } from "../utils/authStorage";

export default function AppLayout() {
  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    fetchDashboardSummary(user.userId)
      .then((res) => {
        setHasData(res.hasData);
        localStorage.setItem("hasData", String(res.hasData));
      })
      .catch(() => setHasData(false));
  }, []);

  return (
    <div className="user-page-container">
      <div className="user-navbar">
        <NavbarComponent hasData={hasData} />
      </div>

      <Outlet />
    </div>
  );
}
