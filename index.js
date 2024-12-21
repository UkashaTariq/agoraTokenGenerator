const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route to generate token
app.post('/generate-token', (req, res) => {
    const { channelName, uid, role, expireTime } = req.body;

    if (!channelName || !uid || !role) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
        return res.status(500).json({ error: 'App ID or Certificate not set' });
    }

    const expirationInSeconds = expireTime || 3600; // Default 1 hour
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expirationInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        uid,
        role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
        privilegeExpireTime
    );

    return res.json({ token });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
