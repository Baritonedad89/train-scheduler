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
// var trainName = "";
// var destination = "";
// var firstTtime = "";
// var frequency = "";

$("#submit-btn").click(function(){
  event.preventDefault();

// grab values from the inputs
  var trainName = $("#trainName").val().trim()
  var destination = $("#destination").val().trim()
  var frequency = $("#frequency").val().trim()
  var firstTtime = $("#firstTtime").val().trim();
  console.log(firstTtime)



// clears out the input
  // $("#trainName").val("")
  // $("#destination").val("")
  // $("#frequency").val("")
  // $("#firstTtime").val("")

// pushes the captured input on the firebase database
  database.ref().push({
  trainName,
  destination,
  frequency,
  dateAdded: firebase.database.ServerValue.TIMESTAMP

  });
})


database.ref().on("child_added", function (snapshot){
var trainNameDB = snapshot.val().trainName
var destinationDB = snapshot.val().destination
var frequencyDB = snapshot.val().frequency
var firstTtime = $("#firstTtime").val().trim();

// code to get the train information
  var firstTimeConverted = moment(firstTtime, "HH:mm a").subtract(1, "years");
  console.log(`first train of the day: ${firstTimeConverted}`);

  var convertTimeIntoUnix = moment(firstTimeConverted).format("X")
  console.log(`first train time converted into unix time: ${convertTimeIntoUnix}`)

  var thisMomentInUnix = moment().format("X");
  console.log(`This moment in unix time ${thisMomentInUnix}`)

  var diffTime = moment().diff(moment(firstTimeConverted, "X"), "minutes");
  console.log(`difference in time: ${diffTime}`)

  var tRemainder = diffTime % frequencyDB;
    console.log(`remaining time = ${tRemainder}`);

    var tMinutesTillTrain = frequencyDB - tRemainder;
        console.log(`MINUTES TILL TRAIN: ${tMinutesTillTrain}`);
        // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
var arrivalTime = moment(nextTrain).format("hh:mm")

  console.log(`ARRIVAL TIME: ${arrivalTime}`);




var sv = snapshot.val();
var newRow = $("<tr>").append(
            `<td>${sv.trainName}</td>
            <td>${sv.destination}</td>
            <td>${sv.frequency}</td>
            <td>${arrivalTime}</td>
            <td>${tMinutesTillTrain}</td>`


       );

       $("#train-tracker > tbody").append(newRow);

})
