 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/docs/padel-watch-app-plan.md b/docs/padel-watch-app-plan.md
new file mode 100644
index 0000000000000000000000000000000000000000..b43cb7bf148c80762e598732fa01f4164d1edda5
--- /dev/null
+++ b/docs/padel-watch-app-plan.md
@@ -0,0 +1,154 @@
+# Padel-app med iPhone-display och Apple Watch-styrning
+
+Detta dokument beskriver en rekommenderad lösning för en padel-app där:
+
+1. **iPhone visar matchens score tydligt för spelare/publik**.
+2. **Apple Watch används för snabb poänguppdatering**.
+3. **Träning kan loggas samtidigt i bakgrunden via Workout**.
+4. **Score-vyn är den primära vyn på klockan under matchen**.
+
+## Produktkrav (från användarflödet)
+
+- Starta en match på iPhone.
+- Välja matchtyp: singel/dubbel.
+- Enkel poänginmatning på Apple Watch (t.ex. “+ Team A”, “+ Team B”, “Undo”).
+- iPhone uppdateras direkt när poäng ändras på klockan.
+- Workout ska kunna startas och fortsätta logga träning utan att scoreflödet störs.
+- När matchen avslutas sparas:
+  - resultat,
+  - set-fördelning,
+  - tidsåtgång,
+  - (valfritt) puls/energi från HealthKit.
+
+## Rekommenderad teknisk arkitektur
+
+## 1) Appar och targets
+
+- **iOS-app (SwiftUI)**
+  - Primär display för score.
+  - Matchinställningar och historik.
+- **watchOS-app (SwiftUI)**
+  - Primär interaktion för poängknappar.
+  - Kompakt scorevy med tydlig typografi.
+
+## 2) Delad domänmodell
+
+Skapa en delad modell i ett gemensamt modul-lager (om möjligt):
+
+- `MatchState`
+- `Team`
+- `PointState`
+- `SetState`
+- `TiebreakState`
+- `MatchConfig`
+
+Viktig princip: all poänglogik ska vara deterministisk och testbar.
+
+## 3) Realtid mellan Watch och iPhone
+
+Använd **WatchConnectivity**:
+
+- `sendMessage` för låg-latens-kommandon (t.ex. "point_won_team_a").
+- `updateApplicationContext` för senaste fulla state (återställning/synk).
+- `transferUserInfo` för robust leverans när enheter tillfälligt tappar kontakt.
+
+Konflikthantering:
+
+- iPhone som “source of truth” för full matchstate.
+- Watch skickar kommandon, iPhone kvitterar och returnerar uppdaterad state.
+- Lägg till versionsnummer/timestamp i state för att kunna ignorera gamla uppdateringar.
+
+## 4) Workout i bakgrunden + score som primär UX
+
+Använd **HealthKit + WorkoutKit/HKWorkoutSession** för att logga träning.
+
+Rekommenderad strategi på watch:
+
+1. Starta workoutsession (t.ex. “Other” eller “Racquet Sports” beroende på behov).
+2. Fortsätt visa score-UI i din app som primär vy.
+3. Hantera återupptagning när användaren går tillbaka till appen (state restoration).
+4. Spara workout och koppla den till matchens id vid matchslut.
+
+Notera:
+
+- watchOS har begränsningar för bakgrundskörning.
+- En aktiv workoutsession förbättrar möjligheten att hålla appflödet aktivt och samla träningsdata.
+
+## UX-förslag för Apple Watch
+
+Minimal layout (stor text, få tryck):
+
+- Överst: setstatus (ex. `1-0` i set).
+- Mitten: aktuell game-poäng (ex. `40-30`).
+- Stora knappar:
+  - `+ A`
+  - `+ B`
+- Sekundär rad:
+  - `Ångra`
+  - `Byt serve` (valfritt)
+  - `Tiebreak` (om manuellt läge)
+
+Interaktionsprincip:
+
+- Ett tryck = en händelse.
+- Haptisk feedback vid registrerad poäng.
+- Tydlig bekräftelse om uppkoppling saknas (lokal kö + synk senare).
+
+## Poängmotor (padel/tennis)
+
+Implementera regelmotor separat från UI:
+
+- Game-poäng: 0, 15, 30, 40.
+- Deuce/advantage.
+- Tiebreak-regler (konfigurerbar till 7 eller 10 poäng).
+- Set-vinstregler (ofta först till 6 med 2 games marginal).
+
+Lägg till “event sourcing light”:
+
+- Spara varje händelse (`POINT_TEAM_A`, `UNDO`, etc.).
+- Beräkna nuvarande state från eventlistan.
+- Ger robust “undo” och bättre felsökning.
+
+## Datamodell för matchhändelser
+
+Exempel på event:
+
+```json
+{
+  "id": "evt_123",
+  "matchId": "match_456",
+  "type": "POINT_TEAM_A",
+  "createdAt": "2026-04-15T12:00:00Z",
+  "source": "watch",
+  "sequence": 42
+}
+```
+
+## MVP-plan (4 etapper)
+
+1. **MVP 1 – Lokal scoring i iPhone-app**
+   - Poängmotor + UI + matchreset/undo.
+2. **MVP 2 – Watch som fjärrkontroll**
+   - WatchConnectivity + live-sync.
+3. **MVP 3 – Workoutintegration**
+   - Start/stop workout, lagring av träningsmetadata.
+4. **MVP 4 – Historik och export**
+   - Matchlista, enkel statistik, HealthKit-koppling.
+
+## Risker och hur de hanteras
+
+- **Fördröjd synk mellan enheter**
+  - Lokal optimistic update på watch + iPhone-kvittens.
+- **Feltryck under intensivt spel**
+  - Stor knappyta, undo-knapp alltid synlig.
+- **State tappas vid avbrott**
+  - Persistens av eventlokalt på båda enheter.
+- **Battery impact**
+  - Begränsa onödiga uppdateringsfrekvenser och animationer.
+
+## Nästa konkreta steg
+
+- Bekräfta regelvariant ni spelar med (golden point/deuce, tiebreak-format).
+- Ta fram wireframe för watch-skärmen (1 huvudvy + 1 fallbackvy).
+- Implementera poängmotor med enhetstester innan UI-koppling.
+- Bygg WatchConnectivity-lager med tydlig protokollversion.
 
EOF
)padel
