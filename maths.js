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
	})();

	game.maths = {
		zip: zip,
		multiply_vec: multiply_vec,
		add_vec: add_vec,
		eq_vec: eq_vec,
	};
})();
