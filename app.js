const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

//create app constant, equal to a new instance of express
const app = express();

// static files such as css and images,
// we need a static funciton from express
//folder:public
app.use(express.static("public"));

// let the app to use the bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  //   console.log(firstName, lastName, email);
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data); //turn js object into a string
  const url = "https://us10.api.mailchimp.com/3.0/lists/2bc229ac7c";
  const options = {
    method: "POST",
    auth: "su:d65cb09645c6b418fc427f53b2f9b2e7-us101",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log(" server is running on port 3000");
});

//apiKey
//d65cb09645c6b418fc427f53b2f9b2e7-us10

//unique id for list
// 2bc229ac7c
