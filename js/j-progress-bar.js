(function() {
	var p = window.$jpb = function() {
		console.log('function entered');
	
	}
	p['test'] = function() {
		console.log('test run');
	}
})();
