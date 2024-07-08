//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


const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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";

async function sendMailWithSIB(email, emailTemplate) {

  new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
    {
      'subject': 'Reset your password',
      'sender': { 'email': 'jewelrana176517@gmail.com' },
      'to': [{ 'email': email }],
      'htmlContent': emailTemplate,

    }
  ).then(function(data) {
    console.log(data);
  }, function(error) {
    console.error(error);
  });
}

module.exports = sendMailWithSIB
