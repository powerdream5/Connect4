import React, { useEffect, useState } from "react";
import Username from "./username";

import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });

  useEffect(() => {
    if (username) {
      navigate("/dashboard");
    }
  }, [username]);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl font-bold mb-8">Online Connect 4</h1>
        <div>
          <Username setUsername={setUsername}></Username>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
