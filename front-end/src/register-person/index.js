import React, { useState, useCallback, useEffect } from "react";
import Header from "../components/header/index";
import {
  Row,
  Col,
  Alert,
  Typography,
  Input,
  Tooltip,
  DatePicker,
  Select,
  Button,
} from "antd";
import {
  UserAddOutlined,
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

function RegisterPerson() {
  const { Title } = Typography;
  const { Option } = Select;

  const [persons, setPersons] = useState([]);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(false);
  const [msgCampoObrigatorio, setMsgCampoObrigatorio] = useState(false);
  const [validatePersonsCpf, setValidatePersonsCpf] = useState([]);
  const [validatePersonsRg, setValidatePersonsRg] = useState([]);

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

  // Criando um objeto com os dados de uma nova pessoa para cadastrar.
  const [person, setPerson] = useState({
    id: null,
    nome: "",
    data_nasc: "",
    rg: "",
    cpf: "",
    // -> Iniciado como null para apresentar o placeholder, senão ele apresentaria uma string vazia.
    sexo: null,
  });

  /*
  Criando uma função para adicionar na DataBase nova pessoa:
  - Condiciona a execução do restante da função a validação dos campos de input. 
  - No method é informado o tipo de requisição (Post (add)/Put (edita)/Delete (excluí)).
  - No body é enviada o novo objeto (pessoa) passando para texto com o comando stringify.
  - Depois de obter o retorno desejado, com o setMensagemSucesso é apresentada a mensagem.
  - E atualiza a variável de estado que contém a lista de pessoas.
  */
  const createNewPerson = useCallback(() => {
    if (person.nome === "" || person.cpf === "" || person.rg === "") {
      setMsgCampoObrigatorio(true);
    } else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(person),
      };
      fetch(`http://localhost:3000/pessoas/`, requestOptions).then(
        (response) => {
          console.log(response.json());
          setMensagemSucesso(true);
          getListaPessoas();
        }
      );
    }
  }, [person]);

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

  /*
    - Validação dos valores armazenados nas funções de checagem acima.
    - Caso não exista o cpf ou rg cadastrado, as variáveis são tamanho 0 e baseado nisso é feita a condição.
    - Caso não exista, aciona a função para criar a pessoa e depois limpa os campos do formulário.
    - Se existir, apresenta alerta de erro.
  */
  const validateInput = useCallback(() => {
    if (validatePersonsCpf.length < 1 && validatePersonsRg.length < 1) {
      createNewPerson();
      setPerson({
        id: null,
        nome: "",
        data_nasc: "",
        rg: "",
        cpf: "",
        sexo: null,
      });
    } else {
      setMensagemErro(true);
    }
  }, [validatePersonsCpf, validatePersonsRg]);

  return (
    <div>
      <Header
        /*
        - Envia pelo parâmetro "total" a quantidade de objetos que tem na respectiva lista de pessoas.
        */
        total={persons.length}
      />
      {console.log(persons)}
      <Col style={styles.main}>
        {
          /*
            - Um operador ternário "if" para caso a variável mensagemSucesso torne-se true, carrega o alerta.
          */
          mensagemSucesso ? (
            <Alert
              style={styles.alert}
              message="Cadastro realizado com sucesso!"
              type="success"
            ></Alert>
          ) : (
            ""
          )
        }
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
            <UserAddOutlined style={styles.icon} />
            <Title level={4}>Novo Cadastro de Pessoa</Title>
          </Row>
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
                      /*
                        - O parâmetro "p" é o objeto antigo.
                        - Pego ele, descontruo e altero somente a propriedade nome, mantendo o restante igual.
                      */
                      setPerson((p) => ({ ...p, nome: element.target.value }));
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
                    maxLength={14}
                    value={person.cpf}
                    onChange={(element) => {
                      checkUsedCpf(element.target.value);
                      setPerson((p) => ({ ...p, cpf: element.target.value }));
                    }}
                  ></Input>
                </Row>
              </Row>
              <Row style={styles.formLine}>
                <Row style={styles.inputContainer}>
                  <label style={styles.singleLabel}>Data de Nascimento:</label>
                  <DatePicker
                    style={styles.singleInput}
                    type="date"
                    placeholder="Escolha uma data"
                    format={"DD/MM/YYYY"}
                    value={person.data_nasc}
                    /*
                      - O date e select diferente dos demais utiliza-se direto o element, o console.log indicará o que utilizar em cada input.
                    */
                    onChange={(element) => {
                      // console.log(element);
                      setPerson((p) => ({ ...p, data_nasc: element }));
                    }}
                  ></DatePicker>
                </Row>
              </Row>
              <Row style={styles.formLine}>
                <Row style={styles.inputContainer}>
                  <label style={styles.singleLabel}>Sexo:</label>
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
                  onClick={(e) => {
                    /*
                      - Utilizando o preventDefault e return false para evitar que a página dê um refresh.
                      - Acionando a função do useCallback para criar no DataBase a nova pessoa.
                    */
                    e.preventDefault();
                    validateInput();
                    return false;
                  }}
                >
                  Cadastrar
                </Button>
              </Row>
            </Col>
          </form>
        </Col>
      </Col>
    </div>
  );
}

export default RegisterPerson;
