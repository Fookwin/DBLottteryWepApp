import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Diagram from "./routes/diagram";
import './App.css';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/diagram">Diagram</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/diagram" component={Diagram} />
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

export default BasicExample;