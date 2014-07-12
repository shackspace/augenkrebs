SPLASH_ARGUMENTS = ["chromium", "--kiosk", "--incognito", "http://localhost:4000/icon"]


def show_splashscreen(self):
    subprocess.Popen(SPLASH_ARGUMENTS)


def hide_splashscreen(self):
    subprocess.Popen(["killall", "chromium"])
