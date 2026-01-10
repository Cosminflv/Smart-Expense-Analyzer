import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiLogOut,
  FiUpload,
  FiList,
} from 'react-icons/fi';
import { FaChartLine, FaWallet } from 'react-icons/fa';
import './Navbar.css';

export function NavbarComponent() {
  return (
    <div className="vertical-navbar">
      <div className="navbar-top">
        <div className="logo">ExpenseTracker</div>

        <nav className="nav-icons">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'nav-icon active' : 'nav-icon'
            }
            title="Dashboard"
          >
            <FiHome />
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive ? 'nav-icon active' : 'nav-icon'
            }
            title="Upload CSV"
          >
            <FiUpload />
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive ? 'nav-icon active' : 'nav-icon'
            }
            title="Transactions"
          >
            <FiList />
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? 'nav-icon active' : 'nav-icon'
            }
            title="Analytics"
          >
            <FaChartLine />
          </NavLink>

          <NavLink
            to="/budgets"
            className={({ isActive }) =>
              isActive ? 'nav-icon active' : 'nav-icon'
            }
            title="Budgets"
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
