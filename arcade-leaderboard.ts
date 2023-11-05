enum ScoreTypes {
    //% block="highest score"
    HighestScore,
    //% block="lowest score"
    LowestScore
}

//% block="Leaderboard"
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
                // Handle the default case, e.g., do nothing or show an error message.
                break;
        }

        if (scores.length > 9) {
            scores = scores.slice(0, 9);
        }
    }

    //% block="set score type to $type"
    export function setScoreType(type: ScoreTypes) {
        scoreType = type
    }

    //% block="add score with name $name and score $score"
    export function addScore(name: string, score: number) {
        scores.push(new ScoreEntry(name, score))
        sortScores()
    }

    let scoreScreen: scene.Renderable

    //% block
    export function showScores() {
        scoreScreen = scene.createRenderable(1, (screen, camera) => {
            let y = 16;

            for (const score of scores) {
                let name = score.name
                switch (name.length) {
                    case (1):
                        name += " "
                    case (2):
                        name += " "
                }
                name = name.toUpperCase()

                screen.print(name + " " + score.score, 16, y)
                y += 10
            }
        })
    }

    //% block
    export function hideScores() {
        scoreScreen.destroy()
    }

    let saveScoreList: string[] = []

    //% block
    export function saveScores() {
        sortScores()

        for (let score of scores) {
            saveScoreList.push(score.name + ":" + score.score)
        }

        blockSettings.writeStringArray("leaderboard-scores", saveScoreList)
    }

    //% block
    export function clearAllScores() {
        blockSettings.remove("leaderboard-scores")
    }
}
