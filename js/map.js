var TILES = {
	empty: '.',
	wall: '#',
	player: 'p',
	core: 'c',
	grapple: 'g',
	spike: 's',

	isWall: function(t) {
		return !t || ['wall', 'grapple'].map(key => this[key]).includes(t);
	},
	isSpecial: function(t) {
		return ['spike', 'player', 'core', 'grapple'].map(key => this[key]).includes(t);
	},
}
