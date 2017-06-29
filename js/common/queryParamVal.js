module.exports = function queryParamVal(key) {
  var uri = window.location.search;
  var re = new RegExp("" + key + "=([^&?]*)", "ig");
  return ((uri.match(re)) ? (uri.match(re)[0].substr(key.length + 1)) : null);
}