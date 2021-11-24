import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  // if we want to delete a comment, then we need the commentId, else if we want to delete a post, then we need the postId and callback
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  // we're going to make it so that this can delete a post and a comment as well. in order to do this, we'll make the mutation dynamic
  // instead of const [deletePost] = useMutation(DELETE_POST_MUTATION), we'll just say useMutation(mutation) to make it dynamic
  const [deletePostOrMutation] = useMutation(mutation, {
    // we want a model to appear whenever a user clicks the delete button because we don't want the user to accidentally delete a post
    // and it's immediately gone, we'll ask them again "are you sure"
    update(proxy) {
      // once we hit the update, that means the post has been deleted successfully and we want to close the model
      setConfirmOpen(false);
      // if we don't have the commentId, then we're deleting a post, which will execute the code below
      if (!commentId) {
        // this won't disappear from out front end because we're not removing it from the cache, but we can do that later
        // TODO: remove the post from the cache so the change is reflected on the front end without us having to fetch the post again
        // we need proxy to do this
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        // we want to keep all posts that don't have the same postId as the p.id that we just deleted
        // instead of writing it like this : data.getPosts = data.getPosts.filter(p => p.id !== postId);
        //                                   proxy.writeQuery({ query: FETCH_POSTS_QUERY, data});
        // write it like this : data: { getPosts: data.getPosts.filter(p => p.id !== postId)}
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: data.getPosts.filter((p) => p.id !== postId) },
        });
      }

      // once the post is deleted, we need to call the callback
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    // JSX expressions must have on parent element, so below we can just wrap everything in a fragment with <> </>
    <>
      <MyPopup
        content={commentId ? "Delete comment" : "Delete post"}
      >
        <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
      </MyPopup>
      {/* there's Confirm documentation for further understanding, onCancel is if the user says "no, don't delete the post", onConfirm is when the user says "yes, delete post" */}
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}
// write the post delete mutation
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
