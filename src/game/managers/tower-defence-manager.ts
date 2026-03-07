import { AnimatedSprite, Application, Assets, Container, Graphics, Rectangle, Texture } from 'pixi.js'
import { Engine, World } from '../../engine/core'
import { ColliderComponent, VelocityComponent } from '../../engine/ecs/components'
import { Entity } from '../../engine/ecs/entities'
import { BroadPhaseSystem, CollisionSystem } from '../../engine/ecs/systems'
import { SpatialHashGrid } from '../../engine/utils'
import { randomNumber } from '../../utils'
import { enemyConfigs, EnemyType } from '../configs'
import { EnemyComponent, FollowedComponent, PlayerTowerComponent } from '../ecs'
import { FollowedSystem, GamePhaseSystem, SpawnSystem } from '../ecs/systems'

const SPRITE_SIZE = 30

const SPAWN_DISTANCE = 500

export type EnemyEntityType = {
  texture: string
  type: EnemyType
  frames: number
}

export type BattleConfigType = {
  enemies: EnemyEntityType[]
  amount: number
  interval: number
}

const WARRIOR_ENEMY = 'Warrior_Idle.png'
const ARCHER_ENEMY = 'Archer_Idle.png'

const battleConfig: BattleConfigType = {
  enemies: [
    { texture: ARCHER_ENEMY, type: 'archer', frames: 6 },
    { texture: WARRIOR_ENEMY, type: 'warrior', frames: 8 }
  ],
  amount: 50,
  interval: 0.1
}

export class TowerDefenceManager {
  static texture: any
  static view: Container

  static spawnPoint: { x: number; y: number }

  static grid: SpatialHashGrid = new SpatialHashGrid()

  static player: Entity

  static async init(engine: Engine, view: Container) {
    this.texture = await Assets.loadBundle(['default'])
    this.player = this.createPlayerTower(engine.world, engine.app)

    this.view = view

    this.spawnPoint = { x: engine.app.canvas.width / 2, y: engine.app.canvas.height / 2 }
    view.addChild(this.player)
  }

  static async run(engine: Engine) {
    engine.systems.add(new GamePhaseSystem())
    engine.systems.add(new SpawnSystem())

    engine.systems.add(new FollowedSystem())

    engine.systems.add(new BroadPhaseSystem(this.grid))
    engine.systems.add(new CollisionSystem(this.grid))

    engine.systems.get(SpawnSystem).setTimerOptions(engine.engineContext, battleConfig.interval, true, () => {
      this.createEnemy(engine, battleConfig)
    })
  }

  static stop(engine: Engine) {
    engine.systems.remove(GamePhaseSystem)
    engine.systems.remove(SpawnSystem)
    engine.systems.remove(CollisionSystem)
    engine.systems.remove(BroadPhaseSystem)
    engine.systems.remove(FollowedSystem)

    engine.systems.get(SpawnSystem).destroyTimer(engine.world)
  }

  static createPlayerTower(world: World, app: Application) {
    const player = world.getOrCreateSingleton(PlayerTowerComponent, new PlayerTowerComponent())

    player.addChild(new Graphics().rect(0, 0, 50, 50).fill({ color: 'green' }))
    player.position.set(app.canvas.width / 2 - player.width / 2, app.canvas.height / 2 - player.height / 2)

    return player
  }

  static createEnemy(engine: Engine, battleConfig: BattleConfigType) {
    const enemyEntity = engine.world.createEntity(Entity)

    const enemy = battleConfig.enemies[randomNumber([-1, battleConfig.enemies.length])]

    const config = enemyConfigs[enemy.type]

    const enemyTexture = this.texture.default[enemy.texture]

    const frameWidth = enemyTexture.width / enemy.frames
    const frameHeight = enemyTexture.height
    const frames = []

    // создаём текстуры по кадрам
    for (let i = 0; i < enemy.frames; i++) {
      const rectangle = new Rectangle(i * frameWidth, 0, frameWidth, frameHeight)

      frames.push(new Texture({ source: enemyTexture, frame: rectangle }))
    }

    // создаём анимированный спрайт
    const animatedSprite = new AnimatedSprite(frames)

    animatedSprite.animationSpeed = 0.3
    animatedSprite.loop = true

    animatedSprite.width = SPRITE_SIZE
    animatedSprite.height = SPRITE_SIZE

    animatedSprite.play()

    enemyEntity.addChild(animatedSprite)

    const r = Math.random()

    enemyEntity.position.set(
      Math.floor(SPAWN_DISTANCE * Math.sin(360 / r)) + this.spawnPoint.x,
      Math.floor(SPAWN_DISTANCE * Math.cos(360 / r)) + this.spawnPoint.y
    )

    enemyEntity.width = animatedSprite.width
    enemyEntity.height = animatedSprite.height

    engine.world.addComponent(enemyEntity, new EnemyComponent())
    engine.world.addComponent(enemyEntity, new FollowedComponent(this.player))
    engine.world.addComponent(enemyEntity, new VelocityComponent(config.velocity))
    engine.world.addComponent(enemyEntity, new ColliderComponent(enemyEntity, true))

    this.view.addChild(enemyEntity)

    return enemyEntity
  }
}
