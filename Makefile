all: manifest.json
	zip -j -FS dist/tab-reload-on-select.zip src/* manifest.json
