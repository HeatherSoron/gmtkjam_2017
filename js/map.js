var TILES = {
	empty: '.',
	wall: '#',
	player: 'p',
	core: 'c',

	isWall: function(t) {
		return t == this.wall || !t;
	},
	isSpecial: function(t) {
		return ['player', 'core'].map(key => this[key]).includes(t);
	},
}
