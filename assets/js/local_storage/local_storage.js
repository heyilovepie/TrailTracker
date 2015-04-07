/* ================================================================
                  storing data based on person
==================================================================*/
var dbName = 'ProfileData7';
var myData;
main.name = "default";
 
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
    var $name        = $('#name'),
        $add_name    = $('#add-name'),
        $list        = $('.list-of-trails'),
        $clear       = $('.clear-history'),
        $nameTitle   = $("#menu .profile #existing-name h1"),
        $startPage   = $("#start-page"),
        $showName    = $('#show-the-name'),
        $ok          = $('.ok'),
        $logout      = $(".logout"),
        $delete_route= $(".delete-route"),
        $done_route  = $(".done-route"),
        $trail_icon  = $(".trail-icon");

    function setStart(bool){
      if(bool == true){
        $nameTitle.addClass("hidden");
        $startPage.removeClass("hidden");
      }else{
        $nameTitle.text(main.name);
        $nameTitle.removeClass("hidden");
        $startPage.addClass("hidden");
      }
    }

    main.addMarker = function( trailData ){
      main.map.addMarker({
        lat: parseFloat( trailData.location.lat ),
        lng: parseFloat( trailData.location.lng ),
        title: trailData.name,
        click: function(e) {
        alert("You clicked on the " + trailData.name + " marker");
        }
      });
    };

    main.findUsingData = function( theTrail ) {
      // find the trail data from the trail to get coordinates etc. called from main.findUsingTrail() (init)
      if( main.data != undefined ){
        main.data.forEach(function( trailData ){
          if( theTrail.value.trail == trailData.id ){ 
            main.trailData = trailData;
            $trail_icon.attr("src", trailData.imgUrl); //makes the trail-icon be the trail you are on
            main.addMarker( trailData );
          }
        });
      }else{ console.log("you have no main.data"); }
    };

    main.findUsingTrail = function() {
      // find the trail that is being used on init
      conn
          .get({
            profileData:{description: sklad.DESC, index: 'timestamp_search'}
          }, function(err, data) {
            if (err) { return console.error(err); }
            data.profileData.forEach(function(theTrail){
              if( theTrail.value.done == false && theTrail.value.name == main.name ){ //if you have not finished the trail
                  main.trail = theTrail;
                  main.findUsingData( theTrail );
              }
            });
          });
    };


    function findName(conn) {
      /* called by local_storage.js on init to find the past names and what the previous name was */
      conn
          .get({
            nameData:{description: sklad.DESC, index: 'name_search'}
          }, function(err, data) {
            if (err) { return console.error(err); }
            var hasName = false;
            data.nameData.forEach(function(theName){
              if(theName.value.using){
                main.name = theName.value.name;
                hasName = true;
                main.findUsingTrail();
                return;
              }
            });

            if( hasName == false ){ //there were no names that are being used last.
              $showName.text("First time in TrailTracker? Please pick a Username");
            }else{ //there was a name that you are using.
              $showName.text("The last user was "+ main.name + ". Is that you?");
            }
          });
    }

    function notUsingNames(conn) {
      // stop all other names from being used at this time
      conn
          .get({
            nameData:{description: sklad.DESC, index: 'name_search'}
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
    };

    main.notUsingTrails = function() {
      // stop using all trails
      main.map.removeMarkers(); //remove all existing markers
      conn
          .get({
            profileData:{description: sklad.DESC, index: 'timestamp_search'}
          }, function(err, data) {
            if (err) { return console.error(err); }

            var hasName = false;
            data.profileData.forEach(function(theTrail){
              if( theTrail.value.name == main.name && theTrail.value.done == false ){
                theTrail.value.done = true;
                conn.upsert('profileData', theTrail.value, function(err){
                      if(err){ return console.error(); }
                      updateRows(conn);
                });
              }
            });
          });
    };

    main.deleteUsingTrails = function() {
      // delete the trail you are using
     main.map.removeMarkers(); //remove all existing markers
      conn
          .get({
            profileData:{description: sklad.DESC, index: 'timestamp_search'}
          }, function(err, data) {
            if (err) { return console.error(err); }

            data.profileData.forEach(function(theTrail){
              if( theTrail.value.done == false && theTrail.value.name == main.name ){ //if you have not finished the trail
                conn.delete('profileData', theTrail.value.timestamp, function(err){ //delete it
                      if(err){ return console.error(); }
                      updateRows(conn);
                });
              }
            });
          });
    };
 
    function updateRows(conn) {
      ///updates the list 
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
              if(data.value.name == main.name){ //if you have the right name
                var $li = $(document.createElement('li'));
                if(data.value.done){
                  main.trail = data;
                  $li.css({'text-decoration' : 'line-through'})
                }
                else{
                  $li.css({'text-decoration' : 'none'})
                }

                $li.text(data.value.trail);

                $li.click(function(){
                  if( data.value.done == false ){
                    data.value.done = true; //makes variable done the opposite.
                    //then change the value of done in the conn
                    conn.upsert('profileData', data.value, function(err){
                      if(err){ return console.error(); }
                      updateRows(conn); 
                    });
                  }
                });
                $list.append($li); //
              }
          });
        });
    }

    main.addTrail = function (trailData) {
      // this method is called from the trail controller when the check button is pressed
      var thisData = {
        profileData: [
          { 
            timestamp: Date.now(),
            trail: trailData.name,
            done:false,
            name: main.name
          }
        ]
      };

      main.trail = thisData.profileData;
      main.trailData = trailData;
      $trail_icon.attr("src", trailData.imgUrl); //makes the trail-icon be the trail you are on
      main.deleteUsingTrails(conn); //delete trails that are being used
      main.addMarker( trailData );
      conn.insert(thisData, function (err, insertedKeys) {
        if (err) { return console.error(err); }
        updateRows(conn);
      })
    };

    /* ======================================
      JQUERY CLICKS for only the start page
    ========================================= */

    $add_name.click(function(){
      if (!$name.val().trim() || $name.val().trim() == "default") { return; } //nothing there then do nothing

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
                    $showName.text("Welcome back " + main.name + "!");
                  });
          }else{ return console.error(err); } //if the error is not bc 2 same names then return
        }
        main.name = $name.val().trim();
        $showName.text("Hello " + main.name + ". Welcome to TrailTracker!");
        $name.val('');
        main.notUsingTrails();
        main.findUsingTrail();
        updateRows(conn);
      })
    }); //end of $add_name

    $clear.click(function(){
      conn.clear(['profileData', 'nameData'], function (err) {
            if (err) {
                throw new Error(err.message);
            }
      });
      $showName.text("Everything is gone!");
      main.name = "default";
      updateRows(conn);
    }); //end of clear

    $ok.click(function(){
      if(main.name != "default"){
        setStart(false);
        setTimeout(function(){
            $showName.text("You are " + main.name + "...right?");
        }, 150);
      }else{
        $showName.text("Please choose a Username!");
      }
    }); //end of $ok

    $logout.click(function(){
        $startPage.removeClass("hidden");
    }); //end of $logout

    //init
    findName(conn);
    updateRows(conn);
  });
});