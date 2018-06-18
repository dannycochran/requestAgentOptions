### Instructions

To get setup:

```sh
git clone https://github.com/dannycochran/requestAgentOptions
cd requestAgentOptions
npm install
npm run start
```

Open your browser to localhost:3000, and you'll see the resulting error.

Then, modify server.js to splat "agentOptions" in both the "getUsers" and "getPosts" request. The request will then succeed without collision of the checkServerIdentity function.