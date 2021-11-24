import React, { useContext, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Grid,
  Image,
  Icon,
  Label,
  Form,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import MyPopup from "../util/MyPopup";

function SinglePost() {
  const navigate = useNavigate();
  let { postId } = useParams();
  console.log(postId);
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);
  // the original state of the comment is just an empty string
  const [comment, setComment] = useState("");

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      // we'll set the comment back to an empty string
      setComment("");
      // this will blur the comment input field once the form has been submitted, so it won't focus on the comment input field anymore
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    // instead of using props.history.push('/') use navigate('/') instead especially for react v6
    navigate("/");
  }

  //create markup here and see what we need
  // this will be conditional since it's dependent on whether we have the data from query or not yet
  let postMarkup;
  // if not getPost because we might still be loading
  if (!getPost) {
    // can put a spinner if to indicate loading, but for now it's just a paragraph saying loading post..
    postMarkup = <p>Loading post..</p>;
  } else {
    // else we need to get all the fields from the post
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            {/* we'll give the Card the property of fluid so it takes up the entire width */}
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                {/* we need to import moment to format the time to "2 hours ago" or "1 day ago" */}
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                {/* we need to import the authContext for the likeButton when we're passing in our user */}
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log("comment on post")}
                  >
                    <Button basic color="olive">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="olive" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {/* if user and user.username equals the username of the post and...  */}
                {user && user.username === username && (
                  // when we delete our post, it successfully deletes it and when we go back to the homepage, it shows that it was deleted, but what we should do instead
                  // of manually going back to the homepage is by passing a callback to the delete button to automatically do it for us
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                {/* put in card content so that it has padding and looks better */}
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      {/* disabled={comment.trim() === ""} means that if there's nothing in the input field, then don't allow the user to submit, this way we don't have to deal with
                      validating an empty comment */}
                      <Button
                        type="submit"
                        className="ui button olive"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {/* we can have comments in a component of their own, but it's unnecessary for an application this small */}
            {comments.map((comment) => (
              // for each comment we'll return the following
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  {/* we'll have the card meta to indicate when it was posted */}
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  # what we're passing in
  mutation ($postId: ID!, $body: String!) {
    # what we're passing in
    createComment(postId: $postId, body: $body) {
      # what we're getting back
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
