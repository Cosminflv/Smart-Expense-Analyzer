import { NavLink } from "react-router-dom";
import { FiHome, FiLogOut, FiUpload, FiList } from "react-icons/fi";
import { FaChartLine, FaWallet } from "react-icons/fa";
import "./Navbar.css";

interface NavbarProps {
  hasData: boolean;
}

export function NavbarComponent({ hasData }: NavbarProps) {
  const disabledHandler = (e: React.MouseEvent, enabled: boolean) => {
    if (!enabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="vertical-navbar">
      <div className="navbar-top">
        <div className="logo">ExpenseTracker</div>

        <nav className="nav-icons">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-icon active" : "nav-icon"
            }
            title="Dashboard"
          >
            <FiHome />
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive ? "nav-icon active" : "nav-icon"
            }
            title="Upload CSV"
          >
            <FiUpload />
          </NavLink>

          <NavLink
            to="/transactions"
            className={`nav-icon ${!hasData ? "disabled" : ""}`}
            title="Transactions"
            onClick={(e) => disabledHandler(e, hasData)}
          >
            <FiList />
          </NavLink>

          <NavLink
            to="/analytics"
            className={`nav-icon ${!hasData ? "disabled" : ""}`}
            title="Analytics"
            onClick={(e) => disabledHandler(e, hasData)}
          >
            <FaChartLine />
          </NavLink>

          <NavLink
            to="/budgets"
            className={`nav-icon ${!hasData ? "disabled" : ""}`}
            title="Budgets"
            onClick={(e) => disabledHandler(e, hasData)}
          >
            <FaWallet />
          </NavLink>
        </nav>
      </div>

      <div className="navbar-bottom">
        <NavLink to="/logout" className="nav-icon" title="Logout">
          <FiLogOut />
        </NavLink>
      </div>
    </div>
  );
}
