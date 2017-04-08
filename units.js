'use strict';

var game = game || {};

(() => {
	
	let collides = (thing1, thing2) => {
		let eq_vec = game.maths.eq_vec;

		let pos1 = thing1.pos;
		let pos2 = thing2.pos;
		let size1 = thing1.size;
		let size2 = thing2.size;

		size1 = size1 || [1, 1];
		size2 = size2 || [1, 1];

		if (pos1 == null || pos2 == null) {
			console.log("got null for collision");
			return false;
		} else {
			return pos1[0] + size1[0] * 0.5 >= pos2[0] - size2[0] * 0.5
				&& pos1[0] - size1[0] * 0.5 <= pos2[0] + size2[0] * 0.5
				&& pos1[1] + size1[1] * 0.5 >= pos2[1] - size1[1] * 0.5
				&& pos1[1] - size1[1] * 0.5 <= pos2[1] + size2[1] * 0.5;
		}
	};

	let update_status = (unit, status, method, args) => {
		let old_status = unit[status];

		if (old_status == null) {
			console.log(unit, "has no", status);
		}

		let new_status = method(old_status, args);

		unit[status] = new_status;
	};

	let unit = (name, attack, move, rest) => {
		let obj = {
			name: name,
			attack: attack,
			move: move,
		};

		for (let attr in rest) {
			obj[attr] = rest[attr];
		}

		return obj;
	};

	let create_attack = (attacker, effects, move, rest) => {
		let obj = {
			attacker: attacker,
			effects: effects,
			move: move,
		};
		
		for (let attr in rest) {
			obj[attr] = rest[attr];
		}

		return obj;
	};

	let affect = (unit, effects) => {
		for (let effect of effects) {
			update_status(
				unit,
				effect.status,
				effect.method,
				effect.args,
				effect.start
			);
		}
	};

	let delay = (unit, length) => {
		affect(
			unit,
			[
				{
					status: "delay",
					method: delay => delay + length,
				}
			]);
	};

	game.units = game.units || {};
	game.units.unit = unit;
	game.units.create_attack = create_attack;
	game.units.affect = affect;
	game.units.delay = delay;
	game.units.create_attack = create_attack;
	game.units.update_status = update_status;
	game.units.collides = collides;

})();
