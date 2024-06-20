import mysql from "mysql2/promise";
import { Client } from "pg";
import { MongoClient } from "mongodb";
import { SingletonLogger } from "./logService";

interface UserDAO {
  insert_ticket(natureza: string, descricao: string, provider: string): any;
  list_tickets(): Promise<any[]>;
}

const logger = SingletonLogger.getInstance();

class UserDAOPG implements UserDAO {
  dbConfig: Object = {
    user: "postgres",
    host: "localhost",
    database: "uml",
    password: "123",
    port: 5432,
  };

  async insert_ticket(natureza: string, descricao: string, provider: string) {
    const client = new Client(this.dbConfig);
    let data = { natureza: natureza, descricao: descricao, provider: provider };
    console.log(data); // debug
    await client.connect();
    console.log("Conexão com o banco realizada com sucesso");
    logger.info("Conexão com o banco Postgres realizada com sucesso");

    const insertQuery =
      "INSERT INTO usuarios(natureza, descricao, provider) VALUES ($1, $2, $3)";
    await client
      .query(insertQuery, [data.natureza, data.descricao, data.provider])
      .then((result) => {
        console.log("Dados inseridos com sucesso");
        logger.info(`Dados inseridos com sucesso: ${JSON.stringify(data)}`);
      })
      .catch((error) => {
        console.error("Erro na execução da query", error);
        logger.error(`Erro na execução da query ${error}`);
      })
      .finally(() => {
        console.log("Conexão com o banco finalizada");
        logger.info("Conexão com o banco Postgres finalizada");
        client.end();
      });
  }

  async list_tickets(): Promise<any[]> {
    const client = new Client(this.dbConfig);
    let tickets: any[] = [];
    try {
      await client.connect();
      console.log("Conexão com o banco realizada com sucesso");
      const result = await client.query("SELECT * FROM usuarios");
      tickets = result.rows;
    } catch (err) {
      console.error("Erro na execução da query", err);
    } finally {
      await client.end();
      console.log("Conexão com o banco finalizada");
    }
    return tickets;
  }
}

class UserDAOMARIA implements UserDAO {
  dbConfig: Object = {
    user: "root",
    host: "localhost",
    database: "uml",
    password: "0",
    port: 3005,
  };

  async insert_ticket(natureza: string, descricao: string, provider: string) {
    const connection = await mysql.createConnection(this.dbConfig);
    let data = { natureza: natureza, descricao: descricao, provider: provider };
    console.log(data); // debug

    try {
      console.log("Conexão com o banco realizada com sucesso");
      logger.info("Conexão com o banco MariaDB realizada com sucesso");
      const insertQuery =
        "INSERT INTO usuarios(natureza, descricao, provider) VALUES (?, ?, ?)";
      await connection.execute(insertQuery, [
        data.natureza,
        data.descricao,
        data.provider,
      ]);
      console.log("Dados inseridos com sucesso");
      logger.info(`Dados inseridos com sucesso: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("Erro na execução da query", error);
      logger.error(`Erro na execução da query ${error}`);
    } finally {
      console.log("Conexão com o banco finalizada");
      logger.info("Conexão com o banco MariaDB finalizada");
      await connection.end();
    }
  }

  async list_tickets(): Promise<any[]> {
    const connection = await mysql.createConnection(this.dbConfig);
    let tickets: any[] = [];
    try {
      console.log("Conexão com o banco realizada com sucesso");
      const [rows] = await connection.query("SELECT * FROM usuarios");
      tickets = rows as any[];
    } catch (err) {
      console.error("Erro na execução da query", err);
    } finally {
      await connection.end();
      console.log("Conexão com o banco finalizada");
    }
    return tickets;
  }
}

class UserDAOMongoDB implements UserDAO {
  dbConfig = {
    url: "mongodb://localhost:27017",
    dbName: "p3",
  };

  async insert_ticket(natureza: string, descricao: string, provider: string) {
    const client = new MongoClient(this.dbConfig.url);
    let data = { natureza: natureza, descricao: descricao, provider: provider };
    console.log(data); // debug

    try {
      await client.connect();
      console.log("Conexão com o banco realizada com sucesso");
      logger.info("Conexão com o MongoDB realizada com sucesso");

      const database = client.db(this.dbConfig.dbName);
      const collection = database.collection("usuarios");

      const result = await collection.insertOne(data);
      console.log("Dados inseridos com sucesso:", result.insertedId);
      logger.info(`Dados inseridos com sucesso: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("Erro na execução da query", error);
      logger.error(`Erro na execução da query ${error}`);
    } finally {
      await client.close();
      console.log("Conexão com o banco finalizada");
      logger.info("Conexão com o banco MongoDB finalizada");
    }
  }

  async list_tickets(): Promise<any[]> {
    const client = new MongoClient(this.dbConfig.url);
    let tickets: any[] = [];
    try {
      await client.connect();
      console.log("Conexão com o banco realizada com sucesso");
      const database = client.db(this.dbConfig.dbName);
      const collection = database.collection("usuarios");
      tickets = await collection.find({}).toArray();
    } catch (err) {
      console.error("Erro na execução da query", err);
    } finally {
      await client.close();
      console.log("Conexão com o banco finalizada");
    }
    return tickets;
  }
}

export { UserDAO, UserDAOPG, UserDAOMARIA, UserDAOMongoDB };
