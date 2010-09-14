var app = $.sammy(function() {
  this.store = new Sammy.Store({name: 'peippo', type: 'local'});
  
  this.post('#/wines', function() {
    var store = this.params.type === 'white' ? 'white_wines' : 'red_wines';
    app.store.set(store, [{name: this.params.name}]);
  });  
});

$(function() {
  app.run();
    
});