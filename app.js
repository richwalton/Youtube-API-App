const api = "AIzaSyB84cRYeedR0tAcGg_DiP8YigOTM3FAnP8";
const output = document.querySelector('.output');
const container = document.querySelector('.container')
const searchTerm = document.querySelector('input');

searchTerm.setAttribute('value','test');
//pagination
const btnPrev = document.createElement('button');
btnPrev.setAttribute('disabled',true);
btnPrev.textContent = 'Previous';
container.appendChild(btnPrev);


const btnNext = document.createElement('button');
btnNext.setAttribute('disabled',true);
btnNext.textContent = 'Next';
container.appendChild(btnNext);

//eventListener
const btns = document.querySelectorAll('button');
btns.forEach(function(btn){
    btn.addEventListener('click', ytSearch);
})



function ytSearch(e){
    let search = searchTerm.value;
    console.log(e.target.token);
    search = encodeURIComponent(search); // <-- removes problem characters like a space that can cause API's problems
    let url = 'https://www.googleapis.com/youtube/v3/search/?part=snippet&key=' + api + '&q=' + search + '&maxResults=4';
    if(e.target.token) {
        url += '&pageToken='+e.target.token;
    }
    // document.querySelector('.output').textContent=url;
    // output.textContent = url;
    fetch(url).then(function(rep){
        return rep.json()
    }).then(function (data){
        if(data.prevPageToken){
            btnPrev.token = data.prevPageToken;
            btnPrev.disabled = false;
        }else{
            btnPrev.token = false;
            btnPrev.disabled = true;
        }
        if(data.nextPageToken){
            btnNext.token = data.nextPageToken;
            btnNext.disabled = false;
        }else{
            btnNext.token = false;
            btnNext.disabled = true;
        }
        return data.items.map(function(x){
            return {
                title:x.snippet.title,
                descr:x.snippet.description,
                image:x.snippet.thumbnails.medium.url,
                id:x.id.videoId,
                x:x
            }
        })
    }).then(function (arr) {
        show(arr);       //<---- api key/value term: "items" - returns each video object with its details
    }).catch(function(error) {
            console.log(error)
        // show(data1);// <---- api key/value term: "items" - returns each video object with its details
    })
};
// ytSearch();

function show(data){
    console.log(data);
    console.log(data.length);
    output.innerHTML ="";
    data.forEach(function(video){
        console.log(video);
        let div= document.createElement('div');
        div.classList.add('box');
        let img = document.createElement('IMG');
        
        img.setAttribute('src', video.image);
        div.appendChild(img);
        let desc = document.createTextNode(video.descr);
        
        let span = document.createElement('span');
        span.innerHTML = '<a href="http://www.youtube.com/watch?v='+ video.id + '"target="_blank">'+video.title +'</a>';
        div.appendChild(span);
        div.appendChild(desc);
        output.appendChild(div);
    })
}