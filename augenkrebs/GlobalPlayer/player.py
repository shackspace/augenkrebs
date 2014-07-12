from GlobalPlayer.vlc import vlc
from GlobalPlayer.splashscreen import show_splashscreen, hide_splashscreen
from GlobalPlayer.thread import callme

""" 
  the player module provides the Player class that is used by
  GlobalPlayer.thread.GlobalThread to interact with the vlc
  player
"""

class Player():
    playlist = []

    def __init__(self):
        self.vlc_instance = vlc.Instance()
        self.vlc_player = self.vlc_instance.media_player_new()
        self.vlc_player.set_fullscreen(True)

    def play(self, task):
        """ activates the player and hides the splashscreen """
        if not self.vlc_player.is_playing():
            hide_splashscreen()
            self.vlc_player.play()
        
        if task:
            self.get_status(task['response'])

    def pause(self, task):
        """ pauses the current playback """
        if self.vlc_player.is_playing():
            self.vlc_player.pause()
        self.get_status(task['response'])

    def stop(self, task):
        """ stops the current playback and shows the splashscreen """
        if self.vlc_player.is_playing():
            show_splashscreen()
            self.vlc_player.stop()
        self.get_status(task['response'])

    def open(self, task):
        """ opens a given URL and starts playback.
            in case the playlist exists already, insert at the beginning
        """
        # TODO: recognizing stream
        if 'youtube' in task['url']:
            task['response'].put({'status': 'trying'})
            event_manager = self.vlc_player.event_manager()
            event_manager.event_attach(vlc.EventType.MediaPlayerEndReached,\
                    callme)

        hide_splashscreen()
        media = self.vlc_instance.media_new(task['url'])
        self.vlc_player.set_media(media)
        self.vlc_player.play()
        task['response'].put({'status': 'success'})

    def stream(self, task):
        """ plays a previously opened stream """
        try:
            for item in self.vlc_player.get_media().subitems():
                self.vlc_player.set_media(item)
                self.play(None)
            except TypeError:
                print("Whoops, no stream found!")

    def get_status(self, task):
        """ get_status sends a complete status dictionary to the
            response_queue
        """
        #TODO: only return dict, don't call queue, but wth'
        response = {}
        subtitle_dict = {}
        audio_dict = {}

        response['title'] = ""
        response['play_status'] = str(self.vlc_player.get_state()).split('.')[1]
        response['length'] = self.vlc_player.get_length()
        response['position'] = self.vlc_player.get_time()
        response['muted'] = self.vlc_player.audio_get_mute()
        response['volume'] = self.vlc_player.audio_get_volume()
        response['audio_delay'] = self.vlc_player.audio_get_delay()
        response['subtitle_delay'] = self.vlc_player.video_get_spu_delay()

        if self.vlc_player.get_media():
            response['title'] = self.vlc_player.get_media().get_mrl()

        for track in self.vlc_player.audio_get_track_description():
            audio_dict[track[0]] = track[1].decode()

        response['audiotrack_list'] = list(audio_dict.values())

        try:
            response['audiotrack'] = audio_dict[self.vlc_player.\
                    audio_get_track()]
        except KeyError:
            response['audiotrack'] = ""

        for track in self.vlc_player.video_get_spu_description():
            subtitle_dict[track[0]] = track[1].decode()

        response['subtitle_list'] = list(subtitle_dict.values())
        try:
            response['subtitle'] = subtitle_dict[self.vlc_player.\
                    video_get_spu()]
        except KeyError:
            response['subtitle'] = ""
                
        response_queue.put(response)

    def change_status(self, task):
        """ change_status takes a request dictionary and will try to apply
            every requested status change contained
        """
        #TODO: ALL the input sanitizing
        request = task['request']

        for element in request.keys():
            if element == 'position':
                self.vlc_player.set_time(int(request[element]))

            elif element == 'subtitle':
                subtitle_dict = {}
                for track in self.vlc_player.video_get_spu_description():
                    subtitle_dict[track[1].decode()] = track[0]
                self.vlc_player.video_set_spu(subtitle_dict[request[element]])
            elif element == 'subtitle_delay':
                self.vlc_player.video_set_spu_delay(request[element])

            elif element == 'audiotrack':
                audio_dict = {}
                for track in self.vlc_player.audio_get_track_description():
                    audio_dict[track[1].decode()] = track[0]
                self.vlc_player.audio_set_track(audio_dict[request[element]])

            elif element == 'audio_delay':
                self.vlc_player.audio_set_delay(request[element])

            elif element == 'volume':
                self.vlc_player.audio_set_volume(request[element])

            elif element == 'muted':
                self.vlc_player.audio_set_mute(request[element])

        self.get_status(task['response'])

