import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/logo.png";
import "./nav.css";
import { MdAccessibilityNew, MdAbc, MdMenu, MdClose } from "react-icons/md";

const Navbar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { text: "Daily Log", to: "/", icon: "📝" },
    { text: "ABC Chart", to: "/abc-chart", icon: <MdAbc style={{ color: "#2600ff" }} /> },
    { text: "Incident", to: "/incident-form", icon: "🚨" },
    { text: "Body Maps", to: "/body-maps", icon: <MdAccessibilityNew /> },
    { text: "BRS", to: "/brs", icon: "📋" },
    { text: "MAR", to: "/mar", icon: "💊" },
    { text: "Activity Evidence", to: "/activity-evidence", icon: "📷" },
  ];

  const activeIndex = navItems.findIndex((item) => item.to === location.pathname);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleResize = () => {
    if (window.innerWidth > 699) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className='navigation'>
      <div className='logo-container'>
        <Link to='/'>
          <img src={logo} alt='Logo' className='logo' />
        </Link>
      </div>
      <div className='hamburger' onClick={toggleSidebar}>
        {isSidebarOpen ? <MdClose size={30} /> : <MdMenu size={30} />}
      </div>
      <div className={`overlay ${isSidebarOpen ? "active" : ""}`} onClick={toggleSidebar}></div>
      <ul className={`nav-items ${isSidebarOpen ? "open" : ""}`}>
        {isSidebarOpen && (
          <div className='close-icon' onClick={toggleSidebar}>
            <MdClose size={30} />
          </div>
        )}
        {navItems.map((item, index) => (
          <li key={index} className={`list ${index === activeIndex ? "active" : ""}`}>
            <Link to={item.to} aria-current={index === activeIndex ? "page" : undefined}>
              <span className='icon'>
                <span className='ion-icon'>{item.icon}</span>
              </span>
              <span className='text'>{item.text}</span>
            </Link>
          </li>
        ))}
        <div className='indicator'></div>
      </ul>
    </div>
  );
};

export default Navbar;
