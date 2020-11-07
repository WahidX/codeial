{
    let createComment = function(){
        let commentForm = $('#new-comment-form');
        commentForm.submit(function(e){
            e.preventDefault();
            
            $.ajax({
                type: 'POST',
                url: '/comment/create',
                data: commentForm.serialize(),
                success: function(data){
                    console.log("To send: ", data.data);
                    let newDomItem = newCommentDom(data.data.comment);
                    $('#comment-container').prepend(newDomItem);
                    deleteComment($('.comment-delete', newDomItem));
                },
                error: function(err){
                    console.log("Err: ",err.responseText);
                }
            });
        });
    };

    // function to generate DOM for new comment
    let newCommentDom = function(comment){
        return (
            `<div id="comment-${ comment._id }" class="comment-item">
                <div class="comment-content">
                    ${comment.user.name}
                    <br>
                    <small> ${ comment.content } </small>

                    <div class='item-buttons'>
                        
                        <div class="item-like">
                            <a href='/likes/toggle/?id=${ comment._id }&type=Comment' data-likes="${ comment.likes.length }">
                                0 Likes
                            </a>
                        </div>
                        
                        <a class="comment-delete" href="comment/destroy/${ comment._id }">Delete</a>
                                
                    </div>
                </div>
            </div>`
            )
        };



    let deleteComment = function(deleteLink){
        console.log($(deleteLink).prop('href'));
        console.log(deleteLink);
        
        // deteteLink was not working
        $(".comment-delete").click(function(e){
            
            console.log("clicked");
            e.preventDefault();
        
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                },
                error: function(err){
                    console.log(err.responseText);
                }
            });
        });
    }


    createComment();

}