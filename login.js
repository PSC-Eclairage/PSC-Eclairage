window.onload = function()
{
  loadHeaderFooter();
}

function connexion()
{
  var username = $("#username").val();
  var password = $("#password").val();

  loginEmailPassword(username,password).then(user => {
    if(user != null)
    {
    document.location.href="/index.html";
    }
    else 
    {
      if(!document.getElementById("info"))
      {
      var bouton = document.getElementById("connexion");
      var ajouthtml = "<div id=\"info\" class=\"w3-panel w3-red w3-margin-top w3-display-container\"><span onclick=\"removeinfo()\" class=\"w3-button w3-large w3-display-topright\">&times;</span><h3>Erreur </h3><p>Le nom d'utilisateur ou le mot de passe est incorrecte.</p></div>"
      bouton.insertAdjacentHTML('afterend',ajouthtml);
      }
    }
  })
}