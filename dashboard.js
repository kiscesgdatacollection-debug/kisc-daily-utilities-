let trendChartInstance = null;
let schoolChartInstance = null;

async function loadDashboard() {
  const schoolFilter = document.getElementById('schoolFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;

  try {
    const res = await fetch('/data');
    let data = await res.json();

    // Apply filters
    if (schoolFilter) {
      data = data.filter(item => item.school === schoolFilter);
    }
    if (typeFilter) {
      data = data.filter(item => item.type === typeFilter);
    }

    // Calculate totals
    let totalConsumption = data.reduce((sum, item) => sum + (item.consumption || 0), 0);
    let gasUsed = data.filter(i => i.type === 'gas_cylinder').reduce((sum, i) => sum + (i.consumption || 0), 0);
    let waterUsed = data.filter(i => i.type === 'water').reduce((sum, i) => sum + (i.consumption || 0), 0);
    let electricityUsed = data.filter(i => i.type === 'electricity').reduce((sum, i) => sum + (i.consumption || 0), 0);

    // Update summary cards
    document.getElementById('totalConsumption').textContent = totalConsumption.toFixed(1);
    document.getElementById('gasTotal').textContent = gasUsed.toFixed(1) + ' kg';
    document.getElementById('waterTotal').textContent = waterUsed.toFixed(1) + ' L';
    document.getElementById('electricityTotal').textContent = electricityUsed.toFixed(1) + ' kWh';

    // Prepare data for charts
    const dates = data.map(item => item.date).reverse();
    const consumptions = data.map(item => item.consumption || 0).reverse();

    // Destroy old charts if they exist
    if (trendChartInstance) trendChartInstance.destroy();
    if (schoolChartInstance) schoolChartInstance.destroy();

    // Trend Line Chart
    trendChartInstance = new Chart(document.getElementById('trendChart'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Daily Consumption',
          data: consumptions,
          borderColor: '#d4af37',
          backgroundColor: 'rgba(212, 175, 55, 0.15)',
          tension: 0.4,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } }
      }
    });

    // School Bar Chart
    const schoolTotals = {};
    data.forEach(item => {
      if (!schoolTotals[item.school]) schoolTotals[item.school] = 0;
      schoolTotals[item.school] += item.consumption || 0;
    });

    schoolChartInstance = new Chart(document.getElementById('schoolChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(schoolTotals),
        datasets: [{
          label: 'Total Usage',
          data: Object.values(schoolTotals),
          backgroundColor: '#013220'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

  } catch (error) {
    console.error(error);
    alert("Could not load dashboard. Make sure the server is running.");
  }
}

// Load dashboard when page opens
window.onload = loadDashboard;