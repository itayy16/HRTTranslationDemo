const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when the action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {
    try {
      // *******TODO**********
      // - Call the language identification API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#identify-language
      // - if successful, resolve exactly like shown below with the
      // language that is most probable the best one in the "language" property
      // and the confidence it got detected in the "confidence" property

      // in case of errors during the call resolve with an error message according to the pattern 
      // found in the catch clause below
      const languageTranslator = new LanguageTranslatorV3({
      version: '2018-05-01',
      authenticator: new IamAuthenticator({
      apikey: '2OOAWPkIBZrUzGlEnKXru3BIsi-j24zcYVOWxtQke2nW',
      }),
      serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/93f5299e-ef85-423b-b068-8a98a8fa8bf6',
      });
      
      const identifyParams = {
        text: params.text
      };
      
      languageTranslator.identify(identifyParams)
        .then(identifiedLanguages => {
          const identificationLanguage = identifiedLanguages.result.language[0].language;
          const identificationConfidence = identifiedLanguages.result.language[0].confidence;
          //console.log(JSON.stringify(identifiedLanguages, null, 2));
          resolve({
            statusCode: 200,
            body: {
              text: params.text, 
              language: identificationLanguage,
              confidence: identificationConfidence,
            },
            headers: { 'Content-Type': 'application/json' }
          });
        })
        .catch(err => {
          console.log('error:', err);
        });

    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
