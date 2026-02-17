import { useNavigate } from "react-router-dom";
import RiskBadge from "./RiskBadge";

function ChildCard({ child }) {
  const navigate = useNavigate();

  return (
    <div 
      className="card card-custom p-3 shadow-sm mb-3"
      style={{cursor:"pointer"}}
      onClick={() => navigate(`/child/${child.child_id}`)}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5>👧 {child.name}</h5>
          <p className="mb-1">Age: {child.age}</p>
          <p className="mb-0">BMI: {child.bmi}</p>
        </div>

        <RiskBadge bmi={child.bmi} />
      </div>
    </div>
  );
}

export default ChildCard;