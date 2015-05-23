(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;
    window.GAMECONTROLLER = kendo.observable({
        pokeSearchURL: "http://pokeapi.co/api/v1/",
        pokemonGen1Count: 151,
        currentPokemon: null,
        currentPokemonSprite: null,
        currentPokemonImageURL: null,
        pokemonGen1Name: "Bulbasaur,Ivysaur,Venusaur,Charmander,Charmeleon,Charizard,Squirtle,Wartortle,Blastoise,Caterpie,Metapod,Butterfree,Weedle,Kakuna,Beedrill,Pidgey,Pidgeotto,Pidgeot,Rattata,Raticate,Spearow,Fearow,Ekans,Arbok,Pikachu,Raichu,Sandshrew,Sandslash,Nidoran♀,Nidorina,Nidoqueen,Nidoran♂,Nidorino,Nidoking,Clefairy,Clefable,Vulpix,Ninetales,Jigglypuff,Wigglytuff,Zubat,Golbat,Oddish,Gloom,Vileplume,Paras,Parasect,Venonat,Venomoth,Diglett,Dugtrio,Meowth,Persian,Psyduck,Golduck,Mankey,Primeape,Growlithe,Arcanine,Poliwag,Poliwhirl,Poliwrath,Abra,Kadabra,Alakazam,Machop,Machoke,Machamp,Bellsprout,Weepinbell,Victreebel,Tentacool,Tentacruel,Geodude,Graveler,Golem,Ponyta,Rapidash,Slowpoke,Slowbro,Magnemite,Magneton,Farfetch'd,Doduo,Dodrio,Seel,Dewgong,Grimer,Muk,Shellder,Cloyster,Gastly,Haunter,Gengar,Onix,Drowzee,Hypno,Krabby,Kingler,Voltorb,Electrode,Exeggcute,Exeggutor,Cubone,Marowak,Hitmonlee,Hitmonchan,Lickitung,Koffing,Weezing,Rhyhorn,Rhydon,Chansey,Tangela,Kangaskhan,Horsea,Seadra,Goldeen,Seaking,Staryu,Starmie,Mr.Mime,Scyther,Jynx,Electabuzz,Magmar,Pinsir,Tauros,Magikarp,Gyarados,Lapras,Ditto,Eevee,Vaporeon,Jolteon,Flareon,Porygon,Omanyte,Omastar,Kabuto,Kabutops,Aerodactyl,Snorlax,Articuno,Zapdos,Moltres,Dratini,Dragonair,Dragonite,Mewtwo,Mew",
        lookupPokemon: function (e, callback) {
            var request1 = new XMLHttpRequest(); //pokemon lookup...
            var xmlhttp2 = new XMLHttpRequest(); //image lookup...
            
            //handler for pokemon return
            request1.onreadystatechange = function () {
                if (request1.readyState == 4 && request1.status == 200) {
                    var myPokemon = JSON.parse(request1.responseText);
                    GAMECONTROLLER.set("currentPokemon", myPokemon);
                    xmlhttp2.open("GET", "http://pokeapi.co/" + myPokemon.sprites[0].resource_uri, true);
                    xmlhttp2.send();
                }
            }
            
            //handler for image return
            xmlhttp2.onreadystatechange = function () {
                if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {      
                    var myPokemonSprite = JSON.parse(xmlhttp2.responseText);              
                    //alert(JSON.stringify(myPokemonSprite));
                    GAMECONTROLLER.set("currentPokemonSprite", myPokemonSprite);
                    GAMECONTROLLER.set("currentPokemonImageURL", "http://pokeapi.co/" + myPokemonSprite.image)
                    callback(true);
                }
            }
            request1.open("GET", this.pokeSearchURL + "pokemon/" + e, true);
            request1.send();
        },
        getRandomPokemon: function (callback) {
            var index = Math.floor((Math.random() * this.pokemonGen1Count) + 1);
            this.lookupPokemon(index, callback);
        },
        getRandomPokemonName: function(){
            var index = Math.floor((Math.random() * this.pokemonGen1Count) + 1);
            return this.pokemonGen1Name.split(",")[index];
		}
    });
    window.APP = kendo.observable( {
        models: {
            home: {
                title: 'Home',
                StatusText: 'Welcome!',
                CurrentPokemonImage: "images/Main.jpg",
                CurrentPokemonAnswers: null,
                CurrentPokemonCorrectIndex: null,
                onPokemonFound: function (e) {
                    if (e)
					{
                        
                        window.APP.set("models.home.CurrentPokemonImage", GAMECONTROLLER.currentPokemonImageURL);
                        window.APP.set("models.home.StatusText", "Who is this pokemon?");
                        
                        //get 2 false answers.
                        var falseAnswers;
                        falseAnswers.push(GAMECONTROLLER.getRandomPokemonName())
                        falseAnswers.push(GAMECONTROLLER.getRandomPokemonName());
                        
                        //randomize the order:
                        var correctIndex = Math.floor((Math.random() * 3) + 1);
                        var tempOrder;
                        for (int i = 0; i ++ ; i < 3)
                        {
                            if (i == correctIndex){
                                tempOrder.push(GAMECONTROLLER.currentPokemon.name);
                            }
                            else 
						    {
                                tempOrder.push(falseAnswers.pop());
							}
						}
                        alert(JSON.Parse(tempOrder));
                        
					};
                },
                listener: function (e) {
                    GAMECONTROLLER.getRandomPokemon(this.onPokemonFound);
                }
            },
            settings: {
                title: 'Settings'
            },
            contacts: {
                title: 'Contacts',
                ds: new kendo.data.DataSource({
                    data: [{
                        id: 1,
                        name: 'Bob'
                    }, {
                        id: 2,
                        name: 'Mary'
                    }, {
                        id: 3,
                        name: 'John'
                    }]
                }),
                alert: function (e) {
                    alert(e.data.name);
                }
            }
        }
    });

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {

        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        navigator.splashscreen.hide();

        app = new kendo.mobile.Application(document.body, {

            // you can change the default transition (slide, zoom or fade)
            transition: 'slide',

            // comment out the following line to get a UI which matches the look
            // and feel of the operating system
            skin: 'flat',

            // the application needs to know which view to load first
            initial: 'views/home.html'
        });

    }, false);


}());