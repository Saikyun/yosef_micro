'use strict';

var game = game || {};
(() => {
	let get_status = game.units.get_status;
	let set_status = game.units.set_status;
	let unit = game.units.unit;
	let affect = game.units.affect;
	let collides = game.units.collides;
	
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
		
		let teams = {
		};
		
		let units_to_remove = [];
		for (let i = 0; i < units.length; i++) {
			let unit = units[i];

			teams[unit.statuses.team] = teams[unit.statuses.team] || [];
			teams[unit.statuses.team].push(unit);
			
			if (get_status(unit, "dead", false)) {
				units_to_remove.push(i);
			} else {
				let pos = get_status(unit, "pos");
				unit.move(teams);

				if (units.filter(u => u !== unit && collides(u, unit)).length > 0) {
					set_status(unit, "pos", pos);
					set_status(unit, "vel", [0, 0]);
				}

				attacks.filter((attack) => 
					attack.attacker !== unit &&
							   !attack.statuses.dead &&
							   collides(unit, attack)
				).map((attack, i) => {
					affect(unit, attack.effects.enemies);
					attack.statuses.dead = true;
				});
			}
		}
		
		let removed_units = 0;
		for (let i of units_to_remove) {
			units.splice(i - removed_units, 1);
			removed_units += 1;
		}

		for (let unit of units) {
			let attack = unit.attack(teams);
			if (attack != null) { attacks.push(attack); }
		}

		
	};

	game.tick = tick;
})();
