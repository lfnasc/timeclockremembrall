const setLocalStorageItem = (key, value) => localStorage.setItem(key, value);

const getLocalStorageItem = (key) => (localStorage.getItem(key) || false);

const setAlarmStoraged = (type, time) => setLocalStorageItem(type, time);

const getAlarmStoraged = (type) => (getLocalStorageItem(type));

const createAlarm = (name, alarmInfo) => chrome.alarms.create(name, alarmInfo);

const verifyAlarm = (type) => {
  const alarmStoraged = getAlarmStoraged(type);
  if (alarmStoraged) {
    const storagedTime = new Date(alarmStoraged);
    const newTime = new Date();
    newTime.setHours(storagedTime.getHours());
    newTime.setMinutes(storagedTime.getMinutes());
    newTime.setSeconds(storagedTime.getSeconds());
    setAlarmStoraged(type, newTime.toString());
    createAlarm(type, { when: newTime.getTime() });
  } else { // uses default time
    let hour;
    switch (type) {
      case 'clock-in':
        hour = 8;
        break;
      case 'interval-in':
        hour = 12;
        break;
      case 'interval-out':
        hour = 13;
        break;
      case 'clock-out':
        hour = 17;
        break;
      default:
    }
    const defaultTime = new Date();
    defaultTime.setHours(hour);
    defaultTime.setMinutes(0);
    defaultTime.setSeconds(0);
    setAlarmStoraged(type, defaultTime.toString());
    createAlarm(type, { when: defaultTime.getTime() });
  }
};

const init = () => {
  // checking alarms
  // clock-in, interval-in, interval-out, clock-out
  verifyAlarm('clock-in');
  verifyAlarm('interval-in');
  verifyAlarm('interval-out');
  verifyAlarm('clock-out');
};

// listeners
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('alarm', alarm);
  switch (alarm.name) {
    case 'clock-in':
      console.log('Fired an alarm type clock-in!');
      break;
    case 'interval-in':
      console.log('Fired an alarm type interval-in!');
      break;
    case 'interval-out':
      console.log('Fired an alarm type inteval-out!');
      break;
    case 'clock-out':
      console.log('Fired an alarm type clock-out!');
      break;
    default:
  }
});

// initialize background
init();
