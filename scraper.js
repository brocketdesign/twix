const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Video = require('./models/Video');
require('dotenv').config({ path: '.env.local' });
const dbConnect = require('./lib/dbConnect');

async function scrapeVideos() {
    await dbConnect();

    try {
        const { data } = await axios.get('https://twiigle.com/realtime.html');
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
                tags: ['realtime'],
            };

            // Check if a video with the same thumbnail already exists
            videoPromises.push(
                Video.findOneAndUpdate(
                    { thumbnail: videoData.thumbnail },
                    videoData,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                )
            );
        });

        await Promise.all(videoPromises);
        console.log('All videos have been saved or updated.');
    } catch (error) {
        console.error('Error scraping the website:', error);
    }
}

// Schedule the scraper to run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running scraper at midnight');
    scrapeVideos();
});

// Run an initial scrape when the script starts
scrapeVideos().then(() => {
    console.log('Initial scrape complete. Cron job scheduled. Waiting for next execution...');
}).catch(err => {
    console.error('Error during initial scrape:', err);
});
