import { useEffect, useState } from "react";
import { client, collBookId, databases, dbId } from "../../config";
import { IBook } from "../../types";
import Loading from "../../components/Loading";
import Layout from "../../components/Layout";
import DynamicHead from "../../components/DynamicHead";
import { Link } from "react-router";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import BookModalDel from "./BookModalDel";

export default function Book() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [books, setBooks] = useState<IBook[]>([]);

  const [openModalDel, setOpenModalDel] = useState<number | null>(null);

  useEffect(() => {
    setPending(true);

    databases
      .listDocuments(dbId, collBookId)
      .then((res) => {
        setBooks(res.documents as IBook[]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setPending(false));

    // Subscribe to realtime changes
    const unsubscribe = client.subscribe([`databases.${dbId}.collections.${collBookId}.documents`], (response) => {
      const payload = response.payload as { $id: string };
      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.$id !== payload.$id));
        // toast.success("Book deleted successfully");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  let content = null;
  if (pending) {
    content = <Loading />;
  } else if (error) {
    content = <div>{error}</div>;
  } else {
    content = (
      <div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Author</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td className="flex items-center gap-2">
                  <Link to={`/book/update/${item?.$id}`} title="update book" className="text-green-500">
                    <FaPenToSquare />
                  </Link>{" "}
                  |
                  <button type="button" title="delete book" onClick={() => setOpenModalDel(i)} className="text-red-500">
                    <FaTrash />
                  </button>
                  <BookModalDel i={i} book={item} openModalDel={openModalDel} setOpenModalDel={setOpenModalDel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <Layout>
      <DynamicHead title="Product" />

      <h1>Book</h1>
      <Link to="/book/add" className="btn block w-fit mb-2">
        Add Book
      </Link>
      {content}
    </Layout>
  );
}
