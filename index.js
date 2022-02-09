const express = require("express");
const cors = require("cors");
const app = express();
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
//const res = require("express/lib/response");
const bodyParser = require("body-parser");
// const sleep = (waitTimeInMs) =>
//   new Promise((resolve) => setTimeout(resolve, waitTimeInMs));
// const puppeteer = require("puppeteer");
const res = require("express/lib/response");
const SESSION_FILE_PATH = './session.json';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData
});

 function deleteSession(){
    if(fs.existsSync(SESSION_FILE_PATH)) {
        fs.unlink(SESSION_FILE_PATH, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    }
}
    
    client.on('qr', (qr,) => {
        const qrvar = qr; 
        app.get("/qrdata", (req,res)=>{  
            res.json(qrvar);
          });
    });

    // client.on('authenticated', (session) => {
    //     sessionData = session;
    //       fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    //         if (err) {
    //             console.error(err);
    //         }
    //     });
    // });

    client.on('ready', () => {
        console.log("ClientReady")
        app.get("/auth", (req,res)=>{  
            res.json("ClientReady");
          });
        app.post("/send_msg", (req,res)=>{  
        const rec_msg = req.body.msg1;
        console.log(rec_msg)
        
        const number = [
        "919212552928@c.us",
         "919540552928@c.us",
        // "917011353435@c.us",
          "919212567096@c.us",
        //  "919891422480@c.us",
        //  "918447052138@c.us",
        //  "918921118428@c.us",
        //  "919162342793@c.us",
        //  "918447785308@c.us",
         ];
      
      //  Your message.
       const msg = rec_msg;
   
       var i ;
   
      for(i=0; i < number.length; i++){
       client.sendMessage(number[i], msg);
      } 
    });
});

    client.initialize();

    // List of data for automatic reply
    var data = [
    { id: 1, received: 'Hello', reply: 'Hi Sparepedia here, Please send 1 to know price'},
    { id: 2, received: '1', reply: 'Prices of Company are as follows to know more send the assigned code\n A.Sparepedia- $500\nB.Mittal Portfolio- $450\nC.Shivkms- $400'},
    { id: 3, received: 'A', reply: 'Sparepedia is one of the largest TV manufacturing unit based in Delhi,India\nCheck out their website www.sparepedia.com'},
    { id: 4, received: 'B', reply: 'Mittal Portfolio is a leading share brokerage company setup in Delhi,India\nTo execute the major deals and to step forward in the future always standing with you.Check out our website www.offlineshares.com'},
    { id: 5, received: 'C', reply: 'Shivkms is a very versatile  InfoTech Company in Delhi,India\n Known for its glorious and ever lasting relations with its clients,we ought to provide ou with quality service'},
    ];
        
    client.on('message', message => {
         data.find((msg) => {
            if(msg.received === message.body) {
                client.sendMessage(message.from, msg.reply);
              }
        }) 
    });



app.listen(3001, () => {
    console.log('Server is running on PORT:3001');
  });


