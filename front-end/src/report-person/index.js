import React, { useState, useCallback } from "react";
import Header from "../components/header/index";
import List from "../components/table/index";
import { Row, Col, Typography, Input, Tooltip, Select, Button } from "antd";
import {
  UsergroupDeleteOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "whitesmoke",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    margin: "1em 0em 1em 0em",
    padding: "8px",
    borderRadius: "6px",
    backgroundColor: "white",
  },
  titleContainer: {
    alignItems: "center",
    width: "100%",
  },
  icon: {
    color: "#88a919",
    fontSize: "2em",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0em 0em 2em 0em",
    width: "100%",
  },
  dataBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  h2: {
    color: "#115B87",
    margin: "1em 0 2em 0",
    width: "90%",
    borderBottom: "2px solid #88a919",
    padding: "8px",
  },
  formLine: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginTop: "8px",
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  singleLabel: {
    width: "25%",
  },
  singleInput: {
    width: "65%",
  },
};

function ReportPerson() {
  const { Title } = Typography;
  const { Option } = Select;

  /*
  Criando variáveis de estado para controle: 
  - O "total" é enviado como parâmetro no Header, mas o sistema ainda espera receber tal dado.
  - O "filterInput" controla a mudança dos campos de filtro, iniciando eles como string vazia.
  - Depois de preenchido os filtros, o "filterParam" recebe estes valores finais. 
  */
  const [total, setTotal] = useState();
  const [filterParam, setFilterParam] = useState({});
  const [filterInput, setFilterInput] = useState({
    nome: "",
    rg: "",
    cpf: "",
    // Iniciado como null para apresentar o placeholder, senão ele apresentaria uma string vazia.
    sexo: null,
  });

  /*
    - Controla sempre que o filterInput, setando o valor na variável à ser enviada como parâmetro.
  */
  const valorInputFormulario = useCallback(() => {
    setFilterParam(filterInput);
  }, [filterInput]);

  return (
    <div>
      <Header total={total} />
      <Col style={styles.main}>
        <Col style={styles.card}>
          <Row style={styles.titleContainer}>
            <UsergroupDeleteOutlined style={styles.icon} />
            <Title level={4}>Base de Pessoas Cadastradas</Title>
          </Row>
          <form style={styles.form}>
            <Col style={styles.dataBox}>
              <Title level={5} style={styles.h2}>
                Filtros
              </Title>
              <Row style={styles.formLine}>
                <Row style={styles.inputContainer}>
                  <label style={styles.singleLabel}>Nome:</label>
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    suffix={
                      <Tooltip title="Digite o nome completo">
                        <InfoCircleOutlined
                          style={{ color: "rgba(0,0,0,.45)" }}
                        />
                      </Tooltip>
                    }
                    style={styles.singleInput}
                    type="text"
                    value={filterInput.nome}
                    onChange={(element) => {
                      setFilterInput((p) => ({
                        ...p,
                        nome: element.target.value,
                      }));
                    }}
                  ></Input>
                </Row>
              </Row>
              <Row style={styles.formLine}>
                <Row style={styles.inputContainer}>
                  <label style={styles.singleLabel}>RG:</label>
                  <Input
                    style={styles.singleInput}
                    type="text"
                    value={filterInput.rg}
                    onChange={(element) => {
                      setFilterInput((p) => ({
                        ...p,
                        rg: element.target.value,
                      }));
                    }}
                  ></Input>
                </Row>
              </Row>
              <Row style={styles.formLine}>
                <Row style={styles.inputContainer}>
                  <label style={styles.singleLabel}>CPF:</label>
                  <Input
                    style={styles.singleInput}
                    type="text"
                    maxLength={14}
                    value={filterInput.cpf}
                    onChange={(element) => {
                      setFilterInput((p) => ({
                        ...p,
                        cpf: element.target.value,
                      }));
                    }}
                  ></Input>
                </Row>
              </Row>
              <Row style={styles.formLine}>
                <Row style={styles.inputContainer}>
                  <label style={styles.singleLabel}>Sexo:</label>
                  <Select
                    style={styles.singleInput}
                    placeholder="Escolha uma opção"
                    value={filterInput.sexo}
                    onChange={(element) => {
                      setFilterInput((p) => ({ ...p, sexo: element }));
                    }}
                  >
                    <Option value="Masculino">Masculino</Option>
                    <Option value="Feminino">Feminino</Option>
                  </Select>
                </Row>
              </Row>
              <Row style={styles.formLine}>
                <Button
                  type="primary"
                  /*
                    - Utilizando o preventDefault e return false para evitar que a página dê um refresh.
                    - Função do useCallback para passar os valores finais dos campos de filtro ao "filterParam".
                  */
                  onClick={(e) => {
                    e.preventDefault();
                    valorInputFormulario();
                    return false;
                  }}
                >
                  Buscar
                </Button>
              </Row>
            </Col>
          </form>
          <Col style={styles.dataBox}>
            <Title level={5} style={styles.h2}>
              Pessoas Cadastradas
            </Title>
            <List
              /*
                - Envia como parâmetro os valores finais preenchidos nos filtros.
                - E a função para setar o total, depois que a tabela for filtrada. 
              */
              filter={filterParam}
              setTotal={setTotal}
            />
          </Col>
        </Col>
      </Col>
    </div>
  );
}

export default ReportPerson;
