var TestUtil = (function(){
  function fireInputEvent(element,event){
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
  }
  function fireStorageEvent(key, newValue, oldValue){
    var evt = new StorageEvent("storage");
    evt.initStorageEvent("storage", false, false, key, oldValue, newValue, "", localStorage);
    window.dispatchEvent(evt);
  }

  return {
    fireInputEvent : fireInputEvent,
    fireStorageEvent : fireStorageEvent
  };
})();
