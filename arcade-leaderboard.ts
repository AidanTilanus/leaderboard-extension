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
namespace Leaderboard {

    export class ScoreEntry {
        constructor(public name: string, public score: number) { }
    }

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
            default:
                break;
        }

        if (scores.length > 12) {
            scores = scores.slice(0, 12);
        }
    }

    //% block="set score type to $type"
    //% blockId="leaderboardSetScoreType"
    //% group="Basic"
    //% weight=100
    export function setScoreType(type: ScoreTypes) {
        scoreType = type
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

    //% block
    //% blockId="leaderboardShowScores"
    //% group="Basic"
    //% weight=20
    export function showScores() {
        scoreScreen = scene.createRenderable(leaderboardZ, (screen, camera) => {
            let y = leaderboardTop;

            for (const score of scores) {
                let name = score.name
                name = name.substr(0, maxNameLenght)
                for (let i = name.length; i < maxNameLenght; i++) {
                    name += " "
                }
                name = name.toUpperCase()

                screen.print(name + " " + score.score, leaderboardX, y, leaderboardColor, image.font5)
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
    let leaderboardColor: number = 1

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

    //% block="get entry at place $place"
    //% blockId="leaderboardGetEntry"
    //% group="Entries"
    //% weight=99
    //% place.defl=1
    //% place.min=1 place.max=12
    export function getEntryAt(place: number): ScoreEntry {
        return scores[place - 1]
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
}
