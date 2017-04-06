'use strict';

var game = game || {};
game.data = game.data || {};

(() => {
	let normie = game.units.normie;
	let enemy = game.units.enemy;
	let mage = game.units.mage;
	let enemize_unit = game.units.enemize_unit;

	let tick_and_render = (ctx, units, attacks) => {
		game.tick(units, attacks);
		game.render(ctx, units, attacks);
	};

	let generate_armies = () => {
		let units = [];
		
		for (let i = 0; i < 100; i++) {
			units.push(normie([20 + 3 * (i % 10), 70 + 4 * Math.floor(i / 10)]));
			units.push(enemy([20 + 3 * (i % 10), 20 + 4 * Math.floor(i / 10)]));
		}

		for (let i = 0; i < 10; i++) {
			units.push(enemize_unit(
				mage([20 + 3 * (i % 10), 10 + 4 * Math.floor(i / 10)])
			));
		}
		
		return units;
	}

	let init = () => {
		let canvas = document.createElement('canvas');
		canvas.id = "game_canvas";
		document.body.appendChild(canvas);

		canvas.width = 600;
		canvas.height = 800;

		let ctx = canvas.getContext("2d");

		game.data.ctx = ctx;

		let units = generate_armies();
		
		game.data.units = units;
		game.data.attacks = [];

		game.render(game.data.ctx, game.data.units, game.data.attacks);
	};

	game.init = init;
	game.tick_and_render = tick_and_render;

	let start = () => {
		setTimeout(() => { tick_and_render(game.data.ctx,
										   game.data.units,
										   game.data.attacks);
						   start(); }, 200);
	};

	start();
	
})();

game.init();
