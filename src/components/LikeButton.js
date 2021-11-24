// This like button needs to know the number of likes, so that it shows it, and it needs to know who liked this post, so it can determine whether
// the logged in user has liked this post already or not, and it needs to know the id of posts, so it knows what post to look at
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";

import MyPopup from "../util/MyPopup";

function LikeButton({ user, post: { id, likes, likeCount } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // lets find a like where the like.username equals the user.username, meaning if any of likes on this post has a username or this user,
    // that means the user that is logged in as has liked this post
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
    // below we'll give it a dependency array of user
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    errorPolicy: "ignore",
  });

  const likeButton = user ? (
    liked ? (
      // the button will be filled with the color olive when the user clicks on it
      <Button color="olive">
        <Icon name="heart" />
      </Button>
    ) : (
      // we put color='olive' basic so that the button isn't highlighted, we'll make it so that when the user clicks on the button, then it will highlight it
      <Button color="olive" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    // if the user isn't logged in and tried to like a post, then it will Link to the login page, so the user can log in
    <Button as={Link} to={`/login`} color="olive" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <MyPopup content={liked ? "Unlike" : "Like"}>
      <Button as="div" labelPosition="right" onClick={likePost}>
        {likeButton}
        <Label basic color="olive" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      # the LIKE_POST_MUTATION is updating the cache without us having to say proxy.writeQuery like in PostForm.js because in our mutation we are specifying the
      # id of the post that we're getting back, so we're getting back a resource of Type post, and Apollo is smart enough to know that it should update the post
      # that we have with that id and any of the fields that we have received, so it does it automatically
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
