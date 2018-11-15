$('document').ready(function() {

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


  $("#submit-btn").click(function() {
    event.preventDefault();

    // grab values from the inputs
    var trainName = $("#trainName").val().trim()
    var destination = $("#destination").val().trim()
    var frequency = $("#frequency").val().trim()
    var firstTtime = $("#firstTtime").val().trim();
    console.log(firstTtime)





    // pushes the captured input on the firebase database
    database.ref().push({
      trainName,
      destination,
      frequency,
      firstTtime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP


    });
    // clears out the input
    $("#trainName").val("")
    $("#destination").val("")
    $("#frequency").val("")
    $("#firstTtime").val("")

  })


  database.ref().on("child_added", function(snapshot) {
    var trainNameDB = snapshot.val().trainName
    var destinationDB = snapshot.val().destination
    var frequencyDB = snapshot.val().frequency
    var firstTtimeDB = snapshot.val().firstTtime

    function getDataUpdate() {
      database.ref().on("value", function(snapshot) {
        var sv = snapshot.val();
        var newRow = $("<tr>").append(
          `<td>${sv.trainName}</td>
                <td>${sv.destination}</td>
                <td>${sv.frequency}</td>
                <td>${arrivalTime}</td>
                <td>${tMinutesTillTrain}</td>`
          );
      })

    }





    // code to get the train information
    var firstTimeConverted = moment(firstTtimeDB, "HH:mm A");
    console.log(`first train of the day: ${firstTimeConverted}`);

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
console.log(snapshot.key)
    var newRow = $(`<tr data-id="${snapshot.key}">`).append(
      `<td>${sv.trainName}</td>
            <td>${sv.destination}</td>
            <td>${sv.frequency}</td>
            <td>${arrivalTime}</td>
            <td>${tMinutesTillTrain}</td>
            <td><a class="pl-2"> <i class="fas fa-pencil-alt edit-btn"></i></a>
            <a class="pl-5"> <i class="fas fa-minus-circle delete-btn"></i></a></td>`
    );

    $("#train-tracker > tbody").append(newRow);
  })

$(document).on("click", ".edit-btn", function() {
var rowId = $(this).parents("tr").attr("data-id")
rowId.html("<td><input type='text'></td>")

})

// document.ready closing bracket
})
