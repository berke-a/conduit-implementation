const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	tagList: {
		type: [String],
		required: true,
	},
	createdAt: {
		type: String,
		required: true,
	},
	updatedAt: {
		type: String,
		required: true,
	},
	favorited: {
		type: Boolean,
		required: true,
	},
	favoritesCount: {
		type: Number,
		required: true,
	},
	author: {
		username: {
			type: String,
			required: true,
			unique: true,
		},
		bio: {
			type: String,
			required: false,
		},
		image: {
			type: String,
			required: false,
		},
		following: {
			type: Boolean,
			required: true,
		},
	},
});

const Article = mongoose.model("Article", articleSchema);

export default Article;
