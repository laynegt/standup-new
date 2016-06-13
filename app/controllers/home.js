import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    togglePresent(person) {
      person.toggleProperty('present');
    },

    pickWinner() {
      var people = this.get('model').filterBy('present');

      var length = people.get('length');

      // pick a random winner
      var randomIndex = Math.floor(Math.random() * length);
      this.set('randomWinner', people.objectAt(randomIndex));
    },

    addPerson() {
      var name = this.get('newName'), self = this;

      if (!name || !name.trim()){
        return;
      }

      name = name.trim();

      // check for dupes
      this.store.findAll('person').then(function(names) {
        if (names.findBy('name', name)) {
          alert('Cannot add duplicate name!');
        }
        else {
          // if not a dupe, add it
          var person = self.store.createRecord('person', {
            name: name,
            present: true // assume is present if you're entering them...
          });

          person.save().then(function () {
            self.set('newName', '');
          });
        }
      });
    },

    removePerson(person) {
      person.deleteRecord();
      person.save();
    }
  },

  notEnoughPeople: Ember.computed('model.@each.present', function() {
    return this.get('model').filterBy('present').length <= 1;
  })

});
