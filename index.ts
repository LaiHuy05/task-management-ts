import express, {Express} from 'express';
import * as database from "./config/database";
import cors from 'cors';
import dotenv from 'dotenv';
import mainV1Routes from './api/v1/routes/index-route';

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mainV1Routes(app);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});