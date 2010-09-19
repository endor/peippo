peippo.store = new Sammy.Store({name: 'peippo', type: 'local'});

peippo.app = $.sammy(function() {
  this.use('Template');
  
  this.helpers({
    store: peippo.store,
    clear_form: function() {
      (new peippo.Wine({})).characteristics.forEach(function(characteristic) {
        $('#' + characteristic).val('');
      });
    }
  });
  
  this.post('#/wines', function(context) {
    var wine = new peippo.Wine(this.params);

    var wines = this.store.get('wines');
    wines.push(wine);
    this.store.set('wines', wines);

    this.render('list_item.template', wine, function(template) {
      $('#' + wine.type).append(template);
    });
    
    this.clear_form();
  });
  
  this.del('#/wines/:id', function() {
    var wines = this.store.get('wines'),
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
  
  this.get('#/wines/:id/edit', function() {
    var wines = this.store.get('wines'),
      id = parseInt(this.params.id, 10);

    for(var index in wines) {
      if(wines[index].id === id) {
        var wine = wines[index];
        wine.characteristics.forEach(function(characteristic) {
          $('#' + characteristic).val(wine[characteristic]);
        });
        return;
      }
    }    
  });
  
  this.put('#/wines/:id', function(context) {
    var wines = this.store.get('wines'),
      id = parseInt(this.params.id, 10);

    for(var index in wines) {
      if(wines[index].id === id) {
        var wine = wines[index];
        wine.characteristics.forEach(function(characteristic) {
          wine[characteristic] = context.params[characteristic];
        });
        
        this.store.set('wines', wines);
        this.clear_form();
        
        return;
      }
    }
  });
  
  this.bind('init', function() {
    var wines = this.store.get('wines');
    if(wines === null) { wines = []; }
    this.store.set('wines', wines);
  });
});

$(function() {
  peippo.app.run();
  peippo.app.trigger('init');
});