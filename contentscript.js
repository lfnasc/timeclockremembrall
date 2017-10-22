const createTimeClockRemembrall = message => {
  const tcremembrall = document.createElement('div');
  tcremembrall.setAttribute('id', 'time-clock-remembrall');
  tcremembrall.className = 'tcremembrall';
  const logo = document.createElement('IMG');
  logo.setAttribute('id', 'remembrall-logo');
  logo.className = 'tcremembrall__logo';
  const label = document.createElement('p');
  label.setAttribute('id', 'remembrall-label');
  label.className = 'tcremembrall__label';
  const text = document.createTextNode(message);
  label.appendChild(text);
  tcremembrall.appendChild(logo);
  tcremembrall.appendChild(label);
  return tcremembrall;
};

document.body.appendChild(
  createTimeClockRemembrall('Did you register clock-in?')
);
document.getElementById('remembrall-logo').src =
  chrome.extension.getURL('images/icon-active128.png');
