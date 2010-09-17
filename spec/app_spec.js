describe("App", function() {
  describe("create a new wine", function() {
    // TODO: extend jasmine to allow beforeAll, afterAll
    
    beforeEach(function() {
      loadFixtures('spec/fixtures/test.html');
      peippo.store.name = 'peippo_test';
      peippo.store.clearAll();
      peippo.app.runRoute('post', '#/wines', {name: 'Beaufleur', type: 'white'});
    });

    it('should save the wine in the storage', function() {
      var wine = peippo.store.get('white_wines')[0];
      expect(wine.name).toEqual('Beaufleur');          
    });
    
    it('should not overwrite existing wines when saving the wine in the storage', function() {
      peippo.app.runRoute('post', '#/wines', {name: 'Löwengang', type: 'white'});      
      var wines = peippo.store.get('white_wines');
      expect(wines[0].name).toEqual('Beaufleur');
      expect(wines[1].name).toEqual('Löwengang');
    });
    
    it('should add a white wine to the white wines list', function() {
      waits(100);
      runs(function() {
        expect($('#white_wines')).toContain("h3:contains('Beaufleur')");  
      });
    });
    
    it('should add a red wine to the red wines list', function() {
      peippo.app.runRoute('post', '#/wines', {name: 'Minervois', type: 'red'});
      waits(100);
      runs(function() {
        expect($('#red_wines')).toContain("h3:contains('Minervois')");
      });
    });
    
    it('should allow for more details to be added', function() {
      peippo.app.runRoute('post', '#/wines', {
        name: 'Minervois',
        place: 'Chateau Du Donjon',
        type: 'red',
        year: 2007,
        rating: 91,
        grapes: 'Syrah, Grenache'
      });
      waits(100);
      runs(function() {
        expect($('#red_wines')).toContain("li:contains('Chateau Du Donjon')");
        expect($('#red_wines')).toContain("li:contains('2007')");
        expect($('#red_wines')).toContain("li:contains('91')");
        expect($('#red_wines')).toContain("li:contains('Syrah, Grenache')");
      });        
    });
  });
});