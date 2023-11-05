const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Simpan data reward di memori
const rewards = {};

// Endpoint untuk menghasilkan reward untuk pengguna tertentu
app.get('/users/:userId/rewards', (req, res) => {
  const userId = req.params.userId;
  const at = new Date(req.query.at);
  const rewardsData = [];

  // Cek apakah pengguna sudah ada, jika tidak, buat pengguna baru
  if (!rewards[userId]) {
    rewards[userId] = rewardsData
  }

  // Generate reward sesuai dengan tanggal yang diberikan
  for (let i = 0; i < 7; i++) {
    const availableAt = new Date(at);
    availableAt.setDate(at.getDate() + i);
    const expiresAt = new Date(availableAt);
    expiresAt.setDate(availableAt.getDate() + 1);
    const reward = rewards[userId].find((r) => r.availableAt.getTime() === availableAt.getTime());
    if (reward) {
      rewardsData.push(reward)
    } else {
      rewardsData.push({ availableAt, redeemedAt: null, expiresAt });
    }
  }

  rewards[userId] = rewardsData;

  res.json({ data: rewardsData });
});

// Endpoint untuk menebus reward
app.patch('/users/:userId/rewards/:availableAt/redeem', (req, res) => {
  const userId = req.params.userId;
  const availableAt = new Date(req.params.availableAt);
  const reward = rewards[userId].find((r) => r.availableAt.getTime() === availableAt.getTime());

  if (!reward) {
    return res.status(404).json({ error: { message: "Reward not found" } });
  }

  const currentTime = new Date();
  if (currentTime <= reward.expiresAt) {
    reward.redeemedAt = currentTime;
    return res.json({ data: reward });
  } else {
    return res.status(400).json({ error: { message: "This reward is already expired" } });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app