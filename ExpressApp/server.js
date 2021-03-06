var express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const bodyParser = require('body-parser');
var request = require('request-promise');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// change by serdar

const games = [
    { id: 1, name: 'chess' },
    { id: 2, name: 'tic-tac-toe' },
    { id: 3, name: 'pong' }
]

//Render index at root '/'
app.get('/', (req, res)=>{
    res.sendFile(__dirname+"/login.html")
})

//get login info from flask side
app.post('/login', async function (req, res) {
    var options = {
        method: 'GET',
        uri: 'http://127.0.0.1:5000/',
        body:req.body,
        json: true // Automatically stringifies the body to JSON
    };

    var returndata;
    var recieverequest = await request(options)
    .then(function (parsedBody) {
        console.log(parsedBody.user_info); // parsedBody contains the data sent back from the Flask server
        returndata = parsedBody.user_info; // do something with this data, here I'm assigning it to a variable.
    })
    .catch(function (err) {
        console.log(err);
    });
    
    res.send(returndata);
});


app.post('/', (req, res)=>{
    var username = req.body.username
    var password = req.body.password

    console.log(username)
    console.log(password)
})

app.get('/game', (req, res)=>{
    res.sendFile(__dirname+"/game.html");
    //Get HTML CODE FROM FLASK
    //CREATE RENDER FUNCTION FROM HERE TO HTML
})

app.get('/games', (req, res) =>{
    res.send(games);
})


//Create Socket for Chat Connection
io.on('connection', (socket)=>{
    socket.on('chat', (msg)=>{
        io.emit('chat', msg)
    })
})

io.on('disconnect', function(){
    console.log('User Disconnected')
})

app.use(express.static('public'))


//PORT
const port = process.env.PORT || 3001;
http.listen(port, ()=>{
    console.log(`listening to port: ${port}`)
})
