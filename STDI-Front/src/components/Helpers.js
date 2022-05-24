const helpers = {
  //Convertir espacios en signos de plus
  convertStringWithPlus(value) {
    const newString = value.replace(" ", "+");
    return newString;
  },

  //Función para copiar la url
  copyToClipboard(username) {
    var value = "https://profile.stdicompany.com/" + username;
    navigator.clipboard.writeText(value);
  },

  //Función para copiar la url
  copyTextToClipboard(text) {
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(text);
  },
};

export default helpers;
