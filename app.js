var peippo = {};

peippo.store = new Sammy.Store({name: 'peippo', type: 'local'});

peippo.Wine = function(params) {
  var wine = this;
  ['name', 'place', 'year', 'rating', 'grapes', 'type'].forEach(function(attr) {
    wine[attr] = params[attr] || '';
  });
  wine.id = new Date().getTime();
};

peippo.app = $.sammy(function() {
  this.use('Template');
  
  this.helpers({
    store: peippo.store
  })
  
  this.post('#/wines', function(context) {
    var wine = new peippo.Wine(this.params);

    var wines = this.store.get('wines') || [];
    wines.push(wine);
    this.store.set('wines', wines);

    this.render('list_item.template', wine, function(template) {
      $('#' + wine.type).append(template);
    });
  });
  
  this.del('#/wines/:id', function(context) {
    var wines = this.store.get('wines') || [],
      id = parseInt(this.params.id, 10);

    for(var index in wines) {
      if(wines[index].id === id) {
        wines.splice(index, 1);
        $('#' + id).remove();
        this.store.set('wines', wines);
        return;
      }
    }
  });
});

$(function() {
  peippo.app.run();
});