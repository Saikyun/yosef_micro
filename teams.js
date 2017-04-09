'use strict';

var game = game || {};

(() => {

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

	game.teams = {
		get_enemy_team: get_enemy_team,
		get_friendly_team: get_friendly_team,
	};

})();
