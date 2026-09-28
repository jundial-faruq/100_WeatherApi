const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    const kota = req.query.kota || "jakarta";

    const apiKey = "TmW3n2IbOKaZxkghOoYB";

    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const feature = data.features[0];

        const lokasi = feature.matching_text || feature.text;
        const kordinat = feature.geometry.coordinates;

        const context = feature.context || [];

        const negara =
            context.find(item => item.id.startsWith("country"))?.text || "-";

        const provinsi =
            context.find(item => item.id.startsWith("region"))?.text || "-";

        const kecamatan =
            context.find(item => item.id.startsWith("district"))?.text || "-";

        res.json({
            kota: lokasi,
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan,
            longitude: kordinat[0],
            latitude: kordinat[1],
            suhu: "Data suhu belum tersedia"
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});