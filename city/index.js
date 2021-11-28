
const mongoose = require('mongoose');
const cities = require('./cities');
const { name, group, id } = require('./bloodDetails');
const Record = require('../models/record');


mongoose.connect('mongodb://localhost:27017/blood-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;

db.on("error", console.log.bind(console, "conection error:"));
db.once("open", () => {
    console.log("Databse connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];

const cityDB = async () => {
    await Record.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1500 = Math.floor(Math.random() * 1500);
        const camp = new Record({
            location: `${cities[random1500].city},${cities[random1500].state}`,
            record: `${sample(name)} ${sample(group)} ${sample(id)}`
        })
        await camp.save();
    }

}

cityDB();