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

// get login page elements
const emailTxt = $("#txtEmail");
const passwordTxt = $("#txtPassword");
const loginBtn = $("#loginBtn")
const signupBtn = $("#signupBtn")
const logoutBtn= $("#logoutBtn")

// add login event
$("#loginBtn").on("click", e => {
// get email and password fields
const email = emailTxt.val();
const pass = passwordTxt.val();
const auth = firebase.auth();
console.log(email)
// sign in
const promise = auth.signInWithEmailAndPassword(email, pass);
promise.catch(e => console.log(e.message));
});

$("#signupBtn").on("click", e => {
  // get email and password
  // TODO: check for real email validation
  const email = emailTxt.val();
  const pass = passwordTxt.val();
  const auth = firebase.auth();
  console.log(email)
  // sign in
  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
  emailTxt.val("")
  passwordTxt.val("")
  })

// add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
if (firebaseUser) {
  console.log("you're logged in")
$("#logoutBtn").removeClass("hidden")
$(".container-two").removeClass("hidden")
$(".container-one").addClass("hidden")

  console.log(firebaseUser);
} else {
  $(".container-one").removeClass("hidden")
  $(".container-two").addClass("hidden")
  $("#logoutBtn").addClass("hidden")
  console.log('not logged in')
  // $(".container-one").removeClass("shown").addClass("hidden")

}
});


$("#logoutBtn").on("click", e => {
  firebase.auth().signOut();
});
$("#homeLogoutBtn").on("click", e => {
  firebase.auth().signOut();
});





















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
            // I tried to add a working edit and delete button
            <td><a> <i class="fas fa-pencil-alt edit-btn"></i></a>
            <a> <i class="fas fa-minus-circle edit-btn"></i></a></td>`
    );

    $("#train-tracker > tbody").append(newRow);
  })

  // buttons to edit and delete (not working)
  $(document).on("click", ".edit-btn", function() {
    var rowId = $(this).parents("tr").attr("data-id")
    console.log(rowId)

  })

  // document.ready closing bracket
})
