var pjs = new PointJS('2D', 1280 *0.8, 720 *0.8, { // 16:9
	backgroundColor : '#1F2225',
	left: '0px',
	top: '0px',
	margin: 'auto',
	border: '4px solid #034510',
	display: 'block',
	position: 'relative'
});
// pjs.system.initFullPage(); // for Full Page mode
// pjs.system.initFullScreen(); // for Full Screen mode (only Desctop)

var log    = pjs.system.log,     // log = console.log;
    game   = pjs.game,           // Game Manager
    point  = pjs.vector.point,   // Constructor for Point
    camera = pjs.camera,         // Camera Manager
    brush  = pjs.brush,          // Brush, used for simple drawing
    OOP    = pjs.OOP,            // Object's manager
    math   = pjs.math,           // More Math-methods
    levels = pjs.levels,         // Levels manager
    system = pjs.system,
    tiles  = pjs.tiles,
    key    = pjs.keyControl.initKeyControl(),
    audio  = pjs.audio,
    camPos,
    health,
    diamonds,
    diamondsOK = 12,
    speed = 4,  
	isJump,
	currentLevel,
	isStair,
	isFirstTime = true,
	isImmortal,
	isFree,	
	bgFlag = false,
	statusOver,
	dY = 0,
	dX = 0,
	gravity = 0.4,	
	imageFood1 = tiles.newImage('img/cherry.ico'),
	imageFood2 = tiles.newImage('img/apple.ico'),
	imageDiamond = tiles.newImage('img/diamond.ico'),
	imageEnemy = tiles.newImage('img/enemy.png'),
	imageCoin = tiles.newImage('img/coin.png'),
	imageBomb = tiles.newImage('img/bomb4.png'),
    back_level_01_mp3 = audio.newAudio('wav/back_level_01.mp3', 0.15),
    back_level_02_mp3 = audio.newAudio('wav/breakout.mp3', 0.4),
    jump_wav = audio.newAudio('wav/jump9.ogg', 0.3),
    coin_wav = audio.newAudio('wav/coin.ogg', 0.3),
    food_wav = audio.newAudio('wav/pickup.ogg', 0.5),
    time_wav = audio.newAudio('wav/c4_beep.ogg', 1),
    pain_wav = audio.newAudio('wav/boing.ogg', 0.3),
    gong_wav = audio.newAudio('wav/gong.ogg', 0.4),
    drop_wav = audio.newAudio('wav/drop.ogg', 0.3),
    lose_wav = audio.newAudio('wav/loser.ogg', 0.4),
    pathExplSound = 'wav/expl.ogg',
	mainHero = {};
	mainHero.stand = game.newAnimationObject({
			x: 10,
			y: 422,
			w: 56,
			h: 57,
			animation: tiles.newImage('img/mainH.png').getAnimation(24,40,57,57,12)
	});
	mainHero.run = game.newAnimationObject({
		w: 57,
		h: 57,
		animation: tiles.newImage('img/mainH.png').getAnimation(16,148,64,54,12)
	});
	game.setFPS(60);
	system.initFPSCheck();
	system.setStyle({left: '0px', top: '0px', margin: 'auto', display: 'block', position: 'relative'});

//var mouse = pjs.mouseControl.initMouseControl();

var width  = game.getWH().w; // width of scene viewport
var height = game.getWH().h; // height of scene viewport

pjs.system.setTitle('Save Princess'); // Set Title for Tab or Window

game.newLoopFromConstructor('Start', function () {
	
	var gameName = game.newTextObject({
		positionC : point(game.getWH2().w, game.getWH2().h), // central position of text
		size : 58, // size text
		color : '#90FF20', // color text
		text : 'SAVE PRINCESS', // label
		alpha : 0, // alpha channel
		//font : 'Goudy Stout' // font family
		font: 'Bodoni MT Black'
	}),
		gamePres = game.newTextObject({
		positionC: point(game.getWH2().w, game.getWH2().h+150),
		size: 27,
		color: '#7788EE',
		text: 'PRESS "S" TO START THE GAME',
		alpha: 0,
		//font: 'Arial'
		//font: 'Bodoni MT Black'
		font: 'Goudy Stout'			
	}),
		logoImag = game.newImageObject({
			file: 'img/logoPr.png',
			scale: 1.2,
			alpha: 0.2
		}),
		flag = 0, delta = 250;

	this.update = function () {
		// Update function
		game.clear();		
		logoImag.draw();
		camPos = 0;
    	health = 100;
    	diamonds = 0;
    	speed = 4;  
		isJump = false;
		isFirstTime = true;
		isStair = false;
		isFree = false;
		mainHero.x = 10;
		mainHero.y = 422;
		mainHero.right = true;
		
		if(flag == 0) {		
		gameName.setPosition(point(game.getWH2().w-delta, game.getWH2().h)),
		delta += 1.83;
		gameName.size += 0.4;
		gameName.draw(); // drawing text
		gameName.transparent(0.012); // change alpha [0..>..1]
		if(gameName.getAlpha() == 1) flag = 1;
		} else {
			if(key.isPress("S")) {
				currentLevel = 'GameLevel_01';
				game.startLoop(currentLevel);
			}
			if(flag == 1){
				gameName.draw();
				gamePres.draw();
				gamePres.transparent(0.02);
				if(gamePres.getAlpha() >= 1) flag = 2;
			} 	else if(flag == 2){
				gameName.draw();
				gamePres.draw();
				gamePres.transparent(-0.02);
				if(gamePres.getAlpha() <= 0.4) flag = 1;
			} 
		}
	};

});
game.newLoopFromConstructor('GameLevel_01', function () {
	var textColor = '#FFEA71',
		bgImag = game.newImageObject({
			file: 'img/bg1.png',
			//scale: 1.2,
			w: 1980,
			h: 700,
			alpha: 0.5
		}),
		stopLight = game.newAnimationObject({
			x: 1888,
			y: 378,
			w: 24, h: 105,
			animation: tiles.newImage('img/tr3.png').getAnimation(0,0,24,105,1)
		}),
		gameName = game.newTextObject({
			position : point(0, 0), // central position of text
			size : 20, // size text
			color : textColor, // color text
			text : 'SAVE PRINCESS.   STAGE 1.   KILL ALL BOSS\' FRIENDS.  COLLECT DIAMONDS', // label
			alpha : 0.9, // alpha channel
			//font : 'Goudy Stout' // font family
			font: 'Bodoni MT Black'
		}),
		heroHealthText = game.newTextObject({
			position: point(0, 20),
			size: 20,
			color: textColor,
			alpha: 0.9,
			font: 'Bodoni MT Black'
		}),
		diamondsText = game.newTextObject({
			position: point(0, 40),
			size: 20,
			color: textColor,
			alpha: 0.9,
			font: 'Bodoni MT Black'
		}),
		map = {
			width: 16,
			height: 16,
			image_gr: tiles.newImage('img/map.png'),
			level_map: [
			'',
			'',
			'',
			'',
			'                                                                                          CL M D',
			'                                                                     cl m d                                   cl m d',
			'',
			'',
			' CL M D',
			'',
			'                                                              CAE E E E E E E E E E E E E E E E E E E BD           CL M D',
			'       cl m d                        3',
			'                                                               G N N N N N N N N N N N N N N N N N N H',
			'                     cae e e e e e e eb            ae e e e bd',
			'             CAE BD                   xx         xx',
			'                      g n n n n n n nh  xx     xx  if f f f k                                               CAE E E E E E',
			'              IF K                        xxxxx',
			'                                                   if f f f k                                                G N N N N N ',
			'              G H',
			'                                              CAE E E E E E E BD',
			'      CL M D                                                               CL M D',
			'                                               G N N N N N N H',
			'                                         CL M D',
			'                                                                                        cl m d',
			'',
			'                                  cl m d                                        CL M D',
			'                                                                                                cae e e e e bd',
			'                           cl m d',
			'                                                                                                 in n n n n k',
			'',
			'E E E E E E E E E E E E E D        CE E E E E E E E E E E E E E E E E E E E E E E D          CE E E E E E E E E E E E E E',
			'',
			'F F F F F F F F F F F F F 0 1 1 0 1 F F F F F F F F F F F F F F F F F F F F F F F 1 0 1 1 0 1 F F F F F F F F F F F F F F',
			'',
			'F F F F F F F F F F F F F           F F F F F F F F F F F F F F F F F F F F F F F             F F F F F F F F F F F F F F'
			]
		},	
		objs = [],
		objsNature = [],
		objsDiamonds = [],
		objsFood = [],
		objsStair = [],
		objsMashrooms = [],
		objsSurf = [],
		objsEnemies = [],
		objsCoins = [],
		objsBomb = [],	
		diamondsMap = [[45, 96],[125, 288],[540, 176],[576, 368],[920, 272],[1238, 288],[1270, 128],[1682, 384],[1792, 48],[1872, 128]],
		foodMap = [[236, 190],[900, 176],[1230, 446],[1580, 128],[1134,46],[1840, 206]],
		stairMap = [[32*24, 32*13],[32*24, 32*11],[32*24, 32*9.5],[32*56, 32*13],[32*56, 32*11],[32*56, 32*9],[32*56, 32*7.5]],
		mashroomsMap = [[440,176],[920,448],[1476,32]],
		enemiesMap = [[120,119,44,10],[390,151,150,100],[668,296,38,20],[650,423,550,50],[1040,103,560,40],[1180,103,350,100],[1550,423,300,200],[1745,183,68,30]];		

		while(objs.length) objs.pop();
		while(objsSurf.length) objsSurf.pop();
		while(objsStair.length) objsStair.pop();
		while(objsNature.length) objsNature.pop();
		objsNature.push(game.newAnimationObject({
					x: 140,
					y: 416,
					w: 64,
					h: 64,
					animation: map.image_gr.getAnimation(736, 480, 64, 64, 1) // tree
			}));
		objsNature.push(game.newAnimationObject({
					x: 840,
					y: 240,
					w: 64,
					h: 64,
					animation: map.image_gr.getAnimation(736, 480, 64, 64, 1) // tree
			}));
		objsNature.push(game.newAnimationObject({
					x: 1240,
					y: 96,
					w: 64,
					h: 64,
					animation: map.image_gr.getAnimation(736, 480, 64, 64, 1) // tree
			}));
		objsNature.push(game.newAnimationObject({
					x: 1140,
					y: 416,
					w: 64,
					h: 64,
					animation: map.image_gr.getAnimation(736, 480, 64, 64, 1) // tree
			}));
	
	OOP.forArr(stairMap, function(pos) {
		objsStair.push(game.newAnimationObject({
			x: pos[0],
			y: pos[1],
			w: 32,
			h: 64,
			animation: map.image_gr.getAnimation(672+64, 384, 32, 64, 1)
		}));
	});
	OOP.forArr(map.level_map, function(str, y) {
		OOP.forArr(str, function(elem, x) {
			if(elem == '0') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*4,
					animation: map.image_gr.getAnimation(672, 384, 32, 64, 1) // water with bubbles
				}));
			}
			else if(elem == '1') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*4,
					animation: map.image_gr.getAnimation(672+32, 384, 32, 64, 1) // water
				}));
			}
			else if(elem == '3') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*16,
					h: map.height*6,
					animation: map.image_gr.getAnimation(672, 288, 256, 96, 1) // long stair
				}));
			}
			else if(elem == 'A') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(672+32, 64, 16, 32, 1) // out ground left light
				}));
			}
			else if(elem == 'B') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(672+48, 64, 16, 32, 1) // out ground rigth light
				}));
			}
			else if(elem == 'C') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*1,
					animation: map.image_gr.getAnimation(672+16, 32, 16, 16, 1) // piece of ground left
				}));
			}
			else if(elem == 'D') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*1,
					animation: map.image_gr.getAnimation(896, 32, 16, 16, 1) // piece of ground right
				}));
			}
			else if(elem == 'E') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(768, 32, 32, 32, 1) // piece of ground top light
				}));
			}
			else if(elem == 'F') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(768, 64, 32, 32, 1) // piece of ground inside light
				}));
			}
			else if(elem == 'G') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(736, 96, 32, 32, 1) // corner ground left light
				}));
			}
			else if(elem == 'H') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(832, 96, 32, 32, 1) // corner ground left right
				}));
			}
			else if(elem == 'I') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704, 96, 16, 32, 1) // ground left light
				}));
			}
			else if(elem == 'K') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704+16, 96, 16, 32, 1) // ground right light
				}));
			}
			else if(elem == 'L') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704, 32, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'M') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(864, 32, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'a') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(672+32, 64+128, 16, 32, 1) // out ground left light
				}));
			}
			else if(elem == 'b') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(672+48, 64+128, 16, 32, 1) // out ground rigth light
				}));
			}
			else if(elem == 'c') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*1,
					animation: map.image_gr.getAnimation(672+16, 32+128, 16, 16, 1) // piece of ground left
				}));
			}
			else if(elem == 'd') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*1,
					animation: map.image_gr.getAnimation(896, 32+128, 16, 16, 1) // piece of ground right
				}));
			}
			else if(elem == 'e') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(768, 32+128, 32, 32, 1) // piece of ground top light
				}));
			}
			else if(elem == 'f') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(768, 64+128, 32, 32, 1) // piece of ground inside light
				}));
			}
			else if(elem == 'g') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(736, 96+128, 32, 32, 1) // corner ground left light
				}));
			}
			else if(elem == 'h') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(832, 96+128, 32, 32, 1) // corner ground left right
				}));
			}
			else if(elem == 'i') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704, 96+128, 16, 32, 1) // ground left light
				}));
			}
			else if(elem == 'k') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704+16, 96+128, 16, 32, 1) // ground right light
				}));
			}
			else if(elem == 'l') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704, 32+128, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'm') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(864, 32+128, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'N') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(784, 128, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'n') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(784, 256, 32, 32, 1) // ground left corner light
				}));
			}
		});
	});	// DRAW NATURE MAP
	OOP.forArr(map.level_map, function(str, y) {
		OOP.forArr(str, function(elem, x) {
		if(elem == 'E' || elem == 'e' || elem == 'M' || elem == 'm' || elem == 'L' || elem == 'l' || elem == 'x') {
				objsSurf.push(game.newRectObject({
					x: x * map.width,
					y: y * map.height,
					w: 32,
					h: 5,
					fillColor: "#4F0060"
				}));
			}
		})
	}); // DRAW SURFACE MAP

	this.update = function () {
		if(isFirstTime) {
			objsMashrooms = [];
			objsDiamonds = [];
			objsFood = [];
			objsEnemies = [];
			objsBomb = [];
			objsCoins = [];
			camPos = 0;
    		health = 100;
    		diamonds = 0;
    		statusOver = 0;
			isJump = false;
			isStair = false;
			isFree = false;
			bgFlag = false;
			isImmortal = 0;
			mainHero.x = 10;
			mainHero.y = 422;
			mainHero.right = true;
			mainHero.stand.x = mainHero.run.x = mainHero.x;
			// DRAW MASHROOMS, FOOD, ENEMIES AND DIAMONDS 
			OOP.forArr(mashroomsMap, function(pos) {
				objsMashrooms.push(game.newAnimationObject({
					x: pos[0],
					y: pos[1],
					w: 32,
					h: 32,
					animation: map.image_gr.getAnimation(736, 544, 32, 32, 1) // mashroom
				}));
			});
			OOP.forArr(foodMap, function(pos, indx) {
				if(indx%2) {
					objsFood.push(game.newAnimationObject({
					x: pos[0],
					y: pos[1],
					w: 32,
					h: 32,
					animation: imageFood1.getAnimation(0, 0, 32, 32, 1)
					}));
				}
				else {
					objsFood.push(game.newAnimationObject({
						x: pos[0],
						y: pos[1],
						w: 32,
						h: 32,
						animation: imageFood2.getAnimation(0, 0, 32, 32, 1)
					}));
				}
			});	
			OOP.forArr(enemiesMap, function(pos, indx){
				objsEnemies.push(game.newAnimationObject({
					x: pos[0]+pos[3],
					y: pos[1],
					w: 38,
					h: 60,
					animation: imageEnemy.getAnimation(21,184,38,68,12)
				}));
				objsEnemies[indx].right = true;
				objsEnemies[indx].dX = 1;
				objsEnemies[indx].initialX = pos[0];
				objsEnemies[indx].maxMove = pos[2];
			});
			OOP.forArr(diamondsMap, function(pos) {
				objsDiamonds.push(game.newAnimationObject({
					x: pos[0],
					y: pos[1],
					w: 32,
					h: 32,
					animation: imageDiamond.getAnimation(0, 0, 32, 32, 1)
				}));
			});
			isFirstTime = false;
		}
		game.clear();
		bgImag.draw();
		OOP.drawArr(objs);
		stopLight.draw();
			
		if(objsEnemies.length) {
			pjs.brush.drawCircle({x: stopLight.x+6, y: stopLight.y+37, radius: 5.5, fillColor: "#404040"});
			if(diamonds<diamondsOK) {
				pjs.brush.drawCircle({x: stopLight.x+6, y: stopLight.y+21.5, radius: 5.5, fillColor: "#404040"});
			}
		} else {
			pjs.brush.drawCircle({x: stopLight.x+6.2, y: stopLight.y+21.5, radius: 5.5, fillColor: "#404040"});
			pjs.brush.drawCircle({x: stopLight.x+6.2, y: stopLight.y+6.5, radius: 5.5, fillColor: "#404040"});
		} // DRAW TRAFFIC-LIGHT

		// DRAW TEXTURES
		//for(let i=0;i<objsSurf.length;i++) objsSurf[i].draw(); // it's possible not to draw
		for(let i=0;i<objsNature.length;i++) objsNature[i].draw();
		for(let i=0;i<objsDiamonds.length;i++) objsDiamonds[i].draw();
		for(let i=0;i<objsFood.length;i++) objsFood[i].draw();
		for(let i=0;i<objsStair.length;i++) objsStair[i].draw();
		for(let i=0;i<objsMashrooms.length;i++) objsMashrooms[i].draw();
		for(let i=0;i<objsCoins.length;i++) objsCoins[i].draw();
		for(let i=0;i<objsBomb.length;i++) {
			if(objsBomb[i].visible) {
				//objsBomb[i].drawStaticBox();
				if(objsBomb[i].timer){
					objsBomb[i].drawFrames(0,1);
					objsBomb[i].timer -= 1;
					objsBomb[i].y -= objsBomb[i].dY;
					objsBomb[i].dY -= objsBomb[i].gravity;
					if(objsBomb[i].moveX) if(objsBomb[i].right) {
						objsBomb[i].x += 6;
					} else {
						objsBomb[i].x -= 6;
					}
					if(!objsBomb[i].moveX) if(!time_wav.playing){
						time_wav.stop();
						time_wav.play();
					}
				}
				else {
					objsBomb[i].drawFrames(2,7);
					time_wav.stop();
					objsBomb[i].sound.play();
					if(objsBomb[i].effect) {
						objsBomb[i].effect -= 1;
					} else objsBomb[i].visible = false;
				}
			}
		} // DRAW BOMBS ACCORDING THE TIME
		for(let i=0;i<objsEnemies.length;i++) {
			//objsEnemies[i].drawStaticBox();
			if(objsEnemies[i].visible)if(objsEnemies[i].right) {
				objsEnemies[i].drawFrames(0,5);
				objsEnemies[i].x += objsEnemies[i].dX;
				if((objsEnemies[i].x - objsEnemies[i].initialX)>objsEnemies[i].maxMove) objsEnemies[i].right = false;
			} 
			else {
				objsEnemies[i].drawFrames(6,11);	
				objsEnemies[i].x -= objsEnemies[i].dX;
				if(objsEnemies[i].x == objsEnemies[i].initialX) objsEnemies[i].right = true;
			}
		} // DRAW ENEMIES ACCORDING TO THEIR DIRECTION
		// END DRAW TEXTURES

		if(mainHero.y>500) statusOver = 2;
		if(mainHero.y>450) drop_wav.play();
		
		//if(health == 0) game.startLoop('Game_over');	
		isStair = false;
		for(let i=0;i<objsStair.length;i++) {
			if(mainHero.stand.isIntersect(objsStair[i])) if(mainHero.x<objsStair[i].x+12 && mainHero.x+24>objsStair[i].x) {
				isStair = true;
				isJump = false;
			}
		}		
		if(!isStair){
			mainHero.y = mainHero.y + speed;			
			isFree = true;
			mainHero.stand.y = mainHero.run.y = mainHero.y;		
			for(let i=0;i<objsSurf.length;i++){
				if(mainHero.stand.isIntersect(objsSurf[i])) {
					if((mainHero.y+mainHero.stand.h)<(objsSurf[i].y+22)){
						mainHero.y = objsSurf[i].y-mainHero.stand.h;						
						mainHero.stand.y = mainHero.run.y = mainHero.y;
						isFree = false;
						if(dY<0) isJump = false;
					}
				}
			}
		}		
		if(key.isDown("UP") || key.isDown("SPACE") || key.isDown("W")) {
			if(isStair) {				
				mainHero.y -= speed*0.5;
				mainHero.stand.y = mainHero.run.y = mainHero.y;				
			} else if(isJump === false && isFree === false) {
					dY = speed*3;
					mainHero.stand.x = mainHero.run.x = mainHero.x;
					isJump = true;
					jump_wav.stop();
					jump_wav.play();
			}			
		}		
		if(isJump) {
			mainHero.y = mainHero.y - dY;
			dY -= gravity;
			if(dY<-4) dY = -4;
			mainHero.stand.y = mainHero.run.y = mainHero.y;
			isStair = false;
		}
		if(key.isPress("CTRL")) {
			objsBomb.push(game.newAnimationObject({
				x: mainHero.x,
				y: mainHero.y-22,
				w: 76, h: 76,
				animation: imageBomb.getAnimation(52,20,72,72,8)
			}));
			if(mainHero.right) {
				objsBomb[objsBomb.length-1].right = true;
				objsBomb[objsBomb.length-1].x += 4;
			}
			else {
				objsBomb[objsBomb.length-1].right = false;
				objsBomb[objsBomb.length-1].x -= 30;	
			}			
			objsBomb[objsBomb.length-1].timer = 66;
			objsBomb[objsBomb.length-1].dY = 2.5;
			objsBomb[objsBomb.length-1].gravity = 0.08;
			objsBomb[objsBomb.length-1].moveX = true;
			objsBomb[objsBomb.length-1].effect = 66;
			objsBomb[objsBomb.length-1].sound = audio.newAudio(pathExplSound, 0.7);
		} // THROW GRENADE
		if(key.isPress("X")) if(!(isJump) && !(isFree) ) {
			objsBomb.push(game.newAnimationObject({
				x: mainHero.x,
				y: mainHero.y+14,
				w: 76, h: 76,
				animation: imageBomb.getAnimation(52,20,72,72,8)
			}));
			if(mainHero.right) {
				objsBomb[objsBomb.length-1].right = true;
				objsBomb[objsBomb.length-1].x += 4;
			} else {
				objsBomb[objsBomb.length-1].right = false;
				objsBomb[objsBomb.length-1].x -= 30;	
			}
			objsBomb[objsBomb.length-1].timer = 198;
			objsBomb[objsBomb.length-1].dY = 0;
			objsBomb[objsBomb.length-1].gravity = 0.00;
			objsBomb[objsBomb.length-1].moveX = false;
			objsBomb[objsBomb.length-1].effect = 66;
			objsBomb[objsBomb.length-1].sound = audio.newAudio(pathExplSound, 0.8);
		} // PLANT THE BOMB
		if(key.isDown("RIGHT") || key.isDown("D")) {
			mainHero.right = true;
			if(mainHero.x < 1877) mainHero.x += speed;
			mainHero.stand.x = mainHero.run.x = mainHero.x;
			mainHero.stand.y = mainHero.run.y = mainHero.y;
			mainHero.run.drawFrames(0, 5);
		}
		else if(key.isDown("LEFT") || key.isDown("A")) {
			mainHero.right = false;
			if(mainHero.x>0)mainHero.x -= speed;
			mainHero.stand.x = mainHero.run.x = mainHero.x;
			mainHero.stand.y = mainHero.run.y = mainHero.y;
			mainHero.run.drawFrames(6, 11);
		}
		else if(key.isDown("DOWN") || key.isDown("S")) {
			if(isStair) if(mainHero.y<423)mainHero.y+=2;
			mainHero.stand.y = mainHero.run.y = mainHero.y;
			if(mainHero.right) {
				mainHero.stand.drawFrames(3,5);
			}
			else {
				mainHero.stand.drawFrames(8,10);	
			}
		}
		else {
			if(mainHero.right) {
				mainHero.stand.drawFrames(3,5);
			}
			else {
				mainHero.stand.drawFrames(8,10);	
			}
		}
		
		// IS INTERSECT
		for(let i=0;i<objsCoins.length;i++) if(objsCoins[i].visible) {
			if(mainHero.stand.isIntersect(objsCoins[i])) {
				objsCoins[i].visible = false;
				health += 5;
				if(health>100) health = 100;
				diamonds += 1;
				coin_wav.stop();
				coin_wav.play();
			}
		}
		for(let i=0; i<objsFood.length;i++) if(objsFood[i].visible) {
			if(mainHero.stand.isIntersect(objsFood[i])) {
				objsFood[i].visible = false;
				food_wav.stop();
				food_wav.play();
				health += 20;
				if(health>100) health = 100;
			}
		}
		for(let i=0;i<objsDiamonds.length;i++) if(objsDiamonds[i].visible) {
			if(mainHero.stand.isIntersect(objsDiamonds[i])) {
				objsDiamonds[i].visible = false;
				diamonds += 1;
				coin_wav.stop();
				coin_wav.play();
			}
		}
		for(let i=0;i<objsMashrooms.length;i++) if(objsMashrooms[i].visible) {
			if(mainHero.run.isIntersect(objsMashrooms[i])) {
				objsMashrooms[i].visible = false;
				health -= 30;
				pain_wav.stop();
				pain_wav.play();
				if(health<=0) {
					health = 0;
					statusOver = 1;
				}
			}
		}
		for(let i=0;i<objsEnemies.length;i++) if(objsEnemies[i].visible) {
			if(mainHero.stand.isIntersect(objsEnemies[i])) {
				if(dY<0 && !(isStair) && (mainHero.y<(objsEnemies[i].y-32)) && (mainHero.x<(objsEnemies[i].x+6)) && ((mainHero.x+46) > objsEnemies[i].x)) {
					objsEnemies[i].visible = false;
					objsCoins.push(game.newAnimationObject({
						x: objsEnemies[i].x + 4,
						y: objsEnemies[i].y + 25,
						w: 32, h: 32,
						animation: imageCoin.getAnimation(16, 24, 68, 64, 6)
					}));
					dY = speed*3;
					mainHero.stand.x = mainHero.run.x = mainHero.x;
					isJump = true;
					jump_wav.stop();
					jump_wav.play();
				}
				else {
					if(!isImmortal) {
						health -= 30;
						if(health<=0) {
							health=0;
							statusOver = 3;
						}
						pain_wav.stop();
						pain_wav.play();
						isImmortal = 50;
					}
				}
			}
		}
		for(let i=0;i<objsBomb.length;i++) {
			if(objsBomb[i].visible) {
				if(objsBomb[i].timer == 0 && objsBomb[i].effect > 56) {
					for(let j=0;j<objsEnemies.length;j++) {
						if(objsBomb[i].isIntersect(objsEnemies[j])) {
							objsEnemies[j].visible = false;
							objsCoins.push(game.newAnimationObject({
								x: objsEnemies[j].x + 4,
								y: objsEnemies[j].y + 25,
								w: 32, h: 32,
								animation: imageCoin.getAnimation(16, 24, 68, 64, 6)
							}));
						}
					}
					if(mainHero.stand.isIntersect(objsBomb[i])) {
						health -= 2;
						if(health<0) {
							statusOver = 4;
							health = 0;
						}
					}
				}
			}
		}
		// END OF INTERSECT
		
		if(isImmortal>0) isImmortal -= 1;
		if(objsBomb.length>0) if(objsBomb[objsBomb.length-1].visible === false) objsBomb.pop();
		if(objsEnemies.length>0) {
			if(objsEnemies[objsEnemies.length-1].visible === false) objsEnemies.pop();
		}
		else {
			if(mainHero.stand.isIntersect(stopLight)) if(mainHero.x>stopLight.x-20) {
				statusOver = 9;
			}
		}
		if(key.isPress("P")) game.startLoop('Pause');		
		if(statusOver == 4) game.startLoop('Game_over');	// EXPLODED ON A BOMB		
		if(statusOver == 3) game.startLoop('Game_over');	// ENEMY KILL
		if(statusOver == 2) game.startLoop('Game_over');	// DRAWNED
		if(statusOver == 1) game.startLoop('Game_over');	// POISONOUS MASHROOM			
		if(statusOver == 9) {
			isFirstTime = true;				
			camPos = 0;
			isJump = false;
			isStair = false;
			isFree = false;
			isImmortal = 0;
			mainHero.x = 10;
			mainHero.y = 422;
			mainHero.right = true;
			mainHero.stand.x = mainHero.run.x = mainHero.x;
			currentLevel = 'GameLevel_02';
			game.startLoop(currentLevel);
		}													// LEVEL 2	
	
		if(mainHero.x>width*0.5 && mainHero.x<(width*0.5+910)) camPos = mainHero.x-width*0.5;
		camera.moveTime({x:camPos, y:0}, 0);
		if(key.isDown("K")) if(camPos>0) camPos -= 8;
		if(key.isDown("L")) if(camPos<900) camPos += 8;
		heroHealthText.text = 'HEALTH: ' + health + ' @ ' + system.getFPS() + ' fps ';
				
		diamondsText.text = 'DIAMONDS: ' + diamonds + '/'+ diamondsOK;
		diamondsText.x = heroHealthText.x = gameName.x = camPos;
		gameName.draw();
		heroHealthText.draw();
		diamondsText.draw();		
		//mainHero.stand.drawStaticBox();
		//for(let i=0;i<objsFood.length;i++) objsFood[i].drawStaticBox(); 
		//for(let i=0;i<objsDiamonds.length;i++) objsDiamonds[i].drawStaticBox(); 
				
	}
});

game.newLoopFromConstructor('GameLevel_02', function() {
	var textColor = '#1AFB72',
		bgImag = game.newImageObject({
			file: 'img/bg2.png',
			//scale: 1.2,
			w: 1720,
			h:680,
			alpha: 0.5
		}),
		gameName = game.newTextObject({
			position : point(0, 0), // central position of text
			size : 20, // size text
			color : textColor, // color text
			text : 'SAVE PRINCESS.   STAGE 2.   KILL THE BOSS.  RING THE GONG TO START.', // label
			alpha : 0.8, // alpha channel
			//font : 'Goudy Stout' // font family
			font: 'Bodoni MT Black'
		}),
		heroHealthText = game.newTextObject({
			position: point(0, 20),
			size: 20,
			color: textColor,
			alpha: 0.8,
			font: 'Bodoni MT Black'
		}),
		bossHealthText = game.newTextObject({
			position: point(0, 60),
			size: 20,
			color: '#FFEF00',
			alpha: 0.8,
			font: 'Bodoni MT Black'
		}),
		bombsText = game.newTextObject({
			position: point(0, 80),
			size: 20,
			color: '#FFEF00',
			alpha: 0.8,
			font: 'Bodoni MT Black'
		}),
		diamondsText = game.newTextObject({
			position: point(0, 40),
			size: 20,
			color: textColor,
			alpha: 0.8,
			font: 'Bodoni MT Black'
		}),
		map = {
			width: 16,
			height: 16,
			image_gr: tiles.newImage('img/map.png'),
			image_build: tiles.newImage('img/house.png'),
			image_gong: tiles.newImage('img/gong.png'),
			level_map: [
			'',
			'',
			'',
			'',
			'                                                                                           cl m d',
			' CL M D',
			'                                         CL M D',
			'',
			'',
			'                                                CL M D',
			'       cl m d                                            CAE E E E E E E E E E E E E E E BD',
			'',
			'                     3                                    G N N N N N N N N N N N N N N H',
			'',
			'               CAE E EB            ae e e e e e e e e e e e e e eb',
			'  cl m d             xx            xx',
			'                IF F FKxx        xxif f f f f f f f f f f f f f fk                           cl m d',
			'                         xxxxxxxx',
			'                G N NH             g n n n n n n n n n n n n n nh',
			'                                                                                      CL M D',
			'      CL M D ',
			'',
			'                                                                               cl m d',
			'',
			'',
			'   CL M D',
			'                                                              CAE E E E E BD',
			'',
			'                                                               IN N N N N K',
			'',
			'E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E',
			'',
			'F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F',
			'',
			'F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F F'
			]
		},	
		mainBoss = {
			x: 0,
			y: 0,
			right: false,			
			state: 'stand'
		},
		princess = {
			x: 1490,
			y: 404,
			dX: 2,
		},
		objs = [],
		objsNature = [],
		objsDiamonds = [],
		objsFood = [],
		objsStair = [],
		objsMashrooms = [],
		objsSurf = [],
		objsEnemies = [],
		objsCoins = [],
		objsBomb = [],
		isFinalFight = false,
		isGongPass = false,
		bossHealth = 100,
		bombsLeft = 30,	
		foodMap = [[45,45],[140,128],[48,204],[800,110],[688, 62],[1030,382],[980,190],[1490,30],[1380,126],[1406,270]],
		stairMap = [[32*22, 32*13],[32*22,32*11],[32*22,32*9],[32*22,32*7]],
		mashroomsMap = [[1050,130],[815, 194]],
		enemiesMap = [[420,423,454,110],[260,167,59,30],[566,167,180,50],[970,103,200,110],[1220,423,280,20]];		
		
		mainBoss.fight = game.newAnimationObject({
			w: 104,
			h: 120,
			animation: tiles.newImage('img/boss.png').getAnimation(39,174,104,120,8)
		});
		mainBoss.stand = game.newAnimationObject({
			w: 77,
			h: 120,
			animation: tiles.newImage('img/boss.png').getAnimation(728,616,77,120,2)
		});
		mainBoss.go = game.newAnimationObject({
			w: 100,
			h: 120,
			animation: tiles.newImage('img/boss.png').getAnimation(56,320,100,120,12)
		});
		mainBoss.died = game.newAnimationObject({
			w: 130,
			h: 120,
			animation: tiles.newImage('img/boss.png').getAnimation(446,32,130,120,6)
		});
		mainBoss.go.dX = 1;
		mainBoss.fight.dX = 2;
		mainBoss.died.dX = 2;
		mainBoss.died.timer = 0;
		mainBoss.go.x = mainBoss.stand.x = mainBoss.died.x = mainBoss.x = 1550;
		mainBoss.go.y = mainBoss.stand.y = mainBoss.died.y = mainBoss.y = 364;
		
		princess.happy = game.newAnimationObject({
			w: 46,
			h: 76,
			animation: tiles.newImage('img/pr.png').getAnimation(0,0,48,80,3)
		});
		princess.worry = game.newAnimationObject({
			w: 46,
			h: 76,
			animation: tiles.newImage('img/pr.png').getAnimation(0,182,52,80,3)
		});

		princess.happy.x = princess.worry.x = princess.x;
		princess.happy.y = princess.worry.y = princess.y;

		camPos = 0;
    	isJump = false;
		isStair = false;
		isFree = false;
		isImmortal = 0;
		mainHero.x = 10;
		mainHero.y = 422;
		mainHero.right = true;
		mainHero.stand.x = mainHero.run.x = mainHero.x;
		
		objsNature.push(game.newAnimationObject({
					x: 1268,
					y: 419,
					w: 72,
					h: 70,
					animation: map.image_gong.getAnimation(0, 0, 72, 70, 1) // gong
			}));
		objsNature.push(game.newAnimationObject({
					x: 1388,
					y: 302,
					w: 246,
					h: 185,
					animation: map.image_build.getAnimation(0, 0, 206, 165, 1) // house
			}));	
		objsNature.push(game.newAnimationObject({
					x: 340,
					y: 416,
					w: 64,
					h: 64,
					animation: map.image_gr.getAnimation(736, 480, 64, 64, 1) // tree
			}));
		objsNature.push(game.newAnimationObject({
					x: 620,
					y: 160,
					w: 64,
					h: 64,
					animation: map.image_gr.getAnimation(736, 480, 64, 64, 1) // tree
			}));
		objsNature.push(game.newAnimationObject({
					x: 1240,
					y: 96,
					w: 64,
					h: 64,
					animation: map.image_gr.getAnimation(736, 480, 64, 64, 1) // tree
			}));
		objsNature.push(game.newAnimationObject({
					x: 1116,
					y: 352,
					w: 64,
					h: 64,
					animation: map.image_gr.getAnimation(736, 480, 64, 64, 1) // tree
			}));
		objsNature.push(game.newAnimationObject({
					x: 770,
					y: 416,
					w: 64,
					h: 64,
					animation: map.image_gr.getAnimation(736, 480, 64, 64, 1) // tree
			}));
		objsNature.push(game.newAnimationObject({
			x: 1550, 
			y: 412,
			w: 64,
			h: 72,
			animation: tiles.newImage('img/boss.png').getAnimation(544,664,64,72,1)
		}));
	
	OOP.forArr(stairMap, function(pos) {
		objsStair.push(game.newAnimationObject({
			x: pos[0],
			y: pos[1],
			w: 32,
			h: 64,
			animation: map.image_gr.getAnimation(672+64, 384, 32, 64, 1)
		}));
	});	
	OOP.forArr(map.level_map, function(str, y) {
		OOP.forArr(str, function(elem, x) {
			if(elem == '0') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*4,
					animation: map.image_gr.getAnimation(672, 384, 32, 64, 1) // water with bubbles
				}));
			}
			else if(elem == '1') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*4,
					animation: map.image_gr.getAnimation(672+32, 384, 32, 64, 1) // water
				}));
			}
			else if(elem == '3') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*16,
					h: map.height*6,
					animation: map.image_gr.getAnimation(672, 288, 256, 96, 1) // long stair
				}));
			}
			else if(elem == 'A') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(672+32, 64, 16, 32, 1) // out ground left light
				}));
			}
			else if(elem == 'B') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(672+48, 64, 16, 32, 1) // out ground rigth light
				}));
			}
			else if(elem == 'C') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*1,
					animation: map.image_gr.getAnimation(672+16, 32, 16, 16, 1) // piece of ground left
				}));
			}
			else if(elem == 'D') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*1,
					animation: map.image_gr.getAnimation(896, 32, 16, 16, 1) // piece of ground right
				}));
			}
			else if(elem == 'E') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(768, 32, 32, 32, 1) // piece of ground top light
				}));
			}
			else if(elem == 'F') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(768, 64, 32, 32, 1) // piece of ground inside light
				}));
			}
			else if(elem == 'G') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(736, 96, 32, 32, 1) // corner ground left light
				}));
			}
			else if(elem == 'H') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(832, 96, 32, 32, 1) // corner ground left right
				}));
			}
			else if(elem == 'I') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704, 96, 16, 32, 1) // ground left light
				}));
			}
			else if(elem == 'K') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704+16, 96, 16, 32, 1) // ground right light
				}));
			}
			else if(elem == 'L') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704, 32, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'M') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(864, 32, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'a') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(672+32, 64+128, 16, 32, 1) // out ground left light
				}));
			}
			else if(elem == 'b') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(672+48, 64+128, 16, 32, 1) // out ground rigth light
				}));
			}
			else if(elem == 'c') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*1,
					animation: map.image_gr.getAnimation(672+16, 32+128, 16, 16, 1) // piece of ground left
				}));
			}
			else if(elem == 'd') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*1,
					animation: map.image_gr.getAnimation(896, 32+128, 16, 16, 1) // piece of ground right
				}));
			}
			else if(elem == 'e') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(768, 32+128, 32, 32, 1) // piece of ground top light
				}));
			}
			else if(elem == 'f') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(768, 64+128, 32, 32, 1) // piece of ground inside light
				}));
			}
			else if(elem == 'g') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(736, 96+128, 32, 32, 1) // corner ground left light
				}));
			}
			else if(elem == 'h') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(832, 96+128, 32, 32, 1) // corner ground left right
				}));
			}
			else if(elem == 'i') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704, 96+128, 16, 32, 1) // ground left light
				}));
			}
			else if(elem == 'k') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*1,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704+16, 96+128, 16, 32, 1) // ground right light
				}));
			}
			else if(elem == 'l') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(704, 32+128, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'm') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(864, 32+128, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'N') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(784, 128, 32, 32, 1) // ground left corner light
				}));
			}
			else if(elem == 'n') {
				objs.push(game.newAnimationObject({
					x: x * map.width,
					y: y * map.height,
					w: map.width*2,
					h: map.height*2,
					animation: map.image_gr.getAnimation(784, 256, 32, 32, 1) // ground left corner light
				}));
			}
		});
	});	// DRAW NATURE MAP	
	OOP.forArr(map.level_map, function(str, y) {
		OOP.forArr(str, function(elem, x) {
		if(elem == 'E' || elem == 'e' || elem == 'M' || elem == 'm' || elem == 'L' || elem == 'l' || elem == 'x') {
				objsSurf.push(game.newRectObject({
					x: x * map.width,
					y: y * map.height,
					w: 32,
					h: 5,
					fillColor: "#4F0060"
				}));
			}
		})
	}); // DRAW SURFACE MAP	

	this.update = function () {
		game.clear();
		bgImag.draw();
		if(isFirstTime) {
			mainBoss.died.timer = 0;
			isFirstTime = false;
			isFinalFight = false;
			isGongPass = false;
			bossHealth = 100;
			princess.x = 1490;
			objsMashrooms = [];
			objsFood = [];
			objsEnemies = [];
			objsCoins = [];
			objsNature[objsNature.length-1].visible = true;
			OOP.forArr(mashroomsMap, function(pos) {
				objsMashrooms.push(game.newAnimationObject({
					x: pos[0],
					y: pos[1],
					w: 32,
					h: 32,
					animation: map.image_gr.getAnimation(736, 544, 32, 32, 1) // mashroom
				}));
			});
			OOP.forArr(foodMap, function(pos, indx) {
				if(indx%2) {
					objsFood.push(game.newAnimationObject({
					x: pos[0],
					y: pos[1],
					w: 32,
					h: 32,
					animation: imageFood1.getAnimation(0, 0, 32, 32, 1)
					}));
				}
				else {
					objsFood.push(game.newAnimationObject({
						x: pos[0],
						y: pos[1],
						w: 32,
						h: 32,
						animation: imageFood2.getAnimation(0, 0, 32, 32, 1)
					}));
				}
			});	
			OOP.forArr(enemiesMap, function(pos, indx){
				objsEnemies.push(game.newAnimationObject({
					x: x=pos[0]+pos[3],
					y: pos[1],
					w: 38,
					h: 60,
					animation: imageEnemy.getAnimation(21,184,38,68,12)
				}));
				objsEnemies[indx].right = true;
				objsEnemies[indx].dX = 1;
				objsEnemies[indx].initialX = pos[0];
				objsEnemies[indx].maxMove = pos[2];
			});
		}
		// DRAW TEXTURES
		//for(let i=0;i<objsSurf.length;i++) objsSurf[i].draw(); // it's possible not to draw
		for(let i=0;i<objsNature.length;i++) objsNature[i].draw();
		OOP.drawArr(objs);
		//princess.happy.drawReverFrames(0,2);
		
		for(let i=0;i<objsFood.length;i++) if(objsFood[i].visible) objsFood[i].draw();
		for(let i=0;i<objsStair.length;i++) objsStair[i].draw();
		for(let i=0;i<objsMashrooms.length;i++) objsMashrooms[i].draw();
		for(let i=0;i<objsCoins.length;i++) if(objsCoins[i].visible) objsCoins[i].draw();
		for(let i=0;i<objsBomb.length;i++) {
			if(objsBomb[i].visible) {
				//objsBomb[i].drawStaticBox();
				if(objsBomb[i].timer){
					objsBomb[i].drawFrames(0,1);
					objsBomb[i].timer -= 1;
					objsBomb[i].y -= objsBomb[i].dY;
					objsBomb[i].dY -= objsBomb[i].gravity;
					if(objsBomb[i].moveX) if(objsBomb[i].right) {
						objsBomb[i].x += 6;
					} else {
						objsBomb[i].x -= 6;
					}
					if(!objsBomb[i].moveX) if(!time_wav.playing){
						time_wav.stop();
						time_wav.play();
					}
				}
				else {
					objsBomb[i].drawFrames(2,7);
					time_wav.stop();
					objsBomb[i].sound.play();
					if(objsBomb[i].effect) {
						objsBomb[i].effect -= 1;
					} else objsBomb[i].visible = false;
				}
			}
		} // DRAW BOMBS ACCORDING THE TIME
		for(let i=0;i<objsEnemies.length;i++) if(objsEnemies[i].visible) {
			//objsEnemies[i].drawStaticBox();
			if(objsEnemies[i].visible)if(objsEnemies[i].right) {
				objsEnemies[i].drawFrames(0,5);
				objsEnemies[i].x += objsEnemies[i].dX;
				if((objsEnemies[i].x - objsEnemies[i].initialX)>objsEnemies[i].maxMove) objsEnemies[i].right = false;
			} 
			else {
				objsEnemies[i].drawFrames(6,11);	
				objsEnemies[i].x -= objsEnemies[i].dX;
				if(objsEnemies[i].x == objsEnemies[i].initialX) objsEnemies[i].right = true;
			}
		} // DRAW ENEMIES ACCORDING TO THEIR DIRECTION
		// END DRAW TEXTURES

		//if(health == 0) game.startLoop('Game_over');	
		if(statusOver == 6) {
			lose_wav.play();
			game.startLoop('Game_over');
		}
		if(statusOver == 7) {
			gong_wav.play();
			game.startLoop('Winner');
		}
		if(statusOver == 5 || statusOver == 1 || statusOver == 3 || statusOver == 4) { // Killed by BOSS || eat mushroom || killed by enemy || bombs
			game.startLoop('Game_over');
		}

		isStair = false;
		for(let i=0;i<objsStair.length;i++) {
			if(mainHero.stand.isIntersect(objsStair[i]) && mainHero.x<objsStair[i].x+12 && mainHero.x+24>objsStair[i].x) {
				isStair = true;
				isJump = false;
			}
		}		
		if(!isStair){
			mainHero.y = mainHero.y + speed;			
			isFree = true;
			mainHero.stand.y = mainHero.run.y = mainHero.y;		
			for(let i=0;i<objsSurf.length;i++){
				if(mainHero.stand.isIntersect(objsSurf[i])) {
					if((mainHero.y+mainHero.stand.h)<(objsSurf[i].y+22)){
						mainHero.y = objsSurf[i].y-mainHero.stand.h;
						mainHero.stand.y = mainHero.run.y = mainHero.y;
						isFree = false;
						if(dY<0) isJump = false;
					}
				}
			}
		}		
		if(key.isDown("UP") || key.isDown("SPACE") || key.isDown("W")) {
			if(isStair) {				
				mainHero.y -= speed*0.5;
				mainHero.stand.y = mainHero.run.y = mainHero.y;				
			} else if(isJump === false && isFree === false) {
					dY = speed*3;
					mainHero.stand.x = mainHero.run.x = mainHero.x;
					isJump = true;
					jump_wav.stop();
					jump_wav.play();
			}			
		}		
		if(isJump) {
			mainHero.y = mainHero.y - dY;
			dY -= gravity;
			if(dY< -4) dY = -4;
			mainHero.stand.y = mainHero.run.y = mainHero.y;
			isStair = false;
		}
		if(bombsLeft) if(key.isPress("CTRL")) {
			if(isFinalFight) bombsLeft -=1;
			objsBomb.push(game.newAnimationObject({
				x: mainHero.x,
				y: mainHero.y-22,
				w: 76, h: 76,
				animation: imageBomb.getAnimation(52,20,72,72,8)
			}));
			if(mainHero.right) {
				objsBomb[objsBomb.length-1].right = true;
				objsBomb[objsBomb.length-1].x += 4;
			}
			else {
				objsBomb[objsBomb.length-1].right = false;
				objsBomb[objsBomb.length-1].x -= 30;	
			}			
			objsBomb[objsBomb.length-1].timer = 66;
			objsBomb[objsBomb.length-1].dY = 2.5;
			objsBomb[objsBomb.length-1].gravity = 0.08;
			objsBomb[objsBomb.length-1].moveX = true;
			objsBomb[objsBomb.length-1].effect = 66;
			objsBomb[objsBomb.length-1].sound = audio.newAudio(pathExplSound, 0.7);
		} // THROW GRENADE
		if(bombsLeft) if(key.isPress("X")) if(!(isJump) && !(isFree) ) {
			if(isFinalFight) bombsLeft -= 1;
			objsBomb.push(game.newAnimationObject({
				x: mainHero.x,
				y: mainHero.y+14,
				w: 76, h: 76,
				animation: imageBomb.getAnimation(52,20,72,72,8)
			}));
			if(mainHero.right) {
				objsBomb[objsBomb.length-1].right = true;
				objsBomb[objsBomb.length-1].x += 4;
			}
			else {
				objsBomb[objsBomb.length-1].right = false;
				objsBomb[objsBomb.length-1].x -= 30;	
			}
			objsBomb[objsBomb.length-1].timer = 198;
			objsBomb[objsBomb.length-1].dY = 0;
			objsBomb[objsBomb.length-1].gravity = 0.00;
			objsBomb[objsBomb.length-1].moveX = false;
			objsBomb[objsBomb.length-1].effect = 66;
			objsBomb[objsBomb.length-1].sound = audio.newAudio(pathExplSound, 0.8);
		} // PLANT THE BOMB
			
		// IS INTERSECT
		for(let i=0;i<objsCoins.length;i++) if(objsCoins[i].visible) {
			if(mainHero.stand.isIntersect(objsCoins[i])) {
				objsCoins[i].visible = false;
				health += 5;
				if(health>100) health = 100;
				diamonds += 1;
				coin_wav.stop();
				coin_wav.play();
			}
		}
		for(let i=0; i<objsFood.length;i++) if(objsFood[i].visible) {
			if(mainHero.stand.isIntersect(objsFood[i])) {
				objsFood[i].visible = false;
				food_wav.stop();
				food_wav.play();
				health += 20;
				if(health>100) health = 100;
			}
		}		
		for(let i=0;i<objsMashrooms.length;i++) if(objsMashrooms[i].visible) {
			if(mainHero.run.isIntersect(objsMashrooms[i])) {
				objsMashrooms[i].visible = false;
				health -= 30;
				pain_wav.stop();
				pain_wav.play();
				if(health<0) {
					health = 0;
					statusOver = 1;
				}
			}
		}
		for(let i=0;i<objsEnemies.length;i++) if(objsEnemies[i].visible) {
			if(mainHero.stand.isIntersect(objsEnemies[i])) {
				if(dY<0 && !(isStair) && (mainHero.y<(objsEnemies[i].y-32)) && (mainHero.x<(objsEnemies[i].x+6)) && ((mainHero.x+46) > objsEnemies[i].x)) {
					objsEnemies[i].visible = false;
					objsCoins.push(game.newAnimationObject({
						x: objsEnemies[i].x + 4,
						y: objsEnemies[i].y + 25,
						w: 32, h: 32,
						animation: imageCoin.getAnimation(16, 24, 68, 64, 6)
					}));
					dY = speed*3;
					mainHero.stand.x = mainHero.run.x = mainHero.x;
					isJump = true;
					jump_wav.stop();
					jump_wav.play();
				}
				else {
					if(!isImmortal) {
						health -= 30;
						if(health<0) {
							health=0;
							statusOver = 3;
						}
						pain_wav.stop();
						pain_wav.play();
						isImmortal = 50;
					}
				}
			}
		}
		for(let i=0;i<objsBomb.length;i++) if(objsBomb[i].visible) {
			if(objsBomb[i].visible) {
				if(objsBomb[i].timer == 0 && objsBomb[i].effect > 56) {
					for(let j=0;j<objsEnemies.length;j++) {
						if(objsBomb[i].isIntersect(objsEnemies[j])) {
							objsEnemies[j].visible = false;
							objsCoins.push(game.newAnimationObject({
								x: objsEnemies[j].x + 4,
								y: objsEnemies[j].y + 25,
								w: 32, h: 32,
								animation: imageCoin.getAnimation(16, 24, 68, 64, 6)
							}));
						}
					}
					if(mainHero.stand.isIntersect(objsBomb[i])) {
						health -= 2;
						if(health<0) {
							statusOver = 4;
							health = 0;
						}
					}
					if(mainBoss.go.isIntersect(objsBomb[i])) {
						bossHealth -= 0.15;
						if(bossHealth <= 0) bossHealth = 0;
					}					
				}
			}
		}
		// END OF INTERSECT

		if(!isGongPass) if(mainHero.x>objsNature[0].x && mainHero.x-25<objsNature[0].x) if(mainHero.stand.isIntersect(objsNature[0])) {
			//health+=1;
			objsEnemies = [];
			gong_wav.play();
			objsNature[objsNature.length-1].visible = false;
			isGongPass = true;
			bombsLeft = 50;
			bossHealth = 100;
			mainBoss.stand.x = mainBoss.x = 1550;
			mainBoss.stand.y = mainBoss.y = 364;
			mainBoss.state = 'stand';
		}		
		if(isGongPass) if(!isFinalFight) if(bossHealth) {
			if(!gong_wav.playing) isFinalFight = true;
			mainBoss.stand.drawFrames(0,1);
			bossHealth = 100;
			bossHealthText.text = 'BOSS: ' + bossHealth;
			bombsText.text = 'BOMBS: ' + bombsLeft;
			bossHealthText.draw();
			bombsText.draw();
		}	
		
		if(isImmortal>0) isImmortal -= 1;
		if(objsBomb.length>0) if(objsBomb[objsBomb.length-1].visible === false) objsBomb.pop();
		if(objsEnemies.length>0) {
			if(objsEnemies[objsEnemies.length-1].visible === false) objsEnemies.pop();
		}
		
		if(key.isPress("P")) game.startLoop('Pause');		
		if(mainHero.x>width*0.5 && mainHero.x<(width*0.5+600)) camPos = mainHero.x-width*0.5; //*********
		camera.moveTime({x:camPos, y:0}, 0);
		if(key.isDown("K")) if(camPos>0) camPos -= 8;
		if(key.isDown("L")) if(camPos<590) camPos += 8;
		heroHealthText.text = 'HEALTH: ' + health;		
		diamondsText.text = 'DIAMONDS: ' + diamonds + '/' + diamondsOK;
		diamondsText.x = heroHealthText.x = gameName.x = bossHealthText.x = bombsText.x = camPos;
		gameName.draw();
		heroHealthText.draw();
		diamondsText.draw();

		//isFinalFight = true;
		if(bossHealth < 0) bossHealth = 0;

		if(isFinalFight) if(bossHealth) {
				
			bossHealthText.text = 'BOSS: ' + Math.ceil(bossHealth);
			bombsText.text = 'BOMBS: ' + bombsLeft;
			bossHealthText.draw();
			bombsText.draw();
			mainBoss.stand.x = mainBoss.go.x = mainBoss.fight.x = mainBoss.died.x = mainBoss.x;
			mainBoss.stand.y = mainBoss.go.y = mainBoss.fight.y = mainBoss.died.y = mainBoss.y = 360;
			if(mainBoss.x-mainHero.stand.w > mainHero.x) {
					if(mainBoss.y > mainHero.y +70) {
						mainBoss.state = 'go';
					} else {
						mainBoss.state = 'fight';
					}
					mainBoss.right = false;
			}
			if(mainBoss.x + mainBoss.go.w < mainHero.x) {
					mainBoss.right = true;
					if(mainBoss.y > mainHero.y +70) {
						mainBoss.state = 'go';
					} else {
						mainBoss.state = 'fight';
					}
			}

			if(mainBoss.y>mainHero.y+180 && mainBoss.x-30<mainHero.x && mainBoss.x+30>mainHero.x) mainBoss.state = 'stand';
			
			if(mainBoss.state == 'stand') {				
					mainBoss.stand.drawFrames(0,1);				
			}
			else if(mainBoss.state == 'go') {
				if(mainBoss.right) {					
					mainBoss.x += mainBoss.go.dX;
					mainBoss.stand.x = mainBoss.go.x = mainBoss.fight.x = mainBoss.died.x = mainBoss.x;
					mainBoss.go.drawFrames(6,11);
				} else {					
					mainBoss.x -= mainBoss.go.dX;
					mainBoss.stand.x = mainBoss.go.x = mainBoss.fight.x = mainBoss.died.x = mainBoss.x;
					mainBoss.go.drawFrames(0,5);
				}
			}
			else if(mainBoss.state == 'fight') {
				if(mainBoss.right) {
					mainBoss.fight.drawFrames(4,7);
					mainBoss.x += mainBoss.fight.dX;
					mainBoss.stand.x = mainBoss.go.x = mainBoss.fight.x = mainBoss.died.x = mainBoss.x;
				} else {
					mainBoss.fight.drawFrames(0,3);
					mainBoss.x -= mainBoss.fight.dX;
					mainBoss.stand.x = mainBoss.go.x = mainBoss.fight.x = mainBoss.died.x = mainBoss.x;
				}
			}
			
			// intersect

			if(mainHero.stand.isIntersect(mainBoss.go)) {
				//health++;
				if((dY<0 || isFree) && !(isStair) && (mainHero.y<(mainBoss.y-40)) && ((mainHero.x)>mainBoss.x) && ((mainHero.x-43) < mainBoss.x)) {
					bossHealth -= 10;
					dY = speed*3;
					isFree = false;
					mainHero.stand.x = mainHero.run.x = mainHero.x;
					mainHero.stand.y = mainHero.run.y = mainHero.y;
					isJump = true;
					jump_wav.stop();
					jump_wav.play();
				}
				else {
					if(!isImmortal) {
						health -= 30;
						if(health<=0) {
							health=0;
							statusOver = 5;
						}
						pain_wav.stop();
						pain_wav.play();
						isImmortal = 50;
					}
				}
			};

			// end intersect
		};
		// END IF_FINAL_FIGHT

		if(bossHealth == 0) {
			isFinalFight = false;
			bossHealthText.text = 'BOSS: ' + 0;
			bombsText.text = 'BOMBS: ' + bombsLeft;
			bossHealthText.draw();
			bombsText.draw();
			if(mainBoss.died.timer < 125) {
				mainBoss.died.timer += 1;
				if(mainBoss.died.timer == 2) {
					princess.staticX = (mainBoss.x+mainHero.x)*0.5;
					if(princess.staticX>1300) princess.staticX = 1300;
				}
				if(mainBoss.right) {
					mainBoss.x += mainBoss.died.dX;
					mainBoss.stand.x = mainBoss.go.x = mainBoss.fight.x = mainBoss.died.x = mainBoss.x;
					if(mainBoss.died.timer<40) {
						mainBoss.died.drawFrames(0);
					} else if(mainBoss.died.timer<80) {
						mainBoss.died.drawFrames(1);
					} else mainBoss.died.drawFrames(2);
				}
				else {
					mainBoss.x -= mainBoss.died.dX;
					mainBoss.stand.x = mainBoss.go.x = mainBoss.fight.x = mainBoss.died.x = mainBoss.x;						
					if(mainBoss.died.timer<40) {
						mainBoss.died.drawFrames(5);
					} else if(mainBoss.died.timer<80) {
						mainBoss.died.drawFrames(4);
					} else mainBoss.died.drawFrames(3);	
				}
			}
			else {
				if(mainBoss.right) {
					mainBoss.died.drawFrames(2);
				} else mainBoss.died.drawFrames(3);
			//winn_wav.play();
				if(diamonds>=diamondsOK) {
					princess.happy.drawReverFrames(0,2);
					if(Math.abs(princess.x - princess.staticX)>3) {
						if(princess.x>princess.staticX) {
							princess.x -= princess.dX;							
						} 
						else {
							princess.x += princess.dX;
						}
						princess.happy.x = princess.worry.x = princess.x;
					} 
					else {
						// have gone to hero
						system.setContextSettings({
  							globalAlpha : 0.5
						});
						pjs.brush.drawEllips({
							x: princess.x,
							y: 330,
							h: 84,
							w: 300,
							fillColor: "#E5F0BF"
						});
						system.setContextSettings({
  							globalAlpha : 1
						});
						pjs.brush.drawText({
							x: princess.x+22,
							y: 360,
							text: "YOU ARE MY HERO !",
							color: "#0000FF",
							size: 25,
							font: 'Arial'
						});
						if(mainHero.stand.isIntersect(objsNature[0])) if(mainHero.x>objsNature[0].x && mainHero.x-25<objsNature[0].x){
							bgFlag = false;
							statusOver = 7;
						}
					}
				}
				else {
					princess.worry.drawReverFrames(0,2);
					if(Math.abs(princess.x - princess.staticX)>3) {
						if(princess.x>princess.staticX) {
							princess.x -= princess.dX;							
						} 
						else {
							princess.x += princess.dX;
						}
						princess.worry.x = princess.happy.x = princess.x;
					} 
					else {
						// have gone to hero
						system.setContextSettings({
  							globalAlpha : 0.5
						});
						pjs.brush.drawEllips({
							x: princess.x,
							y: 330,
							h: 84,
							w: 300,
							fillColor: "#E5F0BF"
						});
						system.setContextSettings({
  							globalAlpha : 1
						});
						pjs.brush.drawText({
							x: princess.x+20,
							y: 360,
							text: "YOU KILL MY HERO!",
							color: "#0000FF",
							size: 25,
							font: 'Arial'
						});
						if(mainHero.stand.isIntersect(objsNature[0])) if(mainHero.x>objsNature[0].x && mainHero.x-25<objsNature[0].x) {
							bgFlag = false;
							statusOver = 6;
						}
					}
				}
			}
		}
		if(key.isDown("RIGHT") || key.isDown("D")) {
			mainHero.right = true;
			if(mainHero.x < 1575) mainHero.x += speed;
			mainHero.stand.x = mainHero.run.x = mainHero.x;
			mainHero.stand.y = mainHero.run.y = mainHero.y;
			mainHero.run.drawFrames(0, 5);
		}
		else if(key.isDown("LEFT") || key.isDown("A")) {
			mainHero.right = false;
			if(mainHero.x>0)mainHero.x -= speed;
			mainHero.stand.x = mainHero.run.x = mainHero.x;
			mainHero.stand.y = mainHero.run.y = mainHero.y;
			mainHero.run.drawFrames(6, 11);
		}
		else if(key.isDown("DOWN") || key.isDown("S")) {
			if(isStair) if(mainHero.y<423)mainHero.y+=2;
			mainHero.stand.y = mainHero.run.y = mainHero.y;
			if(mainHero.right) {
				mainHero.stand.drawFrames(3,5);
			}
			else {
				mainHero.stand.drawFrames(8,10);	
			}
		}
		else {
			if(mainHero.right) {
				mainHero.stand.drawFrames(3,5);
			}
			else {
				mainHero.stand.drawFrames(8,10);	
			}
		}		
	}
});

game.newLoopFromConstructor('Winner', function () {
	
	var winnerText = game.newTextObject({
		positionC: point(game.getWH2().w + camPos + 20, game.getWH2().h - 20),
		size: 108,
		text: 'YOU WIN !!!',
		color: '#46E620',
		font: 'Bodoni MT Black'
	}),
	restartGameText = game.newTextObject({
		position: point(game.getWH2().w + camPos, game.getWH2().h + 150),
		size: 40,
		text: 'PRESS "R" TO RESTART THE GAME',
		color: '#46E627',
		font: 'Bodoni MT',
		alpha: 1
	}),
	bgObject = game.newRectObject({
		x: camPos,
		y: 0,
		w: width,
		h: height,
		fillColor: "#191819"
	});;

	this.update = function() {
		if(!bgFlag) {
			system.setContextSettings({
  				globalAlpha : 0.8
			});
			bgObject.x = camPos;
			pjs.brush.drawRect(bgObject);
			bgFlag = true;
			system.setContextSettings({
  				globalAlpha : 1
			});
		};

		winnerText.x = camPos + 160;
		restartGameText.x = camPos + 160;
		winnerText.draw();
		restartGameText.draw();
			
		if(key.isPress("R")) {
			isFirstTime = true;
			currentLevel = 'GameLevel_01';
			game.startLoop(currentLevel);
		}
	}
});

game.newLoopFromConstructor('Game_over', function () {
	
	var gameOverText = game.newTextObject({
		positionC: point(game.getWH2().w, game.getWH2().h - 20),
		size: 100,
		text: 'GAME OVER',
		color: '#46F620',
		font: 'Bodoni MT Black'
	}),
	restartGameText = game.newTextObject({
		positionC: point(game.getWH2().w + camPos, game.getWH2().h + 150),
		size: 40,
		text: 'PRESS "R" TO RESTART THE GAME',
		color: '#66E620',
		font: 'Bodoni MT',
		alpha: 1
	}),
	statusOverText = game.newTextObject({
		positionC: point(game.getWH2().w + camPos, game.getWH2().h + 90),
		size: 30,
		color: '#46F6E7',
		text: 'YOU HAVE LOST YOUR HEALTH',
		font: 'Arial',
		alpha: 1
	}),
	bgObject = game.newRectObject({
		x:camPos,
		y:0,
		w: width,
		h: height,
		fillColor: "#191819"
	});;
	

	this.update = function() {
		if(!bgFlag) {
			system.setContextSettings({
  				globalAlpha : 0.8
			});
			bgObject.x = camPos;
			pjs.brush.drawRect(bgObject);
			bgFlag = true;
			system.setContextSettings({
  				globalAlpha : 1
			});
		}
		statusOverText.x = 260 + camPos;
		if(statusOver == 1) {
			statusOverText.text = '-YOU HAVE EATEN POISONOUS MUSHROOM-';
			statusOverText.x = camPos + 175;
		}
		if(statusOver == 2) {
			statusOverText.text = '-YOU HAVE DRAWNED-';
			statusOverText.x = camPos + 348;
		}
		if(statusOver == 3) {
			statusOverText.text = '-ENEMY HAS KILLED YOU-';
			statusOverText.x = camPos + 320;
		}
		if(statusOver == 4) {
			statusOverText.text = '-YOU HAVE EPLODED ON A BOMB-';
			statusOverText.x = camPos + 260;
		}
		if(statusOver == 5) {
			statusOverText.text = '-BOSS HAS KILLED YOU-';
			statusOverText.x = camPos + 335;
		}
		if(statusOver == 6) {
			statusOverText.text = '-PRINCESS HAS KILLED YOU-';
			statusOverText.x = camPos + 300;
		}


		gameOverText.x = camPos + 160;
		restartGameText.x = camPos + 160;
		gameOverText.draw();
		restartGameText.draw();
		statusOverText.draw();	
			
		if(key.isPress("R")) {
			isFirstTime = true;
			currentLevel = 'GameLevel_01';
			game.startLoop(currentLevel);
		}
	}
});

game.newLoopFromConstructor('Pause', function () {
	var pausNameText = game.newTextObject({
		positionC : point(game.getWH2().w + camPos, game.getWH2().h), // central position of text
		size : 90, // size text
		color : '#B0FFC0', // color text
		text : 'PAUSE', // label
		alpha : 0.9, // alpha channel
		//font : 'Goudy Stout' // font family
		font: 'Bodoni MT Black'
	}),
		pausResuText = game.newTextObject({
		positionC : point(game.getWH2().w + camPos, game.getWH2().h + 90), // central position of text
		size : 50, // size text
		color : '#C0DF70', // color text
		text : 'PRESS "P" TO RESUME', // label
		alpha : 0.9, // alpha channel
		//font : 'Goudy Stout' // font family
		font: 'Bodoni MT black'
	});
	this.update = function () {
		pausNameText.x = camPos + 330;
		pausResuText.x = camPos + 180;
		pausNameText.draw();
		pausResuText.draw();		
		if(key.isPress("P")) game.startLoop(currentLevel);
	}
});

game.setLoopSound('GameLevel_02', [back_level_02_mp3]);
game.setLoopSound('GameLevel_01', [back_level_01_mp3]);
game.startLoop('Start');