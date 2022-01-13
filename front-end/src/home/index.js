import React, { useState, useEffect } from "react";
import Logo from "./logo_geomais.png";
import { useNavigate } from "react-router-dom";
import { Row, Col, Typography, Statistic, Button } from "antd";
import { PlusCircleOutlined, SolutionOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const styles = {
  alignCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "1em",
    textAlign: "center",
  },
  rowBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "1em",
    textAlign: "center",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "35%",
    margin: "10px",
    padding: "2em",
  },
};

function Home() {
  const navigate = useNavigate();
  const { Title } = Typography;

  const [persons, setPersons] = useState([]);

  /*
  Criando uma função para pegar da DataBase a lista de pessoas cadastradas: 
  - No fetch é passada a rota para coletar a lista.
  - Adicionada a função dentro de um useEffect, para carregar a lista de pessoas.
  */
  useEffect(() => {
    getListaPessoas();
  }, []);

  function getListaPessoas() {
    fetch("http://localhost:3000/pessoas")
      //Quando receber uma resposta, dar um retorno.
      .then((response) => response.json())
      .then((data) => setPersons(data));
  }

  return (
    <Col style={styles.alignCenter}>
      <Row style={styles.alignCenter}>
        <Title level={1}>Controle de Pessoas</Title>
        <img src={Logo} alt="Logo Geomais" />
      </Row>
      <Row style={styles.alignCenter}>
        <Statistic
          /*
            - Um operador ternário "if" indicando qual string deverá ser mostrada.
            - O "total" corresponde a quantidade de objetos dentro da lista de pessoas. 
          */
          title={
            persons.length !== 1 ? "Pessoas Cadastradas" : "Pessoa Cadastrada"
          }
          value={persons.length}
        ></Statistic>
      </Row>
      <Row style={styles.rowBox}>
        <Button
          type="primary"
          style={styles.button}
          onClick={() => navigate("/register-person")}
        >
          <PlusCircleOutlined />
          Novo Cadastro
        </Button>
        <Button
          type="primary"
          style={styles.button}
          onClick={() => navigate("/report-person")}
        >
          <SolutionOutlined />
          Base Pessoas
        </Button>
      </Row>
    </Col>
  );
}

export default Home;
