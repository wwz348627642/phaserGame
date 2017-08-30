interface Config {
	gameWidth: number,
	gameHeight: number,
	localStorageName?: string
}




let config: Config = {
  gameWidth: window.innerWidth,
  gameHeight: window.innerHeight,
  localStorageName: 'phaseres6webpack'
}

export default config

