import React, { useContext } from "react";
import { Button, Card, Icon, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

import MyPopup from "../util/MyPopup";

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  // here we'll destructure our user
  const { user } = useContext(AuthContext);
  // function likePost() {
  //   console.log("Like Post!!!!");
  // }
  // function commentOnPost(){
  //     console.log("Comment on Post!!!!")
  // }
  return (
    //   fluid allows them to take more space, which looks nicer on the front end
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        {/* if you want to remove the ago in "2 hours ago" then make it .fronNow(true) 'cause right now it's defaulted to false */}
        {/* we can make the timestamp a link to the post itself by make ing the Card.Meta as={Link} to={`/posts/${id of the post}}` */}
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        {/* we can pass the LikeButton the entire post, but it's unnecessary, we just need to pass it in id, likes, likeCount.
            also, we're going to prop drill the user, and using the user object, we're going to determine if the user already liked this or not */}
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <MyPopup content="Comment on post">
          {/* when you click on the comment button below, then it should link to the post id, so it would be localhost:3000/posts/6197a7907df5e3ff99124910 */}
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            {/* we put color='olive' basic so that the button isn't highlighted, we'll make it so that when the user clicks on the button, then it will highlight it */}
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {/* if we have a user, which means we're logged in, and user.username is equal to username of the posts, that means it's the owner and they should be able to delete it */}
        {/* DeleteButton needs to access the postId */}
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
