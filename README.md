 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index b8da7ebb4ca7686285fa3c40221f61d3ea7161e4..a10ccaed7eff9f54b71fd702d51a640b959b6ae2 100644
--- a/README.md
+++ b/README.md
@@ -1,17 +1,39 @@
 # React + Vite
 
 This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
 
 Currently, two official plugins are available:
 
 - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
 - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
 
 ## React Compiler
 
 The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
 
 ## Expanding the ESLint configuration
 
 If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
 trigger vercel build
+
+## Padel scoring app concept (iPhone + Apple Watch)
+
+A product/technical plan for a padel scoring app controlled from Apple Watch is documented in:
+
+- `docs/padel-watch-app-plan.md`
+
+
+## Download project as ZIP
+
+Use the packaging script:
+
+- `./scripts/package-project.sh`
+
+Detailed instructions are available in:
+
+- `docs/download-and-zip.md`
+
+
+Direct local link (if supported by your client):
+
+- [Ladda ner epa-navigator.zip](artifacts/epa-navigator.zip)
 
EOF
)
