'use strict';

var game = game || {};

(() => {
	let normie = game.units.normie;
	let set_status = game.units.set_status;

	let enemy = (pos) => {
		let normie_in_disguise = normie(pos);

		set_status(normie_in_disguise, "vel", [0, 1]);
		set_status(normie_in_disguise, "dir", [0, 1]);

		return normie_in_disguise;
	};

	game.units.enemy = enemy;
})();
