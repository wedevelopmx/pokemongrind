module.exports = {
    'facebookAuth' : {
        'clientID'      : '274910022893050', // your App ID
        'clientSecret'  : 'd6cb8e518bdf329901f29408d6e57731', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'profileFields' : ['id', 'emails', 'name', 'picture', 'link']
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
