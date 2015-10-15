module.exports = function(config){
	config.set({
		plugins : [
			"karma-mocha",
			"karma-chai",
			"karma-chrome-launcher"
		],
		frameworks: [
			"mocha",
			"chai"
		],
		files: [
			"./js/**/*.js",
			"./tests/**/*.js"
		],
		port: 9876,
		browsers: ["Chrome"],
		singleRun : true
	});
};
