const express = require('express');
const request = require('request');
const server = express();

/**
 * Check that the auth certificate is for the backend service we expect.
 */
const generateServerIdentityCheck = (backendServiceName) => {
  return (host) => {
    // Check that the host matches the expected backendServiceName.
    // When using AgentOptions with simultaneous requests that have different
    // agentOptions,, this condition is false so we throw an error. If we use
    // new http.Agent, the error goes away.
    console.log(host, backendServiceName);
    if (host !== backendServiceName) {
      throw 'Invalid server certificate presented for ' + host;
    }
    return undefined;
  };
};

const createAgentOptions = (backendServiceName) => ({
  checkServerIdentity: generateServerIdentityCheck(backendServiceName)
});

/**
 * To see the request succeed, use "agent" instead of "agentOptions".
 */
const getPosts = () => {
  return new Promise(resolve => {
    const agentOptions = createAgentOptions('jsonplaceholder.typicode.com');
    const requestOptions = {
      method: 'GET',
      // agent,
      ...agentOptions,
      url: 'https://jsonplaceholder.typicode.com/posts',
      headers: {
        Accept: 'application/json',
      }
    };
    request(requestOptions, (err, response) => {
      resolve(JSON.parse(response.body));
    });
  });
};

/**
 * To see the request succeed, use "agent" instead of "agentOptions".
 */
const getUsers = () => {
  return new Promise(resolve => {
    const agentOptions = createAgentOptions('reqres.in');
    const requestOptions = {
      method: 'GET',
      ...agentOptions,
      url: 'https://reqres.in/api/users',
      headers: {
        Accept: 'application/json',
      }
    };
    request(requestOptions, (err, response) => {
      resolve(JSON.parse(response.body));
    });
  });
};

server.get('/', async (req, res, next) => {
  try {
    const [posts, users] = await Promise.all([getPosts(), getUsers()]);
    res.json({ posts, users });
  } catch (err) {
    console.log(err.message);
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is up and running on: http://localhost:${port}`);
});