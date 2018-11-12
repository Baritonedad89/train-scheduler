  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBqXLjTvAXHCDVfAehYtcIPZThpJbNwCmI",
    authDomain: "train-scheduler-7cdca.firebaseapp.com",
    databaseURL: "https://train-scheduler-7cdca.firebaseio.com",
    projectId: "train-scheduler-7cdca",
    storageBucket: "train-scheduler-7cdca.appspot.com",
    messagingSenderId: "463759758424"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var trainName = "";
var destination = "";
var firstTtime = "";
var frequency = "";

$("#submit-btn").click(function(){
  var trainName = $("#trainName").val().trim()
  var destination = $("#destination").val().trim()

  $("#trainName").val("")
  $("#destination").val("")

  database.ref().push({
  trainName,
  destination,
  dateAdded: firebase.database.ServerValue.TIMESTAMP

  });
})

database.ref().on("child_added", function (snapshot){
  var sv = snapshot.val();
$('tbody').append(`<tr>
                  <td>${sv.trainName}</td>
                  <td>${sv.destination}</td>
                  </tr>`

       );
})
