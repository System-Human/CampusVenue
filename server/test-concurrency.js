
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/bookings';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODM4M2UzMDU0NThkZjRjYzFiMGM5YyIsImlhdCI6MTc4NzAwNDA2NywiZXhwIjoxNzg5NTk2MDY3fQ.zEeOoy31YGROHq6KxjvNAmwCMyRAIBG24rk-QZrdlfs';
const ROOM_ID = '6a8384a46989862d4ac4c4fb';

async function runConcurrencyTest() {
  console.log('--- Launching 50 Concurrent Booking Requests for Same Slot ---');

  const payload = {
    roomId: ROOM_ID,
    title: 'High Concurrency Symposium',
    description: 'Testing race condition handling',
    startTime: '2026-09-01T10:00:00.000Z',
    endTime: '2026-09-01T12:00:00.000Z',
    attendeesEstimate: 80,
  };

  const requests = Array.from({ length: 50 }, (_, i) =>
    axios.post(API_URL, payload, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
    .then(res => ({ id: i + 1, status: res.status, data: res.data }))
    .catch(err => ({ id: i + 1, status: err.response?.status || 500, error: err.response?.data?.error || err.response?.data?.message || err.message }))
  );

  const results = await Promise.all(requests);

  const successful = results.filter(r => r.status === 201);
  const conflicts = results.filter(r => r.status === 409);
  const others = results.filter(r => r.status !== 201 && r.status !== 409);

  console.log(`Results: ${successful.length} Succeeded, ${conflicts.length} Rejected with Conflict.`);
  
  if (others.length > 0) {
      console.log('Other errors:', others.map(o => o.error || o.data || o.status).slice(0, 5));
  }

  if (successful.length === 1 && conflicts.length === 49) {
    console.log('✅ TEST PASSED: Concurrency lock successfully prevented double-booking!');
  } else {
    console.error('❌ TEST FAILED: Race condition detected!');
  }
}

runConcurrencyTest();
        