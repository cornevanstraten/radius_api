const http = require('http');
const app = require('./app');
const port = process.env.PORT | 3000;
const hostname = process.env.HOSTNAME

const server = http.createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log('radius api started and is running at ' + port)
});
