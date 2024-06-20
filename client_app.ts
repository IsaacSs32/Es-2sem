import { SingletonLogger } from "./models/logService";
import { Request, Response } from "express";
const express = require("express");

const logger = SingletonLogger.getInstance();

/* componente para ler o corpo das requisições de formulários */
const bodyParser = require("body-parser");

/* módulo para gerar requisições para o gateway de serviços */
var axios = require("axios");
import { AxiosResponse, AxiosError } from "axios";
import { list_all_tickets } from "./models/listService";

const app = express();
const port = 5003;

/* Configuração do motor de template */
app.set("view engine", "ejs");
app.set("views", "./views"); // Esta referência é do ponto de execução

/* Configuração para ler parâmetros de requisição POST */
app.use(bodyParser.urlencoded({ extended: false }));

/* Configuração do diretório de arquivos estáticos */
app.use(express.static("src/public"));

app.post("/persist", persist_insert_ticket);
// app.get('/', root_client_handler);
app.get("/persist_form", persist_client_handler);
app.listen(port, listenHandler);

/* Função para retornar a interface de persistência de texto */
function persist_client_handler(req: any, res: any) {
  res.render("index.ejs");
  logger.info("Página de Abertura de chamados aberta");
}

async function persist_insert_ticket(req: any, res: any) {
  let natureza = req.body.natureza;
  let descricao = req.body.descricao;
  let provider = req.body.provider;
  console.log(natureza);
  console.log(descricao);
  console.log(provider);
  let url =
    "http://localhost:5000/persistence?natureza=" +
    natureza +
    "&descricao=" +
    descricao +
    "&provider=" +
    provider;
  axios
    .get(url)
    .then((response: AxiosResponse) => {
      res.render("response.ejs", { service_response: response.data });
      logger.info(`Resposta do serviço: ${JSON.stringify(response.data)}`);
      // Lidar com a resposta bem-sucedida
      console.log("Status da resposta:", response.status);
      logger.info(`Status da resposta: ${JSON.stringify(response.status)}`);
      console.log("Dados da resposta:", response.data);
      logger.info(`Dados da resposta: ${response.data}`);
    })
    .catch((error: AxiosError) => {
      // Lidar com erro
      if (error.response) {
        // O servidor respondeu com algum código de status de erro
        console.error("Dados da resposta:", error.response.data);
        logger.critical(`Dados da resposta: ${error.response.data}`);
        console.error("Status da resposta:", error.response.status);
        logger.critical(
          `Status da resposta: ${JSON.stringify(error.response.status)}`
        );
        console.error("Cabeçalhos da resposta:", error.response.headers);
        logger.critical(`Cabeçalhos da resposta: ${error.response.headers}`);
      } else if (error.request) {
        // nenhuma resposta foi enviada
        console.error("Requisição:", error.request);
        logger.error(`Requisição: ${error.request}`);
      } else {
        // Algum erro de processamento
        console.error("Erro:", error.message);
        logger.error(`Erro: ${error.message}`);
      }
    });
}

// Configuração do EJS para renderização das views
app.set("view engine", "ejs");
app.set("views", "./views"); // Certifique-se de que a pasta 'views' exista e contenha o arquivo 'list.ejs'

// Adicionar a rota para listar os tickets
app.get("/list", async (req: Request, res: Response) => {
  try {
    const tickets = await list_all_tickets();
    res.render("list.ejs", { tickets });
  } catch (error) {
    console.error("Erro ao listar tickets:", error);
    res.status(500).send("Erro ao listar tickets");
  }
});

/* Tratador para inicializar a aplicação (escutar as requisições) */
function listenHandler() {
  console.log(`Escutando na porta ${port}!`);
  logger.info(`Cliente_app iniciado, Rodando na porta ${port}`);
}

export {};
