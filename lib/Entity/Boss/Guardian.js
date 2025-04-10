"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = __importDefault(require("../Tank/Barrel"));
const AbstractBoss_1 = __importDefault(require("./AbstractBoss"));
const GuardianSpawnerDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 100,
    width: 71.4,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 24,
    canControlDrones: true,
    bullet: {
        type: "drone",
        sizeRatio: 21 / (71.4 / 2),
        health: 12.5,
        damage: 0.5,
        speed: 1.7,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 1
    }
};
const GUARDIAN_SIZE = 135;
class Guardian extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.nameData.values.name = 'Guardian';
        this.altName = 'Guardian of the Pentagons';
        this.styleData.values.color = 11;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = GUARDIAN_SIZE * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition));
    }
    get sizeFactor() {
        return (this.physicsData.values.size / Math.SQRT1_2) / GUARDIAN_SIZE;
    }
    moveAroundMap() {
        super.moveAroundMap();
        this.positionData.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x);
    }
    tick(tick) {
        super.tick(tick);
    }
}
exports.default = Guardian;
