var Data;

window.onload = function()
{
    verifUser();
    loadHeaderFooter();
    getData();
}

setInterval(function update()
{
    getData();
}, 60000);

async function getData()
{
    if(connect == false) {
        return;
    }

    var data_html = document.getElementById("data");

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const Attractions = mongodb.db("WaitingTime_PSC").collection("Attractions");

    await Attractions.find({},{sort:{Name:1}}).then(data =>{
        Data = data;
        var ajouthtml = "<div id=\"waittime\" class=\"w3-card w3-margin\">";

        ajouthtml += "<div class=\"w3-container w3-center\">";
        ajouthtml +=    "<h2>Temps d'attente</h2>";
        ajouthtml += "</div>"

        ajouthtml += "<div class=\"w3-container w3-center\">";
        ajouthtml +=    "<table class=\"w3-table w3-bordered\">"
        ajouthtml +=        "<tr>";
        ajouthtml +=            "<th>Attraction</th>";
        ajouthtml +=            "<th class=\"w3-center\">Nombre de visiteurs</th>";
        ajouthtml +=            "<th class=\"w3-center\">Temps d'attente [min]</th>";
        if(screen.width >= 450)
        {
        ajouthtml +=            "<th class=\"w3-center\">Mise à jour</th>";
        }
        ajouthtml +=            "<th class=\"w3-center\"></th>";
        ajouthtml +=        "</tr>";

        var i=0;

        data.forEach(doc => {
            var keys = Object.keys(doc);
            var values = Object.values(doc);
            var nbkeys = Object.keys(doc).length;
            ajouthtml += "<tr id=\""+ doc.Name +"\">";
            ajouthtml +=    "<td>"+ doc.Name +"</td>"
            ajouthtml +=    "<td class=\"w3-center\">"+ doc.Visitors +"</td>"
            ajouthtml +=    "<td class=\"w3-center\">"+ doc.WaitingTime +"</td>"
            if(screen.width >= 450)
            {
            var d = new Date(doc.Date);
            ajouthtml +=    "<td class=\"w3-center\">"+ String(("0" + d.getUTCDate()).slice(-2)+"/"+("0" + (d.getUTCMonth() + 1)).slice(-2)+"/"+d.getUTCFullYear()+" "+("0" + d.getUTCHours()).slice(-2)+":"+("0" + d.getUTCMinutes()).slice(-2)) +"</td>"
            }
            if(doc.id_chart)
            {
            ajouthtml += "<td class=\"w3-center\"><img id=\""+ i +"\" src=\"zoom.png\" height=\"22px\" onclick=\"zoom(this.id)\" onmouseover=\"this.style.cursor=\'pointer\'\"/></td>";
            }
            else
            {
            ajouthtml += "<td class=\"w3-center\"></td>";
            }
            ajouthtml += "</tr>";
            i++;
        });
        ajouthtml += "</table>";
        ajouthtml += "</div>";
        ajouthtml += "<div class=\"w3-container w3-center\"><p></p><p class=\"w3-small w3-right\"><i> </i></p></div>";
        ajouthtml += "</div>";

        if(document.getElementById("waittime"))
        {
            var waittimeOld = document.getElementById("waittime").remove();
        }
        data_html.insertAdjacentHTML("afterbegin",ajouthtml);
    }).catch(error =>{
        console.log(error);
        document.location.href="/login.html";
    })
}

function zoom(i)
{
    var data_html = document.getElementById("data");

    var ajouthtml = "<div id=\"chart\" class=\"w3-card w3-margin\">";

        ajouthtml += "<div class=\"w3-container w3-center\">";
        ajouthtml += "<img src=\"close.png\" height=\"25px\" class=\"w3-right\" style=\"margin-top:20px;margin-bottom:20px;\" onclick=\"closezoom()\" onmouseover=\"this.style.cursor=\'pointer\'\"/>";
        ajouthtml +=    "<h2>"+ Data[i].Name +"</h2>";
        ajouthtml += "</div>"

        ajouthtml += "<div class=\"w3-container w3-center\">";
        ajouthtml += "<iframe style=\"background: #FFFFFF;border: none;\" width=100% height=\"480\" src=\"https://charts.mongodb.com/charts-waittimepsc-xlxim/embed/charts?id="+Data[i].id_chart+"&autoRefresh=60&theme=light\">";
        ajouthtml += "</iframe>";
        ajouthtml += "</div>";

        if(document.getElementById("chart"))
        {
            var chartOld = document.getElementById("chart").remove();
        }
        data_html.insertAdjacentHTML("beforeend",ajouthtml);
}

function closezoom()
{
    if(document.getElementById("chart"))
        {
            var chartOld2 = document.getElementById("chart").remove();
        }
}