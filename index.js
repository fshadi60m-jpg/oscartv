const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();
app.use(cors());
app.use(express.json());

// إعداد الكاش لحفظ البيانات لمدة 5 دقائق (300 ثانية) لتخفيف الضغط وتجنب حظر 403 Forbidden
const cache = new NodeCache({ stdTTL: 300 }); 

const BASE_URL = 'https://ostvapp.cam';

// دالة جلب البيانات مع دعم التخزين المؤقت وتمرير جميع معاملات البحث
async function fetchFromApi(res, endpoint, queryParams = {}) {
    // إنشاء مفتاح فريد لكل طلب يتضمن المعاملات (مثل الكلمة المبحوث عنها)
    const cacheKey = endpoint + JSON.stringify(queryParams);

    if (cache.has(cacheKey)) {
        return res.status(200).json(cache.get(cacheKey));
    }

    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            params: queryParams, // هنا يتم دمج search و q و page تلقائياً
            headers: { 
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 12; SM-S908B Build/SP1A.210812.016)', 
                'Connection': 'keep-alive',
                'Accept-Encoding': 'gzip, deflate'
            },
            timeout: 10000 
        });

        cache.set(cacheKey, response.data);
        res.status(200).json(response.data);
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const data = error.response ? error.response.data : { error: 'Internal Server Error', details: error.message };
        res.status(status).json(data);
    }
}

// ==========================================
// 1. قسم القنوات (Channels)
// ==========================================
// يدعم البحث: /channels?search=bein&page=1
app.get('/channels', (req, res) => fetchFromApi(res, '/api/channels/', req.query));
app.get('/channels/show/:id', (req, res) => fetchFromApi(res, '/api/channels/show.php', { id: req.params.id, ...req.query }));
app.get('/channels/collections', (req, res) => fetchFromApi(res, '/api/channels/collections.php', req.query));

// ==========================================
// 2. قسم المسلسلات (Series)
// ==========================================
// يدعم البحث: /series?search=حارة_القبة
app.get('/series', (req, res) => fetchFromApi(res, '/api/series/', req.query));
app.get('/series/show/:id', (req, res) => fetchFromApi(res, '/api/series/show.php', { id: req.params.id, ...req.query }));
app.get('/series/seasons', (req, res) => fetchFromApi(res, '/api/seasons/', req.query));
// يدعم البحث في الحلقات: /series/episodes?season_id=5&q=10
app.get('/series/episodes', (req, res) => fetchFromApi(res, '/api/episodes/', req.query)); 
app.get('/series/episodes/show/:id', (req, res) => fetchFromApi(res, '/api/episodes/show.php', { id: req.params.id, ...req.query }));
app.get('/series/episodes/latest', (req, res) => fetchFromApi(res, '/api/episodes/latest.php', req.query));
app.get('/series/filters', (req, res) => fetchFromApi(res, '/api/series/filters.php', req.query));

// ==========================================
// 3. قسم الأفلام (Movies)
// ==========================================
// يدعم البحث: /movies?search=باتمان
app.get('/movies', (req, res) => fetchFromApi(res, '/api/movies/', req.query));
app.get('/movies/show/:id', (req, res) => fetchFromApi(res, '/api/movies/show.php', { id: req.params.id, ...req.query }));
app.get('/movies/collections', (req, res) => fetchFromApi(res, '/api/movies/collections.php', req.query));
app.get('/movies/collection/:id', (req, res) => fetchFromApi(res, '/api/movies/collection.php', { id: req.params.id, ...req.query }));
app.get('/movies/collection-categories', (req, res) => fetchFromApi(res, '/api/movies/collection_categories.php', req.query));
app.get('/movies/filters', (req, res) => fetchFromApi(res, '/api/movies/filters.php', req.query));

// ==========================================
// 4. قسم الأنمي (Anime)
// ==========================================
// يدعم البحث: /anime?search=naruto
app.get('/anime/home', (req, res) => fetchFromApi(res, '/api/anime/home.php', req.query));
app.get('/anime', (req, res) => fetchFromApi(res, '/api/anime/', req.query));
app.get('/anime/show/:id', (req, res) => fetchFromApi(res, '/api/anime/show.php', { id: req.params.id, ...req.query }));
// يدعم البحث في حلقات الأنمي: /anime/episodes?season_id=4&q=1
app.get('/anime/episodes', (req, res) => fetchFromApi(res, '/api/anime/episodes/', req.query)); 
app.get('/anime/episodes/show/:id', (req, res) => fetchFromApi(res, '/api/anime/episodes/show.php', { id: req.params.id, ...req.query }));
app.get('/anime/episodes/latest', (req, res) => fetchFromApi(res, '/api/anime/episodes/latest.php', req.query));
app.get('/anime/schedule', (req, res) => fetchFromApi(res, '/api/anime/schedule.php', req.query));
app.get('/anime/genres', (req, res) => fetchFromApi(res, '/api/anime/genres/', req.query));
app.get('/anime/studios', (req, res) => fetchFromApi(res, '/api/anime/studios/', req.query));

// ==========================================
// 5. قسم الرياضة والمباريات (Matches)
// ==========================================
// يدعم البحث في الدوريات: /matches/leagues?search=دوري
app.get('/matches/leagues', (req, res) => fetchFromApi(res, '/api/matches/leagues.php', req.query));
// يدعم البحث في الفرق: /matches/teams?search=ريال
app.get('/matches/teams', (req, res) => fetchFromApi(res, '/api/matches/teams.php', req.query));

app.get('/matches', (req, res) => fetchFromApi(res, '/api/matches/', req.query));
app.get('/matches/show/:id', (req, res) => fetchFromApi(res, '/api/matches/show.php', { id: req.params.id, ...req.query }));
app.get('/matches/tv/:id', (req, res) => fetchFromApi(res, '/api/matches/tv.php', { id: req.params.id, ...req.query }));
app.get('/matches/standings', (req, res) => fetchFromApi(res, '/api/matches/standings.php', req.query));
app.get('/matches/top-scorers', (req, res) => fetchFromApi(res, '/api/matches/top_scorers.php', req.query));
app.get('/matches/event-videos', (req, res) => fetchFromApi(res, '/api/matches/event_videos.php', req.query));

// ==========================================
// 6. قسم المصارعة (Wrestling)
// ==========================================
// يدعم البحث: /wrestling?search=wrestlemania
app.get('/wrestling', (req, res) => fetchFromApi(res, '/api/wrestling/', req.query));
app.get('/wrestling/show/:id', (req, res) => fetchFromApi(res, '/api/wrestling/show.php', { id: req.params.id, ...req.query }));
app.get('/wrestling/categories', (req, res) => fetchFromApi(res, '/api/wrestling/categories.php', req.query));

// ==========================================
// 7. قسم الممثلين (Actors)
// ==========================================
// يدعم البحث: /actors?search=عادل_إمام
app.get('/actors', (req, res) => fetchFromApi(res, '/api/actors/', req.query));

// ==========================================
// 8. روابط المشاهدة والتحميل (Media Streams)
// ==========================================
app.get('/watch-links', (req, res) => fetchFromApi(res, '/api/watch_links/', req.query)); 
app.get('/download-links', (req, res) => fetchFromApi(res, '/api/download_links/', req.query));


// فحص حالة السيرفر
app.get('/', (req, res) => {
    res.json({ status: 'Active', message: 'Proxy API Server is running smoothly.' });
});

// بدء تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
