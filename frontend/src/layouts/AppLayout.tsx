import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../api/dashboard";
import { NavbarComponent } from "../components/navbar/navbar";

export default function AppLayout() {
  const [hasData, setHasData] = useState<boolean>(
  localStorage.getItem("hasData") === "true"
);


 useEffect(() => {
  const storedUser = localStorage.getItem("currentUser");
  if (!storedUser) return;

  const user = JSON.parse(storedUser);

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

      {/* AICI SE SCHIMBĂ PAGINILE */}
      <Outlet />
    </div>
  );
}
