"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPlayerState = void 0;
/**
 * The general state of a player.
 * Most of the time has a direct impact on a players movement capabilities.
 * */
var EPlayerState;
(function (EPlayerState) {
    EPlayerState[EPlayerState["Walking"] = 0] = "Walking";
    EPlayerState[EPlayerState["Downed"] = 1] = "Downed";
    EPlayerState[EPlayerState["Dead"] = 2] = "Dead";
    EPlayerState[EPlayerState["Falling"] = 3] = "Falling";
    EPlayerState[EPlayerState["Paralyzed"] = 4] = "Paralyzed";
    EPlayerState[EPlayerState["Using"] = 5] = "Using";
    EPlayerState[EPlayerState["Zipline"] = 6] = "Zipline";
    EPlayerState[EPlayerState["NoMovement"] = 7] = "NoMovement";
    EPlayerState[EPlayerState["Grabbed"] = 8] = "Grabbed";
    EPlayerState[EPlayerState["Flying"] = 9] = "Flying";
    EPlayerState[EPlayerState["Frozen"] = 10] = "Frozen";
    EPlayerState[EPlayerState["PassedOut"] = 11] = "PassedOut";
    EPlayerState[EPlayerState["Photography"] = 12] = "Photography";
    EPlayerState[EPlayerState["Piloting"] = 13] = "Piloting";
    EPlayerState[EPlayerState["Attached"] = 14] = "Attached";
    EPlayerState[EPlayerState["Pushing"] = 15] = "Pushing";
    EPlayerState[EPlayerState["TrackMovement"] = 16] = "TrackMovement";
    EPlayerState[EPlayerState["EnemyControl"] = 17] = "EnemyControl";
    EPlayerState[EPlayerState["Infected"] = 18] = "Infected";
    EPlayerState[EPlayerState["Invalid"] = 255] = "Invalid";
})(EPlayerState || (EPlayerState = {}));
exports.EPlayerState = EPlayerState;
