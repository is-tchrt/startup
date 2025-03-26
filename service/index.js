const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

const authCookieName = 'token';

let nextIndex = 1;

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Register a new user
apiRouter.post('/create', async (req, res) => {
  if (await findUser('username', req.body.username)) {
    res.status(409).send({msg: 'username unavailable'});
  } else {
    const user = await addUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({username: user.username});
  }
});

// Login a user
apiRouter.post('/login', async (req, res) => {
  const user = await findUser('username', req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({username: user.username});
      return;
    }
  }
  res.status(401).send({msg: "Unauthorized"});
});

// Logout a user
apiRouter.delete('/logout', async (req, res) => {
  await DB.logoutUser(req.cookies[authCookieName]);
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Create/register the user's group
apiRouter.put('/group', verifyAuth, async (req, res) => {
  if (await DB.getGroup(req.body.group) === null) {
    await DB.addGroup({name: req.body.group, list: []});
  }
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    user.group = req.body.group;
    await DB.updateUser(user);
  }
  res.status(200).send();
});

// Add a list item
apiRouter.post('/list', verifyAuth, async (req, res) => {
  const group = req.body.group;
  const item = req.body.item;
  item.id = nextIndex++;
  group['list'].push(req.body.item);
  await DB.updateGroupList(group);
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
  await DB.updateGroupList(group);
  res.status(200).send({list: group['list']});
});

// Delete an item from the list
apiRouter.delete('/list', verifyAuth, async (req, res) => {
  const group = req.body.group;
  group['list'] = group['list'].filter((currentItem) => {return currentItem['id'] !== req.body.itemId});
  await DB.updateGroupList(group);
  res.status(200).send({list: group['list']});
});

async function verifyAuth(req, res, next) {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    const group = await findGroup(user.group);
    req.body.user = user;
    req.body.group = group;
    next();
  } else {
    res.status(401).send({msg: "Unauthorized"});
  }
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === "username") {
    user = await DB.getUserByUsername(value);
    return user;
  } else {
    return await DB.getUserByToken(value);
  }
}

async function findGroup(name) {
  return await DB.getGroup(name);
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
  await DB.addUser(user);

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
