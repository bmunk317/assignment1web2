var map;

function initMap() {
    
    map = new google.maps.Map(document.querySelector('.c'));
}

window.addEventListener('load', function() {
    const galleries = 'https://www.randyconnolly.com/funwebdev/services/art/galleries.php';
    const paintings = 'https://www.randyconnolly.com/funwebdev/services/art/paintings.php?gallery=x'
    let galleryID;
    var linkStatus;
    
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
        document.querySelector("div.a section").style.height = "auto";
        
        document.querySelector(".a section").style.fontSize = "110%";
        
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
        
        document.querySelector("#galleryHome a").style.color = "#2F2234";
    }
    
    //populating Gmap
    function populateMap(galleries, e){
        document.querySelector(".c").style.opacity = "1";
        document.querySelector(".c").style.display = "block";
        document.querySelector(".c").style.height = "auto";
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
        document.querySelector(".d section").style.fontSize = "110%"
        document.querySelector(".d section").style.textAlign = "center";
        
        while (document.querySelector(".d section").hasChildNodes() && document.querySelector(".d section").lastChild.textContent != 'Year') {
        document.querySelector(".d section").removeChild(document.querySelector(".d section").lastChild);
}
        paintings.sort(function(a, b){
            if(a.LastName < b.LastName) return -1;
            if(a.LastName > b.LastName) return 1;
            return 0;
        })
        var name = paintings.find(p => {return p.nameEn == e.textContent});
        // token for title ids
        var token = 1;
        for (let arts of paintings){
            document.querySelector("div.d section").appendChild(document.createElement('div'));
            
            document.querySelector("div.d section div").style.display = 'contents';
            //setting image
            let imageFileName = arts.ImageFileName;
            imageFileName += '.jpg';
            imageFileName = "images/square-small/" + imageFileName;
            let img = document.createElement('img');
            img.setAttribute('src', imageFileName)
            document.querySelector("div.d section div").appendChild(img);
            
            //settings artists' last names
            let lName = document.createElement("span");
                lName.textContent = arts.LastName;
            document.querySelector("div.d section div").appendChild(lName);
            
            //settings artists' title
            let title = document.createElement("span");
                title.textContent = arts.Title;
                title.id = "spanTitle" + token;
                console.log(title.id)
            document.querySelector("div.d section div").appendChild(title);
            
            //settings artists' year
            let year = document.createElement("span");
                year.textContent = arts.YearOfWork;
            document.querySelector("div.d section div").appendChild(year);
            
            document.querySelector("#spanTitle" + token).style.cursor = "pointer";
            document.querySelector("#spanTitle" + token).style.fontStyle = "oblique";
            document.querySelector("#spanTitle" + token).style.textDecoration = "underline";
            document.querySelector("#spanTitle" + token).style.color = "#2F2234";
            token++;
        }
        for (let i = 1; i < token; i++){
        document.querySelector('div.d section div #spanTitle' + i).addEventListener('click', (e) => {
            
            console.log(e.target.textContent);
            populateSingleView(paintings, e);
        });
        }
        // resets token
        token = 0;
        
    }
    function populateSingleView(paintings, e){
        
        
        document.querySelector(".singleView section #paintingInfo #paintingLink").innerHTML = ''
        document.querySelector(".a").style.display = "none";
        document.querySelector(".b").style.display = "none"; 
        document.querySelector(".c").style.display = "none"; 
        document.querySelector(".d").style.display = "none"; 
        document.querySelector(".singleView").style.display = "grid";
        
        document.querySelector(".singleView section").style.display = "grid";
        
        var painting = paintings.find(p => {return p.Title == e.target.textContent});
            //fetch painting picture 
            let imageFileName = painting.ImageFileName;
            imageFileName += '.jpg';
            imageFileName = "images/medium/" + imageFileName;
            let img = document.querySelector(".singleView section #paintingImage img");
            img.setAttribute('src', imageFileName);
            
            //settings painting title
            document.querySelector(".singleView section #paintingTitle h2").innerHTML = painting.Title;
            
            //setting artist' name
            var name;
            if(painting.FirstName != null && painting.LastName != null){
                name = painting.FirstName + " " + painting.LastName;
            } else if(painting.FirstName == null && painting.LastName != null){
                name = painting.LastName;
            } else if(painting.FirstName != null && painting.LastName == null){
                name = painting.FirstName;
            }
            document.querySelector(".singleView section #paintingTitle p").innerHTML = name;
            
            //settings painting specifications
            var specs = '';
            if(painting.YearOfWork != null){
                specs +=painting.YearOfWork ;
            }
            if(painting.Medium != null){
                specs += ", " + painting.Medium;
            }
            if(painting.Height != null && painting.Width != null){
                specs += ", " + painting.Height + "x" + painting.Width;
            }
            if(painting.CopyrightText != null){
                specs +=", " + painting.CopyrightText;
            }
            document.querySelector(".singleView section #paintingInfo #paintingSpecs").innerHTML = specs;
            
            linkStatus = writeUrls(paintings, painting, painting.MuseumLink);
            
            linkStatus = writeUrls(paintings, painting, painting.WikiLink);
            
            
            //settings painting descriptio 
            if(painting.Description != null){
            document.querySelector(".singleView section #paintingDesc label").innerHTML = painting.Description;
            }
            else
            {
            document.querySelector(".singleView section #paintingDesc label").innerHTML = '';
            }
            
            document.querySelector(".singleView section #paintingDesc").style.overflow = "scroll";
            
            document.querySelector('.singleView section #titleButton button').addEventListener('click', () => {
                
                let messageTitle = painting.Title;
                // create utterance and give it text to speak
                let utterance = new SpeechSynthesisUtterance(messageTitle);
                
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utterance);
                messageTitle= '';
                utterance = '';
            })
            document.querySelector('.singleView section #buttonDesc button').addEventListener('click', () => {
                if(painting.Description != null){
                let message = painting.Description;
                // create utterance and give it text to speak
                let utterance = new SpeechSynthesisUtterance(message);
                
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utterance);
                utterance = '';
                message ='';
                }
            })
            document.querySelector('.singleView section #closeButton button').addEventListener('click', () => {
                //bring back grids, hide the single view for painting
                document.querySelector(".a").style.display = "block";
                document.querySelector(".b").style.display = "grid"; 
                document.querySelector(".c").style.display = "grid"; 
                document.querySelector(".d").style.display = "block"; 
                document.querySelector(".singleView").style.display = "none";
                document.querySelector("div.d section").appendChild(document.createElement('div'));
                document.querySelector("div.d section div").style.display = 'contents';

            })
         
        
    }
    
    // code taken from https://stackoverflow.com/questions/34867305/javascript-check-the-address-path-link-is-available-or-not
    function writeUrls(paintings, painting, url){
            var xhttp = new XMLHttpRequest();
         
            xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                console.log(xhttp.status);;
                var hyperLink = document.createElement('a');
                var linkName = 'Musuem Link    ';
                if (url.includes("wiki")){
                    linkName = 'Wiki Link    ';
                }
                hyperLink.setAttribute('href', url);
                hyperLink.innerHTML = linkName;
                document.querySelector(".singleView section #paintingInfo #paintingLink").appendChild(hyperLink);
                document.querySelector(".singleView section #paintingInfo #paintingLink").appendChild(document.createElement('br'));
                
                var aElements = document.querySelectorAll(".singleView section #paintingInfo #paintingLink a");
                for( let a of aElements){
                a.style.color = "#2F2234";
                }
            
            } else if ( xhttp.readyState == 4 && xhttp.status != 200 ){
                console.log(xhttp.status);
            }
          };
          
            xhttp.open("GET", url, true);
            xhttp.send(null)
            
    }
    
    //fetch painting information api from differen source
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

