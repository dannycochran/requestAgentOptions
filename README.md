### Reproduce Bug

1. Set up the server:

```sh
git clone https://github.com/dannycochran/requestAgentOptions
cd requestAgentOptions
npm install
npm run start
```

2. Open your browser to localhost:3000, and you'll see the resulting error.

3. Then, modify server.js to spread "agentOptions" in both the "getUsers" and "getPosts" request. The request will then succeed without collision of the checkServerIdentity function.
