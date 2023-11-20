const getArtist = async () => {
    try {
        return (await fetch("https://edit-delete.onrender.com/api/artists")).json();
    } catch(error) {
        console.log("error");
    }
};



const showArtist = async () => {
    let artists = await getArtist();
    let artistsDiv = document.getElementById("artist-list");
    artistsDiv.innerHTML = "";
    artists.forEach((artist) => {
        const section = document.createElement("section");
        artistsDiv.append(section);

        const  a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = artist.name;
        a.append(h3);

        if(artist.img) {
        const img = document.createElement("img");
        section.append(img);
        img.src = "https://edit-delete.onrender.com/" + artist.img;
        } 

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(artist);
        }
    });
};

const displayDetails = (artist) => 
{
    const artistDetails = document.getElementById("artist-details");
    artistDetails.innerHTML = "";

    const dLink = document.createElement("a");
    dLink.innerHTML = " &#x2715;";
    artistDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    artistDetails.append(eLink);
    eLink.id = "edit-link";

    const h3 = document.createElement("h3");
    h3.innerHTML = artist.name;
    artistDetails.append(h3);

    const h4 = document.createElement("h4");
    h4.innerHTML = artist.rname;
    artistDetails.append(h4);

    const p = document.createElement("p");
    p.innerHTML = artist.origin;
    artistDetails.append(p);

    const p1 = document.createElement("p");
    p1.innerHTML = artist.genre;
    artistDetails.append(p1);

    
    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("second-title").innerHTML = "Edit Artist";
    };
    dLink.onclick = (e) => {
        e.preventDefault();
        deleteArtist(artist);
    };
    populateEditForm(artist);
};

const deleteArtist = async (artist) => {
    let response = await fetch(`https://edit-delete.onrender.com/api/artists/${artist.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    });

    if(response.status != 200)
    {
        console.log("Error delete");
        return;
    }

    let result = await response.json();
    showArtist();
    document.getElementById("artist-details").innerHTML = "";
    resetForm();
};

const populateEditForm = (artist) => {
    const form = document.getElementById("add-artist");
    form._id.value = artist.id;
    form.name.value = artist.name;
    form.rname.value = artist.rname
    form.origin.value = origin.origin;
    form.genre.value = origin.genre;
};

const addArtist = async (e) => 
{
    if(form._id.value == -1) {
        formData.delete("_id");
    
        response = await fetch("https://edit-delete.onrender.com/api/artits", {
            method: "POST",
            body: formData,
        });
    }

        else { 
            response = await fetch(`https://edit-delete.onrender.com/api/artists/${form._id.value}`,{
                method: "PUT",
                body: formData,
            });
        }
    if(response.status != 200) {
        console.log("Error contacting server");
        return;
    }
    artist = await response.json();

    //edit mode
    if(form._id.value != -1)
    {
        displayDetails(artist);
    }

    document.querySelector(".dialog").classList.add("transparent");
    resetForm();
    showArtist();
};

const resetForm = () => {
    const form = document.getElementById("add-artist");
    form.reset();
    form._id = "-1";
    document.getElementById("skill-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("second-title").innerHTML = "Add your Favorite Artist";
    resetForm();
};


window.onload = () => 
{
    showArtist();
    document.getElementById("add-artist").onsubmit = addArtist;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };
};