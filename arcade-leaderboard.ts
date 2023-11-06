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

    // leaderboard settings
    let maxNameLenght: number = 3
    let x: number = 16
    let top: number = 16
    let color: number = 1

    //% block="set leaderboard $property to $value"
    //% group="Customization"
    export function setLeaderboardProperty(property: LeaderboardProperty, value: number) {
        if (property == LeaderboardProperty.MaxNameLenght) {
            maxNameLenght = value
        }
        else if (property == LeaderboardProperty.X) {
            x = value
        }
        else if (property == LeaderboardProperty.Top) {
            top = value
        }
    }

    //% block="set leaderboard color to $color"
    //% color.shadow="colorindexpicker"
    //% color.defl=1
    //% group="Customization"
    export function setLeaderboardColor(color: number) {
        color = color
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
                // Handle the default case, e.g., do nothing or show an error message.
                break;
        }

        if (scores.length > 9) {
            scores = scores.slice(0, 9);
        }
    }

    //% block="set score type to $type"
    //% group="Basic"
    export function setScoreType(type: ScoreTypes) {
        scoreType = type
    }

    //% block="add score with name $name and score $score"
    //% group="Basic"
    export function addScore(name: string, score: number) {
        scores.push(new ScoreEntry(name, score))
        sortScores()
    }

    let scoreScreen: scene.Renderable

    //% block
    //% group="Basic"
    export function showScores() {
        scoreScreen = scene.createRenderable(1, (screen, camera) => {
            let y = top;

            for (const score of scores) {
                let name = score.name
                name = name.substr(0, maxNameLenght)
                for (let i = name.length; i < maxNameLenght; i++) {
                    name += " "
                }
                name = name.toUpperCase()

                screen.print(name + " " + score.score, x, y, color)
                y += 10
            }
        })
    }

    //% block
    //% group="Basic"
    export function hideScores() {
        scoreScreen.destroy()
    }

    let saveScoreList: string[] = []

    //% block
    //% group="Saving"
    export function saveScores() {
        sortScores()

        for (let score of scores) {
            saveScoreList.push(score.name + ":" + score.score)
        }

        blockSettings.writeStringArray("leaderboard-scores", saveScoreList)
    }

    //% block
    //% group="Saving"
    export function clearAllScores() {
        blockSettings.remove("leaderboard-scores")
    }
}
