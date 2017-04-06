'use strict';

var game = game || {};

(() => {
	
	let collides = (thing1, thing2) => {
		let eq_vec = game.maths.eq_vec;

		let pos1 = get_status(thing1, "pos");
		let pos2 = get_status(thing2, "pos");
		let size1 = get_status(thing1, "size");
		let size2 = get_status(thing2, "size");

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

	let get_status = (unit, status, start_status) => {
		if (unit.statuses[status] != null) {
			return unit.statuses[status];
		} else if (start_status != null) {
			console.log(status + " of " + unit + " is null");

			unit.statuses[status] = start_status;
			return unit.statuses.status
		}

		console.log(status + " of " + unit + " is null");
	};

	let update_status = (unit, status, method, args, start_status) => {
		let old_status = get_status(unit, status, start_status);
		let new_status = method(old_status, args);

		unit.statuses[status] = new_status;
	};

	let set_status = (unit, status, value) => {
		update_status(unit, status, () => value);
	};

	let unit = (name, attack, move, statuses) => {
		return {
			name: name,
			attack: attack,
			move: move,
			statuses: statuses,
		};
	};

	let create_attack = (attacker, effects, move, statuses) => {
		return {
			attacker: attacker,
			effects: effects,
			move: move,
			statuses: statuses,
		};
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
					method: (delay) => delay + length,
					args: get_status(unit, "delay", 0)
				}
			]);
	};

	game.units = game.units || {};
	game.units.unit = unit;
	game.units.create_attack = create_attack;
	game.units.affect = affect;
	game.units.get_status = get_status;
	game.units.set_status = set_status;
	game.units.delay = delay;
	game.units.create_attack = create_attack;
	game.units.update_status = update_status;
	game.units.collides = collides;

})();
