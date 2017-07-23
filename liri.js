const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('file-system');

const command = process.argv[2];
const args = process.argv.splice(3);

const actions = {
	'my-tweets': function() {
		const client = new Twitter(keys.twitterKeys);
		client.get('statuses/user_timeline', {screen_name: 'brainboogl', count: 20}, function(error, tweets, response) {
			for (let i = 0; i < tweets.length; i++) {
				console.log('Created: ', tweets[i].created_at);
				console.log('Tweet: ', tweets[i].text);
				console.log('');			
			}
		});
	},
	'spotify-this-song': function(args) {
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
	},
	'movie-this': function(args) {
		const movie = (args.length === 0) ? 'Mr. Nobody' : args[0];
		const queryURL =
			`http://www.omdbapi.com/?apikey=40e9cece&t=${movie}`;

	    request(queryURL, function(err, response, body) {
			if (err) {
				return console.log('An error occurred: ', err);
			}

	    	body = JSON.parse(body);

	    	if (body.Response === 'False') {
	    		return console.log(body.Error);
	    	}

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
	},
	'do-what-it-says': function() {
		fs.readFile("random.txt", "utf8", function(err, data) {
			if (err) {
				return console.log('An error occurred: ', err);
			}

			const fileContents = data.split(',');
			const command = fileContents[0];
			const arg = (fileContents[1].length > 1) ? fileContents[1] : '';

			actions[command](arg);
		});
	}
};

const validCommands = ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'];

if (validCommands.indexOf(command) === -1) {
	return console.log(`Invalid command: '${command}'`);
}

actions[command](args);