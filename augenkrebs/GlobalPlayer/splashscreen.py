import subprocess
""" the splashscreen module provides wrapper functions to show and hide the 
    chromium splashscreen """

SPLASH_ARGUMENTS = ["chromium", "--kiosk", "--incognito", "http://localhost:4000/icon"]


def show_splashscreen():
    subprocess.Popen(SPLASH_ARGUMENTS)


def hide_splashscreen():
    subprocess.Popen(["killall", "chromium"])
