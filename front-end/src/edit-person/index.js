import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header/index";
import {
  Row,
  Col,
  Alert,
  Typography,
  Input,
  Tooltip,
  Select,
  Button,
} from "antd";
import {
  UserSwitchOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "whitesmoke",
  },
  alert: {
    textAlign: "center",
    width: "80%",
    marginTop: "1em",
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

function EditPerson() {
  const { Title } = Typography;
  const { Option } = Select;

  const { id } = useParams();
  const [persons, setPersons] = useState([]);
  const [person, setPerson] = useState({});
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(false);
  const [msgCampoObrigatorio, setMsgCampoObrigatorio] = useState(false);
  const [validatePersonsCpf, setValidatePersonsCpf] = useState([]);
  const [validatePersonsRg, setValidatePersonsRg] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/pessoas/${id}`)
      //Quando receber uma resposta, dar um retorno.
      .then((response) => response.json())
      .then((data) => {
        setPerson(data);
      });
  }, [id]);

  const updatePerson = useCallback(() => {
    if (!person?.nome || !person?.cpf || !person?.rg) {
      setMsgCampoObrigatorio(true);
    } else {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(person),
      };
      fetch(`http://localhost:3000/pessoas/${id}`, requestOptions).then(
        (response) => {
          setMensagemSucesso(true);
        }
      );
    }
  }, [person, id]);

  /*
  Criando uma função para pegar da DataBase a lista de pessoas cadastradas: 
  - No fetch é passada a rota para coletar a lista.
  - Adicionada a função dentro de um useEffect, para carregar a lista de pessoas.
  */
  useEffect(() => {
    getListaPessoas();
  }, []);

  const getListaPessoas = useCallback(() => {
    fetch("http://localhost:3000/pessoas")
      //Quando receber uma resposta, dar um retorno.
      .then((response) => response.json())
      .then((data) => {
        setPersons(data);
      });
  }, []);

  /*
    Criando funções para requisitar se existe alguma pessoa com o mesmo cpf ou rg já cadastrada:
    - Depois ao encontrar, envia o resultado (data) nas variáveis de estado.
    - Com isso, essas variáveis contém uma lista de objetos com o mesmo cpf ou rg.
  */
  const checkUsedCpf = useCallback((cpf) => {
    let url = `http://localhost:3000/pessoas?&cpf=${cpf}`;
    fetch(url)
      //Quando receber uma resposta, dar um retorno.
      .then((response) => response.json())
      .then((data) => {
        setValidatePersonsCpf(data);
      });
  }, []);

  const checkUsedRg = useCallback((rg) => {
    let url = `http://localhost:3000/pessoas?&rg=${rg}`;
    fetch(url)
      //Quando receber uma resposta, dar um retorno.
      .then((response) => response.json())
      .then((data) => {
        setValidatePersonsRg(data);
      });
  }, []);

  const validateInput = useCallback(() => {
    if (validatePersonsCpf.length < 1 && validatePersonsRg.length < 1) {
      updatePerson();
    } else {
      setMensagemErro(true);
    }
  }, [validatePersonsCpf, validatePersonsRg, updatePerson]);

  return (
    <div>
      <Header total={persons.length} />
      <Col style={styles.main}>
        {mensagemSucesso === true ? (
          <Alert
            style={styles.alert}
            message="Cadastro alterado com sucesso!"
            type="success"
          ></Alert>
        ) : (
          ""
        )}
        {mensagemErro ? (
          <Alert
            style={styles.alert}
            message="Já existe uma pessoa com este RG ou CPF!"
            type="error"
          ></Alert>
        ) : (
          ""
        )}
        {msgCampoObrigatorio ? (
          <Alert
            style={styles.alert}
            message="Os campos com * são obrigatórios e devem ser preenchidos!"
            type="error"
          ></Alert>
        ) : (
          ""
        )}
        <Col style={styles.card}>
          <Row style={styles.titleContainer}>
            <UserSwitchOutlined style={styles.icon} />
            <Title level={4}>Detalhes da Pessoa</Title>
          </Row>
          {person && (
            <form style={styles.form}>
              <Col style={styles.dataBox}>
                <Title level={5} style={styles.h2}>
                  Informações Pessoais
                </Title>
                <Row style={styles.formLine}>
                  <Row style={styles.inputContainer}>
                    <label style={styles.singleLabel}>Nome:*</label>
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
                      value={person.nome}
                      onChange={(element) => {
                        setPerson((p) => ({
                          ...p,
                          nome: element.target.value,
                        }));
                      }}
                    ></Input>
                  </Row>
                </Row>
                <Row style={styles.formLine}>
                  <Row style={styles.inputContainer}>
                    <label style={styles.singleLabel}>RG:*</label>
                    <Input
                      style={styles.singleInput}
                      type="text"
                      value={person.rg}
                      onChange={(element) => {
                        checkUsedRg(element.target.value);
                        setPerson((p) => ({ ...p, rg: element.target.value }));
                      }}
                    ></Input>
                  </Row>
                </Row>
                <Row style={styles.formLine}>
                  <Row style={styles.inputContainer}>
                    <label style={styles.singleLabel}>CPF:*</label>
                    <Input
                      style={styles.singleInput}
                      type="text"
                      value={person.cpf}
                      maxLength={14}
                      onChange={(element) => {
                        checkUsedCpf(element.target.value);
                        setPerson((p) => ({ ...p, cpf: element.target.value }));
                      }}
                    ></Input>
                  </Row>
                </Row>
                <Row style={styles.formLine}>
                  <Row style={styles.inputContainer}>
                    <label style={styles.singleLabel}>
                      Data de Nascimento:*
                    </label>
                    <Input
                      style={styles.singleInput}
                      type="text"
                      placeholder="Escolha uma data"
                      value={person.data_nasc}
                      onChange={(element) => {
                        setPerson((p) => ({
                          ...p,
                          data_nasc: element.target.value,
                        }));
                      }}
                    ></Input>
                  </Row>
                </Row>
                <Row style={styles.formLine}>
                  <Row style={styles.inputContainer}>
                    <label style={styles.singleLabel}>Sexo:*</label>
                    <Select
                      style={styles.singleInput}
                      placeholder="Escolha uma opção"
                      value={person.sexo}
                      onChange={(element) => {
                        setPerson((p) => ({ ...p, sexo: element }));
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
                    onClick={() => {
                      validateInput();
                    }}
                  >
                    Alterar
                  </Button>
                </Row>
              </Col>
            </form>
          )}
        </Col>
      </Col>
    </div>
  );
}

export default EditPerson;
