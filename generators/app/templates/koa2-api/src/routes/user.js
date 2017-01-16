import Router from 'koa-router';
import sha1 from 'sha1';
import randomstring from 'randomstring';

import { User } from 'models';

const router = new Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: user list
 *     description: return user list
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 */
router.get('/', async ctx => {
  const users = await User.find();
  ctx.body = { users };
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: user login
 *     description: user login,return user info with token
 *     tags:
 *       - User
 *     parameters:
 *       - name: user
 *         in: body
 *         required: true
 *         description: user and password
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               default: username
 *             password:
 *               type: string
 *               default: password
 *     responses:
 *       200:
 *         description: useinfo including token
 */
router.post('/login', async ctx => {
  const { name, password } = ctx.request.body;
  const user = await User.findOne({
    name,
    password: sha1(password)
  });
  if (user) {
    ctx.body = user;
  } else {
    ctx.throw(401, 'wrong username or password');
  }
});

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: register user
 *     description: create user
 *     tags:
 *       - User
 *     parameters:
 *       - name: user
 *         in: body
 *         required: true
 *         description: username and password
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               default: username
 *             password:
 *               type: string
 *               default: password
 *     responses:
 *       200:
 *         description: create new user
 */
router.post('/create', async ctx => {
  const { name, password } = ctx.request.body;
  const token = `Token ${randomstring.generate(20)}${Date.now()}${randomstring.generate(20)}`;
  let user = await User.findOne({ name });
  if (user) {
    ctx.throw(403, 'user already existed');
  }
  user = new User({
    name,
    password: sha1(password),
    role: 'user',
    token,
  });
  user = await user.save();
  ctx.body = user;
});
export default router;
