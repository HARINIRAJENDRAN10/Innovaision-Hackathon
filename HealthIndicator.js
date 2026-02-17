function HealthIndicator({ label, value }) {
  // Determine badge color based on value
  let badgeColor = "secondary"; // default gray

  if (value === "Yes") badgeColor = "success";
  else if (value === "No") badgeColor = "danger";
  else if (value === "Low") badgeColor = "warning";
  else if (value === "Moderate") badgeColor = "info";
  else if (value === "High") badgeColor = "success";

  return (
    <div className="col-md-4 mb-2">
      <strong>{label}:</strong>{" "}
      <span className={`badge bg-${badgeColor}`}>
        {value ?? "No registration yet"}
      </span>
    </div>
  );
}

export default HealthIndicator;