#augenkrebs

augenkrebs ist das Internetabspielgerät des [shack](http://shackspace.de/). Über ein Browser-Interface kann die Wiedergabe von Videodateien (derzeit: aus dem Netz oder von youtube) gesteuert werden.

##Funktionalität

 * Abspielen (Start|Stop|Pause) von allen Dateien, die vlc wiedergeben kann, und youtube-Videos
 * Steuerung der Lautstärke (incl mute)
 * Seeking, soweit unterstützt
 * Wechseln der Tonspur
 * Wechseln der Untertitelspur
 * Einstellen von Ton- und Untertitelverzögerung

##Installation

Es sollten X, VLC, für Untertitel: die VLC-freetype-Abhängigkeiten, Python und Flask installiert sein. Zum Starten einfach die augenkrebs.py ausführen. 

Ein systemd-Service ist im `install`-Verzeichnis enthalten (muss gegebenenfalls angepasst werden, wie im Service selber dokumentiert). 

augenkrebs befindet sich auch im [AUR](https://aur.archlinux.org) als `augenkrebs-git` und ist dort immer auf der aktuellen Version des Master-Branches. Der systemd-Service liegt nach Installation aus dem AUR unter `/usr/lib/systemd/system` und kann mit `systemctl enable augenkrebs.service` aktiviert werden.

##Werkzeug
 * vlc zum Abspielen
 * python im Backend, mit der von videolan gestellten [Python-Bindings](https://wiki.videolan.org/Python_bindings)
 * Flask als lokaler Server
 * Coffeescript, Chaplin und Bootstrap vornedran (oh, und Jade und Stylus. Und jQuery, lodash, seiyria-bootstrap-slider)

----------------------------------------------------------------------

#augenkrebs

augenkrebs is used to play videos (from files and youtube, atm) at [shackspace](http://shackspace.de). You can control the playback via a web interface.

##What it can do
 * play (and stop and pause, yes) all files vlc can play, aswell as youtube videos
 * control volume and mute
 * seeking if possible
 * choosing audio and subtitle tracks
 * changing audio and subtitle delay

##Installation

You need X, VLC (with freetype-related dependencies for subtitles), Python3 and Flask. Just start augenkrebs.py. There's also a systemd service in the `install` directory (you might need to edit it, as documented in the file itself).

augenkrebs is also in [AUR](https://aur.archlinux.org) as `augenkrebs-git`, pointing to the last version in the `master` branch. If you install via AUR, the systemd service is copied to `/usr/lib/systemd/system` and can be enabled with `systemctl enable augenkrebs.service`.

##Tools used
 * vlc
 * Python backend with the vlc [Python bindings](https://wiki.videolan.org/Python_bindings)
 * Flask as server
 * coffeescript, chaplin, bootstrap, jade, stylus, jquery, lodash and seiyria-bootstrap-slider in the frontend
