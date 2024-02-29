/**
 * The general state of a player.
 * Most of the time has a direct impact on a players movement capabilities.
 * */
declare enum EPlayerState {
    Walking = 0,
    Downed = 1,
    Dead = 2,
    Falling = 3,
    Paralyzed = 4,
    Using = 5,
    Zipline = 6,
    NoMovement = 7,
    Grabbed = 8,
    Flying = 9,
    Frozen = 10,
    PassedOut = 11,
    Photography = 12,
    Piloting = 13,
    Attached = 14,
    Pushing = 15,
    TrackMovement = 16,
    EnemyControl = 17,
    Infected = 18,
    Invalid = 255
}
export { EPlayerState };
