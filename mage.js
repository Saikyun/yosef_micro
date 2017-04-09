'use strict';

var game = game || {};

(() => {
	let normie = game.units.normie;
	let update_status = game.units.update_status;
	let delay = game.units.delay;
	let create_attack = game.units.create_attack;

	let get_friendly_team = game.teams.get_friendly_team;
	let get_enemy_team = game.teams.get_enemy_team;

	let rand = game.maths.rand;
	let randi = game.maths.randi;
	let add_vec = game.maths.add_vec;
	let angle_vel_to_delta = game.maths.angle_vel_to_delta;
	let between = game.maths.between;

	let mage = (pos) => {
		let unit = normie(pos);

		unit.job = "mage";
		unit.vel = [0, 0];

		unit.attack = (teams) => {
			if (unit.delay <= 0) {
				delay(unit, 50);
				return fireball(unit, teams);
			}
		};

		unit.move = (teams) => {
			if (unit.health <= 0) {
				unit.dead = true;
			} else if (unit.delay > 0) {
				update_status(
					unit,
					"delay",
					delay => delay - 1,
					unit.delay);

				let friendly_team = get_friendly_team(teams,
													  unit.team);
				if (friendly_team == null) { return; }

				let closest_knight_in_x = friendly_team
					.filter(unit => unit.job == "knight")
					.sort(unit => unit.pos[0] - unit.pos[0])
				[0];

				if (closest_knight_in_x == null) { return; }

				let distance = unit.pos[0] - closest_knight_in_x.pos[0];

				if (Math.abs(distance) > 10) {
					if (distance > 1) {
						unit.vel[0] = -1;
					} else if (distance < -1) {
						unit.vel[0] = 1;
					} else {
						unit.vel[0] = -distance;
					}
				} else {
					unit.vel[0] = 0;
				}

				let friendly_mages = friendly_team
					.filter(unit => unit.job == "mage");

				let average_mage_y = friendly_mages
					.reduce(
						(acc, unit) => { return acc + unit.pos[1]; },
						0)
					/ friendly_mages.length;

				distance = unit.pos[1] - average_mage_y;

				if (Math.abs(distance) > 0) {
					if (distance > 1) {
						unit.vel[1] = -1;
					} else if (distance < -1) {
						unit.vel[1] = 1;
					} else {
						unit.vel[1] = -distance;
					}
				} else {
					unit.vel[1] = 0;
				}

				update_status(
					unit,
					"pos",
					add_vec,
					unit.vel);
			}
		};

		return unit;
	};

	let modify_change_in_dir = (dir, curr_vel, max_vel, min_vel) => {
		if (curr_vel > max_vel * 0.8) {
			return dir * 0.3;
		} else if (curr_vel < min_vel * 2) {
			return dir * 0.4;
		} else {
			return dir * 0.1;
		}
	};
	
	let angle_fix = angle => {
		while (angle > 2 * Math.PI) { angle -= 2 * Math.PI; }
		while (angle < 0) { angle += 2 * Math.PI; }

		return angle;
	};

	let fireball = (unit, teams) => {
		let enemy_team = get_enemy_team(teams, unit.team);
		
		if (enemy_team == null) { return; }

		let target = enemy_team[randi(0, enemy_team.length)];

		let start_vel = 7;
		let decline_func = vel => Math.sqrt(Math.pow(vel, 2)
											- Math.pow(vel, 2) * 0.07);
		let min_vel = 1;

		let update = () => {
				if (target.dead === true) {
					decline_func = vel => vel * 0.5;
				}

				if (attack.vel <= min_vel) {
					attack.dead = true;
				}

				update_status(
					attack,
					"vel",
					decline_func);

				if (attack.vel < min_vel) { attack.vel = min_vel; }

				let target_pos = add_vec(target.pos,
										 target.vel);

				let pos = attack.pos;

				let poses_angle = angle_fix(Math.atan2(target_pos[1] - pos[1],
													   target_pos[0] - pos[0]));

				let current_dir = attack.dir;

				let change_in_dir =
					(angle_fix(poses_angle - current_dir) < Math.PI ?
					 1 : -1);

				change_in_dir = modify_change_in_dir(
					change_in_dir, attack.vel, start_vel, min_vel);

				if (between(-0.05, poses_angle - current_dir, 0.05)) {
					change_in_dir = poses_angle - current_dir;
				}

				attack.dir += change_in_dir;

				attack.dir = angle_fix(attack.dir);

				let delta = angle_vel_to_delta(
					attack.dir,
					attack.vel
				);

				update_status(
					attack,
					"pos",
					add_vec,
					delta
				);

				attack.size = [Math.abs(delta[0]) + 1,
							   Math.abs(delta[1]) + 1];

				attack.trail.push(attack.pos);
			};


		let effects = {
			enemies: [
				{ status: "health",
				  method: health => health - 300 }
			]
		};

		let stats = {
			name: "Fireball",

			pos: add_vec(
				unit.pos,
				[-(unit.dir[0]
				   + (-1
					  * unit.dir[1])),
				 -unit.dir[1]]
			),
			vel: start_vel,
			size: [1, 1],
			dir: Math.PI * rand(1.25, 1.75),

			alive_for: 0,
			trail: [],
			delay: 5,

			dead: false,

		};

		let attack = create_attack(
			unit, // attacker
			effects,
			update,
			stats
		);

		return attack;
	};


	// exports
	game.units.mage = mage;

})();
