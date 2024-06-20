import { UserDAOPG } from "./models/dao";
import { SingletonLogger } from "./models/logService";
import { Request, Response } from 'express';
const express = require('express');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = SingletonLogger.getInstance()

var cors = require('cors');
const app = express();

/* Em uma mesma máquina, aplicações web diferentes devem ser executadas
em portas diferentes.*/
const port = 5000;


/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({extended: false}));
/* Habilitação de requisições partindo de outras aplicações */
app.use(cors({
    oringin: '*',
    credentials: true
})); 

// defined proxy persistence requests
const persistence_target = 'http://localhost:5002/persist';

const persistence_proxy = createProxyMiddleware({
    target: persistence_target,
    changeOrigin: true, // Required for virtual hosted sites
    pathRewrite: { '^/persistence': '' }
  });
  

  app.use('/persistence', persistence_proxy); 
  /* Server execution */
  app.listen(port, listenHandler);
  
  function listenHandler(){
      console.log(`Listening port ${port}!`);
      logger.info(`Api_Gateway iniciada, rodando na porta ${port}!`)

  }
