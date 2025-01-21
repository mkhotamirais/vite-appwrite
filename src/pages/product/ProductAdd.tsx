import { useState } from "react";
import Layout from "../../components/Layout";
import { toast } from "sonner";
import { collProductBucketId, collProductId, databases, dbId, storage, uniqueId } from "../../config";
import { useNavigate } from "react-router";

export default function ProductAdd() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price) {
      toast.warning("Please fill all required fields!");
      return;
    }

    const numPrice = Number(price);

    if (isNaN(numPrice) || numPrice <= 0) {
      toast.warning("Price must be a valid number!");
      return;
    }

    setPending(true);

    const safeData = (imageId?: string) => {
      databases
        .createDocument(dbId, collProductId, uniqueId(), { name, price: numPrice, imageId })
        .then(() => {
          toast.success("Proudct created successfully");
          navigate("/product");
          setName("");
          setPrice("");
          setImage(null);
          setPreview(null);
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => setPending(false));
    };

    if (image) {
      storage.createFile(collProductBucketId, uniqueId(), image).then((res) => {
        safeData(res?.$id);
      });
    } else {
      safeData();
    }
  };

  return (
    <Layout>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name">name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border py-2 px-3 w-full rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price">price</label>
          <input
            type="string"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border py-2 px-3 w-full rounded-lg"
            disabled={pending}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChangeFile}
            className="border py-2 px-3 w-full rounded"
            disabled={pending}
          />
        </div>
        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="w-32 h-32 rounded-lg object-center object-cover" />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
              className="text-red-500 hover:underline"
              disabled={pending}
            >
              delete
            </button>
          </div>
        )}
        <button type="submit" disabled={pending} className="btn">
          Add Product
        </button>
      </form>
    </Layout>
  );
}
