'use strict';

var game = game || {};

(() => {
	let normie = game.units.normie;

	let enemy = pos => enemize_unit(normie(pos));

	let enemize_unit = unit => {
		unit.default_dir = [0, 1];
		unit.team = "enemy";

		return unit;
	};

	game.units.enemy = enemy;
	game.units.enemize_unit = enemize_unit;
})();
