'use strict';

var game = game || {};

(() => {
	let add_vec = game.maths.add_vec;
	let multiply_vec = game.maths.multiply_vec;
	let eq_vec = game.maths.eq_vec;
	
	let get_status = game.units.get_status;
	let set_status = game.units.set_status;
	let update_status = game.units.update_status;
	let unit = game.units.unit;
	let delay = game.units.delay;
	let create_attack = game.units.create_attack;
	
	let normie = (pos) => {
		let normie_attack = (unit) => {
			let attack = create_attack(
				unit,
				{ enemies: [
					{ status: "health",
					  method: (health) => health - 1 }
				] },
				() => {
					update_status(
						attack,
						"pos",
						add_vec,
						[
							get_status(attack, "vel")[0],
							get_status(attack.attacker, "vel")[1]
						])

					update_status(
						attack,
						"ticks_left",
						tick => tick - 1,
						get_status(attack, "ticks_left"))

					if (get_status(attack, "ticks_left") <= 0) {
						console.log("died");
						set_status(attack, "dead", true);
					}
				},
				{
					pos: add_vec(
						get_status(unit, "pos"),
						[-(get_status(unit, "dir")[0]
						   + (-1
							  * get_status(unit, "dir")[1])),
						 get_status(unit, "dir")[1]]
					),
					vel: [-get_status(unit, "dir")[1],
						  0],
					ticks_left: 2
				}
			);

			return attack;
		};

		let normie = unit(
			"Normie",
			() => {
				if (get_status(normie, "delay", 0) <= 0) {
					delay(normie, 5);
					return normie_attack(normie);
				}
			},
			() => {
				if (get_status(normie, "health") === 0) {
					set_status(normie, "dead", true);
				} else {
					if (get_status(normie, "try_to_move_in", 0) > 0) {
						update_status(
							normie,
							"try_to_move_in",
							pause => pause - 1,
							get_status(normie, "try_to_move_in"));
					} else if (get_status(normie, "try_to_move_in") === 0) {
						set_status(normie, "vel", get_status(normie, "dir"));
						set_status(normie, "try_to_move_in", -1);
					} else if (eq_vec(
						get_status(normie, "vel"),
						[0, 0]
					)) {
						set_status(normie, "try_to_move_in", 3);
					} else {
						update_status(
							normie,
							"pos",
							add_vec,
							get_status(normie, "vel"));
					}

					if (get_status(normie, "delay", 0) > 0) {
						update_status(
							normie,
							"delay",
							delay => delay - 1,
							get_status(normie, "delay"));
					}
				}
			},
			{
				health: 5,
				pos: pos,
				vel: [0, -1],
				dir: [0, -1]
			}
		);

		return normie;
	};

	game.units.normie = normie;
})();

