import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import Newproject from "./components/Newproject";
import ProjectsList from "./components/ProjectsList";
import Project from "./components/Project";
import NewSponsor from "./components/NewSponsor";
import Dashboard from "./components/Dashboard/Dashboard.js";
import MyProjects from "./components/Dashboard/MyProjects/MyProjects";
import MyContributions from "./components/Dashboard/MyContributions/MyContributions";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/new_project" element={<Newproject />} />
        <Route path="/mycontributions" element={<MyContributions />} />
        <Route path="/sponsor" element={<NewSponsor />} />
        <Route path="/projectDetails" element={<Project />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myprojects" element={<MyProjects />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
