import Phaser from "phaser"
export default class ScreenStartScene extends Phaser.Scene {
	constructor(scene, x, y, texture, config) {
		super("screenStart-scene")
    }
    init(data){
      this.collected1 = false
		  this.collected2 = false
      this.collected3 = false
		  this.collected4 = false
		  this.collected5 = false
		  this.blockBroken1 = false
		  this.blockBroken2 = false
		  this.blockBroken3 = false
		  this.blockBroken4 = false
		  this.blockBroken5 = false
      this.collectedCoins = 0
	    this.deathCount = 0
      this.titleText = undefined
      this.title2Text = undefined
      this.howToPlayText = undefined
      this.moveText = undefined
      this.startButton = undefined
    }
    preload(){
      this.load.image("background", "images/background.png")
    }
    create(){
      this.add.image(400, 296, "background").setAlpha(0.2)
      this.titleText = this.add.text(130, 50, "THE PLATFORMER'S", { fontSize: '56px', color: '#fff' })
      this.title2Text = this.add.text(282, 125, "DUNGEON", { fontSize: '56px', color: '#fff' })
      this.howToPlayText = this.add.text(25, 350, "HOW TO PLAY", { fontSize: '24px', color: '#fff' })
      this.moveText = this.add.text(25, 400, "Use arrow keys to move \n\nand space to jump\n\nHold Z to climb\n\nPress X to dash\n\nHold arrow keys to aim your dash", { fontSize: '15px', color: '#fff' })
      this.startButton = this.add.text(350, 275, "PLAY", { fontSize: '40px', color: '#fff' }).setInteractive()
      this.startButton.once('pointerup', () => {this.scene.start("Project-scene"), this.scene.sleep("screenStart-scene")}, this)
    }
}