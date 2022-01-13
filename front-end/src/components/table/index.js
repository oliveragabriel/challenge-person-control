import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Table, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
  },
  alert: {
    textAlign: "center",
    width: "100%",
    marginBottom: "1em",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2em",
  },
};

/*
Criando um componente de tabela : 
- O parâmetro filter recebido na função é enviado pelo formulário de filtro com os valores finais do input de pesquisa.
- O objeto também tem a propriedade "setTotal", que é uma função para definir o valor da variável de estado "total".
*/
function List({ filter, setTotal }) {
  /*
  - O navigate recebe o path definido na Route, no OnClick direciona a tela desejada.
  */
  const navigate = useNavigate();

  const [persons, setPersons] = useState([]);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  /*
  - O useCallback recebe o id por parâmetro da tabela.
  - Baseado neste id é feita uma requisição de Delete.
  - Depois da resposta da requisição, pegamos a nova lista para atualizar a tabela.
  - E apresentamos o alerta de sucesso na ação.
  */
  const removePessoa = useCallback((id) => {
    const requestOptions = {
      method: "DELETE",
    };
    fetch(`http://localhost:3000/pessoas/${id}`, requestOptions).then(
      (response) => {
        getListaPessoas();
        setMensagemSucesso(true);
      }
    );
  }, []);

  /*
  Criando uma função para pegar da DataBase a lista de pessoas cadastradas:
  - Como dependência do useEffect fica o filter, pois deve-se monitorá-lo para sempre que sofrer alteração 
  - Adicionado um "if else" caso os filtros recebidos por parâmetro anteriormente sejam true, aplicá-los no endereço da requisição.
  - Se não houver filtros (false) então busca por todas as pessoas no endereço.
  - No fetch é passada a rota para coletar a lista.
  - Adicionada a função dentro de um useEffect, para carregar a lista de pessoas.
  - O setTotal é para devolver o tamanho para o cabeçalho.
  */
  useEffect(() => {
    getListaPessoas();
  }, [filter]);

  const getListaPessoas = useCallback(() => {
    if (filter.nome || filter.rg || filter.cpf || filter.sexo) {
      let url = "http://localhost:3000/pessoas?";
      if (filter.nome) {
        url = url.concat(`nome=${filter.nome}`);
      }
      if (filter.cpf) {
        url = url.concat(`&cpf=${filter.cpf}`);
      }
      if (filter.rg) {
        url = url.concat(`&rg=${filter.rg}`);
      }
      if (filter.sexo) {
        url = url.concat(`&sexo=${filter.sexo}`);
      }
      fetch(url)
        //Quando receber uma resposta, dar um retorno.
        .then((response) => response.json())
        .then((data) => {
          setPersons(data);
        });
    } else {
      fetch("http://localhost:3000/pessoas")
        //Quando receber uma resposta, dar um retorno.
        .then((response) => response.json())
        .then((data) => {
          setPersons(data);
          setTotal(data.length);
        });
    }
  }, [filter, setTotal]);

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "RG",
      dataIndex: "rg",
      key: "rg",
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
    },
    {
      title: "Sexo",
      key: "sexo",
      dataIndex: "sexo",
    },
    {
      title: "Ações",
      key: "actions",
      render: (person) => (
        <Space size="small">
          <Button
            title="Editar"
            onClick={() => navigate(`/edit-person/${person.id}`)}
          >
            <EditOutlined />
          </Button>
          <Button
            title="Excluir"
            onClick={() => {
              removePessoa(person.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const data = persons;

  return (
    <div style={styles.card}>
      {
        /*
          - Um operador ternário "if" para caso a variável mensagemSucesso torne-se true, carrega o alerta.
        */
        mensagemSucesso === true ? (
          <Alert
            style={styles.alert}
            message="Cadastro excluído com sucesso!"
            type="success"
          ></Alert>
        ) : (
          ""
        )
      }
      <Table style={styles.table} columns={columns} dataSource={data} />
    </div>
  );
}

export default List;
