import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    return (
        <nav className="bg-light bg-opacity-75 navbar navbar-expand-lg sticky-top shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-3 text-slate" to="#">TasksRepo</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav gap-3 fs-5">
                        <li className="nav-item">
                            <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
