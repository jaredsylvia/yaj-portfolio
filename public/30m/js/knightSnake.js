let score = 0;
let oldScore = 0;
let goodKnight;
let badKnight;
let followerKnights = [];
let cursors;
let spacebar;
let isRunning = false;
let scoreText;
let maxHealth = 500;
let health = 100;
let initialBarWidth;
let healthBar;
let baseSpeed = 100;
let speed = isRunning ? baseSpeed + (baseSpeed * .30) : baseSpeed;

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'knightSnake',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.NO_CENTER,
    
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', '/assets/map.png');
    this.load.spritesheet('knight', '/assets/knight.png', { frameWidth: 16, frameHeight: 32 });
    
}

function create() {
    createScoreText.call(this);
    createStartWindow.call(this);
    createHealthBar.call(this);
    createGoodKnight.call(this);
    createBadKnight.call(this);
    createAnimations.call(this);
    setupKeyboardInput.call(this);
    createBackground.call(this);

    // Bind the context of the following functions
    checkCollisions = checkCollisions.bind(this);
    checkFollowerCollisions = checkFollowerCollisions.bind(this);
    checkWallCollisions = checkWallCollisions.bind(this);
    restartGame = restartGame.bind(this);
    updateScoreText = updateScoreText.bind(this);
    updateGoodKnight = updateGoodKnight.bind(this);
    updateFollowerKnights = updateFollowerKnights.bind(this);
}

function update() {
    checkFollowerCollisions(this);
    checkWallCollisions(this);
    checkCollisions.call(this);
    updateScoreText.call(this);
    updateGoodKnight.call(this);
    updateFollowerKnights.call(this);

    if (health <= 0) {
        restartGame();
    }
}

function createScoreText() {
    scoreText = this.add.text(config.width - 10, 10, 'Score: 00000', {
        fontFamily: 'Arial',
        fontSize: 20,
        color: '#ffffff',
        align: 'right'
    });
    scoreText.setOrigin(1, 0);
}

function createStartWindow() {
    const windowWidth = 400;
    const windowHeight = 300;
    const windowX = (config.width - windowWidth) / 2;
    const windowY = (config.height - windowHeight) / 2;

    const windowGraphics = this.add.graphics();
    windowGraphics.fillStyle(0x000000, 0.8);
    windowGraphics.fillRect(windowX, windowY, windowWidth, windowHeight);
    windowGraphics.setDepth(Number.MAX_SAFE_INTEGER);

    const titleText = this.add.text(config.width / 2, windowY + 50, 'Knight Snake', {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#ffffff',
        align: 'center'
    });
    titleText.setOrigin(0.5);
    titleText.setDepth(Number.MAX_SAFE_INTEGER);

    let content = 'WASD to move.\n\nSpacebar toggles run.\n\nPress any key to start the game.';
    if (oldScore > 0) {
        content += '\n\nScore: ' + oldScore;
    }

    const contentText = this.add.text(config.width / 2, windowY + 180, content, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffffff',
        align: 'center'
    });
    contentText.setOrigin(0.5);
    contentText.setDepth(Number.MAX_SAFE_INTEGER);

    const authorText = this.add.text(windowX + windowWidth - 10, windowY + windowHeight - 10, 'Author: Jared Sylvia', {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff',
        align: 'right'
    });
    authorText.setOrigin(1);
    authorText.setDepth(Number.MAX_SAFE_INTEGER);

    this.input.keyboard.on('keydown', () => {
        windowGraphics.destroy();
        titleText.destroy();
        contentText.destroy();
        authorText.destroy();
        
    });
}

function createHealthBar() {
    const barWidth = 200;
    const barHeight = 20;
    const x = 10;
    const y = 10;

    // Create the background for the health bar
    const healthBackground = this.add.rectangle(x, y, barWidth, barHeight, 0x555555);
    healthBackground.setOrigin(0);

    // Create the actual health bar as a foreground rectangle
    healthBar = this.add.rectangle(x, y, barWidth, barHeight, 0xff0000);
    healthBar.setOrigin(0);

    // Store the initial bar width
    initialBarWidth = barWidth;

    // Update the health bar based on the initial health value
    updateHealthBar();
}


function updateHealthBar() {
    const remainingHealthFraction = health / maxHealth;
    const width = remainingHealthFraction * initialBarWidth;
    console.log("Health Fraction: " + remainingHealthFraction);
    //console.log("Full Width: " + fullWidth);
    console.log("Width: " + width);
    healthBar.setSize(width, healthBar.height);

    // Set the health bar color to red if health is below or equal to the maximum health, otherwise set it to gray
    healthBar.setFillStyle(health <= maxHealth ? 0xff0000 : 0x999999);
}







function createBackground() {
    const backgroundImage = this.add.image(0, 0, 'background');
    backgroundImage.setOrigin(0, 0);
    backgroundImage.setScale(config.width / backgroundImage.width, config.height / backgroundImage.height);
    backgroundImage.setDepth(-1);
}

function createGoodKnight() {
    const spriteWidth = 16;
    const spriteHeight = 20;
    const halfSpriteWidth = spriteWidth / 2;
    const halfSpriteHeight = spriteHeight / 2;

    const randomX = Phaser.Math.Clamp(
        Phaser.Math.Between(halfSpriteWidth, config.width - halfSpriteWidth),
        halfSpriteWidth,
        config.width - halfSpriteWidth
    );

    const randomY = Phaser.Math.Clamp(
        Phaser.Math.Between(halfSpriteHeight, config.height - halfSpriteHeight),
        halfSpriteHeight,
        config.height - halfSpriteHeight
    );

    goodKnight = this.physics.add.sprite(randomX, randomY, 'knight', 0);
    goodKnight.setScale(2.5);
    goodKnight.setOrigin(0.5, 0.6);
    goodKnight.setCrop(new Phaser.Geom.Rectangle(0, 0, spriteWidth, spriteHeight));
}

function createBadKnight() {
    const spriteWidth = 16;
    const spriteHeight = 20;
    const halfSpriteWidth = spriteWidth / 2;
    const halfSpriteHeight = spriteHeight / 2;

    const randomX = Phaser.Math.Clamp(
        Phaser.Math.Between(halfSpriteWidth, config.width - halfSpriteWidth),
        halfSpriteWidth,
        config.width - halfSpriteWidth
    );

    const randomY = Phaser.Math.Clamp(
        Phaser.Math.Between(halfSpriteHeight, config.height - halfSpriteHeight),
        halfSpriteHeight,
        config.height - halfSpriteHeight
    );

    badKnight = this.physics.add.sprite(randomX, randomY, 'knight', 0);
    badKnight.setScale(2.5);
    badKnight.setOrigin(0.5, 0.6);
    badKnight.setCrop(new Phaser.Geom.Rectangle(0, 0, spriteWidth, spriteHeight));
    badKnight.setTint(0xff0000);
}


function createAnimations() {
    this.anims.create({
        key: 'walkDown',
        frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 2, first: 0 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'walkUp',
        frames: this.anims.generateFrameNumbers('knight', { start: 3, end: 5, first: 3 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'walkLeft',
        frames: this.anims.generateFrameNumbers('knight', { start: 6, end: 8, first: 6 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'runDown',
        frames: this.anims.generateFrameNumbers('knight', { start: 9, end: 11, first: 9 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'runUp',
        frames: this.anims.generateFrameNumbers('knight', { start: 12, end: 14, first: 12 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'runLeft',
        frames: this.anims.generateFrameNumbers('knight', { start: 14, end: 16, first: 14 }),
        frameRate: 12,
        repeat: -1
    });
}

function setupKeyboardInput() {
    cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Add an event listener for the spacebar key
    this.input.keyboard.on('keydown-SPACE', function (event) {
        isRunning = !isRunning; // Toggle the running state
        speed = isRunning ? baseSpeed + (baseSpeed * .30) : baseSpeed; // Update the speed based on the running state
    });
}

function checkCollisions() {

    this.physics.collide(goodKnight, badKnight, handlebadKnightCollision, null, this);
}

function checkFollowerCollisions() {
    for (let i = 0; i < followerKnights.length; i++) {
        const followerKnight = followerKnights[i];

        this.physics.collide(goodKnight, followerKnight, () => {
            followerKnights.pop()?.destroy();
            score -= 2; // Deduct 2 point
            if (score < 0) {
                score = 0; // Ensure the score doesn't go below 0
            }
            health -= 10;
            updateHealthBar();
        });
    }
}

function checkWallCollisions() {
    if (goodKnight.x < 0 || goodKnight.x > config.width || goodKnight.y < 0 || goodKnight.y > config.height) {
        restartGame();
    }
}

function restartGame() {
    oldScore = score;
    score = 0;
    health = 100;
    baseSpeed = 100;
    this.children.removeAll();
    followerKnights = [];
    this.scene.restart();
}

function handlebadKnightCollision() {
    badKnight.destroy();
    score += 5;
    resetBadKnight.call(this);
    createFollowerKnight.call(this);
}


function resetBadKnight() {
    const safeXRange = config.width - (badKnight.width * badKnight.scaleX);
    const safeYRange = config.height - (badKnight.height * badKnight.scaleY);
    const randomX = Phaser.Math.Between(0, safeXRange);
    const randomY = Phaser.Math.Between(0, safeYRange);
    badKnight = this.physics.add.sprite(randomX, randomY, 'knight', 0);
    badKnight.setScale(2.5);
    badKnight.setTint(0xff0000);
}

function createFollowerKnight() {
    speed = isRunning ? baseSpeed + (baseSpeed * .30) : baseSpeed;
    let followerX;
    let followerY;
    if (followerKnights.length > 0) {
        const prevFollower = followerKnights[followerKnights.length - 1];
        followerX = prevFollower.x - (prevFollower.width * prevFollower.scaleX);
        followerY = prevFollower.y;
    } else {
        const directionX = Math.sign(goodKnight.body.velocity.x);
        const directionY = Math.sign(goodKnight.body.velocity.y);
        const offsetX = directionX !== 0 ? (goodKnight.width * goodKnight.scaleX * directionX) : 0;
        const offsetY = directionY !== 0 ? (goodKnight.height * goodKnight.scaleY * directionY) : 0;
        followerX = goodKnight.x - offsetX;
        followerY = goodKnight.y - offsetY;
    }
    const followerKnight = this.physics.add.sprite(followerX, followerY, 'knight', 0);
    followerKnight.setScale(2.5);
    followerKnight.setSize(10, 10);
    followerKnight.setOrigin(0.5, 0.60);
    followerKnight.setCrop(new Phaser.Geom.Rectangle(0, 0, 16, 20));
    //followerKnight.depth = 10;
    //followerKnight.setOffset(3,11);
    //followerKnight.setTint(0x00ff00);
    followerKnights.push(followerKnight);
    baseSpeed += 10;
    health += 5;
    console.log(health);
    console.log(maxHealth);
    updateHealthBar();
    
}

function updateScoreText() {
    scoreText.setText(`Score: ${String(score).padStart(5, '0')}`);
}

function updateGoodKnight() {
    speed = isRunning ? baseSpeed + (baseSpeed * .30) : baseSpeed;
    let velocityX = 0;
    let velocityY = 0;
    let prevVelocityX = goodKnight.body.velocity.x;
    let prevVelocityY = goodKnight.body.velocity.y;

    if (cursors.up.isDown && cursors.down.isUp && cursors.left.isUp && cursors.right.isUp) {
        velocityY = -speed;
        velocityX = 0;
    } else if (cursors.down.isDown && cursors.up.isUp && cursors.left.isUp && cursors.right.isUp) {
        velocityY = speed;
        velocityX = 0;
    } else if (cursors.left.isDown && cursors.right.isUp && cursors.up.isUp && cursors.down.isUp) {
        velocityX = -speed;
        velocityY = 0;
    } else if (cursors.right.isDown && cursors.left.isUp && cursors.up.isUp && cursors.down.isUp) {
        velocityX = speed;
        velocityY = 0;
    } else if (cursors.up.isDown && cursors.left.isDown && cursors.right.isUp && cursors.down.isUp) {
        velocityY = -speed;
        velocityX = -speed;
    } else if (cursors.up.isDown && cursors.right.isDown && cursors.left.isUp && cursors.down.isUp) {
        velocityY = -speed;
        velocityX = speed;
    } else if (cursors.down.isDown && cursors.left.isDown && cursors.right.isUp && cursors.up.isUp) {
        velocityY = speed;
        velocityX = -speed;
    } else if (cursors.down.isDown && cursors.right.isDown && cursors.left.isUp && cursors.up.isUp) {
        velocityY = speed;
        velocityX = speed;
    } else {
        velocityX = prevVelocityX; // Continue with previous velocity if no change
        velocityY = prevVelocityY; // Continue with previous velocity if no change
    }

    goodKnight.body.velocity.x = velocityX;
    goodKnight.body.velocity.y = velocityY;

    // Normalize the direction of goodKnight
    const currentDirectionX = goodKnight.body.velocity.x;
    const currentDirectionY = goodKnight.body.velocity.y;
    const currentDistance = Math.sqrt(currentDirectionX * currentDirectionX + currentDirectionY * currentDirectionY);
    let normalizedDirectionX = 0;
    let normalizedDirectionY = 0;

    if (currentDistance !== 0) {
        normalizedDirectionX = currentDirectionX / currentDistance;
        normalizedDirectionY = currentDirectionY / currentDistance;
    }

    // Determine the absolute values of normalized direction for goodKnight
    const absNormalizedDirectionX = Math.abs(normalizedDirectionX);
    const absNormalizedDirectionY = Math.abs(normalizedDirectionY);

    // Update animation based on the direction of movement
    if (absNormalizedDirectionX > absNormalizedDirectionY) {
        if (normalizedDirectionX > 0) {
            goodKnight.anims.play('walkLeft', true);
            goodKnight.setFlipX(true); // Reset horizontal flip
        } else if (normalizedDirectionX < 0) {
            goodKnight.anims.play('walkLeft', true);
            goodKnight.setFlipX(false); // Flip horizontally
        }
    } else {
        if (normalizedDirectionY > 0) {
            goodKnight.anims.play('walkDown', true);
        } else if (normalizedDirectionY < 0) {
            goodKnight.anims.play('walkUp', true);
        }
    }

    // If there is no movement, stop the animation
    if (currentDistance === 0) {
        goodKnight.anims.stop();
    }
}

function updateFollowerKnights() {
    if (followerKnights.length > 0) {
        let prevFollower = goodKnight;
        for (let i = 0; i < followerKnights.length; i++) {
            const currentFollower = followerKnights[i];

            // Calculate the direction from the current follower to the previous follower
            const directionX = prevFollower.x - currentFollower.x;
            const directionY = prevFollower.y - currentFollower.y;

            // Normalize the direction and calculate the desired distance based on sprite size and scale
            const distance = Phaser.Math.Distance.Between(prevFollower.x, prevFollower.y, currentFollower.x, currentFollower.y);
            const desiredDistance = (prevFollower.width * prevFollower.scaleX) + (currentFollower.width * currentFollower.scaleX);

            // Adjust the velocity based on the difference between the desired distance and the current distance
            const normalizedDirectionX = directionX / distance;
            const normalizedDirectionY = directionY / distance;
            const followerSpeed = speed * 0.9; // Adjust the speed of the followerKnights (e.g., 0.9 for slightly slower speed)

            // Set the velocity of the current follower
            currentFollower.body.velocity.x = normalizedDirectionX * followerSpeed;
            currentFollower.body.velocity.y = normalizedDirectionY * followerSpeed;

            // Adjust the depth to maintain the order of sprites
            currentFollower.depth = goodKnight.depth;

            // Calculate the new position to maintain the desired distance
            const newX = prevFollower.x - (normalizedDirectionX * desiredDistance);
            const newY = prevFollower.y - (normalizedDirectionY * desiredDistance);

            // Set the new position for the current follower
            currentFollower.x = newX;
            currentFollower.y = newY;

            // Determine the absolute values of normalizedDirectionX and normalizedDirectionY
            const absNormalizedDirectionX = Math.abs(normalizedDirectionX);
            const absNormalizedDirectionY = Math.abs(normalizedDirectionY);

            // Update animation based on the direction of movement
            if (absNormalizedDirectionX > absNormalizedDirectionY) {
                if (normalizedDirectionX > 0) {
                    currentFollower.anims.play('walkLeft', true);
                    currentFollower.setFlipX(true); // flip
                } else if (normalizedDirectionX < 0) {
                    currentFollower.anims.play('walkLeft', true);
                    currentFollower.setFlipX(false); // reset flip
                }
            } else {
                if (normalizedDirectionY > 0) {
                    currentFollower.anims.play('walkDown', true);
                } else if (normalizedDirectionY < 0) {
                    currentFollower.anims.play('walkUp', true);
                }
            }

            // If there is no movement, stop the animation
            if (normalizedDirectionX === 0 && normalizedDirectionY === 0) {
                currentFollower.anims.stop();
            }

            prevFollower = currentFollower;
        }
    }
}

game.scene.start();
