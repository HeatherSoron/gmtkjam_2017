// these two variables will be used all over the place, and are defined in the init() function (in init.js)
var canvas;
var ctx;

// can be used to store game-specific data
var game = {};

function setupGameWorld() {
	// put game-specific initialization in here
	
	game.player = new Player(50, 50);
	game.core = new Macguffin(200, 50);
	game.world = new World();
	game.gravity = 20;
}

// this is the main function which runs all of our game logic. The initialization code sets this up to be run periodically
function runGame() {
	updateGame();
	renderGame();
}

function updateGame() {
	// put code in here which handles the game logic (moving the player, etc.)
	
	var player = game.player;
	if (mouseState.button) {
		player.velocity.offsetBy(mouseState.minus(player.body));

		var attraction = player.body.minus(game.core.body).times(100 * 1 / player.body.distTo(game.core.body))
		game.core.velocity.offsetBy(attraction);
		player.velocity.offsetBy(attraction.times(-1));
	}

	player.move();
	game.core.move();
}

function renderGame() {
	// clear the screen before drawing the next frame. Otherwise, each frame would be drawn on top of the last one, which is good for a painting program, but not good for a game
	clearScreen();
	
	game.player.render();
	game.core.render();
	game.world.render();
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
