import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { signIn } from 'next-auth/client';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

const AccessDenied: React.FC<{ children?: never }> = (_props) => {
  return (
    <>
      <h1>Access Denied</h1>
      <p>
        <a
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}>
          You must be signed in to view this page
        </a>
      </p>
    </>
  );
};

export default function Page() {
  const [session, loading] = useSession();
  const [content, setContent] = useState();

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/examples/protected');
      const json = await res.json();
      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
  }, [session]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  // If session exists, display content
  return (
    <Layout>
      <h1>Protected Page</h1>
      <p>
        <strong>{content || '\u00a0'}</strong>
      </p>
    </Layout>
  );
}
