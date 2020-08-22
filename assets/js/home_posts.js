{
    let createPost = function(){
        let postForm = $('#new-post-form');
        postForm.submit(function(e){
            e.preventDefault();
            
            $.ajax({
                type: 'POST',
                url: '/post/create',
                data: postForm.serialize(),
                success: function(data){
                    console.log(data.data);
                    let newDomItem = newPostDom(data.data.post);
                    $('#post-container').prepend(newDomItem);
                    deletePost($('.post-delete', newDomItem));
                },
                error: function(err){
                    console.log(err.responseText);
                }
            });
        });
    };

    // function to generate DOM for new post
    let newPostDom = function(post){
        return (`
        <div id="${ post._id }" class="post-item">
            ${ post.user.name }
            <br>
            <small> ${ post.content } </small>

            <a class="post-delete" href="post/destroy/${ post._id }">Delete</a>
            
            <div class="comment-container">
                <form action="/comment/create" method="POST" name="new-comment-form">
                    <input type="text" name="content" placeholder="Enter your comment here" required>
                    <input type="hidden" name="post" value="${ post._id }">
                    <input type="submit" value="Add comment">
                </form>
                
            </div>

        </div>
        `)
    }


    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.post._id}`).remove();
                },
                error: function(err){
                    console.log('Err: ',err);
                }
            })
        })
    }


    createPost();

}