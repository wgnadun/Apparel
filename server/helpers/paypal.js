const paypal = require('paypal-rest-sdk');

paypal.configure({
    mode:'sandbox',
    client_id:'AfStiWLxaD4yEsZXiqLJcyUPTZZr8ykW0BoLPsBtWERO0OY8xi-tGukWrdOCQvRnTB7lpOmST9HyeFPs',
    client_secret:'EFgw0p-C-rJIO9zFPAG1TiTLrOhachKpYecwpyEdTJjskhw3LFLG7b-tfnN2xstXCjQuwAhegMNExaJW'
});

module.exports = paypal;