import { Container, Nav, Navbar, Button, Image } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth } from "../../configs/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Đăng xuất thất bại:", err);
      alert("Đăng xuất thất bại");
    }
  };

  useEffect(() => {
    const loadUser = () => {
      const userInfo = localStorage.getItem("user");
      if (userInfo) setUser(JSON.parse(userInfo));
      else setUser(null);
    };

    loadUser();
    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  return (
    <Navbar expand="lg" bg="success" variant="dark" className="shadow-sm border-bottom py-2">
      <Container>
        <Navbar.Brand as={Link} to="/">JOBFair</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">Việc làm</Link>
            <Link to="/listTemplateCV" className="nav-link">Tạo CV online</Link>
            <Link to="/profile" className="nav-link"></Link>           
          </Nav>

          <Nav className="ms-auto align-items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="nav-link d-flex align-items-center">
                  <CgProfile size={20} className="me-1" />
                  Đăng nhập
                </Link>
                <Button as={Link} to="/register" variant="light" size="sm">
                  Đăng ký
                </Button>
              </>
            ) : (
              <>
                <Image
                  src={user.avatar}
                  roundedCircle
                  width="32"
                  height="32"
                  alt="avatar"
                  className="me-2"
                  style={{ objectFit: 'cover' }}
                />
                <span className="me-2">Xin chào {user.username}</span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
