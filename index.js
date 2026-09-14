const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = 'https://ostvapp.cam';

// دالة مساعدة لجلب البيانات وتمرير المعاملات (Query Parameters)
async function fetchFromApi(res, endpoint, queryParams = {}) {
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            params: queryParams,
            headers: { 
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
            }
        });
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
app.get('/channels', (req, res) => fetchFromApi(res, '/api/channels/', req.query));
app.get('/channels/show/:id', (req, res) => fetchFromApi(res, '/api/channels/show.php', { id: req.params.id, ...req.query }));
app.get('/channels/collections', (req, res) => fetchFromApi(res, '/api/channels/collections.php', req.query));

// ==========================================
// 2. قسم المسلسلات (Series)
// ==========================================
app.get('/series', (req, res) => fetchFromApi(res, '/api/series/', req.query));
app.get('/series/show/:id', (req, res) => fetchFromApi(res, '/api/series/show.php', { id: req.params.id, ...req.query }));
app.get('/series/seasons', (req, res) => fetchFromApi(res, '/api/seasons/', req.query)); // يتطلب تمرير ?series_id=
app.get('/series/episodes', (req, res) => fetchFromApi(res, '/api/episodes/', req.query)); // يتطلب تمرير ?season_id=
app.get('/series/episodes/show/:id', (req, res) => fetchFromApi(res, '/api/episodes/show.php', { id: req.params.id, ...req.query }));
app.get('/series/episodes/latest', (req, res) => fetchFromApi(res, '/api/episodes/latest.php', req.query));
app.get('/series/filters', (req, res) => fetchFromApi(res, '/api/series/filters.php', req.query));

// ==========================================
// 3. قسم الأفلام (Movies)
// ==========================================
app.get('/movies', (req, res) => fetchFromApi(res, '/api/movies/', req.query));
app.get('/movies/show/:id', (req, res) => fetchFromApi(res, '/api/movies/show.php', { id: req.params.id, ...req.query }));
app.get('/movies/collections', (req, res) => fetchFromApi(res, '/api/movies/collections.php', req.query));
app.get('/movies/collection/:id', (req, res) => fetchFromApi(res, '/api/movies/collection.php', { id: req.params.id, ...req.query }));
app.get('/movies/collection-categories', (req, res) => fetchFromApi(res, '/api/movies/collection_categories.php', req.query));
app.get('/movies/filters', (req, res) => fetchFromApi(res, '/api/movies/filters.php', req.query));

// ==========================================
// 4. قسم الأنمي (Anime)
// ==========================================
app.get('/anime/home', (req, res) => fetchFromApi(res, '/api/anime/home.php', req.query));
app.get('/anime', (req, res) => fetchFromApi(res, '/api/anime/', req.query));
app.get('/anime/show/:id', (req, res) => fetchFromApi(res, '/api/anime/show.php', { id: req.params.id, ...req.query }));
app.get('/anime/episodes', (req, res) => fetchFromApi(res, '/api/anime/episodes/', req.query)); // يتطلب تمرير ?season_id=
app.get('/anime/episodes/show/:id', (req, res) => fetchFromApi(res, '/api/anime/episodes/show.php', { id: req.params.id, ...req.query }));
app.get('/anime/episodes/latest', (req, res) => fetchFromApi(res, '/api/anime/episodes/latest.php', req.query));
app.get('/anime/schedule', (req, res) => fetchFromApi(res, '/api/anime/schedule.php', req.query));
app.get('/anime/genres', (req, res) => fetchFromApi(res, '/api/anime/genres/', req.query));
app.get('/anime/studios', (req, res) => fetchFromApi(res, '/api/anime/studios/', req.query));

// ==========================================
// 5. قسم المباريات والرياضة (Matches)
// ==========================================
app.get('/matches', (req, res) => fetchFromApi(res, '/api/matches/', req.query)); // يتطلب تمرير ?date=
app.get('/matches/show/:id', (req, res) => fetchFromApi(res, '/api/matches/show.php', { id: req.params.id, ...req.query }));
app.get('/matches/tv/:id', (req, res) => fetchFromApi(res, '/api/matches/tv.php', { id: req.params.id, ...req.query }));
app.get('/matches/standings', (req, res) => fetchFromApi(res, '/api/matches/standings.php', req.query)); // يتطلب تمرير ?league_id=&season=
app.get('/matches/top-scorers', (req, res) => fetchFromApi(res, '/api/matches/top_scorers.php', req.query)); // يتطلب تمرير ?league_id=&season=
app.get('/matches/event-videos', (req, res) => fetchFromApi(res, '/api/matches/event_videos.php', req.query));

// ==========================================
// 6. قسم المصارعة (Wrestling)
// ==========================================
app.get('/wrestling', (req, res) => fetchFromApi(res, '/api/wrestling/', req.query));
app.get('/wrestling/show/:id', (req, res) => fetchFromApi(res, '/api/wrestling/show.php', { id: req.params.id, ...req.query }));
app.get('/wrestling/categories', (req, res) => fetchFromApi(res, '/api/wrestling/categories.php', req.query));

// ==========================================
// 7. روابط المشاهدة والتحميل (Media Streams)
// ==========================================
app.get('/watch-links', (req, res) => fetchFromApi(res, '/api/watch_links/', req.query)); // يتطلب تمرير ?episode_id=
app.get('/download-links', (req, res) => fetchFromApi(res, '/api/download_links/', req.query)); // يتطلب تمرير ?episode_id=


// فحص حالة السيرفر الأساسية
app.get('/', (req, res) => {
    res.json({ status: 'Active', message: 'Proxy API Server is running successfully.' });
});

// بدء تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
