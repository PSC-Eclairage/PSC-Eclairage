var connect = false;

const id = "waitingtimepsc-wqonh";
const config = {
    id,
};
const app = new Realm.App(config);

function removeinfo()
{
    var erase = document.getElementById("info").remove();
}

function logOut()
{
    connect = false;
    const user = app.currentUser;
    user.logOut();
    document.location.href="/login.html";
}

function verifUser()
{
    if (app.currentUser != null)
    {
        connect = true;
    }
    else
    {
        document.location.href="/login.html";
    }
}

function loadHeaderFooter()
{
    var ajoutheader ='';
    ajoutheader += "<div id=\"header\" class=\"w3-card w3-padding-small\" style=\"color:rgb(255,255,255);background-color:rgb(145,170,11)\">";
    ajoutheader +=     "<h1 id=\"title\" class=\"w3-center\"><a href=\"index.html\"><img class=\"w3-center\" src=\"Plopsa_coo.png\" height=\"140px\"/></a></h1>";
    if(connect == true)
    {
        ajoutheader +=     "<div id=\"navigation\" class=\"w3-bar\">";
        ajoutheader +=         "<a href=\"index.html\" class=\"w3-bar-item w3-button w3-mobile w3-hover-white\">Temps d'attente</a>";
        ajoutheader +=         "<a href=\"config.html\" class=\"w3-bar-item w3-button w3-mobile w3-hover-white\">Configuration</a>";
        ajoutheader +=         "<a onclick=\"logOut()\" class=\"w3-bar-item w3-button w3-mobile w3-hover-white w3-right\">Déconnexion</a>";
        ajoutheader +=     "</div>";
    }
    ajoutheader += "</div>";

    var ajoutfooter='';
    ajoutfooter +=  "<div id=\"footer\" class=\"w3-padding-small w3-center\">";
    ajoutfooter +=      "<i><a class=\"w3-right w3-padding-small w3-margin-bottom\" href=\"https://www.linkedin.com/in/louis-marquet-72485a151\" style=\"text-decoration: none;\">Louis MARQUET 2021</a></i>";
    ajoutfooter +=  "</div>";

    document.body.insertAdjacentHTML('afterbegin',ajoutheader);
    document.body.insertAdjacentHTML('beforeend',ajoutfooter);
}

async function loginEmailPassword(email, password) {
    // Create an anonymous credential
    const credentials = Realm.Credentials.emailPassword(email, password);
    try {
      // Authenticate the user
      const user = await app.logIn(credentials);
      // `App.currentUser` updates to match the logged in user
      //assert(user.id === app.currentUser.id)
      return user
    } catch(err) {
      console.error("Failed to log in", err);
    }
}