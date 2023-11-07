enum ScoreTypes {
    //% block="highest score"
    HighestScore,
    //% block="lowest score"
    LowestScore
}

enum LeaderboardProperty {
    MaxNameLenght,
    X,
    Top
}

//% block="Leaderboard"
//% groups="['Basic', 'Saving', 'Customization']"
namespace Leaderboard {

    class ScoreEntry {
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
    //% group="Basic"
    //% weight=100
    export function setScoreType(type: ScoreTypes) {
        scoreType = type
    }

    //% block="add score with name $name and score $score"
    //% group="Basic"
    //% weight=99
    export function addScore(name: string, score: number) {
        scores.push(new ScoreEntry(name, score))
        sortScores()
    }

    let scoreScreen: scene.Renderable

    //% block
    //% group="Basic"
    //% weight=20
    export function showScores() {
        scoreScreen = scene.createRenderable(1, (screen, camera) => {
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
    //% group="Basic"
    //% weight=19
    export function hideScores() {
        scoreScreen.destroy()
    }

    let saveScoreList: string[] = []

    //% block
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
    }

    //% block="set leaderboard color to $color"
    //% group="Customization"
    //% weight=99
    //% color.shadow="colorindexpicker"
    //% color.defl=1
    export function setLeaderboardColor(color: number) {
        leaderboardColor = color
    }
}
