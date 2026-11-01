#!/bin/sh
# Lokale Testfassung des virtuellen Rathauses. Kein Installieren, kein Netz nach außen.
cd "$(dirname "$0")" || exit 1
echo "Rathaus-Test: http://127.0.0.1:8117/module/rathaus.html"
exec python3 -m http.server 8117 --bind 127.0.0.1
