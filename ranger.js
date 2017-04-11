'use strict';

var game = game || {};

(() => {
	let normie = game.units.normie;
	let distance = game.units.distance;
	let collides = game.units.collides;
	let update_status = game.units.update_status;

	let get_enemy_team = game.teams.get_enemy_team;

	let angle_vel_to_delta = game.maths.angle_vel_to_delta;
	let add_vec = game.maths.add_vec;

	let ranger = (pos) => {
		let unit = normie(pos);

		unit.job = "ranger";

		let start_vel = 2;
		unit.vel = start_vel;
		unit.health = 200000000;
		unit.dir = Math.PI * 0.5;
		unit.try_to_move_in = 1;

		unit.move = (teams) => {
			if (unit.health <= 0) {
				unit.dead = true;
			} else if (unit.try_to_move_in > 0) {
				update_status(
					unit,
					"try_to_move_in",
					pause => pause - 1,
					unit.try_to_move_in);
			} else if (unit.try_to_move_in === 0) {
				unit.vel = start_vel;
				unit.try_to_move_in = -1;
			} else if (unit.vel <= 0) {
				unit.try_to_move_in = 1;
			} else {
				let enemy_team = get_enemy_team(teams, unit.team);

				if (enemy_team == null) { return; }

				let target;
				let area_to_avoid = { min: [Number.MAX_SAFE_INTEGER,
											Number.MAX_SAFE_INTEGER],
									  max: [Number.MIN_SAFE_INTEGER,
											Number.MIN_SAFE_INTEGER] };

				for (let enemy of enemy_team) {
					if (enemy.job == "mage") {
						if (target == null) {
							target = enemy;
						} else {
							let d1 = distance(unit, target);
							let d2 = distance(unit, enemy);

							if (d1 < d2) { target = enemy; }
						}
					} else {
						if (enemy.pos[0] < area_to_avoid.min[0]) {
							area_to_avoid.min[0] = enemy.pos[0];
						} else if (enemy.pos[0] > area_to_avoid.max[0]) {
							area_to_avoid.max[0] = enemy.pos[0];
						}

						if (enemy.pos[1] < area_to_avoid.min[1]) {
							area_to_avoid.min[1] = enemy.pos[1];
						} else if (enemy.pos[1] > area_to_avoid.max[1]) {
							area_to_avoid.max[1] = enemy.pos[1];
						}
					}
				}

				let size = [area_to_avoid.max[0] - area_to_avoid.min[0],
							area_to_avoid.max[1] - area_to_avoid.min[1]];
				
				let pos = [area_to_avoid.min[0] + size[0] * 0.5,
						   area_to_avoid.min[1] + size[1] * 0.5];
				
				let danger_zone = {
					pos: pos,
					size: size
				};

				let unchanged = true;
				let target_dir = [0, 0];

				if (collides(danger_zone, unit)) {
					console.log("hue", danger_zone, unit);
					target_dir[0] += unit.pos[0] - pos[0];
					target_dir[1] += unit.pos[1] - pos[1];
					unchanged = false;
				}

				if (target != null) {
					target_dir[0] -= (unit.pos[0] - target.pos[0]) * 0.1;
					target_dir[1] -= (unit.pos[1] - target.pos[1]) * 0.1;
					unchanged = false;
				}

				if (!unchanged) {
					unit.dir = Math.atan2(
						target_dir[1],
						target_dir[0]
					);

					let delta = angle_vel_to_delta(
						unit.dir,
						unit.vel
					);
					
					update_status(
						unit,
						"pos",
						add_vec,
						delta
					);
				}

				if (unit.delay > 0) {
					update_status(
						unit,
						"delay",
						delay => delay - 1,
						unit.delay);
				}
			}
		};

		return unit;
	};

	game.units.ranger = ranger;
})();
