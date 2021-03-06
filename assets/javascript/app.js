$(document).ready(function(){
    //test the api call
    //build api call
    //the url is the base url needed to access giphy api (this is global and not to be selected by user)
    var url = "https://api.giphy.com/v1/gifs/search?";
    //the api key is unique to my app; Giftastic (this is global and not to be selected by the user)
    var apiKey = "api_key=G1kFHGB32srmgFFlZw45yLkE1H0HFmuy";
    //will be bound to the data-name attribute of the clicked button
    var searchTerm;
    //the other global parameters that will be selectable by the user
    var _limit;
    var _rating;
    var _language;
    //make a search bar (input)
    //var searchBar = $("<input>").attr({type:"text",placeholder:"search for gifs",name:"gif-search-box",id:"search-box"}).addClass("col-sm-6");
    //$("#search-spot").append(searchBar);

    //make an array to hold the topics ('strings') to be passed to the ajax queryURL
    var topics = ["cats","puppies","sponge bob","coffe","sloth","adventure time"];

    //make the function to render buttons from the items in the topics array
    function renderButtons () {
        //Don't forget to delete the gif buttons before adding new buttons or there will be repeated buttons
        $("#button-spot").empty();
        // Now loop through the topics and generate the buttons that will make the ajax calls
        for(let i =0; i < topics.length; i++){
            var gifButton = $("<button>").attr("data-name", topics[i]).addClass("gif-button").text(topics[i]);
            $("#button-spot").append(gifButton);
        }
    }

    //function to grab user input and add it as a topic in the topics array when user clicks the add gif button
    //the user can press enter or they will click the `add gif category` button
    $("#add-gif").on("click",function(){
        //remeber to add the event.preventDefault() function to prevent the form from trying to submit itself
        event.preventDefault();
        //make a variable called topic to bind to the user input value and then trim() the extra whitespace from the
        //start and end of the inputed string
        var topic = $("#search-box").val().trim();
        //push the value to the topics array
        topics.push(topic);
        //call the functon to create the new gif button and add it to the button spot
        renderButtons();
        //clear the input box again
    });
    

    //make an onclick event for the class of .gif-button that will bind the api query parameters to the queryURL
    //to the data-name value of the clicked button
    $(document).on("click",".gif-button", function(){
        //grab the attribute of `this` (the clicked button) event and reasign global variable searchTerm
        searchTerm = $(this).attr("data-name");
        console.log(searchTerm);
        $("#about-box").hide();
        //now call the ajax and pass the searchTerm to it
        //the ajax should be able to acsses searchTerm since it is nested in the button click
        //later make it so that globaly defined variables are set as the parameters of the ajax call (the global variables are bound to user input)
        ajaxCall();
    }); 


    //function to call the ajax with parameters
    //user must choose the search term; optionally user may choose the limit, rating, and language, however they have defaults
    function ajaxCall (limit = "25", rating = "G", language = "en") {
        //make the jquery ajax call to the giphy api
        var queryURL = url + apiKey + "&q=" + searchTerm + "&limit" + limit +
        "&offset=0&rating=" + rating + "&lang=" + language;

        $.ajax({
            url: queryURL,
            method:"GET"
        }).then(function(response){
            //this pulls 25 records on the parameters
            console.log('======================== Response Data ========================');
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
                var gifHolder = $("<div>").addClass("col-sm").attr("id","gif-holder");
                //make a variable to hold the basic dig into the api object(less code to type on each following variable)
                var pull = response.data[i];
                //pull the title
                var gTitle = $("<h6>").text(pull.title);
                //pull the rating of the gif
                var gRating = pull.rating;
                gTitle.append(" (rated: " + gRating + ")");
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
                $(gifHolder).append(gTitle).append(gif);
                //put the column into the row #display
                $("#display").prepend(gifHolder);

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
    }//end ajaxCall function

    //call render buttons from the start so the initial buttons are there
    renderButtons();

});//end document ready function