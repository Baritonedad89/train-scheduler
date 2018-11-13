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
  var frequency = $("#frequency").val().trim()
  var firstTtime = $("#firstTtime").val().trim()


  var firstTimeConverted = moment(firstTtime, "HH:mm");
  console.log(`first train time last year: ${firstTimeConverted}`);

  var convertTimeIntoUnix = moment(firstTimeConverted).format("X")
  console.log(`first train time converted into unix time: ${convertTimeIntoUnix}`)

  var thisMomentInUnix = moment().format("X");
  console.log(`This moment in unix time ${thisMomentInUnix}`)

  var diffTime = moment().diff(moment(firstTimeConverted, "X"), "minutes");
  console.log(`difference in time: ${diffTime}`)

  var tRemainder = diffTime % frequency;
    console.log(`remaining time = ${tRemainder}`);

    var tMinutesTillTrain = frequency - tRemainder;
        console.log(`MINUTES TILL TRAIN: ${tMinutesTillTrain}`);







  $("#trainName").val("")
  $("#destination").val("")
  $("#frequency").val("")
  $("#firstTtime").val("")


  database.ref().push({
  trainName,
  destination,
  frequency,
  dateAdded: firebase.database.ServerValue.TIMESTAMP

  });
})

database.ref().on("child_added", function (snapshot){
  var sv = snapshot.val();
$('tbody').append(`<tr>
                  <td>${sv.trainName}</td>
                  <td>${sv.destination}</td>
                  <td>${sv.frequency}</td>

                  </tr>`

       );
})
