import lirc

import logging


class Turret:
    def __init__(self, socket):
        self._log = logging.getLogger(__name__)
        try:
            self._conn = lirc.CommandConnection(socket_path=socket)
        except RuntimeError:
            self._log.exception("Failed to connect to lircd")

    def move(self, pan_speed, tilt_speed):
        key_name = f'CH1_{self._speed_str(pan_speed)}_{self._speed_str(tilt_speed)}'
        self._send_command(key_name)

    def stop(self):
        self.move(0, 0)

    def float(self):
        self._send_command('CH1_FLT_FLT')

    def _send_command(self, key_name):
        self._log.debug("Sending command: %s", key_name)
        if hasattr(self, '_conn'):
            reply = lirc.SendCommand(self._conn, 'LEGO_Combo_PWM', key_name).run()
            if not reply.success:
                raise RuntimeError("Failed to send command: " + reply.last_line)
            return reply
        else:
            raise RuntimeError('Not connected to lircd')

    @staticmethod
    def _speed_str(speed):
        direction = 'BRK' if speed == 0 else 'FWD' if speed > 0 else 'REV'
        speed_str = '' if speed == 0 else str(min(abs(speed), 7))
        return direction + speed_str
