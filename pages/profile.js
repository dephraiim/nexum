import request, { gql } from "graphql-request";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "../components/Layout";
import Post from "../components/Post";
import WithAuth from "../lib/WithAuth";

export default function ProfilePage(props) {
  const { data: session, status } = useSession();

  return (
    <WithAuth>
      <Layout>
        <div>
          <h1>Profile Page</h1>
          {status === "loading" ? (
            <div>Loading Skeleton</div>
          ) : (
            <div className="profile-card">
              <Image src={session.user.image} width="80" height="80" />
              <div>
                <h2>{session.user.name}</h2>
                <p>{session.user.email}</p>
              </div>
            </div>
          )}
        </div>

        <h1>My Posts</h1>
        {props.posts.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} />
          </div>
        ))}
      </Layout>
    </WithAuth>
  );
}

export async function getServerSideProps({ req, res }) {
  const query = gql`
    {
      posts {
        content
        published
        id
        title
        author {
          name
          email
          id
        }
      }
    }
  `;

  const data = await request("http://localhost:3000/api/graphql", query);

  return {
    props: data,
  };
}
