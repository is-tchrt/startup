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

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/create', async (req, res) => {
  console.log("doing stuff");
  if (await findUser('username', req.body.username)) {
    res.status(409).send({msg: 'username unavailable'});
  } else {
    const user = await addUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({username: user.username});
  }
});

apiRouter.post('/login', async (req, res) => {
  console.log("login");
  const user = await findUser('username', req.body.username);
  console.log(user);
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

apiRouter.delete('/logout', async () => {});

async function findUser(field, value) {
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
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
