peippo.store = new Sammy.Store({name: 'peippo', type: 'local'});

peippo.app = $.sammy(function() {
  this.use('Template');
  
  this.helpers({
    store: peippo.store,
    clear_form: function() {
      (new peippo.Wine({})).characteristics.forEach(function(characteristic) {
        $('#' + characteristic).val('');
      });
    },
    update_form: function(options) {
      var form = $('form');
      form.attr({action: options.action, method: options.method});
      form.find('.submit').val(options.button);
    },
    storage: function(callback) {
      var wines = callback(this.store.get('wines'));
      this.store.set('wines', wines);
    }
  });
  
  this.post('#/wines', function(context) {
    var wine = new peippo.Wine(this.params);

    this.storage(function(wines) {
      wines.push(wine);
      return wines;
    });

    this.render('list_item.template', wine).appendTo('#' + wine.type);
    this.clear_form();
  });
  
  this.del('#/wines/:id', function() {
    var id = parseInt(this.params.id, 10);

    this.storage(function(wines) {
      for(var index in wines) {
        if(wines[index].id === id) {
          wines.splice(index, 1);
          $('#' + id).remove();
          return wines;
        }
      }        
    });
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
        $('#type_' + wine.type).attr('checked', 'checked');
        
        this.update_form({action: '#/wines/' + wine.id, method: 'PUT', button: 'Update Wine'});
        
        return;
      }
    }    
  });
  
  this.put('#/wines/:id', function(context) {
    var id = parseInt(this.params.id, 10);

    this.storage(function(wines) {
      for(var index in wines) {
        if(wines[index].id === id) {
          var wine = wines[index];

          wine.characteristics.forEach(function(characteristic) {
            wine[characteristic] = context.params[characteristic] || wine[characteristic];
          });

          return wines;
        }
      }      
    });
    
    this.update_form({action: '#/wines', method: 'POST', button: 'Add Wine'});
    this.clear_form();
    this.redirect('#/wines');
  });
  
  this.get('#/wines', function(context) {
    $('#red').html('');
    $('#white').html('');
    this.renderEach('list_item.template', this.store.get('wines'), function(wine, template) {
      $('#' + wine.type).append(template);
    });      
  });
  
  this.bind('init', function() {
    this.storage(function(wines) {
      return wines || [];
    });
  });
});

$(function() {
  peippo.app.run('#/wines');
  peippo.app.trigger('init');
});