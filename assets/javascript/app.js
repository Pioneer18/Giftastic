$(document).ready(function(){
    //test the api call
    //build api call
    //the url is the base url needed to access giphy api
    var url = "http://api.giphy.com/v1/gifs/search?";
    //the api key is unique to my app; Giftastic
    var apiKey = "api_key=G1kFHGB32srmgFFlZw45yLkE1H0HFmuy";
    //the search term should be a variable bound to the user input
    var searchTerm = "cat";
    //the number of records  the api will bring back
    var limit = "25"
    //rating parameter filters the gifs by rating; keep it G
    var rating = "G";
    //incase someone wants to change the language
    var language = "en";

    //now assemble the above parameters into a single query url
    var queryURL = url + apiKey + "&q=" + searchTerm + "&limit" + limit +
    "&offset=0&rating=" + rating + "&lang=" + language;

    //make an array to hold the topics ('strings') to be passed to the ajax queryURL
    var topics = ["cats","space","coding","coffe","dogs","sloth","adventure time"];
    //loop through the topics and generate the buttons that will make the ajax calls
    for(let i =0; i < topics.length; i++){
        var x = $("<button>").attr("data-name", topics[i]).addClass("gif-button");
        console.log(x);
    }


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
            //make the column to hold the gif images
            var gifHolder = $("<div>").addClass("col-sm-8");
            //make a variable to hold the basic dig into the api object(less code to type on each following variable)
            var pull = response.data[i];
            //pull the title
            var gTitle = pull.title;
            //pull the rating of the gif
            var gRating = pull.rating;
            //pull the fixed_width_still url of each record (each gif has fixed width of 200px yet varying heights)
            var gStill = pull.images.fixed_width_still.url;
            //pull the animated version
            var gAnimated = pull.images.fixed_width.url;
            //now build the col with the pulled content
            //lock col width and padding down to 220px + 20px padding 
            //make an img tag with src= to the gif url and .gif to be target by an onclick function
            //need to add a preFACE url so that the like loads from giphy and not my local index file
            var gif = $("<img>").attr("src", gStill).attr("data-animated",gAnimated).attr("data-still",gStill).attr("data-state","still").addClass("gif");
            //put the gif into the column
            $(gifHolder).append(gif);
            //put the column into the row #display
            $("#display").append(gifHolder);

        }//end loop through records

         //build an onclick selector to make the gifs animate or stop when clicked on
        $(".gif").on("click",function () {
            //grab the current data-state of the gif(this is the key to switching the state)
            var state = $(this).attr("data-state");
            console.log(state);
            //if the state is still then switch the src to data-animated, if it is animated src = data-still
            if(state === "still"){
                //bind the gifs animated link to a variable
                $(this).attr("src",$(this).attr("data-animated"));
                //update the state to animated so it can be stopped next clicks
                $(this).attr("data-state", "animated")
            }
            else{
                //display the still gif
                $(this).attr("src",$(this).attr("data-still"));
                //update the state to animated so it can be animated on next click
                $(this).attr("data-state", "still");
            }
    
        });//end .gif animate / stop function

    });//end ajax query

});//end document ready function