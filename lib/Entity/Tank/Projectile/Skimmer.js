"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = __importDefault(require("../Barrel"));
const Bullet_1 = __importDefault(require("./Bullet"));
const AI_1 = require("../../AI");
const SkimmerBarrelDefinition = {
    angle: Math.PI / 2,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0,
    reload: 0.35,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.3,
        damage: 3 / 5,
        speed: 1.1,
        scatterRate: 1,
        lifeLength: 0.25,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Skimmer extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, direction) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.rotationPerTick = Skimmer.BASE_ROTATION;
        this.rotationPerTick = direction;
        this.cameraEntity = tank.cameraEntity;
        const skimmerBarrels = this.skimmerBarrels = [];
        const s1 = new class extends Barrel_1.default {
            resize() {
                super.resize();
                this.physicsData.values.width = this.definition.width;
            }
        }(this, { ...SkimmerBarrelDefinition });
        const s2Definition = { ...SkimmerBarrelDefinition };
        s2Definition.angle += Math.PI;
        const s2 = new class extends Barrel_1.default {
            resize() {
                super.resize();
                this.physicsData.width = this.definition.width;
            }
        }(this, s2Definition);
        s1.styleData.values.color = this.styleData.values.color;
        s2.styleData.values.color = this.styleData.values.color;
        skimmerBarrels.push(s1, s2);
        this.inputs = new AI_1.Inputs();
        this.inputs.flags |= 1;
    }
    get sizeFactor() {
        return this.physicsData.values.size / 50;
    }
    tick(tick) {
        this.reloadTime = this.tank.reloadTime;
        this.positionData.angle += this.rotationPerTick;
        super.tick(tick);
        if (this.deletionAnimation)
            return;
    }
}
exports.default = Skimmer;
Skimmer.BASE_ROTATION = 0.1;
