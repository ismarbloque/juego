const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

app.use('/',express.static('public'));

http.listen(PORT,()=> {
    console.log(`Listening on http://localhost:${PORT}`);
})