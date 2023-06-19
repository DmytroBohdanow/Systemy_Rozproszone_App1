import dotenv from 'dotenv';
import express, { Express } from 'express';
import { routes } from './routes/index.js';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


