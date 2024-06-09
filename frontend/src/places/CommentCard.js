import React, { useContext } from "react";
import { CurrentUser } from "../contexts/CurrentUser";

function CommentCard({ comment, onDelete }) {
    const { currentUser } = useContext(CurrentUser);

    const renderDeleteButton = () => {
        if (currentUser?.userId === comment.authorId) {
            return (
                <button className="btn btn-danger" onClick={onDelete}>
                    Delete Comment
                </button>
            );
        }
        return null;
    };

    return (
        <div className="border col-sm-4">
            <h2 className="rant">{comment.rant ? 'Rant! 😡' : 'Rave! 😄'}</h2>
            {comment.author ? (
                <p><strong>- {comment.author.firstName} {comment.author.lastName}</strong></p>
            ) : (
                <p><strong>- Unknown User</strong></p>
            )}
            <p>Rating: {comment.stars}</p>
            {renderDeleteButton()}
        </div>
    );
}

export default CommentCard;
