import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar";
import DailyLogForm from "./components/dailylog";
import ABC from "./components/ABC";
import IncidentReportForm from "./components/incident-report-form";
import BodyMap from "./components/bodymap";
import BRS from "./components/behavioral-recording-sheet";
import MAR from "./components/mar";
import ActivityEvidence from "./components/activity-evidence";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<DailyLogForm />} />
        <Route path='/abc-chart' element={<ABC />} />
        <Route path='/incident-form' element={<IncidentReportForm />} />
        <Route path='/body-maps' element={<BodyMap />} />
        <Route path='/brs' element={<BRS />} />
        <Route path='/mar' element={<MAR />} />
        <Route path='/activity-evidence' element={<ActivityEvidence />} />
      </Routes>
    </Router>
  );
}

export default App;
