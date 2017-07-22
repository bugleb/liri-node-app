const twitter = require('./keys.js');

const command = process.argv[2];
const args = process.argv.splice(3);

if (command === 'my-tweets') {

} else if (command === 'spotify-this-song') {

} else if (command === 'movie-this') {

} else if (command === 'do-what-it-says') {

} else {
	console.log(`Invalid command: '${command}'`);
}