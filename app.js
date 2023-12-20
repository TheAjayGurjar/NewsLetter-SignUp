const bodyParser = require("body-parser");
const request = require("request");
const express = require("express");
const https = require("https")

const app = express();

// when we run this our page doesnt load the static files like image folder
// and styles.css in order to that we have to use a express 
// function static to use static file
app.use(express.static("public"));
// so we will create a folder public and put all those static
// files in it. now make the paths
// in html relative to public

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
});

app.post("/",function(req,res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    console.log(firstName,lastName,email);

    // storing the data into js objects which is read by the mailchimp
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    app.post("/failure", function(req,res){
        res.redirect("/")
    })

    // making the data into json format to send it to mailchimp server
    const jsonData = JSON.stringify(data);

    const url = 'https://us21.api.mailchimp.com/3.0/lists/efe356b509';
    const options = {
        method:"POST",
        auth: "TheAjayGurjar:6aaf575be90685120de84a468cfa2021-us21"
    }
    //making post request
    const request = https.request(url,options, function(response){

        // giving user a feedback based on status code
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });

    // posting data to other by making post request using https module
    request.write(jsonData);
    request.end();
});

// now app listens to the port provided by the heroku servers Or our local host
// we also create a Procfile read by heroku in order to read by witch command you want to run your server
// Procfile must be saved as instructed on heroku website
// use heroku create comand to create a doamin for your website
// then use git push heroku master to push our local files to heroku
// just wait for some time and u can test the app.
// use heroku log to get what could have gone wrong if the app crashes 
app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000.")
});


//api key
// 6aaf575be90685120de84a468cfa2021-us21
//list id
// efe356b509