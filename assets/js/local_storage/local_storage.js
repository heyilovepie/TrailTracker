/* ================================================================
                  storing data based on person
==================================================================*/
var dbName = 'ProfileData9';
main.me = {};
main.trail = {};
main.me.name = "default";
 
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
        $nameTitle.text(main.me.name);
        $nameTitle.removeClass("hidden");
        $startPage.addClass("hidden");
      }
    }

    main.trailPopup = function( theTrailData ){
      $trail_icon.attr("src", theTrailData.imgUrl); //makes the trail-icon be the trail you are on
      $trail_name.text( theTrailData.name );
      $trail_button.attr("href", "#/catalogue/" + theTrailData.id ); //makes the trail-icon be the trail you are on
    }

    main.addMarker = function( theTrailData ){
      main.trail.marker = {
        lat: parseFloat( theTrailData.location.lat ),
        lng: parseFloat( theTrailData.location.lng ),
        title: theTrailData.name,
        icon: "assets/imgs/marker.png",
        click: function(e) {
          $('.catch.trail').removeClass("hidden");
          $('#trail-page').removeClass("hidden");
        }
      };
      main.map.addMarker(main.trail.marker);
    };

    main.addMe = function( me ){
      main.me.marker = {
        lat: parseFloat( me.location.lat ),
        lng: parseFloat( me.location.lng ),
        title: me.name,
        icon: "assets/imgs/me.png",
        /*
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillOpacity: 0.5,
          fillColor: 'ff0000',
          strokeOpacity: 1.0,
          strokeColor: 'fff000',
          strokeWeight: 3.0,
          scale: 20 
        },
        */
        click: function(e) {
          $("#menu #menu-profile").trigger("show"); //show profile menu
        }
      };
      main.map.addMarker( main.me.marker );
    };

    main.findUsingTrail = function() {
      // find the trail that is being used on init
      conn
          .get({
            profileData:{description: sklad.DESC, index: 'timestamp_search'}
          }, function(err, data) {
            if (err) { return console.error(err); }
            data.profileData.forEach(function(theTrail){
              if( theTrail.value.done == false && theTrail.value.user == main.me.name ){ //if you have not finished the trail
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
                main.me.name = theName.value.name;
                hasName = true;
                main.findUsingTrail();
                return;
              }
            });

            if( hasName == false ){ //there were no names that are being used last.
              $showName.text("First time in TrailTracker? Please pick a Username");
            }else{ //there was a name that you are using.
              $showName.text("The last user was "+ main.me.name + ". Is that you?");
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
              if( theTrail.value.user == main.me.name && theTrail.value.done == false ){
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
              if( theTrail.value.done == false && theTrail.value.user == main.me.name ){ //if you have not finished the trail
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
              if(data.value.user == main.me.name){ //if you have the right name
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
            user        : main.me.name,
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
                    $showName.text("Welcome back " + main.me.name + "!");
                  });
          }else{ return console.error(err); } //if the error is not bc 2 same names then return
        }
        main.me.name = $name.val().trim();
        $showName.text("Hello " + main.me.name + ". Welcome to TrailTracker!");
        $name.val('');
        main.notUsingTrails();
        main.findUsingTrail();
        updateRows(conn);
        main.setCenterMap(); //sets the center of the map to your location
      })
    }); //end of $add_name

    $clear.click(function(){
      conn
        .get({
          profileData:{description: sklad.DESC, index: 'timestamp_search'}
        }, function(err, data) {
          if (err) { return console.error(err); }

          data.profileData.forEach(function(theTrail){ //for each trail
            if( theTrail.value.user == main.me.name ){ //if the trail is this user's
              conn.delete('profileData', theTrail.value.timestamp, function(err){ //delete it
                    if(err){ return console.error(); }
              });
            }
          });

          conn.delete('nameData', main.me.name, function(err){ //delete the name
            if(err){ return console.error(); }
            $showName.text("Everything from the user " + main.me.name + " is gone!");
            main.me.name = "default";
            updateRows(conn);
          });
        });
    }); //end of clear

    /*
    $clear.click(function(){
      conn.clear(['profileData', 'nameData'], function (err) {
            if (err) {
                throw new Error(err.message);
            }
      });
      $showName.text("Everything is gone!");
      main.me.name = "default";
      updateRows(conn);
    }); //end of clear
*/

    $ok.click(function(){
      if(main.me.name != "default"){
        setStart(false);
        setTimeout(function(){
            $showName.text("You are " + main.me.name + "...right?");
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
    console.log("data stuff");
    main.loopGetLocation = true;
    main.getLocationAndSetCenter();
    console.log("mapstuff");
  });
});

main.geoLocate = function( passedFunction ){
    GMaps.geolocate({
      success: function(position) {
        //set global variables
        main.me.location = {};
        main.me.location.lat =  position.coords.latitude;
        main.me.location.lng =  position.coords.longitude;
        //console.log( "This location is " + main.location.lat + " lat by " + main.location.lng + " lng." );
        passedFunction();
        console.log("set main.location");
      },
      error: function(error) {
        alert('Geolocation failed: '+error.message);
      },
      not_supported: function() {
        alert("Your browser does not support geolocation");
      },
      always: function() {
      }
    });
};

$(function(){
      main.setCenterMap = function(){
        /* set the center of the map to  be your location */
        main.map.setCenter(main.me.location.lat, main.me.location.lng);
        main.addMe( main.me );
    }

    function getLocation(){
        var x = function(){};
        main.geoLocate( x );
        if( main.loopGetLocation ){ //allows you to break the link
            setInterval( getLocation, 3000); //get location every 3 seconds
        }
    };

    main.getLocationAndSetCenter = function(){
        /* set the center the first time */
        main.geoLocate( main.setCenterMap );
        //setInterval( getLocation, 3000); //get location every 3 seconds
    };
})