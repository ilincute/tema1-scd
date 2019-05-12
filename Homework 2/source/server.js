
var firebase = require('firebase');
//var helloRTDB = require('helloRTDB');

var config = {
    apiKey: "AIzaSyCg7hgsbYHp6BZg9BqnUegyLmB8pSyh79g",
    authDomain: "pcd-homework2.firebaseapp.com",
    databaseURL: "https://pcd-homework2.firebaseio.com",
    projectId: "pcd-homework2",
    storageBucket: "pcd-homework2.appspot.com",
    messagingSenderId: "392030595773"
};
firebase.initializeApp(config);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/api/signup', function(req, res) {

    firebase.auth().createUserWithEmailAndPassword(
        req.body.email,
        req.body.password
    ).then(resp => {
        res.statusCode = 201;
        res.send()
    });
})

app.post('/api/logout', function(req, res) {

    firebase.auth().signOut();
    res.statusCode = 200;
    res.send()
})

app.post('/api/login', function(req, res) {
    //helloRTDB(1,2);
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(
            rsp => {
                const { user } = rsp;
                res.statusCode = 200
                res.send(user);
            });
});

app.get('/api/tasks', function(req, res) {

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser != null) 
    let tasks = []

    var ref = firebase.database().ref("tasks");

    firebase.database()
        .ref("tasks")
        .once("value")
        .then(snapshot => {
            const todoList = [];
            const completedItems = [];
            snapshot.forEach(child => {
                tasks.push({ ...child.val(), id: child.key });
            });
            res.send(tasks);
        });
    //     } else {
    //         res.statusCode = 401
    //         res.send()
    //     }
    // });
});

app.get('/api/tasks/:taskId', function(req, res) {
    console.log(req.params.taskId);
    firebase.database()
        .ref("tasks")
        .child(req.params.taskId)
        .once("value")
        .then(snapshot => {
            let task = {
                ...snapshot.val(),
                id: req.params.taskId
            }
            res.send(task)
        })
        .catch(error => ({
            errorCode: error.code,
            errorMessage: error.message
        }));
});

app.put('/api/tasks/:taskId', function(req, res) {
    let task = {
        "name": req.body.name,
        "deadline": req.body.deadline,
        "authorId": req.body.authorId
    };

    firebase.database()
        .ref("tasks")
        .child(req.params.taskId)
        .update(task);
    res.statusCode = 204
    res.send();
});

app.post('/api/tasks', function(req, res) {
    console.log(req.body);
    let task = {
        name: req.body.name,
        deadline: req.body.deadline,
        authorId: req.body.authorId
    }
    var newPostKey = firebase.database().ref().child('tasks').push().key;
    var updates = {};
    updates['/tasks/' + newPostKey] = task;
    firebase.database().ref().update(updates);
    res.statusCode = 201;
    res.send(newPostKey);
});

app.delete('/api/tasks/:taskId', function(req, res) {
    console.log("HTTP DELETE Request");

    firebase
        .database()
        .ref("tasks")
        .child(req.params.taskId)
        .remove();
    res.statusCode = 204
    res.send();
});

var server = app.listen(8080, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});