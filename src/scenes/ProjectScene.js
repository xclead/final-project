import Phaser from "phaser"
export default class ProjectScene extends Phaser.Scene {
	constructor(scene, x, y, texture, config) {
		super("Project-scene")
		
	}
	init() {
		this.cursor = undefined
		this.player = undefined
		this.acceleration = 175
		this.jumpVelocity = -150
		this.jumping = false
		this.wasStanding = false
		this.coyoteTime = 0
		this.coinsCollected = 0
		this.coinsCollectedText = undefined
		this.oneWay = undefined
		this.platforms = undefined
		this.coin = undefined

		
	}
	preload() {
		this.load.spritesheet("player", "images/adventurer-Sheet.png", {
			frameWidth: 50,
			frameHeight: 37,
		})
		this.load.spritesheet("coin", "images/coin3-18x18.png", {
			frameWidth: 18,
			frameHeight: 18,
		})
		this.load.image("spike", "images/spike.png")
		this.load.image("oneWay", "images/oneway.png")
		this.load.spritesheet("marbleBlocks", "images/Tilemap/marble_packed.png", {
			frameWidth: 18,
			frameHeight: 18,
		})
		this.load.spritesheet("rockBlocks", "images/Tilemap/rock_packed.png", {
			frameWidth: 18,
			frameHeight: 18,
		})
		this.load.spritesheet("sandBlocks", "images/Tilemap/sand_packed.png", {
			frameWidth: 18,
			frameHeight: 18,
		})
		this.load.spritesheet("stoneBlocks", "images/Tilemap/stone_packed.png", {
			frameWidth: 18,
			frameHeight: 18,
		})
		this.load.image('void','images/void.png' )
		this.load.spritesheet('spring', 'images/spring.png', {
			frameWidth: 18,
			frameHeight: 18
		})
	}
	create() {
		this.player = this.physics.add.sprite(100, 450, "player").setScale(0.8)
		this.coin = this.physics.add.sprite(200, 100, 'coin')
		this.spring = this.physics.add.sprite(300, 100, 'spring')
		this.coin.setCollideWorldBounds(true)
		this.spring.setCollideWorldBounds(true)
		this.player.setCollideWorldBounds(true)
		this.cursor = this.input.keyboard.createCursorKeys()
		this.player.body.setMaxVelocityY(250) 
		this.player.body.setMaxVelocityX(150)
		this.load.tilemapTiledJSON
		this.anims.create({
			key: 'boing',
			frames: this.anims.generateFrameNumbers('spring', {start: 0, end: 12}),
			frameRate: 12,
			repeat: 0

		})
		this.anims.create({
			key: "spin",
			frames: this.anims.generateFrameNumbers("coin", {start: 0, end: 13}),
			frameRate: 14,
			repeat: 0
		})
		this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNumbers("player", {start: 0, end: 3}),
			frameRate: 3,
			repeat: -1
		})
		this.anims.create({
			key: "crouch",
			frames: this.anims.generateFrameNumbers("player", {start: 4, end: 7}),
			frameRate: 4,
			repeat: -1
		})
		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("player",{start: 8, end: 13}),
			frameRate: 6,
			repeat: -1
		})
		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("player", {start: 8, end: 13}),
			frameRate: 6,
			repeat: -1
		})
		this.anims.create({
			key: "fall",
			frames: this.anims.generateFrameNumbers("player", {start:22, end: 23}),
			frameRate:2,
			repeat: 0
		})
		this.anims.create({
			key: "jump",
			frames: this.anims.generateFrameNumbers('player', {start:16, end: 17}),
			frameRate:4,
			repeat: 0
		})
		// this.physics.add.collider(this.player, this.oneWay, null, this.checkOneWay, this)
		this.time.addEvent({
			delay: 2000,
			callback: this.animateCoin,
			args: [this.coin],
			callbackScope: this,
			loop: true
		})
		// this.physics.add.overlap(this.player, this.coin, this.collectCoin, null, this)
		this.physics.add.overlap(this.player, this.spring, this.Bounce, null, this)
	}
	update() {
		
		
		this.playerMovement()
		
	}
	playerMovement() {
		var standing = this.player.body.touching.down
		var velocityY = this.player.body.velocity.y
		var d = new Date()
		var time = d.getTime()
		if (this.cursor.left.isDown) {
			if(standing){
				this.player.setAccelerationX(-this.acceleration*4)
				this.player.anims.play('left', true)
				this.player.setFlipX(true)
			}else {
				this.player.setAccelerationX(-this.acceleration * 4)
				// this.player.anims.play('fall', true)
				this.player.anims.play('left', true)
				this.player.setFlipX(true)
			}
			
		} else if (this.cursor.right.isDown){
			if(standing){
				this.player.setAccelerationX(this.acceleration*4)
				this.player.anims.play('right', true)
				this.player.setFlipX(false)
			} else {
				this.player.setAccelerationX(this.acceleration*4)
				// this.player.anims.play('fall', true)
				this.player.setFlipX(false)
				this.player.anims.play('right', true)
			}
		} else {
			if (
                Math.abs(this.player.body.velocity.x) < 15 &&
                Math.abs(this.player.body.velocity.x) > -15
            ) {
                this.player.setVelocityX(0);
                this.player.setAccelerationX(0);
            } else {
				this.player.setAccelerationX(
                    (this.player.body.velocity.x > 0 ? -1 : 1) * this.acceleration * 4
                );

			}
			if (!this.jumping){
				this.player.anims.play('idle', true)
			}
		}
		if (this.cursor.space.isDown && !this.jumping) {
            this.player.setVelocityY(this.jumpVelocity)
            this.jumping = true
			this.player.anims.play('jump', true)
        }
		if(velocityY > 0){
			this.player.anims.play('fall', true)
		}
		if(velocityY < 0){
			this.player.anims.play('jump', true)
		}
		
		if (!standing && this.wasStanding){
			this.coyoteTime = time + 100
		}
		if ((standing || time <= this.coyoteTime) && this.cursor.space.isDown && !this.jumping){
			this.player.setVelocityY(this.jumpVelocity)
			this.jumping = true
			this.player.anims.play('jump', true)
		}
		if (!this.cursor.space.isDown) {
            if (!standing) {
                this.jumping = false;
            }
		}	
	}
	collectCoin(player, coin){
		coin.destroy()
		this.coinsCollected +=1
		// this.coinsCollectedText.setText("Coins Collected : " + this.coinsCollected)
	}
	checkOneWay(player, oneWay){
		if(player.y < oneWay.y){
			return true
		}
		return false
	}
	animateCoin(coin){
		coin.anims.play("spin", true)
	}
	Bounce(player, spring){
		spring.anims.play('boing', true)
		player.setVelocityY(-this.acceleration * 10)
	}
}