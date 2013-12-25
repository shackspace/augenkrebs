DISPLAY = ":0"
TEMPLATEDIR = "templates"
COOKIEFILE = "/tmp/byteplayer_cookies"
TERMINALEMULATOR = "urxvt -e"
MPLAYER = "mplayer2"  #name of the mplayer executable, may vary on different systems (mplayer vs. mplayer2)
MPLAYERARGS = "--cache=32000 --framedrop --cookies --cookies-file="+COOKIEFILE
YOUTUBEDLARGS = ["--get-url","--cookies",COOKIEFILE]
