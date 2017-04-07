'use strict';

var game = game || {};

(() => {
	let add_vec = game.maths.add_vec;
	let multiply_vec = game.maths.multiply_vec;
	let eq_vec = game.maths.eq_vec;	
	let randi = game.maths.randi;
	
	let get_status = game.units.get_status;
	let set_status = game.units.set_status;
	let update_status = game.units.update_status;
	let unit = game.units.unit;
	let collides = game.units.collides;
	let delay = game.units.delay;
	let create_attack = game.units.create_attack;
	
	let normie = (pos) => {
		let normie_attack = (unit, teams) => {
			let enemy_team;
			for (let team in teams) {
				if (team != unit.statuses.team) {
					enemy_team = teams[team];
					break;
				}
			}

			if (enemy_team == null) { return; }

			let attack_hitbox = {
				statuses: {
					pos: add_vec(normie.statuses.pos,
								 normie.statuses.dir),
					size: [3, 1]
				}
			};

			let should_attack = false;
			for (let enemy of enemy_team) {
				if (collides(enemy, attack_hitbox)) {
					should_attack = true;
					break;
				}
			}
			if (!should_attack) { return; }

			let attack = create_attack(
				unit,
				{ enemies: [
					{ status: "health",
					  method: (health) => health - 100 }
				] },
				// update
				() => {
					attack.statuses.trail.push(attack.statuses.pos);
					
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
					name: "Strike",
					pos: add_vec(
						get_status(unit, "pos"),
						[-(get_status(unit, "dir")[0]
						   + (-1
							  * get_status(unit, "dir")[1])),
						 get_status(unit, "dir")[1]]
					),
					vel: [-get_status(unit, "dir")[1],
						  0],
					size: [1, 1],
					ticks_left: 2,
					trail: []
				}
			);

			return attack;
		};

		let normie = unit(
			"Normie",
			
			// attack
			(teams) => {
				if (get_status(normie, "delay", 0) <= 0) {
					let attack = normie_attack(normie, teams);

					if (attack != null) {
						delay(normie, randi(18, 22));
					}

					return attack;
				}
			},
			
			// move
			() => {
				if (get_status(normie, "health") <= 0) {
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
				health: 200,
				pos: pos,
				vel: [0, -1],
				size: [1, 1],
				dir: [0, -1],

				delay: 5,
				try_to_move_in: 3,
				dead: false,
				
				team: "friendly",
				job: "knight",
			}
		);

		return normie;
	};

	game.units.normie = normie;
})();

