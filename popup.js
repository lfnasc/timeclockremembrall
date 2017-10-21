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
  const mSelect = document.getElementsByClassName('time__mselect');
  [...mSelect].forEach(select => {
    for (let i = 0; i < 60; i++) {
      const option = document.createElement('option');
      option.text = formatTimeNumber(i);
      option.value = formatTimeNumber(i);
      select.add(option);
    }
  });
};

const init = () => {
  setAlarmSelect();
};

// callbak to start script
document.addEventListener('DOMContentLoaded', () => init());
