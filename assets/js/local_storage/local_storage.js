/* ================================================================
                  storing data based on person
==================================================================*/
var dbName = 'ProfileData9';
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
      objStore.createIndex('description_search', 'name', {unique: false});
      objStore.createIndex('timestamp_search', 'timestamp', {unique: false});
      objStore.createIndex('user', 'user', {unique: false});
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
        $trail_icon  = $(".trail-icon"),
        $trail_name  = $(".name-of-trail"),
        $trail_button= $(".go-to-trail");

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

    main.trailPopup = function( theTrailData ){
      console.log("trailpopup");
      $trail_icon.attr("src", theTrailData.imgUrl); //makes the trail-icon be the trail you are on
      $trail_name.text( theTrailData.name );
      $trail_button.attr("href", "#/catalogue/" + theTrailData.id ); //makes the trail-icon be the trail you are on
    }

    main.addMarker = function( theTrailData ){
      main.map.addMarker({
        lat: parseFloat( theTrailData.location.lat ),
        lng: parseFloat( theTrailData.location.lng ),
        title: theTrailData.user,
        click: function(e) {
          $('.catch.trail').removeClass("hidden");
          $('#trail-page').removeClass("hidden");
        }
      });
    };

    main.findUsingTrail = function() {
      // find the trail that is being used on init
      conn
          .get({
            profileData:{description: sklad.DESC, index: 'timestamp_search'}
          }, function(err, data) {
            if (err) { return console.error(err); }
            data.profileData.forEach(function(theTrail){
              if( theTrail.value.done == false && theTrail.value.user == main.name ){ //if you have not finished the trail
                  main.trail = theTrail.value; //sets global to the trail data
                  main.trailPopup( main.trail ); //add visuals to popup
                  main.addMarker( main.trail ); //add a marker
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
              if( theTrail.value.user == main.name && theTrail.value.done == false ){
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
              if( theTrail.value.done == false && theTrail.value.user == main.name ){ //if you have not finished the trail
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
              if(data.value.user == main.name){ //if you have the right name
                var $li = $(document.createElement('li'));
                if(data.value.done){
                  main.trail = data.value;
                  $li.css({'text-decoration' : 'line-through'})
                }
                else{
                  $li.css({'text-decoration' : 'none'})
                }

                $li.text(data.value.name);

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
            //add all info from the json file
            name        : trailData.name,
            id          : trailData.id,
            imgUrl      : trailData.imgUrl,
            difficulty  : trailData.difficulty,
            description : trailData.description,
            km          : trailData.km,
            hours       : trailData.hours,
            location    : trailData.location,
            options     : trailData.options, 
            //add additional info
            user        : main.name,
            done        : false,
            timestamp   : Date.now()
          }
        ]
      };
      main.trail = thisData.profileData[0];
      main.trailPopup( main.trail ); //add visuals to popup
      main.deleteUsingTrails(conn); //delete trails that are being used
      main.addMarker( main.trail );
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
        main.setCenterMap(); //sets the center of the map to your location
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