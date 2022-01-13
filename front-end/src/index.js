import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import RegisterPerson from "./register-person/index";
import ReportPerson from "./report-person/index";
import EditPerson from "./edit-person";

/*
Criando as rotas do sistema: 
- O path da Home é somente "/", pois corresponde a tela de início.
- O element indica qual elemento será renderizado no endereço correspondente.
*/

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-person" element={<RegisterPerson />} />
        <Route path="/report-person" element={<ReportPerson />} />
        <Route path="/edit-person/:id" element={<EditPerson />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
