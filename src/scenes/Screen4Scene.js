import Phaser from "phaser"
export default class Screen4Scene extends Phaser.Scene {
	constructor(scene, x, y, texture, config) {
		super("screen4-scene")
    }
    init(data){
        this.cursor = undefined
        this.room4 = undefined
        this.player = undefined
		this.coin = undefined
        this.acceleration = 175
		this.jumpVelocity = -200
		this.jumping = false
        this.x = undefined
		this.xPressed = false
		this.dashUsed = false
		this.dashing = false
		this.leftPressed = false
		this.rightPressed = false
        this.climbing = false
		this.canClimb = false
        this.dying = false
		this.room = 4
		this.breakable4 = undefined
		this.breakable41 = undefined
		this.breakable42 = undefined
		this.checkpoint41 = undefined
		this.checkpoint42 = undefined
		this.checkpoint43 = undefined
		this.spawnpointX = undefined
		this.spawnpointY = undefined
		this.deathCount = data.deathCount || 0
		this.prevRoom = data.prevRoom
		this.collectedCoins = data.collectedCoins || 0
		this.collected1 = data.collected1
		this.collected2 = data.collected2
		this.collected3 = data.collected3
		this.collected4 = data.collected4
		this.collected5 = data.collected5
		this.blockBroken1 = data.blockBroken1
		this.blockBroken2 = data.blockBroken2
		this.blockBroken3 = data.blockBroken3
		this.blockBroken4 = data.blockBroken4
		this.blockBroken5 = data.blockBroken5
    }
    preload() {
        this.load.spritesheet('player', 'images/adventurer-sheet-new.png', {
			frameWidth: 20,
			frameHeight: 30
		})
		this.load.spritesheet('idle', 'images/adventurer-sheet-idle.png', {
			frameWidth: 21,
			frameHeight: 30
		})
		this.load.spritesheet('run', 'images/adventurer-sheet-run.png', {
			frameWidth: 26,
			frameHeight: 28
		})
		this.load.spritesheet('crouch', 'images/adventurer-sheet-crouch.png', {
			frameWidth: 20,
			frameHeight: 22
		})
		this.load.spritesheet('jump', 'images/adventurer-sheet-jump.png', {
			frameWidth: 21,
			frameHeight: 27
		})
		this.load.spritesheet("fall", "images/adventurer-sheet-fall.png", {
			frameWidth: 17,
			frameHeight: 29,
		})
        this.load.spritesheet('spring', 'images/spring.png', {
			frameWidth: 16,
			frameHeight: 16	
		})
		this.load.spritesheet('respawn', 'images/adventurer-sheet-respawn.png', {
			frameWidth: 22,
			frameHeight: 30
		})
		this.load.spritesheet("death", "images/adventurer-sheet-death.png", {
			frameWidth: 22,
			frameHeight: 32,
		})
		this.load.spritesheet("climb", "images/adventurer-scrappedClimb.png",{
			frameWidth: 22,
			frameHeight: 32
		})
		this.load.spritesheet("coin", "images/coin3_16x16.png", {
			frameWidth: 16,
			frameHeight: 16,
		})
		this.load.spritesheet("ghostCoin", "images/ghostCoin.png", {
			frameWidth: 16,
			frameHeight: 16,
		})
    	this.load.tilemapTiledJSON('screen4','images/tilemap/newScreen4.tmj')
        this.load.image('hitbox', 'images/hitbox.png')
		this.load.image("spike", "images/spike.png")
		this.load.image("marble16x16", "images/Tilemap/marble-packed-16x16.png")
        this.load.image('transition', 'images/transition.png')
        this.load.image('crystal', 'images/dashCrystal.png')
        this.load.image('sidehitbox', 'images/sidehitbox.png')
		this.load.image('breakable4', 'images/breakableBlock4.png')
		this.load.image('breakable4.1', 'images/breakableBlock4.1.png')
		this.load.image('breakable4.2', 'images/breakableBlock4.2.png')
		this.load.image("background", "images/background.png")
    }
    create(){
		this.add.image(400, 296, "background").setAlpha(0.2)
		if(this.prevRoom > this.room){
			this.player = this.physics.add.sprite(760, 484, "player").setScale(0.8)
		} else {
			this.player = this.physics.add.sprite(40, 68, "player").setScale(0.8)
		}
		this.checkpoint41 = this.add.rectangle(48, 48, 96, 64)
		this.physics.add.existing(this.checkpoint41, true)
		this.checkpoint42 = this.add.rectangle(264, 80, 16, 64)
		this.physics.add.existing(this.checkpoint42, true)
		this.checkpoint43 = this.add.rectangle(760, 440	, 80, 112)
		this.physics.add.existing(this.checkpoint43, true)
		if(this.collected4){
			this.coin = this.physics.add.sprite(600, 208, 'ghostCoin')
		} else {
			this.coin = this.physics.add.sprite(600, 208, 'coin')
		}
		this.coin.body.setAllowGravity(false)
        this.spring = this.physics.add.sprite(168, 456, 'spring')
		this.spring2 = this.physics.add.sprite(168, 200, 'spring')
		this.spring3 = this.physics.add.sprite(424, 312, 'spring')
		this.spring4 = this.physics.add.sprite(392, 120, 'spring')
		this.spring5 = this.physics.add.sprite(472, 120, 'spring')
		this.spring6 = this.physics.add.sprite(584, 120, 'spring')
		this.spring7 = this.physics.add.sprite(584, 472, 'spring')
		this.spring8 = this.physics.add.sprite(680, 232, 'spring')
		this.spring9 = this.physics.add.sprite(392, 472, 'spring')
        this.dashCrystal = this.physics.add.sprite(295, 200, 'crystal')
		this.dashCrystal2 = this.physics.add.sprite(295, 312, 'crystal')
		this.dashCrystal3 = this.physics.add.sprite(295, 440, 'crystal')
		this.dashCrystal5 = this.physics.add.sprite(487, 440, 'crystal')
		this.dashCrystal7 = this.physics.add.sprite(679, 440, 'crystal')
        this.dashCrystal.body.setAllowGravity(false)
        this.dashCrystal.body.setMaxVelocity(0,0)
		this.dashCrystal2.body.setAllowGravity(false)
		this.dashCrystal2.body.setMaxVelocity(0,0)
		this.dashCrystal3.body.setAllowGravity(false)
		this.dashCrystal3.body.setMaxVelocity(0,0)
		this.dashCrystal5.body.setAllowGravity(false)
		this.dashCrystal5.body.setMaxVelocity(0,0)
		this.dashCrystal7.body.setAllowGravity(false)
		this.dashCrystal7.body.setMaxVelocity(0,0)
		this.spring.body.setAllowGravity(false)
		this.spring.body.setSize(14, 8)
		this.spring.body.setOffset(1, 8)
		this.spring2.body.setAllowGravity(false)
		this.spring2.body.setSize(14, 8)
		this.spring2.body.setOffset(1, 8)
		this.spring3.body.setAllowGravity(false)
		this.spring3.body.setSize(14, 8)
		this.spring3.body.setOffset(1, 8)
		this.spring4.body.setAllowGravity(false)
		this.spring4.body.setSize(14, 8)
		this.spring4.body.setOffset(1, 8)
		this.spring5.body.setAllowGravity(false)
		this.spring5.body.setSize(14, 8)
		this.spring5.body.setOffset(1, 8)
		this.spring6.body.setAllowGravity(false)
		this.spring6.body.setSize(14, 8)
		this.spring6.body.setOffset(1, 8)
		this.spring7.body.setAllowGravity(false)
		this.spring7.body.setSize(14, 8)
		this.spring7.body.setOffset(1, 8)
		this.spring8.body.setAllowGravity(false)
		this.spring8.body.setSize(14, 8)
		this.spring8.body.setOffset(1, 8)
		this.spring9.body.setAllowGravity(false)
		this.spring9.body.setSize(14, 8)
		this.spring9.body.setOffset(1, 8)
        this.player.setCollideWorldBounds(true)
        this.cursor = this.input.keyboard.createCursorKeys()
		this.x = this.input.keyboard.addKey('X')
		this.z = this.input.keyboard.addKey('Z', true, false)
		this.player.body.setMaxVelocityY(250) 
		this.player.body.setMaxVelocityX(150)
		this.room4 = this.make.tilemap({key: 'screen4'})
        const hitboxtileset = this.room4.addTilesetImage('hitbox', 'hitbox')
        const spiketileset = this.room4.addTilesetImage('spike', 'spike')
		const transitiontileset = this.room4.addTilesetImage('transition', 'transition')
		const transitionRighttileset = this.room4.addTilesetImage('transition', 'transition')
        const blocktileset = this.room4.addTilesetImage('marble-packed-16x16', 'marble16x16')
        let hitboxLayer = this.room4.createLayer('Hitboxes', hitboxtileset, 1, 0).setVisible(false)
		let platformLayer = this.room4.createLayer('Platforms', blocktileset, 0, 0)
		let killLayer = this.room4.createLayer('Death', spiketileset, 0, 0)
		let transitionLayer = this.room4.createLayer('Transition', transitiontileset,0,0)
		let transitionRightLayer = this.room4.createLayer('TransitionRight', transitionRighttileset,8,0)
        let downhitboxLayer = this.room4.createLayer('DownHitboxes', hitboxtileset, 1, 4).setVisible(false)
        platformLayer.setCollisionByProperty({collides: true})
		hitboxLayer.setCollisionByProperty({collides: true})
		downhitboxLayer.setCollisionByProperty({collides: true})
		transitionLayer.setCollisionByProperty({collides: true})
		transitionRightLayer.setCollisionByProperty({collides: true})
        this.physics.add.collider(this.player, hitboxLayer, this.death, null, this)
        this.physics.add.collider(this.player, downhitboxLayer, this.death2, null, this)
		this.physics.add.collider(this.player, platformLayer)
        this.physics.add.collider(this.player, platformLayer, this.resetDash, null, this)
		this.physics.add.collider(this.player, platformLayer, this.climb, null, this)
		this.breakable42 = this.physics.add.staticSprite(520, 208, 'breakable4.2')
		if(!this.blockBroken4){
		this.breakable4 = this.physics.add.staticSprite(376, 80, 'breakable4')
		this.breakable41 = this.physics.add.staticSprite(624, 132, 'breakable4.1')
		}
		this.physics.add.collider(this.player, this.breakable4, this.breakBlock, null, this)
		this.physics.add.collider(this.player, this.breakable42, this.breakBlock2, null, this)
        this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNumbers("idle", {start: 0, end: 3}),
			frameRate: 3,
			repeat: -1
		})
		this.anims.create({
			key: "crouch",
			frames: this.anims.generateFrameNumbers("crouch", {start: 0, end: 3}),
			frameRate: 4,
			repeat: -1
		})
		this.anims.create({
			key: "run",
			frames: this.anims.generateFrameNumbers("run",{start: 0, end: 5}),
			frameRate: 6,
			repeat: -1
		})
		this.anims.create({
			key: "fall",
			frames: this.anims.generateFrameNumbers("fall", {start:0, end: 1}),
			frameRate:2,
			repeat: 0
		})
		this.anims.create({
			key: "jump",
			frames: this.anims.generateFrameNumbers('jump', {start:0, end: 1}),
			frameRate:4,
			repeat: 0
		})
		this.anims.create({
			key: "respawn",
			frames: this.anims.generateFrameNumbers("respawn", {start:0, end:11}),
			frameRate:10,
			repeat: 0
		})
		this.anims.create({
			key: "death",
			frames: this.anims.generateFrameNumbers("death", {start: 0, end: 14}),
			frameRate: 15,
			repeat: 0
		})
		this.anims.create({
			key: "climb",
			frames: this.anims.generateFrameNumbers("climb", {start: 0, end: 1}),
			frameRate: 1,
			repeat: 0
		})
		this.anims.create({
			key: "spin",
			frames: this.anims.generateFrameNumbers("coin", {start: 0, end: 13}),
			frameRate: 14,
			repeat: 0
		})
		this.anims.create({
			key: "spinGhost",
			frames: this.anims.generateFrameNumbers("ghostCoin", {start: 0, end: 13}),
			frameRate: 14,
			repeat: 0
		})
		this.time.addEvent({
			delay: 2000,
			callback: this.animateCoin,
			args: [this.coin],
			callbackScope: this,
			loop: true
		})
		this.physics.add.overlap(this.player, this.checkpoint41, this.checkpoint, null, this)
		this.physics.add.overlap(this.player, this.checkpoint42, this.checkpoint2, null, this)
		this.physics.add.overlap(this.player, this.checkpoint43, this.checkpoint3, null, this)
		this.physics.add.overlap(this.player, this.coin, this.collectCoin, null, this)
        // this.physics.world.createDebugGraphic()
        this.velocityText = this.add.text(10, 10, '', { fontSize: '16px', color: '#fff' })
		this.physics.add.collider(this.player, transitionLayer, this.switchSceneBackward, null, this)
		this.physics.add.collider(this.player, transitionRightLayer, this.switchSceneForward, null, this)
        this.physics.add.overlap(this.player, this.spring, this.bounce, null, this)
		this.physics.add.overlap(this.player, this.spring2, this.bounce2, null, this)
		this.physics.add.overlap(this.player, this.spring3, this.bounce3, null, this)
		this.physics.add.overlap(this.player, this.spring4, this.bounce4, null, this)
		this.physics.add.overlap(this.player, this.spring5, this.bounce5, null, this)
		this.physics.add.overlap(this.player, this.spring6, this.bounce6, null, this)
		this.physics.add.overlap(this.player, this.spring7, this.bounce7, null, this)
		this.physics.add.overlap(this.player, this.spring8, this.bounce8, null, this)
		this.physics.add.overlap(this.player, this.spring9, this.bounce9, null, this)
        this.physics.add.overlap(this.player, this.dashCrystal, this.restoreDash, null, this)
        this.physics.add.overlap(this.player, this.dashCrystal2, this.restoreDash2, null, this)
	    this.physics.add.overlap(this.player, this.dashCrystal3, this.restoreDash3, null, this)
		this.physics.add.overlap(this.player, this.dashCrystal5, this.restoreDash5, null, this)
		this.physics.add.overlap(this.player, this.dashCrystal7, this.restoreDash7, null, this)
    }
    update(){
		if(this.cursor.down.isDown && !this.downPressed) {
			this.upPressed = false
			this.downPressed = true
		}
		if(this.cursor.up.isDown && !this.upPressed) {
			this.upPressed = true
			this.downPressed = false
		}
        if(this.cursor.left.isDown && !this.leftPressed) {
			this.leftPressed = true
			this.rightPressed = false
		}
		if(this.cursor.right.isDown && !this.rightPressed) {
			this.leftPressed = false
			this.rightPressed = true
		}
		if(this.x.isDown  && !this.dashUsed){
			this.xPressed = true
		}
		if(this.xPressed){
			this.dash()
		}
        this.playerMovement()
		this.walljump()
		this.velocityText.setText(`Room ${this.room}`)
		if(!this.z.isDown && !this.dashing && !this.dying){
			this.player.body.setAllowGravity(true)
			this.player.body.setMaxVelocityX(150)
			this.climbing = false
		}
		if(!this.climbing && this.player.body.blocked.left){
			// this.player.setVelocityX(-0.0001)
			this.canClimb = true
		}
		if(!this.climbing && this.player.body.blocked.right){
			// this.player.setVelocityX(0.0001)
			this.canClimb = true
		}
		if((!this.player.body.blocked.left && !this.player.body.blocked.right) && !this.z.isDown && !this.wasBlocked){
			this.canClimb = false
		}
		if(this.canClimb) this.climb()
		this.resetDash()
		if(this.player.body.blocked.right) this.wasBlockedCheckerRight()
		if(this.player.body.blocked.left) this.wasBlockedCheckerLeft()
		if(this.cursor.right.isDown || this.player.body.velocity.x > 0|| this.cursor.left.isDown || this.player.body.velocity.x < 0){
			this.wasBlocked = false
			this.wasBlockedLeft = false
			this.wasBlockedRight = false
		}
		if(this.dying) this.player.body.setAllowGravity(false)
    }
    playerMovement() {
		if(this.climbing || this.dashing || this.dying || this.slide) return
		var standing = this.player.body.blocked.down
		var velocityY = this.player.body.velocity.y
		var velocityX = this.player.body.velocity.x
		var d = new Date()
		var time = d.getTime()
		if(!this.cursor.down.isDown && !this.dashing){
			this.player.body.setMaxVelocityY(200) 
			this.player.body.setMaxVelocityX(150)
		}
		if(this.cursor.down.isDown && standing) {
			this.player.anims.play('crouch', true)
			this.player.body.setMaxVelocityY(0) 
			this.player.body.setMaxVelocityX(0)
			this.player.setVelocityX(0)
			if(this.cursor.left.isDown) {
			this.player.setFlipX(true)
			} else if( this.cursor.right.isDown){
				this.player.setFlipX(false)
			}
		} else{
		}
		if (this.cursor.left.isDown) {
			if(this.cursor.down.isDown || this.climbing){
				return
			}
			if(standing){
				this.player.setAccelerationX(-this.acceleration*4)
				this.player.anims.play('run', true)
				this.player.setFlipX(true)
			}else {
				this.player.setAccelerationX(-this.acceleration * 4)
				this.player.anims.play('run', true)
				this.player.setFlipX(true)
			}
			
		} else if (this.cursor.right.isDown){
			if(this.cursor.down.isDown){
				return
			}
			if(standing){
				this.player.setAccelerationX(this.acceleration*4)
				this.player.anims.play('run', true)
				this.player.setFlipX(false)
			} else {
				this.player.setAccelerationX(this.acceleration*4)
				this.player.anims.play('run', true)
				this.player.setFlipX(false)
			}
		} else {
			if (
                Math.abs(this.player.body.velocity.x) < 15 &&
                Math.abs(this.player.body.velocity.x) > -15 && !this.climbing
            ) {
                this.player.setVelocityX(0);
                this.player.setAccelerationX(0);
            } else {
				this.player.setAccelerationX(
                    (this.player.body.velocity.x > 0 ? -1 : 1) * this.acceleration * 4
                );

			}
			if (!this.jumping && !this.cursor.down.isDown){
				this.player.anims.play('idle', true)
			}
		}
		if(velocityY > 20){
			this.player.anims.play('fall', true)
		}
		if(velocityY < 0){
			this.player.anims.play('jump', true)
		}
		
		if (!standing){
			this.coyoteTime = time + 100
		}
		if ((standing || time <= this.coyoteTime) && this.cursor.space.isDown && !this.jumping){
			this.player.setVelocityY(this.jumpVelocity)
			this.jumping = true
			this.player.anims.play('jump', true)
		}
		if (this.cursor.space.isUp) {
            if (standing) {
                this.jumping = false;
            }
		}	
		if(!standing) this.jumping = true
	}
    bounce(player,spring){
		spring.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
	bounce2(player,spring2){
		spring2.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
	bounce3(player,spring3){
		spring3.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
	bounce4(player,spring4){
		spring4.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
	bounce5(player,spring5){
		spring5.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
	bounce6(player,spring6){
		spring6.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
	bounce7(player,spring7){
		spring7.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
	bounce8(player,spring8){
		spring8.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
	bounce9(player,spring9){
		spring9.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
    dash() {
		if (this.dashing || this.dashUsed || this.dying) return
		this.dashing = true
		let dashX = 0
		let dashY = 0
        if(this.cursor.up.isDown) {
            dashY = -1
            dashX = 0
			this.player.body.setMaxVelocityY(300)
			this.player.body.setMaxVelocityX(0)
			// console.log('up')
			// console.log(this.player.body.maxVelocity)
        }
        if(this.cursor.down.isDown) {
            dashY = 1
            dashX = 0
			this.player.body.setMaxVelocityY(300)
			this.player.body.setMaxVelocityX(0)
        }
        if(this.cursor.left.isDown) {
            dashX = -1
            dashY = 0
			this.player.body.setMaxVelocityY(0)
			this.player.body.setMaxVelocityX(300)
        }
        if(this.cursor.right.isDown) {
            dashX = 1
            dashY = 0
			this.player.body.setMaxVelocityY(0)
			this.player.body.setMaxVelocityX(300)
        }
        if (this.cursor.left.isDown && this.cursor.up.isDown) {
            dashX = -1
            dashY = -1
			this.player.body.setMaxVelocityY(300)
			this.player.body.setMaxVelocityX(300)
        }
        if (this.cursor.right.isDown && this.cursor.up.isDown) {
            dashX = 1
            dashY = -1
			this.player.body.setMaxVelocityY(300)
			this.player.body.setMaxVelocityX(300)
        }
        if (this.cursor.left.isDown && this.cursor.down.isDown) {
            dashX = -1
            dashY = 1
			this.player.body.setMaxVelocityY(300)
			this.player.body.setMaxVelocityX(300)
        }
        if (this.cursor.right.isDown && this.cursor.down.isDown) {
            dashX = 1
            dashY = 1
			this.player.body.setMaxVelocityY(300)
			this.player.body.setMaxVelocityX(300)
        }
		if (!this.cursor.left.isDown && !this.cursor.right.isDown && !this.cursor.up.isDown && !this.cursor.down.isDown) {
		if(this.leftPressed) {
            dashX = -1
            dashY = 0
			this.player.body.setMaxVelocityY(0)
			this.player.body.setMaxVelocityX(300)
        }
		if (this.rightPressed) {
            dashX = 1
            dashY = 0
			this.player.body.setMaxVelocityY(0)
			this.player.body.setMaxVelocityX(300)
        }
		}
		if (dashX !== 0 && dashY !== 0) {
			dashX *= Math.SQRT1_2
			dashY *= Math.SQRT1_2
		}
		const DASH_SPEED = 750
		this.player.body.setAllowGravity(false)
		this.player.setVelocity(dashX * DASH_SPEED, dashY * DASH_SPEED)
		this.player.setDamping(true)
		this.player.setDrag(0.8, 0.8)
		this.player.setActive(false)
		this.time.addEvent({
			delay: 225, 
			callback: () => {
				this.dashing = false
				this.player.setDamping(false)
				this.player.setDrag(1, 1)
				this.player.setActive(true)
				this.player.body.setMaxVelocityY(75) 
				this.player.body.setMaxVelocityX(150)
				this.xPressed = false
			},
			callbackScope: this
		})
		this.time.addEvent({
			delay:1,
			callback: () => {
				this.dashUsed = true
			},
			callbackScope: this
		})
		this.time.addEvent({
			delay:250,
			callback: () => {
			this.player.body.setAllowGravity(true)
			},
			callbackScope: this
		})
	}
	restoreDash(player, dashCrystal){
		if(!this.dashUsed) return
		this.dashUsed = false
		dashCrystal.body.checkCollision.none = true
		dashCrystal.setActive(false)
		dashCrystal.setVisible(false)
		this.time.addEvent({
			delay: 3000,
			callback: () => {
				dashCrystal.body.checkCollision.none = false
				dashCrystal.setActive(true)
				dashCrystal.setVisible(true)
			},
			callbackScope: this
		})
	}
	restoreDash2(player, dashCrystal2){
		if(!this.dashUsed) return
		this.dashUsed = false
		dashCrystal2.body.checkCollision.none = true
		dashCrystal2.setActive(false)
		dashCrystal2.setVisible(false)
		this.time.addEvent({
			delay: 3000,
			callback: () => {
				dashCrystal2.body.checkCollision.none = false
				dashCrystal2.setActive(true)
				dashCrystal2.setVisible(true)
			},
			callbackScope: this
		})
	}
	restoreDash3(player, dashcrystal3){
		if(!this.dashUsed) return
		this.dashUsed = false
		dashcrystal3.body.checkCollision.none = true
		dashcrystal3.setActive(false)
		dashcrystal3.setVisible(false)
		this.time.addEvent({
			delay: 3000,
			callback: () => {
				dashcrystal3.body.checkCollision.none = false
				dashcrystal3.setActive(true)
				dashcrystal3.setVisible(true)
			},
			callbackScope: this
		})
	}
	restoreDash4(player, dashcrystal4){
		if(!this.dashUsed) return
		this.dashUsed = false
		dashcrystal4.body.checkCollision.none = true
		dashcrystal4.setActive(false)
		dashcrystal4.setVisible(false)
		this.time.addEvent({
			delay: 3000,
			callback: () => {
				dashcrystal4.body.checkCollision.none = false
				dashcrystal4.setActive(true)
				dashcrystal4.setVisible(true)
			},
			callbackScope: this
		})
	}
	restoreDash5(player, dashcrystal5){
		if(!this.dashUsed) return
		this.dashUsed = false
		dashcrystal5.body.checkCollision.none = true
		dashcrystal5.setActive(false)
		dashcrystal5.setVisible(false)
		this.time.addEvent({
			delay: 3000,
			callback: () => {
				dashcrystal5.body.checkCollision.none = false
				dashcrystal5.setActive(true)
				dashcrystal5.setVisible(true)
			},
			callbackScope: this
		})
	}
	restoreDash6(player, dashcrystal6){
		if(!this.dashUsed) return
		this.dashUsed = false
		dashcrystal6.body.checkCollision.none = true
		dashcrystal6.setActive(false)
		dashcrystal6.setVisible(false)
		this.time.addEvent({
			delay: 3000,
			callback: () => {
				dashcrystal6.body.checkCollision.none = false
				dashcrystal6.setActive(true)
				dashcrystal6.setVisible(true)
			},
			callbackScope: this
		})
	}
	restoreDash7(player, dashcrystal7){
		if(!this.dashUsed) return
		this.dashUsed = false
		dashcrystal7.body.checkCollision.none = true
		dashcrystal7.setActive(false)
		dashcrystal7.setVisible(false)
		this.time.addEvent({
			delay: 3000,
			callback: () => {
				dashcrystal7.body.checkCollision.none = false
				dashcrystal7.setActive(true)
				dashcrystal7.setVisible(true)
			},
			callbackScope: this
		})
	}
	resetDash() {
		if (this.player.body.blocked.down && this.dashUsed) {
			this.dashUsed = false
		}
	}
    climb(){
		if(this.dashing || this.dying) return
		if(!this.wasBlocked) this.wasBlocked = true
		if(!this.wasBlockedRight && this.player.body.blocked.right) this.wasBlockedRight = true
		if(!this.wasBlockedLeft && this.player.body.blocked.left) this.wasBlockedLeft = true
		if(this.jumping && (this.player.body.blocked.left || this.player.body.blocked.right)) this.jumping=false
		var velocityY = this.player.body.velocity.y
		var velocityX = this.player.body.velocity.x
		this.climbing = true
		if(this.z.isDown){
			this.player.body.setAllowGravity(false)
			this.player.anims.play('climb', false)
			if((velocityX > 10 || velocityX < -10)){
				this.player.body.setAllowGravity(true)
				this.climbing = false
				this.canClimb = false
				this.player.body.setMaxVelocity(150, 275)
				// console.log('stop')
				if(this.rightPressed && this.upPressed && this.wasBlockedRight|| this.cursor.right.isDown && this.cursor.up.isDown && this.wasBlockedRight){
					this.player.setPosition(this.player.x + 3, this.player.y)
				}
			}			
			if(this.cursor.up.isDown && this.climbing){
				this.player.body.setAllowGravity(false)
				this.player.setVelocityY(-75)
				this.player.setAccelerationY(0)
				
				
			}else if(this.cursor.down.isDown && this.climbing){
				this.player.body.setAllowGravity(false)
				this.player.setVelocityY(75)
				this.player.setAccelerationY(0)
			} else if(!this.cursor.up.isDown && !this.cursor.down.isDown &&!this.cursor.space.isDown && !this.jumping && this.climbing){
				this.player.body.setAllowGravity(false)
				this.player.setVelocityY(0)
				this.player.setAccelerationY(0)
			} 
			
		}
		if(!this.z.isDown) {
			this.climbing = false
		}
	}
	walljump(){
		if(this.allowGravity){
			if(this.wasBlocked){
				this.player.body.setAllowGravity(false)
				this.allowGravity = false
			}
			if(!this.wasBlocked || this.player.body.velocity.x > 0 || this.player.body.velocity.x < 0){
				this.player.body.setAllowGravity(true)
				this.allowGravity = false
			}
		}
		if(this.climbing){
			if(this.cursor.space.isDown && !this.jumping){
				if(this.cursor.right.isDown){
					this.climbing = false
					this.player.setVelocityY(this.jumpVelocity)
					this.player.setVelocityX(this.acceleration*4)
					this.jumping = true
					this.player.anims.play('jump', true)
					this.player.body.setAllowGravity(true)
					this.time.addEvent({
					delay: 200,
					callback: () => {
						// console.log('not')
						this.allowGravity = true
						}
					})
					return
				}
				if(this.cursor.left.isDown){
					this.climbing = false
					this.player.setVelocityY(this.jumpVelocity)
					this.player.setVelocityX(-this.acceleration*4)
					this.jumping = true
					this.player.anims.play('jump', true)
					this.player.body.setAllowGravity(true)
					this.time.addEvent({
					delay: 200,
					callback: () => {
						// console.log('not')
						this.allowGravity = true
						}
					})
					return
				}
			}
			if(this.player.body.velocity.y = 0){
					this.jumping = false
					this.player.body.setAllowGravity(false)
				}
		}
		if(this.player.body.blocked.down || !this.player.body.blocked.right && !this.cursor.right.isDown || !this.player.body.blocked.left && this.cursor.left.isDown || this.climbing){
			this.slide = false
		}
		if((this.player.body.blocked.left || this.player.body.blocked.right)){
			this.walljumping = false
		}
	}
	death(player, hitboxLayer){
		if(this.dying) return
		this.dying = true
		this.deathCount += 1
		this.player.setAcceleration(0,0)
		this.player.setVelocity(0, 0)
		this.player.setDamping(true)
		this.player.setDrag(0.8, 0.7)
		this.player.body.setAllowGravity(false)
		// player.setActive(false)
		// if(player.body.velocity.x > 0){
		// 	player.setVelocity(-50, -50)
		// 	console.log("left")
		// }
		player.anims.play('death', true)
			this.time.addEvent({
				delay: 1100,
				callback: () => {
					player.setPosition(this.spawnpointX, this.spawnpointY)
					player.setDamping(false)
					player.setDrag(1, 1)
					this.player.anims.play('respawn', true)
					this.dashing = false
				this.climbing = false
				this.wasBlocked = false
				this.wasBlockedLeft = false
				this.wasBlockedRight = false
				this.dashUsed = true
				},
				callbackScope: this
			})
			this.time.addEvent({
				delay: 2100,
				callback: () => {
				player.body.setAllowGravity(true)
				this.dying = false
				},
				callbackScope: this
			})
	}
    death2(player, downhitboxLayer){
		if(this.dying) return
		this.dying = true
		this.deathCount += 1
		this.player.setAcceleration(0,0)
		this.player.setVelocity(0, 0)
		this.player.setDamping(true)
		this.player.setDrag(0.8, 0.7)
		this.player.body.setAllowGravity(false)
		// player.setActive(false)
		// if(player.body.velocity.x > 0){
		// 	player.setVelocity(-50, -50)
		// 	console.log("left")
		// }
		player.anims.play('death', true)
			this.time.addEvent({
				delay: 1100,
				callback: () => {
					player.setPosition(this.spawnpointX, this.spawnpointY)
					player.setDamping(false)
					player.setDrag(1, 1)
					this.player.anims.play('respawn', true)
					this.dashing = false
				this.climbing = false
				this.wasBlocked = false
				this.wasBlockedLeft = false
				this.wasBlockedRight = false
				this.dashUsed = true
				},
				callbackScope: this
			})
			this.time.addEvent({
				delay: 2100,
				callback: () => {
				player.body.setAllowGravity(true)
				this.dying = false
				},
				callbackScope: this
			})
	}
	switchSceneForward(){
		this.prevRoom = this.room
		this.scene.start("screen5-scene", {
			prevRoom: this.prevRoom,
			collectedCoins: this.collectedCoins, 
			blockBroken1: this.blockBroken1,
			blockBroken2: this.blockBroken2,
			blockBroken3: this.blockBroken3,
			blockBroken4: this.blockBroken4,
			blockBroken5: this.blockBroken5, 
			collected1: this.collected1,
			collected2: this.collected2,
			collected3: this.collected3,
			collected4: this.collected4,
			collected5: this.collected5,
			deathCount: this.deathCount
		})
		this.scene.sleep("screen4-scene")
	}
	switchSceneBackward(){
		this.prevRoom = this.room
		this.scene.start("screen3-scene", {
			prevRoom: this.prevRoom,
			collectedCoins: this.collectedCoins, 
			blockBroken1: this.blockBroken1,
			blockBroken2: this.blockBroken2,
			blockBroken3: this.blockBroken3,
			blockBroken4: this.blockBroken4,
			blockBroken5: this.blockBroken5, 
			collected1: this.collected1,
			collected2: this.collected2,
			collected3: this.collected3,
			collected4: this.collected4,
			collected5: this.collected5,
			deathCount: this.deathCount
		})
		this.scene.sleep("screen4-scene")
	}
	wasBlockedCheckerRight(){
		// console.log('check')
		if(!this.cursor.right.isDown && !this.cursor.left.isDown){
			// console.log('right')
			this.wasBlockedRight = true
			this.wasBlocked = true
		}
	}
	wasBlockedCheckerLeft(){
		// console.log('check')
		if(!this.cursor.right.isDown && !this.cursor.left.isDown){
			// console.log('left')
			this.wasBlockedLeft = true
			this.wasBlocked = true
		}
	}
	collectCoin(player, coin){
		console.log(this.collectedCoins)
		if(this.collected4){
			this.coin.destroy(true)
		} else{
		console.log(this.collectedCoins)
		this.collectedCoins +=1
		this.coin.destroy(true)
		this.collected4 = true
		}
	}
	animateCoin(coin){
		if(coin && coin.active){
			if(this.collected4){
				coin.anims.play("spinGhost", true)
			} else{
			coin.anims.play("spin", true)
			}
		}
	}
	breakBlock(){
		if(this.player.body.touching.right && this.dashing && this.breakable4.body.touching.left){
			this.blockBroken4 = true
			console.log('break')
			this.breakable4.destroy(true)
			this.breakable41.destroy(true)
			this.player.setVelocity(-75, -75)
		}
	}
	breakBlock2(){
		if(this.player.body.touching.left && this.dashing && this.breakable42.body.touching.right){
			console.log('break')
			this.breakable42.destroy(true)
			this.player.setVelocity(75, -75)
		}
	}
	checkpoint(){
		this.spawnpointX = 40
		this.spawnpointY = 68
	}
	checkpoint2(){
		this.spawnpointX = 264
		this.spawnpointY = 100
	}
	checkpoint3(){
		this.spawnpointX = 760
		this.spawnpointY = 484
	}
}