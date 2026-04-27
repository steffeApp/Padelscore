 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/docs/download-and-zip.md b/docs/download-and-zip.md
new file mode 100644
index 0000000000000000000000000000000000000000..62752e10fc076eceeebe20932a36bf6373f87aac
--- /dev/null
+++ b/docs/download-and-zip.md
@@ -0,0 +1,52 @@
+# Ladda ner hela projektet
+
+## Alternativ A: Skapa en zip-fil lokalt
+
+Kör från projektroten:
+
+```bash
+./scripts/package-project.sh
+```
+
+Detta skapar:
+
+- `artifacts/epa-navigator.zip`
+
+### Med egen output-mapp eller filnamn
+
+```bash
+./scripts/package-project.sh /tmp my-project.zip
+```
+
+Det skapar:
+
+- `/tmp/my-project.zip`
+
+## Alternativ B: Ladda ner alla filer via Git
+
+Om repo finns på GitHub/GitLab:
+
+1. Öppna reposidan i webbläsaren.
+2. Klicka på **Code**.
+3. Välj **Download ZIP**.
+
+## Vad som ingår i zip från scriptet
+
+Scriptet exkluderar medvetet:
+
+- `node_modules/`
+- `dist/`
+- `.git/`
+- `artifacts/`
+
+All källkod och projektfiler följer med.
+
+## Direktlänk i denna miljö
+
+Om din klient stödjer lokala artefaktlänkar kan du klicka här:
+
+- [Ladda ner epa-navigator.zip](../artifacts/epa-navigator.zip)
+
+Om länken inte fungerar, använd sökvägen direkt:
+
+- `/workspace/epa-navigator/artifacts/epa-navigator.zip`
 
EOF
)
