DRGGSI
{
    Team (DRGGSITeam): {
        Players: Map<number, DRGGSIPlayer>,
        Resources (DRGGSIResourceInventory): {
            function getResourceAmount(resource: string): number
        }
    },
    Mission (DRGGSIMission): {
        MissionName: string,
        Biome: string,
        Template: string,
        DNA: string,
        Complexity: string,
        ComplexityDots: number,
        Duration: string,
        DurationDots: number,
        Seeds: {
            Procedural: number,
            Mission: number,
            Global: number,
        }
        ProceduralSeed: number,
        MissionSeed: number,
        GlobalSeed: number,
        Anomaly: string,
        Warnings: [string],
        WarningCount: number,

        MissionTimeSeconds: number,
        
        SupplyPods: Map<number, DRGGSISupplyPod>,

        LandingPod (DRGGSIDropPod): {

        },
        EscapePod (DRGGSIDropPod): {

        },
    }
}