var Data;

window.onload = function()
{
    verifUser();
    loadHeaderFooter();
    getData();
}

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
        var ajouthtml = "<div id=\"config\" class=\"w3-card w3-margin\">";

        ajouthtml += "<div class=\"w3-container w3-center\">";
        ajouthtml +=    "<h2>Configuration</h2>";
        ajouthtml += "</div>"

        ajouthtml += "<div class=\"w3-container w3-center\">";
        ajouthtml +=    "<table class=\"w3-table w3-bordered\">"
        ajouthtml +=        "<tr>";
        ajouthtml +=            "<th class=\"w3-center\"></th>";
        ajouthtml +=            "<th>Attraction</th>";
        ajouthtml +=            "<th class=\"w3-center\">Débit [pph]</th>";
        ajouthtml +=            "<th class=\"w3-center\">Correction [%]</th>";
        ajouthtml +=        "</tr>";

        var i=0;

        data.forEach(doc => {
            var keys = Object.keys(doc);
            var values = Object.values(doc);
            var nbkeys = Object.keys(doc).length;
            ajouthtml += "<tr id=\""+ doc.Name +"\">";
            ajouthtml +=    "<td class=\"w3-center\">";
            ajouthtml +=        "<div class=\"w3-dropdown-hover\">";
            ajouthtml +=            "<img id=\""+ i +"\" class=\"w3-button\" style=\"background-color:rgb(255,255,255)\" src=\"menu.png\" height=\"40px\" onmouseover=\"this.style.cursor=\'pointer\'\"/>";
            ajouthtml +=            "<div id=\""+ i +"_menu\" class=\"w3-dropdown-content w3-bar-block w3-border\">";
            ajouthtml +=                "<img  id=\""+ i +"\" src=\"save.png\" style=\"width:30%\" onclick=\"save(this.id)\" onmouseover=\"this.style.cursor=\'pointer\'\"/>";
            ajouthtml +=                "<img  id=\""+ i +"\" src=\"delete.png\" style=\"width:30%\" onclick=\"deleteAttraction(this.id)\" onmouseover=\"this.style.cursor=\'pointer\'\"/>";
            ajouthtml +=            "</div>";
            ajouthtml +=        "</div>";
            ajouthtml +=    "</td>";
            ajouthtml +=    "<td><input id=\""+ doc.Name+ "_1" +"\" class=\"w3-input w3-border-0 w3-left w3-hover-light-grey\" type=\"text\" value=\""+ doc.Name +"\"></td>";
            ajouthtml +=    "<td class=\"w3-center\"><input id=\""+ doc.Name+ "_2" +"\" class=\"w3-input w3-border-0 w3-center w3-hover-light-grey\" type=\"number\" min=\"1\"  value=\""+ doc.Flow +"\"></td>";
            ajouthtml +=    "<td class=\"w3-center\"><input id=\""+ doc.Name+ "_3" +"\" class=\"w3-input w3-border-0 w3-center w3-hover-light-grey\" type=\"number\" min=\"0\"  value=\""+ doc.Correction +"\"></td>";
            ajouthtml += "</tr>";
            i++;
        });
        ajouthtml += "</table>";
        ajouthtml += "</div>";
        ajouthtml += "<div class=\"w3-container w3-center\"><p></p><p class=\"w3-small w3-right\"><i> </i></p></div>";
        ajouthtml += "</div>";

        ajouthtml += "<div id=\"new\" class=\"w3-card w3-margin\">";
        ajouthtml += "<div class=\"w3-container w3-center\">";
        ajouthtml +=    "<h2>Nouvelle attraction</h2>";
        ajouthtml += "</div>";
        ajouthtml += "<div class=\"w3-container w3-center\">";
        ajouthtml +=    "<table class=\"w3-table\">";
        ajouthtml += "<tr id=\"new_Name\">";
        ajouthtml +=    "<td><input id=\"new_Name_1" +"\" class=\"w3-input w3-border-0 w3-left w3-hover-light-grey\" type=\"text\" placeholder=\"Attraction\"></td>";
        ajouthtml +=    "<td class=\"w3-center\"><input id=\"new_Name_2" +"\" class=\"w3-input w3-border-0 w3-center w3-hover-light-grey\" type=\"number\" placeholder=\"Débit [pph]\" min=\"0\"></td>";
        ajouthtml +=    "<td class=\"w3-center\"><input id=\"new_Name_3" +"\" class=\"w3-input w3-border-0 w3-center w3-hover-light-grey\" type=\"number\" placeholder=\"Correction [%]\" min=\"0\"></td>";
        ajouthtml +=    "<td class=\"w3-center\"><img src=\"add.png\" height=\"40px\" onclick=\"ajout()\" onmouseover=\"this.style.cursor=\'pointer\'\"/></td>";
        ajouthtml += "</tr>";
        ajouthtml += "</table>";
        ajouthtml += "</div>";
        ajouthtml += "</div>";
        

        if(document.getElementById("config"))
        {
            var configOld = document.getElementById("config").remove();
        }
        if(document.getElementById("new"))
        {
            var newOld = document.getElementById("new").remove();
        }
        data_html.insertAdjacentHTML("afterbegin",ajouthtml);
    }).catch(error =>{
        console.log(error);
        document.location.href="/login.html";
    })
}

async function save(clicked_i)
{
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const Attractions = mongodb.db("WaitingTime_PSC").collection("Attractions");

    var doc = Data[clicked_i];

    var data = new Object;
    var filter = new Object;
    filter._id = Data[clicked_i]._id;

    data.Name = document.getElementById(Data[clicked_i].Name+"_1").value;
    data.Flow = parseFloat(document.getElementById(Data[clicked_i].Name+"_2").value);
    data.Correction = parseFloat(document.getElementById(Data[clicked_i].Name+"_3").value);

    var configur = document.getElementById("config");
    var ajouthtml;

    if(data.Name === "" || data.Flow <= 0 || data.Correction < 0 || isNaN(data.Flow) || isNaN(data.Correction))
    {
        ajouthtml = "<div id=\"info\" class=\"w3-panel w3-red w3-margin w3-display-container\"><span onclick=\"removeinfo()\" class=\"w3-button w3-large w3-display-topright\">&times;</span><h3>Erreur </h3><p>Une des valeurs est incorrecte.</p></div>";
    }
    else
    {
        await Attractions.updateOne(filter,{$set:data}).then(result =>{
            ajouthtml = "<div id=\"info\" class=\"w3-panel w3-margin w3-display-container\" style=\"color:rgb(255,255,255);background-color:rgb(145,170,11)\"><span onclick=\"removeinfo()\" class=\"w3-button w3-large w3-display-topright\">&times;</span><h3>Réussi</h3><p>L'enregistremment des données a été exécuté.</p></div>";
        }).catch(err =>{
            ajouthtml = "<div id=\"info\" class=\"w3-panel w3-red w3-margin w3-display-container\"><span onclick=\"removeinfo()\" class=\"w3-button w3-large w3-display-topright\">&times;</span><h3>Erreur </h3><p>Mise à jour de la base de données impossible.</p></div>";
        })
    }
    
    if(document.getElementById("info"))
    {
        removeinfo();
    }
    configur.insertAdjacentHTML('afterend',ajouthtml);
    setTimeout(removeinfo,3000);
}

async function ajout()
{
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const Attractions = mongodb.db("WaitingTime_PSC").collection("Attractions");

    const data ={
        "Name": document.getElementById("new_Name_1").value,
        "Flow": parseFloat(document.getElementById("new_Name_2").value),
        "Correction": parseFloat(document.getElementById("new_Name_3").value)
    };

    var configur = document.getElementById("data");
    var ajouthtml;

    if(data.Name === "" || data.Flow <= 0 || data.Correction < 0 || isNaN(data.Flow) || isNaN(data.Correction))
    {
        ajouthtml = "<div id=\"info\" class=\"w3-panel w3-red w3-margin w3-display-container\"><span onclick=\"removeinfo()\" class=\"w3-button w3-large w3-display-topright\">&times;</span><h3>Erreur </h3><p>Une des valeurs est incorrecte.</p></div>";
    }
    else
    {
        await Attractions.insertOne(data).then(result =>{
            ajouthtml = "<div id=\"info\" class=\"w3-panel w3-margin w3-display-container\" style=\"color:rgb(255,255,255);background-color:rgb(145,170,11)\"><span onclick=\"removeinfo()\" class=\"w3-button w3-large w3-display-topright\">&times;</span><h3>Réussi</h3><p>L'enregistremment des données a été exécuté.</p></div>";
            getData();
        }).catch(err =>{
            ajouthtml = "<div id=\"info\" class=\"w3-panel w3-red w3-margin w3-display-container\"><span onclick=\"removeinfo()\" class=\"w3-button w3-large w3-display-topright\">&times;</span><h3>Erreur </h3><p>Mise à jour de la base de données impossible.</p></div>";
        })
    }
    
    if(document.getElementById("info"))
    {
        removeinfo();
    }
    configur.insertAdjacentHTML('beforeend',ajouthtml);
    setTimeout(removeinfo,3000);
}

async function deleteAttraction(clicked_i)
{
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const Attractions = mongodb.db("WaitingTime_PSC").collection("Attractions");

    var doc = Data[clicked_i];

    var filter = new Object;
    filter._id = Data[clicked_i]._id;
    if (confirm("Vous désirez vraiment supprimer "+ Data[clicked_i].Name +" ?")) {
        await Attractions.deleteOne(filter).then(result =>{
            getData();
        })
    }
}

function menu(clicked_i)
{
    var x = document.getElementById(clicked_i+"_menu");
  if (x.className.indexOf("w3-show") == -1) { 
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}