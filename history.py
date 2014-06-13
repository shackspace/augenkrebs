import sqlite3
import os
import time

class history():
	def __init__(self):
		conf_dir = os.getenv('HOME') + '/.config/byteplayer/'
		history_location = conf_dir + 'history.db'
		try:
			os.makedirs(conf_dir,mode=0o700,exist_ok=True)
		except OSError as oe:
			print(oe)
		self._connection = sqlite3.connect(history_location)
		cursor = self._connection.cursor()
		cursor.execute(''' create table if not exists HISTORY 
							(date real, videourl text)''')
		self._connection.commit()
		cursor.close()

	def append(self,url):
		if not url:
			raise ValueError("<url> must be a non-empty string")
		cursor = self._connection.cursor()
		cursor.execute(''' insert into HISTORY 
							values (?,?)''',(time.time(),url))
		self._connection.commit()
		cursor.close()
