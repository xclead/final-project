import Phaser from "phaser"

import ProjectScene from "./scenes/ProjectScene"
import Screen2Scene from "./scenes/Screen2Scene"
import Screen3Scene from "./scenes/Screen3Scene"
import Screen4Scene from "./scenes/Screen4Scene"
import Screen5Scene from "./scenes/Screen5Scene"
const config = {
	type: Phaser.AUTO,
	parent: "app",
	width: 800,
	height: 592,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 500 },
		},
	},
	scene: [ProjectScene,Screen2Scene,Screen3Scene, Screen4Scene, Screen5Scene],
}

export default new Phaser.Game(config)
