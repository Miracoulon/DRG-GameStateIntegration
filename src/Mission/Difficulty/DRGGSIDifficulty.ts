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

class DRGGSIDifficulty extends EventEmitter {
    private _name: string;
    /** The name of this difficulty as displayed in the difficulty selector */
    public get Name(): string { return this._name; };

    private _resistances: {
        ExtraLargeEnemyDamageResistance: Array<number>;
        ExtraLargeEnemyDamageResistanceB: Array<number>;
        ExtraLargeEnemyDamageResistanceC: Array<number>;
        ExtraLargeEnemyDamageResistanceD: Array<number>;
        EnemyDamageResistance: Array<number>;
        SmallEnemyDamageResitance: Array<number>;
    }
    /** An object containing all the resistance arrays of the selected difficulty */
    public get Resistances() { return this._resistances; };

    private _enemyCountModifier: Array<number>;
    public EnemyCountModifier(): Array<number>;
    public EnemyCountModifier(playerCount: number): number;
    public EnemyCountModifier(playerCount: number | void): Array<number> | number {
        if (typeof (playerCount) === 'number') {
            const count = Math.min(Math.max(playerCount, 0), this._enemyCountModifier.length);
            return this._enemyCountModifier[count];
        }
        return this._enemyCountModifier;
    };

    private _encounterDifficulty: RandInterval;
    public get EncounterDifficulty(): RandInterval { return this._encounterDifficulty; };
    private _stationaryDifficulty: RandInterval;
    public get StationaryDiffculty(): RandInterval { return this._stationaryDifficulty; };

    private _enemyWaveInterval: RandInterval;
    public get EnemyWaveInterval(): RandInterval { return this._enemyWaveInterval; };
    private _enemyNormalWaveInterval: RandInterval;
    public get EnemyNormalWaveInterval(): RandInterval { return this._enemyNormalWaveInterval; };
    private _enemyNormalWaveDifficulty: RandInterval;
    public get EnemyNormalWaveDifficulty(): RandInterval { return this._enemyNormalWaveDifficulty; };

    private _enemyDiversity: RandInterval;
    public get EnemyDiversity(): RandInterval { return this._enemyDiversity; };
    private _stationaryEnemyDiversity: RandInterval;
    public get StationaryEnemyDiversity(): RandInterval { return this._stationaryEnemyDiversity; };

    private _disruptivePoolCount: RandRange;
    public get DisruptivePoolCount(): RandRange { return this._disruptivePoolCount; };
    private _minPoolSize: number;
    public get MinPoolSize(): number { return this._minPoolSize; };

    private _difficultyGroup: number;
    public get DifficultyGroup(): number { return this._difficultyGroup; };

    private _maxActiveElites: number;
    public get MaxActiveElites(): number { return this._maxActiveElites; };;
    private _environmentalDamageModifer: number;
    public get EnvironmentalDamageModifier(): number { return this._environmentalDamageModifer; };
    private _pointExtractionScaler: number;
    public get PointExtractionScaler(): number { return this._pointExtractionScaler; };
    private _hazardBonus: number;
    public get HazardBonus(): number { return this._hazardBonus; };
    private _friendlyFireModifier: number;
    public get FriendlyFireModifier(): number { return this._friendlyFireModifier; };
    private _waveStartDelayScale: number;
    public get WaveStartDelayScale(): number { return this._waveStartDelayScale; };
    private _speedModifier: number;
    public get SpeedModifier(): number { return this._speedModifier; };
    private _attackCooldownModifier: number;
    public get AttackCooldownModifier(): number { return this._attackCooldownModifier; };
    private _projectileSpeedModifier: number;
    public get ProjectileSpeedModifier(): number { return this._projectileSpeedModifier; };
    private _healthRegenerationMax: number;
    public get HealthRegenerationMax(): number { return this._healthRegenerationMax; };
    private _reviveHealthRatio: number;
    public get ReviveHealthRation(): number { return this._reviveHealthRatio; };
    private _eliteCooldown: number;
    public get EliteCooldown(): number { return this._eliteCooldown; };

    private _maxActiveCritters: number;
    public get MaxActiveCritters(): number { return this._maxActiveCritters; };
    private _maxActiveSwarmers: number;
    public get MaxActiveSwarmers(): number { return this._maxActiveSwarmers; };
    private _maxActiveEnemies: number;
    public get MaxActiveEnemies(): number { return this._maxActiveEnemies; };

    

    public constructor() {
        super();
    }

    public handleDifficultyChange(data): boolean {
        this._name = data.Name || 'Unknown';

        this.emit('changed');
        return true;
    }
}

export { DRGGSIDifficulty };