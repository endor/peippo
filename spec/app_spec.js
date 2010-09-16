describe("App", function() {
  describe("create a new wine", function() {
    // TODO: extend jasmine to allow beforeAll, afterAll
    
    beforeEach(function() {
      loadFixtures('spec/fixtures/test.html');
      app.store.name = 'peippo_test';
      app.store.clearAll();
      app.runRoute('post', '#/wines', {name: 'Beaufleur', type: 'white'});
    });

    it('should save the wine in the storage', function() {
      var wine = app.store.get('white_wines')[0];
      expect(wine.name).toEqual('Beaufleur');          
    });
    
    it('should not overwrite existing wines when saving the wine in the storage', function() {
      app.runRoute('post', '#/wines', {name: 'Löwengang', type: 'white'});      
      var wines = app.store.get('white_wines');
      expect(wines[0].name).toEqual('Beaufleur');
      expect(wines[1].name).toEqual('Löwengang');
    });
    
    it('should add a white wine to the white wines list', function() {
      waits(100);
      runs(function() {
        expect($('#white_wines')).toContain("li:contains('Beaufleur')");  
      });
    });
    
    it('should add a red wine to the red wines list', function() {
      app.runRoute('post', '#/wines', {name: 'Chateau Du Donjon', type: 'red'});
      waits(100);
      runs(function() {
        expect($('#red_wines')).toContain("li:contains('Chateau Du Donjon')");  
      });      
    });
  });
});