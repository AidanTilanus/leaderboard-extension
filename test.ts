let names: string[] = [
    "AAA",
    "car",
    "M",
    "At",
    "QQQQ",
    "Dog",
    "cat"
]

controller.menu.onEvent(ControllerButtonEvent.Pressed, function() {
    leaderboard.clearAllScores()
    leaderboard.hideScores()
})

leaderboard.setLeaderboardColor(1)
leaderboard.setLeaderboardProperty(LeaderboardProperty.X, 15)
leaderboard.setLeaderboardProperty(LeaderboardProperty.Top, 15)
for (let i = 0; i < 11; i++) {
    leaderboard.addScore(names[Math.randomRange(0, names.length - 1)], Math.randomRange(0, 999))
}
leaderboard.showScores()
leaderboard.saveScores()
