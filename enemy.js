'use strict';

var game = game || {};

(() => {
	let normie = game.units.normie;
	let set_status = game.units.set_status;

	let enemy = pos => enemize_unit(normie(pos));

	let enemize_unit = unit => {
		set_status(unit, "vel", [0, 1]);
		set_status(unit, "dir", [0, 1]);
		set_status(unit, "team", "enemy");

		return unit;
	};

	game.units.enemy = enemy;
	game.units.enemize_unit = enemize_unit;
})();
