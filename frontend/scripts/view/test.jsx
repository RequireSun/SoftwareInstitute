define(['react'], function (React) {
    var CommentList = React.createClass({
        render: function () {
            return (
                <div className="commentList">
                    Hello, World! I am a CommentList.
                </div>
            );
        }
    });

    var CommentForm = React.createClass({
        render: function () {
            return (
                <div className="commentForm">
                    Hello, World! I am a CommentForm.
                </div>
            );
        }
    });

    var CommentBox = React.createClass({
        render: function () {
            return (
                <div className="contentBox">
                    <h1>Comments</h1>
                    <CommentList />
                    <CommentForm />
                </div>
            );
        }
    });

    return CommentBox;
});