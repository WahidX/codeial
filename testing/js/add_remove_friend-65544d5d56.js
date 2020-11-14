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
                    
                        new Noty({
                            theme: 'relax',
                            text: "Friend added!",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1000
                        }).show();

                    }
                    else{
                        
                        addRemoveBtn.attr('class', 'non-friend');
                        addRemoveBtn.html("Add friend");

                        new Noty({
                            theme: 'relax',
                            text: "Friend Removed!",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1000
                        }).show();
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