 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/scripts/package-project.sh b/scripts/package-project.sh
new file mode 100755
index 0000000000000000000000000000000000000000..d974ec3c8c37a1dd6e37b7e67501321e134e4d09
--- /dev/null
+++ b/scripts/package-project.sh
@@ -0,0 +1,17 @@
+#!/usr/bin/env bash
+set -euo pipefail
+
+ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
+OUT_DIR="${1:-$ROOT_DIR/artifacts}"
+ZIP_NAME="${2:-epa-navigator.zip}"
+
+mkdir -p "$OUT_DIR"
+cd "$ROOT_DIR"
+
+zip -r "$OUT_DIR/$ZIP_NAME" . \
+  -x "node_modules/*" \
+  -x "dist/*" \
+  -x ".git/*" \
+  -x "artifacts/*"
+
+echo "Created: $OUT_DIR/$ZIP_NAME"
 
EOF
)
