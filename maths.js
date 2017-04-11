'use strict';

var game = game || {};

(() => {
	let type_match = (type, obj) => {
		if (type === "any") {
			return true;
		}

		if (obj === null) {
			return false;
		}

		if (obj === undefined) {
			return false;
		}

		if (type === "array" && Array.isArray(obj)) {
			return true;
		}
		
		if (type === typeof obj) {
			if (type === "number" && Number.isNaN(obj)) {
				return false;
			}
			
			return true;
		}

		return false;
	};
	
	let types = (types, callback) => (...args) => {
		for (let i = 0; i < args.length; i++) {
			let arg = args[i];
			let type = types[i];

			if (type == null) {
				throw new Error("Too many arguments");
			}
			
			if (!type_match(type, arg)) {
				throw new Error(
					"Arg no. " + i + ": " + arg + " is not of type " + type + ".\n\n"
						+ "Called " + callback + "\n\n"
						+ "With args " + args);
			}
		}

		return callback.apply(null, args);
	};
	
	let zip = types(
		["array", "array", "function"],
		(vec1, vec2, method) => vec1.map((val1, i) => method(val1, vec2[i])));
	
	//let zip = (vec1, vec2, method) => vec1.map((val1, i) => method(val1, vec2[i]));

	let multiply_vec = (vec1, vec2) => zip(vec1,
										   vec2,
										   (val1, val2) => val1 * val2);

	let add_vec = (vec1, vec2) =>
		zip(vec1,
			vec2,
			types(["number", "number"], (val1, val2) => val1 + val2));

	let eq_vec = (vec1, vec2) => zip(vec1, vec2, (val1, val2) => val1 === val2)
		.reduce((acc, val) => !acc ? acc : val,
				true);

	let approx_eq_vec = (vec1, vec2, variance) =>
		zip(vec1, vec2, (val1, val2) => between(val1 - variance, val2, val1 + variance))
			.reduce((acc, val) => !acc ? acc : val, true);

	let rand = types(["number", "number"],
					 (min, max) => (Math.random() * (max - min)) + min);
	let randi = (min, max) => Math.floor(Math.random() * (max - min)) + min;

	let move_pos = (pos, angle, vel) => {
		let delta = angle_vel_to_delta(angle, vel);

		return add_vec(delta, pos);
	};

	let angle_vel_to_delta = types(
		["number", "number"],
		(angle, vel) => {
			let change_x = Math.cos(angle) * vel;
			let change_y = Math.sin(angle) * vel;
			
			return [change_x, change_y];
		});

	let future_pos = (pos, angle, vel) => {
		let delta = angle_vel_to_delta(angle, vel);

		return add_vec(pos, delta);
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
		assert(type_match("number", 10), "type_match failed");
		assert(type_match("array", [1, 2, 3]), "type_match failed");
		assert(type_match("string", "hej"), "type_match failed");
		let aoeu;
		assert(!type_match("object", aoeu), "type_match failed");
		assert(!type_match("object", null), "type_match failed");
		
		assert(eq_vec([1 + 7, 9 - 2], [8, 7]), "eq_vec failed");

		let zip_result = zip([1, 2], [3, 4], (v1, v2) => v1 + v2);
		assert(eq_vec(zip_result, [4, 6]), "zip failed");

		let multiply_result = multiply_vec([2, 3], [4, 5]);
		assert(eq_vec(multiply_result, [8, 15]), "multiply failed");

		let add_result = add_vec([2, 3], [4, 5]);
		assert(eq_vec(add_result, [6, 8]), "add failed");

		let angle_vel_to_delta_result = angle_vel_to_delta(Math.PI, 2);
		assert(approx_eq_vec(angle_vel_to_delta_result, [-2, 0], 0.001),
			   "angle_vel_to_delta failed: " +
			   angle_vel_to_delta_result +
			   " does not equal " +
			   "[-2, 0]");

		let between_result = between(1, 2, 3);
		assert(between_result,
			   "between failed");

		let future = future_pos([0, 0], Math.PI, 1);
		let expected_result = [-1, 0];
		assert(approx_eq_vec(future, expected_result, 0.001), "future_pos failed: " + future + " not equal " + expected_result);
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
		future_pos: future_pos,
	};
})();
