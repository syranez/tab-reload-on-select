dist/tab-reload-on-select.zip: src/ icons/ manifest.json
	zip -FS $@ src/* icons/* manifest.json
