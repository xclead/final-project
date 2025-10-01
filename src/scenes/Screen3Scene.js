import Phaser from "phaser"
export default class Screen3Scene extends Phaser.Scene {
	constructor(scene, x, y, texture, config) {
		super("screen3-scene")
    }
    init(data){
        this.cursor = undefined
        this.room3 = undefined
        this.player = undefined
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
		this.room = 3
		this.prevRoom = data.prevRoom
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
    	this.load.tilemapTiledJSON('screen3','images/tilemap/newScreen3.tmj')
        this.load.image('hitbox', 'images/hitbox.png')
		this.load.image("spike", "images/spike.png")
		this.load.image("marble16x16", "images/Tilemap/marble-packed-16x16.png")
		this.load.image('void','images/void.png' )
        this.load.image('transition', 'images/transition.png')
        this.load.image('crystal', 'images/dashCrystal.png')
        this.load.image('sidehitbox', 'images/sidehitbox.png')
    }
    create(){
		if(this.prevRoom > this.room) {
			this.player = this.physics.add.sprite(744, 280, "player").setScale(0.8).setFlipX(true)
		}else{
        this.player = this.physics.add.sprite(48, 448, "player").setScale(0.8)
		}
		this.spring = this.physics.add.sprite(184, 472, 'spring')
        this.dashCrystal = this.physics.add.sprite(600, 296, 'crystal')
        this.dashCrystal.body.setAllowGravity(false)
        this.dashCrystal.body.setMaxVelocity(0,0)
		this.spring.body.setAllowGravity(false)
		this.spring.body.setSize(14, 8)
		this.spring.body.setOffset(1, 8)
        this.player.setCollideWorldBounds(true)
        this.cursor = this.input.keyboard.createCursorKeys()
		this.x = this.input.keyboard.addKey('X')
		this.z = this.input.keyboard.addKey('Z', true, false)
		this.player.body.setMaxVelocityY(275) 
		this.player.body.setMaxVelocityX(150)
		this.room3 = this.make.tilemap({key: 'screen3'})
        const sidehitboxtileset = this.room3.addTilesetImage('sidehitbox', 'sidehitbox')
        const hitboxtileset = this.room3.addTilesetImage('hitbox', 'hitbox')
        const spiketileset = this.room3.addTilesetImage('spike', 'spike')
		const transitiontileset = this.room3.addTilesetImage('transition', 'transition')
        const voidtileset = this.room3.addTilesetImage('void', 'void')
        const blocktileset = this.room3.addTilesetImage('marble-packed-16x16', 'marble16x16')
        const killTilesets = [spiketileset, voidtileset]
        const hitboxtilesets = [hitboxtileset, sidehitboxtileset]
        let hitboxLayer = this.room3.createLayer('Hitboxes', hitboxtilesets, 1, 0).setVisible(false)
		let platformLayer = this.room3.createLayer('Platforms', blocktileset, 0, 0)
		let killLayer = this.room3.createLayer('Death', killTilesets, 0, 0)
		let transitionLayer = this.room3.createLayer('Transition', transitiontileset,0,0)
		let transitionRightlayer = this.room3.createLayer('TransitionRight', transitiontileset, 8, 0)
        let downhitboxLayer = this.room3.createLayer('DownHitboxes', hitboxtileset, 1, 4).setVisible(false)
        platformLayer.setCollisionByProperty({collides: true})
		hitboxLayer.setCollisionByProperty({collides: true})
		downhitboxLayer.setCollisionByProperty({collides: true})
		transitionLayer.setCollisionByProperty({collides: true})
		transitionRightlayer.setCollisionByProperty({collides: true})
		this.physics.add.collider(this.player, transitionLayer, this.switchSceneBackward, null, this)
		this.physics.add.collider(this.player, transitionRightlayer, this.switchSceneForward, null, this)
        this.physics.add.collider(this.player, hitboxLayer, this.death, null, this)
        this.physics.add.collider(this.player, downhitboxLayer, this.death2, null, this)
		this.physics.add.collider(this.player, platformLayer)
        this.physics.add.collider(this.player, platformLayer, this.resetDash, null, this)
		this.physics.add.collider(this.player, platformLayer, this.climb, null, this)
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
        this.physics.world.createDebugGraphic()
        this.velocityText = this.add.text(10, 10, '', { fontSize: '16px', color: '#fff' })
        this.physics.add.overlap(this.player, this.spring, this.bounce, null, this)
        this.physics.add.overlap(this.player, this.dashCrystal, this.restoreDash, null, this)


    }
    update(){
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
		this.velocityText.setText(`VelocityX: ${this.player.body.velocity.x.toFixed(2)}\nVelocityY: ${this.player.body.velocity.y.toFixed(2)}`)
		if(!this.z.isDown && !this.dashing){
			this.player.body.setAllowGravity(true)
			this.player.body.setMaxVelocityX(150)
			this.climbing = false
		}
	if(!this.climbing && this.player.body.touching.left || !this.climbing && this.player.body.blocked.left){
		// this.player.setVelocityX(-0.0001)
		this.canClimb = true
	}
	if(!this.climbing && this.player.body.touching.right || !this.climbing && this.player.body.blocked.right){
		// this.player.setVelocityX(0.0001)
		this.canClimb = true
	}
	if(!this.player.body.touching.left && !this.z.isDown || !this.player.body.touching.right && !this.z.isDown || !this.player.body.blocked.left && !this.z.isDown || !this.player.body.blocked.right && !this.z.isDown){
		this.canClimb = false
	}
	if(this.canClimb) this.climb()
	this.resetDash()
    }
    playerMovement() {
		if(this.climbing || this.dashing || this.dying) return
		var standing = this.player.body.touching.down||this.player.body.blocked.down
		var velocityY = this.player.body.velocity.y
		var velocityX = this.player.body.velocity.x
		if(!this.cursor.down.isDown && !this.dashing){
			this.player.body.setMaxVelocityY(275) 
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
		if (this.cursor.space.isDown && !this.jumping && standing) {
            this.player.setVelocityY(this.jumpVelocity)
            this.jumping = true
			this.player.anims.play('jump', true)
        }
		if(velocityY > 20){
			this.player.anims.play('fall', true)
		}
		if(velocityY < 0){
			this.player.anims.play('jump', true)
		}
		if (this.cursor.space.isUp) {
            if (standing) {
                this.jumping = false;
            }
		}	
	}
    bounce(player,spring){
		spring.anims.play('boing', true)
		player.setVelocityY(-this.acceleration*1.25)
		this.dashUsed = false
	}
    dash() {
		if (this.dashing || this.dashUsed) return
		this.dashing = true
		let dashX = 0
		let dashY = 0
        if(this.cursor.up.isDown) {
            dashY = -1
            dashX = 0
			this.player.body.setMaxVelocityY(300)
			this.player.body.setMaxVelocityX(0)
			console.log('up')
			console.log(this.player.body.maxVelocity)
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
	restoreDash(player, dashCrystal){
		if(!this.dashUsed) return
		console.log('restore')
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
		if (this.player.body.blocked.down ||this.player.body.touching.down) {
			this.time.addEvent({
				delay: 100, 
				callback: () => {
					this.dashUsed = false
				},
				callbackScope: this
			})
		}
	}
    climb(){
		var velocityY = this.player.body.velocity.y
		var velocityX = this.player.body.velocity.x
		this.climbing = true
	
		if(this.z.isDown){
			// if(!this.player.body.touching.right || !this.player.body.touching.left) return
			if(this.cursor.up.isDown){
				this.player.body.setAllowGravity(false)
				this.player.setVelocityY(-75)
				this.player.setAccelerationY(0)
				
				
			}else if(this.cursor.down.isDown){
				this.player.body.setAllowGravity(false)
				this.player.setVelocityY(75)
				this.player.setAccelerationY(0)
			} else if(!this.cursor.up.isDown && !this.cursor.down.isDown &&!this.cursor.space.isDown){
				this.player.body.setAllowGravity(false)
				this.player.setVelocityY(0)
				this.player.setAccelerationY(0)
			} 
		}
		if(!this.z.isDown) this.climbing = false
		
	}
	walljump(){
		if(this.jumping){
			if(this.player.body.touching.left || this.player.body.touching.right){
				this.jumping = false
			}
		}
		// this.jumping = false
		if(this.cursor.space.isDown && !this.jumping && this.climbing){
			if(this.cursor.right.isDown){
				this.player.setVelocityX(this.acceleration*4)
			}
			if(this.cursor.left.isDown){
				this.player.setVelocityX(-this.acceleration*4)
			}
			this.player.setVelocityY(this.jumpVelocity)
				this.jumping = true
				this.player.anims.play('jump', true)
				this.player.body.setAllowGravity(true)
				// if(this.player.body.velocity.y = -10){
				// 	this.jumping = false
				// 	this.player.body.setAllowGravity(false)
				// }
				this.time.addEvent({
					delay: 300,
					callback: () => {
						this.jumping = false
						this.player.body.setAllowGravity(false)
					}
				})
		}
	}
	death(player, hitboxLayer){
		if(this.dying) return
		this.dying = true
		this.player.setAcceleration(0,0)
		this.player.setVelocity(0, 0)
		this.player.setDamping(true)
		this.player.setDrag(0.8, 0.7)
		player.body.setAllowGravity(false)
		player.setActive(false)
		if(player.body.velocity.x > 0){
			player.setVelocity(-50, -50)
			console.log("left")
		}
		player.anims.play('crouch', true)
		if(this.prevRoom > this.room) {
			this.time.addEvent({
			delay: 1500,
			callback: () => {
				player.setPosition(744, 280)
				player.setDamping(false)
				player.setDrag(1, 1)
				player.body.setAllowGravity(true)
				player.setActive(true)
				this.dying = false
			},
			callbackScope: this
		})
	}else{
		this.time.addEvent({
			delay: 1500,
			callback: () => {
				player.setPosition(48, 448)
				player.setDamping(false)
				player.setDrag(1, 1)
				player.body.setAllowGravity(true)
				player.setActive(true)
				this.dying = false
			},
			callbackScope: this
		})
	}
	}
    death2(player, downhitboxLayer){
		if(this.dying) return
		this.dying = true
		this.player.setAcceleration(0,0)
		this.player.setVelocity(0, 0)
		this.player.setDamping(true)
		this.player.setDrag(0.8, 0.7)
		player.body.setAllowGravity(false)
		player.setActive(false)
		if(player.body.velocity.x > 0){
			player.setVelocity(-50, -50)
			console.log("left")
		}
		player.anims.play('crouch', true)
		if(this.prevRoom > this.room) {
			this.time.addEvent({
			delay: 1500,
			callback: () => {
				player.setPosition(744, 280)
				player.setDamping(false)
				player.setDrag(1, 1)
				player.body.setAllowGravity(true)
				player.setActive(true)
				this.dying = false
			},
			callbackScope: this
		})
	}else{
		this.time.addEvent({
			delay: 1500,
			callback: () => {
				player.setPosition(48, 448)
				player.setDamping(false)
				player.setDrag(1, 1)
				player.body.setAllowGravity(true)
				player.setActive(true)
				this.dying = false
			},
			callbackScope: this
		})
	}
	}
	switchSceneForward(){
		this.prevRoom = this.room
		this.scene.start("screen4-scene", {prevRoom: this.prevRoom})
		this.scene.sleep("screen3-scene")
	}
    switchSceneBackward(){
		this.prevRoom = this.room
        this.scene.start("screen2-scene", {prevRoom: this.prevRoom})
        this.scene.sleep("screen3-scene")
    }
}