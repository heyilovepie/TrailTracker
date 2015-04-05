/* ================================================================
                  storing data based on person
==================================================================*/
var dbName = 'ProfileData7';
var myData;
var trail;
var name = "gillian";
 
 //open database
sklad.open(dbName, {
  version: 1,
  migration: {
    '1': function(database){
      var objStore = database.createObjectStore('profileData', {
        autoIncrement: true, 
        keyPath: 'timestamp'
      });
      objStore.createIndex('description_search', 'trail', {unique: false});
      objStore.createIndex('timestamp_search', 'timestamp', {unique: false});
      objStore.createIndex('the_name', 'name', {unique: false});
      objStore.createIndex('done', 'done', {unique: false});

      var nameStore = database.createObjectStore('nameData', {
        autoIncrement: true, 
        keyPath: 'name'
      });
      nameStore.createIndex('using', 'using', {unique: false});
      nameStore.createIndex('name_search', 'name', {unique: true});
    }
  }
}, function (err, conn) {
  if (err) { 
    throw err; 
  }
  $(function () {
    var $trail       = $('#trail'),
        $name        = $('#name'),
        $add         = $('#add'),
        $add_name    = $('#add-name'),
        $list        = $('#list'),
        $clear       = $('#clear');

    function findName(conn) {
      conn
          .get({
            nameData:{description: sklad.DESC, index: 'using'}
          }, function(err, data) {
            if (err) { return console.error(err); }

            var hasName = false;
            data.nameData.forEach(function(theName){
              if(theName.value.using){
                name = theName;
                hasName = true;

                return;
              }
            });

            if( hasName == false ){
              ////pop up screen
            }
          });
    }

    function notUsingNames(conn) {
      // stop all other names from being used at this time
      conn
          .get({
            nameData:{description: sklad.DESC, index: 'using'}
          }, function(err, data) {
            if (err) { return console.error(err); }

            var hasName = false;
            data.nameData.forEach(function(theName){
              theName.value.using = false;
              conn.upsert('nameData', theName.value, function(err){
                    if(err){ return console.error(); }
              });
            });
          });
    }

    $add_name.click(function(){
      if (!$name.val().trim()) { return; } //nothing there then do nothing

      var thisData = {
        nameData: [
          { 
            timestamp: Date.now(),
            name: $name.val().trim(),
            using: true
          }
        ]
      };

      notUsingNames(conn);
      conn.insert(thisData, function (err, insertedKeys) {
        if (err) { 
          if(err.message == "Key already exists in the object store."){ //already have this person :)
            conn.upsert('nameData', thisData.nameData, function(err){ //replace the data for the name 
                    if(err){ return console.error(); }
                  });
          }else{ return; } //if the error is not bc 2 same names then return
        }
        name = $name.val().trim();
        $name.val('');
        updateRows(conn);
      })
    });
 
    function updateRows(conn) {
      ///UPDATE DATA
      conn
        .get({
          profileData: {description: sklad.DESC, index: 'timestamp_search'} //gets only the components with the right name
        }, function (err, data) {
          if (err) { 
            return console.error(err); 
          }else{
            myData = data; // now contains profileData
        }

        ///UPDATE VISUALS
          $list.empty(); //make the list varaible have no variables because you will fill it
              
          myData.profileData.forEach(function(data){ //for each in to do list add text to the element
              if(data.value.name == name){ //if you have the right name
                var $li = $(document.createElement('li'));
                if(data.value.done){
                  $li.css({'text-decoration' : 'line-through'})
                }
                else{
                  $li.css({'text-decoration' : 'none'})
                }

                $li.text(data.value.trail + "  : " + data.value.name + " : " + data.value.timestamp);

                $li.click(function(){
                  data.value.done = !data.value.done; //makes variable done the opposite.
                  //then change the value of done in the conn
                  conn.upsert('profileData', data.value, function(err){
                    if(err){ return console.error(); }
                    updateRows(conn); 
                  });
                });
                $list.append($li); //
              }
          });
          /////////
        });
    }

    $clear.click(function(){
      conn.clear('profileData', function (err) {
            if (err) {
                throw new Error(err.message);
            }
      });
      updateRows(conn);
    });

    //clicking on a button
    $add.click(function () {
      if (!$trail.val().trim()) { return; } //nothing there then do nothing

      var thisData = {
        profileData: [
          { 
            timestamp: Date.now(),
            trail: $trail.val().trim(),
            done:false,
            name: name
          }
        ]
      };

      trail = thisData.profileData;

      conn.insert(thisData, function (err, insertedKeys) {
        if (err) { return console.error(err); }
        $trail.val('');
        updateRows(conn);
      })
    });

    //init
    findName(conn);
    updateRows(conn);
  });
});