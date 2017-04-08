'use strict';

var game = game || {};

(() => {
	let add_vec = game.maths.add_vec;
	let multiply_vec = game.maths.multiply_vec;
	let eq_vec = game.maths.eq_vec;	
	let randi = game.maths.randi;
	
	let update_status = game.units.update_status;
	let unit = game.units.unit;
	let collides = game.units.collides;
	let delay = game.units.delay;
	let create_attack = game.units.create_attack;
	
	let normie = (pos) => {
		let normie_attack = (unit, teams) => {
			let enemy_team;
			for (let team in teams) {
				if (team != unit.team) {
					enemy_team = teams[team];
					break;
				}
			}

			if (enemy_team == null) { return; }

			let attack_hitbox = {
				pos: add_vec(normie.pos,
							 normie.dir),
				size: [3, 1]
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
					attack.trail.push(attack.pos);
					
					update_status(
						attack,
						"pos",
						add_vec,
						[
							attack.vel[0],
							attack.attacker.vel[1]
						])

					update_status(
						attack,
						"ticks_left",
						tick => tick - 1,
						attack.ticks_left)

					if (attack.ticks_left <= 0) {
						console.log("died");
						attack.dead = true;
					}
				},
				
				{
					name: "Strike",
					pos: add_vec(
						unit.pos,
						[-(unit.dir[0]
						   + (-1
							  * unit.dir[1])),
						 unit.dir[1]]
					),
					vel: [-unit.dir[1],
						  0],
					size: [1, 1],
					ticks_left: 2,
					trail: [],
					
					dead: false,
				}
			);

			return attack;
		};

		let normie = unit(
			"Normie",
			
			// attack
			(teams) => {
				if (normie.delay <= 0) {
					let attack = normie_attack(normie, teams);

					if (attack != null) {
						delay(normie, randi(18, 22));
					}

					return attack;
				}
			},
			
			// move
			() => {
				if (normie.health <= 0) {
					normie.dead = true;
				} else {
					if (normie.try_to_move_in > 0) {
						update_status(
							normie,
							"try_to_move_in",
							pause => pause - 1,
							normie.try_to_move_in);
					} else if (normie.try_to_move_in === 0) {
						normie.vel = normie.dir;
						normie.try_to_move_in = -1;
					} else if (eq_vec(
						normie.vel,
						[0, 0]
					)) {
						normie.try_to_move_in = 3;
					} else {
						update_status(
							normie,
							"pos",
							add_vec,
							normie.vel);
					}

					if (normie.delay > 0) {
						update_status(
							normie,
							"delay",
							delay => delay - 1,
							normie.delay);
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

