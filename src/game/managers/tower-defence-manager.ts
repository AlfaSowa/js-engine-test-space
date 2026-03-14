import { AnimatedSprite, Application, Assets, Container, Graphics, Rectangle, Sprite, Texture } from 'pixi.js'
import { Engine, World } from '../../engine/core'
import { ColliderComponent, VelocityComponent } from '../../engine/ecs/components'
import { Entity } from '../../engine/ecs/entities'
import { BroadPhaseSystem, CollisionSystem } from '../../engine/ecs/systems'
import { SpatialHashGrid } from '../../engine/utils'
import { randomNumber } from '../../utils'
import { enemyConfigs, EnemyType, playerConfig } from '../configs'
import { EnemyComponent, FollowedComponent, PlayerTowerComponent } from '../ecs'
import { FollowedSystem, GamePhaseSystem, PlayerCollisionSystem, SpawnSystem, WeaponSystem } from '../ecs/systems'

const SPRITE_SIZE = 80

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

const WARRIOR_ENEMY = 'Warrior_Run.png'
const ARCHER_ENEMY = 'Archer_Run.png'

const battleConfig: BattleConfigType = {
  enemies: [
    { texture: ARCHER_ENEMY, type: 'archer', frames: 4 },
    { texture: WARRIOR_ENEMY, type: 'warrior', frames: 6 }
  ],
  amount: 50,
  interval: 5
}

export class TowerDefenceManager {
  static texture: any
  static view: Container
  static playerView: Container = new Container()

  static engine: Engine

  static spawnPoint: { x: number; y: number }

  static grid: SpatialHashGrid = new SpatialHashGrid()

  static player: Entity

  static enemies = new Map<EnemyType, { frames: Texture<any>[] }>()

  static async init(engine: Engine, view: Container) {
    this.texture = await Assets.loadBundle(['default'])
    this.view = view
    this.engine = engine

    this.createPlayerTower(engine.world, engine.app)

    this.prepareEnemies(battleConfig)

    this.spawnPoint = { x: view.width / 2, y: view.height / 2 }

    this.view.addChild(this.playerView)

    this.engine.systems.add(new GamePhaseSystem())
  }

  static async run() {
    this.engine.systems.add(new SpawnSystem())

    this.engine.systems.add(new FollowedSystem())

    this.engine.systems.add(new BroadPhaseSystem(this.grid))
    this.engine.systems.add(new CollisionSystem(this.grid))

    this.engine.systems.add(new PlayerCollisionSystem())

    this.engine.systems.add(new WeaponSystem())

    this.engine.systems.get(SpawnSystem).setTimerOptions(this.engine.engineContext, battleConfig.interval, true, () => {
      this.createEnemy(this.engine, battleConfig)
    })
  }

  static stop() {
    this.engine.systems.remove(GamePhaseSystem)
    this.engine.systems.remove(SpawnSystem)
    this.engine.systems.remove(CollisionSystem)
    this.engine.systems.remove(BroadPhaseSystem)
    this.engine.systems.remove(FollowedSystem)
    this.engine.systems.remove(PlayerCollisionSystem)
    this.engine.systems.remove(WeaponSystem)

    this.engine.systems.get(SpawnSystem).destroyTimer(this.engine.world)
  }

  static prepareEnemies(battleConfig: BattleConfigType) {
    for (const enemy of battleConfig.enemies) {
      const enemyTexture = this.texture.default[enemy.texture]

      const frameWidth = enemyTexture.width / enemy.frames
      const frameHeight = enemyTexture.height
      const frames = []

      // создаём текстуры по кадрам
      for (let i = 0; i < enemy.frames; i++) {
        const rectangle = new Rectangle(i * frameWidth, 0, frameWidth, frameHeight)

        frames.push(new Texture({ source: enemyTexture, frame: rectangle }))
      }

      this.enemies.set(enemy.type, { frames: frames })
    }
  }

  static createPlayerTower(world: World, app: Application) {
    const config = playerConfig

    const playerTexture = new Sprite(this.texture.default[config.texture])
    this.player = world.getOrCreateSingleton(PlayerTowerComponent, new PlayerTowerComponent())
    this.player.addChild(playerTexture)

    this.player.setSize(100)
    const detectionPlayerZone = new Graphics().circle(0, 0, 300).stroke({ color: 'green' })

    this.playerView.addChild(this.player)
    this.playerView.addChild(detectionPlayerZone)

    this.playerView.position.set(
      this.view.width / 2 - this.playerView.width / 2,
      this.view.height / 2 - this.playerView.height / 2
    )

    detectionPlayerZone.position.set(this.playerView.width / 2, this.playerView.height / 2)

    this.player.position.set(
      this.playerView.width / 2 - this.player.width / 2,
      this.playerView.height / 2 - this.player.height / 2
    )
  }

  static createEnemy(engine: Engine, battleConfig: BattleConfigType) {
    const enemyEntity = engine.world.createEntity(Entity)

    const enemy = battleConfig.enemies[randomNumber([-1, battleConfig.enemies.length])]

    const config = enemyConfigs[enemy.type]

    const preparedEnemy = this.enemies.get(enemy.type)

    if (preparedEnemy) {
      // создаём анимированный спрайт
      const animatedSprite = new AnimatedSprite(preparedEnemy.frames)

      animatedSprite.animationSpeed = 0.3
      animatedSprite.loop = true

      animatedSprite.play()

      animatedSprite.width = SPRITE_SIZE
      animatedSprite.height = SPRITE_SIZE

      const r = Math.random()
      enemyEntity.position.set(
        Math.floor(SPAWN_DISTANCE * Math.sin(360 / r)) + this.spawnPoint.x,
        Math.floor(SPAWN_DISTANCE * Math.cos(360 / r)) + this.spawnPoint.y
      )

      enemyEntity.width = animatedSprite.width
      enemyEntity.height = animatedSprite.height

      enemyEntity.addChild(animatedSprite)

      engine.world.addComponent(enemyEntity, new EnemyComponent())
      engine.world.addComponent(enemyEntity, new FollowedComponent(this.player))
      engine.world.addComponent(enemyEntity, new VelocityComponent(config.velocity))
      engine.world.addComponent(enemyEntity, new ColliderComponent(enemyEntity, true))
    }

    this.view.addChild(enemyEntity)

    return enemyEntity
  }
}
