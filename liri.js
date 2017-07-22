const keys = require('./keys.js');
const Twitter = require('twitter');

const command = process.argv[2];
const args = process.argv.splice(3);

if (command === 'my-tweets') {
	const client = new Twitter(keys.twitterKeys);
	client.get('statuses/user_timeline', {screen_name: 'brainboogl', count: 20}, function(error, tweets, response) {

		for (let i = 0; i < tweets.length; i++) {
			console.log('Created: ', tweets[i].created_at);
			console.log('Tweet: ', tweets[i].text);
			console.log('');			
		}
	});
} else if (command === 'spotify-this-song') {

} else if (command === 'movie-this') {

} else if (command === 'do-what-it-says') {

} else {
	console.log(`Invalid command: '${command}'`);
}