// TMDB
const API_KEY='api_key=1d1acdd8d3d47c3709f74af495a698e1';//added api_key=//----API-key v3 auth// tool from example api (added)
const BASE_URL='https://api.themoviedb.org/3';//example api REQUEST----
const API_URL=BASE_URL+'/discover/movie?sort_by=popularity.desc&' +API_KEY;//added & //overview-here--API url=discover example--// most popular movies
const IMG_URL='https://image.tmdb.org/t/p/w500';
//<-------------------inbetween put & / ? for getting data from link---------------->
const SEARCH_URL=BASE_URL +'/search/movie?'+API_KEY ; // (baseurl+()+apikey)

const genres=[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}];
const main=document.getElementById('main');//2nd
const form=document.getElementById('form');//1st
const search=document.getElementById('search');
const tagEl=document.getElementById('tags');
const prev=document.getElementById('prev');
const next=document.getElementById('next');
const current=document.getElementById('current');
//-------------------------creating variable for pagination---------------------------------------------------- currentpage=1;
var currentpage=1;
var nextpage=2;
var previouspage=3;
var lasturl='';
var totalpages=100;
//-------------------------set genre
var selectedGenre=[];
setGenre()
function setGenre(){
tagEl.innerHTML='';
genres.forEach(genre=>{
    const t=document.createElement('div');
    t.classList.add('tag');
    t.id=genre.id;
    t.innerText=genre.name;
    t.addEventListener('click' ,()=>{
        if(selectedGenre.length==0){
            selectedGenre.push(genre.id);
        }else{
            if(selectedGenre.includes(genre.id)){
               selectedGenre.forEach((id,idx) =>{
                   if(id==genre.id){
                       selectedGenre.splice(idx, 1)
                } } )
         }else{
            selectedGenre.push(genre.id);
         }
        } console.log(selectedGenre)
        getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
        highlightSelection()
    }  )
    tagEl.append(t);

})
}
function highlightSelection(){
   const tags= document.querySelectorAll('.tag');
   tags.forEach(tags=>{
       tags.classList.remove('highlight')
   })
   clearButton()
    if(selectedGenre.length !=0)
     selectedGenre.forEach(id =>{
    const highlightTag= document.getElementById(id);
    highlightTag.classList.add('highlight');
     })
}
function clearButton(){
    let clearButton=document.getElementById('clear');
    if(clearButton){
        clearButton.classList.add('highlight')
    }else{
        let clear=document.createElement('div');
        clear.classList.add('tag' , 'highlight');
        clear.id='clear';
        clear.innerText='clear x';
        clear.addEventListener('click', ()=>{
selectedGenre=[];
setGenre();
getMovies(API_URL)
        })
        tagEl.append(clear)
    }
   
}
getMovies(API_URL)
//<-------------------------------------------------fetch api data------------------------------------------------->
function getMovies(url){
    lasturl=url;
fetch(url).then(res=>res.json()).then(data=>{
    console.log(data)
        if(data.results.length !== 0){
            ShowMovies(data.results)
             currentpage=data.page;
             nextpage=currentpage+1;
             previouspage=currentpage-1;
            totalpages=data.total_pages;
            current.innerText=currentpage;
          
          if(currentpage<=1){
              prev.classList.add('disabled');
                next.classList.remove('disabled');
           }
           else if(currentpage>=totalpages){
                prev.classList.remove('disabled');
                next.classList.add('disabled')
 } 
 else{
        prev.classList.remove('disabled');
       next.classList.remove('disabled')
}
tagsEl.scrollIntoView({behavior : 'smooth'})
}
else{
         main.innerHTML=`<h1 class="no-results">No Results found</h1>`
}
  })
}
//<-------------------------------------------------show data(movie) in screen------------------------------------------------->
function ShowMovies(data){
    main.innerHTML=''; //emptying main space and fill them with  show movies
  data.forEach(movie => {         //<------------------for each movie  this elemts creates(((data is array)) ) --------------->
    const {title,poster_path,vote_average,overview} = movie
    const moveiEl=document.createElement('div')
    moveiEl.classList.add('movie');
    moveiEl.innerHTML=` "<img src="${poster_path? IMG_URL+poster_path:'http://via.placeholder.com/1080x1500'}" alt="${title}">
         <div class="movie-info">
             <h3>${title}</h3>
             <span class="${getColor(vote_average)}">${vote_average}</span>
         </div>
         <div class="overview">
             <h3>Overview</h3>
            ${overview}`
    main.appendChild(moveiEl)
})
}
  function getColor(vote) {
     if(vote>=8){ 
     return 'green';
     }
     if(vote>=5){
         return 'orange';
     }
     else{
         return 'red';
     }
  }

 form.addEventListener('submit',(e)=>{
     e.preventDefault();
     const searchTrm=search.value;
     selectedGenre=[];
     setGenre()
     highlightSelection();
    if(searchTrm){
        getMovies(SEARCH_URL+'&query='+searchTrm)
    }
 })
//----------------------------------------pagination click listener--------------------------------------
prev.addEventListener('click', ()=>{
    if(previouspage>0){
       pagecall(previouspage) ;
    }
})
next.addEventListener('click', ()=>{
    if(nextPage <= totalPages){
       pagecall(nextpage) ;
    }
})
function pagecall(page){
      let urlsplit=lasturl.split('?');
      let queryparams=urlsplit[1].split('&');
      let key=queryparams[queryparams.length-1].split('=');
      if(key[0] != 'page'){
          let url=lasturl+ '&page=' + page;
          getMovies(url);
      }else{
          key[1]=page.toString();
          let a=key.join('=');
          queryparams[queryparams.length-1]=a;
          let b =queryparams.join('&');
          let url=urlsplit[0] +'?'+b;
          getMovies(url)
      }
}