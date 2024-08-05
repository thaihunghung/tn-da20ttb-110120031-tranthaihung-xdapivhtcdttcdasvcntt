import { useEffect } from "react";

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setCollapsedNav(true);
    } else {
      setCollapsedNav(false);
    }
  };
  handleResize();
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, [setCollapsedNav]);

