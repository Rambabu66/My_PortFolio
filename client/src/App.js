import React, { useState } from "react";
import NotificationContainer from "./components/common/NotificationContainer";
import MainRouter from "./components/viewPages/AllRouters/MainRouter";
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import WelcomePage from "./components/viewPages/Welcome/WelcomePage";

function App() {
  const [showMainPage, setShowMainPage] = useState(false);

  const handleEnter = () => {
    setShowMainPage(true);
  };

  return (
    <>
      {showMainPage ? (
        <>
          <MainRouter />
          <NotificationContainer />
        </>
      ) : (
        <WelcomePage onEnter={handleEnter} />
      )}
    </>
  );
}

export default App;
