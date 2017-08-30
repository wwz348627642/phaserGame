import 'pixi'
import 'p2'
import * as Phaser from 'phaser-ce'
import config from './config.ts'

declare global {
  interface Window { game: any; }
}

interface state {
 	preload (): void,
	created (): void,
	play (): void,
	over (): void,
}

window.game = window.game || {};

/*
 * @name 实例化游戏
 * @param { string | number } width
 * @param { string | number } height
 * @param { string } 				  context
 * @param { string }          element id
 * @param { object }          status 可选参数
 */
let game = new Phaser.Game(config.gameWidth, config.gameHeight, Phaser.AUTO, 'content')

// 定义场景
var states:state = {
	// 加载场景
	preload: function () {
		this.preload = function (): void {
			// 设置背景色
			game.stage.backgroundColor = '#000'

			// 设置跨域
			game.load.crossOrigin = 'anonymous'
			
			// 加载资源
			game.load.image('bg','//24haowan-cdn.shanyougame.com/pickApple2/assets/images/bg.png')
      game.load.image('dude', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/dude.png')
      game.load.image('green', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/green.png')
      game.load.image('red', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/red.png')
      game.load.image('yellow', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/yellow.png')
      game.load.image('bomb', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/bomb.png')
      game.load.image('five', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/five.png')
      game.load.image('three', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/three.png')
      game.load.image('one', '//24haowan-cdn.shanyougame.com/pickApple2/assets/images/one.png')
      game.load.audio('bgMusic', '//24haowan-cdn.shanyougame.com/pickApple2/assets/audio/bgMusic.mp3')
      game.load.audio('scoreMusic', '//24haowan-cdn.shanyougame.com/pickApple2/assets/audio/addscore.mp3');
      game.load.audio('bombMusic', '//24haowan-cdn.shanyougame.com/pickApple2/assets/audio/boom.mp3');

      // 添加进度文字
      let progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
      	fontSize: 60,
      	fill: '#fff'
      })

      progressText.anchor.setTo(0.5, 0.5)

      // 监听加载完一个文件的事件
      game.load.onFileComplete.add(function (progress: number | string) {
      	progressText.text = progress + '%'
      })

      game.load.onLoadComplete.add(onLoad)

      // 最小展示时间
      var deadLine = false
      setTimeout(function () {
      	deadLine = true
      }, 3000)

      // 加载完毕的回调
      function onLoad () {
      	if (deadLine) {
      		game.state.start('created')
      	} else {
      		setTimeout(onLoad, 1000)
      	}
      }

		}

		// 加载完毕
    this.create = function (): void {
    	// console.log('加载完毕')
    }
	},
	// 开始场景
	created: function () {
		this.create = function (): void {
			// 添加背景
			var bg = game.add.image(0, 0, 'bg')
			bg.width = game.world.width
			bg.height = game.world.height

			// 添加标题
			var title = game.add.text(game.world.centerX, game.world.height * 0.25, '小恐龙接苹果', { 
				fontSize: 40,
				fontWeight: 'bold',
				fill: '#f2bb15'
			})

			title.anchor.setTo(0.5, 0.5)

			// 添加提示
			var remind = game.add.text(game.world.centerX, game.world.centerY, '点击任意位置开始', {
				fontSize: 20,
				fill: '#f2bb15'
			})

			remind.anchor.setTo(0.5, 0.5)

			// 添加主角
			var man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude')
			var manImage= game.cache.getImage('dude');
			man.width = game.world.width * 0.2
			man.height = game.width / manImage.width * manImage.height
			man.anchor.setTo(0.5, 0.5)

			// 添加点击事件
			game.input.onTap.add(function () {
				game.state.start('play')
			})
	
		}
	},
	// 游戏场景
	play: function () {

		let man: any 
		let	apples: any 
		let	score: number 
		let	title: any
		let scoreMusic: any
		let bombMusic: any
		let bgMusic: any

		this.create = function (): void {

			// 得分
			score = 0

			// 开启物理引擎
      game.physics.startSystem(Phaser.Physics.Arcade)
      game.physics.arcade.gravity.y = 600

			// 添加背景音乐
			if (!bgMusic) {
				bgMusic = game.add.audio('bgMusic')
				bgMusic.loopFull()
			}
			

			// 缓存其他音乐
			scoreMusic = game.add.audio('scoreMusic')
			bombMusic = game.add.audio('bombMusic')

			// 添加背景
			let bg = game.add.image(0, 0, 'bg')
			bg.width = game.world.width
			bg.height = game.world.height

			// 添加主角
			man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude')
      var manImage = game.cache.getImage('dude');
      man.width = game.world.width * 0.2;
      man.height = man.width / manImage.width * manImage.height;
      man.anchor.setTo(0.5, 0.5)
      // 加入物理运动
      game.physics.enable(man)
      // 清楚重力影响
      man.body.allowGravity = false

      // 添加分数
      title = game.add.text(game.world.centerX, game.world.height * 0.25, '0', {
        fontSize: 40,
        fontWeight: 'bold',
        fill: '#f2bb15'
      })
      title.anchor.setTo(0.5, 0.5)

      // 监听滑动事件
      var touching: boolean = false

      // 按下
      game.input.onDown.add(function (pointer: any) {
      	if (Math.abs(pointer.x - man.x) < man.width / 2) {
      		touching = true
      	}
      })

      // 取消按下
      game.input.onUp.add(function () {
      	touching = false
      })

      // 移动
      game.input.addMoveCallback(function(pointer: any, x: number, y: number, isTap: boolean) {
          if (!isTap && touching) man.x = x;
      }, {})

      // 添加苹果组
      apples = game.add.group()
      var appleTypes: Array<string> = ['green', 'red', 'yellow', 'bomb']
      var appleTimer = game.time.create(true)
      appleTimer.loop(1000, function () {
      	var x: number = Math.random() * game.world.width
      	var number: number = Math.floor(Math.random() * appleTypes.length)

      	var type: string = appleTypes[number]
      	var apple: any = apples.create(x, 0, type) 

      	// 设置苹果加入物理运动
      	game.physics.enable(apple)

      	// 设置苹果大小
      	var appleImg: any = game.cache.getImage(type)
      	apple.width = game.world.width / 8
      	apple.height = apple.width / appleImg.width * appleImg.height

      	// 设置苹果与游戏边缘碰撞
      	apple.body.collideWorldBounds = true
      	apple.body.onWorldBounds = new Phaser.Signal()
      	apple.body.onWorldBounds.add(function (apple: any, up: boolean, down: boolean, left: boolean, right: boolean) {
      		if (down) {
      			apple.kill()
      			if (apple.key !== 'bomb') game.state.start('over', true, false, score)
      		}
      	})
      })

      appleTimer.start()
		}

		this.update = function (): void {
			game.physics.arcade.overlap(man, apples, pickApple, null, this)
		}

		function pickApple (man: any, apple: any): void {
			var point: number = 1
			var img: string = 'one'
			
			switch(apple.key) {
				case 'red':
					point = 3
					img = 'three'
					break;
				case 'yellow':
					point = 5
					img = 'five'
					break;
				case 'bomb':
					bombMusic.play()
					game.state.start('over', true, false, score)
			}

			// 添加得分图片
			var goal: any = game.add.image(apple.x, apple.y, img)
			var goalImg: any = game.cache.getImage(img)
			goal.width = apple.width
			goal.height = goal.width / (goalImg.width / goalImg.height)
			goal.alpha = 0

			// 添加过渡效果
			var showTween: any = game.add.tween(goal).to({
				alpha: 1,
				y: goal.y - 20
			}, 100, Phaser.Easing.Linear.None, true, 0, 0, false)

			showTween.onComplete.add(function () {
				var hideTween = game.add.tween(goal).to({
					alpha: 0,
					y: goal.y - 20
				}, 100, Phaser.Easing.Linear.None, true, 200, 0, false)

				hideTween.onComplete.add(function () {
					goal.kill()
				})
			})

			score += point
			title.text = score
			apple.kill()
		}
	},
	// 结束场景
	over: function () {

		let score: number = 0
		this.init = function (): void {
			score = arguments[0]
		}

		this.create = function () {
			// 添加背景
			var bg: any = game.add.image(0, 0, 'bg')
			bg.width = game.world.width
			bg.height = game.world.height

			var title: any = game.add.text(game.world.centerX, game.world.y * 0.25, '游戏结束', {
				fontSize: 40,
				fontWeight: 'bold',
				fill: '#f2bb15'
			})

			title.anchor.setTo(0.5, 0.5);

			var scoreStr: string = `你的得分是：${score}分`

			var scoreText: any = game.add.text(game.world.centerX, game.world.height * 0.4, scoreStr, {
				fontSize: 30,
				fontWeight: 'bold',
				fill: '#f2bb15'
			})

			scoreText.anchor.setTo(0.5, 0.5)

			var remind: any = game.add.text(game.world.centerX, game.world.height * 0.6, '点击任意位置再玩一次', {
				fontSize: 20,
				fontWeight: 'bold',
				fill: '#f2bb15'
			})

			remind.anchor.setTo(0.5, 0.5)

			// 添加点击事件
			game.input.onTap.add(function () {
				game.state.start('play')
			})

		}
	}
}

// 添加场景到游戏示例中
Object.keys(states).map(function (key: string) {
	game.state.add(key, states[key])
})


game.state.start('preload');
