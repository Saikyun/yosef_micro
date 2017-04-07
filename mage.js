'use strict';

var game = game || {};

(() => {
	let normie = game.units.normie;
	let set_status = game.units.set_status;
	let update_status = game.units.update_status;
	let get_status = game.units.get_status;
	let delay = game.units.delay;
	let create_attack = game.units.create_attack;

	let rand = game.maths.rand;
	let randi = game.maths.randi;
	let add_vec = game.maths.add_vec;
	let angle_vel_to_delta = game.maths.angle_vel_to_delta;
	let between = game.maths.between;

	let get_enemy_team = (teams, my_team) => {
		let enemy_team;
		
		for (let team in teams) {
			if (team != my_team) {
				enemy_team = teams[team];
				break;
			}
		}

		return enemy_team;
	};

	let get_friendly_team = (teams, my_team) => {
		let friendly_team;
		
		for (let team in teams) {
			if (team == my_team) {
				friendly_team = teams[team];
				break;
			}
		}

		return friendly_team;
	};
	
	let fireball = (unit, teams) => {
		let enemy_team = get_enemy_team(teams, unit.statuses.team);
		if (enemy_team == null) { return; }

		let target = enemy_team[
			randi(0,
				 enemy_team.length)
		];

		let start_vel = 7;
		let decline_func = vel => Math.sqrt(Math.pow(vel, 2) - Math.pow(vel, 2) * 0.07);
		let min_vel = 1;

		let modify_change_in_dir = (dir, vel) => {
			if (vel > start_vel * 0.8) {
				return dir * 0.3;
			} else if (vel < min_vel * 2) {
				return dir * 0.4;
			} else {
				return dir * 0.1;
			}
		}


		let attack = create_attack(
			unit,
			{ enemies: [
				{ status: "health",
				  method: health => health - 300 }
			] },
			// update
			() => {
				if (target.statuses.dead === true) {
					attack.statuses.dead = true;
				}

				update_status(
					attack,
					"vel",
					decline_func);

				if (attack.statuses.vel < min_vel) { attack.statuses.vel = min_vel; }

				let target_pos = add_vec(target.statuses.pos,
										 target.statuses.vel);
				let pos = attack.statuses.pos;

				let angle_fix = angle => {
					while (angle > 2 * Math.PI) { angle -= 2 * Math.PI; }
					while (angle < 0) { angle += 2 * Math.PI; }
					
					return angle;
				};
				
				let poses_angle = angle_fix(Math.atan2(target_pos[1] - pos[1],
													   target_pos[0] - pos[0]));

				let current_dir = attack.statuses.dir;
				
				let change_in_dir =
					(angle_fix(poses_angle - current_dir) < Math.PI ?
					 1 : -1);

				change_in_dir = modify_change_in_dir(
					change_in_dir, attack.statuses.vel);

				if (between(-0.05, poses_angle - current_dir, 0.05)) {
					change_in_dir = poses_angle - current_dir;
				}

				attack.statuses.dir += change_in_dir;

				attack.statuses.dir = angle_fix(attack.statuses.dir);

				let delta = angle_vel_to_delta(
					attack.statuses.dir,
					attack.statuses.vel
				);

				update_status(
					attack,
					"pos",
					add_vec,
					delta
				);

				attack.statuses.size = [Math.abs(delta[0]) + 1,
										Math.abs(delta[1]) + 1];

				attack.statuses.trail.push(attack.statuses.pos);
			},
			
			{
				name: "Fireball",
				
				pos: add_vec(
					get_status(unit, "pos"),
					[-(get_status(unit, "dir")[0]
					   + (-1
						  * get_status(unit, "dir")[1])),
					 get_status(unit, "dir")[1]]
				),
				vel: start_vel,
				size: [1, 1],
				dir: Math.PI * rand(1.25, 1.75),
				
				alive_for: 0,
				trail: [],
				delay: 5,
			}
		);

		return attack;
	};

	let mage = (pos) => {
		let unit = normie(pos);

		set_status(unit, "job", "mage");
		set_status(unit, "vel", [0, 0]);

		unit.attack = (teams) => {
			if (get_status(unit, "delay", 0) <= 0) {
				delay(unit, 50);
				return fireball(unit, teams);
			}
		};
		
		unit.move = (teams) => {
			if (get_status(unit, "health") <= 0) {
				set_status(unit, "dead", true);
			} else if (get_status(unit, "delay", 0) > 0) {
				update_status(
					unit,
					"delay",
					delay => delay - 1,
					get_status(unit, "delay"));

				let friendly_team = get_friendly_team(teams,
													  unit.statuses.team);
				if (friendly_team == null) { return; }

				let closest_knight_in_x = friendly_team
					.sort(unit => unit.statuses.pos[0] - unit.statuses.pos[0])
				    [0];

				if (closest_knight_in_x == null) { return; }

				let distance = unit.statuses.pos[0] - closest_knight_in_x.statuses.pos[0];
				
				console.log(distance);
				if (Math.abs(distance) > 10) {
					if (distance > 1) {
						unit.statuses.vel[0] = -1;
					} else if (distance < -1) {
						unit.statuses.vel[0] = 1;
					} else {
						unit.statuses.vel[0] = -distance;
					}
				} else {
					unit.statuses.vel[0] = 0;
				}
				unit.statuses.vel[1] = 0;

				update_status(
					unit,
					"pos",
					add_vec,
					get_status(unit, "vel"));
			}
		};

		return unit;
	};

	game.units.mage = mage;
})();
