const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Video = require('./models/Video');
require('dotenv').config({ path: '.env.local' });
const dbConnect = require('./lib/dbConnect');

async function scrapeVideos() {
    const paths = [
        { path: "index", name: "24h" },
        { path: "1w", name: "1w" },
        { path: "realtime", name: "ﾘｱﾀｲ" },
        { path: "realtime2", name: "ﾗﾝﾀﾞﾑ" },
        { path: "popular", name: "AV1" },
        { path: "trend", name: "AV2" },
        { path: "new", name: "ｺｽﾌﾟﾚ" },
        { path: "best", name: "ﾀﾚﾝﾄ" },
        { path: "amature", name: "ｸﾞﾗﾋﾞｱ" },
        { path: "hot", name: "裏垢" },
        { path: "secret", name: "TikTok" },
        { path: "3d", name: "殿堂" },
        { path: "fera", name: "ﾌｪﾗ" },
        { path: "ona", name: "ｵﾅ" },
        { path: "ama", name: "素人" },
        { path: "op", name: "ｱｿｺ" }
    ];
    await dbConnect();

    for (const { path, name } of paths) {
        try {
            const { data } = await axios.get(`https://twiigle.com/${path}.html`);
            const $ = cheerio.load(data);

            const videoPromises = [];

            $('.art_li.ty_0').each((index, element) => {
                const item = $(element);

                const title = item.find('.item_ranking').text().trim() || 'Unknown Title';
                const url = item.find('.item_link').attr('href').split('contents=')[1] || 'Unknown URL';
                const thumbnail = item.find('.item_image img').attr('src') || 'Unknown Thumbnail';
                const source = item.find('.tw_icon a').attr('href') || 'Unknown Source';

                const videoData = {
                    title,
                    url,
                    source,
                    thumbnail,
                    tags: [name],
                };

                videoPromises.push(
                    Video.findOneAndUpdate(
                        { thumbnail: videoData.thumbnail },
                        videoData,
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                    )
                );
            });

            await Promise.all(videoPromises);
            console.log(`Videos for path "${path}" have been saved or updated.`);
        } catch (error) {
            console.error(`Error scraping the path "${path}":`, error);
        }
    }
}

async function scrapeMonsnodeVideos() {
    await dbConnect();

    for (let numPage = 1; numPage <= 10; numPage++) {
        try {
            const { data } = await axios.get(`https://monsnode.com/?page=${numPage}`);
            const $ = cheerio.load(data);

            const videoPromises = $('a[href^="https://monsnode.com/redirect.php?v="]').map(async (index, element) => {
                const item = $(element);
                const videoUrl = item.attr('href');
                const extractedId = videoUrl.split('v=')[1];
                const twjnUrl = `https://monsnode.com/twjn.php?v=${extractedId}`;

                try {
                    const twjnResponse = await axios.get(twjnUrl);
                    const $twjn = cheerio.load(twjnResponse.data);
                    const videoLink = $twjn('a[href*="video"]').attr('href') || 'Unknown Video Link';

                    const videoData = {
                        title: item.text().trim() || 'monsnode',
                        url: videoLink,
                        source: 'monsnode',
                        thumbnail: item.find('img').attr('src') || 'Unknown Thumbnail',
                        tags: ['monsnode'],
                    };

                    return Video.findOneAndUpdate(
                        { thumbnail: videoData.thumbnail },
                        videoData,
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                    );
                } catch (error) {
                    console.error(`Error processing video ID "${extractedId}":`, error);
                }
            }).get();

            await Promise.all(videoPromises);
            console.log(`Videos for page "${numPage}" have been saved or updated.`);
        } catch (error) {
            console.error(`Error scraping page "${numPage}":`, error);
        }
    }
}

async function scrapeTwivideo() {
    await dbConnect();
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
      });
    const page = await browser.newPage();
    const urls = [
        'https://twivideo.net/?ranking',
        'https://twivideo.net/?ranking&sort=3days',
        'https://twivideo.net/?ranking&sort=week'
    ];

    for (const url of urls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            const videos = await page.evaluate(() => {
                const videoElements = Array.from(document.querySelectorAll('a.item_clk.item_link'));
                return videoElements.map(el => ({
                    url: el.href,
                    thumbnail: el.querySelector('img') ? el.querySelector('img').src : 'Twitter最新動画 | Twivideo',
                }));
            });
            const videoPromises = videos.map(video => {
                const videoData = {
                    title: 'Twivideo',
                    url: video.url,
                    source: 'Twivideo',
                    thumbnail: video.thumbnail,
                    tags: ['twivideo'],
                };
                return Video.findOneAndUpdate(
                    { url: video.url },
                    videoData,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            });

            await Promise.all(videoPromises);
            console.log(`Videos from "${url}" have been saved or updated.`);
        } catch (error) {
            console.error(`Error scraping URL "${url}":`, error);
        }
    }

    await browser.close();
}

scrapeTwivideo().then(() => {
    console.log('Initial scrapeTwivideo complete. Cron job scheduled. Waiting for next execution...');
}).catch(err => {
    console.error('Error during initial scrapeTwivideo:', err);
});

/*
scrapeMonsnodeVideos().then(() => {
    console.log('Initial scrapeMonsnodeVideos complete. Cron job scheduled. Waiting for next execution...');
}).catch(err => {
    console.error('Error during initial scrapeMonsnodeVideos:', err);
});


scrapeVideos().then(() => {
    console.log('Initial scrapeVideos complete. Cron job scheduled. Waiting for next execution...');
}).catch(err => {
    console.error('Error during initial scrapeVideos:', err);
});
*/