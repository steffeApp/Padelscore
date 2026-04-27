 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/Layout.jsx b/src/Layout.jsx
index 769d1de376ce4918f56b6f6c7b633359917ad864..e52321278102aa00f334dbc258ec4d4040190c1e 100644
--- a/src/Layout.jsx
+++ b/src/Layout.jsx
@@ -20,50 +20,51 @@ function MapAddressBar() {
       <input
         value={endAddress}
         onChange={(e) => setEndAddress(e.target.value)}
         placeholder="Måladress"
         className="p-2 rounded text-black flex-1 min-w-0"
       />
 
       <button
         onClick={() => startNavigation(startAddress, endAddress)}
         className="bg-orange-500 text-white px-4 py-2 rounded-xl flex-shrink-0"
       >
         🚗
       </button>
     </div>
   );
 }
 
 
 function Navbar() {
   return (
     <div className="flex gap-4 flex-shrink-0 bg-gray-600 p-2 rounded">
       <NavLink to="/map">🗺️</NavLink>
       <NavLink to="/zones">⚠️</NavLink>
       <NavLink to="/community">💬</NavLink>
       <NavLink to="/profile">👤</NavLink>
+      <NavLink to="/padel">🎾</NavLink>
     </div>
   );
 }
 
 export default function Layout() {
   const location = useLocation();
 
   return (
     <div className="h-screen flex flex-col bg-gray-900 text-white">
       <header className="p-2 bg-gray-800">
         <div className="flex flex-nowrap items-center gap-2">
           <div className="flex-1 min-w-0">
             {(location.pathname === "/" || location.pathname === "/map") && <MapAddressBar />}
           </div>
 
           <Navbar />
         </div>
       </header>
 
       <main className="flex-1 overflow-y-auto">
         <Outlet />
       </main>
     </div>
   );
 }
 
EOF
)
