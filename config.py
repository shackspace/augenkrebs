# TODO: remove mplayer related variables
DISPLAY = ":0"
TEMPLATEDIR = "templates"
COOKIEFILE = "/tmp/byteplayer_cookies"
TERMINALEMULATOR = ["urxvt","-bg","black","-fg","red","-fn","xft:Bitstream Vera Sans Mono:pixelsize=20","-e"]
MPLAYER_PIPE_NAME = "/tmp/mplayer_slave_pipe"
MPLAYER = "mplayer2"  #name of the mplayer executable, may vary on different systems (mplayer vs. mplayer2)
MPLAYERARGS = ["--fs","--slave", "--input=file="+MPLAYER_PIPE_NAME, "--cache=32000", "--framedrop", "--cookies", "--cookies-file="+COOKIEFILE]
YOUTUBEDLARGS = ["--get-url","--cookies",COOKIEFILE]
LIVESTREAMERARGS = ["best","--verbose-player","--player-passthrough","hls,http,rtmp","-p",' '.join(["mplayer2"] + MPLAYERARGS)]
SUSPEND_COMMAND = ["echo","please configure the proper command for suspend to ram"] #["sudo","pm-suspend"]


# The player gets started up at the start of the script
MPRIS2_CONNECT_TIMEOUT = 5 # seconds
MPRIS2_PLAYER_CMD = "cvlc"
MPRIS2_PLAYER_ARGS = ["-q", "-f"]
MPRIS2_PLAYER_NAME = "org.mpris.MediaPlayer2.vlc" # D-Bus Address
