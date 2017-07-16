var TILES = {
	empty: '.',
	wall: '#',
	player: 'p',
	core: 'c',
	grapple: 'g',
	spike: 's',
	slopeLeft: '/',
	slopeRight: '\\',
	hangLeft: '<',
	hangRight: '>',

	isWall: function(t) {
		return !t || ['wall', 'grapple'].map(key => this[key]).includes(t);
	},
	isSlope: function(t) {
		return ['slopeLeft', 'slopeRight', 'hangLeft', 'hangRight'].map(key => this[key]).includes(t);
	},
	isSpecial: function(t) {
		return ['spike', 'player', 'core', 'grapple'].map(key => this[key]).includes(t);
	},
}
