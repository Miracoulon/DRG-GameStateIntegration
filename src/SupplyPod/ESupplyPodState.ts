//** The state of a ResupplyPod */
enum ESupplyPodState {
    /** Spawned. Waiting to start dropping */
    ReadyToDrop = 0,
    /** Dropping to designated landing zone */
    Dropping = 1,
    /** Just impacted the ground */
    Landed = 2,
    /** Deployed and ready to be used by players */
    Idle = 3,
}

export { ESupplyPodState };