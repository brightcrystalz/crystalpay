const axios = require('axios');

const vtpassRequest = async (endpoint, data) => {
  try {
    const response = await axios.post(
      `${process.env.VTPASS_BASE_URL}/${endpoint}`,
      data,
      {
        headers: {
          'api-key': process.env.VTPASS_API_KEY,
          'secret-key': process.env.VTPASS_SECRET_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;
    throw new Error(errMsg);
  }
};

const buyAirtime = async (network, phone, amount) => {
  const requestId = `REQ-${Date.now()}`;
  return await vtpassRequest('pay', {
    request_id: requestId,
    serviceID: network.toLowerCase(),
    amount: amount,
    phone: phone,
  });
};

const buyData = async (network, phone, planCode, amount) => {
  const requestId = `REQ-${Date.now()}`;
  return await vtpassRequest('pay', {
    request_id: requestId,
    serviceID: `${network.toLowerCase()}-data`,
    billersCode: phone,
    variation_code: planCode,
    amount: amount,
    phone: phone,
  });
};

const payElectricity = async (disco, meterNumber, meterType, amount, phone) => {
  const requestId = `REQ-${Date.now()}`;
  return await vtpassRequest('pay', {
    request_id: requestId,
    serviceID: disco,
    billersCode: meterNumber,
    variation_code: meterType,
    amount: amount,
    phone: phone,
  });
};

module.exports = { buyAirtime, buyData, payElectricity };