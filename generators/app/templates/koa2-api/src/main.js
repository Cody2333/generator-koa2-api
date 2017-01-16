import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import log from 'log';
import config from 'config';
import router from 'routes';
import cors from 'kcors';
import { db } from 'utils';
// error handle
process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  log.error('uncaughtException:', err);
});

const app = new Koa();

db.init();
app.use(BodyParser());
app.use(cors());

app.use(router.routes());

const port = config[process.env.NODE_ENV || 'develop'].port;

export default app.listen(port, () => {
  log.info(`server listen at ${port}`);
});
