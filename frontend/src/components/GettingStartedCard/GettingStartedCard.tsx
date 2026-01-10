import { FiUpload, FiBarChart2, FiLock } from "react-icons/fi";
import "./GettingStartedCard.css";

export function GettingStartedCard() {
  return (
    <div className="getting-started-card">
      <h3>Get started</h3>

      <ul>
        <li>
          <FiUpload />
          Upload your bank statement
        </li>
        <li>
          <FiBarChart2 />
          We analyze your expenses
        </li>
        <li>
          <FiLock />
          Your data stays private
        </li>
      </ul>
    </div>
  );
}
