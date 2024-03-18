"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESessionVisibility = void 0;
/**
 * Visibility setting of a DRGGSISession.
 * Uses the same values as those displayed in the games server browser.
 * */
var ESessionVisibility;
(function (ESessionVisibility) {
    /** The game is set to solo. It does not show on the server browser. Joining is not possible */
    ESessionVisibility[ESessionVisibility["SOLO"] = 0] = "SOLO";
    /** The game is set to private. It does not show on the server browser. Players with an invite link or those on the friends list of the session host can still join */
    ESessionVisibility[ESessionVisibility["PRIVATE"] = 1] = "PRIVATE";
    /** The game is set to public. It will be shown on the server browser. Everyone can join. */
    ESessionVisibility[ESessionVisibility["PUBLIC"] = 2] = "PUBLIC";
})(ESessionVisibility || (ESessionVisibility = {}));
exports.ESessionVisibility = ESessionVisibility;
