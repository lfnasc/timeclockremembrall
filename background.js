const setLocalStorageItem = (key, value) => localStorage.setItem(key, value);

const getLocalStorageItem = (key) => (localStorage.getItem(key) || false);

const setStatusStoraged = (status) => setLocalStorageItem('status', status);

const setAlarmStoraged = (type, time) => setLocalStorageItem(type, time);

const getAlarmStoraged = (type) => (getLocalStorageItem(type));

const createAlarm = (name, alarmInfo) => chrome.alarms.create(name, alarmInfo);

const setAlarm = (type, selectId, selectValue) => {
  const sTime = getAlarmStoraged(type);
  const cTime = sTime.split(' ')[4];
  const t = cTime.split(':');
  if (selectId.indexOf('hour') !== -1) {
    t[0] = selectValue;
  } else {
    t[1] = selectValue;
  }
  const nTime = t.join(':');
  const time = sTime.replace(cTime, nTime);
  const newTime = new Date(time);
  setAlarmStoraged(type, newTime.toString());
  createAlarm(type, { when: newTime.getTime() });
};

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
      setStatusStoraged('clock-in');
      break;
    case 'interval-in':
      console.log('Fired an alarm type interval-in!');
      setStatusStoraged('interval-in');
      break;
    case 'interval-out':
      console.log('Fired an alarm type inteval-out!');
      setStatusStoraged('interval-out');
      break;
    case 'clock-out':
      console.log('Fired an alarm type clock-out!');
      setStatusStoraged('clock-out');
      break;
    default:
  }
});

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'GET-ALARMS') {
    const clockIn = getAlarmStoraged('clock-in').split(' ')[4];
    const intervalIn = getAlarmStoraged('interval-in').split(' ')[4];
    const intervalOut = getAlarmStoraged('interval-out').split(' ')[4];
    const clockOut = getAlarmStoraged('clock-out').split(' ')[4];

    sendResponse({
      clockIn,
      intervalIn,
      intervalOut,
      clockOut
    });
  } else if (request.message === 'SET-ALARM') {
    const selectId = request.options.selectId;
    const selectValue = request.options.selectValue;

    switch (selectId) {
      case 'time-clock-in-hour':
        setAlarm('clock-in', selectId, selectValue);
        break;
      case 'time-clock-in-minutes':
        setAlarm('clock-in', selectId, selectValue);
        break;
      case 'time-interval-in-hour':
        setAlarm('interval-in', selectId, selectValue);
        break;
      case 'time-interval-in-minutes':
        setAlarm('interval-in', selectId, selectValue);
        break;
      case 'time-interval-out-hour':
        setAlarm('interval-out', selectId, selectValue);
        break;
      case 'time-interval-out-minutes':
        setAlarm('interval-out', selectId, selectValue);
        break;
      case 'time-clock-out-hour':
        setAlarm('clock-out', selectId, selectValue);
        break;
      case 'time-clock-out-minutes':
        setAlarm('clock-out', selectId, selectValue);
        break;
      default:
    }
  }

  sendResponse({
    result: 'alarm setted!'
  });
});

// initialize background
init();
