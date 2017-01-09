jQuery( document ).ready(function() {

    var current_id = undefined
    var from = 1;
    var to = 78;
    
    chrome.storage.sync.get(["katastr_id", "from", "to"], function(data) {
        current_id = data["katastr_id"]; 
        from = data["from"]
        to = data["to"]

        if (current_id > 0) {
            katastr()
        } 

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.method == "startKatastr") {
                sendResponse({status: "blah!!"});
                console.log(current_id); 
                katastr()
            }
        })

    });

var katastr = function () {    
        if (current_id === undefined) {
            current_id = from
        }


        var src = $("#ctl00_bodyPlaceHolder_captcha_radCaptcha_CaptchaImageUP").attr("src")

        if ($("#ctl00_bodyPlaceHolder_vyberObec_txtObec").val() !== undefined) {
            $("#ctl00_bodyPlaceHolder_vyberObec_txtObec").val("Brno")
            $("#ctl00_bodyPlaceHolder_vyberObec_btnObec").click()
        } else if ($("#ctl00_bodyPlaceHolder_txtBudova").val() !== undefined) {
            $("#ctl00_bodyPlaceHolder_listCastObce").val("411876")
            $("#ctl00_bodyPlaceHolder_txtBudova").val("1476")
            $("#ctl00_bodyPlaceHolder_txtJednotka").val(current_id)
            $("#ctl00_bodyPlaceHolder_btnVyhledat").click()
        } else if (src !== undefined) {
            alert("Fill in the CAPTCHA! Please...")
            $("#ctl00_bodyPlaceHolder_captcha_radCaptcha_CaptchaTextBox").focus()
        } else if($("table[summary='Atributy jednotky']").html() !== undefined) {
            var appt = {}

            appt.number = $("table[summary='Atributy jednotky'] tr:first td:first").next().text().split("/")[1]
            appt.size = $("table[summary='Atributy jednotky'] tr:last td:first").next().text().split("/")[0]/100

            var owner_list = $("table[summary='Vlastníci, jiní oprávnění'] tr")
            var last_owner = $("table[summary='Vlastníci, jiní oprávnění'] tr:last td:first").text()
            appt.owner = []
            $(owner_list).each(function() {
                if ($(this).find("th").text() !== "") { return }
                var content = $(this).text()
                appt.owner.push(getOwner(content))
            })
            
                    
            var key = "katastr_"+appt.number
            var save = {}
            save[key] = appt
            save["katastr_id"] = parseInt(current_id+1)

            chrome.storage.sync.set(save, function() {console.log(JSON.stringify(appt))})

            //alert(from+" "+to+" "+current_id)

            if (current_id < to) {
                //alert(JSON.stringify(appt))}
                window.location = "http://nahlizenidokn.cuzk.cz/VyberBudovu.aspx?typ=Jednotka"
            } else {
                chrome.storage.sync.set({"katastr_id": -1}, function() {console.log("Setting id to "+current_id)}) //FIXME
            }
            
        }
    }
});

var getOwner = function(text) {
    var owner_arr = text.split(",")
     
    owner = owner_arr[0].trim()
    owner_arr.shift()
    address = owner_arr.join(",").trim()

    return{"owner": owner, "address": address}

}


