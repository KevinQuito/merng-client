import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  // from the useQuery we get loading and data
  //  FETCH_POST_QUERY basically cannot destructure the data while it is loading, so getPosts is not being recognized.
  //   const { loading, data: { getPosts: posts} } = useQuery(FETCH_POSTS_QUERY);

  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  const posts = !loading ? data.getPosts : null;

  // in one of the Grid.Row we'll check if it's loading because if it is, then we'll add a loading spinner visual
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {/* if user is logged in, then we'll show the form below */}
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          // the getPosts: posts above could be null because the data itself is not populated, so we first need to check if it's truthy
          // posts && posts.map(post => ) will loops through it each post and return
          <Transition.Group>
            {posts &&
              posts.map((post) => (
                // we'll use key={post.id} since that's unique
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
