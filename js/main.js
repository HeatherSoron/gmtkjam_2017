// these two variables will be used all over the place, and are defined in the init() function (in init.js)
var canvas;
var ctx;

// can be used to store game-specific data
var game = {};

function setupGameWorld() {
	// put game-specific initialization in here

	game.gravity = 40;
	game.maxAttraction = 100;
	game.attractionPower = 100;
	game.maxLevel = 3;

	game.bgm = new Audio('./audio/bgm.wav');
	game.bgm.loop = true;
	game.bgm.play();

	game.images = {};
	[
		'ground.png',
		'breakableground.png',
		'grapple.png',
		'spikes.png',
		'core.png',
		'idlemag.png',
		//'walkingmag.png',
		'magneticmag.png',
		'slopeleft.png',
		'sloperight.png',
		'hangleft.png',
		'hangright.png',
		'GOAL.png',
		'background.png',
	].forEach(function (filename) {
		var image = new Image();
		image.onload = function() {
			image.loaded = true;
		}
		image.src = './images/' + filename;
		game.images[filename] = image;
	});

	loadLevel(1);
	
	game.tick = 0;


}

function loadLevel(level) {
	game.level = level;
	game.world = new World(level);
	
	var specialDef = {
		player: Player,
		core: Macguffin,
		goal: Goal,
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
			var bestDist = Infinity;
			for (var i = 0; i < game.grapples.length; ++i) {
				var g = game.grapples[i];
				var dist = g.center().minus(touch).lenSqrd();
				if (dist < bestDist) {
					bestDist = dist;
					grapple = g;
				}
			}
			game.glows.push(touch);
			if (grapple) {
				player.anchor = {
					pos: grapple.center(),
					obj: grapple,
				};
			}
		}

		if (player.anchor) {
			var diff = player.anchor.pos.minus(player.body)
			var tangent = new Point(diff.y, -diff.x).normalize();
			player.velocity.offsetBy(tangent.times(0.02 * tangent.dot(player.velocity)));
			player.velocity.offsetBy(diff);
		}

		player.mag = [];

		var dist = player.body.distTo(game.core.body)
		var attraction = player.body.minus(game.core.body).times(game.attractionPower * 1 / dist)
		var pow = attraction.lenSqrd();
		if (pow > 100 && (dist < 290 || game.core.mag)) {
			if (pow > game.maxAttraction * game.maxAttraction) {
				attraction = attraction.normalize().times(game.maxAttraction);
			}
			game.core.velocity.offsetBy(attraction);
			//player.velocity.offsetBy(attraction.times(-1));


			game.core.mag = [{obj: player, power: attraction}];
			player.mag.push({obj: game.core, power: attraction});
		}

		game.spikes.forEach(function(spike) {
			var dist = player.body.distTo(spike.body)
			var attraction = player.body.minus(spike.body).times(game.attractionPower * 1 / dist)
			var pow = attraction.lenSqrd();
			if (pow > 100 && (dist < 290 || spike.mag)) {
				if (pow > game.maxAttraction * game.maxAttraction) {
					attraction = attraction.normalize().times(game.maxAttraction);
				}
				spike.velocity.offsetBy(attraction);
				//player.velocity.offsetBy(attraction.times(-1));

				spike.mag = [{obj: player, power: attraction}];
				player.mag.push({obj: spike, power: attraction});
			}
		});
	} else {
		player.anchor = null;
		game.core.mag = null;
		game.player.mag = null;
		game.spikes.forEach(spike => spike.mag = null);

		if (keysHeld['a']) {
			player.velocity.x = -100;
		} else if (keysHeld['d']) {
			player.velocity.x = 100;
		}
	}

	player.move();
	game.core.move();
	game.spikes.forEach(spike => spike.move());

	if (game.core.body.minus(game.goal.body).length() < game.core.body.width) {
		win();
	}
}

function renderGame() {
	// clear the screen before drawing the next frame. Otherwise, each frame would be drawn on top of the last one, which is good for a painting program, but not good for a game
	clearScreen();

	ctx.save();
	ctx.translate(canvas.width/2 - game.player.body.x, canvas.height/2 - game.player.body.y);
	
	game.goal.render();
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
	ctx.fillStyle = '#253525';
	if (game.images['background.png'].loaded) {
		ctx.fillStyle = ctx.createPattern(game.images['background.png'], 'repeat');
	}
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function win() {
	if (game.level < game.maxLevel) {
		game.goal.render = function(){
			ctx.fillStyle = 'yellow';
			ctx.font = '25px Times New Roman';
			ctx.fillText("Levels cleared: " + game.level + "/" + game.maxLevel, this.body.x, this.body.y)
		};
		setTimeout(function() {
			loadLevel(game.level + 1);
		}, 2000);
		console.log("Won level, loading " + (game.level + 1));
	} else {
		game.goal.render = function(){
			ctx.fillStyle = 'yellow';
			ctx.font = '25px Times New Roman';
			ctx.fillText("YOU WON!", this.body.x, this.body.y)
		};
	}
}
