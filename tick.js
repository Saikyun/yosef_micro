'use strict';

var game = game || {};
(() => {
	let get_status = game.units.get_status;
	let set_status = game.units.set_status;
	let unit = game.units.unit;
	let affect = game.units.affect;

	let collides = (thing1, thing2) => {
		let eq_vec = game.maths.eq_vec;

		let pos1 = get_status(thing1, "pos");
		let pos2 = get_status(thing2, "pos");
		//let size1 = get_status(thing1, "size");
		//let size2 = get_status(thing2, "size");

		if (pos1 == null || pos2 == null) {
			false
		} else {
			return eq_vec(pos1, pos2);
		}
	};

	let tick = (units, attacks) => {

		let attacks_to_remove = [];

		for (let i = 0; i < attacks.length; i++) {
			let attack = attacks[i];
			
			if (!get_status(attack, "dead", false)) {
				attack.move();
			} else {
				attacks_to_remove.push(i);
			}
		}
		
		let removed = 0;
		for (let i of attacks_to_remove) {
			attacks.splice(i - removed, 1);
			removed += 1;
		}

		console.log("attacks", attacks);

		let units_to_remove = [];
		for (let i = 0; i < units.length; i++) {
			let unit = units[i];
			
			let pos = get_status(unit, "pos");
			unit.move();

			if (get_status(unit, "dead", false)) {
				units_to_remove.push(i);
			} else {
				if (units.filter(u => u !== unit && collides(u, unit)).length > 0) {
					set_status(unit, "pos", pos);
					set_status(unit, "vel", [0, 0]);
				}

				attacks.filter((attack) => 
					attack.attacker !== unit &&
						collides(unit, attack)
				).map((attack, i) => {
					affect(unit, attack.effects.enemies);
					console.log(unit + " got affected " + attack.effects.enemies);
				});
			}
		}
		
		let removed_units = 0;
		for (let i of units_to_remove) {
			units.splice(i - removed_units, 1);
			removed_units += 1;
		}

		for (let unit of units) {
			let attack = unit.attack();
			if (attack != null) { attacks.push(attack); }
		}

	};

	game.tick = tick;
})();
