let names: string[] = [
    "AAA",
    "car",
    "M",
    "At",
    "QQQQ"
]

Leaderboard.setLeaderboardColor(1)
Leaderboard.setLeaderboardProperty(LeaderboardProperty.X, 60)
for (let i = 0; i < 11; i++) {
    Leaderboard.addScore(names[Math.randomRange(0, names.length - 1)], Math.randomRange(0, 999))
}
Leaderboard.showScores()
Leaderboard.saveScores()