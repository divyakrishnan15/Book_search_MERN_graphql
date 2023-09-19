const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/deep-thoughts');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deep-thoughts');

module.exports = mongoose.connection;
