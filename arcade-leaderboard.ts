enum ScoreTypes {
    //% block="highest score"
    HighestScore,
    //% block="lowest score"
    LowestScore
}

enum LeaderboardProperty {
    //% block="max name lenght"
    MaxNameLenght,
    //% block="x"
    X,
    //% block="top"
    Top,
    //% block="z"
    Z
}

//% block="Leaderboard"
//% color="#228576"
//% groups="['Basic', 'Saving', 'Customization', 'Entries']"
namespace leaderboard {

    export class ScoreEntry {
        constructor(public name: string, public score: number) { }
    }

    const RANKS: string[] = [
        " 1ST",
        " 2ND",
        " 3RD",
        " 4TH",
        " 5TH",
        " 6TH",
        " 7TH",
        " 8TH",
        " 9TH",
        "10TH",
        "11TH",
        "12TH"
    ]

    let scores: ScoreEntry[] = []
    // load the scores
    if (blockSettings.exists("leaderboard-scores")) {
        for (let score of blockSettings.readStringArray("leaderboard-scores")) {
            let currentScore = score.split(":")
            scores.push(new ScoreEntry(currentScore[0], parseInt(currentScore[1])))
        }
    }
    sortScores()

    let scoreType: ScoreTypes = ScoreTypes.HighestScore

    function sortScores() {
        switch (scoreType) {
            case ScoreTypes.HighestScore:
                scores = scores.slice().sort((a, b) => b.score - a.score);
                break;
            case ScoreTypes.LowestScore:
                scores = scores.slice().sort((a, b) => a.score - b.score);
                break;
        }

        if (scores.length > maxSaveAmount) {
            scores = scores.slice(0, maxSaveAmount);
        }
    }

    //% block="set score type to $type"
    //% blockId="leaderboardSetScoreType"
    //% group="Basic"
    //% weight=100
    export function setScoreType(type: ScoreTypes) {
        scoreType = type
        sortScores()
    }

    //% block="add score with name $name and score $score"
    //% blockId="leaderboardAddScore"
    //% group="Basic"
    //% weight=99
    export function addScore(name: string, score: number) {
        scores.push(new ScoreEntry(name, score))
        sortScores()
    }

    let scoreScreen: scene.Renderable
    let leaderboardZ: number = 100

    const font: image.Font = image.font5

    //% block
    //% blockId="leaderboardShowScores"
    //% group="Basic"
    //% weight=20
    export function showScores() {
        scoreScreen = scene.createRenderable(leaderboardZ, (screen, camera) => {
            let y = leaderboardTop;

            for (let i = 0; i < scores.length; i++) {
                const score: ScoreEntry = scores[i]
                const rank: string = RANKS[i]
                
                let name = score.name
                name = name.substr(0, maxNameLenght)
                for (let i = name.length; i < maxNameLenght; i++) {
                    name += " "
                }
                name = name.toUpperCase()

                if (ranksEnabled) {
                    screen.print(rank + "  " + name + "  " + score.score, leaderboardX, y, leaderboardColor, font)
                }
                else {
                    screen.print(name + "  " + score.score, leaderboardX, y, leaderboardColor, font)
                }
                y += 8
            }
        })
    }

    //% block
    //% blockId="leaderboardHideScores"
    //% group="Basic"
    //% weight=19
    export function hideScores() {
        scoreScreen.destroy()
    }

    let saveScoreList: string[] = []

    //% block
    //% blockId="leaderboardSaveScores"
    //% group="Saving"
    //% weight=100
    export function saveScores() {
        sortScores()

        for (let score of scores) {
            saveScoreList.push(score.name + ":" + score.score)
        }

        blockSettings.writeStringArray("leaderboard-scores", saveScoreList)
    }

    //% block
    //% blockId="leaderboardClearScores"
    //% group="Saving"
    //% weight=99
    export function clearAllScores() {
        blockSettings.remove("leaderboard-scores")
    }

    // leaderboard settings
    let maxNameLenght: number = 3
    let leaderboardX: number = 60
    let leaderboardTop: number = 22
    let maxSaveAmount: number = 12
    let leaderboardColor: number = 1

    let ranksEnabled: boolean = true

    //% block="set leaderboard $property to $value"
    //% blockId="leaderboardChangeProperty"
    //% group="Customization"
    //% weight=100
    export function setLeaderboardProperty(property: LeaderboardProperty, value: number) {
        if (property == LeaderboardProperty.MaxNameLenght) {
            maxNameLenght = value
        }
        else if (property == LeaderboardProperty.X) {
            leaderboardX = value
        }
        else if (property == LeaderboardProperty.Top) {
            leaderboardTop = value
        }
        else if (property == LeaderboardProperty.Z) {
            leaderboardZ = value
        }
    }

    //% block="set leaderboard color to $color"
    //% blockId="leaderboardChangeColor"
    //% group="Customization"
    //% weight=99
    //% color.shadow="colorindexpicker"
    //% color.defl=1
    export function setLeaderboardColor(color: number) {
        leaderboardColor = color
    }

    //% block="leaderboard $property"
    //% blockId="leaderboardGetProperty"
    //% group="Customization"
    //% weight=50
    export function getLeaderboardProperty(property: LeaderboardProperty): number {
        if (property == LeaderboardProperty.MaxNameLenght) {
            return maxNameLenght
        }
        else if (property == LeaderboardProperty.X) {
            return leaderboardX
        }
        else if (property == LeaderboardProperty.Top) {
            return leaderboardTop
        }
        else if (property == LeaderboardProperty.Z) {
            return leaderboardZ
        }

        return 0
    }

    //% block="leaderboard color"
    //% blockId="leaderboardGetColor"
    //% group="Customization"
    //% weight=49
    export function getLeaderboardColor(): number {
        return leaderboardColor
    }

    //% block="turn ranks $on"
    //% blockId="leaderboardEnableRanks"
    //% group="Customization"
    //% weight=149
    //% on.shadow="toggleOnOff"
    //% on.defl=true
    export function enableRanks(on: boolean) {
        ranksEnabled = on
    }

    //% block="ranks enabled"
    //% blockId="leaderboardGetRanksEnabled"
    //% group="Customization"
    //% weight=148
    export function getRanksEnabled(): boolean {
        return ranksEnabled
    }

    //% block="entry at place $place"
    //% blockId="leaderboardGetEntry"
    //% group="Entries"
    //% weight=99
    //% place.defl=1
    //% place.min=1 place.max=12
    export function getEntryAt(place: number): ScoreEntry {
        return scores[place - 1]
    }

    //% block="remove $entry"
    //% blockId="leaderboardRemoveEntry"
    //% group="Entries"
    //% weight=98
    //% entry.shadow=leaderboardGetEntry
    export function removeScore(entry: ScoreEntry) {
        scores = scores.filter((item) => item !== entry);
    }

    //% block="get $entry name"
    //% blockId="leaderboardGetEntryName"
    //% group="Entries"
    //% weight=49
    //% entry.shadow=leaderboardGetEntry
    export function getEntryName(entry: ScoreEntry): string {
        return entry.name.toUpperCase()
    }

    //% block="get $entry score"
    //% blockId="leaderboardGetEntryScore"
    //% group="Entries"
    //% weight=48
    //% entry.shadow=leaderboardGetEntry
    export function getEntryScore(entry: ScoreEntry): number {
        return entry.score
    }

    //% block="array of all scores"
    //% blockId="leaderboardGetArrayOfScores"
    //% group="Entries"
    //% weight=39
    export function getAllScores(): ScoreEntry[] {
        sortScores()
        return scores
    }
}
