

## LXDE-autostart config

`~/.config/lxsession/LXDE-pi/autostart`

```sh
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash
# turn off screensaver
@xset s off
# turn off DPMS (Display Power Management Signaling)
@xset -dpms
@xset s noblank
@unclutter
```

## bashrc

```sh
export DISPLAY=:0.0
```

## dotenv

```sh
TL_USB_PORT=/dev/ttyUSB0
TL_PAIR_TERMINAL_ID=2164328241
```

- /dev/tty.usbserial-AHXKL25P

## run

```sh
$ npm run start
```