var ranOtp = function() {
    var text = [];
    var possible = "1234567890";
    for (var i = 0; i < 6; i++)
        text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    return text.join("");
}
var ranEmail = function() {
    var text = [];
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 14; i++)
        text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    return text.join("");
}

module.exports = {
    "num": ranOtp,
    "str": ranEmail
}
