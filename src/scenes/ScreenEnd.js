import Phaser from "phaser"
export default class ScreenStartScene extends Phaser.Scene {
	constructor(scene, x, y, texture, config) {
		super("screenEnd-scene")
    }
    init(data){
        this.player = undefined
        this.cursor = undefined
        this.roomEnd = undefined
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
		this.start = undefined
        this.collectedCoins = data.collectedCoins || 0
		this.deathCount = data.deathCount
        this.winText = undefined
        this.coinText = undefined
		this.coin2Text = undefined
        this.deathText = undefined
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
    preload(){
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
        this.load.image("marble16x16", "images/Tilemap/marble-packed-16x16.png")
        this.load.tilemapTiledJSON("roomEnd", "images/Tilemap/endScreen.tmj")
        this.load.image('oneway2', 'images/oneway2.png')
		this.load.image("background", "images/background.png")
    }
    create(){
		this.add.image(400, 296, "background").setAlpha(0.2)
        this.player = this.physics.add.sprite(88, 552, "player").setScale(0.8)
        this.oneway = this.physics.add.staticSprite(88, 568, 'oneway2')
		this.start = this.add.rectangle(808, 88, 48, 48)
		this.physics.add.existing(this.start, true)
        this.physics.add.collider(this.player, this.oneway)
        this.player.setCollideWorldBounds(true)
		this.cursor = this.input.keyboard.createCursorKeys()
		this.x = this.input.keyboard.addKey('X')
		this.z = this.input.keyboard.addKey('Z', true, false)
		this.player.body.setMaxVelocityY(250) 
		this.player.body.setMaxVelocityX(150)
        this.roomEnd = this.make.tilemap({key: 'roomEnd'})
        const blocktileset = this.roomEnd.addTilesetImage('marble-packed-16x16', 'marble16x16')
        let platformLayer = this.roomEnd.createLayer('Platforms', blocktileset, 0, 0)
        platformLayer.setCollisionByProperty({collides: true})
        this.physics.add.collider(this.player, platformLayer)
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
			frameRate:12,
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
		this.winText = this.add.text(300, 150, 'You Won!', { fontSize: '60px', color: '#000000' })
		this.coinText = this.add.text(345, 225, 'Coins', { fontSize: '60px', color: '#000000' })
		this.coin2Text = this.add.text(230, 295, '', { fontSize: '60px', color: '#000000' })
		this.deathText = this.add.text(275, 370, 'Deaths: ' + this.deathCount, { fontSize: '60px', color: '#000000' })
		this.physics.add.overlap(this.player, this.start, this.switchScene, null, this)
        // this.physics.world.createDebugGraphic()
    }
    update(){
		this.coin2Text.setText('Collected: ' + this.collectedCoins)
        this.checkOneway(this.player, this.oneway)
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
			delay:100,
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
			if((!this.wasBlocked || this.player.body.velocity.x > 0 || this.player.body.velocity.x < 0) && !this.dying){
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
	checkOneway(player, oneway){
		if(player.y + 15 < oneway.y){
			console.log('true')
			this.oneway.body.checkCollision.none = false
		} else {
			console.log('false')
			this.oneway.body.checkCollision.none = true
		}
	}
	switchScene(){
		console.log('switch')
		this.scene.start("screenStart-scene",{
			blockBroken1:false,
			blockBroken2: false,
			blockBroken3: false,
			blockBroken4: false,
			blockBroken5: false, 
			collected1: false,
			collected2: false,
			collected3: false,
			collected4: false,
			collected5: false,
			collectedCoins: 0,
			deathCount: 0
		})
		this.scene.sleep("screenEnd-scene")
	}
}