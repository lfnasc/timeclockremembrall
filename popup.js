const sendMessage = (message, callback) => {
  chrome.extension.sendMessage(
    {
      message
    },
    callback
  );
};

const sendMessageWithOptions = (message, options, callback) => {
  chrome.extension.sendMessage(
    {
      message,
      options
    },
    callback
  );
};

const formatTimeNumber = number => (number > 9 ? `${number}` : `0${number}`);

const setAlarmSelect = () => {
  const hSelects = document.getElementsByClassName('time__hselect');
  [...hSelects].forEach(select => {
    for (let i = 1; i < 25; i++) {
      const option = document.createElement('option');
      option.text = formatTimeNumber(i);
      option.value = formatTimeNumber(i);
      select.add(option);
    }
  });

  const mSelects = document.getElementsByClassName('time__mselect');
  [...mSelects].forEach(select => {
    for (let i = 0; i < 60; i++) {
      const option = document.createElement('option');
      option.text = formatTimeNumber(i);
      option.value = formatTimeNumber(i);
      select.add(option);
    }
  });

  const selects = document.getElementsByTagName('select');
  [...selects].forEach(select => {
    select.addEventListener('change', () => {
      const options = {
        selectId: select.id,
        selectValue: select.value
      };
      sendMessageWithOptions('SET-ALARM', options, response => {
        console.log(response);
      });
    });
  });

  sendMessage('GET-ALARMS', response => {
    document.getElementById('time-clock-in-hour').value = response.clockIn.split(':')[0];
    document.getElementById('time-clock-in-minutes').value = response.clockIn.split(':')[1];
    document.getElementById('time-interval-in-hour').value = response.intervalIn.split(':')[0];
    document.getElementById('time-interval-in-minutes').value = response.intervalIn.split(':')[1];
    document.getElementById('time-interval-out-hour').value = response.intervalOut.split(':')[0];
    document.getElementById('time-interval-out-minutes').value = response.intervalOut.split(':')[1];
    document.getElementById('time-clock-out-hour').value = response.clockOut.split(':')[0];
    document.getElementById('time-clock-out-minutes').value = response.clockOut.split(':')[1];
  });
};

const init = () => {
  setAlarmSelect();
};

// callbak to start script
document.addEventListener('DOMContentLoaded', () => init());
