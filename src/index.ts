import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { routes } from './routes/index.js';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use('/', routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});