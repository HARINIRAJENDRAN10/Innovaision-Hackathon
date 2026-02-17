import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          🍎 Nutrition Passport
        </Link>

        <div className="ms-auto">
          <Link className="btn btn-light me-2" to="/children">
            Children
          </Link>
          <Link className="btn btn-light me-2" to="/donation">
            Analyzer
          </Link>
          <Link className="btn btn-outline-light" to="/">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;