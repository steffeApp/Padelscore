 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/App.jsx b/src/App.jsx
index f2baa2c5489681b6ae2c5663f22361c01241a2df..07a1d39ffe4eae526f27f4818e582688a2b942bc 100644
--- a/src/App.jsx
+++ b/src/App.jsx
@@ -1,33 +1,34 @@
 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import { useState, createContext, useEffect } from "react";
 import Layout from "./Layout.jsx";
 
 import MapPage from "./pages/MapPage_Sim.jsx";
 import WarningZones from "./pages/WarningZones.jsx";
 import CommunityPage from "./pages/CommunityPage.jsx";
 import ProfilePage from "./pages/ProfilePage.jsx";
+import PadelScorePage from "./pages/PadelScorePage.jsx";
 import "./index.css";
 
 // --- Context ---
 export const MapContext = createContext({
   startAddress: "",
   endAddress: "",
   setStartAddress: () => {},
   setEndAddress: () => {},
   startNavigation: () => {},
   trigger: 0,
   userName: "",
   setUserName: () => {},
 });
 
 export default function App() {
   const [startAddress, setStartAddress] = useState("");
   const [endAddress, setEndAddress] = useState("");
   const [trigger, setTrigger] = useState(0);
 
   // 🧠 Hantera användarnamn med localStorage
   const [userName, setUserName] = useState(() => {
     const stored = localStorage.getItem("epa_userName");
     console.log("🧠 Laddar userName från localStorage:", stored);
     return stored || "";
   });
@@ -44,31 +45,32 @@ export default function App() {
     setEndAddress(end);
     setTrigger((t) => t + 1);
   };
 
   return (
     <Router>
       <MapContext.Provider
         value={{
           startAddress,
           endAddress,
           setStartAddress,
           setEndAddress,
           startNavigation,
           trigger,
           userName,
           setUserName,
         }}
       >
         <Routes>
           <Route element={<Layout />}>
             <Route path="/" element={<MapPage />} />
             <Route path="/map" element={<MapPage />} />
             <Route path="/zones" element={<WarningZones />} />
             <Route path="/community" element={<CommunityPage />} />
             <Route path="/profile" element={<ProfilePage />} />
+            <Route path="/padel" element={<PadelScorePage />} />
           </Route>
         </Routes>
       </MapContext.Provider>
     </Router>
   );
 }
 
EOF
)
