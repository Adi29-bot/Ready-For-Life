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
        <Route path='/Ready-For-Life' element={<DailyLogForm />} />
        <Route path='/Ready-For-Life/abc-chart' element={<ABC />} />
        <Route path='/Ready-For-Life/incident-form' element={<IncidentReportForm />} />
        <Route path='/Ready-For-Life/body-maps' element={<BodyMap />} />
        <Route path='/Ready-For-Life/brs' element={<BRS />} />
        <Route path='/Ready-For-Life/mar' element={<MAR />} />
        <Route path='/Ready-For-Life/activity-evidence' element={<ActivityEvidence />} />
      </Routes>
    </Router>
  );
}

export default App;
