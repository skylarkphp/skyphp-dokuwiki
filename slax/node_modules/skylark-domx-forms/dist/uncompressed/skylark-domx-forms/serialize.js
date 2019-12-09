define([
  "skylark-langx/langx",
  "./forms"
],function(langx,forms){
    function serialize(formElm) {
        var result = []
        serializeArray(formElm).forEach(function(elm) {
            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
        })
        return result.join('&')
    }

    return forms.serialize = serialize;
});