#!/bin/sh
# Lokale Vorschau. Kein Installieren, kein Netzwerk nach außen.
cd "$(dirname "$0")" || exit 1
exec python3 -m http.server 8107 --bind 127.0.0.1
