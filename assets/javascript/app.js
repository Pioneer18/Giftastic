$(document).ready(function(){
    //test the api call
    //build api call
    //the url is the base url needed to access giphy api
    var url = "http://api.giphy.com/v1/gifs/search?";
    //the api key is unique to my app; Giftastic
    var apiKey = "api_key=G1kFHGB32srmgFFlZw45yLkE1H0HFmuy";
    //the search term should be a variable bound to the user input
    var searchTerm = "dogs";
    //the number of records  the api will bring back
    var limit = "25"
    //rating parameter filters the gifs by rating; keep it G
    var rating = "G";
    //incase someone wants to change the language
    var language = "en";

    //now assemble the above parameters into a single query url
    var queryURL = url + apiKey + "&q=" + searchTerm + "&limit" + limit +
    "&offset=0&rating=" + rating + "&lang=" + language;

    //make the jquery ajax call to the giphy api
    $.ajax({
        url: queryURL,
        method:"GET"
    }).then(function(response){
        //this pulls 25 records on the parameters
        console.log(response.data);
        // 1) extract; response.data.(title,rating,fixed_width_still,fixed_width(animated version))
        // 2) build a col with a fixed width of 200 pixels and gutter of 20px, to make 20px between each gif
        //this will generate 2 gifs per line on the smallest window size of 576 given the aside will be atleast 100px
        //on larger sizes more gifs will fit per line. The gifs are rendered in a single hardcoded row of responsive width and will
        //auto wrap to a new line as the surpas their aloted width out of the 12 max
        //-----------------------------------------------------------------------------------------------//
        //pull the data; start by looping all the gifs; a <div class="col"> will be constructed for each gif
        for(var i = 0; i < response.data.length; i++){
            //pull the title
        var gTitle = response.data[i].title;
        console.log(gTitle);
        }
       
        
    });



});