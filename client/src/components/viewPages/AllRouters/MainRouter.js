import { Route, Routes, useLocation } from "react-router-dom";
// Removed Container import as it's not used directly here
import Home from "../Home/Home";
import About from "../About/About";
import Projects from "../Projects/Projects";
// import Contact from "../Contact/Contact"; // Assuming you might use this later
import Header from "../Header/Header";
import MainadminPage from "../../adminpages/MainAdminpage/MainadminPage";
import Login from "../creditionals/Login";
import ProductRouter from "../ProductRouter/ProductRouter";
import ProjectDetails from "../Projects/ProjectDetails";
import Contacts from "../Contact/Contacts";
import Footer from "../Footer/Footer";
import AllEducation from "../About/AllEducation";
import AllExperince from "../About/AllExperince";
import Register from "../creditionals/Register";

// import './MainRouter.css'; // Import a new CSS file for layout styles

const MainRouter = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    // Add a wrapper div with a class for flex layout
    <div className="app-container">
      {!isAdminRoute && <Header />} {/* Simplified conditional rendering */}

      {/* Wrap Routes in a 'main' tag for semantic structure and flex-grow */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/allEducation" element={<AllEducation />} />
          <Route path="/allExperince" element={<AllExperince />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

         

          <Route path="/admin/*" element={
            <ProductRouter>
              <MainadminPage />
            </ProductRouter>
          } />
        </Routes>
      </main>

      {/* Footer remains outside the main content but inside the flex container */}
      {!isAdminRoute && <Footer />} {/* Also hide footer on admin routes */}
    </div>
  );
}

export default MainRouter;
