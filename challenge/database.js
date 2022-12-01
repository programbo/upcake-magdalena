const sqlite = require('sqlite-async');

class Database {
	constructor(db_file) {
		this.db_file = db_file;
		this.db = undefined;
	}

	async connect() {
		this.db = await sqlite.open(this.db_file);
	}

	async migrate() {
		return this.db.exec(`
			DROP TABLE IF EXISTS posts;
			CREATE TABLE posts (
				id            INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
				title         VARCHAR(255) NOT NULL,
				thumbnail     TEXT         NOT NULL,
				content_en    TEXT NOT NULL,
				content_es    TEXT NOT NULL,
				price         VARCHAR(36) NOT NULL,
				created       VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
			);

			INSERT INTO posts (id, title, thumbnail, price, content_en, content_es) VALUES
				(1, 'Lovely cupcake', 'cupcake1.png', '$3.99', 'Pie cupcake caramels marshmallow ice cream icing. Brownie biscuit candy macaroon dessert ice cream halvah. Cheesecake sweet roll marzipan brownie lollipop gummies. The item is available in your local store.','Tarta cupcake caramelos malvavisco helado glaseado. Brownie, galleta, caramelo, macarrón, postre, helado, halvah. Pastel de queso dulce roll mazapán brownie lollipop gomitas. El artículo está disponible en su tienda local.'),
				(2, 'Super Cupcake', 'cupcake2.png', '$4.99', 'Pie cupcake caramels marshmallow ice cream icing. Brownie biscuit candy macaroon dessert ice cream halvah. Cheesecake sweet roll marzipan brownie lollipop gummies. The item is available in your local store.','Tarta cupcake caramelos malvavisco helado glaseado. Brownie, galleta, caramelo, macarrón, postre, helado, halvah. Pastel de queso dulce roll mazapán brownie lollipop gomitas. El artículo está disponible en su tienda local.'),
				(3, 'Mega cupcake', 'cupcake3.png', '$5.99', 'Pie cupcake caramels marshmallow ice cream icing. Brownie biscuit candy macaroon dessert ice cream halvah. Cheesecake sweet roll marzipan brownie lollipop gummies. The item is available in your local store.','Tarta cupcake caramelos malvavisco helado glaseado. Brownie, galleta, caramelo, macarrón, postre, helado, halvah. Pastel de queso dulce roll mazapán brownie lollipop gomitas. El artículo está disponible en su tienda local.'),
				(4, 'Huge cupcake', 'cupcake4.png', '$9.99', 'Pie cupcake caramels marshmallow ice cream icing. Brownie biscuit candy macaroon dessert ice cream halvah. Cheesecake sweet roll marzipan brownie lollipop gummies. The item is available in your local store.','Tarta cupcake caramelos malvavisco helado glaseado. Brownie, galleta, caramelo, macarrón, postre, helado, halvah. Pastel de queso dulce roll mazapán brownie lollipop gomitas. El artículo está disponible en su tienda local.');

			DROP TABLE IF EXISTS reviews;
			CREATE TABLE reviews (
				id            INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
				post_id         INTEGER NOT NULL,
				review   TEXT         NOT NULL,
				name        VARCHAR(255) NOT NULL,
				created       VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
			);
			INSERT INTO reviews (id, post_id, review, name) VALUES
				(1, 1, 'This one is very delicious. I buy this for my kids everyday!', 'Marry Jhones'),
				(2, 1, 'I miss having them, they are great!', 'Frans Elden'),
				(3, 1, 'So good!', 'Franky'),
				(4, 2, 'This one is a must have!', 'Leslie Spike'),
				(5, 2, 'I like this flavour the most.', 'Chester Whitey'),
				(6, 3, 'They are very yummy.', 'Jerrio Jerry'),
				(7, 4, 'My kids love this one!', 'Arthur');
		`);
	}
	async listPosts() {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT * FROM posts order by id asc');
				resolve(await stmt.all());
			} catch(e) {
				reject(e);
			}
		});
	}
	async getPost(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT * FROM posts WHERE id = ?');
				resolve(await stmt.get(id));
			} catch(e) {
				reject(e);
			}
		});
	}
	async getReviews(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT * FROM reviews WHERE post_id = ?');
				resolve(await stmt.all(id));
			} catch(e) {
				reject(e);
			}
		});
	}
	async addReview(post_id, name, review) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('INSERT INTO reviews (post_id, name, review) VALUES (?, ?, ?)');
				resolve(await stmt.run(post_id, name, review));
			} catch(e) {
				reject(e);
			}
		});
	}

}

module.exports = Database;