jQuery( document ).ready(function() {
    var current_id = undefined
    var from = undefined
    var to = undefined
    chrome.storage.sync.get(["katastr_id", "from", "to"], function(data) {current_id = data["katastr_id"]; from = data["from"]; to = data["to"]; console.log(current_id); katastr()})

    $("#startButton").click(function() {
        var from = parseInt($("#from").val())
        var to = parseInt($("#to").val())

        if (from.length == 0) { from = 1 }
        if (to.length == 0 ) { to = 78 }
        chrome.storage.sync.set({"from": from, "to": to, "katastr_id": from}, function(){
            console.log("Saving from and to")
            chrome.tabs.query({url: "http://nahlizenidokn.cuzk.cz/*"}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {method: "startKatastr"}, function(response) {
                    console.log(response);
                });
            })
        })


    });

    var katastr = function() {
        $("#current").val(current_id)
        $("#from").val(from)
        $("#to").val(to)

        chrome.storage.sync.get(null, function (data) {
            for (var i = from; i<=to; i++) {
                $("#data").append("<div><strong>"+data["katastr_"+i].number+"</strong> <em>"+data["katastr_"+i].owner[0].owner+"</em></div>")
            }
        });
    }
});
