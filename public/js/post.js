function Post() {
    function bindEvent() {
        $(".post_update").click(function(e) {
            var params = {
                id: $(".post_id").val(),
                title: $(".post_title").val(),
                content: $(".post_content").val()
            };
            // content: tinymce.get("content").getContent(), nếu dùng thư viện tynymce

            var base_url = location.protocol + "//" + document.domain + ":" + location.port;

            $.ajax({
                url: base_url + "/admin/post/edit",
                type: "PUT",
                data: params,
                dataType: "json",
                success: function(res) {
                    if(res && res.status_code == 200) {
                        location.reload();
                    }
                }
            })
        });
        $(".create_post").click(function(e) {
            var params = {
                title: $(".post_title").val(),
                content: $(".post_content").val()
            };

            var base_url = location.protocol + "//" + document.domain + ":" + location.port;

            $.ajax({
                url: base_url + "/admin/post/add",
                type: "POST",
                data: params,
                dataType: "json",
                success: function(res) {
                    if(res && res.status_code == 200) {
                        location.reload();
                    }
                }
            })
        });
        $(".post_delete").click(function(e) {
            var post_id = $(this).attr("post_id");
            var base_url = location.protocol + "//" + document.domain + ":" + location.port;

            $.ajax({
                url: base_url + "/admin/post/delete",
                type: "DELETE",
                data: {id : post_id},
                dataType: "json",
                success: function(res) {
                    if(res && res.status_code == 200) {
                        location.reload();
                    }
                }
            })
        })
    }

    bindEvent();
}

$(document).ready(function(){
    new Post();
});