// MapMaker uses the $ for something.
$.noConflict();

var MapperTools = function() {
  this.body = jQuery('body');
  this.features = [];
};

MapperTools.prototype.registerFeature = function(id, enabledByDefault, callback) {
  var feature = {
    id: id,
    enabled: enabledByDefault,
    callback: callback
  };
  this.features.push(feature);
  
  // TODO(wli): Move this to after user options block.
  callback(feature);
};

MapperTools.prototype.initialize = function() {
  // Shrinks the whitespace when reviewing road attributes.
  this.registerFeature('shrink-road-attributes', true, this.cssFeature.bind(this));
  
  // Moves the message bar so it doesn't hide the Add/Edit/Browse buttons after each edit.
  this.registerFeature('move-message-bar', true, this.cssFeature.bind(this));
  
  // Updates URL for linking purposes
  this.registerFeature('replace-url', true, this.replaceUrl.bind(this));
};

// Initializes a css-only feature
MapperTools.prototype.cssFeature = function(feature) {
  this.body.addClass(feature['id']);
};

MapperTools.prototype.replaceUrl = function(feature) {
  // Debounce the update function by 250ms due to scroll wheel.
  var updateFn = _.debounce(function() {
    var url = jQuery('#link-to-page').attr('href');
	history.replaceState(null, null, url);
  }, 250);
  
  // http://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
  var wheelEvt = "onwheel" in document.createElement("div") ? "wheel" : //     Modern browsers support "wheel"
    document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
    "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
  
  // Use this in capture mode, since Google Maps eats the wheel event.
  document.addEventListener(wheelEvt, updateFn, true);
  
  // Capture all click events in capture mode too, just in case.
  document.addEventListener('click', updateFn, true);
};

var tools = new MapperTools();
tools.initialize();

// http://www.google.com/mapmaker?iwloc=0_0&fmi=0_0&gw=55&editids=KBkHiwFLdl6zjdHXQV&ll=37.43226,-122.177623&spn=0.000516,0.001291&t=h&z=20&lyrs=4&lyt=large_map_v3&htll=37.43229,-122.177545&hyaw=261.36159868732136