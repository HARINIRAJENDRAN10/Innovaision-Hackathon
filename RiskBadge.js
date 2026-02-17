function RiskBadge({ bmi }) {

  if (bmi < 16) {
    return (
      <span className="badge bg-danger">
        High Risk ⚠️
      </span>
    );
  }

  if (bmi >= 16 && bmi < 18.5) {
    return (
      <span className="badge bg-warning text-dark">
        Moderate 🟡
      </span>
    );
  }

  return (
    <span className="badge bg-success">
      Healthy ✅
    </span>
  );
}

export default RiskBadge;