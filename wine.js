peippo.Wine = function(params) {
  var wine = this;
  this.characteristics = ['name', 'place', 'year', 'rating', 'grapes', 'type'];
  this.characteristics.forEach(function(attr) {
    wine[attr] = params[attr] || '';
  });
  wine.id = new Date().getTime();
};
