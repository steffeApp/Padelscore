 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/pages/PadelScorePage.jsx b/src/pages/PadelScorePage.jsx
new file mode 100644
index 0000000000000000000000000000000000000000..891f91b3737060999891207252eada13f152bfff
--- /dev/null
+++ b/src/pages/PadelScorePage.jsx
@@ -0,0 +1,230 @@
+import { useMemo, useReducer } from "react";
+
+const POINT_LABELS = ["0", "15", "30", "40"];
+
+const initialState = {
+  points: [0, 0],
+  games: [0, 0],
+  sets: [0, 0],
+  commands: [],
+  workoutActive: false,
+  matchStartedAt: null,
+};
+
+function cloneState(state) {
+  return {
+    points: [...state.points],
+    games: [...state.games],
+    sets: [...state.sets],
+    commands: [...state.commands],
+    workoutActive: state.workoutActive,
+    matchStartedAt: state.matchStartedAt,
+  };
+}
+
+function addPoint(state, winner) {
+  const next = cloneState(state);
+  const loser = winner === 0 ? 1 : 0;
+
+  if (!next.matchStartedAt) {
+    next.matchStartedAt = new Date().toISOString();
+  }
+
+  const winnerPoint = next.points[winner];
+  const loserPoint = next.points[loser];
+
+  if (winnerPoint <= 2) {
+    next.points[winner] += 1;
+    return next;
+  }
+
+  if (winnerPoint === 3 && loserPoint <= 2) {
+    return awardGame(next, winner);
+  }
+
+  if (winnerPoint === 3 && loserPoint === 3) {
+    next.points[winner] = 4;
+    return next;
+  }
+
+  if (winnerPoint === 4) {
+    return awardGame(next, winner);
+  }
+
+  if (loserPoint === 4) {
+    next.points[loser] = 3;
+    return next;
+  }
+
+  return next;
+}
+
+function awardGame(state, winner) {
+  const next = cloneState(state);
+  const loser = winner === 0 ? 1 : 0;
+
+  next.points = [0, 0];
+  next.games[winner] += 1;
+
+  const winnerGames = next.games[winner];
+  const loserGames = next.games[loser];
+
+  if (winnerGames >= 6 && winnerGames - loserGames >= 2) {
+    next.games = [0, 0];
+    next.sets[winner] += 1;
+  }
+
+  return next;
+}
+
+function labelFromPoints(points) {
+  const [a, b] = points;
+
+  if (a >= 3 && b >= 3) {
+    if (a === b) return "Deuce";
+    if (a > b) return "Adv A";
+    return "Adv B";
+  }
+
+  return `${POINT_LABELS[a]} - ${POINT_LABELS[b]}`;
+}
+
+function reducer(state, action) {
+  switch (action.type) {
+    case "POINT_A": {
+      const next = addPoint(state, 0);
+      next.commands = [...state.commands, "POINT_A"];
+      return next;
+    }
+    case "POINT_B": {
+      const next = addPoint(state, 1);
+      next.commands = [...state.commands, "POINT_B"];
+      return next;
+    }
+    case "UNDO": {
+      if (state.commands.length === 0) return state;
+      const replayCommands = state.commands.slice(0, -1);
+      return replayCommands.reduce(
+        (acc, event) => reducer(acc, { type: event }),
+        {
+          ...initialState,
+          workoutActive: state.workoutActive,
+          matchStartedAt: state.matchStartedAt,
+        }
+      );
+    }
+    case "TOGGLE_WORKOUT":
+      return {
+        ...state,
+        workoutActive: !state.workoutActive,
+      };
+    case "RESET":
+      return {
+        ...initialState,
+        workoutActive: state.workoutActive,
+      };
+    default:
+      return state;
+  }
+}
+
+export default function PadelScorePage() {
+  const [state, dispatch] = useReducer(reducer, initialState);
+
+  const scoreLabel = useMemo(() => labelFromPoints(state.points), [state.points]);
+
+  const matchDuration = useMemo(() => {
+    if (!state.matchStartedAt) return "00:00";
+    const seconds = Math.max(
+      0,
+      Math.floor((Date.now() - new Date(state.matchStartedAt).getTime()) / 1000)
+    );
+    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
+    const secs = String(seconds % 60).padStart(2, "0");
+    return `${mins}:${secs}`;
+  }, [state.matchStartedAt, state.commands.length]);
+
+  return (
+    <div className="max-w-4xl mx-auto p-4 space-y-4">
+      <h1 className="text-2xl font-bold">Padel testläge: iPhone + Apple Watch</h1>
+
+      <div className="grid md:grid-cols-2 gap-4">
+        <section className="bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-700">
+          <h2 className="font-semibold text-lg">iPhone-display (publikvy)</h2>
+          <div className="text-sm text-gray-300">Matchtid: {matchDuration}</div>
+          <div className="text-sm text-gray-300">
+            Workout: {state.workoutActive ? "Aktiv (bakgrund)" : "Av"}
+          </div>
+          <div className="bg-gray-900 rounded-lg p-4 text-center">
+            <div className="text-sm text-gray-400">Sets</div>
+            <div className="text-3xl font-bold">{state.sets[0]} - {state.sets[1]}</div>
+            <div className="text-sm text-gray-400 mt-2">Games</div>
+            <div className="text-2xl font-semibold">{state.games[0]} - {state.games[1]}</div>
+            <div className="text-sm text-gray-400 mt-2">Aktuellt game</div>
+            <div className="text-4xl font-extrabold text-orange-400">{scoreLabel}</div>
+          </div>
+          <div className="flex gap-2">
+            <button
+              onClick={() => dispatch({ type: "TOGGLE_WORKOUT" })}
+              className="bg-green-600 hover:bg-green-500 rounded-lg px-3 py-2"
+            >
+              {state.workoutActive ? "Stoppa workout" : "Starta workout"}
+            </button>
+            <button
+              onClick={() => dispatch({ type: "RESET" })}
+              className="bg-red-600 hover:bg-red-500 rounded-lg px-3 py-2"
+            >
+              Återställ match
+            </button>
+          </div>
+        </section>
+
+        <section className="bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-700">
+          <h2 className="font-semibold text-lg">Apple Watch-kontroll (simulerad)</h2>
+          <p className="text-sm text-gray-300">
+            Här kan du testa exakt det flöde du beskrev: score är primärt, workout fortsätter i
+            bakgrunden.
+          </p>
+
+          <div className="grid grid-cols-2 gap-2">
+            <button
+              onClick={() => dispatch({ type: "POINT_A" })}
+              className="text-xl font-bold bg-blue-600 hover:bg-blue-500 rounded-xl py-4"
+            >
+              + Poäng Lag A
+            </button>
+            <button
+              onClick={() => dispatch({ type: "POINT_B" })}
+              className="text-xl font-bold bg-purple-600 hover:bg-purple-500 rounded-xl py-4"
+            >
+              + Poäng Lag B
+            </button>
+          </div>
+
+          <div className="flex gap-2">
+            <button
+              onClick={() => dispatch({ type: "UNDO" })}
+              className="bg-gray-600 hover:bg-gray-500 rounded-lg px-3 py-2"
+            >
+              Ångra senaste
+            </button>
+          </div>
+
+          <div className="text-xs text-gray-400">
+            Händelser: {state.commands.length === 0 ? "inga" : state.commands.join(" → ")}
+          </div>
+        </section>
+      </div>
+
+      <section className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-sm text-gray-300">
+        <h3 className="font-semibold text-white mb-2">Så testar du nu</h3>
+        <ol className="list-decimal list-inside space-y-1">
+          <li>Starta workout i panelen till vänster.</li>
+          <li>Klicka på poängknapparna i panelen till höger.</li>
+          <li>Verifiera att iPhone-vyn uppdateras direkt.</li>
+          <li>Använd Ångra för att simulera feltryck.</li>
+        </ol>
+      </section>
+    </div>
+  );
+}
 
EOF
)
