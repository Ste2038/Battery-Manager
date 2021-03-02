const Constants = require('./Constants');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(Constants.BotToken, {polling: true});

const ReplyKeyboard = {
    "reply_markup": {
        "keyboard": [["C1", "C2", "C3", "C4", "CT"], ["S1", "S2", "S3", "S4", "ST"], ["Visualizza"]]
    }
}

let Battery = [[1, "Scarica", 2], [2, "Scarica", 2], [3, "Scarica", 2], [4, "Scarica", 2]]

bot.sendMessage(Constants.AutorizedMasterID, "Bot Avviato", ReplyKeyboard);

var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22,0, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}
setTimeout(checkGiornaliero, millisTill10);

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
  
    bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
    console.log(msg.text);
    message = msg.text;
    if(message == "Visualizza"){
        visualizza();
    }
    else if(message[0] == "C"){
        if(message[1] == "T"){
            for(let i = 0; i < Battery.length; i++){
                Battery[i][1] = "Carica";
                Battery[i][2] = 2;
            }
            bot.sendMessage(Constants.AutorizedMasterID, "Tutte Cariche");
            visualizza();
        }
        else{
            let BattId = Number(message[1]);
            if(BattId > 0 && BattId < Battery.length){
                Battery[BattId - 1][1] = "Carica";
                Battery[BattId - 1][2] = 2;
            }
            bot.sendMessage(Constants.AutorizedMasterID, "Batteria " + BattId + " carica");
            visualizza();
        }
    }
    else if(message[0] == "S"){
        if(message[1] == "T"){
            for(let i = 0; i < Battery.length; i++){
                Battery[i][1] = "Scarica";
                Battery[i][2] = 2;
            }
            bot.sendMessage(Constants.AutorizedMasterID, "Tutte Scariche");
            visualizza();            
        }
        else{
            let BattId = Number(message[1]);
            if(BattId > 0 && BattId < Battery.length){
                Battery[BattId - 1][1] = "Scarica";
                Battery[BattId - 1][2] = 2;
            }
            bot.sendMessage(Constants.AutorizedMasterID, "Batteria " + BattId + " Scarica");
            visualizza();
        }
    }
});

bot.on("polling_error", (err) => console.log(err));

bot.on("callback_query", (msg) => {
    console.log("Callback")
});

function checkGiornaliero(){
    for (let i = 0; i < Battery.length; i++){
        if(Battery[i][2] > 0){
            Battery[i][2]--;
        }
    }
    visualizza();
}

function visualizza(){
    let testo = "Batterie:\n ";
    for(let i = 0; i < Battery.length; i++){
        testo += Battery[i][0].toString() + ". " + Battery[i][1].toString() + " " + Battery[i][2].toString() + "\n ";
    }
    bot.sendMessage(Constants.AutorizedMasterID, testo, ReplyKeyboard);
}
