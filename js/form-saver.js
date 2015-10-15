var FormSaver = (function(){

	var defaults = {
		root : null //required
	};

	function create(options){
		var formSaver = {};
		formSaver.options = Object.assign({}, defaults, options);
		bind(formSaver);
		formSaver.init();
		return formSaver;
	}

	function bind(formSaver){
		formSaver.init = init.bind(formSaver);
		formSaver.cacheDom = cacheDom.bind(formSaver);
		formSaver.attachEvents = attachEvents.bind(formSaver);
		formSaver.inputChange = inputChange.bind(formSaver);
		formSaver.checkChange = checkChange.bind(formSaver);
		formSaver.setValues = setValues.bind(formSaver);
		formSaver.getKey = getKey.bind(formSaver);
		formSaver.destroy = destroy.bind(formSaver);
	}

	function cacheDom(){
		this.dom = {};
		this.dom.root = this.options.root;
		this.dom.textInputs = Array.prototype.slice.call(this.dom.root.querySelectorAll("input[type='text'], input[type='email'], input[type='password'], textarea"));
		this.dom.selects = Array.prototype.slice.call(this.dom.root.querySelectorAll("select"));
		this.dom.checks = Array.prototype.slice.call(this.dom.root.querySelectorAll("input[type='checkbox'], input[type='radio']"));
	}

	function attachEvents(){
		this.dom.textInputs.forEach(input => {
			input.addEventListener("input", this.inputChange);
			ObjectStorageAsync.listen(this.getKey(input), valueSetter(input));
		});
		this.dom.selects.forEach(select => {
			select.addEventListener("change", this.inputChange);
			ObjectStorageAsync.listen(this.getKey(select), valueSetter(select));
		});
		this.dom.checks.forEach(check => {
			check.addEventListener("change", this.checkChange);
			ObjectStorageAsync.listen(this.getKey(check), checkSetter(check));
		});
	}

	function inputChange(e){
		var element = e.target;
		ObjectStorageAsync.set({
			[this.getKey(element)] : element.value
		});
	}

	function checkChange(e){
		var element = e.target;
		ObjectStorageAsync.set({
			[this.getKey(element)] : element.checked
		});
	}

	function valueSetter(element){
		return value => {
			element.value = value;
		};
	}

	function checkSetter(element){
		return value => {
			element.checked = value;
		};
	}

	function getKey(element){
		return `${this.dom.root.name}:${element.name}`;
	}

	function setValues(){
		this.dom.textInputs.forEach(input => {
			ObjectStorageAsync.get(this.getKey(input)).then(valueSetter(input));
		});
		this.dom.selects.forEach(select => {
			ObjectStorageAsync.get(this.getKey(select)).then(valueSetter(select));
		});
		this.dom.checks.forEach(check => {
			ObjectStorageAsync.get(this.getKey(check)).then(checkSetter(check));
		});
	}

	function destroy(){
		this.dom.textInputs.forEach(input => {
			ObjectStorageAsync.unlisten(this.getKey(input));
		});
		this.dom.selects.forEach(select => {
			ObjectStorageAsync.unlisten(this.getKey(select));
		});
		this.dom.checks.forEach(check => {
			ObjectStorageAsync.unlisten(this.getKey(check));
		});
	}

	function init(){
		this.cacheDom();
		this.attachEvents();
		this.setValues();
	}

	return {
		create: create
	};

})();
