'use strict';

var game = game || {};

(() => {
	let get_status = game.units.get_status;
	let normie = game.units.normie;
	let unit = game.units.unit;

	let render = (ctx, units, attacks) => {
		ctx.clearRect(0, 0, 600, 800);
		
		ctx.fillStyle = "green";
		for (let unit of units) {
			let [x, y] = get_status(unit, "pos");
			ctx.fillRect(x * 8, y * 8, 8, 8);
		}

		ctx.fillStyle = "red";
		for (let attack of attacks) {
			let [x, y] = get_status(attack, "pos");
			ctx.fillRect(x * 8, y * 8, 8, 8);
		}
	};

	game.render = render;
})();
