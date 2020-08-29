import React from "react";
import Rocket from "./Rocket";
import { Link } from "react-router-dom";

export default () => {
  return (
    <header>
      <div className="container">
        <Rocket />
        <h1>
          <Link to="/">RocketRacer</Link>
        </h1>
      </div>
    </header>
  );
};
