describe("FromSaver", function(){
	var run = 0;

	beforeEach(function(){
		var fixture = `
			<form id="fixture" name="test">
				<input type="text" id="test-field" name="test-field" data-run="${run}" />
				<input type="checkbox" id="test-check" name="test-check" />
				<select id="test-select" name="test-select">
					<option value="">Pick a color</option>
					<option value="red">Red</option>
					<option value="blue">Blue</option>
				</select>
			</form>
		`;
		document.body.insertAdjacentHTML("afterbegin", fixture);
		localStorage.clear();
		run++;
	});

	afterEach(function(){
		document.body.removeChild(document.getElementById("fixture"))
	});

	it("creates object", function(){
		var formSaver = FormSaver.create({
			root : document.querySelector("#fixture")
		});
		assert.isNotNull(formSaver, "created object");
		formSaver.destroy();
	});

	it("saves input value to local storage", function(done){
		var formSaver = FormSaver.create({
			root : document.querySelector("#fixture")
		});
		var input = document.querySelector("#test-field");
		input.value = "Hello World";
		TestUtil.fireInputEvent(input, "input");
		ObjectStorageAsync.get("test:test-field").then(function(value){
			assert.equal(value, "Hello World", "Got saved value");
			formSaver.destroy();
			done();
		});
	});
	it("saves checkbox value to local storage", function(done){
		var formSaver = FormSaver.create({
			root : document.querySelector("#fixture")
		});
		var input = document.querySelector("#test-check");
		input.checked = true;
		TestUtil.fireInputEvent(input, "change");
		ObjectStorageAsync.get("test:test-check").then(function(value){
			assert.ok(value, "Got saved value");
			formSaver.destroy();
			done();
		});
	});

	it("saves select value to local storage", function(done){
		var formSaver = FormSaver.create({
			root : document.querySelector("#fixture")
		});
		var select = document.querySelector("#test-select");
		select.value = "blue";
		TestUtil.fireInputEvent(select, "change");
		ObjectStorageAsync.get("test:test-select").then(function(value){
			assert.equal(value, "blue", "Got saved value");
			formSaver.destroy();
			done();
		});
	});

	it("updates input value on localStorage update", function(){
		var formSaver = FormSaver.create({
			root : document.querySelector("#fixture")
		});
		var input = document.querySelector("#test-field");
		assert.equal(input.value, "", "initially no value");
		TestUtil.fireStorageEvent("test:test-field", "\"Testing123\"", "null");
		assert.equal(input.value, "Testing123", "got stored value");
		formSaver.destroy();
	});

	it("updates check value on localStorage update", function(){
		var formSaver = FormSaver.create({
			root : document.querySelector("#fixture")
		});
		var input = document.querySelector("#test-check");
		assert.equal(input.checked, false, "initially no value");
		TestUtil.fireStorageEvent("test:test-check", "true", "null");
		assert.ok(input.checked, "got stored value");
		formSaver.destroy();
	});

	it("updates select value on localStorage update", function(){
		var formSaver = FormSaver.create({
			root : document.querySelector("#fixture")
		});
		var select = document.querySelector("#test-select");
		assert.equal(select.value, "", "initially no value");
		TestUtil.fireStorageEvent("test:test-select", "\"blue\"", "null");
		assert.equal(select.value, "blue", "got stored value");
		formSaver.destroy();
	});

});
