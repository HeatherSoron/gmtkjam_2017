var TILES = {
	empty: '.',
	wall: '#',
	player: 'p',
	core: 'c',
	grapple: 'g',

	isWall: function(t) {
		return !t || ['wall', 'grapple'].map(key => this[key]).includes(t);
	},
	isSpecial: function(t) {
		return ['player', 'core', 'grapple'].map(key => this[key]).includes(t);
	},
}
