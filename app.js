var app = $.sammy(function() {
  this.use('Template');
  
  this.store = new Sammy.Store({name: 'peippo', type: 'local'});
  
  this.before(function() {
    this.type = this.params.type === 'white' ? 'white_wines' : 'red_wines';
  });
  
  this.post('#/wines', function(context) {
    var wine = { name: this.params.name };
    
    var wines = app.store.get(this.type) || [];
    wines.push(wine);
    app.store.set(this.type, wines);

    this.render('list_item.template', wine, function(template) {
      $('#' + context.type).append(template);
    });
  });
});

$(function() {
  app.run();
});