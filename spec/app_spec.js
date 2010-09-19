describe('app', function() {
  beforeEach(function() {
    loadFixtures('spec/fixtures/test.html');
    peippo.store.name = 'peippo_test';
    peippo.store.clearAll();
  });
  
  describe('add a wine', function() {
    beforeEach(function() {
      peippo.app.trigger('init');
      peippo.app.runRoute('post', '#/wines', {name: 'Beaufleur', type: 'white'});
    });
    
    // TODO: extend jasmine to allow beforeAll, afterAll
    it('should save the wine in the storage', function() {
      var wine = peippo.store.get('wines')[0];
      expect(wine.name).toEqual('Beaufleur');          
      expect(wine.type).toEqual('white');          
    });
    
    it('should not overwrite existing wines when saving the wine in the storage', function() {
      peippo.app.runRoute('post', '#/wines', {name: 'Löwengang', type: 'white'});      
      var wines = peippo.store.get('wines');
      expect(wines[0].name).toEqual('Beaufleur');
      expect(wines[1].name).toEqual('Löwengang');
    });
    
    it('should add a white wine to the white wines list', function() {
      waits(100);
      runs(function() {
        expect($('#white')).toContain('h3:contains(\'Beaufleur\')');  
      });
    });
    
    it('should add a red wine to the red wines list', function() {
      peippo.app.runRoute('post', '#/wines', {name: 'Minervois', type: 'red'});
      waits(100);
      runs(function() {
        expect($('#red')).toContain('h3:contains(\'Minervois\')');
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
        expect($('#red')).toContain('li:contains(\'Chateau Du Donjon\')');
        expect($('#red')).toContain('li:contains(\'2007\')');
        expect($('#red')).toContain('li:contains(\'91\')');
        expect($('#red')).toContain('li:contains(\'Syrah, Grenache\')');
      });        
    });
  });
  
  describe('remove a wine', function() {
    beforeEach(function() {
      peippo.app.trigger('init');
      peippo.app.runRoute('post', '#/wines', {name: 'Beaufleur', type: 'white'});
    });
    
    it('should remove the wine from the storage', function() {
      var id = peippo.store.get('wines')[0].id;
      peippo.app.runRoute('delete', '#/wines/' + id);
      waits(100);
      runs(function() {
        expect(peippo.store.get('wines').length).toEqual(0);
      });
    });
    
    it('should remove the wine from the list', function() {
      var id = peippo.store.get('wines')[0].id;
      waits(100);
      runs(function() {
        peippo.app.runRoute('delete', '#/wines/' + id);
      });
      waits(100);
      runs(function() {
        expect($('#white')).toBeEmpty();
      });      
    });
  });
  
  describe('edit a wine', function() {
    beforeEach(function() {
      peippo.app.trigger('init');
      peippo.app.runRoute('post', '#/wines', {
        name: 'Minervois',
        place: 'Chateau Du Donjon',
        type: 'red',
        year: 2007,
        rating: 91,
        grapes: 'Syrah, Grenache'
      });      
    });
    
    it('should render the form with the data of the wine', function() {
      var id = peippo.store.get('wines')[0].id;
      waits(100);
      runs(function() {
        peippo.app.runRoute('get', '#/wines/' + id + '/edit');
      });
      waits(100);
      runs(function() {
        expect($('#name')).toHaveValue('Minervois');
        expect($('#place')).toHaveValue('Chateau Du Donjon');
        expect($('#year')).toHaveValue('2007');
        expect($('#rating')).toHaveValue('91');
        expect($('#grapes')).toHaveValue('Syrah, Grenache');
      });
    });
    
    it('should save the updated data', function() {
      var id = peippo.store.get('wines')[0].id;
      waits(100);
      runs(function() {
        peippo.app.runRoute('put', '#/wines/' + id, {name: 'Carignan'});
      });
      waits(100);
      runs(function() {
        var wines = peippo.store.get('wines');
        expect(wines[0].name).toEqual('Carignan');        
      });      
    });
  });
  
  describe('see list of wines', function() {
    it('should show a list of already added wines', function() {
      peippo.app.trigger('init');
      peippo.app.runRoute('post', '#/wines', { name: 'Minervois', type: 'red' });
      waits(100);
      peippo.app.runRoute('post', '#/wines', { name: 'Beaufleur', type: 'white' });
      waits(100);
      runs(function() {
        $('#red').html('');
        peippo.app.runRoute('get', '#/wines');
      });
      waits(100);
      runs(function() {
        expect($('#red')).toContain('li:contains(\'Minervois\')');
      });
    });
  });
  
  describe('initialize', function() {
    it('should initialize the store', function() {
      var wines = peippo.store.get('wines');
      expect(wines).toBeNull();
      peippo.app.trigger('init');
      var wines = peippo.store.get('wines');
      expect(wines.length).toEqual(0);
    });
  });
});