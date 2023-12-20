const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const log4js = require('log4js');
let logger = log4js.getLogger('Server');
const WhatsApp = require('./lib/whatsApp');
const Config = require('../config/Config');
logger.level = Config.LOG_LEVEL;

const app = express();
app.use(bodyParser.json());

const OracleBot = require('@oracle/bots-node-sdk');
const { WebhookClient, WebhookEvent } = OracleBot.Middleware;
const { MessageModel } = require('@oracle/bots-node-sdk/lib');

const webhook = new WebhookClient({
    channel: {
        url: Config.ODA_WEBHOOK_URL,
        secret: Config.ODA_WEBHOOK_SECRET
    }
});

OracleBot.init(app, {
    logger: logger,
});

// Init WhatsApp Connector
const whatsApp = new WhatsApp();

// for downloads file - @TODO: check security here
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const staticPath = path.join(__dirname, '../downloads');
app.use(express.static(staticPath));

app.get('/', (req, res) => res.send('Oracle Digital Assistant for WhatsApp app is running.'));

// Endpoint for verifying the webhook
app.get('/user/message', (req, res) => {
    try {
        logger.info('verifying the webhook from WhatsApp.');
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        if (mode === "subscribe" && token === Config.VERIFY_TOKEN) {
            console.log("Webhook verified");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } catch (error) {
        logger.error(error);
        res.sendStatus(500);
    }        
});

// Handle incoming messages from WhatsApp
app.post('/user/message', async (req, res) => {
    try {
        logger.info('Received a message from WhatsApp, processing message before sending to ODA.');
        let response = await whatsApp._receive(req.body.entry);
        
        if (response) {
            if (response.length > 0) {
                response.forEach(async message => {
                    await webhook.send(message);
                    logger.info('Message Sent successfully to ODA.');
                })
            } else {
                logger.error('Unsupported message type');
                return res.status(400).send('Unsupported message type');  
            }
        }
        res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
});

// Handle incoming messages from ODA
app.post('/bot/message', async (req, res) => {
    try {
      logger.info('Received a message from ODA, processing message before sending to WhatsApp.');
      // await whatsApp._send(req.body);

         phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
            let userName = body_param.entry[0].changes[0].value.contacts[0].profile.name;
            console.log("I am inside details -------------------------------------->");
            console.log("phone number " + phon_no_id);
            console.log("from " + from);
            console.log("Message from sender is --> " + msg_body);
            console.log("User name of the sender-->" + userName);
            // Sending Message from Whats app to ODA
            const MessageModel = webhook.MessageModel();
            const message = {
                userId: 'anonymous',
                profile: { firstName: userName, lastName: from },
                messagePayload: MessageModel.textConversationMessage(msg_body)
            };
            console.log("Message before sending to ODA is ------>" + message);
            webhook.send(message)
        
      logger.info('Message Sent successfully to WhatsApp.');
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
});

// Start the server
app.listen(Config.port, () => {
    logger.info(`Server listening at http://localhost:${Config.port}`);
});
