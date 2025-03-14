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
  if (!groups.find((group) => {group['name'] === req.body.group})) {
    groups.push({name: req.body.group, list: []});
  }
  const user = findUser('token', req.cookies[authCookieName]);
  if (user) {
    user.group = req.body.group;
  }
  res.status(200).send();
});

// Add a list item
apiRouter.post('/list', verifyAuth, async (req, res) => {
  const group = req.body.group;
  const item = req.body.item;
  item.id = nextIndex++;
  group['list'].push(req.body.item);
  res.status(200).send({list: group['list']});
});

// Get the list for the users group
apiRouter.get('/list', verifyAuth, async (req, res) => {
  const list = req.body.group['list'] || [];
  res.status(200).send({list: list});
});

// Update a list item
apiRouter.put('/list', verifyAuth, async (req, res) => {
  const group = req.body.group;
  const item = findItem('id', req.body.item.id, group['list']);
  updateItem(item, req.body.item);
  res.status(200).send({list: group['list']});
});

// Delete an item from the list
apiRouter.delete('/list', verifyAuth, async (req, res) => {
  const group = req.body.group;
  group['list'] = group['list'].filter((currentItem) => {return currentItem['id'] !== req.body.itemId});
  res.status(200).send({list: group['list']});
});

async function verifyAuth(req, res, next) {
  const user = findUser('token', req.cookies[authCookieName]);
  if (user) {
    const group = findGroup('name', user.group);
    req.body.user = user;
    req.body.group = group;
    next();
  } else {
    res.status(401).send({msg: "Unauthorized"});
  }
}

function findUser(field, value) {
  if (!value) return null;

  return users.find((user) => user[field] === value);
}

function findGroup(field, value) {
  return groups.find((group) => group[field] === value);
}

function findItem(field, value, list) {
  return list.find((item) => item[field] === value);
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

function updateItem(item, newItem) {
  item.title = newItem.title;
  item.description = newItem.description;
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
