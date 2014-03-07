/* jshint -W054 */ 

// Template compiler for components supporting customisable templates
// taken from JavaScript Ninja Manual, p. 248, modified a bit.
// Use `<% ... %>` to execute blocks of JavaScript, `<%= ... %>` to write
// out the result of the embedded expression.
function tmpl(str, data) {
    var fn = str.indexOf('<%') < 0 ?

    // if there is no <% tags just return string
    function () { return str; } :

    // Generate a reusable function that will serve as a template generator.
    new Function("o",
        // Introduce the data as local variables using with(){}
        "var p=[];with(o){p.push('" +

            // Convert the template into pure JavaScript
            str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'") +

            "');}return p.join('');"
    );

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
}

forEach = function(obj, f, optObj) {
  for (var key in obj) {
    f.call(optObj, obj[key], key, obj);
  }
};
