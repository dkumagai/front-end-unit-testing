var AppView = (function(){

	function create(){
		var appView = {};
		bind(appView);
		appView.init();
		return appView;
	}
	
	function bind(appView){
		appView.cacheDom = cacheDom.bind(appView);
		appView.attachEvents = attachEvents.bind(appView);
		appView.attachWidgets = attachWidgets.bind(appView);
		appView.init = init.bind(appView);
	}
	
	function cacheDom(){
		this.dom = {};
		this.dom.form = document.querySelector("form");
	}
	
	function attachEvents(){
	}
	
	function attachWidgets(){
		FormSaver.create({
			root : this.dom.form
		});
	}
	
	function init(){
		this.cacheDom();
		this.attachEvents();
		this.attachWidgets();
	}
	
	return {
		create : create
	};

})();