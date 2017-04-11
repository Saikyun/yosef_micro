'use strict';

var game = game || {};

(() => {
	let angle_vel_to_delta = game.maths.angle_vel_to_delta;
	let add_vec = game.maths.add_vec;
	let multiply_vec = game.maths.multiply_vec;
	let eq_vec = game.maths.eq_vec;	
	let randi = game.maths.randi;
	let future_pos = game.maths.future_pos;
	
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
				pos: future_pos(normie.pos,
								normie.dir,
							   	normie.vel),
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
					if (unit.dead === true) { attack.dead = true; return; }
					
					attack.trail.push(attack.pos);

					let delta = angle_vel_to_delta(
						attack.dir,
						attack.vel
					);

					let unit_delta = angle_vel_to_delta(
						unit.dir,
						unit.vel
					);

					update_status(
						attack,
						"pos",
						add_vec,
						add_vec(delta, unit_delta)
					);
					
					update_status(
						attack,
						"ticks_left",
						tick => tick - 1,
						attack.ticks_left)

					if (attack.ticks_left <= 0) {
						attack.dead = true;
					}
				},
				
				{
					name: "Strike",
					pos: add_vec(
						unit.pos,
						[-(Math.cos(unit.dir) * unit.vel
						   + (-1
							  * Math.sin(unit.dir) * unit.vel)),
						 Math.sin(unit.dir) * unit.vel]
					),
					vel: 1,
					dir: Math.atan2(0, -Math.sin(unit.dir)),
					
					size: [1, 1],
					ticks_left: 5,
					trail: [],
					
					dead: false,
				}
			);

			return attack;
		};

		let start_vel = 1;

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
						normie.vel = start_vel;
						normie.try_to_move_in = -1;
					} else if (normie.vel == 0) {
						normie.try_to_move_in = 3;
					} else {
						normie.dir = Math.atan2(
							normie.default_dir[1],
							normie.default_dir[0]
						);

						let delta = angle_vel_to_delta(
							normie.dir,
							normie.vel
						);
						
						update_status(
							normie,
							"pos",
							add_vec,
							delta
						);
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
				vel: start_vel,
				dir: Math.PI * 0.5,
				default_dir: [0, -1],
				size: [1, 1],

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

