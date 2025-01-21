import { useEffect, useState } from "react";
import DynamicHead from "../../components/DynamicHead";
import Layout from "../../components/Layout";
import { IProduct } from "../../types";
import { client, collProductBucketId, collProductId, databases, dbId, storage } from "../../config";
import Loading from "../../components/Loading";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { Link } from "react-router";
import ProductModalDel from "./ProductModalDel";
// import { toast } from "sonner";

export default function Product() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);

  const [openModalDel, setOpenModalDel] = useState<number | null>(null);

  useEffect(() => {
    setPending(true);
    databases
      .listDocuments(dbId, collProductId)
      .then((res) => {
        setProducts(res.documents as IProduct[]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setPending(false));

    // Subscribe to realtime changes
    const unsubscribe = client.subscribe([`databases.${dbId}.collections.${collProductId}.documents`], (response) => {
      const payload = response.payload as { $id: string };
      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
        setProducts((prevBooks) => prevBooks.filter((book) => book.$id !== payload.$id));
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map((item, i) => (
          <div key={i} className="group relative">
            <img
              src={
                item?.imageId
                  ? `${storage.getFilePreview(collProductBucketId, item.imageId)}`
                  : "https://placehold.co/600x400.png"
              }
              alt={item.name || "image alt"}
              width={200}
              height={200}
              className="object-cover object-center h-40 w-full border"
            />
            <h3 className="text-left text-primary capitalize font-semibold mt-2">{item.name}</h3>
            <h4>Rp{item.price}</h4>
            <div className="flex gap-4 mt-4">
              <Link to={`/product/update/${item.$id}`} title="update product" className="text-green-500">
                <FaPenToSquare />
              </Link>
              <button type="button" title="delete product" onClick={() => setOpenModalDel(i)} className="text-red-500">
                <FaTrash />
              </button>
              <ProductModalDel i={i} product={item} openModalDel={openModalDel} setOpenModalDel={setOpenModalDel} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Layout>
      <DynamicHead title="Product" />
      <h1>Product</h1>
      <Link to="/product/add" className="btn block w-fit mb-2">
        Add Product
      </Link>
      {content}
    </Layout>
  );
}
