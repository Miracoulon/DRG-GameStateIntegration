/// <reference types="node" />
import EventEmitter = require("events");
import { RandInterval, RandRange } from "../../Utility/RandInterval";
interface DRGGSIDifficultyEvents {
    /** Emitted when the difficulty gets updated */
    'changed': () => void;
}
declare interface DRGGSIDifficulty {
    on<U extends keyof DRGGSIDifficultyEvents>(event: U, listener: DRGGSIDifficultyEvents[U]): this;
    emit<U extends keyof DRGGSIDifficultyEvents>(event: U, ...args: Parameters<DRGGSIDifficultyEvents[U]>): boolean;
}
declare class DRGGSIDifficulty extends EventEmitter {
    private _name;
    /** The name of this difficulty as displayed in the difficulty selector */
    get Name(): string;
    private _resistances;
    /** An object containing all the resistance arrays of the selected difficulty */
    get Resistances(): {
        ExtraLargeEnemyDamageResistance: number[];
        ExtraLargeEnemyDamageResistanceB: number[];
        ExtraLargeEnemyDamageResistanceC: number[];
        ExtraLargeEnemyDamageResistanceD: number[];
        EnemyDamageResistance: number[];
        SmallEnemyDamageResitance: number[];
    };
    private _enemyCountModifier;
    EnemyCountModifier(): Array<number>;
    EnemyCountModifier(playerCount: number): number;
    private _encounterDifficulty;
    get EncounterDifficulty(): RandInterval;
    private _stationaryDifficulty;
    get StationaryDiffculty(): RandInterval;
    private _enemyWaveInterval;
    get EnemyWaveInterval(): RandInterval;
    private _enemyNormalWaveInterval;
    get EnemyNormalWaveInterval(): RandInterval;
    private _enemyNormalWaveDifficulty;
    get EnemyNormalWaveDifficulty(): RandInterval;
    private _enemyDiversity;
    get EnemyDiversity(): RandInterval;
    private _stationaryEnemyDiversity;
    get StationaryEnemyDiversity(): RandInterval;
    private _disruptivePoolCount;
    get DisruptivePoolCount(): RandRange;
    private _minPoolSize;
    get MinPoolSize(): number;
    private _difficultyGroup;
    get DifficultyGroup(): number;
    private _maxActiveElites;
    get MaxActiveElites(): number;
    private _environmentalDamageModifer;
    get EnvironmentalDamageModifier(): number;
    private _pointExtractionScaler;
    get PointExtractionScaler(): number;
    private _hazardBonus;
    get HazardBonus(): number;
    private _friendlyFireModifier;
    get FriendlyFireModifier(): number;
    private _waveStartDelayScale;
    get WaveStartDelayScale(): number;
    private _speedModifier;
    get SpeedModifier(): number;
    private _attackCooldownModifier;
    get AttackCooldownModifier(): number;
    private _projectileSpeedModifier;
    get ProjectileSpeedModifier(): number;
    private _healthRegenerationMax;
    get HealthRegenerationMax(): number;
    private _reviveHealthRatio;
    get ReviveHealthRation(): number;
    private _eliteCooldown;
    get EliteCooldown(): number;
    private _maxActiveCritters;
    get MaxActiveCritters(): number;
    private _maxActiveSwarmers;
    get MaxActiveSwarmers(): number;
    private _maxActiveEnemies;
    get MaxActiveEnemies(): number;
    constructor();
    handleDifficultyChange(data: any): boolean;
}
export { DRGGSIDifficulty };
