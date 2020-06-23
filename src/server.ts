const express = require("express");
import RequestHandlerDependencies from "./injection/requestHandlers/RequestHandlerDependencies";

import AppConfig from "./config/AppConfig";

async function configureAndStartApp() {
  await AppConfig.initializeFromS3();

  const app = express();
  //const createAccountRequestHandler: RequestHandler = RequestHandlerDependencies.getCreateAccountRequestHandler();
  //const completeAccountRequestHandler: RequestHandler = RequestHandlerDependencies.getCompleteAccountRequestHandler();

  app.use(express.json());

  app.use(function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  //app.post("/users/create", async (req: any, res: any) => {
  //  console.log(`Received Create User Request: ${JSON.stringify(req.body)}`);

  //  const body = req.body;

  //  const status = await createAccountRequestHandler.handle(body);

  //  res.sendStatus(status);
  //});

  //app.post("/users/complete", async (req: any, res: any) => {
  //  console.log(`Received Complete User Request: ${JSON.stringify(req.body)}`);

  //  const body = req.body;

  //  const status = await completeAccountRequestHandler.handle(body);

  //  res.sendStatus(status);
  //});

  app.listen(3005);
}

configureAndStartApp()
  .then(() => console.log("App Started!"))
  .catch((err) => console.log(err));
