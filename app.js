var peippo = {};

peippo.store = new Sammy.Store({name: 'peippo', type: 'local'});

peippo.Wine = function(params) {
  var wine = this;
  ['name', 'place', 'year', 'rating', 'grapes'].forEach(function(attr) {
    wine[attr] = params[attr] || '';
  })
};

peippo.app = $.sammy(function() {
  this.use('Template');
  
  this.helpers({
    store: peippo.store
  })
  
  this.before(function() {
    this.type = this.params.type === 'white' ? 'white_wines' : 'red_wines';
    delete this.params.type;
  });
  
  this.post('#/wines', function(context) {
    var wine = new peippo.Wine(this.params);

    var wines = this.store.get(this.type) || [];
    wines.push(wine);
    this.store.set(this.type, wines);

    this.render('list_item.template', wine, function(template) {
      $('#' + context.type).append(template);
    });
  });
});

$(function() {
  peippo.app.run();
});