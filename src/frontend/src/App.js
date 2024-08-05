import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import './App.css';
import Client from "./layouts/Client";
import Admin from "./layouts/admin";
import Login from "./components/pages/Admin/Login/Login";
import Cookies from 'js-cookie';
import { axiosAdmin } from "./service/AxiosAdmin";


function App() {
  const location = useLocation();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(Cookies.get('refreshToken')));
  const [user, setUser] = useState()
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setShowScrollButton(scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseUser = await axiosAdmin.get(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/user`);
        setUser(responseUser.data);
        console.log("responseUser.data", responseUser.data)
      } catch (error) {
        console.log("err", error)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={<Client />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/admin/*" element={isAuthenticated ? <Admin user={user} /> : <Navigate to="/login" />} />
      </Routes>
      {showScrollButton && (
        <div className="scroll-to-top-button" onClick={scrollToTop}>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
      )}
    </div>
  );
}

export default App;
