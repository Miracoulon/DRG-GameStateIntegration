"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSIDifficulty = void 0;
const EventEmitter = require("events");
class DRGGSIDifficulty extends EventEmitter {
    /** The name of this difficulty as displayed in the difficulty selector */
    get Name() { return this._name; }
    ;
    /** An object containing all the resistance arrays of the selected difficulty */
    get Resistances() { return this._resistances; }
    ;
    EnemyCountModifier(playerCount) {
        if (typeof (playerCount) === 'number') {
            const count = Math.min(Math.max(playerCount, 0), this._enemyCountModifier.length);
            return this._enemyCountModifier[count];
        }
        return this._enemyCountModifier;
    }
    ;
    get EncounterDifficulty() { return this._encounterDifficulty; }
    ;
    get StationaryDiffculty() { return this._stationaryDifficulty; }
    ;
    get EnemyWaveInterval() { return this._enemyWaveInterval; }
    ;
    get EnemyNormalWaveInterval() { return this._enemyNormalWaveInterval; }
    ;
    get EnemyNormalWaveDifficulty() { return this._enemyNormalWaveDifficulty; }
    ;
    get EnemyDiversity() { return this._enemyDiversity; }
    ;
    get StationaryEnemyDiversity() { return this._stationaryEnemyDiversity; }
    ;
    get DisruptivePoolCount() { return this._disruptivePoolCount; }
    ;
    get MinPoolSize() { return this._minPoolSize; }
    ;
    get DifficultyGroup() { return this._difficultyGroup; }
    ;
    get MaxActiveElites() { return this._maxActiveElites; }
    ;
    ;
    get EnvironmentalDamageModifier() { return this._environmentalDamageModifer; }
    ;
    get PointExtractionScaler() { return this._pointExtractionScaler; }
    ;
    get HazardBonus() { return this._hazardBonus; }
    ;
    get FriendlyFireModifier() { return this._friendlyFireModifier; }
    ;
    get WaveStartDelayScale() { return this._waveStartDelayScale; }
    ;
    get SpeedModifier() { return this._speedModifier; }
    ;
    get AttackCooldownModifier() { return this._attackCooldownModifier; }
    ;
    get ProjectileSpeedModifier() { return this._projectileSpeedModifier; }
    ;
    get HealthRegenerationMax() { return this._healthRegenerationMax; }
    ;
    get ReviveHealthRation() { return this._reviveHealthRatio; }
    ;
    get EliteCooldown() { return this._eliteCooldown; }
    ;
    get MaxActiveCritters() { return this._maxActiveCritters; }
    ;
    get MaxActiveSwarmers() { return this._maxActiveSwarmers; }
    ;
    get MaxActiveEnemies() { return this._maxActiveEnemies; }
    ;
    constructor() {
        super();
    }
    handleDifficultyChange(data) {
        this._name = data.Name || 'Unknown';
        this.emit('changed');
        return true;
    }
}
exports.DRGGSIDifficulty = DRGGSIDifficulty;
