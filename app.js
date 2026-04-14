document.getElementById('utilityForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    date: document.getElementById('date').value,
    school: document.getElementById('school').value,
    type: document.getElementById('type').value,
    previousReading: parseFloat(document.getElementById('previousReading').value) || 0,
    currentReading: parseFloat(document.getElementById('currentReading').value),
    remarks: document.getElementById('remarks').value
  };

  try {
    const res = await fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await res.json();

    if (result.success) {
      alert(`✅ Record Saved!\nConsumption: ${result.consumption} units`);
      e.target.reset();
    } else {
      alert('❌ Error: ' + result.message);
    }
  } catch (err) {
    alert('Cannot connect to server. Make sure server is running.');
  }
});