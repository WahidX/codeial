{let e=function(){let e=$("#new-post-form");e.submit((function(o){o.preventDefault(),$.ajax({type:"POST",url:"/post/create",data:e.serialize(),success:function(e){let o=t(e.data.post);new ToggleLike($(" .toggle-like-button",o)),new Noty({theme:"relax",text:"Comment published!",type:"success",layout:"topRight",timeout:1e3}).show(),$("#post-container").prepend(o),n($(".post-delete",o))},error:function(e){console.log(e.responseText)}})}))},t=function(e){return`\n        <div id="post-${e._id}" class="post-item">\n            ${e.user.name}\n            <br>\n            <small> ${e.content} </small>\n            <br>\n            <div class='item-buttons'>\n            \n                <div class="item-like">\n                    <a class="toggle-like-button" href='/likes/toggle/?id=${e._id}&type=Post' data-likes="post.likes.length">\n                        0 Likes\n                    </a>\n                </div>\n\n                <a class="post-delete" href="post/destroy/${e._id}">Delete</a>\n            \n            </div>\n\n            <div class="comment-container">\n                <form action="/comment/create" method="POST" name="new-comment-form">\n                    <input type="text" name="content" placeholder="Enter your comment here" required>\n                    <input type="hidden" name="post" value="${e._id}">\n                    <input type="submit" value="Add comment">\n                </form>\n                \n            </div>\n\n        </div>\n        `},n=function(e){console.log($(e).prop("href")),console.log(e),$(".post-delete").click((function(t){console.log("clicked"),t.preventDefault(),$.ajax({type:"get",url:$(e).prop("href"),success:function(e){$("#post-"+e.data.post_id).remove()},error:function(e){console.log(e.responseText)}})}))};e()}