import {
  Offcanvas,
  Nav,
  Navbar,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css"; // Import the CSS file for styling

const Sidebar = ({ show, setShow }) => {
  const location = useLocation();

  const handleClose = () => setShow(false);

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} className="d-lg-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          
        {/* Changed Col to div for semantic correctness if not directly inside a Row */}
        <Navbar>
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/admin/homepage"
              active={location.pathname === "/admin/homepage"}
            >
              Homepage
            </Nav.Link>

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                id="static-about-dropdown"
                className={
                  [
                    
                    "/admin/skillspage",
                    "/admin/educationpage",
                    "/admin/experincepage",
                  ].some((path) => location.pathname.startsWith(path))
                    ? "active"
                    : ""
                }
              >
                About
              </Dropdown.Toggle>
              <Dropdown.Menu>
               
                <Dropdown.Item
                  as={Link}
                  to="/admin/skillspage"
                  active={location.pathname === "/admin/skillspage"}
                >
                  Skills
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/admin/educationpage"
                  active={location.pathname === "/admin/educationpage"}
                >
                  Education
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/admin/experincepage"
                  active={location.pathname === "/admin/experincepage"}
                >
                  Experience
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Link
              as={Link}
              to="/admin/projectspage"
              active={location.pathname.startsWith("/admin/projectspage")}
            >
              Projects
            </Nav.Link>

            {/* <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                id="static-settings-dropdown"
                className={
                  location.pathname.startsWith("/admin/settings") ? "active" : ""
                }
              >
                Settings
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to="/admin/settings/profile"
                  active={location.pathname === "/admin/settings/profile"}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/settings/logout">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
          </Nav>
        </Navbar>
   
        </Offcanvas.Body>
      </Offcanvas>

      {/* Static sidebar for larger screens */}
      <div className="col-md-2 d-none d-lg-block sidebar-static ">
        {" "}
        {/* Changed Col to div for semantic correctness if not directly inside a Row */}
        <Navbar >
          <Nav className="flex-column mx-4 ">
            <Nav.Link
              as={Link}
              to="/admin/homepage"
              active={location.pathname === "/admin/homepage"}
            >
              Homepage
            </Nav.Link>

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                id="static-about-dropdown"
                className={
                  [
                    
                    "/admin/skillspage",
                    "/admin/educationpage",
                    "/admin/experincepage",
                  ].some((path) => location.pathname.startsWith(path))
                    ? "active"
                    : ""
                }
              >
                About
              </Dropdown.Toggle>
              <Dropdown.Menu>
               
                <Dropdown.Item
                  as={Link}
                  to="/admin/skillspage"
                  active={location.pathname === "/admin/skillspage"}
                >
                  Skills
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/admin/educationpage"
                  active={location.pathname === "/admin/educationpage"}
                >
                  Education
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/admin/experincepage"
                  active={location.pathname === "/admin/experincepage"}
                >
                  Experience
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Link
              as={Link}
              to="/admin/projectspage"
              active={location.pathname.startsWith("/admin/projectspage")}
            >
              Projects
            </Nav.Link>

            {/* <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                id="static-settings-dropdown"
                className={
                  location.pathname.startsWith("/admin/settings") ? "active" : ""
                }
              >
                Settings
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to="/admin/settings/profile"
                  active={location.pathname === "/admin/settings/profile"}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/settings/logout">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
          </Nav>
        </Navbar>
      </div>
    </>
  );
};

export default Sidebar;
