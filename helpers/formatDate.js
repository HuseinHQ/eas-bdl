const formatDate = (date, withTime = false) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  if (withTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Date(date).toLocaleDateString('id-ID', options);
};

module.exports = formatDate;
