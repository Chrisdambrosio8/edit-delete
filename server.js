const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let artists = [
    {
        id: 1, name: "Drake", rname: "Aubrey Graham", origin: "Toronto, Canada", genre: "Hip-Hop & R&B", img: "images/drake.jpg", 
    },
    {
        id: 2, name: "Travis Scott", rname: "Jacques Bermon Webster II", origin: "Houston, Texas", genre: "Trap", img: "images/travis.jpg", 
    },
    {
        id: 3, name: "Frank Ocean", rname: "Christopher Francis Ocean", origin: "California", genre: "R&B", img: "images/frank.jpg", 
    },
    {
        id: 4, name: "Future", rname: "Nayvadius DeMun Cash", origin: "Atlanta, Georgia", genre: "Hip-Hop", img: "images/future.jpg", 
    },
    {
        id: 5, name: "21 Savage", rname: "Shéyaa Bin Abraham-Joseph", origin: "Plaistow, London", genre: "Hip-Hop", img: "images/21.jpg", 
    },
    {
        id: 6, name: "Lil Uzi Vert", rname: "Symere Bysil Woods", origin: "Philadelphia, Pennsylvania", genre: "Hip-Hop", img: "images/uzi.jpg", 
    },
];

app.get("/api/artists", (req, res) => {
    res.send(artists);
});

app.get("/api/artists/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const artist = artists.find((r)=>r.id === id);

    if(!artist) {
        res.status(404).send("The artist with the given id was not found");
    }
    res.send(artist);
});

app.post("/api/artists", upload.single("img"), (req, res)=> {
    const result = validateArtist(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const artist = {
        _id: artists.length + 1,
        name: req.body.name,
        rname: req.body.rname,
        origin: req.body.origin,
        genre: req.body.genre,
    };

    if(req.file) {
        artist.img = "images/" +req.file.filename;
    }

    artists.push(artist);
    res.send(artist);
});

app.put("/api/artists/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const artist = artists.find((r)=>r.id === id);
    
    const result = validateArtist(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    artist.name = req.body.name;
    artist.rname = req.body.rname;
    artist.origin = req.body.origin;
    artist.genre = req.body.genre;

    if(req.file) {
        artist.img = "images/" +req.file.filename;
    }

    res.send(artist);
});

app.delete("/api/artists/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const artist = artists.find((r)=>r.id === id);

    if(!artist) {
        res.status(400).send("The artist with the given name was not found.");
        return;
    }

    const index = artists.indexOf(artist);
    artists.splice(index,1);
    res.send(artist);
});

const validateArtist = (artist) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        rname: Joi.string().min(3).required(),
        origin: Joi.string().min(3).required(),
        genre: Joi.string().min(3).required(),
    });

    return schema.validate(artist);
} 


app.listen(3000, () => {
    console.log("Listening");
});