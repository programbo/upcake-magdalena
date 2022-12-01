const express        = require('express');
const router         = express.Router({caseSensitive: true});
const bot            = require('../bot');

let db;
let botVisiting = false;

const response = data => ({ message: data });

router.get('/', (req, res) => {
	db.listPosts()
	.then(posts => {
		return res.render('index.html', {posts});
	})
	.catch(e => {
		res.render('index.html');
	})

});

router.get('/posts/:id', (req, res) => {
	const { id } = req.params;
	if(!isNaN(parseInt(id))) {
		db.getPost(parseInt(id))
			.then(post => {
				db.getReviews(parseInt(id))
					.then(reviews => {
						return res.render('post.html', { post , reviews});
					})
			})
	} else {
		return res.render('post.html', {error: 'Invalid post ID supplied!'});
	}
});

router.post('/api/reviews/add', async (req, res) => {
	const { post_id, name, review } = req.body;
	if (botVisiting) return res.send(response('Please wait for the previous review approval process to finish first!'));
	if(post_id && name && review) {
		try {
			await db.addReview(parseInt(post_id), name, review);
		}
		catch (e) {
			return res.status(403).send('Something went wrong, please try again!');
		}
		botVisiting = true;
		return bot.visitPost(parseInt(post_id))
			.then(() => {
				botVisiting = false;
				return res.send(response('Your review is submitted successfully!'));
			})
			.catch(e => {
				console.log(e);
				botVisiting = false;
				return res.send(response('Something went wrong, please try again!'));
			})
	}
	return res.status(500).send(response('Missing required parameters!'));
});

module.exports = database => {
	db = database;
	return router;
};