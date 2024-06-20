/* Importing express framework */
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();

const port = 5002;

import { UserDAO, UserDAOPG, UserDAOMARIA, UserDAOMongoDB } from "./models/dao";
import { SingletonLogger } from "./models/logService";
const logger = SingletonLogger.getInstance();

/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({ extended: false }));
/* Habilitação de requisições partindo de outras aplicações */
app.use(
  cors({
    oringin: "*",
    credentials: true,
  })
);

/* Service route creation . */
app.get("/persist", persistence_handler);
/* Server execution */
app.listen(port, listenHandler);

/* Request handlers: */
/* Persistence Service Handler */
async function persistence_handler(req: any, res: any) {
  console.log("Persistence service request received"); //Only for debug
  logger.info("Requisição de serviço de persistência recebido");
  let natureza: string = req.query.natureza;
  let descricao: string = req.query.descricao;
  let provider: string = req.query.provider;

  switch (provider) {
    case "A": {
      //insere no postgres
      let user_dao: UserDAO = new UserDAOPG();
      await user_dao.insert_ticket(natureza, descricao, provider);
      res.end("Data successfully inserted");
      logger.info("Data successfully inserted");
      break;
    }
    case "B": {
      //insere no mongoDB
      let user_dao: UserDAO = new UserDAOMongoDB();
      await user_dao.insert_ticket(natureza, descricao, provider);
      res.end("Data successfully inserted");
      logger.info("Data successfully inserted");
      break;
    }
    case "C": {
      //insere no mariaDB
      let user_dao: UserDAO = new UserDAOMARIA();
      await user_dao.insert_ticket(natureza, descricao, provider);
      res.end("Data successfully inserted");
      logger.info("Data successfully inserted");
      break;
    }
    default: {
      res.end("Provedor não fornecido");
      logger.critical(`Chamado não aberto, Provedor não fornecido`);
      break;
    }
  }

  /*let user_dao: UserDAO = new UserDAO...();
    await user_dao.insert_ticket(natureza, descricao, provedor);
    res.end("Data successfully inserted");*/
}

function listenHandler() {
  console.log(`Listening port ${port}!`);
  logger.info(`Serviço de persistência iniciado Rodando na porta ${port}`);
}
