import React from "react";
import { FiSettings } from "react-icons/fi";

const TitleBar = () => {
  return (
    <div className="title-bar">
      <div className="title">
        <div className="pulse-dot" />
        <h1>MyMusic</h1>
      </div>
      <FiSettings className="settings-icon" />
    </div>
  );
};

export default TitleBar;
