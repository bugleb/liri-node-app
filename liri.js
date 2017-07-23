const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');

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
	const client = new Spotify(keys.spotifyKeys);
	const songName = (args.length === 0) ? 'The Sign' : args[0];

	client.search({ type: 'track', query: songName }, function(err, data) {
		if (err) {
			return console.log('An error occurred: ', err);
		}

		for (let i = 0; i < data.tracks.items.length; i++) {
			const song = data.tracks.items[i];

			const artists = [];
			for (let j = 0; j < song.artists.length; j++) {
				artists.push(song.artists[j].name);
			}

			console.log('Artist(s): ', artists.join(', '));
			console.log('Song Name: ', song.name);
			console.log('Preview: ', song.preview_url);
			console.log('Album: ', song.album.name);
			console.log('');
		}
	});
} else if (command === 'movie-this') {
	const movie = (args.length === 0) ? 'Mr. Nobody' : args[0];
	const queryURL =
		`http://www.omdbapi.com/?apikey=40e9cece&t=${movie}`;

    request(queryURL, function(error, response, body) {
    	body = JSON.parse(body);
    	console.log('Title: ', body.Title);
    	console.log('Year: ', body.Year);

    	const ratings = {};
    	for (let i = 0; i < body.Ratings.length; i++) {
    		ratings[body.Ratings[i].Source] = body.Ratings[i].Value;
    	}

    	console.log('IMDB Rating: ', ratings['Internet Movie Database']);
    	console.log('Rotten Tomatoes Rating: ', ratings['Rotten Tomatoes']);
    	console.log('Country: ', body.Country);
    	console.log('Language: ', body.Language);
    	console.log('Plot: ', body.Plot);
    	console.log('Actors: ', body.Actors);
    });
} else if (command === 'do-what-it-says') {

} else {
	console.log(`Invalid command: '${command}'`);
}