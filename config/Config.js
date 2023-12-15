// ODA Details
exports.ODA_WEBHOOK_URL = process.env.ODA_WEBHOOK_URL || 'https://oda-22c230bac6824685beccb24b591697be-da12.data.digitalassistant.oci.oraclecloud.com/connectors/v2/listeners/webhook/channels/d6ea2784-c7e3-4e42-a2f7-84903495a4d1'; 
exports.ODA_WEBHOOK_SECRET = process.env.ODA_WEBHOOK_SECRET || 'i8l1GmJbt3cbPtXBVcX3ib7hfwCcXmz2'; 

// WhatsApp Details
exports.API_URL = 'https://graph.facebook.com';
exports.ENDPOINT_API = 'messages';
exports.VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'odawhatsappmytoken'; 
exports.ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';
exports.API_VERSION = process.env.VERSION || 'v16.0';
exports.PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';
exports.LIST_TITLE_DEFAULT_LABEL = 'Select one';

// General Detail
exports.port = process.env.port || 3000;
exports.FILES_URL = ''; //your app server url
exports.LOG_LEVEL = 'info'


// WhatsApp Sender event IDs
exports.EVENT_QUEUE_MESSAGE_TO_WHATSAPP = "100";
exports.EVENT_WHATSAPP_MESSAGE_DELIVERED = "1000";
exports.EVENT_PROCESS_NEXT_WHATSAPP_MESSAGE = "2000";