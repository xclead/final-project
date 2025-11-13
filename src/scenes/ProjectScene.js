import Phaser, { Cameras, Tilemaps } from "phaser"
export default class ProjectScene extends Phaser.Scene {
	constructor(scene, x, y, texture, config) {
		super("Project-scene")
		
	}
	init(data) {
		this.cursor = undefined
		this.player = undefined
		this.spring = undefined
		this.acceleration = 175
		this.jumpVelocity = -200
		this.jumping = false
		this.wasStanding = false
		this.coyoteTime = 0
		this.oneway = undefined
		this.platforms = undefined
		this.coin = undefined
		this.dashCrystal = undefined
		this.x = undefined
		this.xPressed = false
		this.dashUsed = false
		this.dashing = false
		this.leftPressed = false
		this.rightPressed = false
		this.upPressed = false
		this.downPressed = false
		this.dashX = 0
		this.dashY = 0
		this.bouncing = false
		this.climbing = false
		this.canClimb = false
		this.room1 = undefined
		this.room2 = undefined
		this.room3 = undefined
		this.room4 = undefined
		this.room5 = undefined
		this.cam = undefined
		this.spring = undefined
		this.dying = false
		this.room = 1
		this.prevRoom = data.prevRoom
		this.walljumping = false
		this.slide = false
		this.wasBlockedRight = false
		this.wasBlockedLeft = false
		this.checkpoint11 = undefined
		this.checkpoint12 = undefined
		this.spawnpointX = undefined
		this.spawnpointY = undefined
		this.breakable = undefined
		this.deathCount = data.deathCount || 0
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
			frameWidth: 21,
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
		this.load.spritesheet("coin", "images/coin3_16x16.png", {
			frameWidth: 16,
			frameHeight: 16,
		})
		this.load.spritesheet("ghostCoin", "images/ghostCoin.png", {
			frameWidth: 16,
			frameHeight: 16,
		})
		this.load.spritesheet("respawn", "images/adventurer-sheet-respawn.png", {
			frameWidth: 22,
			frameHeight: 30,
		})
		this.load.spritesheet("death", "images/adventurer-sheet-death.png", {
			frameWidth: 22,
			frameHeight: 32,
		})
		this.load.image('hitbox', 'images/hitbox.png')
		this.load.image("spike", "images/spike.png")
		this.load.image('oneway', 'images/oneway.png')
		this.load.image("marble16x16", "images/Tilemap/marble-packed-16x16.png")
		this.load.image('void','images/void.png' )
		this.load.spritesheet('spring', 'images/spring.png', {
			frameWidth: 16,
			frameHeight: 16	
		})
		this.load.spritesheet('Springs', 'images/spring.png', {
			frameWidth: 16,
			frameHeight: 16
		})
		this.load.spritesheet('sidespring', 'images/sideways-spring.png', {
			frameWidth: 16,
			frameHeight: 16
		})
		this.load.spritesheet("climb", "images/adventurer-scrappedClimb.png",{
			frameWidth: 22,
			frameHeight: 32
		})
		this.load.image('crystal', 'images/dashCrystal.png')
		this.load.image('transition', 'images/transition.png')
		this.load.image('breakable', 'images/breakableBlock.png')
		this.load.tilemapTiledJSON('screen1','images/tilemap/newScreen1.tmj')
		this.load.tilemapTiledJSON('screen2','images/tilemap/newScreen2.tmj')
		this.load.tilemapTiledJSON('screen3','images/tilemap/newScreen3.tmj')
		this.load.tilemapTiledJSON('screen4','images/tilemap/newScreen4.tmj')
		this.load.tilemapTiledJSON('screen5','images/tilemap/newNewScreen5.tmj')
		this.load.image("background", "images/background.png")
	}
	create() {
		this.add.image(400, 296, "background").setAlpha(0.2)
		if(this.prevRoom > this.room){
			this.player = this.physics.add.sprite(664, 420, "player").setScale(0.8).setFlipX(true)
		}else{
		this.player = this.physics.add.sprite(32, 468, "player").setScale(0.8)
		}
		this.checkpoint11 = this.add.rectangle(72, 456, 144, 48)
		this.physics.add.existing(this.checkpoint11, true)
		this.checkpoint12 = this.add.rectangle(696, 408, 208, 48)
		this.physics.add.existing(this.checkpoint12, true)
		this.oneway = this.physics.add.staticSprite(496, 568, 'oneway').setFlipX(true)
		// this.player.body.setSize(24, 30)
		// this.climbhitbox = this.physics.add.sprite(this.player.x, this.player.y, 'player').setVisible(false)
		// this.climbhitbox.body.setAllowGravity(false)
		// this.climbhitbox.body.setSize(14, 2)
		// this.hitboxplayer = this.physics.add.sprite(0, 0, 'player').setScale(0.8).setVisible(false)
		// this.hitboxplayer.body.setAllowGravity(false)
		// this.hitboxplayer.body.setSize(14, 24)
		this.player.setCollideWorldBounds(true)
		if(this.collected1){
			this.coin = this.physics.add.sprite(392, 504, 'ghostCoin')
		} else {
			this.coin = this.physics.add.sprite(392, 504, 'coin')
		}
		this.coin.body.setAllowGravity(false)
		// this.spring = this.physics.add.sprite(152, 472, 'spring')
		// this.spring.body.setAllowGravity(false)
		// this.spring.body.setSize(16, 8)
		// this.spring.body.setOffset(0, 8)
		// this.sidespring = this.physics.add.sprite(800, 500, 'sidespring').setFlipX(true)
		// this.respawn = this.physics.add.sprite(300, 500, 'respawn')
		// this.dashCrystal.body.setAllowGravity(false)
		// this.respawn.body.setAllowGravity(false)
		// this.sidespring.body.setAllowGravity(false)
		// this.sidespring.setCollideWorldBounds(true)
		this.cursor = this.input.keyboard.createCursorKeys()
		this.x = this.input.keyboard.addKey('X')
		this.z = this.input.keyboard.addKey('Z', true, false)
		this.player.body.setMaxVelocityY(250) 
		this.player.body.setMaxVelocityX(150)
		this.room1 = this.make.tilemap({key: 'screen1'})
		// const springtileset = this.room3.addTilesetImage('spring', 'spring')
		const hitboxtileset = this.room1.addTilesetImage('hitbox', 'hitbox')
		const transitiontileset = this.room1.addTilesetImage('transition', 'transition')
		const blocktileset = this.room1.addTilesetImage('marble-packed-16x16', 'marble16x16')
		const voidtileset = this.room1.addTilesetImage('void', 'void')
		// const climbtileset = this.room1.addTilesetImage('marble-packed-16x16', 'marble16x16')
		// const onewaytileset = this.room2.addTilesetImage('oneway', 'oneway')
		const killTilesets = [ voidtileset]
		// let downhitboxLayer = this.room5.createLayer('DownHitboxes', hitboxtileset, 0, 4).setVisible(false)
		let hitboxLayer = this.room1.createLayer('Hitboxes', hitboxtileset, 1, 0).setVisible(false)
		let platformLayer = this.room1.createLayer('Platforms', blocktileset, 0, 0)
		let killLayer = this.room1.createLayer('Death', killTilesets, 0, 0)
		let transitionLayer = this.room1.createLayer('Transition', transitiontileset,8,0)
		// let climbLayer = this.room1.createLayer('Climbout', blocktileset, 0, 0)
		// let dashLayer = this.room1.createLayer('Crystal', crystal2tileset,0,0)
		// let springLayer = this.room3.createLayer('Springs', springtileset,0,0)
		platformLayer.setCollisionByProperty({collides: true})
		hitboxLayer.setCollisionByProperty({collides: true})
		transitionLayer.setCollisionByProperty({collides: true})
		// climbLayer.setCollisionByProperty({collides: true})
		this.physics.add.collider(this.player, transitionLayer, this.switchSceneForward, null, this)
		// downhitboxLayer.setCollisionByProperty({collides: true})
		this.physics.add.collider(this.player, hitboxLayer, this.death, null, this)
		// this.physics.add.collider(this.climbhitbox, climbLayer, this.stopClimb, null, this)
		this.physics.add.collider(this.player, platformLayer)
		// this.physics.add.collider(this.player, downhitboxLayer)
		if(!this.blockBroken1){
			this.breakable = this.physics.add.staticSprite(400, 504, 'breakable')
		}
		// this.breakable.body.setAllowGravity(false)
		this.physics.add.collider(this.player, this.breakable, this.breakBlock, null, this)
		this.anims.create({
			key: 'sideboing',
			frames: this.anims.generateFrameNumbers('sidespring', {start: 0, end: 10}),
			frameRate:13,
			repeat: 0
		})
		this.anims.create({
			key: 'boing',
			frames: this.anims.generateFrameNumbers('Springs', {start: 0, end: 10}),
			frameRate: 13,
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
			frames: this.anims.generateFrameNumbers("respawn", {start: 0, end: 11}),
			frameRate: 12,
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
		this.physics.add.collider(this.player, this.oneway)
		this.time.addEvent({
			delay: 2000,
			callback: this.animateCoin,
			args: [this.coin],
			callbackScope: this,
			loop: true
		})
		
		this.physics.add.overlap(this.player, this.coin, this.collectCoin, null, this)
		this.physics.add.overlap(this.player, this.checkpoint11, this.checkpoint, null, this)
		this.physics.add.overlap(this.player, this.checkpoint12, this.checkpoint2, null, this)
		this.physics.add.collider(this.player, this.dashCrystal, this.restoreDash, null, this)
		this.physics.add.overlap(this.player, this.spring, this.bounce, null, this)
		// this.physics.add.overlap(this.player,this.sidespring, this.sideBounce, null, this)
		this.velocityText = this.add.text(10, 10, '', { fontSize: '16px', color: '#fff' });
		// this.physics.world.createDebugGraphic()
		// this.physics.add.collider(this.player, springLayer,(player, tile) =>this.bounce(player, springLayer), null, this)
		this.physics.add.collider(this.player, platformLayer, this.resetDash, null, this)
		this.physics.add.collider(this.player, platformLayer, this.climb, null, this)
// 		this.spring.body.setSize(16, 8)
// this.spring.body.setOffset(0, 8)
		
	} 
	update() {
		// console.log(this.spawnpointX, this.spawnpointY)
		// this.player.body.setSize(28, 30)
		if(this.player.body.blocked.left){
			// console.log('l')
		}
		if(this.player.body.blocked.right){
			// console.log('r')
		}
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
		if(!this.z.isDown && !this.dashing && !this.bouncing && !this.slide && !this.dying){
			this.player.body.setAllowGravity(true)
			this.player.body.setMaxVelocityX(150)
			this.climbing = false
		}
		if(!this.climbing && this.player.body.blocked.left){
			// this.player.setVelocityX(-0.0001)
			this.canClimb = true
		}
		if(!this.climbing && this.player.body.blocked.right || !this.climbing && this.wasBlockedRight){
			// this.player.setVelocityX(0.0001)
			this.canClimb = true
		}
		if((!this.player.body.blocked.left && !this.player.body.blocked.right) && !this.z.isDown && !this.slide && !this.wasBlocked){
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
		this.checkOneway(this.player, this.oneway)
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
			// this.player.setOffset(0, 8)
			this.player.body.setMaxVelocityY(0) 
			this.player.body.setMaxVelocityX(0)
			this.player.setVelocityX(0)
			if(this.cursor.left.isDown) {
			this.player.setFlipX(true)
			} else if( this.cursor.right.isDown){
				this.player.setFlipX(false)
			}
		} else{
			// this.player.body.setOffset(0, 0)
		}
		if (this.cursor.left.isDown) {
			if(this.cursor.down.isDown || this.climbing){
				return
			}
			if(standing){
				this.player.setAccelerationX(-this.acceleration*4)
				this.player.anims.play('run', true)
				this.player.setFlipX(true)
			}else if(!this.climbing) {
				this.player.setAccelerationX(-this.acceleration * 4)
				// this.player.anims.play('fall', true)
				this.player.anims.play('run', true)
				this.player.setFlipX(true)
			}
			
		} else if (this.cursor.right.isDown){
			if(this.cursor.down.isDown || this.climbing){
				return
			}
			if(standing){
				this.player.setAccelerationX(this.acceleration*4)
				this.player.anims.play('run', true)
				this.player.setFlipX(false)
			} else if(!this.climbing) {
				this.player.setAccelerationX(this.acceleration*4)
				// this.player.anims.play('fall', true)
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
		// if (this.cursor.space.isDown && !this.jumping && standing) {
        //     this.player.setVelocityY(this.jumpVelocity)
        //     this.jumping = true
			// this.player.anims.play('jump', true)
        // }
		if(velocityY > 20 && !this.climbing){
			this.player.anims.play('fall', true)
		}
		if(velocityY < 0 && !this.climbing){
			this.player.anims.play('jump', true)
		}
		
		if (!standing){
			this.coyoteTime = time + 100
		}
		// if(this.coyoteTime >= time) console.log('something') 
		if ((standing || time <= this.coyoteTime) && this.cursor.space.isDown && !this.jumping){
			// console.log(this.coyoteTime, time)
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
	collectCoin(player, coin){
		console.log(this.collectedCoins)
		if(this.collected1){
			this.coin.destroy(true)
		} else{
		this.collectedCoins +=1
		console.log(this.collectedCoins)
		this.coin.destroy(true)
		this.collected1 = true
		}
	}
	checkOneway(player, oneway){
		if(player.y + 15 < oneway.y){
			// console.log('true')
			this.oneway.body.checkCollision.none = false
		} else {
			// console.log('false')
			this.oneway.body.checkCollision.none = true
		}
	}
	animateCoin(coin){
		if(coin && coin.active){
			if(this.collected1){
				coin.anims.play("spinGhost", true)
			} else{
			coin.anims.play("spin", true)
			}
		}
	}
	bounce(player,spring){
		spring.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
		
	}
	// sideBounce(player, sidespring){
	// 	this.sidespring.body.checkCollision.none = true
	// 	this.bouncing = true	
	// 	sidespring.anims.play('sideboing', true)
	// 	this.player.body.setMaxVelocityX(300)
	// 	player.setVelocity(-this.acceleration*10, -this.acceleration*0.75)
	// 	this.dashUsed = false
	// 	this.time.addEvent({
	// 		delay: 1000,
	// 		callback: () => {
	// 			this.player.body.setMaxVelocityX(150)
	// 			this.bouncing = false
	// 			this.sidespring.body.checkCollision.none = false
	// 		},
	// 		callbackScope: this
	// 	})
		
	// }
	dash() {
		if (this.dashing || this.dashUsed || this.dying) return
		this.climbing = false
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
		// this.dashUsed = true
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
	resetDash() {
		// console.log('p')
		if (this.dashUsed && this.player.body.blocked.down) {
			this.dashUsed = false
			// this.time.addEvent({
			// 	delay: 100, 
			// 	callback: () => {
			// 		this.dashUsed = false
			// 	},
			// 	callbackScope: this
			// })
		}
	}
	climb(){
		if(this.dashing || this.dying) return
		if(this.bouncing) return
		if(!this.wasBlocked) this.wasBlocked = true
		if(!this.wasBlockedRight && this.player.body.blocked.right) this.wasBlockedRight = true
		if(!this.wasBlockedLeft && this.player.body.blocked.left) this.wasBlockedLeft = true
		if(this.jumping && (this.player.body.blocked.left || this.player.body.blocked.right)) this.jumping=false
		var velocityY = this.player.body.velocity.y
		var velocityX = this.player.body.velocity.x
		this.climbing = true
		if(this.z.isDown){
			// console.log(this.slide, this.climbing)
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
			
			// if(!this.player.body.touching.right || !this.player.body.touching.left) return
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
			// console.log("a")
			if(this.cursor.space.isDown && !this.jumping){
				// console.log("b")
				
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
		this.deathCount +=1
		this.player.setAcceleration(0,0)
		this.player.setVelocity(0, 0)
		// this.player.setVelocity(0, 0)
		this.player.setDamping(true)
		this.player.setDrag(0.8, 0.7)
		this.player.body.setAllowGravity(false)
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
				player.body.setVelocity(0,0)
				player.body.setAllowGravity(true)
				this.dying = false
			},
			callbackScope: this
		})
	}
	switchSceneForward(){
		this.prevRoom = this.room
		this.scene.start("screen2-scene", {
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
		this.scene.sleep("Project-scene")
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
	// stopClimb(climbhitbox, climbLayer){
	// 	console.log(this.slide, this.climbing)
	// 	if(this.climbing || this.slide || this.wasBlocked){
	// 		this.climbing = false
	// 		this.slide = false
	// 		console.log("climb")
	// 		if(this.wasBlockedRight){
	// 			this.wasBlockedRight = false
	// 			this.wasBlocked = false
	// 			this.player.setPosition(this.player.x + 3, this.player.y)
	// 		}
	// 		if(this.wasBlockedLeft){
	// 			this.wasBlockedLeft = false
	// 			this.wasBlocked = false
	// 			this.player.setPosition(this.player.x - 3, this.player.y)
	// 		}
	// 	}
	// }
	breakBlock(){
		if(this.player.body.touching.left && this.dashing && this.breakable.body.touching.right){
			this.blockBroken1 = true
			console.log('break')
			this.breakable.destroy(true)
			this.player.setVelocity(75, -75)
		}
	}
	checkpoint(){
		this.spawnpointX = 32
		this.spawnpointY = 468
	}
	checkpoint2(){
		this.spawnpointX = 664
		this.spawnpointY = 420	
	}
}
