"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESupplyPodState = void 0;
//** The state of a ResupplyPod */
var ESupplyPodState;
(function (ESupplyPodState) {
    /** Spawned. Waiting to start dropping */
    ESupplyPodState[ESupplyPodState["ReadyToDrop"] = 0] = "ReadyToDrop";
    /** Dropping to designated landing zone */
    ESupplyPodState[ESupplyPodState["Dropping"] = 1] = "Dropping";
    /** Just impacted the ground */
    ESupplyPodState[ESupplyPodState["Landed"] = 2] = "Landed";
    /** Deployed and ready to be used by players */
    ESupplyPodState[ESupplyPodState["Idle"] = 3] = "Idle";
})(ESupplyPodState || (ESupplyPodState = {}));
exports.ESupplyPodState = ESupplyPodState;
