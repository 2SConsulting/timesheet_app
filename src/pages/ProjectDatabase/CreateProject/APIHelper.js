// APIHelper.js
var helpers = {
  fetchFood: function(category) { // country_list
    var url = 'https://hzgolsqc17.execute-api.eu-central-1.amazonaws.com/stages_get_' + category

    return fetch(url)
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      console.log(category, json)
      return json
    })
    .catch(function(error) {
      console.log('error', error)
    })
  }
}
