const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = 'https://ostvapp.cam';

// دالة مساعدة لجلب البيانات من الخادم الأساسي لتجنب تكرار الكود
async function fetchFromApi(res, endpoint, queryParams = {}) {
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            params: queryParams,
            headers: { 
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
            }
        });
        // إرجاع البيانات كما هي من السيرفر الأساسي
        res.status(200).json(response.data);
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const data = error.response ? error.response.data : { error: 'Internal Server Error' };
        res.status(status).json(data);
    }
}

// ==========================================
// 1. مسارات القنوات (Channels)
// ==========================================

// مسار لجلب روابط الدومين التشغيل للقنوات
app.get('/channels/domains', (req, res) => {
    fetchFromApi(res, '/api/app/channel-domains.php'); //
});

// مسار لجلب أقسام القنوات
app.get('/channels/categories', (req, res) => {
    fetchFromApi(res, '/api/channels/collections.php'); //[cite: 1]
});

// مسار لجلب بيانات قناة معينة (مثال للاستدعاء: /channels/show/63)
app.get('/channels/show/:id', (req, res) => {
    fetchFromApi(res, '/api/channels/show.php', { id: req.params.id }); //[cite: 1]
});

// مسار لجلب قائمة القنوات (يمكنك تمرير رقم الصفحة للبحث /channels/list?page=1&limit=20)
app.get('/channels/list', (req, res) => {
    fetchFromApi(res, '/api/channels/', req.query); //[cite: 1]
});

// ==========================================
// 2. مسارات الأفلام (Movies)
// ==========================================

// مسار لجلب أقسام الأفلام
app.get('/movies/categories', (req, res) => {
    fetchFromApi(res, '/api/movies/request_categories.php'); //[cite: 1]
});

// مسار لجلب تفاصيل فيلم معين
app.get('/movies/show/:id', (req, res) => {
    fetchFromApi(res, '/api/movies/show.php', { id: req.params.id }); //[cite: 1]
});

// مسار لجلب قائمة الأفلام مع إمكانية الفلترة
app.get('/movies/list', (req, res) => {
    fetchFromApi(res, '/api/movies/', req.query); //[cite: 1]
});

// ==========================================
// 3. مسارات المسلسلات والحلقات (Series & Episodes)
// ==========================================

// مسار لجلب قائمة المسلسلات
app.get('/series/list', (req, res) => {
    fetchFromApi(res, '/api/series/', req.query); //[cite: 1]
});

// مسار لجلب تفاصيل مسلسل معين
app.get('/series/show/:id', (req, res) => {
    fetchFromApi(res, '/api/series/show.php', { id: req.params.id }); //[cite: 1]
});

// مسار لجلب مواسم مسلسل معين
app.get('/series/:id/seasons', (req, res) => {
    fetchFromApi(res, '/api/seasons/', { series_id: req.params.id }); //[cite: 1]
});

// مسار لجلب حلقات موسم معين
app.get('/seasons/:id/episodes', (req, res) => {
    fetchFromApi(res, '/api/episodes/', { season_id: req.params.id }); //[cite: 1]
});

// مسار لجلب روابط المشاهدة لحلقة معينة
app.get('/episodes/:id/watch-links', (req, res) => {
    fetchFromApi(res, '/api/watch_links/', { episode_id: req.params.id }); //[cite: 1]
});

// مسار لجلب روابط التحميل لحلقة معينة
app.get('/episodes/:id/download-links', (req, res) => {
    fetchFromApi(res, '/api/download_links/', { episode_id: req.params.id }); //[cite: 1]
});

// ==========================================
// 4. مسارات الأنمي (Anime)
// ==========================================

// مسار لجلب الصفحة الرئيسية للأنمي
app.get('/anime/home', (req, res) => {
    fetchFromApi(res, '/api/anime/home.php', req.query); //[cite: 1]
});

// مسار لجلب تفاصيل أنمي
app.get('/anime/show/:id', (req, res) => {
    fetchFromApi(res, '/api/anime/show.php', { id: req.params.id }); //[cite: 1]
});

// ==========================================
// 5. مسارات المباريات (Matches)
// ==========================================

// مسار لجلب مباريات اليوم
app.get('/matches/today', (req, res) => {
    fetchFromApi(res, '/api/matches/', req.query); //[cite: 1]
});

// مسار لجلب تفاصيل بث مباراة معينة (تلفزيون)
app.get('/matches/tv/:id', (req, res) => {
    fetchFromApi(res, '/api/matches/tv.php', { id: req.params.id }); //[cite: 1]
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
