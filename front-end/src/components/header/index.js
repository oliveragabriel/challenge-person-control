import Logo from "./logo_geomais.png";
import { useNavigate } from "react-router-dom";
import { Row, Col, Typography, Statistic, Button } from "antd";
import { PlusCircleOutlined, SolutionOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const styles = {
  card: {
    width: "100%",
    textAlign: "center",
    backgroundColor: "white",
  },
  logoBox: {
    justifyContent: "center",
    width: "15%",
  },
  logo: {
    width: "70px",
    padding: "10px",
  },
  buttonsBox: {
    width: "65%",
  },
  counterBox: {
    justifyContent: "center",
    width: "20%",
  },
  mainButtonLine: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    margin: "0 0 10px 0",
    border: "none",
    backgroundColor: "white",
  },
  logoButton: {
    border: "none",
    backgroundColor: "white",
  },
};

/*
Criando um cabeçalho que será apresentado em todas as telas, com exceção da Home: 
- O parâmetro total recebido na função é enviado em cada tela onde o cabeçalho é apresentado.
- O objeto recebido detém a propriedade "total", a declaração "({total})" significa que quero usar apenas esta o total.
*/

function Header({ total }) {
  /*
  - O navigate recebe o path definido na Route, no OnClick direciona a tela desejada.
  */
  const navigate = useNavigate();
  const { Title } = Typography;

  return (
    <Row style={styles.card}>
      <a href="/" style={styles.logoBox}>
        <Button style={styles.logoButton} onClick={() => navigate("/")}>
          <img src={Logo} alt="Logo Geomais" style={styles.logo} />
        </Button>
      </a>
      <Col style={styles.buttonsBox}>
        <Title level={4}>Controle de Pessoas</Title>
        <Row style={styles.mainButtonLine}>
          <Button
            style={styles.button}
            onClick={() => navigate("/register-person")}
          >
            <PlusCircleOutlined style={styles.icon} />
            Novo Cadastro
          </Button>
          <Button
            style={styles.button}
            onClick={() => navigate("/report-person")}
          >
            <SolutionOutlined style={styles.icon} />
            Base Pessoas
          </Button>
        </Row>
      </Col>
      <Col style={styles.counterBox}>
        <Statistic
          /*
            - Um operador ternário "if" indicando qual string deverá ser mostrada.
            - O "total" corresponde a quantidade de objetos dentro da lista de pessoas. 
          */
          title={total !== 1 ? "Pessoas Cadastradas" : "Pessoa Cadastrada"}
          value={total}
        ></Statistic>
      </Col>
    </Row>
  );
}

export default Header;
