import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight
    /*
     * @param { number } width 场景宽度
     * @param { number } height 场景高度
     * @param { string } Phaser.CANVAS 渲染上下文 可选值有 Phaser.CANVAS, Phaser.WEBGL, Phaser.AUTO
     * @param { string } id 要插入canvas的dom元素id
     * @params { Object } null 一个包含四个Phaser基本函数引用的对象
     */ 
    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Boot')
  }
}

window.game = new Game()
