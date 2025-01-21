import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { collBookId, databases, dbId } from "../../config";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import Loading from "../../components/Loading";

export default function BookUpdate() {
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pending, setPending] = useState(false);
  const [pendingData, setPendingData] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setPendingData(true);
    databases
      .getDocument(dbId, collBookId, id)
      .then((res) => {
        setTitle(res.title);
        setAuthor(res.author);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setPendingData(false));
  }, [id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    databases
      .updateDocument(dbId, collBookId, id, { title, author })
      .then(() => {
        toast.success("Book updated");
        navigate("/book");
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setPending(false));
  };

  let content = null;
  if (pendingData) {
    content = <Loading />;
  } else {
    content = (
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border py-2 px-3 rounded w-full"
            disabled={pending}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border py-2 px-3 rounded w-full"
            disabled={pending}
          />
        </div>
        <button type="submit" disabled={pending} className="btn">
          Save Book
        </button>
      </form>
    );
  }

  return (
    <Layout>
      <h1>Update Book</h1>
      {content}
    </Layout>
  );
}
