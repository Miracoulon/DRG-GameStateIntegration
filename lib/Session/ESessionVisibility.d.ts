/**
 * Visibility setting of a DRGGSISession.
 * Uses the same values as those displayed in the games server browser.
 * */
declare enum ESessionVisibility {
    /** The game is set to solo. It does not show on the server browser. Joining is not possible */
    SOLO = 0,
    /** The game is set to private. It does not show on the server browser. Players with an invite link or those on the friends list of the session host can still join */
    PRIVATE = 1,
    /** The game is set to public. It will be shown on the server browser. Everyone can join. */
    PUBLIC = 2
}
export { ESessionVisibility };
