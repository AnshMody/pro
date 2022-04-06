// defining all the required variables for the game
var space, backgroundImg;
var spaceship, spaceshipImg;
var alien, alienImg, alienGrp;
var bullet, bulletImg, bulletGrp;
var bullets = 70;
var heart1, heart2, heart3, heart1Img, heart2Img, heart3Img;
var gameState = "play";
var score=0;
var life=3;

//loading all the required images
function preload() {
  backgroundImg = loadImage("SpaceBg.jpg");
  spaceshipImg = loadImage("Spaceship1.png");
  alienImg = loadImage("Alien2.png");
  heart1Img=loadImage("heart_1.png");
  heart2Img=loadImage("heart_2.png");
  heart3Img=loadImage("heart_3.png");
  bulletImg=loadImage("Bullet1.png");
  explosionSound=loadSound("explosion.mp3");
  win=loadSound("win.mp3");
  lose=loadSound("lose.mp3");
}

function setup() {

  //creating a canvas with size compatible to the window
  createCanvas(windowWidth, windowHeight);

  //adding a background that will have a position centre of the canvas
  space=createSprite(windowWidth/2, windowHeight/2, 100, 100);
  space.addImage(backgroundImg);
  space.scale = 1.2;

  //creating sprites for spaciship
  spaceship=createSprite(windowWidth/2-400, windowHeight/2+200, 100, 100);
  spaceship.addImage(spaceshipImg);
  spaceship.scale = 0.15;
  spaceship.debug=false;
  spaceship.setCollider("rectangle",0,0,500,1300);

  //creating sprites for heats and adding images
  heart1 = createSprite(windowWidth-120,40,5,5);
  heart2 = createSprite(windowWidth-100,40,5,5);
  heart3 = createSprite(windowWidth-140,40,5,5);

  heart1.addImage(heart1Img);
  heart2.addImage(heart2Img);
  heart3.addImage(heart3Img);

  heart1.scale=0.4;
  heart2.scale=0.4;
  heart3.scale=0.4;

  heart1.visible=false;
  heart2.visible=false;

  //Creating a group for aliens and bullets
  alienGrp = new Group();
  bulletGrp = new Group();
  }

function draw() {

  //initiating play gameState
  if(gameState === "play"){

  //defining conditions for the heart to be displayed based on number of lives left
  if(life === 3){
    heart3.visible=true;
    heart2.visible=false;
    heart1.visible=false;
  }

  if(life === 2){
    heart3.visible=false;
    heart2.visible=true;
    heart1.visible=false;
  }

  if(life === 1){
    heart3.visible=false;
    heart2.visible=false;
    heart1.visible=true;
  }

  //conditions to change gamestate from play to either won, end or bullet

  if(life === 0){
    gameState = "end";
    heart1.visible=false;
  }

  if(life>0 && score >= 120){
    gameState = "won"
  }

  if(bullets === 0){
    gameState = "bullet";
    lose.play()
  }

  //providing movement to the spaceship
  if(keyDown("LEFT_ARROW") || touches.length>0){
    spaceship.x = spaceship.x-20;
  }

  if(keyDown("RIGHT_ARROW") || touches.length>0){
    spaceship.x = spaceship.x+20;
  }

  //allowing spaceship to shoot bullet
  if(keyWentDown("space")){
    bullet=createSprite(spaceship.x, spaceship.y-30, 20, 10);
    bullet.velocityY=-20;
    bulletGrp.add(bullet);
    bullets = bullets-1;
    bullet.addImage(bulletImg);
    bullet.scale = 0.1;
  }

  //detecting whether alien has been killed by bullet or not
  if(alienGrp.isTouching(bulletGrp)){
    for(var i=0; i<alienGrp.length; i++){
      if(alienGrp[i].isTouching(bulletGrp)){
        alienGrp[i].destroy();
        bulletGrp.destroyEach();
        score = score + 2;
        explosionSound.play();
      }
    }
  }

  //detecting whether alien has attacked spaceship or not
  if(alienGrp.isTouching(spaceship)){
    for(var i=0; i<alienGrp.length; i++){
      if(alienGrp[i].isTouching(spaceship)){
        alienGrp[i].destroy();
        life = life-1;
      }
    }
  }

  //spawing aliens at random positions
  spawnAlien();
}

  drawSprites();

  //displaying required text on screen
  textSize(20);
  fill("white");
  text("Score:"+ score, 20, 20);
  text("Bullets:"+ bullets, 20, 40);

  //defining gameState end, won and bulet
  if(gameState === "end"){
    textSize(100);
    fill("red");
    text("GAME OVER!", 400, 400);
    alienGrp.detroyEach();
    spaceship.destroy();
    bulletGrp.destroyEach();
  }

  else if(gameState === "won"){
    textSize(100);
    fill("red");
    text("YOU WON!", 400, 400);
    alienGrp.detroyEach();
    spaceship.destroy();
    bulletGrp.destroyEach();
  }

  else if(gameState === "bullet"){
    textSize(100);
    fill("red");
    text("YOU RAN OUT OF BULLETS!", 100, 400);
    alienGrp.detroyEach();
    spaceship.destroy();
    bulletGrp.destroyEach();
  }
}

//defining the function to spawn alien
function spawnAlien(){
  if(frameCount%50===0){
    alien = createSprite(random(20,1000),random(0,100),40,40);
    alien.addImage(alienImg);
    alien.scale = 0.4;
    alien.lifetime=400;
    alien.velocityY= 5;
    alienGrp.add(alien);
    alien.setCollider("rectangle",0,0,150,300)
    alien.debug=false;
  }
}