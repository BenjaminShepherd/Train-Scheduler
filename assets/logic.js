
$(document).ready(function () {


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAiGjQRn_vHDNyVaItDO24Lq4Ocviqfgco",
        authDomain: "train-scheduler-c823b.firebaseapp.com",
        databaseURL: "https://train-scheduler-c823b.firebaseio.com",
        projectId: "train-scheduler-c823b",
        storageBucket: "",
        messagingSenderId: "402365245322"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // Grab user click
    $("#addTrain").on("click", function () {
        event.preventDefault();

        //jQuery to grab HTML elements
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#firstTrain").val().trim();
        var freq = $("#frequency").val().trim();

        //create object for firebase
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: freq
        });
    });

    // How we push information to firebase
    database.ref().on("child_added", function (childSnapshot) {
        var newTrain = childSnapshot.val().trainName;
        var newLocation = childSnapshot.val().destination;
        var newFirstTrain = childSnapshot.val().firstTrain;
        var newFreq = childSnapshot.val().frequency;

        //Moment JS inputs
        var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");
        var currentTime = moment();
        //start time & time remainder
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");
        var timeRemainder = diffTime % newFreq;
        var minutesUntil = newFreq - timeRemainder;
        //next train
        var nextTrain = moment().add(minutesUntil, "minutes");
        var catchTrain = moment(nextTrain).format("HH:mm");

        //display to DOM
        $("#all-display").append(
            '<tr><td>' + newTrain +
            '</td><td>' + newLocation +
            '</td><td>' + newFreq +
            '</td><td>' + catchTrain +
            '</td><td>' + minutesUntil + '</td></tr>');

        //clear inputs
        $("#trainName, #destintaion, #firstTrain", "#interval").val("");
        return false;
    });
})