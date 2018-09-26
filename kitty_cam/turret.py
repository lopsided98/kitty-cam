import logging

import lirc


class Turret:
    def __init__(self, socket):
        self._log = logging.getLogger(__name__)
        self._socket = socket
        self._conn = None
        self._try_connect()

    def move(self, pan_speed, tilt_speed):
        key_name = f'CH1_{self._speed_str(pan_speed)}_{self._speed_str(tilt_speed)}'
        self._send_command(key_name)

    def stop(self):
        self.move(0, 0)

    def float(self):
        self._send_command('CH1_FLT_FLT')

    def _try_connect(self, ):
        if self._conn is None:
            try:
                self._conn = lirc.CommandConnection(socket_path=self._socket)
            except RuntimeError:
                self._conn = None
                self._log.exception("Failed to connect to lircd")
                return False
        return True

    def _send_command(self, key_name):
        self._log.debug("Sending command: %s", key_name)
        if self._try_connect():
            reply = lirc.SendCommand(self._conn, 'LEGO_Combo_PWM', (key_name,)).run()
            if not reply.success:
                raise RuntimeError(f"Failed to send command: {reply.data}")
            return reply

    @staticmethod
    def _speed_str(speed):
        direction = 'BRK' if speed == 0 else 'FWD' if speed > 0 else 'REV'
        speed_str = '' if speed == 0 else str(min(abs(speed), 7))
        return direction + speed_str
