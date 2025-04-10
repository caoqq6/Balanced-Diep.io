"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommand = exports.commandCallbacks = exports.commandDefinitions = void 0;
const config_1 = require("../config");
const AbstractBoss_1 = __importDefault(require("../Entity/Boss/AbstractBoss"));
const Defender_1 = __importDefault(require("../Entity/Boss/Defender"));
const FallenBooster_1 = __importDefault(require("../Entity/Boss/FallenBooster"));
const FallenOverlord_1 = __importDefault(require("../Entity/Boss/FallenOverlord"));
const Guardian_1 = __importDefault(require("../Entity/Boss/Guardian"));
const Summoner_1 = __importDefault(require("../Entity/Boss/Summoner"));
const Live_1 = __importDefault(require("../Entity/Live"));
const ArenaCloser_1 = __importDefault(require("../Entity/Misc/ArenaCloser"));
const FallenAC_1 = __importDefault(require("../Entity/Misc/Boss/FallenAC"));
const FallenSpike_1 = __importDefault(require("../Entity/Misc/Boss/FallenSpike"));
const Dominator_1 = __importDefault(require("../Entity/Misc/Dominator"));
const Object_1 = __importDefault(require("../Entity/Object"));
const AbstractShape_1 = __importDefault(require("../Entity/Shape/AbstractShape"));
const Crasher_1 = __importDefault(require("../Entity/Shape/Crasher"));
const Pentagon_1 = __importDefault(require("../Entity/Shape/Pentagon"));
const Square_1 = __importDefault(require("../Entity/Shape/Square"));
const Triangle_1 = __importDefault(require("../Entity/Shape/Triangle"));
const AutoTurret_1 = __importDefault(require("../Entity/Tank/AutoTurret"));
const Bullet_1 = __importDefault(require("../Entity/Tank/Projectile/Bullet"));
const TankBody_1 = __importDefault(require("../Entity/Tank/TankBody"));
const Entity_1 = require("../Native/Entity");
const util_1 = require("../util");
const Enums_1 = require("./Enums");
const TankDefinitions_1 = require("./TankDefinitions");
const RELATIVE_POS_REGEX = new RegExp(/~(-?\d+)?/);
exports.commandDefinitions = {
    game_set_tank: {
        id: "game_set_tank",
        usage: "[tank]",
        description: "Changes your tank to the given class",
        permissionLevel: 2,
        isCheat: true
    },
    game_set_level: {
        id: "game_set_level",
        usage: "[level]",
        description: "Changes your level to the given whole number",
        permissionLevel: 2,
        isCheat: true
    },
    game_set_score: {
        id: "game_set_score",
        usage: "[score]",
        description: "Changes your score to the given whole number",
        permissionLevel: 2,
        isCheat: true
    },
    game_set_stat: {
        id: "game_set_stat",
        usage: "[stat num] [points]",
        description: "Set the value of one of your statuses. Values can be greater than the capacity. [stat num] is equivalent to the number that appears in the UI",
        permissionLevel: 3,
        isCheat: true
    },
    game_set_stat_max: {
        id: "game_set_stat_max",
        usage: "[stat num] [max]",
        description: "Set the max value of one of your statuses. [stat num] is equivalent to the number that appears in the UI",
        permissionLevel: 3,
        isCheat: true
    },
    game_add_upgrade_points: {
        id: "game_add_upgrade_points",
        usage: "[points]",
        description: "Add upgrade points",
        permissionLevel: 3,
        isCheat: true
    },
    game_teleport: {
        id: "game_teleport",
        usage: "[x] [y]",
        description: "Teleports you to the given position",
        permissionLevel: 3,
        isCheat: true
    },
    game_claim: {
        id: "game_claim",
        usage: "[entityName]",
        description: "Attempts claiming an entity of the given type",
        permissionLevel: 2,
        isCheat: false
    },
    game_godmode: {
        id: "game_godmode",
        usage: "[?value]",
        description: "Set the godemode. Toggles if [value] is not specified",
        permissionLevel: 3,
        isCheat: true
    },
    admin_summon: {
        id: "admin_summon",
        usage: "[entityName] [?count] [?x] [?y]",
        description: "Spawns entities at a certain location",
        permissionLevel: 3,
        isCheat: false
    },
    admin_kill_all: {
        id: "admin_kill_all",
        description: "Kills all entities in the arena",
        permissionLevel: 3,
        isCheat: false
    },
    admin_kill_entity: {
        id: "admin_kill_entity",
        usage: "[entityName]",
        description: "Kills all entities of the given type (might include self)",
        permissionLevel: 3,
        isCheat: false
    },
    admin_close_arena: {
        id: "admin_close_arena",
        description: "Closes the current arena",
        permissionLevel: 3,
        isCheat: false
    }
};
exports.commandCallbacks = {
    game_set_tank: (client, tankNameArg) => {
        const tankDef = (0, TankDefinitions_1.getTankByName)(tankNameArg);
        const player = client.camera?.cameraData.player;
        if (!tankDef || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
            return;
        if (tankDef.flags.devOnly && client.accessLevel !== 3)
            return;
        player.setTank(tankDef.id);
    },
    game_set_level: (client, levelArg) => {
        const level = parseInt(levelArg);
        const player = client.camera?.cameraData.player;
        if (isNaN(level) || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
            return;
        const finalLevel = client.accessLevel == 3 ? level : Math.min(config_1.maxPlayerLevel, level);
        client.camera?.setLevel(finalLevel);
    },
    game_set_score: (client, scoreArg) => {
        const score = parseInt(scoreArg);
        const camera = client.camera?.cameraData;
        const player = client.camera?.cameraData.player;
        if (isNaN(score) || score > Number.MAX_SAFE_INTEGER || score < Number.MIN_SAFE_INTEGER || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default) || !camera)
            return;
        camera.score = score;
    },
    game_set_stat_max: (client, statIdArg, statMaxArg) => {
        const statId = Enums_1.StatCount - parseInt(statIdArg);
        const statMax = parseInt(statMaxArg);
        const camera = client.camera?.cameraData;
        const player = client.camera?.cameraData.player;
        if (statId < 0 || statId >= Enums_1.StatCount || isNaN(statId) || isNaN(statMax) || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default) || !camera)
            return;
        const clampedStatMax = Math.max(statMax, 0);
        camera.statLimits[statId] = clampedStatMax;
        camera.statLevels[statId] = Math.min(camera.statLevels[statId], clampedStatMax);
    },
    game_set_stat: (client, statIdArg, statPointsArg) => {
        const statId = Enums_1.StatCount - parseInt(statIdArg);
        const statPoints = parseInt(statPointsArg);
        const camera = client.camera?.cameraData;
        const player = client.camera?.cameraData.player;
        if (statId < 0 || statId >= Enums_1.StatCount || isNaN(statId) || isNaN(statPoints) || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default) || !camera)
            return;
        camera.statLevels[statId] = statPoints;
    },
    game_add_upgrade_points: (client, pointsArg) => {
        const points = parseInt(pointsArg);
        const camera = client.camera?.cameraData;
        const player = client.camera?.cameraData.player;
        if (isNaN(points) || points > Number.MAX_SAFE_INTEGER || points < Number.MIN_SAFE_INTEGER || !Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default) || !camera)
            return;
        camera.statsAvailable += points;
    },
    game_teleport: (client, xArg, yArg) => {
        const player = client.camera?.cameraData.player;
        if (!Entity_1.Entity.exists(player) || !(player instanceof Object_1.default))
            return;
        const x = xArg.match(RELATIVE_POS_REGEX) ? player.positionData.x + parseInt(xArg.slice(1) || "0", 10) : parseInt(xArg, 10);
        const y = yArg.match(RELATIVE_POS_REGEX) ? player.positionData.y + parseInt(yArg.slice(1) || "0", 10) : parseInt(yArg, 10);
        if (isNaN(x) || isNaN(y))
            return;
        player.positionData.x = x;
        player.positionData.y = y;
        player.setVelocity(0, 0);
        player.entityState |= 2 | 4;
    },
    game_claim: (client, entityArg) => {
        const TEntity = new Map([
            ["ArenaCloser", ArenaCloser_1.default],
            ["Dominator", Dominator_1.default],
            ["Shape", AbstractShape_1.default],
            ["Boss", AbstractBoss_1.default],
            ["AutoTurret", AutoTurret_1.default]
        ]).get(entityArg);
        if (!TEntity || !client.camera?.game.entities.AIs.length)
            return;
        const AIs = Array.from(client.camera.game.entities.AIs);
        for (let i = 0; i < AIs.length; ++i) {
            if (!(AIs[i].owner instanceof TEntity))
                continue;
            client.possess(AIs[i]);
            return;
        }
    },
    game_godmode: (client, activeArg) => {
        const player = client.camera?.cameraData.player;
        if (!Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
            return;
        switch (activeArg) {
            case "on":
                player.setInvulnerability(true);
                break;
            case "off":
                player.setInvulnerability(false);
                break;
            default:
                player.setInvulnerability(!player.isInvulnerable);
                break;
        }
        const godmodeState = player.isInvulnerable ? "ON" : "OFF";
        return `God mode: ${godmodeState}`;
    },
    admin_summon: (client, entityArg, countArg, xArg, yArg) => {
        const count = countArg ? parseInt(countArg) : 1;
        let x = parseInt(xArg || "0", 10);
        let y = parseInt(yArg || "0", 10);
        const player = client.camera?.cameraData.player;
        if (Entity_1.Entity.exists(player) && player instanceof Object_1.default) {
            if (xArg && xArg.match(RELATIVE_POS_REGEX)) {
                x = player.positionData.x + parseInt(xArg.slice(1) || "0", 10);
            }
            if (yArg && yArg.match(RELATIVE_POS_REGEX)) {
                y = player.positionData.y + parseInt(yArg.slice(1) || "0", 10);
            }
        }
        const game = client.camera?.game;
        const TEntity = new Map([
            ["Defender", Defender_1.default],
            ["Summoner", Summoner_1.default],
            ["Guardian", Guardian_1.default],
            ["FallenOverlord", FallenOverlord_1.default],
            ["FallenBooster", FallenBooster_1.default],
            ["FallenAC", FallenAC_1.default],
            ["FallenSpike", FallenSpike_1.default],
            ["ArenaCloser", ArenaCloser_1.default],
            ["Crasher", Crasher_1.default],
            ["Pentagon", Pentagon_1.default],
            ["Square", Square_1.default],
            ["Triangle", Triangle_1.default]
        ]).get(entityArg);
        if (isNaN(count) || count < 0 || !game || !TEntity)
            return;
        for (let i = 0; i < count; ++i) {
            const boss = new TEntity(game);
            if (!isNaN(x) && !isNaN(y)) {
                boss.positionData.x = x;
                boss.positionData.y = y;
            }
        }
    },
    admin_kill_all: (client) => {
        const game = client.camera?.game;
        if (!game)
            return;
        for (let id = 0; id <= game.entities.lastId; ++id) {
            const entity = game.entities.inner[id];
            if (Entity_1.Entity.exists(entity) && entity instanceof Live_1.default && entity !== client.camera?.cameraData.player)
                entity.healthData.health = 0;
        }
    },
    admin_close_arena: (client) => {
        client?.camera?.game.arena.close();
    },
    admin_kill_entity: (client, entityArg) => {
        const TEntity = new Map([
            ["ArenaCloser", ArenaCloser_1.default],
            ["Dominator", Dominator_1.default],
            ["Bullet", Bullet_1.default],
            ["Tank", TankBody_1.default],
            ["Shape", AbstractShape_1.default],
            ["Boss", AbstractBoss_1.default]
        ]).get(entityArg);
        const game = client.camera?.game;
        if (!TEntity || !game)
            return;
        for (let id = 0; id <= game.entities.lastId; ++id) {
            const entity = game.entities.inner[id];
            if (Entity_1.Entity.exists(entity) && entity instanceof TEntity)
                entity.healthData.health = 0;
        }
    }
};
const executeCommand = (client, cmd, args) => {
    if (!exports.commandDefinitions.hasOwnProperty(cmd) || !exports.commandCallbacks.hasOwnProperty(cmd)) {
        return (0, util_1.saveToVLog)(`${client.toString()} tried to run the invalid command ${cmd}`);
    }
    if (client.accessLevel < exports.commandDefinitions[cmd].permissionLevel) {
        return (0, util_1.saveToVLog)(`${client.toString()} tried to run the command ${cmd} with a permission that was too low`);
    }
    const commandDefinition = exports.commandDefinitions[cmd];
    if (commandDefinition.isCheat)
        client.setHasCheated(true);
    const response = exports.commandCallbacks[cmd](client, ...args);
    if (response) {
        client.notify(response, 0x00ff00, 5000, `cmd-callback${commandDefinition.id}`);
    }
};
exports.executeCommand = executeCommand;
