import { useState } from "react";
import Layout from "../../components/Layout";
import { collBookId, databases, dbId, uniqueId } from "../../config";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function BookAdd() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    databases
      .createDocument(dbId, collBookId, uniqueId(), { title, author })
      .then(() => {
        toast.success("Book added");
        navigate("/book");
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setPending(false));
  };

  return (
    <Layout>
      <h1>Add Book</h1>
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
          Add Book
        </button>
      </form>
    </Layout>
  );
}
