import EventEmitter = require("events");
import { DRGGSIDropPod } from "./DropPod/DRGGSIDropPod";
import { DRGGSISupplyPod } from "./SupplyPod/DRGGSISupplyPod";

interface DRGGSIMissionEvents {
    /**
     * Emitted when the mission info updates.
     * Happens on mission selection and mission level loading.
     * @param info This mission.
     */
    'Info': (info: DRGGSIMission) => void;

    /**
     * Emitted when the mission time updates.
     * @param seconds The time in seconds spent in the current mission.
     */
    'Time': (seconds: number) => void;

    /**
     * Emitted whenever a DropPod spawns
     * @param pod The DropPod that just spawned
     */
    'DropPod.Spawned': (pod: DRGGSIDropPod) => void;

    /**
     * Emitted whenever a SupplyPod is ordered
     * @param X Beacon X coordinate
     * @param Y Beacon Y coordinate
     * @param Z Beacon Z coordinate
     */
    'SupplyPod.Ordered': (X: number, Y: number, Z: number) => void;
}

declare interface DRGGSIMission {
    on<U extends keyof DRGGSIMissionEvents>(event: U, listener: DRGGSIMissionEvents[U]): this;
    emit<U extends keyof DRGGSIMissionEvents>(event: U, ...args: Parameters<DRGGSIMissionEvents[U]>): boolean;
}

class DRGGSIMission extends EventEmitter {
    private _misisonName: string;
    /** The name of this mission as dispalyed on the mission map. */
    public get MissionName(): string { return this._misisonName; };
    private _biome: string;
    /** The file name of the Biome (eg.: BIOME_SandblastedCorridors). */
    public get Biome(): string { return this._biome; };
    private _missionTemplate: string;
    /** The file name of the MissionTemplate (eg.: MissionType_Extraction). */
    public get Template(): string { return this._missionTemplate; };
    private _missionDNA: string;
    /** The file name of the MissionDNA (eg.: DNA_Fractured_Base_C). */
    public get DNA(): string { return this._missionDNA; };
    private _complexity: string;
    /** The file name of the MissionComplexity (eg.: MD_Complexity_Average). */
    public get Complexity(): string { return this._complexity; };
    private _complexityDots: number;
    /** The amount of Dots / Indicators as displayed on the mission map. */
    public ComplexityDots(): number { return this._complexityDots; };
    private _duration: string;
    /** The file name of the MissionDuration (eg.: MD_Duration_Long). */
    public get Duration(): string { return this._duration; };
    private _durationDots: number;
    /** The amount of Dots / Indicators as displayed on the mission map. */
    public get DurationDots(): number { return this._durationDots; };
    private _seeds: { Procedural: number; Mission: number; Global: number };
    /** The seeds used to generate this mission.
     * For normal missions Procedural will only be valid during a mission.
     * */
    public get Seeds(): { Procedural: number; Mission: number; Global: number } { return this._seeds; };
    /** The Procedural seed used to generate this mission.
     * For normal missions only valid during a mission. 
     * */
    public get ProceduralSeed(): number { return this._seeds.Procedural; };
    /** The Mission seed used to generate this mission. */
    public get MissionSeed(): number { return this._seeds.Mission; };
    /** The Global seed used to generate this mission. */
    public get GlobalSeed(): number { return this._seeds.Global; };
    private _anomaly: string;
    /** The file name of the MissionMutator of this mission (eg.: MMUT_XXP).
     * Empty if no MissionMutator is present.
     * */
    public get Anomaly(): string { return this._anomaly; };
    private _warnings: Array<string>;
    /** An array of file names of the MissionWarnings of this mission (eg.: [WRN_LethalEnemies, WRN_CaveleechDen]).
     * Empty if no MissionWarning is present.
     * */
    public get Warnings(): Array<string> { return this._warnings; };
    /** The amount of MissionWarnings present. */
    public get WarningCount(): number { return this._warnings.length; };

    private _missionTime: number;
    /** The amount of time in seconds that has elapsed in this mission.
     * Will be -1 whilst on the SpaceRig 
     * */
    public get MissionTimeSeconds(): number { return this._missionTime; };


    private _supplyPods: Map<number, DRGGSISupplyPod>;
    /** A map of number (ID) <-> DRGGSISupplyPod of all currently tracked SupplyPods */
    public get SupplyPods(): Map<number, DRGGSISupplyPod> { if (this._supplyPods === null) this._supplyPods = new Map<number, DRGGSISupplyPod>(); return this._supplyPods; };
    /**
     * Tries to find and return a SupplyPod by its ID
     * @param {number} id The SupplyPod ID to look for
     * @returns {DRGGSISupplyPod | null} The SupplyPod if found, null otherwise
     */
    public getSupplyPodByID(id: number): DRGGSISupplyPod | null {
        if (!this._supplyPods.has(id)) return null;
        return this._supplyPods.get(id);
    }


    private _landingPod: DRGGSIDropPod;
    public get LandingPod(): DRGGSIDropPod | null { return this._landingPod; };
    private _escapePod: DRGGSIDropPod;
    public get EscapePod(): DRGGSIDropPod | null { return this._escapePod; };

    public constructor() {
        super();

        this._misisonName = 'Unknown';
        this._biome = 'Unknown';
        this._missionTemplate = 'Unknown';
        this._missionDNA = 'Unknown';
        this._complexity = 'Unknown';
        this._complexityDots = -1;
        this._duration = 'Unknown';
        this._durationDots = -1;
        this._seeds = {
            Procedural: -1,
            Mission: -1,
            Global: -1,
        };
        this._anomaly = 'Unknown';
        this._warnings = new Array<string>();

        this._missionTime = -1;
    }

    public reset() {
        this._missionTime = -1;
        this._supplyPods = new Map<number, DRGGSISupplyPod>();

        this._landingPod = null;
        this._escapePod = null;

        this.emit('Time', this._missionTime);
    }

    public handleMissionTime(data): boolean {
        if (data.Time === undefined) return false;
        this._missionTime = data.Time;
        this.emit('Time', this._missionTime);
        return true;
    }

    public handleMissionInfo(data): boolean {
        if (data.Name === undefined || data.Biome === undefined || data.Template === undefined || data.DNA === undefined || data.Complexity === undefined || data.ComplexityDots === undefined || data.Duration === undefined || data.DurationDots === undefined || data.Seeds === undefined || data.Seeds.Procedural === undefined || data.Seeds.Mission === undefined || data.Seeds.Global === undefined || data.Anomaly === undefined || data.Warnings === undefined) return false;
        this._misisonName = data.Name;
        this._biome = data.Biome;
        this._missionTemplate = data.Template;
        this._missionDNA = data.DNA;
        this._complexity = data.Complexity;
        this._complexityDots = data.ComplexityDots;
        this._duration = data.Duration;
        this._durationDots = data.DurationDots;
        this._seeds.Procedural = data.Seeds.Procedural;
        this._seeds.Mission = data.Seeds.Mission;
        this._seeds.Global = data.Seeds.Global;
        this._anomaly = data.Anomaly;
        this._warnings = new Array<string>();
        for (const warning of data.Warnings) {
            this._warnings.push(warning);
        }
        this.emit('Info', this);
        return true;
    }

    public handleDropPodInfo(data): boolean {
        if (data.Type === undefined || data.State === undefined) return false;
        switch (data.Type) {
            case 0: {
                return false;
            }
            case 1: {
                if (this._landingPod === null) {
                    this._landingPod = new DRGGSIDropPod();
                    this.emit('DropPod.Spawned', this._landingPod);
                }
                this._landingPod.handleStateInfo(data.State);
                break;
            }
            case 2: {
                if (this._escapePod === null) {
                    this._escapePod = new DRGGSIDropPod();
                    this.emit('DropPod.Spawned', this._escapePod);
                }
                this._escapePod.handleStateInfo(data.State);
                break;
            }
            default: {
                return false;
            }
        }
        return true;
    }

    public handleSupplyPodOrdered(data): boolean {
        if (data.X === undefined || data.Y === undefined || data.Z === undefined) return false;
        this.emit('SupplyPod.Ordered', data.X, data.Y, data.Z);
    }

    public handleSupplyPodStateChanged(data): boolean {
        if (data.ID === undefined || data.State === undefined) return false;
        let pod = this.getSupplyPodByID(data.ID);
        if (!pod) {
            pod = new DRGGSISupplyPod(data.ID);
            this._supplyPods.set(data.ID, pod);
        }
        pod.handleStateChanged(data);
        return true;
    }

    public handleSupplyPodCharges(data): boolean {
        if (data.ID === undefined || data.Charges === undefined) return false;
        let pod = this.getSupplyPodByID(data.ID);
        if (!pod) {
            pod = new DRGGSISupplyPod(data.ID);
            this._supplyPods.set(data.ID, pod);
        }
        pod.handleChargesLeftChanged(data);
        return true;
    }
}

export { DRGGSIMission };