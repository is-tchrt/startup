const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

const authCookieName = 'token';

// Store users and groups in memory. The todo list
// for each group is stored within that group in the
// groups list.
let users = [];
let groups = [];
let nextIndex = 1;

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/create', async (req, res) => {
  if (findUser('username', req.body.username)) {
    res.status(409).send({msg: 'username unavailable'});
  } else {
    const user = await addUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({username: user.username});
  }
});

apiRouter.post('/login', async (req, res) => {
  const user = findUser('username', req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({username: user.username});
      return;
    }
  }
  res.status(401).send({msg: "Unauthorized"});
});

apiRouter.delete('/logout', async (req, res) => {
  const user = findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.put('/group', async (req, res) => {
  console.log('worked');
  if (!groups.find((group) => {group['name'] === req.body.group})) {
    groups.push({name: req.body.group, list: []});
  }
  const user = findUser('token', req.cookies[authCookieName]);
  if (user) {
    user.group = req.body.group;
  }
  console.log(user);
  res.status(200).send();
});

apiRouter.post('/list', verifyAuth, async (req, res) => {
  const group = groups.find((group) => {group['name'] === req.body.user.group});
  const item = req.body.item;
  item.index = nextItem++;
  group['list'].push(req.body.item);
});

apiRouter.delete('/list', verifyAuth, async (req, res) => {
  const group = groups.find((group) => {group['name'] === req.body.user.group});
  const item = group['list'].find((item) => {item.id === req.body.itemId});
  if (item) {
    delete item;
  }
  res.status(204).send({list: group['list']});
});

async function verifyAuth(req, res, next) {
  const user = findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.body.user = user;
    next();
  } else {
    res.status(401).send({msg: "Unauthorized"});
  }
}

function findUser(field, value) {
  return users.find((user) => user[field] === value);
}

async function addUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: hashedPassword,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    SameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
