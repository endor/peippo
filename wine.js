peippo.Wine = function(params) {
  var wine = this;
  ['name', 'place', 'year', 'rating', 'grapes', 'type'].forEach(function(attr) {
    wine[attr] = params[attr] || '';
  });
  wine.id = new Date().getTime();
};
