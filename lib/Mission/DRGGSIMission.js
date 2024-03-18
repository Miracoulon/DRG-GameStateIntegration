"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSIMission = void 0;
const EventEmitter = require("events");
const DRGGSIDropPod_1 = require("./DropPod/DRGGSIDropPod");
const DRGGSISupplyPod_1 = require("./SupplyPod/DRGGSISupplyPod");
class DRGGSIMission extends EventEmitter {
    /** The name of this mission as dispalyed on the mission map. */
    get MissionName() { return this._misisonName; }
    ;
    /** The file name of the Biome (eg.: BIOME_SandblastedCorridors). */
    get Biome() { return this._biome; }
    ;
    /** The file name of the MissionTemplate (eg.: MissionType_Extraction). */
    get Template() { return this._missionTemplate; }
    ;
    /** The file name of the MissionDNA (eg.: DNA_Fractured_Base_C). */
    get DNA() { return this._missionDNA; }
    ;
    /** The file name of the MissionComplexity (eg.: MD_Complexity_Average). */
    get Complexity() { return this._complexity; }
    ;
    /** The amount of Dots / Indicators as displayed on the mission map. */
    ComplexityDots() { return this._complexityDots; }
    ;
    /** The file name of the MissionDuration (eg.: MD_Duration_Long). */
    get Duration() { return this._duration; }
    ;
    /** The amount of Dots / Indicators as displayed on the mission map. */
    get DurationDots() { return this._durationDots; }
    ;
    /** The seeds used to generate this mission.
     * For normal missions Procedural will only be valid during a mission.
     * */
    get Seeds() { return this._seeds; }
    ;
    /** The Procedural seed used to generate this mission.
     * For normal missions only valid during a mission.
     * */
    get ProceduralSeed() { return this._seeds.Procedural; }
    ;
    /** The Mission seed used to generate this mission. */
    get MissionSeed() { return this._seeds.Mission; }
    ;
    /** The Global seed used to generate this mission. */
    get GlobalSeed() { return this._seeds.Global; }
    ;
    /** The file name of the MissionMutator of this mission (eg.: MMUT_XXP).
     * Empty if no MissionMutator is present.
     * */
    get Anomaly() { return this._anomaly; }
    ;
    /** An array of file names of the MissionWarnings of this mission (eg.: [WRN_LethalEnemies, WRN_CaveleechDen]).
     * Empty if no MissionWarning is present.
     * */
    get Warnings() { return this._warnings; }
    ;
    /** The amount of MissionWarnings present. */
    get WarningCount() { return this._warnings.length; }
    ;
    /** The amount of time in seconds that has elapsed in this mission.
     * Will be -1 whilst on the SpaceRig
     * */
    get MissionTimeSeconds() { return this._missionTime; }
    ;
    /** A map of number (ID) <-> DRGGSISupplyPod of all currently tracked SupplyPods */
    get SupplyPods() { if (this._supplyPods === null)
        this._supplyPods = new Map(); return this._supplyPods; }
    ;
    /**
     * Tries to find and return a SupplyPod by its ID
     * @param {number} id The SupplyPod ID to look for
     * @returns {DRGGSISupplyPod | null} The SupplyPod if found, null otherwise
     */
    getSupplyPodByID(id) {
        if (!this._supplyPods.has(id))
            return null;
        return this._supplyPods.get(id);
    }
    get LandingPod() { return this._landingPod; }
    ;
    get EscapePod() { return this._escapePod; }
    ;
    constructor() {
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
        this._warnings = new Array();
        this._missionTime = -1;
    }
    reset() {
        this._missionTime = -1;
        this._supplyPods = new Map();
        this._landingPod = null;
        this._escapePod = null;
        this.emit('Time', this._missionTime);
    }
    handleMissionTime(data) {
        if (data.Time === undefined)
            return false;
        this._missionTime = data.Time;
        this.emit('Time', this._missionTime);
        return true;
    }
    handleMissionInfo(data) {
        if (data.Name === undefined || data.Biome === undefined || data.Template === undefined || data.DNA === undefined || data.Complexity === undefined || data.ComplexityDots === undefined || data.Duration === undefined || data.DurationDots === undefined || data.Seeds === undefined || data.Seeds.Procedural === undefined || data.Seeds.Mission === undefined || data.Seeds.Global === undefined || data.Anomaly === undefined || data.Warnings === undefined)
            return false;
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
        this._warnings = new Array();
        for (const warning of data.Warnings) {
            this._warnings.push(warning);
        }
        this.emit('Info', this);
        return true;
    }
    handleDropPodInfo(data) {
        if (data.Type === undefined || data.State === undefined)
            return false;
        switch (data.Type) {
            case 0: {
                return false;
            }
            case 1: {
                if (this._landingPod === null) {
                    this._landingPod = new DRGGSIDropPod_1.DRGGSIDropPod();
                    this.emit('DropPod.Spawned', this._landingPod);
                }
                this._landingPod.handleStateInfo(data.State);
                break;
            }
            case 2: {
                if (this._escapePod === null) {
                    this._escapePod = new DRGGSIDropPod_1.DRGGSIDropPod();
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
    handleSupplyPodOrdered(data) {
        if (data.X === undefined || data.Y === undefined || data.Z === undefined)
            return false;
        this.emit('SupplyPod.Ordered', data.X, data.Y, data.Z);
    }
    handleSupplyPodStateChanged(data) {
        if (data.ID === undefined || data.State === undefined)
            return false;
        let pod = this.getSupplyPodByID(data.ID);
        if (!pod) {
            pod = new DRGGSISupplyPod_1.DRGGSISupplyPod(data.ID);
            this._supplyPods.set(data.ID, pod);
        }
        pod.handleStateChanged(data);
        return true;
    }
    handleSupplyPodCharges(data) {
        if (data.ID === undefined || data.Charges === undefined)
            return false;
        let pod = this.getSupplyPodByID(data.ID);
        if (!pod) {
            pod = new DRGGSISupplyPod_1.DRGGSISupplyPod(data.ID);
            this._supplyPods.set(data.ID, pod);
        }
        pod.handleChargesLeftChanged(data);
        return true;
    }
}
exports.DRGGSIMission = DRGGSIMission;
