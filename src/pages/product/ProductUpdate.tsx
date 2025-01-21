import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { toast } from "sonner";
import { collProductBucketId, collProductId, databases, dbId, storage, uniqueId } from "../../config";
import { useNavigate, useParams } from "react-router";
import Loading from "../../components/Loading";

export default function ProductAdd() {
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [pendingData, setPendingData] = useState(false);
  const [oldImageId, setOldImageId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setPendingData(true);
    databases
      .getDocument(dbId, collProductId, id)
      .then((res) => {
        setName(res.name);
        setPrice(res.price);
        if (res.imageId) {
          const imageUrl = storage.getFilePreview(collProductBucketId, res.imageId);
          setPreview(imageUrl);
          setOldImageId(res.imageId);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setPendingData(false));
  }, [id]);

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
      const finalImageId = imageId || oldImageId;
      databases
        .updateDocument(dbId, collProductId, id, { name, price: numPrice, imageId: finalImageId })
        .then(() => {
          toast.success("Proudct updated successfully");
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
      storage
        .createFile(collProductBucketId, uniqueId(), image)
        .then((res) => {
          safeData(res?.$id);
          if (res?.$id && oldImageId) {
            storage.deleteFile(collProductBucketId, oldImageId!);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => setPending(false));
    } else {
      safeData();
    }
  };

  let content = null;
  if (pendingData) {
    content = <Loading />;
  } else {
    content = (
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
          Update Product
        </button>
      </form>
    );
  }

  return (
    <Layout>
      <h1>Update Product</h1>
      {content}
    </Layout>
  );
}
