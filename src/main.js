import Phaser from "phaser"

import ProjectScene from "./scenes/ProjectScene"

const config = {
	type: Phaser.AUTO,
	parent: "app",
	width: 800,
	height: 600,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 500 },
		},
	},
	scene: [ProjectScene],
}

export default new Phaser.Game(config)
