import React, { useState } from "react";
import NotificationContainer from "./components/common/NotificationContainer";
import MainRouter from "./components/viewPages/AllRouters/MainRouter";
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import WelcomePage from "./components/viewPages/Welcome/WelcomePage";

// A placeholder for your main site content
const MainSite = () => {
  return (
    <>
       <MainRouter />
          <NotificationContainer />
    </>
  );
};
function App() {
  // We check sessionStorage to see if the user has visited before in this session.
  // The `useState` initializer will only run on the first render.
  const [showWelcome, setShowWelcome] = useState(
    sessionStorage.getItem('hasVisited') !== 'true'
  );

  const handleEnterSite = () => {
    // When the user clicks "Enter Site", we set a flag in sessionStorage.
    sessionStorage.setItem('hasVisited', 'true');
    // And we update the state to hide the welcome page.
    setShowWelcome(false);
  };

  // Conditionally render the WelcomePage or the rest of your site.
  if (showWelcome) {
    return <WelcomePage onEnter={handleEnterSite} />;
  }

  // Render your main site content here.
  // Replace <MainSite /> with your actual main portfolio component.
  return <MainSite />;
  // const [showMainPage, setShowMainPage] = useState(false);

  // const handleEnter = () => {
  //   setShowMainPage(true);
  // };

  // return (
  //   <>
  //     {showMainPage ? (
  //       <>
  //         <MainRouter />
  //         <NotificationContainer />
  //       </>
  //     ) : (
  //       <WelcomePage onEnter={handleEnter} />
  //     )}
  //   </>
  // );
}

export default App;
