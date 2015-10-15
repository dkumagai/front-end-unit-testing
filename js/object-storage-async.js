//Shims local storage to behave like Chrome.storage so code is portable
var ObjectStorageAsync = (function(){

	var isApp = !!chrome.runtime.id;
	var storage = isApp ? chrome.storage.local : window.localStorage;
	var events = {};

	function get(key){
		return new Promise(function(resolve, reject){
			if(isApp){
				storage.get(key, x => resolve(x[key]));
			}else{
				resolve(JSON.parse(storage.getItem(key)));
			}
		});
	}

	function getCollection(keys){
		return new Promise(function(resolve, reject){
			if(isApp){
				storage.get(keys, resolve);
			}else{
				var keyList = [].concat(keys);
				var values = {};
				for(var i = 0; i < keyList.length; i++){
					values[keyList[i]] = JSON.parse(storage.getItem(keyList[i]));
				}
				resolve(values);
			}
		});
	}

	function set(items){
		return new Promise(function(resolve, reject){
			if(isApp){
				storage.set(items, resolve);
			}else{
				for(var key in items){
					storage.setItem(key, JSON.stringify(items[key]));
				}
				resolve();
			}
		});
	}

	function clear(){
		return new Promise(function(resolve, reject){
			if(isApp){
				storage.clear(resolve);
			}else{
				resolve(storage.clear());
			}
		});
	}

	function remove(keys){
		return new Promise(function(resolve, reject){
			if(isApp){
				storage.remove(keys, resolve);
			}else{
				var keys = [].concat(keys);
				for(var i = 0; i < keys.length; i++){
					storage.removeItem(keys[i]);
				}
				resolve();
			}
		});
	}

	function exists(){
		return new Promise(function(resolve, reject){
			if(isApp){

			}else{
				resolve(storage.getItem(key) !== undefined && storage.getItem(key) !== null);
			}
		});
	}

	function listen(key, callback){
		if(!events[key]){
			events[key] = [callback];
		}else{
			events[key].push(callback);
		}
	}

	//todo update with specific handler target
	function unlisten(key){
		delete events[key];
	}

	if(isApp){
		chrome.storage.onChanged.addListener(function(changes, areaName){
			if(areaName !== "local"){
				return;
			}
			for(var key in changes){
				var callbacks = events[key];
				if(callbacks){
					for(var i = 0; i < callbacks.length; i++){
						callbacks[i](changes[key].newValues, changes[key].oldValue);
					}
				}
			}
		});
	}else{
		window.addEventListener('storage', function(e){
			if(e.storageArea !== localStorage){
				return;
			}
			var callbacks = events[e.key];
			if(callbacks){
				for(var i = 0; i < callbacks.length; i++){
					callbacks[i](JSON.parse(e.newValue), JSON.parse(e.oldValue), e.url);
				}
			}
		});
	}

	return {
		get : get,
		getCollection : getCollection,
		set : set,
		clear : clear,
		remove : remove,
		exists : exists,
		listen : listen,
		unlisten : unlisten
	};

})();
