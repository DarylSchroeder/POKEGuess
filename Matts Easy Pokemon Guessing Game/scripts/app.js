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
                    var v = GAMECONTROLLER.GeneratePickList();
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
        GeneratePickList: function () {
            //alert("wtf");
            var curPokemon = this.currentPokemon.name;
            //console.log(JSON.stringify(this.currentPokemon));
            var falsePokemon1 = this.getRandomPokemonName();
            var falsePokemon2 = this.getRandomPokemonName();
            var unSorted = [];
            unSorted.push(curPokemon);
            unSorted.push(falsePokemon1);
            unSorted.push(falsePokemon2);

            console.log("three choices found: " + JSON.stringify(unSorted));

            GAMECONTROLLER.set("currentPokemonChoices", this.shuffle(unSorted));
        },
        CheckAnswer: function(e)
        {
            console.log(e);
            console.log(this.currentPokemon.name);
          	if (e.toLowerCase() == this.currentPokemon.name.toLowerCase())  
            { 
                console.log("they match.");
                return true;
            }

            console.log("they do not match.");
            return false;
        },
        currentPokemonChoices: [],
        shuffle: function (array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        },
        getRandomPokemon: function (callback) {
            var index = Math.floor((Math.random() * this.pokemonGen1Count) + 1);
            this.lookupPokemon(index, callback);
        },
        getRandomPokemonName: function () {
            var index = Math.floor((Math.random() * this.pokemonGen1Count) + 1);
            return this.pokemonGen1Name.split(",")[index];
        }
    });
    window.APP = kendo.observable({
        models: {
            home: {
                title: 'Home',
                StatusText: 'Welcome!',
                CurrentPokemonImage: "images/Main.jpg",
                CurrentPokemonAnswers: null,
                CurrentPokemonCorrectIndex: null,
                PokemonChoices: [],
                PokemonSelected: null,
                ResultStatusText: null,
                CorrectCount:0,
                IncorrectCount:0,
                TotalCount:0,
                GameStarted:false,
                onPokemonFound: function (e) {
                    if (e) {
						if (!this.GameStarted)
                        {
                        	window.APP.set("models.home.GameStarted", true);                            
						}
                        window.APP.set("models.home.CurrentPokemonImage", GAMECONTROLLER.currentPokemonImageURL);
                        window.APP.set("models.home.StatusText", "Who is this pokemon?");
                        window.APP.set("models.home.PokemonChoices", GAMECONTROLLER.currentPokemonChoices);
                        window.APP.set("models.home.PokemonSelected", GAMECONTROLLER.currentPokemonChoices[0]);
                        console.log("PokemonSelected set to ", GAMECONTROLLER.currentPokemonChoices[0]);
                        //alert(JSON.stringify(GAMECONTROLLER.currentPokemonChoices));
                    };
                },
                listener: function (e) {
                    //if game is ongoing, check if it's the correct answer.
                    if (GAMECONTROLLER.currentPokemon != null)
                    {	
                        
                        this.set("TotalCount", this.TotalCount+1);
                        this.set("CurrentPokemonImage", "images/loading.gif");
                        console.log("user selected: " + this.PokemonSelected);
                        var isCorrect = GAMECONTROLLER.CheckAnswer(this.PokemonSelected);
                        console.log("do they match?" + isCorrect);
                        if (isCorrect)
                        {
                        	this.set("CorrectCount", this.CorrectCount+1);
                            this.set("ResultStatusText", "Correct!");
                        }
                        else 
                        {
                        	this.set("IncorrectCount", this.IncorrectCount+1);
                            this.set("ResultStatusText", "Incorrect, " + GAMECONTROLLER.currentPokemon.name);
						}
					}
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