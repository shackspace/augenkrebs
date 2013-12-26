DISPLAY = ":0"
TEMPLATEDIR = "templates"
COOKIEFILE = "/tmp/byteplayer_cookies"
TERMINALEMULATOR = "urxvt -e"
MPLAYER_PIPE_NAME = "mplayer_slave_pipe"
MPLAYER = "mplayer2"  #name of the mplayer executable, may vary on different systems (mplayer vs. mplayer2)
MPLAYERARGS = "--slave --input=file="+MPLAYER_PIPE_NAME+" --cache=32000 --framedrop --cookies --cookies-file="+COOKIEFILE
YOUTUBEDLARGS = ["--get-url","--cookies",COOKIEFILE]
