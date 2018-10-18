var map;

function initMap() {
    
    map = new google.maps.Map(document.querySelector('.c'));
}

window.addEventListener('load', function() {
    const galleries = 'https://www.randyconnolly.com/funwebdev/services/art/galleries.php';
    const paintings = 'https://www.randyconnolly.com/funwebdev/services/art/paintings.php?gallery=x'
    let galleryID;
    
    fetch(galleries)
    .then(response => response.json())
    .then((data) => {
        populateGalleries(data)
        console.log(data);
    })
    .catch(error => console.log(error));
    
    //populating galleries menu
    function populateGalleries(galleries){
        document.querySelector("div.b section").style.display = "block";
        for (let gall of galleries){
           let g = document.createElement("li");
            g.textContent = gall.GalleryName;
            document.querySelector("#galleryList").appendChild(g);
        }
        let museums = document.querySelectorAll("#galleryList li");
        museums.forEach(gal =>{
            
           gal.addEventListener('click', function(){
                let name = galleries.find(p => {return p.GalleryName == gal.textContent});
                
                fetchPaintings(name);
                
                 populateInformation(galleries, gal);
                 populateMap(galleries, gal);
           });
        })
    }
    
    //populating musuem section
    function populateInformation(galleries, e){
        document.querySelector("div.a section").style.display = "grid";
        document.querySelector("div.a section").style.height = "300px";
        
        var name = galleries.find(p => {return p.GalleryName == e.textContent});
        document.querySelector("#galleryName").textContent = name.GalleryName;
        document.querySelector("#galleryNative").textContent = name.GalleryNativeName;
        document.querySelector("#galleryCity").textContent = name.GalleryCity;
        document.querySelector("#galleryAddress").textContent = name.GalleryAddress;
        document.querySelector("#galleryCountry").textContent = name.GalleryCountry;
        
        //creating a hyper link
        document.querySelector("#galleryHome").innerHTML = '';
        var hyperLink = document.createElement('a');
        hyperLink.setAttribute('href', name.link);
        hyperLink.innerHTML = 'Link';
        document.querySelector("#galleryHome").appendChild(hyperLink);
    }
    
    //populating Gmap
    function populateMap(galleries, e){
        document.querySelector(".c").style.opacity = "1";
        document.querySelector(".c").style.display = "block";
        document.querySelector(".c").style.height = "600px";
        var name = galleries.find(p => {return p.GalleryName == e.textContent});
        let lat = name.Latitude;
        let lng = name.Longitude;
        map.setZoom(18);
        map.setCenter({lat, lng});
        map.setMapTypeId('satellite');
    }
    
    
    //populating Paintings List div
    function populatePaintings(paintings, e){
        document.querySelector(".d section").style.display = "grid";
        
        document.querySelector(".d section").style.fontSize = "120%";
        
        document.querySelector(".d section").style.textAlign = "center";
        document.querySelector(".d section label").style.fontSize = "110%";
        while (document.querySelector(".d section").hasChildNodes() && document.querySelector(".d section").lastChild.textContent != 'Year') {
        document.querySelector(".d section").removeChild(document.querySelector(".d section").lastChild);
}
        paintings.sort(function(a, b){
            if(a.LastName < b.LastName) return -1;
            if(a.LastName > b.LastName) return 1;
            return 0;
        })
        var name = paintings.find(p => {return p.nameEn == e.textContent});
        for (let arts of paintings){
            //setting image
            let imageFileName = arts.ImageFileName;
            imageFileName += '.jpg';
            imageFileName = "images/square-small/" + imageFileName;
            let img = document.createElement('img');
            img.setAttribute('src', imageFileName)
            document.querySelector("div.d section").appendChild(img);
            
            //settings artists' last names
            let lName = document.createElement("span");
                lName.textContent = arts.LastName;
                console.log(lName.textContent);
            document.querySelector("div.d section").appendChild(lName);
            
            //settings artists' last names
            let title = document.createElement("span");
                title.textContent = arts.Title;
                console.log(title.textContent);
            document.querySelector("div.d section").appendChild(title);
            
            //settings artists' last names
            let year = document.createElement("span");
                year.textContent = arts.YearOfWork;
                console.log(year.textContent);
            document.querySelector("div.d section").appendChild(year);
        }
        
        
        
        
        document.querySelector('div.d section').addEventListener('click', (e) => {
        e.preventDefault();
                        // get the text to say and the voice options from form
                    var desc = name.find(p => {return p.Title == e.target.textContent});
        let message = desc.Title;
        // create utterance and give it text to speak
        let utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
        });
    }
    
    function fetchPaintings(gall){
        let paintingsAPI = paintings.substring(0, paintings.length - 1);
        paintingsAPI += gall.GalleryID;
        
        fetch(paintingsAPI)
        .then(response => response.json())
        .then((data) => {
        populatePaintings(data, gall);
        })
        .catch(error => console.log(error));
    }
});

