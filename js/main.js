// these two variables will be used all over the place, and are defined in the init() function (in init.js)
var canvas;
var ctx;

// can be used to store game-specific data
var game = {};

function setupGameWorld() {
	// put game-specific initialization in here

	game.images = {};
	[
		'ground.png',
		'grapple.png',
		'spikes.png',
		'core.png',
		'idlemag.png',
		'magneticmag.png',
	].forEach(function (filename) {
		var image = new Image();
		image.onload = function() {
			image.loaded = true;
		}
		image.src = './images/' + filename;
		game.images[filename] = image;
	});
	
	game.world = new World();
	
	var specialDef = {
		player: Player,
		core: Macguffin,
	}

	game.grapples = [];
	game.spikes = [];

	game.world.special.forEach(function(item) {
		var constructor = specialDef[item.kind];
		if (constructor) {
			game[item.kind] = new constructor(item.pos.x, item.pos.y);
		} else if (item.kind == 'grapple') {
			game.grapples.push(new Rectangle(item.pos.x - tileSize/2, item.pos.y - tileSize/2, tileSize, tileSize));
		} else if (item.kind == 'spike') {
			game.spikes.push(new Spike(item.pos.x, item.pos.y));
		}
	});

	game.gravity = 40;
	game.maxAttraction = 100;
	game.tick = 0;
}

// this is the main function which runs all of our game logic. The initialization code sets this up to be run periodically
function runGame() {
	updateGame();
	renderGame();
}

function updateGame() {
	// put code in here which handles the game logic (moving the player, etc.)

	game.tick += 1;
	
	var player = game.player;
	if (mouseState.button) {
		game.glows = [];
		if (!player.anchor) {
			var touch = mouseState.minus(new Point(canvas.width/2 - game.player.body.x, canvas.height/2 - game.player.body.y))
			var grapple = null;
			for (var i = 0; i < game.grapples.length; ++i) {
				var g = game.grapples[i];
				if (g.contains(touch)) {
					grapple = g;
					break;
				}
			}
			game.glows.push(touch);
			if (grapple) {
				player.anchor = {
					pos: touch,
					obj: grapple,
				};
			}
		}

		if (player.anchor) {
			player.velocity.offsetBy(player.anchor.pos.minus(player.body));
		}

		player.mag = [];

		var attraction = player.body.minus(game.core.body).times(10000 * 1 / player.body.sqrDistTo(game.core.body))
		var pow = attraction.lenSqrd();
		if (pow > 100) {
			if (pow > game.maxAttraction * game.maxAttraction) {
				attraction = attraction.normalize().times(game.maxAttraction);
			}
			game.core.velocity.offsetBy(attraction);
			player.velocity.offsetBy(attraction.times(-1));


			game.core.mag = [{obj: player, power: attraction}];
			player.mag.push({obj: game.core, power: attraction});
		}

		game.spikes.forEach(function(spike) {
			var attraction = player.body.minus(spike.body).times(10000 * 1 / player.body.sqrDistTo(spike.body))
			var pow = attraction.lenSqrd();
			if (pow > 100) {
				if (pow > game.maxAttraction * game.maxAttraction) {
					attraction = attraction.normalize().times(game.maxAttraction);
				}
				spike.velocity.offsetBy(attraction);
				player.velocity.offsetBy(attraction.times(-1));

				spike.mag = [{obj: player, power: attraction}];
				player.mag.push({obj: spike, power: attraction});
			}
		});
	} else {
		player.anchor = null;
		game.core.mag = null;
		game.player.mag = null;
		game.spikes.forEach(spike => spike.mag = null);
	}

	player.move();
	game.core.move();
	game.spikes.forEach(spike => spike.move());
}

function renderGame() {
	// clear the screen before drawing the next frame. Otherwise, each frame would be drawn on top of the last one, which is good for a painting program, but not good for a game
	clearScreen();

	ctx.save();
	ctx.translate(canvas.width/2 - game.player.body.x, canvas.height/2 - game.player.body.y);
	
	game.core.render();
	game.spikes.forEach(spike => spike.render());
	game.player.render();
	game.world.render();

	if (mouseState.button) {
		game.glows.forEach(function (glow) {
			var outerRad = 15;
			var gradient = ctx.createRadialGradient(glow.x, glow.y, outerRad, glow.x, glow.y, 0);
			gradient.addColorStop(0,"rgba(0,0,200,0.0)");
			gradient.addColorStop(1,"rgba(0,0,127,0.7)");
			ctx.fillStyle = gradient;
			ctx.arc(glow.x, glow.y, outerRad, 0, 2 * Math.PI);
			ctx.fill();
		});
	}

	ctx.restore();
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
