'use strict';

var game = game || {};

(() => {
	let get_status = game.units.get_status;
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
		ctx.fillStyle = unit_colors[get_status(unit, "team")];
		
		let [x, y] = get_status(unit, "pos");
		unit_job[get_status(unit, "job")](ctx, x * 8, y * 8, 8, 8);
	}

	let render_attack = (ctx, attack) => {
		let [x, y] = get_status(attack, "pos");

		ctx.lineWidth = 3
		ctx.lineJoin = "round";;
		ctx.lineCap = "round";
		ctx.beginPath();
		
		ctx.strokeStyle = 'rgba(125, 125, 125, 1.0)';
		ctx.moveTo(x * 8 + 2, y * 8);
		ctx.lineTo(x * 8 - 2, y * 8);
		
		// let alpha = 1;
		// let trail = get_status(attack, "trail", []);
		// for (let pos of trail) {
		// 	alpha = alpha * 0.8;

		// 	let [x, y] = pos;

		// 	ctx.strokeStyle = 'rgba(125, 125, 125, ' + alpha + ')';
		// 	ctx.lineTo(x * 8, y * 8);
		// }

		ctx.stroke();
	}

	game.render = render;
})();
