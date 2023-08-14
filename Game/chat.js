

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAU7N4US0JY2AhwdU4RCGzVxur9wjHPox8",
    authDomain: "match-3-toxic-chat.firebaseapp.com",
    databaseURL: "https://match-3-toxic-chat-default-rtdb.firebaseio.com",
    projectId: "match-3-toxic-chat",
    storageBucket: "match-3-toxic-chat.appspot.com",
    messagingSenderId: "208310788263",
    appId: "1:208310788263:web:7441cbdf5c2184408c7b82"
};

firebase.initializeApp(firebaseConfig);

// initialize database
const db = firebase.database();

// get user's data
const username = prompt("Please Tell Us Your Name");

// submit form
// listen for submit event on the form and call the postChat function
document.getElementById("message-form").addEventListener("submit", sendMessage);

// send message to db
function sendMessage(e) {
    e.preventDefault();

    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;

    // clear the input box
    messageInput.value = "";

    //auto scroll to bottom
    document
        .getElementById("messages")
        .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    // create db collection and send in the data
    db.ref("messages/" + timestamp).set({
        username,
        message,
    });
    console.log(message);
    // document.getElementById("messages").innerHTML =+ message;
}
// display the messages
// reference the collection created earlier
const fetchChat = db.ref("messages/");

// check for new messages using the onChildAdded event listener
fetchChat.on("child_added", function (snapshot) {
    console.log(snapshot);
    const messages = snapshot.val();
    const message = `<li class=${username === messages.username ? "sent" : "receive"
        }><span>${messages.username}: </span>${messages.message}</li>`;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;
});

// FirebaseDatabase.getInstance().getReference("messages").child("key_of_message").removeValue();