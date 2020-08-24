const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const {
    createPollGetController,
    createPollPostController,
    getAllPolls,
    getSinglePoll,
    postOpinion
} = require('./controllers/pollController');

const app = express();
const port = 3333;

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/create', createPollGetController);
app.post('/create', createPollPostController);
app.get('/polls', getAllPolls);
app.post('/polls/:id', postOpinion);
app.get('/poll/:id', getSinglePoll);

mongoose.connect('mongodb://localhost:27017/poll', { useNewUrlParser: true })
    .then(e => {
        app.listen(port, () => {
            console.log(`Application started on http://localhost:${port}`);
        })
    })
    .catch(e => {
        console.log(e);
    });