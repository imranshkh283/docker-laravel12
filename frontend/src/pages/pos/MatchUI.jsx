import React, { useState } from "react";

function App() {
    const styles = {
        app: {
            minHeight: "100vh",
            background: "#07111f",
            color: "#f8fafc",
            fontFamily: "Arial, sans-serif",
            padding: "24px 16px",
            boxSizing: "border-box",
        },
        container: {
            maxWidth: "850px",
            margin: "0 auto",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "28px",
        },
        eyebrow: {
            color: "#38bdf8",
            fontSize: "11px",
            fontWeight: "bold",
            letterSpacing: "3px",
            marginBottom: "8px",
        },
        title: {
            fontSize: "clamp(27px, 5vw, 40px)",
            margin: "0 0 8px",
            fontWeight: "800",
            letterSpacing: "-1px",
        },
        subtitle: {
            color: "#94a3b8",
            margin: 0,
            fontSize: "14px",
        },
        status: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#102d2b",
            color: "#4ade80",
            border: "1px solid #205047",
            borderRadius: "30px",
            padding: "10px 14px",
            fontSize: "11px",
            fontWeight: "bold",
            letterSpacing: "1px",
        },
        liveDot: {
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#4ade80",
            display: "inline-block",
        },
        panel: {
            background: "#101c2d",
            border: "1px solid #233249",
            borderRadius: "18px",
            padding: "22px",
            marginBottom: "22px",
            boxSizing: "border-box",
        },
        sectionTitle: {
            fontSize: "18px",
            fontWeight: "700",
            margin: "0 0 18px",
        },
        inputGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
        },
        input: {
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#091525",
            color: "#f8fafc",
            fontSize: "14px",
            outline: "none",
        },
        scoreboard: {
            background:
                "linear-gradient(135deg, #123c35, #102b35 65%, #102039)",
            border: "1px solid #286052",
            borderRadius: "22px",
            padding: "28px",
            marginBottom: "28px",
            overflow: "hidden",
            boxSizing: "border-box",
        },
        scoreTop: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
        },
        scoreLabel: {
            color: "#a7f3d0",
            fontSize: "12px",
            letterSpacing: "2px",
            fontWeight: "bold",
        },
        inningsBadge: {
            color: "#bbf7d0",
            background: "#1b4b40",
            padding: "7px 10px",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: "bold",
        },
        bigScore: {
            fontSize: "clamp(58px, 12vw, 90px)",
            fontWeight: "800",
            lineHeight: 1.2,
            margin: "12px 0 20px",
            letterSpacing: "-3px",
        },
        wicketScore: {
            color: "#86efac",
            fontSize: "0.65em",
        },
        scoreMeta: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "22px",
            padding: "18px 0",
            borderTop: "1px solid #326055",
            borderBottom: "1px solid #326055",
        },
        metaLabel: {
            display: "block",
            color: "#94a3b8",
            fontSize: "10px",
            letterSpacing: "1.5px",
            fontWeight: "bold",
            marginBottom: "8px",
        },
        metaValue: {
            fontSize: "22px",
            color: "#f8fafc",
        },
        metaDivider: {
            width: "1px",
            height: "36px",
            background: "#326055",
        },
        battingInfo: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            paddingTop: "20px",
            color: "#a7f3d0",
            fontSize: "12px",
        },
        playerGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
        },
        playerCard: {
            background: "#101c2d",
            border: "1px solid #233249",
            borderRadius: "16px",
            padding: "20px",
            boxSizing: "border-box",
            minWidth: 0,
        },
        activePlayer: {
            border: "1px solid #38bdf8",
            background: "linear-gradient(145deg, #122c40, #101c2d)",
            boxShadow: "0 0 0 1px #38bdf822",
        },
        playerTop: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            gap: "8px",
        },
        avatar: {
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1e3a50",
            color: "#7dd3fc",
            fontSize: "21px",
            fontWeight: "bold",
        },
        battingBadge: {
            background: "#164e63",
            color: "#67e8f9",
            fontSize: "10px",
            padding: "7px 9px",
            borderRadius: "7px",
            fontWeight: "bold",
        },
        playerName: {
            fontSize: "19px",
            margin: "0 0 20px",
            overflowWrap: "anywhere",
        },
        playerStats: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            borderTop: "1px solid #29384c",
            paddingTop: "16px",
        },
        playerRuns: {
            display: "block",
            fontSize: "27px",
            color: "#4ade80",
        },
        playerSixes: {
            display: "block",
            fontSize: "27px",
            color: "#fbbf24",
        },
        pendingBox: {
            background: "#091525",
            border: "1px solid #26384e",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
        },
        pendingValue: {
            fontSize: "28px",
            color: "#fbbf24",
        },
        buttonGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "12px",
        },
        actionButton: {
            padding: "16px 12px",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "opacity 0.2s",
        },
        runButton: {
            background: "linear-gradient(135deg, #0284c7, #2563eb)",
        },
        hitButton: {
            background: "linear-gradient(135deg, #16a34a, #15803d)",
        },
        disabledButton: {
            opacity: 0.35,
            cursor: "not-allowed",
        },
        resetButton: {
            width: "100%",
            marginTop: "12px",
            padding: "13px",
            border: "1px solid #334155",
            borderRadius: "10px",
            background: "transparent",
            color: "#cbd5e1",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
        },
        gameOver: {
            marginTop: "18px",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "center",
            background: "#422006",
            border: "1px solid #92400e",
            color: "#fcd34d",
            fontWeight: "bold",
        },
        historyHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
        },
        historyCount: {
            color: "#94a3b8",
            fontSize: "12px",
            background: "#1e293b",
            borderRadius: "20px",
            padding: "7px 10px",
        },
        historyList: {
            display: "flex",
            flexWrap: "wrap",
            gap: "9px",
            minHeight: "42px",
        },
        ball: {
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "bold",
        },
        runBall: {
            background: "#173d35",
            color: "#86efac",
            border: "1px solid #28634e",
        },
        wicketBall: {
            background: "#48212a",
            color: "#fda4af",
            border: "1px solid #843344",
        },
        emptyHistory: {
            color: "#64748b",
            fontSize: "14px",
            padding: "8px 0",
        },
        historyFooter: {
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            color: "#94a3b8",
            fontSize: "12px",
        },
        legendRun: {
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#4ade80",
            marginRight: "7px",
        },
        legendWicket: {
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#fb7185",
            marginRight: "7px",
        },
        footer: {
            padding: "10px 0 4px",
            textAlign: "center",
            color: "#475569",
            fontSize: "10px",
            letterSpacing: "2px",
        },
    };

    const initialPlayers = [
        { name: "", runs: 0, sixes: 0 },
        { name: "", runs: 0, sixes: 0 },
    ];

    const [runs, setRuns] = useState(0);
    const [wickets, setWickets] = useState(0);
    const [balls, setBalls] = useState(0);
    const [pendingRun, setPendingRun] = useState(null);
    const [history, setHistory] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [sixes, setSixes] = useState(0);

    const [players, setPlayers] = useState(initialPlayers);
    const [currentPlayer, setCurrentPlayer] = useState(0);

    const runOptions = [1, 2, 3, 4, 5, 6, "W", "Wide"];

    // Player name update
    const handlePlayerName = (index, name) => {
        setPlayers((prev) =>
            prev.map((player, i) =>
                i === index ? { ...player, name } : player,
            ),
        );
    };

    // Random result select
    const handleRun = () => {
        if (gameOver || pendingRun !== null) return;

        const randomIndex = Math.floor(Math.random() * runOptions.length);

        setPendingRun(runOptions[randomIndex]);
    };

    // Ball ka result apply karna
    const handleHit = () => {
        if (pendingRun === null || gameOver) return;

        const result = pendingRun;

        setHistory((prev) => [...prev, result]);

        // Wide extra delivery hai, legal ball nahi
        if (result === "Wide") {
            setRuns((prev) => prev + 1);
            setPendingRun(null);
            return;
        }

        // Legal delivery
        setBalls((prev) => prev + 1);

        if (result === "W") {
            const nextWickets = wickets + 1;

            setWickets(nextWickets);

            if (nextWickets >= 10) {
                setGameOver(true);
            } else {
                setCurrentPlayer((prev) => (prev + 1) % players.length);
            }
        } else {
            // Team score update
            setRuns((prev) => prev + result);

            // Current player ka score update
            setPlayers((prev) =>
                prev.map((player, index) =>
                    index === currentPlayer
                        ? {
                              ...player,
                              runs: player.runs + result,
                              sixes:
                                  result === 6
                                      ? player.sixes + 1
                                      : player.sixes,
                          }
                        : player,
                ),
            );

            // Total sixes update
            if (result === 6) {
                setSixes((prev) => prev + 1);
            }

            // Odd runs par strike change
            if (result % 2 !== 0) {
                setCurrentPlayer((prev) => (prev + 1) % players.length);
            }
        }

        // Har 6 legal balls ke baad over complete
        const nextBalls = balls + 1;

        if (nextBalls % 6 === 0 && result !== "W") {
            setCurrentPlayer((prev) => (prev + 1) % players.length);
        }

        setPendingRun(null);
    };

    // Game reset
    const handleReset = () => {
        setRuns(0);
        setWickets(0);
        setBalls(0);
        setPendingRun(null);
        setHistory([]);
        setGameOver(false);
        setSixes(0);
        setPlayers(initialPlayers);
        setCurrentPlayer(0);
    };

    return (
        <div style={styles.app}>
            <div style={styles.container}>
                {/* Header */}
                <header style={styles.header}>
                    <div>
                        <div style={styles.eyebrow}>LIVE MATCH CENTER</div>
                        <h1 style={styles.title}>🏏 Cricket Arena</h1>
                        <p style={styles.subtitle}>
                            Every ball counts. Every run matters.
                        </p>
                    </div>

                    <div style={styles.status}>
                        <span style={styles.liveDot} />
                        {gameOver ? "MATCH ENDED" : "LIVE MATCH"}
                    </div>
                </header>

                {/* Player Names */}
                <section style={styles.panel}>
                    <h3 style={styles.sectionTitle}>👥 Players</h3>

                    <div style={styles.inputGrid}>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Player 1 Name"
                            value={players[0].name}
                            onChange={(e) =>
                                handlePlayerName(0, e.target.value)
                            }
                        />

                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Player 2 Name"
                            value={players[1].name}
                            onChange={(e) =>
                                handlePlayerName(1, e.target.value)
                            }
                        />
                    </div>
                </section>

                {/* Main Scoreboard */}
                <section style={styles.scoreboard}>
                    <div style={styles.scoreTop}>
                        <span style={styles.scoreLabel}>TOTAL SCORE</span>
                        <span style={styles.inningsBadge}>
                            {gameOver ? "FINISHED" : "INNINGS IN PROGRESS"}
                        </span>
                    </div>

                    <div style={styles.bigScore}>
                        {runs}
                        <span style={styles.wicketScore}>/{wickets}</span>
                    </div>

                    <div style={styles.scoreMeta}>
                        <div>
                            <span style={styles.metaLabel}>OVERS</span>
                            <strong style={styles.metaValue}>
                                {Math.floor(balls / 6)}.{balls % 6}
                            </strong>
                        </div>

                        <div style={styles.metaDivider} />

                        <div>
                            <span style={styles.metaLabel}>TOTAL SIXES</span>
                            <strong style={styles.metaValue}>{sixes}</strong>
                        </div>

                        <div style={styles.metaDivider} />

                        <div>
                            <span style={styles.metaLabel}>WICKETS</span>
                            <strong style={styles.metaValue}>{wickets}</strong>
                        </div>
                    </div>

                    <div style={styles.battingInfo}>
                        <span>🏏 NOW BATTING</span>
                        <strong>
                            {players[currentPlayer].name ||
                                `Player ${currentPlayer + 1}`}
                        </strong>
                    </div>
                </section>

                {/* Player Scorecards */}
                <section>
                    <h2 style={styles.sectionTitle}>Player Scorecards</h2>

                    <div style={styles.playerGrid}>
                        {players.map((player, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.playerCard,
                                    ...(currentPlayer === index
                                        ? styles.activePlayer
                                        : {}),
                                }}
                            >
                                <div style={styles.playerTop}>
                                    <div style={styles.avatar}>
                                        {(player.name || `P${index + 1}`)
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    {currentPlayer === index && (
                                        <span style={styles.battingBadge}>
                                            BATTING
                                        </span>
                                    )}
                                </div>

                                <h3 style={styles.playerName}>
                                    {player.name || `Player ${index + 1}`}
                                </h3>

                                <div style={styles.playerStats}>
                                    <div>
                                        <span style={styles.metaLabel}>
                                            RUNS
                                        </span>
                                        <strong style={styles.playerRuns}>
                                            {player.runs}
                                        </strong>
                                    </div>

                                    <div>
                                        <span style={styles.metaLabel}>
                                            SIXES
                                        </span>
                                        <strong style={styles.playerSixes}>
                                            {player.sixes}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Ball Controls */}
                <section style={styles.panel}>
                    <h2 style={styles.sectionTitle}>🎯 Play the Next Ball</h2>

                    <div style={styles.pendingBox}>
                        <span style={styles.metaLabel}>PENDING RUN</span>
                        <strong style={styles.pendingValue}>
                            {pendingRun === null ? "—" : pendingRun}
                        </strong>
                    </div>

                    <div style={styles.buttonGrid}>
                        <button
                            style={{
                                ...styles.actionButton,
                                ...styles.runButton,
                                ...(gameOver || pendingRun !== null
                                    ? styles.disabledButton
                                    : {}),
                            }}
                            onClick={handleRun}
                            disabled={gameOver || pendingRun !== null}
                        >
                            🎲 Run
                        </button>

                        <button
                            style={{
                                ...styles.actionButton,
                                ...styles.hitButton,
                                ...(gameOver || pendingRun === null
                                    ? styles.disabledButton
                                    : {}),
                            }}
                            onClick={handleHit}
                            disabled={gameOver || pendingRun === null}
                        >
                            🏏 Hit
                        </button>
                    </div>

                    <button style={styles.resetButton} onClick={handleReset}>
                        ↻ Reset Game
                    </button>

                    {gameOver && (
                        <div style={styles.gameOver}>🏆 All Out! Game Over</div>
                    )}
                </section>

                {/* Ball History */}
                <section style={styles.panel}>
                    <div style={styles.historyHeader}>
                        <h2 style={styles.sectionTitle}>📊 Ball History</h2>
                        <span style={styles.historyCount}>
                            {history.length} balls
                        </span>
                    </div>

                    <div style={styles.historyList}>
                        {history.length === 0 ? (
                            <p style={styles.emptyHistory}>
                                No balls played yet. Start your innings!
                            </p>
                        ) : (
                            history.map((item, index) => (
                                <span
                                    key={index}
                                    style={{
                                        ...styles.ball,
                                        ...(item === "W"
                                            ? styles.wicketBall
                                            : styles.runBall),
                                    }}
                                    title={`Ball ${index + 1}`}
                                >
                                    {item}
                                </span>
                            ))
                        )}
                    </div>

                    <div style={styles.historyFooter}>
                        <span>
                            <span style={styles.legendRun} /> Runs
                        </span>
                        <span>
                            <span style={styles.legendWicket} /> Wicket
                        </span>
                    </div>
                </section>

                <footer style={styles.footer}>
                    MADE FOR THE LOVE OF CRICKET 🏏
                </footer>
            </div>
        </div>
    );
}

export default App;
