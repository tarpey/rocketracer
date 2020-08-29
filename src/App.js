import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Screens/Home";
import Race from "./Screens/Race";
import "normalize.css";
import "./App.scss";

export default () => {
  return (
    <Router>
      <div className="stars"></div>
      <Route exact path="/" component={Home} />
      <Route path="/:id" component={Race} />
    </Router>
  );
};
