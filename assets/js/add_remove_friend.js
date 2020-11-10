{
    let addRemoveFriend = function(){

        let addRemoveBtn = $('#add-friend');
        addRemoveBtn.on("click", function(e){
            e.preventDefault();
            
            // Ajax call to friendship req
            $.ajax({
                type: 'POST',
                url: $(addRemoveBtn).attr('href'),
                success: function(data){
                    console.log(data);
                    if (data.data.friend === true){
                        addRemoveBtn.attr('class', 'friend');
                        addRemoveBtn.html("Remove friend");
                    }
                    else{
                        addRemoveBtn.attr('class', 'non-friend');
                        addRemoveBtn.html("Add friend");
                    }
                },
                error: function(err){
                    console.log("Err: ", err);
                }
            });


        });
    };

    addRemoveFriend();
}