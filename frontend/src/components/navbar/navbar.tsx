import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiLogOut, 
  FiMessageSquare 
} from 'react-icons/fi';
import { MdFactCheck } from "react-icons/md";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { BsHeadsetVr } from "react-icons/bs";
import { FaGraduationCap,FaChartLine } from 'react-icons/fa';
import './Navbar.css'; 

export function NavbarComponent() {
  return (
    <div className="vertical-navbar">
      <div className="navbar-top">
        <div className="logo">Synapz</div>
        
        <nav className="nav-icons">
          <NavLink to="/user-dashboard" className={({ isActive }) => isActive ? 'nav-icon active' : 'nav-icon'} title="Dashboard">
            <FiHome />
          </NavLink>

          <NavLink to="/learning-modules" className={({ isActive }) => isActive ? 'nav-icon active' : 'nav-icon'} title="Learning Modules">
            <FaGraduationCap />
          </NavLink>

          <NavLink to="/quizzes" className={({ isActive }) => isActive ? 'nav-icon active' : 'nav-icon'} title="Quizzes">
            <MdFactCheck />
          </NavLink>

          <NavLink to="/chatbox" className={({ isActive }) => isActive ? 'nav-icon active' : 'nav-icon'} title="HR Feedback">
            <FiMessageSquare />
          </NavLink>

          <NavLink to="/video" className={({ isActive }) => isActive ? 'nav-icon active' : 'nav-icon'} title="Video">
            <MdOutlineOndemandVideo />
          </NavLink>

          <NavLink to="/vr" className={({ isActive }) => isActive ? 'nav-icon active' : 'nav-icon'} title="VR">
            <BsHeadsetVr />
          </NavLink>

          <NavLink to="/progress" className={({ isActive }) => isActive ? 'nav-icon active' : 'nav-icon'} title="Progress">
            <FaChartLine />
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
