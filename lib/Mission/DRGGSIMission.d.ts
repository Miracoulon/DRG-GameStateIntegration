/// <reference types="node" />
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
declare class DRGGSIMission extends EventEmitter {
    private _misisonName;
    /** The name of this mission as dispalyed on the mission map. */
    get MissionName(): string;
    private _biome;
    /** The file name of the Biome (eg.: BIOME_SandblastedCorridors). */
    get Biome(): string;
    private _missionTemplate;
    /** The file name of the MissionTemplate (eg.: MissionType_Extraction). */
    get Template(): string;
    private _missionDNA;
    /** The file name of the MissionDNA (eg.: DNA_Fractured_Base_C). */
    get DNA(): string;
    private _complexity;
    /** The file name of the MissionComplexity (eg.: MD_Complexity_Average). */
    get Complexity(): string;
    private _complexityDots;
    /** The amount of Dots / Indicators as displayed on the mission map. */
    ComplexityDots(): number;
    private _duration;
    /** The file name of the MissionDuration (eg.: MD_Duration_Long). */
    get Duration(): string;
    private _durationDots;
    /** The amount of Dots / Indicators as displayed on the mission map. */
    get DurationDots(): number;
    private _seeds;
    /** The seeds used to generate this mission.
     * For normal missions Procedural will only be valid during a mission.
     * */
    get Seeds(): {
        Procedural: number;
        Mission: number;
        Global: number;
    };
    /** The Procedural seed used to generate this mission.
     * For normal missions only valid during a mission.
     * */
    get ProceduralSeed(): number;
    /** The Mission seed used to generate this mission. */
    get MissionSeed(): number;
    /** The Global seed used to generate this mission. */
    get GlobalSeed(): number;
    private _anomaly;
    /** The file name of the MissionMutator of this mission (eg.: MMUT_XXP).
     * Empty if no MissionMutator is present.
     * */
    get Anomaly(): string;
    private _warnings;
    /** An array of file names of the MissionWarnings of this mission (eg.: [WRN_LethalEnemies, WRN_CaveleechDen]).
     * Empty if no MissionWarning is present.
     * */
    get Warnings(): Array<string>;
    /** The amount of MissionWarnings present. */
    get WarningCount(): number;
    private _missionTime;
    /** The amount of time in seconds that has elapsed in this mission.
     * Will be -1 whilst on the SpaceRig
     * */
    get MissionTimeSeconds(): number;
    private _supplyPods;
    /** A map of number (ID) <-> DRGGSISupplyPod of all currently tracked SupplyPods */
    get SupplyPods(): Map<number, DRGGSISupplyPod>;
    /**
     * Tries to find and return a SupplyPod by its ID
     * @param {number} id The SupplyPod ID to look for
     * @returns {DRGGSISupplyPod | null} The SupplyPod if found, null otherwise
     */
    getSupplyPodByID(id: number): DRGGSISupplyPod | null;
    private _landingPod;
    get LandingPod(): DRGGSIDropPod | null;
    private _escapePod;
    get EscapePod(): DRGGSIDropPod | null;
    constructor();
    reset(): void;
    handleMissionTime(data: any): boolean;
    handleMissionInfo(data: any): boolean;
    handleDropPodInfo(data: any): boolean;
    handleSupplyPodOrdered(data: any): boolean;
    handleSupplyPodStateChanged(data: any): boolean;
    handleSupplyPodCharges(data: any): boolean;
}
export { DRGGSIMission };
