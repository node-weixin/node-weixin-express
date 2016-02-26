var id = document.getElementById('appid');
function goto() {
  if (!confirm('当前的appid为［' + id.value + ']\n请确认id无误，确认后需要重新返回当前页才能修改app id!')) {
    return;
  }
  console.log(id.value);
  if (id) {
    location.href = '/' + id.value + '/config/app';
  }
}
