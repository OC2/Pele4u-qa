<<<<<<< HEAD
angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];
=======
/**
 * Created by User on 27/01/2016.
 */
var app = angular.module('pele.services', []);

app.service('srvShareData', function($window) {
  var KEY = 'App.SelectedValue';


  var addData = function(newObj) {

    mydata = [];
    mydata.push(newObj);
    $window.sessionStorage.setItem(KEY, JSON.stringify(mydata));
  };

  var getData = function(){
    var mydata = $window.sessionStorage.getItem(KEY);
    if (mydata) {
      mydata = JSON.parse(mydata);
    }
    return mydata || [];
  };
>>>>>>> parent of dbb49c9... 111.12

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
