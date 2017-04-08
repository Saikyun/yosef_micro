'use strict';

var game = game || {};

(() => {
	let normie = game.units.normie;
	let unit = game.units.unit;

	let render = (ctx, units, attacks) => {
		ctx.clearRect(0, 0, 1000, 800);
		
		for (let unit of units) {
			render_unit(ctx, unit);
		}

		for (let attack of attacks) {
			render_attack(ctx, attack);
		}
	};
	
	let unit_colors = {
		friendly: 'rgba(0, 225, 0, 1)',
		enemy: 'rgba(225, 0, 0, 1)',
	};
	
	let unit_job = {
		knight: (ctx, x, y, w, h) => {
			ctx.fillRect(x, y, w, h);
		},
		mage: (ctx, x, y, w, h) => {
			ctx.beginPath();
			ctx.arc(x + w / 2, y + h / 2,
					(w + h) / 4, 0, 2 * Math.PI);
			ctx.fill();
		},
	};

	let render_unit = (ctx, unit) => {
		ctx.fillStyle = unit_colors[unit.team];
		
		let [x, y] = unit.pos;
		unit_job[unit.job](ctx, x * 8, y * 8, 8, 8);
	}

	let attack_color = {
		"Fireball": "rgba(255, 30, 30, 1)",
		"Strike": "rgba(125, 125, 125, 1)",
	};
	
	let attack_shape = {
		"Fireball": (ctx, x, y, w, h) => {
			ctx.beginPath();
			ctx.arc(x + w / 2, y + h / 2,
					(w + h) / 4, 0, 2 * Math.PI);
			ctx.fill();
		},
		"Strike": (ctx, x, y, w, h) => {
			ctx.fillRect(x, y, w, h);
		},
	};

	let render_attack = (ctx, attack) => {
		let [x, y] = attack.pos;
		let color = attack_color[attack.name];
		let shape = attack_shape[attack.name];

		ctx.fillStyle = color;
		shape(ctx, x * 8, y * 8, 8, 4);

		let trail = attack.trail;
		if (trail.length > 1) {
			let [x, y] = trail[0];

			ctx.lineWidth = 3;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";

			let [h, w] = [8, 4];
			ctx.moveTo(x * 8 + w / 2, y * 8 + h / 2);
			
			ctx.beginPath();

			for (let pos of trail.slice(-3)) {
				let [x, y] = pos;

				ctx.lineTo(x * 8 + w / 2, y * 8 + h / 2);
			}

			ctx.strokeStyle = color;
			ctx.stroke();
		}
	}

	game.render = render;
})();
