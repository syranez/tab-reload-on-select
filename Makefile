dist/tab-reload-on-select.zip: src/ manifest.json
	zip -j -FS $@ src/* manifest.json
