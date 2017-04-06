'use strict';

var game = game || {};

(() => {
	let zip = (vec1, vec2, method) => vec1.map((val1, i) => method(val1, vec2[i]));

	let multiply_vec = (vec1, vec2) => zip(vec1,
										   vec2,
										   (val1, val2) => val1 * val2);

	let add_vec = (vec1, vec2) => zip(vec1,
									  vec2,
									  (val1, val2) => val1 + val2);

	let eq_vec = (vec1, vec2) => zip(vec1, vec2, (val1, val2) => val1 === val2)
		.reduce((acc, val) => !acc ? acc : val,
				true)

	let rand = (min, max) => (Math.random() * (max - min)) + min;
	let randi = (min, max) => Math.floor(Math.random() * (max - min)) + min;

	let angle_vel_to_delta = (angle, vel) => {
		let change_x = Math.cos(angle) * vel;
		let change_y = Math.sin(angle) * vel;

		return [change_x, change_y];
	};

	let between = (min, value, max) => {
		if (value >= min && value <= max) {
			return true;
		}

		return false;
	};

	function assert(condition, message) {
		if (!condition) {
			throw message || "Assertion failed";
		}
	}

	// tests
	(() => {
		assert(eq_vec([1 + 7, 9 - 2], [8, 7]), "eq_vec failed");

		let zip_result = zip([1, 2], [3, 4], (v1, v2) => v1 + v2);
		assert(eq_vec(zip_result, [4, 6]), "zip failed");

		let multiply_result = multiply_vec([2, 3], [4, 5]);
		assert(eq_vec(multiply_result, [8, 15]), "multiply failed");

		let add_result = add_vec([2, 3], [4, 5]);
		assert(eq_vec(add_result, [6, 8]), "add failed");

		let angle_vel_to_delta_result = angle_vel_to_delta(Math.PI, 2);
		assert(eq_vec(angle_vel_to_delta_result.map(x => Math.round(x)), [-2, 0]),
			   "angle_vel_to_delta failed: " +
			   angle_vel_to_delta_result +
			   " does not equal " +
			  "[-1, 0]");

		let between_result = between(1, 2, 3);
		assert(between_result,
			   "between failed");
	})();

	game.maths = {
		zip: zip,
		multiply_vec: multiply_vec,
		add_vec: add_vec,
		eq_vec: eq_vec,
		rand: rand,
		randi: randi,
		between: between,
		angle_vel_to_delta: angle_vel_to_delta,
	};
})();
