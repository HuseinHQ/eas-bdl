const formatDailyData = (data) => {
  // Format the data for existing entries
  return data.map(({ tanggal_transaksi, total_pemasukan }) => {
    const date = new Date(tanggal_transaksi);

    // Format the time to the user's local timezone
    const hourLabel = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);

    return { label: hourLabel.split(' ')[0], data: total_pemasukan }; // Extract only the time part
  });
};

const formatWeeklyData = (data) => {
  // Mengambil tanggal saat ini
  const today = new Date();

  // Membuat array 7 hari terakhir dari hari ini
  const last7Days = Array.from({ length: 7 })
    .map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    })
    .reverse(); // Balikkan urutan agar tanggal lebih awal di depan

  // Buat objek untuk mencari data lebih mudah
  const dataMap = data.reduce((acc, item) => {
    const date = new Date(item.tanggal).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + item.total_pemasukan;
    return acc;
  }, {});

  // Format data dengan placeholder untuk tanggal yang tidak ada
  return last7Days.map((date) => ({
    label: date,
    data: dataMap[date] || 0, // Jika tidak ada data, gunakan 0
  }));
};

const formatMonthlyData = (data) => {
  // Initialize an array to hold the labels (weeks of the month)
  const labels = [];
  const formattedData = [];

  // Extract the date in 'YYYY-MM-DD' format
  data.forEach((entry) => {
    const entryDate = new Date(entry.minggu);
    const formattedDate = entryDate.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    labels.push(formattedDate);
  });

  // Define the possible weeks we are interested in
  const possibleWeeks = [
    '2024-11-24',
    '2024-12-01',
    '2024-12-08',
    '2024-12-15', // 4 weeks we expect to have data for
  ];

  // Create the final result with existing data or 0 if not present
  possibleWeeks.forEach((week) => {
    const weekData = data.find((entry) => {
      const entryDate = new Date(entry.minggu);
      const formattedEntryDate = entryDate.toISOString().split('T')[0]; // Get the date part only
      return formattedEntryDate === week;
    });

    formattedData.push({
      label: week,
      data: weekData ? weekData.total_pemasukan : 0, // Return 0 if no data for this week
    });
  });

  return formattedData;
};

const formatAnnualyData = (data) => {
  // Sort data by 'bulan' to ensure the latest date is at the end
  data.sort((a, b) => new Date(b.bulan) - new Date(a.bulan));

  // Take the latest date as the reference point
  const latestDate = new Date(data[0].bulan);

  // Indonesian month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  // Generate the labels for the 12 months, starting from the latest date
  const labels = [];
  for (let i = 0; i < 12; i++) {
    const labelDate = new Date(latestDate);
    labelDate.setMonth(latestDate.getMonth() - i); // Move backward by 1 month for each iteration

    const monthLabel = months[labelDate.getMonth()]; // Get the corresponding month name in Indonesian
    const yearLabel = labelDate.getFullYear(); // Get the year

    // Combine year and month (e.g., "2024-Jan")
    labels.push(`${monthLabel}-${yearLabel}`);
  }

  // Reverse the labels so they are in chronological order
  labels.reverse();

  // Map the labels to the corresponding data
  return labels.map((label) => {
    const [month, year] = label.split('-');
    const monthData = data.find((entry) => {
      const entryDate = new Date(entry.bulan);
      const entryMonth = entryDate.getMonth(); // Get month index (0 = Jan, 1 = Feb, ..., 11 = Dec)
      const entryYear = entryDate.getFullYear(); // Get year

      // Match both year and month
      return entryMonth === months.indexOf(month) && entryYear === parseInt(year);
    });

    return {
      label: label,
      data: monthData ? monthData.total_pemasukan : 0, // Use 0 if no data for that month
    };
  });
};
