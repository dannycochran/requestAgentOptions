const express = require('express');
const request = require('request');

const server = express();

/**
 * Check that the auth certificate is for the backend service we expect.
 */
const generateServerIdentityCheck = (backendServiceName) => {
  return (host) => {
    console.log(host, backendServiceName);
    if (host !== backendServiceName) {
      throw 'Invalid server certificate presented for ' + host;
    }
    return undefined;
  };
};

const createCertOptions = (backendServiceName) => ({
  checkServerIdentity: generateServerIdentityCheck(backendServiceName)
});

const getPosts = () => {
  return new Promise(resolve => {
    const requestOptions = {
      method: 'GET',
      agentOptions: createCertOptions('jsonplaceholder.typicode.com'),
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

const getUsers = () => {
  return new Promise(resolve => {
    const requestOptions = {
      method: 'GET',
      agentOptions: createCertOptions('reqres.in'),
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

const http = server.listen(3000, () => {
  const { address, port } = http.address();
  console.log(`Server is up and running on: http://${address}:${port}`);
});