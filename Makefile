all: index.html
index.html: style.css script.js
style.css: style.styl
	stylus $<
script.js: script.ls
	lsc -c $<

clean:
	rm -f style.css script.js
