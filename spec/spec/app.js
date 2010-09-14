describe("App", function() {
  describe("create a new wine", function() {
    beforeEach(function() {
      app.runRoute('post', '#/wines', {name: 'Beaufleur', type: 'white'});      
    });

    it('should save the wine in the storage', function() {
      var wine = app.store.get('white_wines')[0];
      expect(wine.name).toEqual('Beaufleur');
    });
    
    it('should not overwrite existing wines when saving the wine in the storage', function() {
      
    });
    
    it('should add a white wine to the white wines list', function() {
      
    });
    
    it('should add a red wine to the red wines list', function() {
      
    });
  });
});