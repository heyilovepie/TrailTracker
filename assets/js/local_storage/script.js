/*
Data same on same device and server. Different on different computer.
*/

var dbName = 'ProfileData';
 
 //open database
sklad.open(dbName, {
  version: 2,
  migration: {
    '1': function (database) { //happens when there is nothing (when index page is run)
      var objStore = database.createObjectStore('todos', {autoIncrement: true});
      objStore.createIndex('description_search', 'description', {unique: true}); //this true will keep only one of each variable
    },
    '2': function(database){
      database.deleteObjectStore('todos');
      var objStore = database.createObjectStore('todos', {
        autoIncrement: true, 
        keyPath: 'timestamp'
      });
      objStore.createIndex('description_search', 'description', {unique: true});
      objStore.createIndex('done', 'done', {unique: true});
    }
  }
}, function (err, conn) {
  if (err) { 
    throw err; 
  }
  $(function () {
    var $description = $('#description');
    var $add         = $('#add');
    var $list        = $('#list')
 
    function updateRows(conn) {
      conn
        .get({
          todos: {description: sklad.DESC, index: 'description_search'}
        }, function (err, data) {
          if (err) { 
            return console.error(err); 
          }
          
          //do stuff here
          $list.empty(); //make the list varaible have no variables because you will fill it
          data.todos.forEach(function(todo){ //for each in to do list add text to the element
              var $li = $(document.createElement('li'));
              if(todo.value.done){
                $li.css({'text-decoration' : 'line-through'})
              }
              else{
                $li.css({'text-decoration' : 'none'})
              }
              $li.text(todo.value.description);

              $li.click(function(){
                todo.value.done = !todo.value.done; //makes variable done the opposite.
                //then change the value of done in the conn
                conn.upsert('todos', todo.value, function(err){
                  if(err){ return console.error(); }
                  updateRows(conn); 
                })
              });
              $list.append($li); //
          });
          /////////
        });
    }
 
    updateRows(conn);
 
  //clicking on a button
    $add.click(function () {
      if (!$description.val().trim()) {
        return;
      }
      conn.insert({
        todos: [
          { 
            timestamp: Date.now(),
            description: $description.val().trim(), 
            done:false 
          }
        ]
      }, function (err, insertedKeys) {
        if (err) { return console.error(err); }
        $description.val('');
        updateRows(conn);
      })
    });
  });
});