module.exports = {
    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '978515100572-er3jhn6cqelmd70ibtnpuor8eakh0th2.apps.googleusercontent.com',
        'clientSecret'  : 'GZWMHWmbHSxoqS5ZOT7MgXXO',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }
};
