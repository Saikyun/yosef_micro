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

		unit.vel = 3;
		unit.dir = Math.PI * 0.5;

		unit.move = (teams) => {
			if (unit.health <= 0) {
				unit.dead = true;
			} else if (unit.delay > 0) {
				let enemy_team = get_enemy_team(teams, unit.team);

				if (enemy_team == null) { return; }

				let target;
				let area_to_avoid = { min: [0, 0], max: [0, 0] };

				for (let enemy of enemy_team) {
					if (enemy.job == "mage") {
						if (target == null) {
							target = enemy;
						} else {
							let d1 = distance(unit, target);
							let d2 = distance(unit, enemy);

							if (d1 > d2) { target = enemy; }
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

				let pos = [area_to_avoid.min[0], area_to_avoid.min[1]];
				let size = [area_to_avoid.max[0] - area_to_avoid.min[0],
							area_to_avoid.max[1] - area_to_avoid.min[1]];
				
				let danger_zone = {
					pos: pos,
					size: size
				};

				let target_dir = [0, 0];

				if (collides(danger_zone, unit)) {
					target_dir[0] += unit.pos[0] - pos[0];
					target_dir[1] += unit.pos[1] - pos[1];
				}

				if (target != null) {
					target_dir[0] += unit.pos[0] - target.pos[0];
					target_dir[1] += unit.pos[1] - target.pos[1];
				}
				
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
		};

		return unit;
	};

	game.units.ranger = ranger;
})();
