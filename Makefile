all: index.html
index.html: style.css script.js
style.css: style.styl
	stylus $<

clean:
	rm -f style.css
