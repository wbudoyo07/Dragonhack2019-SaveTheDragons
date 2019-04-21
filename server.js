// server.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectID: 'savethedrags',
  keyFilename: 'savethedrags-76496b4cd7c0.json',
});

let input="";
let days;

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  days = req.query.days;
  console.log(days);
  res.status(200).sendFile(__dirname + '/client/index.html');
});

app.get('/student', (req, res) => {
    res.status(200).sendFile(__dirname + '/client/student.html');
  });
app.get('/authorized', (req,res) => {
  res.status(200).sendFile(__dirname + '/client/authorized.html');
});

app.get('/show', (req, res) => {
  days = req.query.days;
  res.send(days);
});

// app.get('/store', (req, res) => {
//   var crime = db.collection('reports').doc('case1');
//
//   var setCrime = crime.set({
//     'crime': input.crime,
//     'date': input.date,
//     'time': input.time,
//     'location': input.location,
//     'details': input.details,
//   });
//
//   var crime2 = db.collection('reports').doc('case2');
//   var setCrime2 = crime2.set({
//     'crime': 'input.crime',
//     'date': 'input.date',
//     'time': 'input.time',
//     'location': 'input.location',
//     'details': 'input.details',
//   });
// });


app.get('/all', (req,res) => {
  // if(days == undefined) {
    days = 999999;
  // }else {
  //   days = req.query.days;
  // }
  console.log(days);
  let arr = [];
  db.collection('reports').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      d = new Date(doc.data().date);
      today = new Date();
      const diffTime = Math.abs(today.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // console.log(diffDays);
      if(diffDays < days){
        arr.push(doc.data());
      }
    });
    res.send(arr);
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
});

app.post('/input', (req, res) => {
  input = req.body;

  var crime = db.collection('reports').add({
    'firstName': input.firstName,
    'lastName': input.lastName,
    'crime': input.crime,
    'date': input.date,
    'time': input.time,
    'location': input.location,
    'details': input.details,
  }).then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });

});

app.get('/input', (req, res) => {
  console.log(input);
  res.send(input);
});

app.listen(PORT, () => {
  console.log(`App is up and running. Listening on port ${PORT}`);
});
